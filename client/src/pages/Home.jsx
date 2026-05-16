import React from 'react';
import { Link } from 'react-router-dom';
import HomePage from '../components/ui/HomePage';
import { useBlogStore } from '../store/BlogStore';
import Loading from '../components/ui/Loading';
import getBlogImage from '@/utils/GetBlogImage';

export default function Home() {

    const { mostViewed, loadingMostViewed } = useBlogStore();

    if (loadingMostViewed) {
        return <Loading />
    }

    if (!mostViewed.length) {
        return <Loading />; // or null
    }

    const topBlog = mostViewed[0];

    return (
        <div className="w-full h-full">
            <div className="w-full h-full pt-36 lg:pb-32 pb-20 relative z-0">
                <div className="container mx-auto px-4">
                    <h1 className="md:text-7xl text-5xl leading-tight">
                        <strong className="inline">Hey, Bloggers here! </strong>
                        <span className="inline">Discover our story and creative ideas.</span>
                    </h1>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 mt-28">
                        <div className="w-full h-96 relative">
                            <img alt="" loading="lazy" className="w-full h-full rounded-lg object-cover object-center" src={getBlogImage(topBlog)} />
                        </div>
                        <div className="w-full flex flex-col items-start justify-center">
                            <h1 className="md:text-3xl text-2xl font-bold mb-8">{topBlog.title}</h1>
                            <p className="md:text-lg text-justify text-md text-neutral-800">{topBlog.excerpt}...</p>
                            <Link to={`/blog/${topBlog.id}`} className="bg-blue-600 rounded-3xl font-semibold text-white px-8 py-3 hover:bg-blue-500 hover:cursor-pointer mt-6">Read More</Link>
                        </div>
                    </div>
                </div>
                {/* <img src="hero-bg.svg" className="w-full h-full object-contain object-center absolute z-[-1] top-0 left-0 opacity-20" alt="" /> */}
            </div>
            <div className="container mx-auto px-4 lg:pb-8 text-black">
                <h1 className="text-3xl font-bold ">Popular Categories</h1>
                <div className="grid lg:grid-cols-4 xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 sm:gap-8 gap-4 mt-8">
                    <Link className="flex flex-row items-center justify-center gap-4 flex-wrap bg-blue-200 sm:py-4 py-5 rounded" to="/blogs?category=Lifestyle">
                        <img alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover object-center" src="style.webp" />
                        <p className="md:text-lg text-md">Lifestyle</p>
                    </Link>
                    <Link className="flex flex-row items-center justify-center gap-4 flex-wrap bg-cyan-200 sm:py-4 py-5 rounded" to="/blogs?category=Fashion">
                        <img alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover object-center" src="fashion.webp" />
                        <p className="md:text-lg text-md">Fashion</p>
                    </Link>
                    <Link className="flex flex-row items-center justify-center gap-4 flex-wrap bg-green-200 sm:py-4 py-5 rounded" to="/blogs?category=Food+%26+Cooking">
                        <img alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover object-center" src="food.webp" />
                        <p className="md:text-lg text-md">Food</p>
                    </Link>
                    <Link className="flex flex-row items-center justify-center gap-4 flex-wrap bg-amber-100 sm:py-4 py-5 rounded" to="/blogs?category=Travel">
                        <img alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover object-center" src="travel.webp" />
                        <p className="md:text-lg text-md">Travel</p>
                    </Link>
                    <Link className="flex flex-row items-center justify-center gap-4 flex-wrap bg-violet-200 sm:py-4 py-5 rounded" to="/blogs?category=Society+%26+Culture">
                        <img alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover object-center" src="culture.webp" />
                        <p className="md:text-lg text-md">Culture</p>
                    </Link>
                    <Link className="flex flex-row items-center justify-center gap-4 flex-wrap bg-rose-200 sm:py-4 py-5 rounded" to="/blogs?category=Technology">
                        <img alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover object-center" src="coding.webp" />
                        <p className="md:text-lg text-md">Technology</p>
                    </Link>
                </div>
            </div>
            <HomePage />
        </div>
    )
}
