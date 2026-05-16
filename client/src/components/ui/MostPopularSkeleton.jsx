import Skeleton from "./Skeleton";

export default function MostPopularSkeleton() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-48" />
            </div>

            {/* List */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">

                    {/* Categories */}
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>

                    {/* Title */}
                    <Skeleton className="h-5 w-3/4" />

                    {/* Author + Date */}
                    <Skeleton className="h-4 w-40" />
                </div>
            ))}
        </div>
    );
}