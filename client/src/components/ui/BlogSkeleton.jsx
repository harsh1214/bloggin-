import Skeleton from "./Skeleton";

export default function BlogSkeleton() {
    return (
        <div className="w-full lg:pb-20 pb-12">
            <div className="container mx-auto px-4">

                {/* TITLE */}
                <Skeleton className="h-10 w-3/4 mb-6" />

                {/* IMAGE */}
                <Skeleton className="w-full h-100 md:h-125 mb-6" />

                {/* AUTHOR + DATE */}
                <div className="w-full flex flex-row items-center justify-between">
                    <Skeleton className="h-4 w-48 mb-6" />
                    <Skeleton className="h-4 w-16 mb-6" />
                </div>

                {/* CONTENT */}
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />

                    <Skeleton className="h-4 w-full mt-6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />

                    <Skeleton className="h-4 w-full mt-6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

            </div>
        </div>
    );
}