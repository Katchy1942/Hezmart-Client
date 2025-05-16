import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiXCircle,
  FiStar,
  FiEdit2
} from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import Button from './../../components/common/Button';
import LoadingSpinner from './../../components/common/LoadingSpinner';
import { FaStar, FaRegStar } from "react-icons/fa";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 1,
    comment: '',
    productId: null
  });
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get("trxref");

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
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'processing': return <FiTruck className="text-blue-500" />;
      case 'completed': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiClock className="text-gray-500" />;
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

  const handleVerifyPayment = async (id) => {
    setSelectedId(id);
    setVerifying(true);
    try {
      const res = await axios.get(`api/v1/orders/verify-payment/${reference}`);
      if (res.data.status === 'success') {
        toast.success("Payment Verified Successfully."); 
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`/api/orders/${orderId}/cancel`);
      toast.success('Order cancellation requested');
      const response = await axios.get('/api/orders');
      setOrders(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingReview ? 
        `api/v1/reviews/${editingReview.id}` : 
        'api/v1/reviews';
      
      const method = editingReview ? 'put' : 'post';
      
      const response = await axios[method](endpoint, {
        rating: newReview.rating,
        comment: newReview.comment,
        productId: newReview.productId
      });

      toast.success(editingReview ? 'Review updated!' : 'Review submitted!');
      
      // Update the orders state to reflect the new review
      setOrders(prevOrders => 
        prevOrders.map(order => ({
          ...order,
          items: order.items.map(item => {
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
        }))
      );

      setEditingReview(null);
      setNewReview({
        rating: 5,
        comment: '',
        productId: null
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEditReview = (review, productId) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      comment: review.comment,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
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
                {/* {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({...newReview, rating})
                )} */}
                 {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="text-2xl mr-1"
                  >
                    {star <= newReview.rating ? (
                      <FaStar className="text-primary-light" />
                      ) : (
                      <FaRegStar className="text-primary-light" />
                    )}
                  </button>
                  ))}
                  
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-light focus:border-primary-light"
                  rows="4"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  required
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
                <Button type="submit">
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {order.deliveryAddress.firstName} {order.deliveryAddress.lastName} <br />
                        {order.deliveryAddress.primaryPhone} <br />
                        {order.deliveryAddress.primaryAddress}<br />
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

                            {/* Reviews Section */}
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
                                    {item.product.reviews.find(r => r.userId === order.userId).comment}
                                  </p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setNewReview({
                                    rating: 5,
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
                  {order.paymentStatus === 'pending' && (
                    <Button
                      disabled={verifying}
                      onClick={() => handleVerifyPayment(order.id)}
                      className="inline-flex items-center"
                    >
                      {verifying && selectedId === order.id ? (
                        <span className='flex items-center'>
                          <LoadingSpinner /> Verifying..
                        </span>
                      ) : 'Verify Payment'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;