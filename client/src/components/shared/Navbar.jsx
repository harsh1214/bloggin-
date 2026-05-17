import { useState } from "react";
import { Link } from "react-router-dom"
import SearchBar from "../ui/SearchBar"
import { useAuthStore } from "../../store/AuthStore";
import api from "../../api/axios";

export default function Navbar() {

    const isAuth = useAuthStore((s) => s.isAuth);
    const logout = useAuthStore((s) => s.logout);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            sessionStorage.setItem("skipAuthToast", "true");
            logout();
        }
        catch (err) {
            console.log(err);
        }
    }

    const handlemobileMenuOpen = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    return (
        <header className="py-4 border-b-2 border-zinc-100 w-full relative z-10">
            <div className={mobileMenuOpen ? "hidden" : "w-screen lg:hidden block fixed z-50 top-0 left-0 h-screen bg-white"}>
                <button onClick={handlemobileMenuOpen} className="fixed top-8 right-4 z-80 text-2xl cursor-pointer">✕</button>
                <div className="container mx-auto px-4 relative z-60 w-full h-full">
                    <div className="w-full h-full flex flex-col items-start justify-start">
                        <Link onClick={handlemobileMenuOpen} to="/" className="w-full">
                            <img className="w-32 mt-8" src="/logo.webp" alt="" />
                        </Link>
                        <div className="mt-8 w-full">
                            <SearchBar closeMobileNav={() => setMobileMenuOpen(true)} />
                        </div>
                        <div className="w-full flex flex-col items-start justify-start gap-2 mt-8">
                            <Link onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg" to="/">Home</Link>
                            <Link onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg" to="/blogs">Blogs</Link>
                            {
                                isAuth ?
                                <>
                                    <Link to="/dashboard" onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg">Dashboard</Link>
                                    <Link to="/profile" onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg">Profile</Link>
                                    <Link onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg" to="/create-blog">Create Blog</Link>
                                    <button onClick={handleLogout}>
                                        <p onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg">Logout</p>
                                    </button> 
                                </>
                                :
                                <>
                                    <Link onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg" to="/login">Login</Link>
                                    <Link onClick={handlemobileMenuOpen} className="font-semibold hover:underline text-lg" to="/register">Register</Link>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-4">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-fit">
                        <Link to="/">
                            <img className="w-32" src="/logo.webp" alt="" />
                        </Link>
                    </div>
                    <div className="w-fit lg:flex hidden flex-row items-center justify-center gap-4">
                        <SearchBar />
                    </div>
                    <div onClick={handlemobileMenuOpen} className="lg:hidden flex flex-col items-center justify-end gap-1 cursor-pointer">
                        <div className="w-4.5 h-0.5 bg-black"></div>
                        <div className="w-4.5 h-0.5 bg-black"></div>
                        <div className="w-4.5 h-0.5 bg-black"></div>
                    </div>
                    <div className="w-fit hidden lg:flex flex-row items-center justify-end gap-2">
                        <div className="w-fit flex flex-row items-center justify-end gap-6 pe-6">
                            <Link className="font-semibold hover:underline" to="/">Home</Link>
                            <Link className="font-semibold hover:underline" to="/blogs">Blogs</Link>
                        </div>
                        {isAuth ?
                            <>
                                <div className="relative z-20 group/profile">
                                    <Link to="/dashboard" className="block bg-blue-600 rounded-3xl font-semibold text-white px-3 py-3 hover:cursor-pointer">
                                        <img className="invert w-5 h-auto object-contain object-center" src="/person.png" alt="" />
                                    </Link>
                                    <div className="absolute top-10 right-0 p-2">
                                        <div className="group-hover/profile:flex hidden flex-col items-start justify-start gap-2 bg-white rounded-lg px-6 py-2 border border-zinc-300">
                                            <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
                                            <Link to="/profile" className="text-sm hover:underline">Profile</Link>
                                            <Link to="/create-blog" className="text-sm hover:underline">Create</Link>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="bg-blue-600 rounded-3xl font-semibold text-white px-8 py-3 hover:bg-blue-500 hover:cursor-pointer">Logout</button>
                            </>
                            :
                            <>
                                <Link to="/login">
                                    <button className="bg-blue-600 rounded-3xl font-semibold text-white px-8 py-3 hover:bg-blue-500 hover:cursor-pointer">Login</button>
                                </Link>
                                <Link to="/register">
                                    <button className="bg-blue-600 rounded-3xl font-semibold text-white px-8 py-3 hover:bg-blue-500 hover:cursor-pointer">Register</button>
                                </Link>
                            </>
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}
