import React from 'react'
import RecentBlog from './RecentBlog'
import MostPopular from './MostPopular'
import Categories from './Categories'

export default function HomePage() {
    return (
        <div className="w-full h-full lg:pb-20 pb-12 pt-24">
            <div className="container mx-auto px-4">
                <div className="gap-12 grid grid-cols-3">
                    <RecentBlog />
                    <div className="lg:col-span-1 col-span-3 flex flex-col">
                        <MostPopular />
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    )
}
