import { IoCheckmarkSharp } from "react-icons/io5";
import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { FiMapPin, FiPhone, FiTag } from 'react-icons/fi';

const DeliveryOptionSection = ({
    deliveryOption,
    setDeliveryOption,
    deliveryFee,
    setDeliveryFee,
    selectedPickupStation,
    setSelectedPickupStation,
    setSelectedStateFee,
    shippingSettings,
    onStateSelected,
    onPickupStationSelected
}) => {
    const [pickupStations, setPickupStations] = useState([]);
    const [allPickupStations, setAllPickupStations] = useState([]);
    const [stateFees, setStateFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [internalSelectedState, setInternalSelectedState] = useState('');

    const { doorDeliveryEnabled, pickupEnabled } = shippingSettings || {};

    // Determine if step is completed
    const isStepCompleted =
        (deliveryOption === 'door' && internalSelectedState) ||
        (deliveryOption === 'pickup' && selectedPickupStation);

    const handleStateChange = (e) => {
        const newState = e.target.value;
        setInternalSelectedState(newState);

        if (deliveryOption === 'door') {
            const stateFee = stateFees.find(fee => fee.state === newState);
            const fee = stateFee ? stateFee.fee : 0;
            setDeliveryFee(fee);

            // Update both the fee and the entire state fee object
            if (stateFee) {
                setSelectedStateFee(stateFee);
            }

            if (onStateSelected) {
                onStateSelected({ state: newState, fee });
            }
        } else {
            const filteredStations = allPickupStations.filter(
                station => station.state === newState
            );
            setPickupStations(filteredStations);
            setSelectedPickupStation(null);
            setDeliveryFee(0);
            setSelectedStateFee(null); // Reset state fee when switching to pickup
        }
    };

    // Reset relevant states when delivery option changes
    useEffect(() => {
        setInternalSelectedState('');
        setSelectedPickupStation(null);
        setDeliveryFee(0);
    }, [deliveryOption]);

    // Fetch all pickup stations
    const fetchAllPickupStations = async () => {
        try {
            const res = await axios.get(
                'api/v1/shipping-settings/pickup-locations'
            );
            if (res.data.status === 'success') {
                setAllPickupStations(res.data.data.pickupLocations);
            }
        } catch (err) {
            console.log('Failed to fetch pickup stations', err);
        }
    };

    // Fetch state fees
    const getStateFees = async () => {
        try {
            const res = await axios.get(
                'api/v1/shipping-settings/state-fees'
            );
            if (res.data.status === 'success') {
                setStateFees(res.data.data.stateFees);
            }
        } catch (err) {
            console.log(err);
            // Assuming toast is available globally or missing import
            // toast.error(err.response?.data?.message || 'Failed to fetch state fees');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        getStateFees();
        if (pickupEnabled) {
            fetchAllPickupStations();
        }
    }, [pickupEnabled]);

    const handlePickupStationSelect = (station) => {
        setSelectedPickupStation(station.id);
        setDeliveryFee(station.fee);

        if (onPickupStationSelected) {
            onPickupStationSelected({
                stationId: station.id,
                state: station.state,
                fee: station.fee,
                stationDetails: station
            });
        }
    };

    // Set initial delivery option based on what's enabled
    useEffect(() => {
        if (doorDeliveryEnabled && !pickupEnabled) {
            setDeliveryOption('door');
        } else if (!doorDeliveryEnabled && pickupEnabled) {
            setDeliveryOption('pickup');
        }
    }, [doorDeliveryEnabled, pickupEnabled, setDeliveryOption]);

    if (!doorDeliveryEnabled && !pickupEnabled) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className='flex justify-between mb-4'>
                    <div className='flex gap-3 items-center'>
                        <div className="h-6 w-6 rounded-full flex items-center 
                            justify-center bg-gray-300 text-white">
                            <IoCheckmarkSharp />
                        </div>
                        <h1 className='uppercase text-sm font-semibold'>
                            2. Delivery Option
                        </h1>
                    </div>
                </div>
                <p className="text-gray-500">
                    No delivery options available at this time
                </p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl shadow-sm p-6 
            ${isStepCompleted ? 'border-2 border-green-500' : ''}`}>
            <div className='flex justify-between mb-4'>
                <div className='flex gap-3 items-center'>
                    <h1 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                        Delivery Option
                    </h1>
                </div>
            </div>

            <div className="space-y-4">
                {doorDeliveryEnabled && pickupEnabled ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setDeliveryOption('door')}
                            className={`px-4 py-3 border rounded-xl flex-1 text-left 
                                ${deliveryOption === 'door'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300'}`}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <div className={`h-5 w-5 rounded-full border 
                                    flex items-center justify-center 
                                    ${deliveryOption === 'door'
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-gray-300'}`}>
                                    {deliveryOption === 'door' &&
                                        <IoCheckmarkSharp size={14} />
                                    }
                                </div>
                                <span>Door Delivery</span>
                            </div>
                        </button>

                        <button
                            onClick={() => setDeliveryOption('pickup')}
                            className={`px-4 py-3 border rounded-xl flex-1 text-left 
                                ${deliveryOption === 'pickup'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300'}`}
                        >
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <div className={`h-5 w-5 rounded-full border 
                                    flex items-center justify-center 
                                    ${deliveryOption === 'pickup'
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : 'border-gray-300'}`}>
                                    {deliveryOption === 'pickup' &&
                                        <IoCheckmarkSharp size={14} />
                                    }
                                </div>
                                <span>Pickup Station</span>
                            </div>
                        </button>
                    </div>
                ) : doorDeliveryEnabled ? (
                    <div className={`px-4 py-3 border rounded-md 
                        ${isStepCompleted
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300'}`}>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <div className={`h-5 w-5 rounded-full border 
                                flex items-center justify-center 
                                ${isStepCompleted
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300'}`}>
                                {isStepCompleted && <IoCheckmarkSharp size={14} />}
                            </div>
                            <span>Door Delivery</span>
                        </div>
                    </div>
                ) : (
                    <div className={`px-4 py-3 border rounded-md 
                        ${isStepCompleted
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300'}`}>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <div className={`h-5 w-5 rounded-full border 
                                flex items-center justify-center 
                                ${isStepCompleted
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300'}`}>
                                {isStepCompleted && <IoCheckmarkSharp size={14} />}
                            </div>
                            <span>Pickup Station</span>
                        </div>
                    </div>
                )}

                {deliveryOption === 'door' && doorDeliveryEnabled && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <label className="block text-sm font-medium 
                                text-gray-700 mb-1">
                                State
                            </label>
                            <select
                                value={internalSelectedState}
                                onChange={handleStateChange}
                                className="w-full py-2 px-4 pr-10 transition-all 
                                    duration-200 focus:outline-none appearance-none 
                                    border border-[#D9E1EC] rounded-xl 
                                    placeholder-[#A1A7C4] text-black 
                                    focus:border-primary-light text-sm"
                            >
                                <option value="">Select State</option>
                                {stateFees.map(fee => (
                                    <option key={fee.id} value={fee.state}>
                                        {fee.state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {internalSelectedState && (
                            <div className="text-sm">
                                <p className="font-medium">
                                    Delivery Fee: ₦{deliveryFee?.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {deliveryOption === 'pickup' && pickupEnabled && (
                    <div className="mt-4">
                        <div className="mb-3">
                            <label className="block text-sm font-medium 
                                text-gray-700 mb-1">
                                State
                            </label>
                            <select
                                value={internalSelectedState}
                                onChange={handleStateChange}
                                className="w-full py-2 px-4 pr-10 transition-all 
                                    duration-200 focus:outline-none appearance-none 
                                    border border-[#D9E1EC] rounded-lg 
                                    placeholder-[#A1A7C4] text-black 
                                    focus:border-primary-light text-sm"
                            >
                                <option value="">Select State</option>
                                {Array.from(new Set(
                                    allPickupStations.map(station => station.state)
                                )).map(state => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {internalSelectedState && pickupStations.length > 0 && (
                            <div className="space-y-3">
                                <label className="block text-sm font-medium 
                                    text-gray-700 mb-1">
                                    Pickup Station
                                </label>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {pickupStations.map(station => (
                                        <div
                                            key={station.id}
                                            onClick={() => handlePickupStationSelect(station)}
                                            className={`p-4 border rounded-xl cursor-pointer 
                                                transition-all duration-200 relative overflow-hidden
                                                ${selectedPickupStation === station.id
                                                    ? 'border-green-500 bg-green-50/50 shadow-sm'
                                                    : 'border-gray-200 hover:border-green-200 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Custom Radio Button */}
                                                <div className={`mt-0.5 h-5 w-5 rounded-full border 
                                                    flex items-center justify-center shrink-0 
                                                    transition-colors duration-200
                                                    ${selectedPickupStation === station.id
                                                        ? 'border-green-500 bg-green-500'
                                                        : 'border-gray-300 bg-white'
                                                    }`}>
                                                    {selectedPickupStation === station.id &&
                                                        <IoCheckmarkSharp
                                                            size={12}
                                                            className="text-white"
                                                        />
                                                    }
                                                </div>

                                                {/* Station Details */}
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <h4 className="font-bold text-gray-900 text-sm">
                                                        {station.name}
                                                    </h4>

                                                    <div className="flex items-start gap-2.5">
                                                        <FiMapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                                                        <span className="text-sm text-gray-600 leading-tight max-w-lg">
                                                            {station.address}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2.5">
                                                        <FiPhone className="w-4 h-4 text-gray-400 shrink-0" />
                                                        <span className="text-sm text-gray-600">
                                                            {station.contactPhone}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2.5">
                                                        <FiTag className="w-4 h-4 text-gray-400 shrink-0" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            Fee: ₦{station.fee?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {deliveryFee > 0 && (
                                    <div className="text-sm pt-2">
                                        <p className="font-medium">
                                            Delivery Fee: ₦{deliveryFee.toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryOptionSection;