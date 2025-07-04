import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import { toast } from 'react-toastify';

const ShippingSettingsTab = ({  
}) => {
    // Shipping settings state
    const [shippingSettings, setShippingSettings] = useState({
        doorDeliveryEnabled: true,
        pickupEnabled: true,
        freeShippingEnabled: false,
        freeShippingMinAmount: 10000,
    });
    const[isUpdating, setIsUpdating] = useState(false);
    const [errors, setErrors] = useState({
        shipping: {}
    });

    // Fetch shipping settings
    const getShippingSettings = async () => {
        try {
            const res = await axios.get('api/v1/shipping-settings/active');
            console.log(res);
            
            if (res.data.status === 'success') {
                setShippingSettings(res.data.data.settings);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch shipping settings');
            console.log(err)
        }
    };

    // Shipping settings handler
    const handleShippingSettingsSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        
        try {
            // First update main settings
            const settingsRes = await axios.post('api/v1/shipping-settings', {
                doorDeliveryEnabled: shippingSettings.doorDeliveryEnabled,
                pickupEnabled: shippingSettings.pickupEnabled,
                freeShippingEnabled: shippingSettings.freeShippingEnabled,
                freeShippingMinAmount: shippingSettings.freeShippingMinAmount
            });
            console.log(settingsRes);
            
            toast.success('Shipping settings updated successfully');
            setShippingSettings(settingsRes.data.data);
            setErrors(prev => ({ ...prev, shipping: {} }));
        } catch (err) {
            console.log(err);
            
            if (err.response?.data?.errors) {
                setErrors(prev => ({ ...prev, shipping: err.response.data.errors }));
            }
            toast.error(err.response?.data?.message || 'Failed to update shipping settings');
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        getShippingSettings();
    }, []);
    return (
        <div className="space-y-6">
            <form onSubmit={handleShippingSettingsSubmit}>
                {/* General Shipping Settings */}
                <div className='border border-gray-300 rounded-md'>
                    <h2 className='mb-4 border-b border-b-gray-300 p-3 font-medium'>Shipping Configuration</h2>
                    <div className='p-3 space-y-4'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="doorDeliveryEnabled"
                                    checked={shippingSettings.doorDeliveryEnabled}
                                    onChange={(e) => setShippingSettings({
                                        ...shippingSettings,
                                        doorDeliveryEnabled: e.target.checked
                                    })}
                                    className="h-4 w-4 text-primary-dark focus:ring-primary-dark border-gray-300 rounded"
                                />
                                <label htmlFor="doorDeliveryEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable Door Delivery
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="pickupEnabled"
                                    checked={shippingSettings.pickupEnabled}
                                    onChange={(e) => setShippingSettings({
                                        ...shippingSettings,
                                        pickupEnabled: e.target.checked
                                    })}
                                    className="h-4 w-4 text-primary-dark focus:ring-primary-dark border-gray-300 rounded"
                                />
                                <label htmlFor="pickupEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable Pickup Stations
                                </label>
                            </div>
                        </div>
                        
                        {/* <div className="hidden grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="freeShippingEnabled"
                                    checked={shippingSettings.freeShippingEnabled}
                                    onChange={(e) => setShippingSettings({
                                        ...shippingSettings,
                                        freeShippingEnabled: e.target.checked
                                    })}
                                    className="h-4 w-4 text-primary-dark focus:ring-primary-dark border-gray-300 rounded"
                                />
                                <label htmlFor="freeShippingEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable Free Shipping Threshold
                                </label>
                            </div>
                            {shippingSettings.freeShippingEnabled && (
                                <InputField
                                    label="Minimum Order Amount (₦)"
                                    name="freeShippingMinAmount"
                                    type="number"
                                    value={shippingSettings.freeShippingMinAmount}
                                    onChange={(e) => setShippingSettings({
                                        ...shippingSettings,
                                        freeShippingMinAmount: e.target.value
                                    })}
                                    min="0"
                                    step="100"
                                />
                            )}
                        </div> */}
                    </div>
                </div>

                <div className="mt-6">
                    <Button type="submit" isLoading={isUpdating}>
                        Save Shipping Settings
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ShippingSettingsTab;