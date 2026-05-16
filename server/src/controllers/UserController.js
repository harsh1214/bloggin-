import { prisma } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";
import streamUpload from "../services/UploadService.js";

const getPublicId = (url) => {
    if (!url) {
        return null
    }
    const parts = url.split("/")
    const uploadIndex = parts.findIndex((part) => part === "upload")
    const publicIdParts = parts.slice(uploadIndex + 2)
    const publicId = publicIdParts.join("/").split(".")[0]
    return publicId
}

const updateUser = async (req, res) => {
    try {

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { name, email, password, oldPassword, removeImage } = req.body;
        const data = {};
        if (name && name.trim()) {
            data.name = name.trim();
        }

        if (email && email.trim()) {
            const existingUser = await prisma.user.findFirst({ where: { email, NOT: { id: req.user.id } } });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            data.email = email.trim();
        }

        if (password) {
            if (!oldPassword) {
                return res.status(400).json({ error: "Current password required" });
            }

            const correctPassword = await bcrypt.compare(oldPassword, user.password);
            if (!correctPassword) {
                return res.status(400).json({ error: "Current password incorrect" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            data.password = hashedPassword;
        }

        let profileImage = user.image;

        if (removeImage === "true") {
            if (profileImage) {
                const publicId = getPublicId(profileImage);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }
            profileImage = null;
        }

        if (req.file) {
            if (profileImage) {
                const publicId = getPublicId(profileImage);
                console.log("Public ID: ", publicId);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            const uploaded = await streamUpload(req.file.buffer, "blogs/user/profile");
            profileImage = uploaded.secure_url;
        }

        data.image = profileImage;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        });

        return res.status(200).json({ success: true, data: updatedUser });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			include: { blogs: true },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		for (const blog of user.blogs) {
			if (blog.image) {
				const publicId = getPublicId(blog.image);
				if (publicId) {
					await cloudinary.uploader.destroy(publicId);
				}
			}
		}

		if (user.image) {
			const publicId = getPublicId(user.image);
			if (publicId) {
				await cloudinary.uploader.destroy(publicId);
			}
		}

		const blogIds = user.blogs.map((blog) => blog.id);

		if (blogIds.length) {
			await prisma.like.deleteMany({ where: { blogId: { in: blogIds, } } });
			await prisma.blogCategory.deleteMany({ where: { blogId: { in: blogIds } } });
		}

		await prisma.like.deleteMany({ where: { userId: req.user.id } });
		await prisma.blogs.deleteMany({ where: { userId: req.user.id } });
		await prisma.user.delete({ where: { id: req.user.id } });

		return res.status(200).json({ success: true });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

export { deleteUser, updateUser, getPublicId };