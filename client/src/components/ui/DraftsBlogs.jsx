import React, { useEffect, useState } from 'react'
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import categoryColors from '../../utils/CategoryColors';
import getBlogImage from '@/utils/GetBlogImage';

export default function DraftsBlogs() {

    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [selectedBlog, setSelectedBlog] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const data = await api.get('/blog/drafts', { params: { page } });
                if (data.data.data.length === 0) {
                    return setBlogs([]);
                }
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

    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            await api.delete(`/blog/delete/${selectedBlog.id}`);
            setBlogs((prev) => prev.filter((blog) => blog.id !== selectedBlog.id));
            setDeleteModal(false)
            setSelectedBlog(null)
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setDeleteLoading(false)
        }
    }

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
            {
                deleteModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 select-none">
                        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold">Delete Blog</h2>
                            <p className="mt-3 text-gray-600">This action cannot be undone.</p>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => { setDeleteModal(false);setSelectedBlog(null); }} className="px-5 py-2 rounded-full border border-zinc-300 hover:bg-zinc-100 hover:cursor-pointer">
                                    Cancel
                                </button>
                                <button disabled={deleteLoading} onClick={handleDelete} className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white hover:cursor-pointer disabled:opacity-50">
                                    {
                                        deleteLoading
                                            ? "Deleting..."
                                            : "Delete"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
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
                                        <div className="w-full flex flex-row gap-3 mt-2">
                                            <Link to={`/edit/${blog.id}`} className="text-blue-600 text-sm underline">Edit</Link>
                                            <button onClick={() => { setSelectedBlog(blog); setDeleteModal(true) }} className="text-red-600 text-sm underline hover:cursor-pointer">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                }
            </div>
            {
                blogs.length > 0 && (
                    <div className="flex flex-row items-center justify-center gap-4 flex-wrap mt-12">
                        <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="px-6 py-2 rounded-3xl cursor-pointer bg-blue-700 text-white disabled:opacity-50">Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)} className="px-6 py-2 rounded-3xl cursor-pointer bg-blue-700 text-white disabled:opacity-50">Next</button>
                    </div>
                )
            }
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