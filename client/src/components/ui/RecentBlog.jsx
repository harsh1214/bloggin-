import React from 'react'
import { Link } from 'react-router-dom'
import { useBlogStore } from '../../store/BlogStore';
import Loading from './Loading';
import categoryColors from '../../utils/CategoryColors';
import getBlogImage from '@/utils/GetBlogImage';

export default function RecentBlog() {

    const { recentBlogs, loadingrecentBlogs } = useBlogStore();

    if (loadingrecentBlogs) {
        return <Loading />
    }

    if (!recentBlogs.length) {
        return (
            <div className="lg:col-span-2 col-span-3">
                <h1 className="text-3xl font-bold">Recent Blogs</h1>
                <div className="flex flex-col gap-8 mt-8">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 col-span-3">
            <h1 className="text-3xl font-bold">Recent Blogs</h1>
            <div className="flex flex-col gap-8 mt-8">
                {
                    recentBlogs.map((blog) => {
                        return (
                            <div key={blog.id} className="grid grid-cols-5 gap-8">
                                <div className="sm:col-span-2 col-span-5 sm:h-auto h-96 relative">
                                    <img alt={blog.title} loading="lazy" decoding="async" className="w-full h-96 aspect-square rounded-lg object-cover" src={getBlogImage(blog)} />
                                </div>
                                <div className="sm:col-span-3 col-span-5 flex flex-col justify-start items-start">
                                    <div className="w-full flex flex-row gap-2 flex-wrap">
                                        <span className="text-neutral-500 font-semibold">{blog.createdAt.slice(0, 10)} - </span>
                                        <div className="flex flex-row gap-2">
                                            {blog.categories.length > 0 ?
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
                                    </div>
                                    <Link to={`/blog/${blog.id}`}>
                                        <h1 className="text-2xl font-bold py-6">{blog.title}</h1>
                                    </Link>
                                    <p className="font-normal text-neutral-900 text-justify">{blog.excerpt}...</p>
                                    <Link className=" pt-4 font-semibold underline" to={`/blog/${blog.id}`}>Read More</Link>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className="flex flex-row justify-center items-center mt-8">
                {/* <button className="bg-blue-600 py-3 px-8 font-semibold rounded-3xl text-white hover:bg-blue-500 hover:cursor-pointer">Previous</button> */}
                <Link to="/blogs" className="bg-blue-600 py-3 px-8 font-semibold rounded-3xl text-white hover:bg-blue-500 hover:cursor-pointer">View More</Link>
            </div>
        </div>
    )
}
