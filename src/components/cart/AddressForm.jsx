import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../lib/axios';
import SelectField from '../common/SelectField';
import InputField from '../common/InputField';

const AddressForm = ({ 
  currentUser, 
  cities, 
  onSave, 
  onCancel,
  initialAddress = null 
}) => {
  const [newAddress, setNewAddress] = useState(initialAddress || {
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    primaryPhone: currentUser?.primaryPhone || '',
    secondaryPhone: currentUser?.secondaryPhone || '',
    city: currentUser?.city || '',
    primaryAddress: currentUser?.primaryAddress || '',
    country:currentUser.country
  });
  const [errors, setErrors] = useState({});

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch('/api/v1/users/updateMe', {
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        primaryPhone: newAddress.primaryPhone,
        secondaryPhone: newAddress.secondaryPhone,
        city: newAddress.city,
        country:newAddress.country,
        primaryAddress: newAddress.primaryAddress
      });
      
      // Update local user data
      const updatedUser = {
        ...currentUser,
        ...response.data.data
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      onSave({
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        primaryPhone: newAddress.primaryPhone,
        secondaryPhone: newAddress.secondaryPhone,
        city: newAddress.city,
        primaryAddress: newAddress.primaryAddress
      });
      
      toast.success('Address updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update address');
      const backendErrors = err.response?.data?.errors || {};
      const newErrors = {};

      Object.entries(backendErrors).forEach(([field, msg]) => {
        newErrors[field] = msg;
      });

      if (err.response?.data?.message && !Object.keys(newErrors).length) {
        newErrors.root = err.response.data.message;
      }

      setErrors(newErrors);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="firstName"
          label="First Name"
          value={newAddress.firstName}
          onChange={handleAddressChange}
          error={errors.firstName}
        />
        <InputField
          name="lastName"
          label="Last Name"
          value={newAddress.lastName}
          onChange={handleAddressChange}
          error={errors.lastName}
        />
      </div>

      <InputField
        name="primaryAddress"
        label="Delivery Address"
        value={newAddress.primaryAddress}
        onChange={handleAddressChange}
        error={errors.primaryAddress}
      />

      <SelectField
        name="city"
        label="City"
        value={newAddress.city}
        onChange={handleAddressChange}
        options={cities}
        error={errors.city}
      />

      <InputField
        name="primaryPhone"
        label="Primary Phone"
        value={newAddress.primaryPhone}
        onChange={handleAddressChange}
        type="tel"
        error={errors.primaryPhone}
      />

      <InputField
        name="secondaryPhone"
        label="Secondary Phone (Optional)"
        value={newAddress.secondaryPhone}
        onChange={handleAddressChange}
        type="tel"
        error={errors.secondaryPhone}
        isRequired={false}
      />

      <div className="flex space-x-2 pt-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary-light text-white text-sm font-medium rounded-md hover:bg-primary-dark"
        >
          Save Information
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddressForm;