import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiChevronLeft, 
    FiClock, 
    FiCheckCircle, 
    FiTruck, 
    FiXCircle,
} from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
        try {
            const response = await axios.get('api/v1/orders');
            if(response.data.status === 'success'){
            setOrders(response.data.data.orders);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return <FiClock className="text-yellow-500" />;
            case 'processing': 
            case 'partially_shipped':
            case 'shipped':
            case 'partially_delivered':
                return <FiTruck className="text-blue-500" />;
            case 'delivered':
            case 'partially_received':
            case 'completed':
                return <FiCheckCircle className="text-green-500" />;
            case 'cancelled':
            case 'partially_cancelled':
            case 'closed':
            case 'refunded':
                return <FiXCircle className="text-red-500" />;
            default: return <FiClock className="text-gray-500" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-screen">
        <div className="flex items-center mb-6">
            <h1 className="text-2xl font-semibold font-['poppins'] text-gray-900 ml-6">My Orders</h1>
        </div>

        {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                    You have no orders
                </h3>
                <div className="mt-6">
                    <Link
                        to="/products"
                        className="w-full items-center px-4 py-2 rounded-full
                        shadow-sm text-sm font-medium text-white bg-primary-light"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <div key={order.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="mb-4 sm:mb-0">
                            <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">{getStatusIcon(order.status)}</span>
                            <span className="capitalize">{order.status.replace(/_/g, ' ')}</span>
                        </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Order Total</h4>
                            <p className="mt-1 text-lg font-medium text-gray-900">
                            ₦{parseFloat(order.total).toLocaleString('en-US')}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Items</h4>
                            <p className="mt-1 text-sm text-gray-900">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Delivery Status</h4>
                            <p className="mt-1 text-sm text-gray-900 capitalize">
                            {getDeliverySummary(order.items)}
                            </p>
                        </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                        <Link
                            to={`/orders/${order.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-light hover:bg-primary-dark"
                        >
                            View Order Details
                        </Link>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        )}
        </div>
    );
};

const getDeliverySummary = (items) => {
    const statusCounts = items.reduce((acc, item) => {
        acc[item.fulfillmentStatus] = (acc[item.fulfillmentStatus] || 0) + 1;
        return acc;
    }, {});

    const statusPriority = [
        'cancelled',
        'returned',
        'received',
        'delivered',
        'shipped',
        'processing',
        'pending'
    ];

    for (const status of statusPriority) {
        if (statusCounts[status]) {
        if (statusCounts[status] === items.length) {
            return status;
        }
        return `partially ${status}`;
        }
    }

    return 'pending';
};

export default OrderPage;