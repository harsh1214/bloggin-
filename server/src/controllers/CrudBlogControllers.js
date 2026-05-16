import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
import streamUpload from "../services/UploadService.js";

const getBlog = async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Blog id is required" });
    }
    const blog = await prisma.blogs.findUnique({
        where: {
            id: id
        },
        include: {
            user: true,
            categories: {
                include: {
                    category: true
                }
            },
            _count: {
                select: {
                    likes: true
                }
            },
            likes: {
                where: { userId: req.user?.id || "" },
                select: { id: true }
            }
        }
    });
    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }
    const isLiked = blog.likes?.length > 0;
    const formattedBlog = { ...blog, isLiked };
    return res.status(200).json({ status: "success", data: formattedBlog });
};


const createBlog = async (req, res) => {
    try {

        const { title, content, categories } = req.body;
        if (!title || !content || !categories) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const parsedCategories = JSON.parse(categories)
        if (parsedCategories.length === 0) {
            return res.status(400).json({ error: "At least one category required" })
        }
        const foundCategories = await prisma.category.findMany({ where: { name: { in: parsedCategories } } });

        const isHidden = req.body.isHidden === "true";

        const plainText = content.replace(/<[^>]+>/g, " ")
        if (!plainText) {
            return res.status(400).json({ error: "Content is required" })
        }
        const excerpt = plainText.split(/\s+/).slice(0, 65).join(" ")

        let bannerUrl = "";

        if (req.file) {
            const uploaded = await streamUpload(req.file.buffer, "blogs/banners");
            bannerUrl = uploaded.secure_url;
        }


        const blog = await prisma.blogs.create({
            data: {
                title,
                content,
                excerpt,
                image: bannerUrl,
                isHidden,
                userId: req.user.id,
                categories: {
                    create: foundCategories.map((cat) => ({
                        category: {
                            connect: { id: cat.id }
                        }
                    }))
                }
            },
            include: {
                categories: {
                    include: { category: true }
                }
            }
        });
        return res.status(201).json({ status: "success", data: blog });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, categories } = req.body;
        const isHidden = req.body.isHidden === "true";

        const blog = await prisma.blogs.findFirst({ where: { id, userId: req.user.id } });

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        let bannerUrl = blog.image
        const removeBanner = req.body.removeBanner === "true"
        if (removeBanner) {
            bannerUrl = null
        }
        if (req.file) {
            const uploaded = await streamUpload(req.file.buffer, "blogs/banners");
            bannerUrl = uploaded.secure_url;
        }

        const parsedCategories = JSON.parse(categories);
        const foundCategories = await prisma.category.findMany({
            where: {
                name: {
                    in:
                        parsedCategories,
                },
            },
        });

        await prisma.blogCategory.deleteMany({
            where: {
                blogId: id,
            },
        });

        const updatedBlog = await prisma.blogs.update({
            where: { id, },
            data: {
                title,
                content,
                image: bannerUrl,
                isHidden,
                categories: {
                    create:
                        foundCategories.map(
                            (cat) => ({
                                category: {
                                    connect: {
                                        id:
                                            cat.id,
                                    },
                                },
                            })
                        ),
                },
            },
            include: {
                categories: {
                    include: {
                        category:
                            true,
                    },
                },
            },
        });

        return res.status(200).json({ success: true, data: updatedBlog });
    }
    catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const uploadEditorImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No image uploaded" })
        }

        const uploaded = await streamUpload(req.file.buffer, "blogs/editor")
        return res.status(200).json({ success: true, url: uploaded.secure_url })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error: "Image upload failed" })
    }
}

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

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params

        const blog = await prisma.blogs.findFirst({ where: { id, userId: req.user.id } })
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" })
        }

        if (blog.image) {
            const publicId = getPublicId(blog.image);
            if (publicId) {
                const result = await cloudinary.uploader.destroy(publicId)
                console.log(result)
            }
        }

        await prisma.blogCategory.deleteMany({ where: { blogId: id, } })
        await prisma.blogs.delete({ where: { id } })
        return res.status(200).json({ success: true, message: "Blog deleted successfully" })
    }
    catch (err) {
        return res.status(500).json({ error: `Internal Server Error: ${err}` })
    }
}

export { getBlog, createBlog, uploadEditorImage, updateBlog, deleteBlog };