import React from 'react'
import { Link } from 'react-router-dom'

export default function EditorsPick() {
    return (
        <>
            <h2 className="text-lg text-neutral-700 font-semibold mt-16">Chosen by the editor</h2>
            <h1 className="font-bold text-3xl mb-8">Editors Pick</h1>
            <div className="w-full flex flex-col gap-8">
                <Link className="gap-4 flex flex-row items-start justify-start w-full" to="/">
                    <div className="relative aspect-square w-full max-w-20">
                        <img alt="" loading="lazy" className="rounded-full aspect-square" src="/p1.webp" />
                    </div>
                    <div className="w-full">
                        <span className="text-xs bg-lime-400 py-1 px-3 rounded-xl mb-2">Travel</span>
                        <h3 className="font-bold text-lg mt-1 text-neutral-700">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
                        <div className="text-sm mt-1">
                            <span>John Doe - </span>
                            <span className="text-neutral-700">10.03.2023</span>
                        </div>
                    </div>
                </Link>
                <Link className="gap-4 flex flex-row items-start justify-start w-full" to="/">
                    <div className="relative aspect-square w-full max-w-20">
                        <img alt="" loading="lazy" className="rounded-full aspect-square" src="/p1.webp" />
                    </div>
                    <div className="w-full">
                        <span className="text-xs bg-red-400 py-1 px-3 rounded-xl mb-2">Culture</span>
                        <h3 className="font-bold text-lg mt-1 text-neutral-700">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
                        <div className="text-sm mt-1">
                            <span>John Doe - </span>
                            <span className="text-neutral-700">10.03.2023</span>
                        </div>
                    </div>
                </Link>
                <Link className="gap-4 flex flex-row items-start justify-start w-full" to="/">
                    <div className="relative aspect-square w-full max-w-20">
                        <img alt="" loading="lazy" className="rounded-full aspect-square" src="/p1.webp" />
                    </div>
                    <div className="w-full">
                        <span className="text-xs bg-amber-400 py-1 px-3 rounded-xl mb-2">Food</span>
                        <h3 className="font-bold text-lg mt-1 text-neutral-700">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
                        <div className="text-sm mt-1">
                            <span>John Doe - </span>
                            <span className="text-neutral-700">10.03.2023</span>
                        </div>
                    </div>
                </Link>
                <Link className="gap-4 flex flex-row items-start justify-start w-full" to="/">
                    <div className="relative aspect-square w-full max-w-20">
                        <img alt="" loading="lazy" className="rounded-full aspect-square" src="/p1.webp" />
                    </div>
                    <div className="w-full">
                        <span className="text-xs bg-sky-400 py-1 px-3 rounded-xl mb-2">Fashion</span>
                        <h3 className="font-bold text-lg mt-1 text-neutral-700">Lorem ipsum dolor sit amet consectetur adipisicing elit.</h3>
                        <div className="text-sm mt-1">
                            <span>John Doe - </span>
                            <span className="text-neutral-700">10.03.2023</span>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}
