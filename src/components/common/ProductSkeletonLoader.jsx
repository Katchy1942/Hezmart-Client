const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl ring-3 
        ring-[#f0e8e8] overflow-hidden animate-pulse">
            <div className="w-full h-48 sm:h-56 bg-gray-300"></div>
            
            <div className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                
                <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-9 bg-gray-300 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};

const FlashProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 
        overflow-hidden animate-pulse h-full">
            {/* Image Area */}
            <div className="aspect-[4/5] w-full bg-gray-200 relative">
                {/* Badge Placeholders */}
                <div className="absolute top-2 left-2 h-4 w-8 bg-gray-300 rounded"></div>
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-300"></div>
            </div>

            {/* Timer Strip */}
            <div className="h-6 w-full bg-red-50/50"></div>

            <div className="p-3 flex flex-col gap-2">
                {/* Title */}
                <div className="h-3 bg-gray-200 rounded w-11/12"></div>
                
                {/* Price and Stock */}
                <div className="mt-2 space-y-1.5">
                    <div className="flex gap-2 items-baseline">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-10"></div>
                    </div>
                    <div className="h-2 bg-red-100 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};

const ProductDetailSkeleton = () => {
    return (
        <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Section: Image and Core Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                {/* Left Column: Product Image */}
                <div className="w-full">
                    <div className="aspect-square w-full bg-gray-200 rounded-2xl"></div>
                </div>

                {/* Right Column: Product Info */}
                <div className="flex flex-col space-y-6">
                    {/* Title and Category */}
                    <div className="space-y-3">
                        <div className="h-8 md:h-10 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-center space-x-4 py-2">
                        <div className="h-8 w-32 bg-gray-300 rounded"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Options (Color) */}
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="h-12 w-32 bg-gray-200 rounded-full"></div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                        <div className="flex-1 h-14 bg-gray-300 rounded-full"></div>
                        <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
                        <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
                    </div>
                    
                    {/* Return Policy Text */}
                    <div className="h-4 w-2/3 bg-gray-100 rounded mt-4"></div>
                </div>
            </div>

            {/* Bottom Section: Description and Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-100 pt-12">
                {/* Product Description */}
                <div className="space-y-4">
                    <div className="h-6 w-48 bg-gray-300 rounded mb-6"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>

                {/* Specifications Table */}
                <div className="space-y-4">
                    <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex border-b border-gray-100 last:border-0">
                                <div className="w-1/3 p-4 bg-gray-50 h-12"></div>
                                <div className="w-2/3 p-4 bg-white h-12"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductSkeletonLoader = ({ 
    count = 4, 
    from = "ProductsGrid", 
    variant = "standard", 
    enableHorizontalScroll = false 
}) => {
    const SkeletonComponent = variant === 'flash' ? FlashProductCardSkeleton : ProductCardSkeleton;

    if (from === "ProductDetails") {
        return (
            <>
                <ProductDetailSkeleton />
                <div className="grid grid-cols-1 sm:grid-cols-2 
                lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-4">
                    {Array.from({ length: count }).map((_, index) => (
                        <SkeletonComponent key={index} />
                    ))}
                </div>
            </>
        );
    }

    if (enableHorizontalScroll) {
        return (
            <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className="w-[160px] xs:w-[190px] 
                    md:w-[240px] flex-shrink-0">
                        <SkeletonComponent />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 
        md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 mb-8">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </div>
    );
};

export default ProductSkeletonLoader;