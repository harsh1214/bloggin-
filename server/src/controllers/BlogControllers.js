import { prisma } from "../config/db.js";

const blogs = async (req, res) => {
    try {
        const { page = 1, search = "", author = "", sort = "views", order = "desc", category = "" } = req.query;
        const limit = 5;
        const skip = (page - 1) * limit;
        const categories = category ? category.split(",") : [];
        const where = {
            isHidden: false,
            AND: [
                search ? { title: { contains: search, mode: "insensitive" } } : {},
                author ? { user: { name: { contains: author, mode: "insensitive" } } } : {},
                categories.length ? { categories: { some: { category: { name: { in: categories } } } } } : {}
            ]
        };
        // const orderBy = sort === "views" ? { views: "desc" } : { updatedAt: "desc" };
        const orderBy = sort === "likes" ? { likes: { _count: order } } : { [sort === "latest" ? "createdAt" : "views"]: order };

        const [blogs, total] = await Promise.all([
            prisma.blogs.findMany({
                where,
                skip: Number(skip),
                take: Number(limit),
                orderBy,
                include: {
                    user: {
                        select: { id: true, name: true }
                    },
                    categories: {
                        include: {
                            category: true
                        }
                    },
                    _count: {
                        select: { likes: true }
                    },
                    likes: {
                        where: { userId: req.user?.id || "" },
                        select: { id: true }
                    }
                }
            }),
            prisma.blogs.count({ where })
        ]);
        if (!blogs) {
            return res.status(404).json({ error: "Blogs not found" });
        }

        const formattedBlogs = blogs.map(blog => ({
            ...blog,
            isLiked: blog.likes?.length > 0
        }));

        res.status(200).json({ status: "success", data: formattedBlogs, total });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};

const mostViewedBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blogs.findMany({
            where: { isHidden: false },
            orderBy: {
                views: "desc"
            },
            take: 6,
            include: {
                user: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                _count: {
                    select: { likes: true }
                }
            }
        })
        res.status(200).json({ status: "success", data: blogs });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

const recentBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blogs.findMany({
            where: { isHidden: false },
            orderBy: {
                createdAt: "desc"
            },
            take: 4,
            include: {
                user: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                _count: {
                    select: { likes: true }
                }
            }
        })
        res.status(200).json({ status: "success", data: blogs });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

const myBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const blogs = await prisma.blogs.findMany({
            where: { userId: req.user.id, isHidden: false },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                _count: {
                    select: { likes: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        })
        if (blogs.length === 0) {
            return res.status(200).json({ status: "No Blogs", data: [] });
        }
        const totalBlogs = await prisma.blogs.count({
            where: {
                userId: req.user.id,
                isHidden: false
            }
        });
        return res.status(200).json({
            status: "success",
            data: blogs,
            pagination: {
                page,
                limit,
                totalBlogs,
                hasMore: skip + blogs.length < totalBlogs
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

const likedBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const blogs = await prisma.blogs.findMany({
            where: { likes: { some: { userId: req.user.id } } },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                likes: {
                    where: { userId: req.user.id || "" },
                    select: { id: true }
                },
                _count: {
                    select: { likes: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        });
        if (blogs.length === 0) {
            return res.status(200).json({ status: "No Blogs", data: [] });
        }
        const totalBlogs = await prisma.blogs.count({
            where: {
                userId: req.user.id,
                isHidden: false
            }
        });
        const formattedBlogs = blogs.map(blog => ({
            ...blog,
            isLiked: blog.likes?.length > 0
        }));
        return res.status(200).json({
            status: "success",
            data: formattedBlogs,
            pagination: {
                page,
                limit,
                totalBlogs,
                hasMore: skip + blogs.length < totalBlogs
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

const draftBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const blogs = await prisma.blogs.findMany({
            where: { userId: req.user.id, isHidden: true },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                _count: {
                    select: { likes: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        })
        if (blogs.length === 0) {
            return res.status(200).json({ status: "No Blogs", data: [] });
        }
        const totalBlogs = await prisma.blogs.count({
            where: {
                userId: req.user.id,
                isHidden: true
            }
        });
        return res.status(200).json({
            status: "success",
            data: blogs,
            pagination: {
                page,
                limit,
                totalBlogs,
                hasMore: skip + blogs.length < totalBlogs
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

const searchBlogs = async (req, res) => {
    try {
        const query = req.query.q || ""

        if (!query.trim()) {
            return res.status(200).json({ status: "success", data: [] });
        }

        const blogs = await prisma.blogs.findMany({
            where: {
                isHidden: false,
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: "insensitive"
                        },
                    },
                    {
                        content: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            include: {
                user: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                _count: {
                    select: { likes: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 5,
        })
        return res.status(200).json({ status: "success", data: blogs });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

const increaseView = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma.blogs.findFirst({ where: { id, isHidden: false } });
        if (!blog) {
            return res.status(204).end();
        }
        await prisma.blogs.update({ where: { id }, data: { views: { increment: 1 } } });
        return res.status(200).json({ status: "success" });
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}

export { blogs, mostViewedBlogs, recentBlogs, myBlogs, likedBlogs, draftBlogs, searchBlogs, increaseView };