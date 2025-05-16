import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import AddressForm from './AddressForm';

const CartSummary = ({ 
  summary, 
  shippingOptions, 
  selectedAddress,
  currentUser,
  cities,
  onCheckout,
  checkoutLoading,
  allItemsAvailable,
  setSelectedAddress
}) => {
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping) || shippingOptions[0];

  return (
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
                  <p>{selectedAddress.primaryAddress}</p>
                  <p>{selectedAddress.city}</p>
                  <p>Phone: {selectedAddress.primaryPhone}</p>
                  {selectedAddress.secondaryPhone && (
                    <p>Alt. Phone: {selectedAddress.secondaryPhone}</p>
                  )}
                  <p>Fullname: {selectedAddress.firstName}{' '}{selectedAddress.lastName}</p>
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
              <AddressForm
                currentUser={currentUser}
                cities={cities}
                onSave={(address) => {
                  setSelectedAddress(address);
                  setShowAddressForm(false);
                }}
                onCancel={() => setShowAddressForm(false)}
                initialAddress={selectedAddress}
              />
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
            onClick={() => onCheckout(selectedShipping, selectedAddress)}
            disabled={checkoutLoading || !allItemsAvailable}
            className={`w-full bg-primary-light hover:bg-primary-dark text-white py-3 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              checkoutLoading ? 'opacity-75 cursor-not-allowed' : ''
            } ${
              !allItemsAvailable ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''
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
              
              allItemsAvailable ? 'Proceed to Checkout' : 'Some items unavailable'
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
  );
};

export default CartSummary;