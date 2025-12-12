import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiCopy, FiTag, FiAlertCircle, FiCheckCircle, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import AddressForm from './AddressForm';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import axios from '../../lib/axios';

const CartSummary = ({ 
    summary, 
    selectedAddress,
    currentUser,
    onCheckout,
    checkoutLoading,
    allItemsAvailable,
    setSelectedAddress,
    deliveryFee,
    fetchCart,
    paymentMethod,
    selectedWallet,
    selectedPickupStation,
    deliveryOption,
    selectedStateFee,
    shippingSettings 
}) => {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [cryptoEquivalent, setCryptoEquivalent] = useState(null);
    const [loadingCryptoRate, setLoadingCryptoRate] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [selectedShipping, setSelectedShipping] = useState('standard');

    const isValidAddress = useMemo(() => {
        if (!selectedAddress || typeof selectedAddress !== 'object') {
            return false;
        }

        const requiredFields = [
            'firstName',
            'lastName',
            'primaryPhone',
            'state',
            'email',
            'primaryAddress'
        ];

        for (const field of requiredFields) {
            if (!selectedAddress[field]?.trim()) {
                return false;
            }
        }

        return true;
    }, [selectedAddress]);

    const isDeliveryValid = () => {
        if (!deliveryOption) return false;

        if (deliveryOption === 'door') {
            return Boolean(selectedStateFee?.id);
        } else if (deliveryOption === 'pickup') {
            return Boolean(selectedPickupStation);
        }
        return false;
    };

    const isPaymentValid = () => {
        if (!paymentMethod) return false;

        if (paymentMethod === 'crypto') {
            return Boolean(selectedWallet?.walletAddress);
        }
        return true;
    };

    const isCheckoutDisabled = () => {
        if (checkoutLoading || (paymentMethod === 'crypto' && loadingCryptoRate)) {
            return true;
        }

        const requirements = {
            addressValid: isValidAddress,
            deliveryValid: isDeliveryValid(),
            paymentValid: isPaymentValid(),
            itemsAvailable: allItemsAvailable
        };
        if (shippingSettings?.minShippingEnabled && parseFloat(summary.total) < shippingSettings?.shippingMinAmount) {
            return true;
        }

        return !requirements.addressValid || 
            !requirements.deliveryValid || 
            !requirements.paymentValid || 
            !requirements.itemsAvailable;
    };

    const handleCopyAddress = () => {
        if (!selectedWallet?.walletAddress) return;
        navigator.clipboard.writeText(selectedWallet.walletAddress);
        setCopied(true);
        toast.success('Wallet address copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setApplyingCoupon(true);
        try {
            const response = await axios.post('api/v1/coupons/apply', {
                code: couponCode.trim()
            });

            if (response.data.status === 'success') {
                toast.success('Coupon applied successfully!');
                fetchCart();
            } else {
                toast.error(response.data.message || 'Failed to apply coupon');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply coupon');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = async () => {
        setApplyingCoupon(true);
        try {
            await axios.delete('/api/coupons/remove');
            toast.success('Coupon removed successfully!');
            setCouponCode('');
            fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove coupon');
        } finally {
            setApplyingCoupon(false);
        }
    };

    useEffect(() => {
        const calculateCryptoEquivalent = async () => {
            if (paymentMethod !== 'crypto' || !selectedWallet?.networkName) {
                setCryptoEquivalent(null);
                return;
            }

            setLoadingCryptoRate(true);
            const network = selectedWallet.networkName.toLowerCase();
            const id = network === 'usdt' ? 'tether' : network;
            const amountInNGN = summary.total + (deliveryFee || 0);

            try {
                const res = await fetch(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=ngn&ids=${id}`
                );

                if (!res.ok) throw new Error('Failed to fetch from CoinGecko');

                const data = await res.json();
                if (!data.length) {
                    toast.error("No pricing data found for this cryptocurrency.");
                    return;
                }

                const priceInNGN = data[0].current_price;
                const equivalent = amountInNGN / priceInNGN;

                setCryptoEquivalent({
                    amount: equivalent,
                    currency: selectedWallet.networkName.toUpperCase(),
                    walletAddress: selectedWallet.walletAddress
                });
            } catch (err) {
                console.error('Failed to fetch crypto price', err);
                toast.error('Failed to fetch current cryptocurrency rate');
                setCryptoEquivalent(null);
            } finally {
                setLoadingCryptoRate(false);
            }
        };

        calculateCryptoEquivalent();
    }, [paymentMethod, selectedWallet, summary.total, deliveryFee]);

    const handleCheckoutProceed = () => {
        if (!currentUser) {
            toast.error('Please login to proceed to checkout');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 sticky top-6">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-md font-bold text-gray-900 uppercase tracking-wider">Order Summary</h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Delivery Details
                            </h3>
                            {isValidAddress && (
                                <span
                                    variant="text"
                                    onClick={() => setShowAddressForm(true)}
                                    className="text-xs text-primary-light cursor-pointer font-medium !p-0"
                                >
                                    Edit
                                </span>
                            )}
                        </div>

                        {selectedAddress && isValidAddress ? (
                            <div className="group relative rounded-xl border border-gray-200 bg-white p-5 
                            shadow-sm transition-all hover:border-primary-light/30 hover:shadow-md">
                                <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 
                                    h-10 rounded-full bg-gray-50 text-gray-500 
                                    group-hover:bg-primary-light/10 group-hover:text-primary-light transition-colors">
                                        <FiUser className="w-5 h-5" />
                                    </div>
                                    <p className="font-bold text-gray-900 text-lg">
                                        {selectedAddress.firstName} {selectedAddress.lastName}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-start gap-y-3 gap-x-6 text-sm text-gray-700">
                                    <div className="flex items-start gap-2.5 w-full">
                                        <FiMapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                                        <span className="leading-tight">
                                            {selectedAddress.primaryAddress}, {selectedAddress.state}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <FiPhone className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>
                                            {selectedAddress.primaryPhone}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <FiMail className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="break-all">
                                            {selectedAddress.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                                <p className="text-sm text-gray-500 mb-3">No delivery address selected</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddressForm(true)}
                                    className="mx-auto text-sm w-full font-medium"
                                >
                                    Add Address
                                </Button>
                            </div>
                        )}

                        {showAddressForm && (
                            <AddressForm
                                currentUser={currentUser}
                                onSave={(address) => {
                                    console.log('Saving address:', address);
                                    setSelectedAddress(address);
                                    setShowAddressForm(false);
                                }}
                                onCancel={() => setShowAddressForm(false)}
                                initialAddress={selectedAddress}
                            />
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {pathname === '/checkout' && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-600 
                            uppercase tracking-wider flex items-center gap-2">
                                <FiTag /> Coupon Code
                            </h3>

                            <div className="relative flex rounded-full shadow-sm">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="block w-full rounded-l-full border-gray-300 pl-4 py-2.5 text-sm 
                                    focus:border-primary-light focus:ring-primary-light disabled:bg-gray-50"
                                    disabled={applyingCoupon || summary.appliedCoupon}
                                />
                                <button
                                    onClick={summary.appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                                    disabled={applyingCoupon}
                                    className={`relative -ml-px inline-flex items-center gap-x-1.5 
                                        rounded-r-full px-4 py-2 text-sm font-semibold ring-1 ring-inset 
                                        ${summary.appliedCoupon 
                                            ? 'bg-red-50 text-red-600 ring-red-200 hover:bg-red-100' 
                                            : 'bg-gray-900 text-white ring-gray-900 hover:bg-gray-800'
                                        } transition-colors`}
                                >
                                    {applyingCoupon ? '...' : (summary.appliedCoupon ? 'Remove' : 'Apply')}
                                </button>
                            </div>

                            {summary.appliedCoupon && (
                                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-md">
                                    <FiCheckCircle /> Coupon "{summary.appliedCoupon}" applied!
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal ({(summary.totalItems || 0)} items)</span>
                            <span className="font-semibold text-gray-900">₦{(summary.subtotal || 0).toLocaleString()}</span>
                        </div>

                        {(summary.productDiscount || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-primary-light">Discount</span>
                                <span className="font-medium text-primary-light">- ₦{(summary.productDiscount || 0).toLocaleString()}</span>
                            </div>
                        )}

                        {(summary.couponDiscount || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-green-600">Coupon Savings</span>
                                <span className="font-medium text-green-600">- ₦{(summary.couponDiscount || 0).toLocaleString()}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm border-t border-dashed border-gray-200 pt-2">
                            <span className="text-gray-500">Order Subtotal</span>
                            <span className="font-medium text-gray-900">₦{(summary.subtotal - (summary.totalDiscount || 0)).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            {pathname === '/cart' ? (
                                <span className="text-xs text-gray-400 italic">Calc. at checkout</span>
                            ) : (
                                <span className='font-medium text-gray-900'>{deliveryFee ? `₦${deliveryFee.toLocaleString()}` : 'Free'}</span>
                            )}
                        </div>

                        {(summary.tax || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tax</span>
                                <span className="font-medium text-gray-900">₦{(summary.tax || 0).toLocaleString()}</span>
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                            <div className="flex justify-between items-end gap-4">
                                <span className="text-base font-bold text-gray-900 shrink-0">
                                    Total to Pay
                                </span>
                                <div className="text-2xl font-extrabold text-gray-900 
                                    tracking-tight text-right">
                                    ₦{(summary.total + (deliveryFee || 0)).toLocaleString()}
                                </div>
                            </div>

                            {paymentMethod === 'crypto' && (
                                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 
                                    animate-fade-in relative overflow-hidden">
                                    
                                    {/* Background decoration for visual flair */}
                                    <div className="absolute -right-4 -top-4 w-16 h-16 
                                        bg-indigo-100 rounded-full blur-xl opacity-50 pointer-events-none" />

                                    {cryptoEquivalent && !loadingCryptoRate ? (
                                        <div className="space-y-3 relative z-10">
                                            {/* Amount Display */}
                                            <div className="flex flex-wrap justify-between items-center gap-2">
                                                <span className="text-xs font-bold text-indigo-800 
                                                    uppercase tracking-wider">
                                                    Crypto Total
                                                </span>
                                                <span className="text-sm font-bold text-indigo-700 
                                                    font-mono bg-white/60 px-2 py-0.5 rounded border 
                                                    border-indigo-100 shadow-sm">
                                                    ≈ {cryptoEquivalent.amount.toFixed(6)} {cryptoEquivalent.currency}
                                                </span>
                                            </div>

                                            {/* Address Box */}
                                            <div className="flex items-center gap-3 bg-white rounded-lg 
                                                border border-indigo-200 p-2.5 shadow-sm">
                                                
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] text-gray-400 font-bold 
                                                        mb-0.5 uppercase tracking-wider">
                                                        Send to Wallet Address
                                                    </p>
                                                    <p className="text-xs text-gray-800 font-mono 
                                                        truncate select-all">
                                                        {selectedWallet.walletAddress}
                                                    </p>
                                                </div>
                                                
                                                <div className="shrink-0 border-l border-gray-100 pl-2">
                                                    <button
                                                        onClick={handleCopyAddress}
                                                        className="p-2 text-indigo-500 hover:text-indigo-700 
                                                            hover:bg-indigo-50 rounded-md transition-all 
                                                            active:scale-95"
                                                        title="Copy Address"
                                                    >
                                                        {copied 
                                                            ? <FiCheckCircle size={18} className="text-green-500" /> 
                                                            : <FiCopy size={18} />
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3 py-2 
                                            text-indigo-600">
                                            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 
                                                border-t-transparent animate-spin" />
                                            <span className="text-xs font-medium animate-pulse">
                                                Calculating best rates...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    {pathname === '/cart' && (
                        <Button
                            disabled={!allItemsAvailable}
                            onClick={handleCheckoutProceed}
                            className="w-full text-base py-3 font-semibold"
                        >
                            {allItemsAvailable ? 'Proceed to Checkout' : 'Some items unavailable'}
                        </Button>
                    )}

                    {pathname === '/checkout' && (
                        <div className="space-y-4">
                            {isCheckoutDisabled() && !checkoutLoading && (
                                <div className="rounded-md bg-red-50 p-3 border border-red-100">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Cannot proceed yet</h3>
                                            <div className="mt-1 text-xs text-red-700">
                                                <ul className="list-disc space-y-1 pl-4">
                                                    {!isValidAddress && <li>Incomplete delivery information</li>}
                                                    {!isDeliveryValid() && deliveryOption === 'door' && <li>Select a state for delivery</li>}
                                                    {!isDeliveryValid() && deliveryOption === 'pickup' && <li>Select a pickup station</li>}
                                                    {!isPaymentValid() && paymentMethod === 'crypto' && <li>Select a crypto wallet</li>}
                                                    {!allItemsAvailable && <li>Remove unavailable items</li>}
                                                    {shippingSettings?.minShippingEnabled && summary.total < shippingSettings?.shippingMinAmount && (
                                                        <li>Min. order amount: ₦{shippingSettings.shippingMinAmount.toLocaleString()}</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={() => onCheckout(selectedShipping)}
                                disabled={isCheckoutDisabled()}
                                isLoading={checkoutLoading}
                                loadingText="Processing Payment..."
                                className="w-full text-base py-3 font-semibold shadow-lg shadow-primary-light/20"
                            >
                                {paymentMethod === 'crypto' ? 'Confirm Crypto Transfer' : 'Confirm Order'}
                            </Button>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <Link to="/" className="text-sm text-gray-500 hover:text-primary-light font-medium transition-colors">
                            or Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
