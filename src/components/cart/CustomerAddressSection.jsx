import { useState } from 'react';
import { IoCheckmarkSharp } from "react-icons/io5";
import Button from '../common/Button';
import { FiPlus } from 'react-icons/fi';
import AddressForm from './AddressForm';

const CustomerAddressSection = ({ currentUser, selectedAddress, setSelectedAddress }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Check if address is complete and valid
  const isValidAddress = selectedAddress && 
    selectedAddress.firstName && 
    selectedAddress.lastName && 
    selectedAddress.primaryPhone && 
    selectedAddress.state && 
    selectedAddress.primaryAddress;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${isValidAddress ? 'border-l-4 border-green-500' : ''}`}>
      <div className='flex justify-between mb-4'>
        <div className='flex gap-3 items-center'>
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white ${isValidAddress ? 'bg-green-500' : 'bg-gray-300'}`}>
            {isValidAddress && <IoCheckmarkSharp />}
          </div>
          <h1 className='uppercase text-sm font-semibold'>
            1. Customer Address
          </h1>
        </div>
      </div>
      
      {isValidAddress ? (
        <div className="mb-4">
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <p className="font-medium">
              {selectedAddress.firstName} {selectedAddress.lastName}
            </p>
            <p>{selectedAddress.primaryAddress}</p>
            <p>{selectedAddress.state}</p>
            <p>Phone: {selectedAddress.primaryPhone}</p>
          </div>
          {currentUser && (
            <Button
              variant="text"
              onClick={() => setShowAddressForm(true)}
              className="mt-3 text-sm flex items-center"
              icon={<FiPlus className="mr-1" />}
            >
              Update Information
            </Button>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          {currentUser && <p>No delivery information saved</p>}
          {currentUser && (
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
  );
};
export default CustomerAddressSection;