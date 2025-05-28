import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../lib/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  FiChevronLeft, 
  FiPrinter, 
  FiTruck, 
  FiPackage, 
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi';

const VendorOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemStatusUpdating, setItemStatusUpdating] = useState(null);
  const [vendorNotes, setVendorNotes] = useState('');

  // Item fulfillment status options (vendor can only update to these statuses)
  const fulfillmentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancel' }
  ];

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`api/v1/orders/${orderId}`);
      if (response.data.status === 'success') {
        setOrder(response.data.data.order);
        setVendorNotes(response.data.data.order.vendorNotes || '');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId, newStatus) => {
    setItemStatusUpdating(itemId);
    try {
      const response = await axios.patch(`api/v1/orders/items/${itemId}/status`, {
        status: newStatus,
        notes: vendorNotes
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
              ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() })
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
        <Link to="/vendor/orders" className="mt-4 inline-flex items-center text-primary-light hover:text-primary-dark">
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
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/manage/vendor/orders" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Back to orders
        </Link>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiPrinter className="mr-2" /> Print
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Order Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Order #{order.orderNumber}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Customer Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</p>
                <p>Phone: {order.deliveryAddress?.primaryPhone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>{order.deliveryAddress?.primaryAddress}</p>
                <p>{order.deliveryAddress?.city}</p>
                <p>{order.deliveryAddress?.country.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Middle Column - Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h4 className="text-lg font-medium text-gray-900 p-4 border-b border-gray-200">
                Order Items ({(order.items || []).length})
              </h4>
              <ul className="divide-y divide-gray-200">
                {order.items?.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex">
                      <div className="flex-shrink-0 h-20 w-20 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.product?.coverImage || '/images/default-product.png'}
                          alt={item.product?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.product?.name}
                            </p>
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                  <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.discountPrice || item.price)}
                          </p>
                        </div>
                        <div className="mt-2 flex justify-between items-end">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-900">
                            Subtotal: {formatCurrency((item.discountPrice || item.price) * item.quantity)}
                          </p>
                        </div>

                        {/* Item Status Section */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-gray-500 mr-2">Status:</span>
                              <span className={getItemStatusBadge(item.fulfillmentStatus)}>
                                {item.fulfillmentStatus.charAt(0).toUpperCase() + item.fulfillmentStatus.slice(1)}
                              </span>
                            </div>
                            {itemStatusUpdating === item.id ? (
                              <LoadingSpinner type="dots" size={4} />
                            ) : (
                              <select
                                value={item.fulfillmentStatus}
                                onChange={(e) => updateItemStatus(item.id, e.target.value)}
                                className="text-xs border-gray-300 focus:outline-none focus:ring-primary-light focus:border-primary-light rounded-md"
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
                          <div className="mt-1 space-y-1 text-xs text-gray-500">
                            {item.shippedAt && (
                              <div className="flex items-center">
                                <FiTruck className="mr-1" size={12} />
                                Shipped: {formatDate(item.shippedAt)}
                              </div>
                            )}
                            {item.deliveredAt && (
                              <div className="flex items-center">
                                <FiPackage className="mr-1" size={12} />
                                Delivered: {formatDate(item.deliveredAt)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Vendor Notes */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <label htmlFor={`vendor-notes-${item.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                            Your Notes (Private)
                          </label>
                          <textarea
                            id={`vendor-notes-${item.id}`}
                            rows={2}
                            value={vendorNotes}
                            onChange={(e) => setVendorNotes(e.target.value)}
                            className="shadow-sm focus:ring-primary-light focus:border-primary-light block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Add private notes about this item..."
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOrderDetails;