import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRkNDlhN2MzLTQ3ZGEtNGJiOC1hMjVmLWVkNGY1N2Q2MTdmZiIsImlhdCI6MTc3NzM2OTcxMSwiZXhwIjoxNzc3OTc0NTExfQ.Ed7k73TtGzNuoAQ6Qqw3J6Ikqx3msbslyyIJ56YdfgU
export const AuthMiddleware = async (req, res, next) => {
    let token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user){
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}