import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";

const AdminSettings = () => {
    const [user, setUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [errors, setErrors] = useState({
        account: {},
        address: {},
        password: {},
        payment: {},
        shipping: {}
    });
    
    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
        "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
        "Ekiti", "Rivers", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
        "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
        "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
        "Sokoto", "Taraba", "Yobe", "Zamfara"
    ];

    const getUser = async () => {
        try {
            const res = await axios.get('api/v1/users/me');
            if (res.data.status === 'success') {
                setUser(res.data.user);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch user data');
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.target);
        
        try {
            const res = await axios.patch('api/v1/users/updateMe', Object.fromEntries(formData));
            if (res.data.status === 'success') {
                toast.success('Account updated successfully');
                setUser(res.data.data.user);
                setErrors(prev => ({ ...prev, account: {} }));
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(prev => ({ ...prev, account: err.response.data.errors }));
            }
            toast.error(err.response?.data?.message || 'Failed to update account');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        const formData = new FormData(e.target);
        
        try {
            const res = await axios.patch('api/v1/users/updateMyPassword', Object.fromEntries(formData));
            if (res.data.status === 'success') {
                toast.success('Password changed successfully');
                e.target.reset();
                setErrors(prev => ({ ...prev, password: {} }));
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(prev => ({ ...prev, password: err.response.data.errors }));
            }
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Placeholder functions for payment and shipping settings
    const handlePaymentSettings = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        // Implement payment settings update logic
        try {
            // API call would go here
            toast.success('Payment settings updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update payment settings');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleShippingSettings = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        // Implement shipping settings update logic
        try {
            // API call would go here
            toast.success('Shipping settings updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update shipping settings');
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
            </div>
        );
    }

    return (
        <section className='bg-gray-100 min-h-screen hidden'>
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h1>
                
                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Payment Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Shipping Settings
                        </button>
                    </nav>
                </div>
                
                {/* Tab Content */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className='border border-gray-300 rounded-md'>
                                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Account Details</h2>
                                <form className='p-3 space-y-4' onSubmit={handleAccountUpdate}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="First Name"
                                            name="firstName"
                                            value={user.firstName}
                                            error={errors.account?.firstName}
                                            required
                                        />
                                        <InputField
                                            label="Last Name"
                                            name="lastName"
                                            value={user.lastName}
                                            error={errors.account?.lastName}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={user.email}
                                            error={errors.account?.email}
                                            required
                                            disabled
                                        />
                                        <InputField
                                            label="Primary Phone"
                                            name="primaryPhone"
                                            type="tel"
                                            value={user.primaryPhone}
                                            error={errors.account?.primaryPhone}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" isLoading={isUpdating}>
                                        Update Account
                                    </Button>
                                </form>
                            </div>

                            <div className='border border-gray-300 rounded-md'>
                                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Address Book</h2>
                                <form className='p-3 space-y-4' onSubmit={handleAccountUpdate}>
                                    <SelectField
                                        name="state"
                                        label="State"
                                        value={user.state}
                                        options={nigerianStates}
                                        error={errors.account?.state}
                                    />
                                    <InputField
                                        label="Primary Address"
                                        name="primaryAddress"
                                        value={user.primaryAddress}
                                        error={errors.account?.primaryAddress}
                                        required
                                    />
                                    <Button type="submit" isLoading={isUpdating}>
                                        Update Address
                                    </Button>
                                </form>
                            </div>

                            <div className='border border-gray-300 rounded-md'>
                                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Password Manager</h2>
                                <form className='p-3 space-y-4 max-w-lg mx-auto' onSubmit={handleChangePassword}>
                                    <InputField
                                        label="Current Password"
                                        name="passwordCurrent"
                                        type="password"
                                        error={errors.password?.passwordCurrent}
                                        required
                                    />
                                    <InputField
                                        label="New Password"
                                        name="password"
                                        type="password"
                                        error={errors.password?.password}
                                        required
                                    />
                                    <InputField
                                        label="Confirm New Password"
                                        name="passwordConfirm"
                                        type="password"
                                        error={errors.password?.passwordConfirm}
                                        required
                                    />
                                    <Button type="submit" isLoading={isChangingPassword}>
                                        Change Password
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Payment Settings Tab */}
                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <div className='border border-gray-300 rounded-md'>
                                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Payment Methods</h2>
                                <form className='p-3 space-y-4' onSubmit={handlePaymentSettings}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField
                                            label="Card Number"
                                            name="cardNumber"
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            error={errors.payment?.cardNumber}
                                        />
                                        <InputField
                                            label="Card Holder Name"
                                            name="cardHolder"
                                            type="text"
                                            placeholder="John Doe"
                                            error={errors.payment?.cardHolder}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InputField
                                            label="Expiry Date"
                                            name="expiryDate"
                                            type="text"
                                            placeholder="MM/YY"
                                            error={errors.payment?.expiryDate}
                                        />
                                        <InputField
                                            label="CVV"
                                            name="cvv"
                                            type="text"
                                            placeholder="123"
                                            error={errors.payment?.cvv}
                                        />
                                    </div>
                                    <Button type="submit" isLoading={isUpdating}>
                                        Save Payment Method
                                    </Button>
                                </form>
                            </div>

                            <div className='border border-gray-300 rounded-md'>
                                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Payment Preferences</h2>
                                <form className='p-3 space-y-4'>
                                    <div className="flex items-center">
                                        <input
                                            id="default-payment"
                                            name="default-payment"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary-dark focus:ring-primary-dark border-gray-300 rounded"
                                        />
                                        <label htmlFor="default-payment" className="ml-2 block text-sm text-gray-900">
                                            Set as default payment method
                                        </label>
                                    </div>
                                    <Button type="button" onClick={handlePaymentSettings} isLoading={isUpdating}>
                                        Save Preferences
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Shipping Settings Tab */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <div className='border border-gray-300 rounded-md'>
                                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Shipping Address</h2>
                                <form className='p-3 space-y-4' onSubmit={handleShippingSettings}>
                                    <SelectField
                                        name="shippingState"
                                        label="State"
                                        value={user.shippingState || ''}
                                        options={nigerianStates}
                                        error={errors.shipping?.state}
                                    />
                                    <InputField
                                        label="Shipping Address"
                                        name="shippingAddress"
                                        value={user.shippingAddress || ''}
                                        error={errors.shipping?.address}
                                        required
                                    />
                                    <InputField
                                        label="Contact Phone"
                                        name="shippingPhone"
                                        type="tel"
                                        value={user.shippingPhone || ''}
                                        error={errors.shipping?.phone}
                                        required
                                    />
                                    <div className="flex items-center">
                                        <input
                                            id="default-shipping"
                                            name="defaultShipping"
                                            type="checkbox"
                                            checked={user.defaultShipping || false}
                                            className="h-4 w-4 text-primary-dark focus:ring-primary-dark border-gray-300 rounded"
                                        />
                                        <label htmlFor="default-shipping" className="ml-2 block text-sm text-gray-900">
                                            Set as default shipping address
                                        </label>
                                    </div>
                                    <Button type="submit" isLoading={isUpdating}>
                                        Save Shipping Address
                                    </Button>
                                </form>
                            </div>

                            <div className='border border-gray-300 rounded-md'>
                                <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Shipping Preferences</h2>
                                <form className='p-3 space-y-4'>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Preferred Shipping Method</label>
                                        <select
                                            name="shippingMethod"
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm rounded-md"
                                        >
                                            <option>Standard Shipping (3-5 days)</option>
                                            <option>Express Shipping (1-2 days)</option>
                                            <option>Next Day Delivery</option>
                                        </select>
                                    </div>
                                    <Button type="button" onClick={handleShippingSettings} isLoading={isUpdating}>
                                        Save Preferences
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminSettings;