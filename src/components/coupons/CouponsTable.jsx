import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaEllipsisV } from "react-icons/fa";
import Pagination from "../common/Pagination";
import { useState, useRef, useEffect } from "react";

const CouponsTable = ({
    coupons,
    loading,
    pagination,
    onPageChange,
    onDelete,
    deletingCouponId,
    onStatusChange,
}) => {

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "expired":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatCouponValue = (coupon) => {
        switch (coupon.type) {
            case 'percentage':
                return `${coupon.value}% off`;
            case 'fixed':
                return `₦${coupon.value} off`;
            case 'freeShipping':
                return `₦${coupon.value} off`;
            default:
                return coupon.value;
        }
    };

    // Helper function to format coupon value display
    function formatCouponValueDisplay(coupon) {
  
        switch (coupon.type) {
            case 'percentage':
            return `Percentage Discount`;
            case 'fixed':
            return `Fixed Discount`;
            case 'freeShipping':
            return 'Free Shipping';
            case 'priceDiscount':
            return `Price Discount`;
            default:
            return coupon.type;
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading coupons...</p>
                </div>
            ) : coupons.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-gray-600">No coupons found</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Value
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applies To
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {coupon.code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {coupon.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">
                                                {formatCouponValueDisplay(coupon)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {formatCouponValue(coupon)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">
                                                {coupon.appliesTo}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                    coupon.status
                                                )}`}
                                            >
                                                {coupon.status.charAt(0).toUpperCase() +
                                                    coupon.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                            <div className="flex justify-end items-center space-x-2">
                                                <Link
                                                    to={`/manage/admin/edit-coupon/${coupon.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    onClick={() => onDelete(coupon.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete"
                                                    disabled={deletingCouponId === coupon.id}
                                                    >
                                                    {deletingCouponId === coupon.id ? (
                                                        <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <FiTrash2 />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {coupons.length > 0 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            perPage={pagination.perPage}
                            onPageChange={onPageChange}
                            loading={loading}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CouponsTable;