import { prisma } from "../config/db.js";
import { generateToken } from "../utils/GenerateToken.js";
import { sendMail } from "../utils/sendMail.js";
import { createHash } from "crypto";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const userExist = await prisma.user.findUnique({ where: { email } });
    if (userExist) {
        return res.status(400).json({
            error: "User already exists with this email"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed_password
        }
    });

    const token = generateToken(user.id, res);

    return res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email
            },
            token,
        }
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!password || !email) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }
    const userExist = await prisma.user.findUnique({
        where: {
            email
        },
    });
    if (!userExist) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    const visiblePostsCount = await prisma.blogs.count({
        where: {
            userId: userExist.id,
            isHidden: false
        }
    });

    const token = generateToken(userExist.id, res);

    return res.status(201).json({
        status: "success",
        data: {
            user: {
                id: userExist.id,
                email: email,
                name: userExist.name,
                blogsCount: visiblePostsCount,
                image: userExist.image
            },
            token,
        }
    });
}

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).json({ status: "success", message: "Successfully logged out" });
}

const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const blogsCount = await prisma.blogs.count({
            where: {
                userId: user.id,
                isHidden: false
            }
        });

        return res.json({
            id: req.user.id,
            email: req.user.email,
            name: user.name,
            image: user.image || null,
            blogsCount
        });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = createHash("sha256").update(otp).digest("hex");

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetOtp: hashedOtp,
                resetOtpExpiry: new Date(Date.now() + 10 * 60 * 1000)
            }
        });

        await sendMail(email, "Password Reset OTP", `Your OTP for password reset is ${otp}`);
        return res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Server error" });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const hashedOtp = createHash("sha256").update(otp).digest("hex");
        if (user.resetOtp !== hashedOtp || !user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await prisma.user.update({ 
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetOtp: null,
                resetOtpExpiry: null
            }
        });

        return res.status(200).json({ success: true });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Server Error" });
    }

}

export { register, login, logout, me, forgotPassword, resetPassword };