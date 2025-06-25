import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import AddressForm from './AddressForm';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import axios from '../../lib/axios';

const CartSummary = ({ 
  summary, 
  shippingOptions, 
  selectedAddress,
  currentUser,
  onCheckout,
  checkoutLoading,
  allItemsAvailable,
  setSelectedAddress,
  fetchCart // Add this prop to refresh cart after applying coupon
}) => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping) || shippingOptions[0];
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
        fetchCart(); // Refresh cart to show updated totals
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
      fetchCart(); // Refresh cart to show updated totals
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div className="mt-8 lg:mt-0 lg:col-span-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-4">
          {/* Delivery Address Section*/}
          <div className="border-b border-gray-200 pb-4">
           {currentUser &&  <h3 className="text-md font-medium text-gray-900 mb-2">Delivery Address</h3>}
                  
            {selectedAddress ? (
              <div className="mb-4">
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                  <p>{selectedAddress.primaryAddress}</p>
                  <p>{selectedAddress.state}</p>
                  <p>Phone: {selectedAddress.primaryPhone}</p>
                  {/* {selectedAddress.secondaryPhone && (
                    <p>Alt. Phone: {selectedAddress.secondaryPhone}</p>
                  )} */}
                </div>
                {currentUser && (
                  <Button
                    variant="text"
                    onClick={() => setShowAddressForm(true)}
                    className="mt-2 text-sm flex items-center"
                    icon={<FiPlus className="mr-1" />}
                  >
                    Update Information
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
               {currentUser && !selectedAddress &&  <p>No delivery information saved</p>}
                {currentUser && !selectedAddress && (
                  <Button
                    variant="text"
                    onClick={() => setShowAddressForm(true)}
                    className="mt-2 text-sm flex items-center"
                    icon={<FiPlus className="mr-1" />}
                  >
                    Add Information
                  </Button>
                )}
              </div>
            )}

            {showAddressForm && currentUser && (
              <AddressForm
                currentUser={currentUser}
                onSave={(address) => {
                  setSelectedAddress(address);
                  setShowAddressForm(false);
                }}
                onCancel={() => setShowAddressForm(false)}
                initialAddress={selectedAddress}
              />
            )}
          </div>

          {/* New Coupon Code Section */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Coupon Code</h3>
            <div className="flex gap-2">
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
          {/* Order Summary */}
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({(summary.totalItems || 0)} items)</span>
            <span className="font-medium">₦{(summary.subtotal || 0).toLocaleString()}</span>
          </div>

          {(summary.discount || summary.totalDiscount || 0) > 0 && (
            <div className="flex justify-between text-primary-light">
              <span>Discount</span>
              <span>-₦{(summary.discount ||summary.totalDiscount || 0).toLocaleString()}</span>
            </div>
          )}

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
          <Button
            onClick={() => onCheckout(selectedShipping, selectedAddress)}
            disabled={checkoutLoading || !allItemsAvailable}
            isLoading={checkoutLoading}
            loadingText="Processing..."
            className="w-full"
          >
            {allItemsAvailable ? 'Proceed to Checkout' : 'Some items unavailable'}
          </Button>
        </div>
        
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