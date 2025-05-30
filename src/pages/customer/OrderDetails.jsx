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
  FiPrinter
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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-900">
                  {order.deliveryAddress.firstName} {order.deliveryAddress.lastName} <br />
                  {order.deliveryAddress.primaryPhone} <br />
                  {order.deliveryAddress.primaryAddress}<br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
                  {order.deliveryAddress.country}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {order.paymentStatus === 'paid' ? (
                        <span className="text-green-600">Paid</span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₦{order.subtotal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Delivery Fee</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₦{order.deliveryFee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="text-sm font-medium text-gray-900">
                      -₦{order.discount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₦{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
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
                        {item.shippedAt && (
                          <div className="mt-1 text-xs text-gray-500">
                            Shipped on: {formatDate(item.shippedAt)}
                          </div>
                        )}
                        {item.deliveredAt && (
                          <div className="mt-1 text-xs text-gray-500">
                            Delivered on: {formatDate(item.deliveredAt)}
                          </div>
                        )}
                      </div>
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
                        )}
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
              <FiPrinter className="mr-2" />
              Print Invoice
            </button>

            {order.status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                Cancel Order
              </button>
            )}
            
            {order.paymentStatus === 'pending' && (
              <Button
                disabled={verifying}
                onClick={handleVerifyPayment}
              >
                {verifying ? (
                  <span className='flex items-center'>
                    <LoadingSpinner /> Verifying..
                  </span>
                ) : 'Verify Payment'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;