import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../components/contexts/CartContext';
import { toast } from 'react-toastify';
import axios from '../lib/axios';
import CartItemsList from '../components/cart/CartItemsList';
import CartSummary from '../components/cart/CartSummary';
import CartEmptyState from '../components/cart/CartEmptyState';
import CartSkeleton from '../components/cart/CartSkeleton';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);


    useEffect(() => {
        fetchCart();
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

    if (cart.loading && (!cart.items || cart.items.length === 0)) {
        return (
            <CartSkeleton />
        );
    }

    if (cart.error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 font-sans">
                <div className="max-w-lg w-full text-center">
                    {/* Technical Error Box */}
                    <div className="bg-red-50/80 border border-red-100 rounded-2xl p-6 
                    text-left shadow-sm mb-8 backdrop-blur-sm mx-auto">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 flex items-center justify-center 
                            w-10 h-10 bg-red-100 rounded-full text-red-600">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54
                                    0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-red-900 font-mono text-xs uppercase tracking-wide font-bold mb-1">
                                    Error Details
                                </p>
                                <p className="text-gray-900 font-medium break-words text-sm">
                                    {cart.error}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a 
                            href="/" 
                            className="px-8 py-2 bg-primary-light text-white 
                            rounded-full font-semibold text-[14px]"
                        >
                            Keep Shopping
                        </a>
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

    const totalSavings = items.reduce((sum, item) => {
        const originalPrice = parseFloat(item.product?.price || 0);
        let currentPrice = originalPrice;

        if (item.product?.isOnFlashSale && item.product?.displayPrice) {
            currentPrice = parseFloat(item.product.displayPrice);
        } else if (item.product?.discountPrice && item.product.discountPrice !== "0.00") {
            currentPrice = parseFloat(item.product.discountPrice);
        }

        // Calculate savings only if there's an actual discount
        if (currentPrice < originalPrice) {
            return sum + (originalPrice - currentPrice) * item.quantity;
        }
        
        return sum;
    }, 0);

    return (
        <div className="max-w-7xl min-h-screen py-8 mx-auto">
            <div className="mb-6 flex flex-col gap-3">
                <h1 className="text-xl lg:text-2xl font-semibold font-['poppins'] text-gray-900">Your Shopping Cart</h1>
                {totalSavings > 0 && (
                    <span className="text-green-600 font-bold text-xs bg-green-50 px-4 py-2 rounded-full 
                    border border-green-200 w-fit flex items-center gap-2 shadow-sm">
                        <FiCheckCircle />
                        You're saving ₦{totalSavings.toLocaleString()}!
                    </span>
                )}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-x-12">
                <div className="lg:col-span-8">
                    <CartItemsList 
                        items={items} 
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                        onClearCart={handleClearCart}
                    />
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-4">
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
        </div>
    );
};

export default Cart;