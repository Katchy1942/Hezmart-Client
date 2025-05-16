import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('api/v1/orders');
        setOrders(response.data.data.orders);
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
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiTruck className="text-blue-500" />;
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link to="/account" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Back to Account
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-6">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-gray-500">You haven't placed any orders yet</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-light hover:bg-primary-dark"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {orders && orders.map((order) => (
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
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {order.deliveryAddress.street}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                        {order.deliveryAddress.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {order.paymentMethod}
                      </p>
                      <p className="mt-1 text-sm text-gray-900">
                        {order.paymentStatus === 'paid' ? (
                          <span className="text-green-600">Paid</span>
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Order Total</h4>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        ₦{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.id} className="py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={item.product.coverImage}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </h5>
                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                                      <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                            <div className="mt-2 flex justify-between">
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm text-gray-500">
                                ₦{item.price.toLocaleString()} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Print Invoice
                  </button>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-light hover:bg-primary-dark"
                  >
                    View Details
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

const handleCancelOrder = async (orderId) => {
  try {
    await axios.patch(`/api/orders/${orderId}/cancel`);
    toast.success('Order cancellation requested');
    // Refresh orders after cancellation
    const response = await axios.get('/api/orders');
    setOrders(response.data.data);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to cancel order');
  }
};

export default OrderPage;