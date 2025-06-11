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
    onStatusChange,
}) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (couponId) => {
        setActiveDropdown(activeDropdown === couponId ? null : couponId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "expired":
                return "bg-red-100 text-red-800";
            case "upcoming":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusActions = (currentStatus) => {
        const allActions = {
            active: [{ label: "Deactivate", value: "expired" }],
            expired: [{ label: "Reactivate", value: "active" }],
            upcoming: [{ label: "Activate Now", value: "active" }]
        };

        return allActions[currentStatus] || [];
    };

    const handleStatusUpdate = async (couponId, newStatus) => {
        setStatusUpdating(couponId);
        try {
            await onStatusChange(couponId, newStatus);
        } finally {
            setStatusUpdating(null);
            setActiveDropdown(null);
        }
    };

    const formatCouponValue = (coupon) => {
        switch (coupon.type) {
            case 'percentage':
                return `${coupon.value}% off`;
            case 'fixed':
                return `₦${coupon.value} off`;
            case 'freeShipping':
                return 'Free Shipping';
            default:
                return coupon.value;
        }
    };

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
                                                {coupon.type}
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
                                                    to={`/admin/coupons/edit/${coupon.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    onClick={() => onDelete(coupon.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                                <button
                                                    onClick={() => toggleDropdown(coupon.id)}
                                                    className="text-gray-400 hover:text-gray-600 p-1"
                                                    disabled={statusUpdating === coupon.id}
                                                    title="Status options"
                                                >
                                                    {statusUpdating === coupon.id ? (
                                                        <svg
                                                            className="animate-spin h-5 w-5 text-gray-500"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                    ) : (
                                                        <FaEllipsisV />
                                                    )}
                                                </button>

                                                {activeDropdown === coupon.id && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                                    >
                                                        <div className="py-1">
                                                            {getStatusActions(coupon.status).map((action) => (
                                                                <button
                                                                    key={action.value}
                                                                    onClick={() =>
                                                                        handleStatusUpdate(coupon.id, action.value)
                                                                    }
                                                                    disabled={statusUpdating === coupon.id}
                                                                    className={`block px-4 py-2 text-sm w-full text-left ${
                                                                        statusUpdating === coupon.id
                                                                            ? "text-gray-400 cursor-not-allowed"
                                                                            : "text-gray-700 hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    {statusUpdating === coupon.id ? (
                                                                        <span className="flex items-center">
                                                                            <svg
                                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <circle
                                                                                    className="opacity-25"
                                                                                    cx="12"
                                                                                    cy="12"
                                                                                    r="10"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="4"
                                                                                ></circle>
                                                                                <path
                                                                                    className="opacity-75"
                                                                                    fill="currentColor"
                                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                ></path>
                                                                            </svg>
                                                                            Processing...
                                                                        </span>
                                                                    ) : (
                                                                        action.label
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
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