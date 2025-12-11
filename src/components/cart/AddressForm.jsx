import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../lib/axios';
import SelectField from '../common/SelectField';
import InputField from '../common/InputField';
import { FiSave, FiX } from 'react-icons/fi';

const AddressForm = ({ 
    currentUser, 
    onSave, 
    onCancel,
    initialAddress = null,
    from
}) => {
    const [newAddress, setNewAddress] = useState(initialAddress || {
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        primaryPhone: currentUser?.primaryPhone || '',
        state: currentUser?.state || '',
        primaryAddress: currentUser?.primaryAddress || '',
        email: currentUser?.email || ''
    });
    const [errors, setErrors] = useState({});
    
    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
        "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
        "Ekiti", "Rivers", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
        "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", 
        "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
        "Oyo", "Plateau", "Sokoto", "Taraba", "Yobe", "Zamfara"
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
                email: newAddress.email
            });
            
            // eslint-disable-next-line no-unused-vars
            const updatedUser = {
                ...currentUser,
                ...response.data.data
            };
            
            onSave({
                firstName: newAddress.firstName,
                lastName: newAddress.lastName,
                primaryPhone: newAddress.primaryPhone,
                state: newAddress.state,
                primaryAddress: newAddress.primaryAddress,
                email: newAddress.email
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
        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200 mt-4 animate-fade-in">
            {
                from === "modal" && <h2 className='text-center text-lg font-semibold mb-8'>
                    Delivery Details
                </h2>
            }

            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                <div className="col-span-1">
                    <InputField
                        name="firstName"
                        label="First Name"
                        value={newAddress.firstName}
                        onChange={handleAddressChange}
                        error={errors.firstName}
                    />
                </div>

                <div className="col-span-1">
                    <InputField
                        name="lastName"
                        label="Last Name"
                        value={newAddress.lastName}
                        onChange={handleAddressChange}
                        error={errors.lastName}
                    />
                </div>

                <div className="col-span-2">
                    <InputField
                        name="email"
                        label="Email Address"
                        value={newAddress.email}
                        onChange={handleAddressChange}
                        type="email"
                        error={errors.email}
                    />
                </div>

                <div className="col-span-2">
                    <InputField
                        name="primaryPhone"
                        label="Phone Number"
                        value={newAddress.primaryPhone}
                        onChange={handleAddressChange}
                        type="tel"
                        error={errors.primaryPhone}
                    />
                </div>

                <div className="col-span-2">
                    <InputField
                        name="primaryAddress"
                        label="Delivery Address"
                        value={newAddress.primaryAddress}
                        onChange={handleAddressChange}
                        error={errors.primaryAddress}
                        placeholder="Street address, apartment, suite"
                    />
                </div>

                <div className="col-span-2">
                    <SelectField
                        name="state"
                        label="State"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        options={nigerianStates}
                        error={errors.state}
                    />
                </div>

                <div className="col-span-2 pt-2 flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white 
                        text-sm font-medium rounded-full hover:bg-black transition-colors shadow-sm"
                    >
                        <FiSave className="w-4 h-4" />
                        Save
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 
                        text-sm font-medium rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <FiX className="w-4 h-4" />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressForm;