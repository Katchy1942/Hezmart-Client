import { useState, useEffect } from "react";
import SelectField from "../common/SelectField";

const CheckoutShipping = ({ shippingMethods, selectedState, onMethodSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [doorDeliveryTimeframe, setDoorDeliveryTimeframe] = useState("3-5 days");

  // Calculate fees based on selected state and method
  useEffect(() => {
    if (!selectedState || !selectedMethod) {
      setDeliveryFee(0);
      return;
    }

    if (selectedMethod === 'doorDelivery') {
      const doorFee = shippingMethods?.stateFees?.find(
        fee => fee.deliveryType === 'door' && fee.state === selectedState
      );
      // Default fee if no state-specific fee found
      setDeliveryFee(doorFee?.fee || 1500); // Fallback to default door delivery fee
    } else if (selectedMethod === 'pickup') {
      const pickupFee = shippingMethods?.stateFees?.find(
        fee => fee.deliveryType === 'pickup' && fee.state === selectedState
      );
      // Default fee if no state-specific fee found
      setDeliveryFee(pickupFee?.fee || 500); // Fallback to default pickup fee
    }
  }, [selectedState, selectedMethod, shippingMethods]);

  // Reset selections when state changes
  useEffect(() => {
    setSelectedMethod(null);
    setSelectedLocation('');
    onMethodSelect(null);
  }, [selectedState]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    const selectedData = {
      method,
      fee: deliveryFee,
      ...(method === 'pickup' && { location: selectedLocation })
    };
    onMethodSelect(selectedData);
  };

  const handleLocationChange = (e) => {
    const location = e.target.value;
    const locationObj = shippingMethods.pickupLocations.find(loc => loc.id.toString() === location);
    setSelectedLocation(location);
    onMethodSelect({
      method: 'pickup',
      fee: deliveryFee,
      location: locationObj
    });
  };

  // Filter pickup locations for the selected state
  const getPickupLocations = () => {
    if (!shippingMethods?.pickupLocations || !selectedState) return [];
    return shippingMethods.pickupLocations.filter(loc => loc.state === selectedState);
  };

  return (
    <div className="border rounded-md p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
      
      {shippingMethods?.doorDeliveryEnabled && (
        <div 
          className={`border rounded-md p-4 mb-3 cursor-pointer ${
            selectedMethod === 'doorDelivery' ? 'border-primary-dark bg-primary-light' : 'border-gray-300'
          }`}
          onClick={() => handleMethodSelect('doorDelivery')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="shippingMethod"
              checked={selectedMethod === 'doorDelivery'}
              className="h-4 w-4 text-primary-dark focus:ring-primary-dark"
              readOnly
            />
            <div className="ml-3">
              <span className="block font-medium">Door Delivery</span>
              <span className="block text-sm text-gray-600">
                {doorDeliveryTimeframe} • ₦{deliveryFee}
              </span>
              {selectedState && shippingMethods.stateFees && !shippingMethods.stateFees.some(
                fee => fee.deliveryType === 'door' && fee.state === selectedState
              ) && (
                <span className="block text-xs text-gray-500 mt-1">
                  *Standard rate applied for {selectedState}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {shippingMethods?.pickupEnabled && (
        <div 
          className={`border rounded-md p-4 cursor-pointer ${
            selectedMethod === 'pickup' ? 'border-primary-dark bg-primary-light' : 'border-gray-300'
          }`}
          onClick={() => handleMethodSelect('pickup')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="shippingMethod"
              checked={selectedMethod === 'pickup'}
              className="h-4 w-4 text-primary-dark focus:ring-primary-dark"
              readOnly
            />
            <div className="ml-3">
              <span className="block font-medium">Pick-Up Station</span>
              <span className="block text-sm text-gray-600">
                ₦{deliveryFee}
              </span>
              {selectedState && shippingMethods.stateFees && !shippingMethods.stateFees.some(
                fee => fee.deliveryType === 'pickup' && fee.state === selectedState
              ) && (
                <span className="block text-xs text-gray-500">
                  *Standard rate applied for {selectedState}
                </span>
              )}
            </div>
          </div>

          {selectedMethod === 'pickup' && (
            <div className="mt-3">
              <SelectField
                label="Select Location"
                value={selectedLocation}
                onChange={handleLocationChange}
                options={getPickupLocations().map(loc => ({
                  value: loc.id.toString(),
                  label: `${loc.name || 'Location'} - ${loc.address} (${loc.contactPhone})`
                }))}
                required
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutShipping;