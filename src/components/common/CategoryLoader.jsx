export const LeftSkeleton = () => (
    <div className="py-2 px-4 space-y-4">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
        ))}
    </div>
);

export const RightSkeleton = () => (
    <div className="animate-pulse h-full">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {[...Array(14)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-full" />
            ))}
        </div>
    </div>
);