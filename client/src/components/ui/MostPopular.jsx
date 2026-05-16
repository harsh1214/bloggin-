import React from 'react'
import { Link } from 'react-router-dom'
import { useBlogStore } from '../../store/BlogStore';
import categoryColors from '../../utils/CategoryColors';
import MostPopularSkeleton from './MostPopularSkeleton';

export default function MostPopular() {

    const { mostViewed, loadingMostViewed } = useBlogStore();

    if (loadingMostViewed) {
        return <MostPopularSkeleton />;
    }

    if (!mostViewed.length) {
        return <MostPopularSkeleton />;
    }

    const topBlogs = mostViewed.slice(1, 6);

    return (
        <>
            <h2 className="text-lg text-neutral-700 font-semibold">What's hot</h2>
            <h1 className="font-bold text-3xl mb-8">Most Popular</h1>
            <div className="w-full lg:flex lg:flex-col grid sm:grid-cols-2 grid-cols-1 gap-8">
                {
                    topBlogs.map((blog) => {

                        return (
                            <Link key={blog.id} className="gap-4 flex flex-row items-start justify-start w-full" to={`/blog/${blog.id}`}>
                                <div className="w-full">
                                    <div className="w-full flex flex-row gap-2">
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
                                    <h3 className="font-bold text-lg mt-1 text-neutral-700">{blog.title}</h3>
                                    <div className="text-sm mt-1">
                                        <span>{blog.user.name} - </span>
                                        <span className="text-neutral-700">{blog.createdAt.slice(0, 10)}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                }
            </div>
        </>
    )
}
