

const getUserDetail = async (req, res) => {
    try {
        if (!user.query){
            return res.status(404).json({ error: "User not found" });
        }

        const { id } = req.query;
        const user = await prisma.user.findUnique({
            where: {
                id : id
            }
        });

        return res.status(200).json({ status: "success", data: user });
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

export { getUserDetail }