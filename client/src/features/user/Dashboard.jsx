import React from 'react'
import { useAuthStore } from '../../store/AuthStore';
import MyBlogs from '../../components/ui/MyBlogs';
import LikedBlogs from '../../components/ui/LikedBlogs';
import DraftsBlogs from '../../components/ui/DraftsBlogs';
import { Link, useSearchParams } from 'react-router-dom';

export default function Dashboard() {

    const { user } = useAuthStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const select = searchParams.get("tab") || "my-blogs";

    return (
        <div className="w-full h-full relative">
            <div className="container mx-auto px-4 pt-12 pb-12">
                <div className="w-full grid grid-cols-2 gap-2">
                    <div className="w-full flex flex-col items-start justify-center gap-2">
                        <h2 className="text-2xl font-medium">Welcome to Bloggers</h2>
                        <Link to="/create-blog" className="flex flex-row items-center justify-start gap-2 mt-4">
                            <p className="font-medium  underline">Create a new Blog</p>
                            <img className="w-6 h-6 object-center object-contain" src="/create.png" alt="" />
                        </Link>
                    </div>
                    <div className="w-full flex flex-col items-end justify-start">
                        <div className="w-fit flex flex-row items-center justify-end gap-4">
                            <div className="w-fit">
                                <img className="max-w-28 max-h-28 w-full h-full object-center object-cover aspect-square rounded-full" src={user.image || "/user.svg"} alt="" />
                            </div>
                            <div className="max-w-50 w-full flex flex-col items-start justify-start">
                                <h3 className="text-lg font-medium">{user.name}</h3>
                                <p className="text-sm">{user.blogsCount} Blogs Uploaded</p>
                                <Link to="/profile" className="underline text-blue-700 text-sm mt-2"><p className="text-sm">View Profile</p></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-full mt-12">
                    <div className="w-full h-full flex flex-row items-center justify-start gap-6 select-none">
                        <div onClick={() => setSearchParams({ tab: "my-blogs" })} className={`py-1 border-b-2 font-medium cursor-pointer ${select === "my-blogs" ? "border-zinc-900" : "border-transparent"}`}>
                            <p>My Blogs</p>
                        </div>
                        <div onClick={() => setSearchParams({ tab: "liked" })} className={`py-1 border-b-2 font-medium cursor-pointer ${select === "liked" ? "border-zinc-900" : "border-transparent"}`}>
                            <p>Liked</p>
                        </div>
                        <div onClick={() => setSearchParams({ tab: "drafts" })} className={`py-1 border-b-2 font-medium cursor-pointer ${select === "drafts" ? "border-zinc-900" : "border-transparent"}`}>
                            <p>Drafts</p>
                        </div>
                    </div>
                </div>
                {
                    select === "my-blogs" && <MyBlogs />
                }
                {
                    select === "liked" && <LikedBlogs />
                }
                {
                    select === "drafts" && <DraftsBlogs />
                }
            </div>
        </div>
    )
}
