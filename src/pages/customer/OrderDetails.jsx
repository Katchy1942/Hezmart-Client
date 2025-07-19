import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiXCircle,
  FiStar,
  FiEdit2,
  FiPackage,
  FiPrinter,
  FiDollarSign
} from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InputField from '../../components/common/InputField';
import { FaStar, FaRegStar } from "react-icons/fa";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 1,
    comment: '',
    productId: null
  });
  const [markingReceived, setMarkingReceived] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`api/v1/orders/${id}`);
        if(response.data.status === 'success'){
          setOrder(response.data.data.order);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch order');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
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

  const handleVerifyPayment = async () => {
    setVerifying(true);
    try {
      const res = await axios.get(`api/v1/orders/verify-payment/${order.orderNumber}`);
      if (res.data.status === 'success') {
        toast.success("Payment Verified Successfully."); 
        setOrder(res.data.data.order);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleConfirmPayment = async () => {
    setConfirmingPayment(true);
    try {
      const response = await axios.post(`api/v1/orders/${order.id}/confirm-payment`);
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

  const handleCancelOrder = async () => {
    try {
      await axios.patch(`/api/orders/${order.id}/cancel`);
      toast.success('Order cancellation requested');
      const response = await axios.get(`/api/orders/${order.id}`);
      setOrder(response.data.data.order);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleMarkAsReceived = async (itemId) => {
    setMarkingReceived(itemId);
    try {
      const response = await axios.patch(`/api/v1/orders/items/${itemId}/status`, {status:'received'});
      if(response.data.status === 'success'){
        toast.success('Item marked as received');
        setOrder(prevOrder => ({
          ...prevOrder,
          items: prevOrder.items.map(item => {
            if (item.id === itemId) {
              return {
                ...item,
                fulfillmentStatus: 'received',
                receivedAt: new Date().toISOString()
              };
            }
            return item;
          })
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark item as received');
    } finally {
      setMarkingReceived(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const endpoint = editingReview ? 
        `api/v1/reviews/${editingReview.id}` : 
        `api/v1/products/${newReview.productId}/reviews`;
      
      const method = editingReview ? 'patch' : 'post';
      
      const response = await axios[method](endpoint, {
        rating: newReview.rating,
        review: newReview.comment
      });
      
      if(response.data.status === 'success'){
        toast.success(editingReview ? 'Review updated!' : 'Review submitted!');
      
        setOrder(prevOrder => ({
          ...prevOrder,
          items: prevOrder.items.map(item => {
            if (item.product.id === newReview.productId) {
              return {
                ...item,
                product: {
                  ...item.product,
                  reviews: editingReview
                    ? item.product.reviews.map(r => 
                        r.id === editingReview.id ? response.data.data.review : r
                      )
                    : [...(item.product.reviews || []), response.data.data.review]
                }
              };
            }
            return item;
          })
        }));

        setEditingReview(null);
        setNewReview({
          rating: 1,
          comment: '',
          productId: null
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = (review, productId) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      comment: review.review,
      productId
    });
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "span"}
            onClick={interactive ? () => onChange(star) : null}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <FiStar
              className={`h-5 w-5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link to="/orders" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-6">Order Details</h1>
      </div>

      {/* Review Form Modal */}
      {newReview.productId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editingReview ? 'Edit Review' : 'Add Review'}
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-2xl text-primary-light focus:outline-none"
                  >
                    {star <= newReview.rating ? <FaStar /> : <FaRegStar />}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <InputField
                  as="textarea"
                  label="Comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  required
                  rows={4}
                  classNames="w-full"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setNewReview({...newReview, productId: null})}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={submittingReview}>
                  {submittingReview ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="small" className="mr-2" />
                      {editingReview ? 'Updating...' : 'Submitting...'}
                    </span>
                  ) : editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="p-4 sm:p-6">
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

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer and Delivery Info */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src={order.user?.photo || '/images/default-user.png'} 
                      alt={order.user?.firstName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{order.deliveryAddress?.primaryPhone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Address</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}</p>
                  <p>{order.deliveryAddress?.primaryAddress}</p>
                  <p>{order.deliveryAddress?.city || order.deliveryAddress?.state}</p>
                  <p className="mt-1">Phone: {order.deliveryAddress?.primaryPhone}</p>
                  <p className="mt-1">Email: {order.deliveryAddress?.email}</p>
                </div>
              </div>

              {/* Delivery Option */}
              {order.deliveryOption && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {order.deliveryOption === 'door' ? 'Door Delivery' : 'Pickup Station'}
                  </h4>
                  {order.deliveryOption === 'door' ? (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>State: {order.stateFeeDetails?.state}</p>
                      <p>Delivery Fee: {formatCurrency(order.stateFeeDetails?.fee || 0)}</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Station: {order.pickupStationDetails?.name}</p>
                      <p>Address: {order.pickupStationDetails?.address}</p>
                      <p>State: {order.pickupStationDetails?.state}</p>
                      <p>Contact: {order.pickupStationDetails?.contactPhone}</p>
                      <p>Pickup Fee: {formatCurrency(order.pickupStationDetails?.fee || 0)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Wallet Details (for crypto payments) */}
              {order.paymentMethod === 'crypto' && order.walletDetails && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Wallet Information</h4>
                  <div className="text-sm text-gray-700 space-y-1">
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
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <h4 className="text-sm font-medium text-gray-900 p-4 border-b border-gray-200">
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
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.product?.name}
                              </p>
                              <div className="flex items-center mt-1">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden">
                                  <img
                                    src={item.vendor?.businessLogo || '/images/default-business.png'}
                                    alt={item.vendor?.businessName}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <p className="text-xs text-gray-500 ml-2 truncate">
                                    {item.vendor?.businessName}
                                  </p>
                                </div>
                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                                      <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 whitespace-nowrap pl-2">
                                {formatCurrency(item.discountPrice || item.price)}
                              </p>
                            </div>
                            <div className="mt-2 flex justify-between items-end">
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                Subtotal: {formatCurrency((item.discountPrice || item.price) * item.quantity)}
                              </p>
                            </div>

                            {/* Item Status Section */}
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-xs font-medium text-gray-500 mr-2">Status:</span>
                                  <span className="text-xs font-medium capitalize">
                                    {item.fulfillmentStatus}
                                  </span>
                                </div>
                                {item.fulfillmentStatus === 'delivered' && !item.receivedAt && (
                                  <Button
                                    onClick={() => handleMarkAsReceived(item.id)}
                                    disabled={markingReceived === item.id}
                                    size="small"
                                    variant="primary"
                                  >
                                    {markingReceived === item.id ? (
                                      <LoadingSpinner size="small" />
                                    ) : (
                                      <>
                                        <FiPackage className="mr-1" />
                                        Mark as Received
                                      </>
                                    )}
                                  </Button>
                                )}
                                {item.receivedAt && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <FiCheckCircle className="mr-1" />
                                    Received on {formatDate(item.receivedAt)}
                                  </span>
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

                            {/* Review Section */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <h6 className="text-xs font-medium text-gray-500 mb-1">
                                Your Review
                              </h6>
                              {item.product.reviews?.find(r => r.userId === order.userId) ? (
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <div className="flex justify-between items-start">
                                    {renderStars(item.product.reviews.find(r => r.userId === order.userId).rating)}
                                    <button
                                      onClick={() => handleEditReview(
                                        item.product.reviews.find(r => r.userId === order.userId),
                                        item.product.id
                                      )}
                                      className="text-primary-light hover:text-primary-dark"
                                    >
                                      <FiEdit2 size={16} />
                                    </button>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-700">
                                    {item.product.reviews.find(r => r.userId === order.userId).review}
                                  </p>
                                </div>
                              ) : (
                                item.fulfillmentStatus === 'received' ? (
                                  <button
                                    onClick={() => setNewReview({
                                      rating: 1,
                                      comment: '',
                                      productId: item.product.id
                                    })}
                                    className="text-sm text-primary-light hover:text-primary-dark font-medium"
                                  >
                                    + Add Review
                                  </button>
                                ) : (
                                  <p className="text-xs text-gray-500">
                                    You can add a review after receiving this item.
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Information and Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Method</span>
                    <span className="text-sm font-medium capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`text-sm font-medium ${
                      order.paymentStatus === 'paid' ? 'text-green-600' :
                      order.paymentStatus === 'pending' ? 'text-yellow-600' :
                      order.paymentStatus === 'failed' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                  {/* {order.paymentStatus === 'pending' && (
                    <div className="pt-2 space-y-2">
                      <Button
                        onClick={handleVerifyPayment}
                        disabled={verifying}
                        className="w-full"
                      >
                        {verifying ? (
                          <span className="flex items-center justify-center">
                            <LoadingSpinner size="small" className="mr-2" />
                            Verifying...
                          </span>
                        ) : 'Verify Payment'}
                      </Button>
                      <Button
                        onClick={handleConfirmPayment}
                        disabled={confirmingPayment}
                        variant="success"
                        className="w-full"
                      >
                        {confirmingPayment ? (
                          <span className="flex items-center justify-center">
                            <LoadingSpinner size="small" className="mr-2" />
                            Confirming...
                          </span>
                        ) : (
                          <>
                            <FiDollarSign className="mr-2" />
                            Confirm Payment
                          </>
                        )}
                      </Button>
                    </div>
                  )} */}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Discount</span>
                      <span className="text-sm font-medium">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="text-sm font-medium">{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  {parseFloat(order.tax) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax</span>
                      <span className="text-sm font-medium">{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Total</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiPrinter className="mr-2" />
                Print Invoice
              </button>

              {/* {order.status === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
  );
};

export default OrderDetails;