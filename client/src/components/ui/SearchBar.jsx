import api from '@/api/axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ closeMobileNav }) {

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [open, setOpen] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchBlogs = async () => {
            try {
                if(!query.trim()){
                    setBlogs([]);
                    return;
                }

                setLoading(true);
                const { data } = await api.get(`/blog/search?q=${query}`);
                setBlogs(data.data || []);
                setOpen(true)
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        }

        const timer = setTimeout(() => {
            fetchBlogs();
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {

        const handleClickOutsite = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutsite);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsite);
        }
    }, []);

    return (
        <div ref={searchRef} className="relative z-50 w-full">
            <div className="relative w-full">
                <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => {if (blogs.length > 0){ setOpen(true) }}} type="text" placeholder="Search blogs..." className="w-full border-2 border-zinc-200 rounded-3xl px-4 py-2 relative z-10 xl:min-w-xl lg:min-w-lg md:min-w-md" />
                <button className="rounded-3xl hover:cursor-pointer absolute z-20 top-0 right-0 w-fit h-full aspect-square flex flex-col items-center justify-center">
                    <img className="w-5 h-auto object-contain object-center" src="/search.png" alt="" />
                </button>
            </div>
            {
                open && (
                    <div className="absolute top-14 left-0 w-full bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden max-h-96 overflow-y-auto">
                        {
                            loading && (
                                <div className="p-4 text-sm text-gray-500">Searching...</div>
                            )
                        }
                        {
                            !loading && blogs.length === 0 && query.trim() && (
                                <div className="p-4 text-sm text-gray-500">No blogs found</div>
                            )
                        }
                        {
                            blogs.map((blog) => (
                                <div key={blog.id} onClick={() => { navigate(`/blog/${blog.id}`);setOpen(false);setQuery("");if (closeMobileNav) { closeMobileNav(); }}} className="p-4 border-b border-zinc-100 hover:bg-zinc-100 cursor-pointer transition">
                                    <h3 className="font-semibold line-clamp-1">{blog.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.excerpt.slice(0, 150)}...</p>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}
