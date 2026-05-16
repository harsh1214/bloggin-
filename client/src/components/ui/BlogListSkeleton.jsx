import Skeleton from "./Skeleton";

export default function BlogListSkeleton() {
    return (
        <div className="w-full flex flex-col gap-10">

            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-6 items-start">

                    {/* LEFT IMAGE */}
                    <Skeleton className="w-24 h-24 rounded-full shrink-0" />

                    {/* RIGHT CONTENT */}
                    <div className="flex flex-col w-full gap-3">

                        {/* TAGS */}
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-28 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>

                        {/* TITLE + VIEWS */}
                        <div className="flex justify-between items-center gap-4">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-16" />
                        </div>

                        {/* CONTENT */}
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />

                        {/* AUTHOR + DATE */}
                        <Skeleton className="h-4 w-40 mt-1" />

                    </div>
                </div>
            ))}

        </div>
    );
}