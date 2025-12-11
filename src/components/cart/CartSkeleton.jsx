import React from 'react';

const CartSkeleton = () => {
    return (
        <div className="w-full animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Cart Items List */}
                <div className="lg:col-span-8">
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                        {/* Simulate 3 items */}
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-6 border-b border-gray-100 last:border-0">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Image Placeholder */}
                                    <div className="flex-shrink-0">
                                        <div className="w-full sm:w-32 h-32 bg-gray-200 rounded-2xl"></div>
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-4">
                                            {/* Title and Badge Placeholder */}
                                            <div className="space-y-2 w-full">
                                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            </div>
                                            
                                            {/* Delete Icon Placeholder */}
                                            <div className="h-8 w-8 bg-gray-200 rounded-full shrink-0"></div>
                                        </div>

                                        {/* Price and Quantity Row */}
                                        <div className="mt-4 flex items-end justify-between flex-wrap gap-4">
                                            <div className="space-y-2">
                                                <div className="h-8 bg-gray-200 rounded w-32"></div>
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            </div>

                                            {/* Quantity Control Placeholder */}
                                            <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Clear Cart Button Placeholder */}
                    <div className="mt-6 flex justify-end">
                        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white shadow-lg rounded-2xl p-6 h-fit sticky top-4">
                        {/* Header */}
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>

                        {/* Delivery Details Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-8"></div>
                        </div>

                        {/* User Details Card Placeholder */}
                        <div className="border border-gray-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="space-y-2 pl-2">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="h-5 bg-gray-200 rounded w-24"></div>
                                <div className="h-6 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>

                        {/* Checkout Button Placeholder */}
                        <div className="mt-6 h-12 bg-gray-200 rounded-full w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSkeleton;