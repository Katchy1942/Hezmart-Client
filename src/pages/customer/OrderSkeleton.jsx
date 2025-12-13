export const OrderSkeleton = () => {
    return (
        <>
            <div
                className="hidden md:block bg-white rounded-lg 
                shadow-sm border border-gray-200 overflow-hidden"
            >
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-7 gap-4 px-4 py-3 
                        border-b border-gray-100 animate-pulse"
                    >
                        {[...Array(7)].map((__, j) => (
                            <div
                                key={j}
                                className="h-4 bg-gray-200 
                                rounded w-full"
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="md:hidden space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white p-3 rounded-lg 
                        shadow-sm border border-gray-200 animate-pulse"
                    >
                        <div className="flex justify-between mb-3">
                            <div className="h-3 bg-gray-200 
                                rounded w-24"
                            />
                            <div className="h-3 bg-gray-200 
                                rounded w-16"
                            />
                        </div>

                        <div className="grid grid-cols-2 
                            gap-3 py-3"
                        >
                            <div className="h-3 bg-gray-200 
                                rounded w-24"
                            />
                            <div className="h-3 bg-gray-200 
                                rounded w-20"
                            />
                        </div>

                        <div className="flex justify-between 
                            mt-3"
                        >
                            <div className="h-3 bg-gray-200 
                                rounded w-28"
                            />
                            <div className="h-6 bg-gray-200 
                                rounded w-16"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
