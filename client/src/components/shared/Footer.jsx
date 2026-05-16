import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <div className="border-t-2 border-zinc-100 w-full h-full">
            <div className="container mx-auto px-4">
                <div className="pb-10 pt-20 grid md:grid-cols-2 grid-cols-1 gap-8">
                    <div className="flex flex-col items-start justify-start gap-6">
                        <div className="flex flex-row items-center justify-start gap-4">
                            <Link to="/">
                                <img alt="Main Logo" loading="lazy" className="w-32" decoding="async" src="/logo.webp" />
                            </Link>
                        </div>
                        <div className="">
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi adipisci aliquam beatae consequatur accusamus voluptatem at modi temporibus, earum perferendis atque cum, odit, repellat quod.</p>
                        </div>
                        <div className="">
                            <div className="flex-row gap-4 w-full flex">
                                <img alt="linkedin" loading="lazy" decoding="async" className="w-6 h-6" src="/linkedin.webp" />
                                <img alt="facebook" loading="lazy" decoding="async" className="w-6 h-6" src="/facebook.webp" />
                                <img alt="instagram" loading="lazy" decoding="async" className="w-6 h-6" src="/instagram.webp" />
                                <img alt="youtube" loading="lazy" decoding="async" className="w-6 h-6" src="/youtube.webp" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end xl:gap-28 lg:gap-20 sm:gap-16 gap-4">
                        <div className="flex flex-col items-start justify-start gap-3 md:w-fit w-full">
                            <h4 className="font-bold">Links</h4>
                            <Link to="/">Home</Link>
                            <Link to="/blogs">Blogs</Link>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-3 md:w-fit w-full">
                            <h4 className="font-bold">Tags</h4>
                            <a href="/">Style</a>
                            <a href="/">Fashion</a>
                            <a href="/">Coding</a>
                            <a href="/">Travel</a>
                        </div>
                        <div className="flex flex-col items-start justify-start gap-3 md:w-fit w-full">
                            <h4 className="font-bold">Social</h4>
                            <a href="/">Linkedin</a>
                            <a href="/">Facebook</a>
                            <a href="/">Instagram</a>
                            <a href="/">Youtube</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
