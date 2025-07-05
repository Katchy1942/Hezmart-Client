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
    state: currentUser?.state || '',
    primaryAddress: currentUser?.primaryAddress || '',
    email:currentUser?.email
  });
  const [errors, setErrors] = useState({});
  const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Rivers",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara"
];
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
        state: newAddress.state,
        primaryAddress: newAddress.primaryAddress,
        email:newAddress.email
      });
      
      // Update local user data
      const updatedUser = {
        ...currentUser,
        ...response.data.data
      };
      // localStorage.setItem('user', JSON.stringify(updatedUser));
      
      onSave({
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        primaryPhone: newAddress.primaryPhone,
        state: newAddress.state,
        primaryAddress: newAddress.primaryAddress,
        email:newAddress.email
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
          name="state"
          label="State"
          value={newAddress.state}
          onChange={handleAddressChange}
          options={nigerianStates}
          error={errors.state}
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
        name="email"
        label="Email"
        value={newAddress.email}
        onChange={handleAddressChange}
        type="tel"
        error={errors.primaryPhone}
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
          className="px-4 py-2 cursor-pointer border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddressForm;