import React from 'react';

const CheckoutSkeleton = () => {
    return (
        <div className="w-full animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
                
                {/* Left Column: Main Checkout Sections */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. Customer Address Section Skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
                        <div className="border border-gray-200 rounded-xl p-5 mb-4">
                            <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-3">
                                <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0"></div>
                                <div className="h-5 bg-gray-200 rounded w-48"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="h-4 w-4 bg-gray-200 rounded shrink-0"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-4 w-4 bg-gray-200 rounded shrink-0"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-4 w-4 bg-gray-200 rounded shrink-0"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-48 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* 2. Delivery Option Section Skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 h-14 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1 h-14 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>

                    {/* 3. Payment Method Section Skeleton */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 p-4 border border-gray-200 rounded-xl">
                                <div className="flex gap-3">
                                    <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0"></div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-4 border border-gray-200 rounded-xl">
                                <div className="flex gap-3">
                                    <div className="h-5 w-5 bg-gray-200 rounded-full shrink-0"></div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Review Item Preview Skeleton (Partial) */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                         <div className="flex gap-4">
                            <div className="h-20 w-20 bg-gray-200 rounded-lg shrink-0"></div>
                            <div className="space-y-2 w-full py-2">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-white shadow-lg rounded-2xl p-6 h-fit sticky top-4 border border-gray-100">
                        {/* Header */}
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>

                        {/* Delivery Details Label */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-8"></div>
                        </div>

                        {/* Delivery Card */}
                        <div className="border border-gray-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="space-y-2 pl-1">
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>

                        {/* Coupon Code */}
                        <div className="mb-6 space-y-2">
                             <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                             <div className="flex gap-2">
                                 <div className="h-10 bg-gray-200 rounded flex-1"></div>
                                 <div className="h-10 bg-gray-200 rounded w-20"></div>
                             </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                             <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-10"></div>
                            </div>
                        </div>
                        
                        {/* Total */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-end">
                             <div className="h-5 bg-gray-200 rounded w-24"></div>
                             <div className="h-8 bg-gray-200 rounded w-32"></div>
                        </div>

                        {/* Checkout Warning/Button */}
                        <div className="mt-6 h-12 bg-red-50 rounded-lg w-full flex items-center justify-center gap-2">
                             <div className="h-4 w-4 bg-red-200 rounded-full"></div>
                             <div className="h-4 bg-red-200 rounded w-32"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSkeleton;