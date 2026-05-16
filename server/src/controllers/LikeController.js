import { prisma } from "../config/db.js";

const toggleLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const { blogId } = req.body;
        if (!blogId){
            return res.status(400).json({ error: "Blog id is required" });
        }
        const existingLike = await prisma.like.findUnique({ where: { userId_blogId: { userId, blogId } } });
        if (existingLike){
            await prisma.like.delete({ where: { userId_blogId: { userId, blogId } } });
            return res.status(200).json({ status: "success", data: { isLiked: false } });
        }
        else{
            await prisma.like.create({ data: { userId, blogId } });
            return res.status(200).json({ status: "success", data: { isLiked: true } });
        }
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

export { toggleLike };