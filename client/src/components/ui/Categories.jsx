import React from 'react'
import { Link } from 'react-router-dom'

export default function Categories() {
    return (
        <>
            <h2 className="text-lg text-neutral-700 font-semibold mt-16">Discover by topic</h2>
            <h1 className="font-bold text-3xl mb-8">Categories</h1>
            <div className="w-full flex flex-row flex-wrap items-start justify-start gap-4">
                <Link className="px-7 py-3.5 w-fit text-center bg-blue-200 rounded" to="/blogs?category=Lifestyle">
                    <span className="text-black">Lifestyle</span>
                </Link>
                <Link className="px-7 py-3.5 w-fit text-center bg-cyan-200 rounded" to="/blogs?category=Fashion">
                    <span className="text-black">Fashion</span>
                </Link>
                <Link className="px-7 py-3.5 w-fit text-center bg-green-200 rounded" to="/blogs?category=Food+%26+Cooking">
                    <span className="text-black">Food</span>
                </Link>
                <Link className="px-7 py-3.5 w-fit text-center bg-amber-100 rounded" to="/blogs?category=Travel">
                    <span className="text-black">Travel</span>
                </Link>
                <Link className="px-7 py-3.5 w-fit text-center bg-violet-200 rounded" to="/blogs?category=Society+%26+Culture">
                    <span className="text-black">Culture</span>
                </Link>
                <Link className="px-7 py-3.5 w-fit text-center bg-rose-200 rounded" to="/blogs?category=Technology">
                    <span className="text-black">Technology</span>
                </Link>
            </div>
        </>
    )
}
