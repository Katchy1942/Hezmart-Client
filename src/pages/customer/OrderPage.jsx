import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiClock, 
    FiCheckCircle, 
    FiTruck, 
    FiXCircle,
    FiEye
} from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import { OrderSkeleton } from './OrderSkeleton';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('api/v1/orders?view=buyer');
                if(response.data.status === 'success'){
                    setOrders(response.data.data.orders);
                }
            } catch (error) {
                const msg = error.response?.data?.message || 'Failed to fetch';
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        const props = { className: "w-3 h-3" };
        switch (status.toLowerCase()) {
            case 'pending': 
                return <FiClock {...props} className="text-yellow-500 w-3 h-3" />;
            case 'processing': 
            case 'shipped':
            case 'partially_shipped':
                return <FiTruck {...props} className="text-blue-500 w-3 h-3" />;
            case 'delivered':
            case 'completed':
                return <FiCheckCircle {...props} className="text-green-500 w-3 h-3" />;
            case 'cancelled':
            case 'closed':
                return <FiXCircle {...props} className="text-red-500 w-3 h-3" />;
            default: 
                return <FiClock {...props} className="text-gray-400 w-3 h-3" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className='min-h-screen sm:py-12'>
                <h1 className="text-2xl 
                    font-semibold 
                    text-gray-900 
                    font-['poppins']
                    mb-4"
                >
                    My Orders
                </h1>
                <OrderSkeleton />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:py-12 min-h-screen">
            <div className="flex items-center mb-4">
                <h1 className="text-2xl 
                    font-semibold 
                    text-gray-900 
                    font-['poppins']"
                >
                    My Orders
                </h1>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <h3 className="text-sm font-medium text-gray-600">
                        No orders found
                    </h3>
                    <Link
                        to="/products"
                        className="mt-4 px-4 py-1.5 rounded-full text-xs font-medium 
                        text-white bg-primary-light hover:bg-primary-dark transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <>
                    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                        Order ID
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                        Total
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                        Items
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">
                                        Delivery
                                    </th>
                                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                                            #{order.orderNumber}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                {getStatusIcon(order.status)}
                                                <span className="text-xs text-gray-700 capitalize truncate max-w-[100px]">
                                                    {order.status.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs font-semibold text-gray-900">
                                            ₦{parseFloat(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                            {order.items.length}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 capitalize">
                                            {getDeliverySummary(order.items)}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right text-xs font-medium">
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="text-primary-light hover:text-primary-dark"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Compact Cards */}
                    <div className="md:hidden space-y-3">
                        {orders.map((order) => (
                            <div 
                                key={order.id} 
                                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-900">
                                            #{order.orderNumber}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {formatDate(order.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        {getStatusIcon(order.status)}
                                        <span className="text-[10px] font-medium text-gray-700 capitalize">
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 py-2 border-t border-b border-gray-50 my-2">
                                    <div>
                                        <p className="text-[10px] text-gray-400">Total</p>
                                        <p className="text-xs font-bold text-gray-800">
                                            ₦{parseFloat(order.total).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400">Items</p>
                                        <p className="text-xs font-medium text-gray-700">
                                            {order.items.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] text-gray-500 capitalize flex items-center gap-1">
                                        <FiTruck className="w-3 h-3" />
                                        {getDeliverySummary(order.items)}
                                    </span>
                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="inline-flex items-center justify-center px-3 py-1 text-[10px] 
                                        font-medium rounded border border-primary-light text-primary-light 
                                        hover:bg-primary-light hover:text-white transition-colors"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const getDeliverySummary = (items) => {
    const statusCounts = items.reduce((acc, item) => {
        acc[item.fulfillmentStatus] = (acc[item.fulfillmentStatus] || 0) + 1;
        return acc;
    }, {});

    const priority = [
        'cancelled', 'returned', 'received', 
        'delivered', 'shipped', 'processing', 'pending'
    ];

    for (const status of priority) {
        if (statusCounts[status]) {
            if (statusCounts[status] === items.length) return status;
            return `partially ${status}`;
        }
    }
    return 'pending';
};

export default OrderPage;