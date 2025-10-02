import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../lib/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button'
import { 
  FiChevronLeft, 
  FiPrinter, 
  FiMail, 
  FiTruck, 
  FiPackage, 
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiDollarSign,
  FiTrash2
} from 'react-icons/fi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [itemStatusUpdating, setItemStatusUpdating] = useState(null);
  const [notes, setNotes] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
        setCancellationReason(response.data.data.order.cancellationReason || '');
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

  const cancelOrder = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please enter a cancellation reason');
      return;
    }

    setCancelling(true);
    try {
      const response = await axios.patch(`/api/v1/orders/${orderId}/cancel`, {
        cancellationReason: cancellationReason.trim()
      });

      if (response.data.status === 'success') {
        toast.success('Order cancelled successfully');
        setOrder(prev => ({ 
          ...prev, 
          status: 'cancelled',
          cancellationReason: cancellationReason.trim()
        }));
        setShowCancelForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
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

  const confirmPayment = async () => {
    setConfirmingPayment(true);
    try {
      const response = await axios.patch(`/api/v1/orders/${orderId}/confirm-payment`);
      if (response.data.status === 'success') {
        toast.success('Payment confirmed successfully');
        setOrder(prev => ({ ...prev, paymentStatus: 'paid' }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const deleteOrder = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(`/api/v1/orders/${orderId}`);
      if (response.status === 204) {
        toast.success('Order deleted successfully');
        navigate('/manage/admin/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePrint = () => {
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.orderNumber} - Admin Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1000px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #ddd;
              padding-bottom: 20px;
            }
            .company-info {
              margin-bottom: 20px;
            }
            .order-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-weight: bold;
              border-bottom: 1px solid #eee;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .order-items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            .order-items th {
              background-color: #f8f9fa;
              text-align: left;
              padding: 12px;
              border-bottom: 2px solid #ddd;
            }
            .order-items td {
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            .order-summary {
              width: 100%;
              max-width: 400px;
              margin-left: auto;
            }
            .order-summary td {
              padding: 8px 0;
            }
            .order-summary .total {
              font-weight: bold;
              border-top: 2px solid #ddd;
              padding-top: 10px;
            }
            .status {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: bold;
            }
            .status-pending { background-color: #fef3cd; color: #856404; }
            .status-paid { background-color: #d4edda; color: #155724; }
            .status-delivered { background-color: #d4edda; color: #155724; }
            .status-shipped { background-color: #cce5ff; color: #004085; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            @media print {
              body { padding: 15px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <div class="company-info">
              <h2>Hezmart Nigeria Limited</h2>
              <p>No 189 Ugwuaji Road, Maryland Plaza, Enugu State</p>
              <p>Phone: (+234) 091-600-02490 | Email: hezmartng@gmail.com</p>
            </div>
          </div>

          <div class="order-info">
            <div>
              <p><strong>Order Number:</strong> #${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>Status:</strong> <span class="status status-${order.status}">${order.status.replace(/_/g, ' ')}</span></p>
              <p><strong>Payment Status:</strong> <span class="status status-${order.paymentStatus}">${order.paymentStatus}</span></p>
            </div>
            <div>
              <p><strong>Customer:</strong> ${order.user?.firstName} ${order.user?.lastName}</p>
              <p><strong>Email:</strong> ${order.user?.email || order.deliveryAddress?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${order.deliveryAddress?.primaryPhone || 'N/A'}</p>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Delivery Address</h3>
            <p>${order.deliveryAddress?.firstName} ${order.deliveryAddress?.lastName}</p>
            <p>${order.deliveryAddress?.primaryAddress}</p>
            <p>${order.deliveryAddress?.city || ''} ${order.deliveryAddress?.state || ''}</p>
          </div>

          <div class="section">
            <h3 class="section-title">Delivery Method</h3>
            <p><strong>${order.deliveryOption === 'door' ? 'Door Delivery' : 'Pickup Station'}</strong></p>
            ${order.deliveryOption === 'door' ? `
              <p>State: ${order.stateFeeDetails?.state || 'N/A'}</p>
              <p>Delivery Fee: ${formatCurrency(order.stateFeeDetails?.fee || 0)}</p>
            ` : `
              <p>Station: ${order.pickupStationDetails?.name || 'N/A'}</p>
              <p>Address: ${order.pickupStationDetails?.address || 'N/A'}</p>
              <p>State: ${order.pickupStationDetails?.state || 'N/A'}</p>
              <p>Contact: ${order.pickupStationDetails?.contactPhone || 'N/A'}</p>
              <p>Pickup Fee: ${formatCurrency(order.pickupStationDetails?.fee || 0)}</p>
            `}
          </div>

          <div class="section">
            <h3 class="section-title">Order Items</h3>
            <table class="order-items">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.items?.map(item => `
                  <tr>
                    <td>${item.product?.name || 'N/A'}</td>
                    <td>${item.vendor?.businessName || 'N/A'}</td>
                    <td>${formatCurrency(item.discountPrice || item.price || 0)}</td>
                    <td>${item.quantity}</td>
                    <td>${item.fulfillmentStatus?.charAt(0).toUpperCase() + item.fulfillmentStatus?.slice(1) || 'N/A'}</td>
                    <td class="text-right">${formatCurrency((item.discountPrice || item.price || 0) * item.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="order-summary">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td class="text-right">${formatCurrency(order.subtotal || 0)}</td>
              </tr>
              ${parseFloat(order.discount || 0) > 0 ? `
                <tr>
                  <td>Discount:</td>
                  <td class="text-right">-${formatCurrency(order.discount)}</td>
                </tr>
              ` : ''}
              <tr>
                <td>Shipping:</td>
                <td class="text-right">${formatCurrency(order.deliveryFee || 0)}</td>
              </tr>
              ${parseFloat(order.tax || 0) > 0 ? `
                <tr>
                  <td>Tax:</td>
                  <td class="text-right">${formatCurrency(order.tax)}</td>
                </tr>
              ` : ''}
              <tr class="total">
                <td>Total:</td>
                <td class="text-right">${formatCurrency(order.total || 0)}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h3 class="section-title">Payment Information</h3>
            <p><strong>Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Status:</strong> <span class="status status-${order.paymentStatus}">${order.paymentStatus}</span></p>
          </div>

          ${order.paymentMethod === 'crypto' && order.walletDetails ? `
            <div class="section">
              <h3 class="section-title">Wallet Information</h3>
              <p><strong>Wallet:</strong> ${order.walletDetails.name}</p>
              <p><strong>Address:</strong> ${order.walletDetails.address}</p>
            </div>
          ` : ''}

          <div class="text-center no-print" style="margin-top: 40px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Invoice
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
              Close Window
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

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

  const isCancelled = order.status === 'cancelled' || order.status === 'partially_cancelled';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Delete Order</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete order #{order.orderNumber}? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteOrder}
                  disabled={deleting}
                  className="cursor-pointer px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Link to="/manage/admin/orders" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Back to orders
        </Link>
        <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiPrinter className="mr-1 sm:mr-2" /> 
            <span className="hidden sm:inline">Print</span>
          </button>
          {!isCancelled && (
            <button 
              onClick={() => setShowCancelForm(true)}
              className="cursor-pointer flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <FiXCircle className="mr-1 sm:mr-2" /> 
              <span className="hidden sm:inline">Cancel Order</span>
            </button>
          )}
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="cursor-pointer flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <FiTrash2 className="mr-1 sm:mr-2" /> 
            <span className="hidden sm:inline">Delete</span>
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
                <p>{order.deliveryAddress?.city || order.deliveryAddress?.state}</p>
                <p className="mt-1 sm:mt-2">Phone: {order.deliveryAddress?.primaryPhone}</p>
                <p className="mt-1 sm:mt-2">Email: {order.deliveryAddress?.email}</p>
              </div>
            </div>

            {/* Delivery Option */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                {order.deliveryOption === 'door' ? 'Door Delivery' : 'Pickup Station'}
              </h4>
              {order.deliveryOption === 'door' ? (
                <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <p>State: {order.stateFeeDetails?.state}</p>
                  <p>Delivery Fee: {formatCurrency(order.stateFeeDetails?.fee || 0)}</p>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <p>Station: {order.pickupStationDetails?.name}</p>
                  <p>Address: {order.pickupStationDetails?.address}</p>
                  <p>State: {order.pickupStationDetails?.state}</p>
                  <p>Contact: {order.pickupStationDetails?.contactPhone}</p>
                  <p>Pickup Fee: {formatCurrency(order.pickupStationDetails?.fee || 0)}</p>
                </div>
              )}
            </div>

            {/* Wallet Details (for crypto payments) */}
            {order.paymentMethod === 'crypto' && order.walletDetails && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Wallet Information</h4>
                <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <p>Wallet: {order.walletDetails.name}</p>
                  <p className="break-all">Address: {order.walletDetails.address}</p>
                  {order.walletDetails.barcode && (
                    <div className="mt-2">
                      <img 
                        src={order.walletDetails.barcode} 
                        alt="Wallet barcode"
                        className="h-24 mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

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
                    <span className="text-xs sm:text-sm font-medium">-${formatCurrency(order.discount)}</span>
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
                {order.paymentStatus === 'pending' && (
                  <div className="pt-2">
                    <Button
                      onClick={confirmPayment}
                      disabled={confirmingPayment}
                      isLoading={confirmingPayment}
                      loadingText="Confirming..."
                      icon={<FiDollarSign />}
                      iconPosition="left"
                      className="w-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Confirm Payment Received
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Cancel Order Form */}
            {showCancelForm && !isCancelled && (
              <div className="bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg">
                <h4 className="text-base sm:text-lg font-medium text-red-900 mb-3 sm:mb-4">Cancel Order</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="cancellationReason" className="block text-sm font-medium text-red-700 mb-1">
                      Reason for Cancellation *
                    </label>
                    <textarea
                      id="cancellationReason"
                      rows="3"
                      className="shadow-sm focus:ring-red-500 focus:outline-0 px-3 py-2 focus:border-red-500 block w-full sm:text-sm border border-red-300 rounded-md"
                      placeholder="Please provide the reason for cancelling this order..."
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={cancelOrder}
                      disabled={cancelling || !cancellationReason.trim()}
                      className="cursor-pointer flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelling ? 'Cancelling...' : 'Proceed'}
                    </button>
                    <button
                      onClick={() => setShowCancelForm(false)}
                      className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancellation Reason Display */}
            {isCancelled && order.cancellationReason && (
              <div className="bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg">
                <h4 className="text-base sm:text-lg font-medium text-red-900 mb-3 sm:mb-4">Cancellation Reason</h4>
                <div className="text-sm text-red-700 bg-white p-3 rounded border border-red-100">
                  {order.cancellationReason}
                </div>
              </div>
            )}

            {/* Order Notes */}
            {/* {!isCancelled && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Order Notes</h4>
                <textarea
                  rows="3"
                  className="shadow-sm focus:ring-primary-light focus:border-primary-light block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Add notes about this order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  onClick={saveNotes}
                  className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-light hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
                >
                  Save Notes
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;