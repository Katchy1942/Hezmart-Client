import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useCart } from '../components/contexts/CartContext';
import { toast } from 'react-toastify';
import axios from '../lib/axios';
import CartItemsList from '../components/cart/CartItemsList';
import CartSummary from '../components/cart/CartSummary';
import CartEmptyState from '../components/cart/CartEmptyState';


const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
 

  useEffect(() => {
    fetchCart();
    // Initialize address from user's primary address if available
    if (currentUser) {
      setSelectedAddress({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        primaryPhone: currentUser.primaryPhone,
        state: currentUser.state,
        primaryAddress: currentUser.primaryAddress,
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

  const handleCheckout = async (selectedShipping, selectedAddress) => {
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

      if(response.data.status === 'success'){
       window.location.href = response.data.data.checkoutUrl;
      }
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
    return <CartEmptyState />;
  }

  const { items = [], summary = {}, shippingOptions = [] } = cart;
  const allItemsAvailable = items.every(item => item.available);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6 ">
        <Link to="/" className="flex text-sm items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Continue Shopping
        </Link>
        <h1 className="text-sm lg:text-2xl font-bold text-gray-900 ml-6">Your Shopping Cart</h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <CartItemsList 
          items={items} 
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        <CartSummary
          summary={summary}
          shippingOptions={shippingOptions}
          selectedAddress={selectedAddress}
          currentUser={currentUser}
          fetchCart={fetchCart}
          onCheckout={handleCheckout}
          checkoutLoading={checkoutLoading}
          allItemsAvailable={allItemsAvailable}
          setSelectedAddress={setSelectedAddress}
        />
      </div>
    </div>
  );
};

export default Cart;