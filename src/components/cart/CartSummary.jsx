import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiPlus, FiCopy } from 'react-icons/fi';
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
  selectedStateFee
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

  // Memoized address validation
  const isValidAddress = useMemo(() => {
    // console.log('Validating address:', selectedAddress);
    
    if (!selectedAddress || typeof selectedAddress !== 'object') {
      console.log('Invalid address object');
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
        console.log(`Missing required field: ${field}`);
        return false;
      }
    }

    return true;
  }, [selectedAddress]);

  // Enhanced delivery validation
  const isDeliveryValid = () => {
    if (!deliveryOption) return false;
    
    if (deliveryOption === 'door') {
      return Boolean(selectedStateFee?.id);
    } else if (deliveryOption === 'pickup') {
      return Boolean(selectedPickupStation);
    }
    return false;
  };

  // Enhanced payment validation
  const isPaymentValid = () => {
    if (!paymentMethod) return false;
    
    if (paymentMethod === 'crypto') {
      return Boolean(selectedWallet?.walletAddress);
    }
    return true;
  };

  // Comprehensive checkout disabled logic
  const isCheckoutDisabled = () => {
    // Early returns for loading states
    if (checkoutLoading || (paymentMethod === 'crypto' && loadingCryptoRate)) {
      return true;
    }

    // Validate all requirements
    const requirements = {
      addressValid: isValidAddress, // Using memoized value directly
      deliveryValid: isDeliveryValid(),
      paymentValid: isPaymentValid(),
      itemsAvailable: allItemsAvailable
    };

    console.log('Validation Requirements:', requirements);
    
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
      <div className="bg-white shadow overflow-hidden rounded-lg p-4 lg:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-4">
          {/* Delivery Address Section */}
          <div className="hidden border-b border-gray-200 pb-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Delivery Information</h3>
                      
            {selectedAddress && isValidAddress ? (
              <div className="mb-4">
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                  <p>{selectedAddress.primaryAddress}</p>
                  <p>{selectedAddress.state}</p>
                  <p>Phone: {selectedAddress.primaryPhone}</p>
                  <p>Email: {selectedAddress.email}</p>
                </div>
                <Button
                  variant="text"
                  onClick={() => setShowAddressForm(true)}
                  className="mt-2 text-sm flex items-center"
                  icon={<FiPlus className="mr-1" />}
                >
                  Update Information
                </Button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>Please provide complete delivery information</p>
                <Button
                  variant="text"
                  onClick={() => setShowAddressForm(true)}
                  className="mt-2 text-sm flex items-center"
                  icon={<FiPlus className="mr-1" />}
                >
                  Add Delivery Information
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

          {/* Coupon Code Section */}
          {pathname === '/checkout' && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-medium text-gray-900 mb-2">Coupon Code</h3>
              <div className="flex gap-2 flex-col lg:flex-row">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-light"
                  disabled={applyingCoupon || summary.appliedCoupon}
                />
                {summary.appliedCoupon ? (
                  <Button
                    onClick={handleRemoveCoupon}
                    disabled={applyingCoupon}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {applyingCoupon ? 'Removing...' : 'Remove'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="whitespace-nowrap"
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                )}
              </div>
              {summary.appliedCoupon && (
                <div className="mt-2 text-sm text-green-600">
                  Coupon "{summary.appliedCoupon}" applied successfully!
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm w-[300px]">Delivery Charges: </span>
            {pathname === '/cart' ? (
              <span className="text-[9px] text-right">Add your Delivery address at checkout to see delivery charges</span>
            ) : (
              <span className='font-medium'>{deliveryFee ? `₦${deliveryFee.toLocaleString()}` : 0}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({(summary.totalItems || 0)} items)</span>
            <span className="font-medium">₦{(summary.subtotal || 0).toLocaleString()}</span>
          </div>

          {(summary.discount || summary.totalDiscount || 0) > 0 && (
            <div className="flex justify-between text-primary-light">
              <span>Discount</span>
              <span>-₦{(summary.discount || summary.totalDiscount || 0).toLocaleString()}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  ₦{(summary.total + (deliveryFee || 0)).toLocaleString()}
                </div>
                {paymentMethod === 'crypto' && (
                  <>
                    {cryptoEquivalent && !loadingCryptoRate ? (
                      <div className="text-sm text-primary-light mt-1">
                        ≈ {cryptoEquivalent.amount.toFixed(6)} {cryptoEquivalent.currency}
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className="truncate max-w-[160px] inline-block align-middle">
                            Send to: {selectedWallet.walletAddress}
                          </span>
                          <button 
                            onClick={handleCopyAddress}
                            className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                            aria-label="Copy wallet address"
                          >
                            <FiCopy className="inline" size={14} />
                          </button>
                          {copied && (
                            <span className="text-xs text-green-500 ml-1">Copied!</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mt-1">
                        {loadingCryptoRate ? 'Loading conversion rate...' : 'Calculating crypto amount...'}
                      </div>
                    )}
                  </>
                )} 
              </div>
            </div>
          </div>
        </div>

        {pathname === '/cart' && (
          <div className="mt-6">
            <Button
              disabled={!allItemsAvailable}
              onClick={handleCheckoutProceed}
              className="w-full"
            >
              {allItemsAvailable ? 'Proceed to Checkout' : 'Some items unavailable'}
            </Button>
          </div>
        )}

        {pathname === '/checkout' && (
          <div className="mt-6">
            <Button
              onClick={() => onCheckout(selectedShipping)}
              disabled={isCheckoutDisabled()}
              isLoading={checkoutLoading}
              loadingText="Processing..."
              className="w-full"
            >
              {paymentMethod === 'crypto' ? 'Confirm Crypto Payment' : 'Confirm Order'}
            </Button>
            
            {isCheckoutDisabled() && !checkoutLoading && (
              <div className="text-xs text-red-500 mt-2 space-y-1">
                {!isValidAddress && <div>• Please provide complete delivery information</div>}
                {!isDeliveryValid() && deliveryOption === 'door' && <div>• Please select a state for delivery</div>}
                {!isDeliveryValid() && deliveryOption === 'pickup' && <div>• Please select a pickup station</div>}
                {!isPaymentValid() && paymentMethod === 'crypto' && <div>• Please select a crypto wallet</div>}
                {!allItemsAvailable && <div>• Some items in your cart are unavailable</div>}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 text-center text-sm text-gray-500">
          or{' '}
          <Link to="/" className="text-primary-light hover:text-primary-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;