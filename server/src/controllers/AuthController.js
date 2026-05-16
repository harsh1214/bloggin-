import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/GenerateToken.js";

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

export { register, login, logout, me };