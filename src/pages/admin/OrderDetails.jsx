import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../lib/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  FiChevronLeft, 
  FiPrinter, 
  FiMail, 
  FiTruck, 
  FiPackage, 
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [itemStatusUpdating, setItemStatusUpdating] = useState(null);
  const [notes, setNotes] = useState('');

  // Order status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'partially_shipped', label: 'Partially Shipped' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'partially_delivered', label: 'Partially Delivered' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'partially_received', label: 'Partially Received' },
    { value: 'completed', label: 'Completed' },
    { value: 'partially_cancelled', label: 'Partially Cancelled' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'closed', label: 'Closed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  // Item fulfillment status options
  const fulfillmentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'received', label: 'Received' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' }
  ];

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/orders/${orderId}`);
      if (response.data.status === 'success') {
        setOrder(response.data.data.order);
        setNotes(response.data.data.order.customerNotes || '');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      const response = await axios.patch(`/api/v1/orders/${orderId}/status`, {
        status: newStatus,
        notes
      });

      if (response.data.status === 'success') {
        toast.success('Order status updated successfully');
        setOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const updateItemStatus = async (itemId, newStatus) => {
    setItemStatusUpdating(itemId);
    try {
      const response = await axios.patch(`/api/v1/orders/items/${itemId}/status`, {
        status: newStatus
      });

      if (response.data.status === 'success') {
        toast.success('Item status updated successfully');
        setOrder(prev => ({
          ...prev,
          items: prev.items.map(item => 
            item.id === itemId ? { 
              ...item, 
              fulfillmentStatus: newStatus,
              ...(newStatus === 'shipped' && { shippedAt: new Date().toISOString() }),
              ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() }),
              ...(newStatus === 'received' && { receivedAt: new Date().toISOString() })
            } : item
          )
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update item status');
    } finally {
      setItemStatusUpdating(null);
    }
  };

  const saveNotes = async () => {
    try {
      await axios.patch(`/api/v1/orders/${orderId}/notes`, { notes });
      toast.success('Notes saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save notes');
    }
  };

  const sendShippingNotification = async () => {
    try {
      await axios.post(`/api/v1/orders/${orderId}/send-shipping-notification`);
      toast.success('Shipping notification sent to customer');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner type="spinner" size={7} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Order not found</p>
        <Link to="/admin/orders" className="mt-4 inline-flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Back to orders
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'partially_shipped':
      case 'shipped':
      case 'partially_delivered':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'delivered':
      case 'partially_received':
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
      case 'partially_cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'closed':
      case 'refunded':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getItemStatusBadge = (status) => {
    const baseClasses = 'px-2 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'shipped':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'received':
        return `${baseClasses} bg-green-200 text-green-900`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'returned':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Link to="/manage/admin/orders" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Back to orders
        </Link>
        <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiPrinter className="mr-1 sm:mr-2" /> 
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {/* Order Header */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <p className="mt-0.5 max-w-2xl text-xs sm:text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center">
            <span className={getStatusBadge(order.status)}>
              {order.status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6">
          {/* Left Column - Customer and Shipping */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Customer Information</h4>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={order.user?.photo || '/images/default-user.png'} 
                    alt={order.user?.firstName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">{order.deliveryAddress?.primaryPhone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Shipping Address</h4>
              <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                <p>{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</p>
                <p>{order.deliveryAddress?.primaryAddress}</p>
                <p>{order.deliveryAddress?.city}</p>
                <p>{order.deliveryAddress?.country.toUpperCase()}</p>
                <p className="mt-1 sm:mt-2">Phone: {order.deliveryAddress?.primaryPhone}</p>
                {order.deliveryAddress?.secondaryPhone && (
                  <p>Alt. Phone: {order.deliveryAddress?.secondaryPhone}</p>
                )}
              </div>
            </div>
          </div>

           {/* Shipping Method */}
            {/* <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Shipping Method</h4>
              <div className="flex items-center">
                <FiTruck className="h-5 w-5 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Standard Shipping</p>
                  <p className="text-sm text-gray-500">
                    {order.trackingNumber 
                      ? `Tracking #: ${order.trackingNumber}`
                      : 'No tracking number provided'}
                  </p>
                </div>
              </div>
            </div> */}
          

          {/* Middle Column - Order Items */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 p-3 sm:p-4 border-b border-gray-200">
                Order Items ({(order.items || []).length})
              </h4>
              <ul className="divide-y divide-gray-200">
                {order.items?.map((item) => (
                  <li key={item.id} className="p-3 sm:p-4">
                    <div className="flex">
                      <div className="flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.product?.coverImage || '/images/default-product.png'}
                          alt={item.product?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div className="min-w-0">
                            <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                              {item.product?.name}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 rounded-full overflow-hidden">
                                <img
                                  src={item.vendor?.businessLogo || '/images/default-business.png'}
                                  alt={item.vendor?.businessName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2 truncate">
                                {item.vendor?.businessName}
                              </p>
                            </div>
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                  <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded text-2xs sm:text-xs font-medium bg-gray-100 text-gray-800">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap pl-2">
                            {formatCurrency(item.discountPrice || item.price)}
                          </p>
                        </div>
                        <div className="mt-2 flex justify-between items-end">
                          <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm sm:text-base font-medium text-gray-900 whitespace-nowrap">
                            Subtotal: {formatCurrency((item.discountPrice || item.price) * item.quantity)}
                          </p>
                        </div>

                        {/* Item Status Section */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xs sm:text-xs font-medium text-gray-500 mr-1 sm:mr-2">Status:</span>
                              <span className={getItemStatusBadge(item.fulfillmentStatus)}>
                                {item.fulfillmentStatus.charAt(0).toUpperCase() + item.fulfillmentStatus.slice(1)}
                              </span>
                            </div>
                           {itemStatusUpdating === item.id ? (
                              <LoadingSpinner type="dots" size={3} />
                            ) : (
                              <select
                                value={item.fulfillmentStatus}
                                onChange={(e) => updateItemStatus(item.id, e.target.value)}
                                className="text-2xs sm:text-xs border-gray-300 focus:outline-none focus:ring-primary-light focus:border-primary-light rounded-md"
                              >
                                {fulfillmentStatusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                          
                          {/* Status Timestamps */}
                          <div className="mt-1 space-y-1 text-2xs sm:text-xs text-gray-500">
                            {item.shippedAt && (
                              <div className="flex items-center">
                                <FiTruck className="mr-1" size={10} />
                                Shipped: {formatDate(item.shippedAt)}
                              </div>
                            )}
                            {item.deliveredAt && (
                              <div className="flex items-center">
                                <FiPackage className="mr-1" size={10} />
                                Delivered: {formatDate(item.deliveredAt)}
                              </div>
                            )}
                            {item.receivedAt && (
                              <div className="flex items-center">
                                <FiCheckCircle className="mr-1" size={10} />
                                Received: {formatDate(item.receivedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Order Summary and Actions */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Order Summary</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Subtotal</span>
                  <span className="text-xs sm:text-sm font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-xs sm:text-sm">Discount</span>
                    <span className="text-xs sm:text-sm font-medium">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Shipping</span>
                  <span className="text-xs sm:text-sm font-medium">{formatCurrency(order.deliveryFee)}</span>
                </div>
                {parseFloat(order.tax) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Tax</span>
                    <span className="text-xs sm:text-sm font-medium">{formatCurrency(order.tax)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 sm:pt-3 flex justify-between">
                  <span className="text-sm sm:text-base font-medium text-gray-900">Total</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Payment Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Method</span>
                  <span className="text-xs sm:text-sm font-medium capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Status</span>
                  <span className={`text-xs sm:text-sm font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' :
                    order.paymentStatus === 'pending' ? 'text-yellow-600' :
                    order.paymentStatus === 'failed' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;