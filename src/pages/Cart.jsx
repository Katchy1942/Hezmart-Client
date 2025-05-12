import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiChevronLeft, FiPlus } from 'react-icons/fi';
import { useCart } from '../components/contexts/CartContext';
import { toast } from 'react-toastify';
import axios from '../lib/axios';
import SelectField from '../components/common/SelectField';
import InputField from '../components/common/InputField';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    primaryPhone: currentUser?.primaryPhone || '',
    secondaryPhone: currentUser?.secondaryPhone || '',
    city: currentUser?.city || '',
    deliveryAddress: currentUser?.primaryAddress || '',
  });
  const [cities, setCities] = useState([
    'Abuja', 'Lagos', 'Kano', 'Ibadan', 'Port Harcourt', 
    'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos',
    'Owerri', 'Enugu', 'Abeokuta', 'Onitsha', 'Warri'
  ]);

  useEffect(() => {
    fetchCart();
    // Initialize address from user's primary address if available
    if (currentUser) {
      setSelectedAddress({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        primaryPhone: currentUser.primaryPhone,
        secondaryPhone: currentUser.secondaryPhone,
        city: currentUser.city,
        deliveryAddress: currentUser.primaryAddress
      });
    }
  }, []);

  const handleQuantityChange = async (productId, changeAmount) => {
    const item = cart.items.find(item => item.productId === productId);
    if (!item) return;
  
    const newQuantity = item.quantity + changeAmount;
    if (newQuantity < 1) return;

    const result = await updateQuantity(productId, newQuantity);
    if (result.success) {
      toast.success('Quantity updated');
    } else if (result.error) {
      toast.error(result.error.message || 'Failed to update quantity');
    }
  };
  
  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      toast.success('Item removed from cart');
    } else if (result.error) {
      toast.error(result.error.message || 'Failed to remove item');
    }
  };
  
  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      toast.success('Cart cleared');
    } else if (result.error) {
      toast.error(result.error.message || 'Failed to clear cart');
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.patch('/api/users', {
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        primaryPhone: newAddress.primaryPhone,
        secondaryPhone: newAddress.secondaryPhone,
        city: newAddress.city,
        primaryAddress: newAddress.deliveryAddress
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local user data
      const updatedUser = {
        ...currentUser,
        ...response.data.data
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSelectedAddress({
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        primaryPhone: newAddress.primaryPhone,
        secondaryPhone: newAddress.secondaryPhone,
        city: newAddress.city,
        deliveryAddress: newAddress.deliveryAddress
      });
      
      setShowAddressForm(false);
      toast.success('Address updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (!selectedAddress) {
      toast.error('Please provide your delivery address');
      return;
    }

    const allAvailable = cart.items?.every(item => item.available) ?? false;
    if (!allAvailable) {
      toast.error('Some items in your cart are no longer available');
      fetchCart();
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await axios.post('api/v1/orders/checkout-session', {
        shippingOptionId: selectedShipping,
        deliveryAddress: selectedAddress
      });

      window.location.href = response.data.data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };


  if (cart.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
      </div>
    );
  }

  if (cart.error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="text-red-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{cart.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
        <p className="mt-1 text-gray-500">Start adding some products to your cart</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-light hover:bg-primary-dark"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const { items = [], summary = {}, shippingOptions = [] } = cart;
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping) || shippingOptions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-6">Your Shopping Cart</h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={item.product?.coverImage || ''}
                        alt={item.product?.name || 'Product image'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/product/${item.productId}`}>{item.product?.name || 'Unnamed Product'}</Link>
                          </h3>
                          {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {Object.entries(item.selectedOptions).map(([key, value]) => (
                                <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                          {!item.available && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded">
                              Only {item.product?.stockQuantity || 0} available
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="ml-4 text-primary-light hover:text-primary-dark cursor-pointer"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-4 flex-1 flex items-end justify-between">
                        <div>
                          {item.product?.discountPrice  ? (
                            <div className="flex items-center">
                              <p className="text-lg font-medium text-primary-light">
                                ₦{((item.product?.discountPrice || 0) * item.quantity).toLocaleString()}
                              </p>
                              <p className="ml-2 text-sm text-gray-500 line-through">
                                ₦{((item.product?.price || 0) * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <p className="text-lg font-medium text-primary-light">
                              ₦{((item.product?.price || 0) * item.quantity).toLocaleString()}
                            </p>
                          )}
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              ₦{item.product?.discountPrice !== "0.00" 
                                ? (item.product?.discountPrice || 0).toLocaleString() 
                                : (item.product?.price || 0).toLocaleString()} each
                            </p>
                          )}
                        </div>

                        <div className="flex items-center border border-gray-300 bg-[#F0F0F0] rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.productId, -1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity >= (item.product?.stockQuantity || 0)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearCart}
              className="text-sm text-red-600 hover:text-red-800 flex items-center cursor-pointer"
            >
              <FiTrash2 className="mr-1" /> Clear Cart
            </button>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:col-span-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">Delivery Address</h3>
                      
                {selectedAddress ? (
                  <div className="mb-4">
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                      <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                      <p>{selectedAddress.deliveryAddress}</p>
                      <p>{selectedAddress.city}</p>
                      <p>Phone: {selectedAddress.primaryPhone}</p>
                      {selectedAddress.secondaryPhone && (
                        <p>Alt. Phone: {selectedAddress.secondaryPhone}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="mt-2 text-sm text-primary-light hover:text-primary-dark flex items-center"
                    >
                      <FiPlus className="mr-1" /> Update Information
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p>No delivery information saved</p>
                    <button 
                      onClick={() => setShowAddressForm(true)}
                      className="mt-2 text-sm text-primary-light hover:text-primary-dark flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add Information
                    </button>
                  </div>
                )}

                {showAddressForm && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="firstName"
                        label="First Name"
                        value={newAddress.firstName}
                        onChange={handleAddressChange}
                        isRequired
                      />
                      <InputField
                        name="lastName"
                        label="Last Name"
                        value={newAddress.lastName}
                        onChange={handleAddressChange}
                        isRequired
                      />
                    </div>

                    <InputField
                      name="deliveryAddress"
                      label="Delivery Address"
                      value={newAddress.deliveryAddress}
                      onChange={handleAddressChange}
                      isRequired
                    />

                    <SelectField
                      name="city"
                      label="City"
                      value={newAddress.city}
                      onChange={handleAddressChange}
                      options={cities}
                      isRequired
                    />

                    <InputField
                      name="primaryPhone"
                      label="Primary Phone"
                      value={newAddress.primaryPhone}
                      onChange={handleAddressChange}
                      type="tel"
                      isRequired
                    />

                    <InputField
                      name="secondaryPhone"
                      label="Secondary Phone (Optional)"
                      value={newAddress.secondaryPhone}
                      onChange={handleAddressChange}
                      type="tel"
                      isRequired={false}
                    />

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleAddAddress}
                        className="px-4 py-2 bg-primary-light text-white text-sm font-medium rounded-md hover:bg-primary-dark"
                      >
                        Save Information
                      </button>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({(summary.totalItems || 0)} items)</span>
                <span className="font-medium">₦{(summary.subtotal || 0).toLocaleString()}</span>
              </div>

              {(summary.discount || 0) > 0 && (
                <div className="flex justify-between text-primary-light">
                  <span>Discount</span>
                  <span>-₦{(summary.discount || 0).toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">Delivery</span>
                  <select 
                    value={selectedShipping}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    {shippingOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name} (₦{(option.cost || 0).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{(summary.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || !items.every(item => item.available) || !selectedAddress}
                className={`w-full bg-primary-light hover:bg-primary-dark text-white py-3 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  checkoutLoading ? 'opacity-75 cursor-not-allowed' : ''
                } ${
                  !items.every(item => item.available) || !selectedAddress ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''
                }`}
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  !selectedAddress ? 'Select Address' :
                  items.every(item => item.available) ? 'Proceed to Checkout' : 'Some items unavailable'
                )}
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              or{' '}
              <Link to="/" className="text-primary-light hover:text-primary-dark">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;