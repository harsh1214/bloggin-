import React, { useEffect, useState } from 'react'
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import categoryColors from '../../utils/CategoryColors';
import getBlogImage from '@/utils/GetBlogImage';

export default function LikedBlogs() {

    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingLike, setLoadingLike] = useState(null);

    const handleLike = async (blogId) => {
        setLoadingLike(blogId);
        try {
            const { data } = await api.post("/like/toggleLike", { blogId });
            setBlogs(prev =>
                prev.map(blog => {
                    if (blog.id === blogId) {
                        return {
                            ...blog,
                            isLiked: data.data.isLiked,
                            _count: {
                                ...blog._count,
                                likes: data.data.isLiked
                                    ? blog._count.likes + 1
                                    : blog._count.likes - 1
                            }
                        };
                    }
                    return blog;
                })
            );
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoadingLike(null);
        }
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const data = await api.get('/blog/liked', { params: { page } });
                setBlogs(data.data.data);
                setTotalPages(Math.ceil(data.data.pagination.totalBlogs / data.data.pagination.limit));
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        }

        fetchBlogs();
    }, [page]);

    if (loading) {
        return (
            <div className="w-full h-full py-12">
                <div className="w-full h-full flex flex-col items-start justify-center">
                    <h1 className="text-2xl font-bold text-neutral-700">Loading Blogs...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full py-12">
            <div className="w-full h-full grid grid-cols-2 gap-x-6 gap-y-10">
                {
                    blogs && (
                        blogs.map((blog) => {
                            return (
                                <div key={blog.id} className="gap-6 flex flex-row items-center justify-start w-full">
                                    <Link to={`/blog/${blog.id}`} className="w-full max-w-38">
                                        <img className="w-38 h-38 object-cover object-center aspect-video rounded-full" src={getBlogImage(blog)} alt="" />
                                    </Link>
                                    <div className="w-full h-full flex flex-col items-start justify-center">
                                        <div className="w-full flex flex-row gap-2">
                                            {blog.categories.length > 0 ?
                                                blog.categories.map((cat) => {
                                                    const name = cat.category.name;
                                                    const color = categoryColors[name] || categoryColors["Default"];
                                                    return (
                                                        <Link to={`/blogs?category=${name}`} key={cat.category.id} className={`text-xs ${color} py-1 px-3 rounded-xl mb-2`}>{cat.category.name}</Link>
                                                    )
                                                })
                                                :
                                                <span className={`text-xs bg-lime-400 py-1 px-3 rounded-xl mb-2`}>Default</span>
                                            }
                                        </div>
                                        <Link to={`/blog/${blog.id}`} className="font-bold text-lg mt-1 text-neutral-700">{blog.title}</Link>
                                        <div className="text-sm mt-1">
                                            <span className="text-neutral-700">{blog.createdAt.slice(0, 10)}</span>
                                        </div>
                                        <div className="flex flex-row items-center justify-center gap-1 select-none mt-2">
                                            <p className="text-sm">{blog._count.likes}</p>
                                            <div onClick={() => handleLike(blog.id)} className="cursor-pointer">
                                                {
                                                    loadingLike === blog.id ?
                                                        (
                                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                                        )
                                                        :
                                                        (
                                                            <img className={`w-4 h-4 object-contain transition-transform duration-200 ${blog.isLiked ? "scale-110" : ""}`} src={blog.isLiked ? "/liked.png" : "/like.png"} alt="like" />
                                                        )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                }
            </div>
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap mt-12">
                <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="px-6 py-2 rounded-3xl cursor-pointer bg-blue-700 text-white disabled:opacity-50">Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)} className="px-6 py-2 rounded-3xl cursor-pointer bg-blue-700 text-white disabled:opacity-50">Next</button>
            </div>
            {
                blogs.length === 0 && (
                    <div className="w-full h-full flex flex-col items-start justify-center">
                        <h1 className="text-2xl font-bold text-neutral-700">No Blogs Found</h1>
                    </div>
                )
            }
        </div>
    )
}
