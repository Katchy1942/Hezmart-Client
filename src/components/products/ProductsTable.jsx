import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { FaEllipsisV } from "react-icons/fa";
import Pagination from "../common/Pagination";
import { useState, useRef, useEffect } from "react";

const ProductsTable = ({
  products,
  loading,
  pagination,
  onPageChange,
  onDelete,
  onStatusChange,
  showOwner = false,
  allowStatusUpdate = false,
  showEditUrl=true
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (productId) => {
    setActiveDropdown(activeDropdown === productId ? null : productId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "denied":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusActions = (currentStatus) => {
    const allActions = {
      active: [{ label: "Suspend Product", value: "suspend" }],
      denied: [{ label: "Activate Product", value: "approve" }],
      suspended: [{ label: "Activate Product", value: "approve" }],
      pending: [
        { label: "Approve (Active)", value: "approve" },
        { label: "Reject (Denied)", value: "reject" }
      ],
      draft: [{ label: "Publish Product", value: "active" }]
    };

    return allActions[currentStatus] || [];
  };

  const handleStatusUpdate = async (productId, newStatus) => {
    setStatusUpdating(productId);
    try {
      await onStatusChange(productId, newStatus);
    } finally {
      setStatusUpdating(null);
      setActiveDropdown(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {showOwner && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Owner
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {showOwner && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.user?.businessName || "N/A"}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.coverImage || "/placeholder-product.jpg"}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category?.name || "-"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.subcategory?.name || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900"> ₦{parseFloat(product.price).toLocaleString('en-US')}</div>
                      {product.discountPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₦{parseFloat(product.discountPrice).toLocaleString('en-US')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stockQuantity || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <div className="flex justify-end items-center space-x-2">
                        <Link
                          to={`/product/${product.id}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                       {showEditUrl && (
                         <Link
                          to={`/manage/vendor/edit-product/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </Link>
                       )}
                        {allowStatusUpdate && (
                          <>
                            <button
                              onClick={() => toggleDropdown(product.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              disabled={statusUpdating === product.id}
                              title="Status options"
                            >
                              {statusUpdating === product.id ? (
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

                            {activeDropdown === product.id && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                              >
                                <div className="py-1">
                                  {getStatusActions(product.status).map((action) => (
                                    <button
                                      key={action.value}
                                      onClick={() =>
                                        handleStatusUpdate(product.id, action.value)
                                      }
                                      disabled={statusUpdating === product.id}
                                      className={`block px-4 py-2 text-sm w-full text-left ${
                                        statusUpdating === product.id
                                          ? "text-gray-400 cursor-not-allowed"
                                          : "text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      {statusUpdating === product.id ? (
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
                          </>
                        )}
                        <button
                          onClick={() => onDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {products.length > 0 && (
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

export default ProductsTable;