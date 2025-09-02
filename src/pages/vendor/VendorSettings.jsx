import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import ProfileTab from "../../components/common/ProfileTab";
import BusinessTab from "./BusinessTab"; 

const VendorSettings = () => {
    const [user, setUser] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [errors, setErrors] = useState({
        account: {},
        address: {},
        password: {},
        payment: {},
        shipping: {},
        business: {} // Added business errors
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

    // Fetch categories for business category selection
    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await axios.get('api/v1/categories?fields=name,id,icon');
            setCategories(res.data.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoadingCategories(false);
        }
    };

    // Update business information
    const updateBusinessInfo = async (businessData) => {
        setIsUpdating(true);
        try {
            const formData = new FormData();
            
            // Append all business data to formData
            Object.keys(businessData).forEach(key => {
                if (key === 'businessLogo' && businessData[key]) {
                    formData.append(key, businessData[key]);
                } else if (businessData[key] !== null && businessData[key] !== undefined) {
                    formData.append(key, businessData[key]);
                }
            });

            const res = await axios.patch('api/v1/users/updateMe', formData);

            if (res.data.status === 'success') {
                setUser(res.data.data.user);
                toast.success('Business information updated successfully');
                setErrors(prev => ({...prev, business: {}}));
                return true;
            }
        } catch (err) {
            const backendErrors = err.response?.data?.errors || {};
            const newErrors = {};
            
            Object.entries(backendErrors).forEach(([field, msg]) => {
                newErrors[field] = msg;
            });
            
            setErrors(prev => ({...prev, business: newErrors}));
            
            if (err.response?.data?.message && !Object.keys(newErrors).length) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Failed to update business information');
            }
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    // Initial data loading
    useEffect(() => {
        getUser();
        fetchCategories();
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
                        <button
                            onClick={() => setActiveTab('business')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'business' ? 'border-primary-dark text-primary-dark' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Business
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
                    {activeTab === 'business' && (
                        <BusinessTab 
                            user={user}
                            updateBusinessInfo={updateBusinessInfo}
                            errors={errors.business}
                            isUpdating={isUpdating}
                            categories={categories}
                            loadingCategories={loadingCategories}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default VendorSettings;