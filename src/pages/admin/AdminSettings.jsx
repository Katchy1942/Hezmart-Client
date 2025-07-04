import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import ProfileTab from "./ProfileTab";
import PaymentSettingsTab from "./PaymentSettingsTab";
import ShippingSettingsTab from "./ShippingSettingsTab";
import PickupLocationsTab from './PickupLocationsTab'
import StateFeesTab from "./StateFeesTab";

const AdminSettings = () => {
    const [user, setUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [errors, setErrors] = useState({
        account: {},
        address: {},
        password: {},
        payment: {},
        shipping: {}
    });
 
    // Payment settings state
    const [paymentSettings, setPaymentSettings] = useState({
        paymentMethods: [],
        defaultPaymentMethod: '',
        paymentInstructions: ''
    });
    
    const nigerianStates = [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
        "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
        "Ekiti", "Rivers", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", 
        "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
        "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", 
        "Sokoto", "Taraba", "Yobe", "Zamfara"
    ];

    const paymentMethodOptions = [
        { value: 'card', label: 'Credit/Debit Card' },
        { value: 'bank', label: 'Bank Transfer' },
        { value: 'wallet', label: 'Digital Wallet' }
    ];

    // Fetch user data
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

  

    // Fetch payment settings
    const getPaymentSettings = async () => {
        try {
            const res = await axios.get('api/v1/payment-settings');
            if (res.data.status === 'success') {
                setPaymentSettings(res.data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch payment settings');
        }
    };


    // Payment settings handler
    const handlePaymentSettingsSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        
        try {
            const res = await axios.post('api/v1/payment-settings', paymentSettings);
            if (res.data.status === 'success') {
                toast.success('Payment settings updated successfully');
                setPaymentSettings(res.data.data);
                setErrors(prev => ({ ...prev, payment: {} }));
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(prev => ({ ...prev, payment: err.response.data.errors }));
            }
            toast.error(err.response?.data?.message || 'Failed to update payment settings');
        } finally {
            setIsUpdating(false);
        }
    };


    // Payment settings handlers
    const handlePaymentMethodChange = (index, field, value) => {
        const updatedMethods = [...paymentSettings.paymentMethods];
        updatedMethods[index] = { ...updatedMethods[index], [field]: value };
        setPaymentSettings({ ...paymentSettings, paymentMethods: updatedMethods });
    };

    const addNewPaymentMethod = () => {
        setPaymentSettings({
            ...paymentSettings,
            paymentMethods: [
                ...paymentSettings.paymentMethods,
                { type: 'card', details: '', isActive: true }
            ]
        });
    };

    const removePaymentMethod = (index) => {
        const updatedMethods = paymentSettings.paymentMethods.filter((_, i) => i !== index);
        setPaymentSettings({ ...paymentSettings, paymentMethods: updatedMethods });
    };

    // Initial data loading
    useEffect(() => {
        getUser();
        getPaymentSettings();
    }, []);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
            </div>
        );
    }

    return (
        <section className='bg-gray-100 min-h-screen'>
            <div className="max-w-7xl mx-auto">
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
                            Payment
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Shipping
                        </button>

                        <button
                            onClick={() => setActiveTab('pickup')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pickup' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Pickup Stations
                        </button>

                         <button
                            onClick={() => setActiveTab('stateFee')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stateFee' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            State Fee
                        </button>
                    </nav>
                </div>
                
                {/* Tab Content */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5">
                    {activeTab === 'profile' && (
                        <ProfileTab 
                            user={user}
                            setUser={setUser}
                            errors={errors}
                            isUpdating={isUpdating}
                            nigerianStates={nigerianStates}
                        />
                    )}

                    {activeTab === 'payment' && (
                        <PaymentSettingsTab
                            paymentSettings={paymentSettings}
                        />
                    )}

                    {activeTab === 'shipping' && (
                        <ShippingSettingsTab/>
                    )}

                    {activeTab === 'pickup' && (
                        <PickupLocationsTab 
                            nigerianStates={nigerianStates} 
                        />
                    )}

                     {activeTab === 'stateFee' && (
                        <StateFeesTab 
                            nigerianStates={nigerianStates}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminSettings;