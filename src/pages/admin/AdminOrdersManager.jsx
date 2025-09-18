import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaEllipsisV, FaDownload } from 'react-icons/fa';
import Pagination from '../../components/common/Pagination';
import usePagination from '../../hooks/usePagination';
import DataTableFilters from '../../components/common/DataTableFilters';
import axios from '../../lib/axios';
import { Link } from "react-router-dom";

const AdminOrdersManager = () => {
    const { pagination, updatePagination } = usePagination();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
    const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFilters, setExportFilters] = useState({
        dateRange: { start: '', end: '' },
        status: 'all',
        paymentStatus: 'all'
    });
    const dropdownRef = useRef(null);

    // Order status options
    const statusFilterOptions = [
        { value: "all", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "received", label: "Received" },
        { value: "cancelled", label: "Cancelled" },
        { value: "refunded", label: "Refunded" }
    ];

    // Payment status options
    const paymentStatusOptions = [
        { value: "all", label: "All Payment Statuses" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" }
    ];

    const buildQueryString = (page, search, status, paymentStatus, startDate, endDate) => {
        let query = `page=${page}&search=${search}`;
        if (status && status !== 'all') query += `&status=${status}`;
        if (paymentStatus && paymentStatus !== 'all') query += `&paymentStatus=${paymentStatus}`;
        if (startDate) query += `&startDate=${startDate}`;
        if (endDate) query += `&endDate=${endDate}`;
        return query;
    };

    const fetchOrders = async (page = 1, search = '', status = '', paymentStatus = '', startDate = '', endDate = '') => {
        setLoading(true);
        try {
            const url = `api/v1/orders?${buildQueryString(page, search, status, paymentStatus, startDate, endDate)}`;
            const response = await axios.get(url);

            if (response.data.status === 'success') {
                setOrders(response.data.data.orders);
                updatePagination({
                    currentPage: response.data.pagination.currentPage,
                    totalPages: response.data.pagination.totalPages,
                    totalItems: response.data.pagination.totalItems
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders(1, searchQuery, statusFilter, paymentStatusFilter, dateRangeFilter.start, dateRangeFilter.end);
    };

    const handlePageChange = (page) => {
        fetchOrders(page, searchQuery, statusFilter, paymentStatusFilter, dateRangeFilter.start, dateRangeFilter.end);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(status);
        fetchOrders(1, searchQuery, status === 'all' ? '' : status, paymentStatusFilter, dateRangeFilter.start, dateRangeFilter.end);
    };

    const handlePaymentStatusChange = (status) => {
        setPaymentStatusFilter(status);
        fetchOrders(1, searchQuery, statusFilter, status === 'all' ? '' : status, dateRangeFilter.start, dateRangeFilter.end);
    };

    const handleDateRangeChange = (type, value) => {
        setDateRangeFilter(prev => ({ ...prev, [type]: value }));
    };

    const applyDateFilter = () => {
        fetchOrders(1, searchQuery, statusFilter, paymentStatusFilter, dateRangeFilter.start, dateRangeFilter.end);
    };

    const clearDateFilter = () => {
        setDateRangeFilter({ start: '', end: '' });
        fetchOrders(1, searchQuery, statusFilter, paymentStatusFilter);
    };

    const handleExport = async () => {
        setExportLoading(true);
        try {
            const query = buildQueryString(1, '', exportFilters.status, exportFilters.paymentStatus, exportFilters.dateRange.start, exportFilters.dateRange.end);
            const url = `api/v1/orders/export?${query}&format=excel`;

            const response = await axios.get(url, { responseType: 'blob' });

            // Create download link
            const blob = new Blob([response.data], { type: 'text/xlsx' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `orders_export_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            toast.success('Orders exported successfully');
            setShowExportModal(false);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export orders');
        } finally {
            setExportLoading(false);
        }
    };

    const toggleDropdown = (orderId) => {
        setActiveDropdown(activeDropdown === orderId ? null : orderId);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setStatusUpdating(orderId);
        try {
            const response = await axios.patch(`api/v1/orders/${orderId}/status`, {
                status: newStatus
            });

            if (response.data.status === 'success') {
                toast.success('Order status updated successfully');
                setOrders(orders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        } finally {
            setStatusUpdating(null);
            setActiveDropdown(null);
        }
    };

    const getStatusActions = (currentStatus) => {
        const actions = [];

        const statusTransitions = {
            pending: ['processing', 'cancelled'],
            processing: ['shipped', 'cancelled'],
            shipped: ['delivered'],
            delivered: ['refunded'],
            cancelled: [],
            refunded: []
        };

        statusTransitions[currentStatus]?.forEach(status => {
            actions.push({
                value: status,
                label: `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}`
            });
        });

        return actions;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="">
            {/* Header and Search */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Management</h1>
                <DataTableFilters
                    searchTerm={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                    onSearchSubmit={handleSearch}
                    filters={[
                        {
                            type: 'select',
                            value: statusFilter,
                            onChange: (e) => handleStatusChange(e.target.value),
                            options: statusFilterOptions,
                            label: 'Order Status'
                        },
                        {
                            type: 'select',
                            value: paymentStatusFilter,
                            onChange: (e) => handlePaymentStatusChange(e.target.value),
                            options: paymentStatusOptions,
                            label: 'Payment Status'
                        },
                        {
                            type: 'date-range',
                            startDate: dateRangeFilter.start,
                            endDate: dateRangeFilter.end,
                            onStartDateChange: (e) => handleDateRangeChange('start', e.target.value),
                            onEndDateChange: (e) => handleDateRangeChange('end', e.target.value),
                            onApply: applyDateFilter,
                            onClear: clearDateFilter
                        }
                    ]}
                    totalItems={pagination.totalItems}
                    searchPlaceholder="Search orders by order id..."
                    extraButtons={
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center text-sm"
                        >
                            <FaDownload className="mr-2" />
                            Export
                        </button>
                    }
                />
            </div>

            {/* Status error message */}
            {statusError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {statusError}
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Export Orders</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="date"
                                        value={exportFilters.dateRange.start}
                                        onChange={(e) => setExportFilters(prev => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, start: e.target.value }
                                        }))}
                                        className="border rounded-md px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={exportFilters.dateRange.end}
                                        onChange={(e) => setExportFilters(prev => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, end: e.target.value }
                                        }))}
                                        className="border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                                <select
                                    value={exportFilters.status}
                                    onChange={(e) => setExportFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="border rounded-md px-3 py-2 text-sm w-full"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                <select
                                    value={exportFilters.paymentStatus}
                                    onChange={(e) => setExportFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                                    className="border rounded-md px-3 py-2 text-sm w-full"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={exportLoading}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {exportLoading ? 'Exporting...' : 'Export'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
                </div>
            )}

            {/* Table with data */}
            {!loading && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {order.orderNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={order.user?.photo || '/images/default-user.png'}
                                                            alt={order.user?.firstName}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {order.user?.firstName} {order.user?.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.deliveryAddress?.city || order.deliveryAddress?.state}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                        order.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                                order.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                <button
                                                    onClick={() => toggleDropdown(order.id)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    disabled={statusUpdating === order.id}
                                                >
                                                    {statusUpdating === order.id ? (
                                                        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <FaEllipsisV />
                                                    )}
                                                </button>

                                                {activeDropdown === order.id && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                                    >
                                                        <div className="py-1">
                                                            {/* {getStatusActions(order.status).map((action) => (
                                                                <button
                                                                    key={action.value}
                                                                    onClick={() => updateOrderStatus(order.id, action.value)}
                                                                    disabled={statusUpdating === order.id}
                                                                    className={`block px-4 py-2 text-sm w-full text-left ${
                                                                        statusUpdating === order.id 
                                                                            ? 'text-gray-400 cursor-not-allowed' 
                                                                            : 'text-gray-700 hover:bg-gray-100'
                                                                    }`}
                                                                >
                                                                    {statusUpdating === order.id ? (
                                                                        <span className="flex items-center">
                                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                            </svg>
                                                                            Processing...
                                                                        </span>
                                                                    ) : (
                                                                        action.label
                                                                    )}
                                                                </button>
                                                            ))} */}
                                                            <Link
                                                                to={`/manage/admin/orders/${order.id}`}
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.length > 0 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            perPage={pagination.perPage}
                            onPageChange={handlePageChange}
                            loading={loading}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminOrdersManager;