import React, { useEffect, useState } from 'react'
import MostPopular from '../components/ui/MostPopular'
import Categories from '../components/ui/Categories'
import api from '../api/axios'
import { useParams } from 'react-router-dom'
import NotFound from './NotFound'
import BlogSkeleton from '../components/ui/BlogSkeleton';
import "@/styles/editor.css"
import getBlogImage from '@/utils/GetBlogImage'

export default function Blog() {

    const param = useParams()
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState('');
    const [loadingLike, setLoadingLike] = useState(false);

    const handleLike = async () => {
        if (!blog) return;
        setLoadingLike(true);
        try {
            const { data } = await api.post("/like/toggleLike", {
                blogId: blog.id
            });
            setBlog(prev => ({
                ...prev,
                isLiked: data.data.isLiked,
                _count: {
                    ...prev._count,
                    likes: data.data.isLiked
                    ? prev._count.likes + 1
                    : prev._count.likes - 1
                }
            }));
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingLike(false);
        }
    };

    useEffect(() => {
        const getBlog = async () => {
            try {
                const data = await api.get('/blog/getBlog', { params: { id: param.id } });
                setBlog(data.data.data);
                const viewed = localStorage.getItem(`viewed-${param.id}`)
                const now = Date.now()
                const cooldown = 1000 * 60 * 60 * 6
                if (!viewed || now - Number(viewed) > cooldown) {
                    await api.patch(`/blog/view/${param.id}`);
                    localStorage.setItem(`viewed-${param.id}`, now.toString())
                }
            }
            catch (err) {
                console.log(err);
                setError(err.response.data.error);
            }
        }

        getBlog();
    }, [param.id]);

    if (!blog) {
        return (
            <div className="w-full h-full lg:pb-20 pb-12 pt-12">
                <div className="container mx-auto px-4">
                    <div className="gap-12 grid grid-cols-3">
                        <div className="lg:col-span-2 col-span-3">
                            <BlogSkeleton />
                        </div>
                        <div className="col-span-1">
                            <MostPopular />
                            <Categories />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return <NotFound />;
    }

    return (
        <div className="w-full h-full lg:pb-20 pb-12 pt-12">
            <div className="container mx-auto px-4">
                <div className="gap-12 grid grid-cols-3">
                    <div className="lg:col-span-2 col-span-3">
                        <h1 className="xl:text-3xl text-2x font-bold">{blog.title}</h1>
                        <div className="w-full">
                            <img alt={blog.title} loading="lazy" decoding="async" className="w-full h-full aspect-video object-cover rounded-lg mt-8" src={getBlogImage(blog)} />
                            <div className="w-full flex flex-row items-center justify-between mt-4">
                                <div className="w-full flex flex-row items-start justify-start flex-wrap gap-x-1 gap-y-2">
                                    <p className="pt-2 italic">{blog.user.name} - </p>
                                    <p className="pt-2 italic">{String(blog.createdAt).slice(0, 10)}</p>
                                </div>
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <div className="flex flex-row items-center justify-center gap-2">
                                        <p className="text-sm">{blog._count.likes}</p>
                                        <div onClick={handleLike} className="cursor-pointer flex items-center justify-center select-none">
                                            {
                                                loadingLike ?
                                                    (
                                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                                    )
                                                    :
                                                    (
                                                        <img className={`w-4 h-4 object-contain transition-all duration-200 scale-125`} src={blog.isLiked ? "/liked.png" : "/like.png"} alt="" />
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 font-sans tiptap" dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </div>
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
