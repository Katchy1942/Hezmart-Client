import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import SelectField from "../../components/common/SelectField";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import { toast } from 'react-toastify';

const ShippingSettingsTab = () => {
    // Default shipping settings state
    const defaultShippingSettings = {
        doorDeliveryEnabled: false,
        pickupEnabled: false,
        minShippingEnabled: false,
        shippingMinAmount: 8000,
    };

    const [shippingSettings, setShippingSettings] = useState(defaultShippingSettings);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({
        shipping: {}
    });

    // Fetch shipping settings
    const getShippingSettings = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('api/v1/shipping-settings/all'); 
            if (res.data.status === 'success' && res.data.data.settings[0]) { 
                setShippingSettings(res.data.data.settings[0]);
            } else {
                // Use default settings if no settings found
                setShippingSettings(defaultShippingSettings);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch shipping settings');
            console.log(err);
            // Fall back to default settings on error
            setShippingSettings(defaultShippingSettings);
        } finally {
            setIsLoading(false);
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
                minShippingEnabled: shippingSettings.minShippingEnabled,
                shippingMinAmount: shippingSettings.shippingMinAmount
            });
            
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

    // Show loading state while fetching settings
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
            </div>
        );
    }

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
                                    checked={shippingSettings?.doorDeliveryEnabled || false}
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
                                    checked={shippingSettings?.pickupEnabled || false}
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
                        
                        <div className="grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="freeShippingEnabled"
                                    checked={shippingSettings?.minShippingEnabled || false}
                                    onChange={(e) => setShippingSettings({
                                        ...shippingSettings,
                                        minShippingEnabled: e.target.checked
                                    })}
                                    className="h-4 w-4 text-primary-dark focus:ring-primary-dark border-gray-300 rounded"
                                />
                                <label htmlFor="freeShippingEnabled" className="ml-2 block text-sm text-gray-900">
                                    Enable Shipping Threshold
                                </label>
                            </div>
                            {shippingSettings?.minShippingEnabled && (
                                <InputField
                                    label="Minimum Order Amount (₦)"
                                    name="freeShippingMinAmount"
                                    type="number"
                                    value={shippingSettings?.shippingMinAmount || 8000}
                                    onChange={(e) => setShippingSettings({
                                        ...shippingSettings,
                                        shippingMinAmount: e.target.value
                                    })}
                                    min="0"
                                    step="100"
                                />
                            )}
                        </div>
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