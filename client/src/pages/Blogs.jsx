import React, { useEffect, useState } from 'react';
import MostPopular from '../components/ui/MostPopular';
import Categories from '../components/ui/Categories';
import api from '../api/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import categoryColors from '../utils/CategoryColors';
import BlogListSkeleton from "../components/ui/BlogListSkeleton";
import CategoriesList from '../utils/CategoriesList';
import CategoriesColor from '../utils/CategoriesColor';
import getBlogImage from '@/utils/GetBlogImage';
export default function Blogs() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [param] = useSearchParams();
    const [total, setTotal] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [loadingLike, setLoadingLike] = useState(null);
    const page = Number(param.get("page")) || 1;
    const search = param.get("search") || "";
    const author = param.get("author") || "";
    const sort = param.get("sort") || "views";
    const order = param.get("order") || "desc";
    const category = param.get("category") || "";

    const buildURL = (newPage) => {
        const params = new URLSearchParams(param);
        params.set("page", newPage);
        return `/blogs?${params.toString()}`;
    };

    const updateURL = (updates) => {
        const params = new URLSearchParams(param);
        Object.entries(updates).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        params.set("page", 1);
        navigate(`?${params.toString()}`);
    };

    const getPagination = (current, total) => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= total; i++) {
            if (
                i === 1 ||
                i === total ||
                (i >= current - delta && i <= current + delta)
            ) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l > 2) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const searchFilter = (e) => {
        e.preventDefault();
        navigate(`?page=1&search=${search}&author=${author}&sort=${sort}&order=${order}`);
    }

    const toggleOrder = () => {
        updateURL({ order: order === "asc" ? "desc" : "asc" });
    };

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
        const paramData = {
            page: Number(param.get("page")) || 1,
            search: param.get("search") || "",
            author: param.get("author") || "",
            sort: param.get("sort") || "views",
            order: param.get("order") || "desc",
            category: param.get("category") || ""
        };

        const fetchBlogs = async () => {
            setLoading(true)
            try {
                const data = await api.get('/blog/blogs', { params: paramData });
                setBlogs(data.data.data);
                setTotal(data.data.total);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
            }
        }

        fetchBlogs();
    }, [param]);

    const selectedCategories = category ? category.split(",") : [];

    const toggleCategory = (cat) => {
        let updated;

        if (selectedCategories.includes(cat)) {
            updated = selectedCategories.filter(c => c !== cat);
        } else {
            updated = [...selectedCategories, cat];
        }

        updateURL({
            category: updated.join(",")
        });
    };

    const totalPages = Math.ceil(total / 5);
    const pages = getPagination(page, totalPages);

    return (
        <div className="w-full h-full lg:pb-20 pb-12 md:pt-24 pt-12">
            <div className="container mx-auto px-4">
                <div className="gap-12 grid grid-cols-3">
                    <div className="lg:col-span-2 col-span-3">
                        <div className="w-full xl:flex xl:flex-row grid grid-cols-[1fr_auto] items-center md:justify-between justify-start flex-wrap gap-4">
                            <div className="lg:w-auto w-full flex md:flex-row flex-col md:items-center items-start justify-start flex-wrap gap-2">
                                <div className="max-md:w-full flex md:flex-row flex-col items-center justify-start md:gap-8 gap-2 flex-wrap">
                                    <div className="md:w-fit w-full flex flex-row items-center justify-start gap-3">
                                        <p>Search: </p>
                                        <input type="text" onChange={(e) => updateURL({ search: e.target.value })} value={search} className="border-2 border-zinc-200 rounded-3xl py-1 px-2 2xl:w-80 md:w-52 w-full" name="search" id="search" />
                                    </div>
                                    <div className="md:w-fit w-full flex flex-row items-center justify-start gap-3">
                                        <p>Author: </p>
                                        <input type="text" onChange={(e) => updateURL({ author: e.target.value })} value={author} className="border-2 border-zinc-200 rounded-3xl py-1 px-2 2xl:w-auto md:w-32 w-full" name="author" id="author" />
                                    </div>
                                </div>
                                <button onClick={searchFilter} className="max-md:w-full rounded-3xl font-semibold text-white px-2 py-2 hover:cursor-pointer">
                                    <img src="/search.png" className="w-5 h-5 object-contain object-center" alt="" />
                                </button>
                            </div>
                            <div className="w-fit flex flex-row items-center justify-end gap-1 col-span-2 row-start-3 max-xl:mt-2">
                                <p>Sort by:</p>
                                <select value={sort} onChange={(e) => updateURL({ sort: e.target.value })} className="border-2 border-zinc-300 rounded px-2 py-1" name="sort" id="sort">
                                    <option defaultChecked value="views">Views</option>
                                    <option value="likes">Likes</option>
                                    <option value="latest">latest</option>
                                </select>
                                <button onClick={toggleOrder} className="rounded">
                                    {
                                        order === "asc" ?
                                            (
                                                <>
                                                    <img className="w-5 h-5 hover:cursor-pointer object-contain object-center scale-y-[-1]" src="/sort.png" alt="" />
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <img className="w-5 h-5 hover:cursor-pointer object-contain object-center" src="/sort.png" alt="" />
                                                </>
                                            )
                                    }
                                </button>
                            </div>
                            <div className="flex gap-2 flex-wrap max-lg:overflow-scroll max-lg:max-h-44 col-span-2">
                                {CategoriesList.map(cat => {
                                    const active = selectedCategories.includes(cat);
                                    const colors = CategoriesColor[cat] || CategoriesColor["Default"];
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`px-3 py-1 rounded-full border text-sm hover:cursor-pointer ${active
                                                ? `${colors.active} shadow-sm`
                                                : `${colors.inactive}`
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="w-full mt-16">
                            <div className="w-full flex flex-col items-center justify-start gap-8">
                                {
                                    loading ? <BlogListSkeleton /> :
                                        (blogs.map((blog) => {
                                            return (
                                                <div key={blog.id} className="w-full flex flex-row items-start justify-start gap-8">
                                                    <Link to={"/blog/" + blog.id} className="w-fit">
                                                        <img src={getBlogImage(blog)} className="sm:max-w-32 sm:max-h-32 max-w-20 max-h-20 w-full h-full aspect-square object-cover object-center rounded-full" alt={blog.title} />
                                                    </Link>
                                                    <div className="w-fit flex flex-col items-start justify-start">
                                                        <div className="w-full flex flex-row gap-2">
                                                            {
                                                                blog.categories.length > 0 ?
                                                                    blog.categories.map((cat) => {
                                                                        const name = cat.category.name;
                                                                        const color = categoryColors[name] || categoryColors["Default"];
                                                                        return (
                                                                            <span key={cat.category.id} className={`text-xs ${color} py-1 px-3 rounded-xl mb-2`}>{cat.category.name}</span>
                                                                        )
                                                                    })
                                                                    :
                                                                    <span className={`text-xs bg-lime-400 py-1 px-3 rounded-xl mb-2`}>Default</span>
                                                            }
                                                        </div>
                                                        <div className="w-full flex flex-row flex-wrap items-center md:justify-between justify-start gap-4">
                                                            <Link to={"/blog/" + blog.id} className={"hover:cursor-pointer"}>
                                                                <h3 className="font-bold text-lg mt-1 text-neutral-700">{blog.title}</h3>
                                                            </Link>
                                                            <div className="flex flex-row items-center justify-end gap-4">
                                                                <div className="flex flex-row items-center justify-center gap-1 select-none">
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
                                                                <p className="text-sm mt-1">{blog.views} views</p>
                                                            </div>
                                                        </div>
                                                        <p className="mt-1 text-neutral-800 text-justify sm:inline hidden">{blog.excerpt}...</p>
                                                        <p className="mt-1 text-neutral-800 text-justify sm:hidden">{blog.excerpt}...</p>
                                                        <div className="text-sm mt-1">
                                                            <span>{blog.user.name} - </span>
                                                            <span className="text-neutral-700">2026-04-30</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }))
                                }
                            </div>
                        </div>
                        <div className="w-full flex flex-row items-center justify-center gap-4 mt-8">
                            <div className="flex items-center flex-wrap gap-1 mt-6">
                                <button disabled={page === 1} onClick={() => navigate(buildURL(page - 1))} className="px-3 py-1 border rounded cursor-pointer disabled:opacity-40">Prev</button>

                                {pages.map((p, i) =>
                                    p === "..." ? (
                                        <span key={i} className="px-2">...</span>
                                    ) : (
                                        <button key={i} onClick={() => navigate(buildURL(p))} className={`px-3 py-1 border rounded cursor-pointer ${p === page ? "bg-blue-600 border-blue-600 text-white" : ""}`}>
                                            {p}
                                        </button>
                                    )
                                )}

                                <button disabled={page === totalPages} onClick={() => navigate(buildURL(page + 1))} className="px-3 py-1 border rounded cursor-pointer disabled:opacity-40">Next</button>
                            </div>
                        </div>
                        <p className='text-center mt-4'>{page} of {totalPages}</p>
                    </div>
                    <div className="lg:col-span-1 col-span-3 flex flex-col">
                        <MostPopular />
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    )
}