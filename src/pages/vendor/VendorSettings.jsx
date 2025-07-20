import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import ProfileTab from "../../components/common/ProfileTab";
// import PaymentSettingsTab from "./PaymentSettingsTab";
// import ShippingSettingsTab from "./ShippingSettingsTab";
// import PickupLocationsTab from './PickupLocationsTab'
// import StateFeesTab from "./StateFeesTab";

const VendorSettings = () => {
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

    // Initial data loading
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
        <section className='bg-gray-100 min-h-screen'>
            <div className="">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
                
                {/* Responsive Tabs Navigation */}
                <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                    <nav className="flex space-x-8 min-w-max">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Profile
                        </button>
                        {/* <button
                            onClick={() => setActiveTab('payment')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Payment
                        </button> */}
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

                   

                   

                    {/* {activeTab === 'pickup' && (
                        <PickupLocationsTab 
                            nigerianStates={nigerianStates} 
                        />
                    )} */}

                   
                </div>
            </div>
        </section>
    );
};

export default VendorSettings;