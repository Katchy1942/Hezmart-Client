import { useState } from 'react';
import { FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Button from '../common/Button';
import { FiPlus } from 'react-icons/fi';
import AddressForm from './AddressForm';

const CustomerAddressSection = ({
    currentUser,
    selectedAddress,
    setSelectedAddress
}) => {
    const [showAddressForm, setShowAddressForm] = useState(false);

    const isValidAddress = selectedAddress &&
        selectedAddress.firstName &&
        selectedAddress.lastName &&
        selectedAddress.primaryPhone &&
        selectedAddress.state &&
        selectedAddress.primaryAddress;

    return (
        <div className={`bg-white rounded-2xl shadow-sm p-6 
            ${isValidAddress ? 'border-2 border-green-500' : ''}`}>
            <div className='flex justify-between mb-4'>
                <div className='flex gap-3 items-center'>
                    <h1 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                        Customer Address
                    </h1>
                </div>
            </div>

            {isValidAddress ? (
                <div className="mb-4">
                    <div className="group relative rounded-xl border 
                        border-gray-200 bg-white p-5 shadow-sm transition-all 
                        hover:border-primary-light/30 hover:shadow-md">
                        <div className="flex items-center gap-3 pb-3 
                            border-b border-gray-100 mb-3">
                            <div className="flex-shrink-0 flex items-center 
                                justify-center w-10 h-10 rounded-full 
                                bg-gray-50 text-gray-500 
                                group-hover:bg-primary-light/10 
                                group-hover:text-primary-light transition-colors">
                                <FiUser className="w-5 h-5" />
                            </div>
                            <p className="font-bold text-gray-900 text-lg">
                                {selectedAddress.firstName} {selectedAddress.lastName}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-start gap-y-3 
                            gap-x-6 text-sm text-gray-700">
                            <div className="flex items-start gap-2.5 w-full">
                                <FiMapPin className="w-4 h-4 mt-0.5 
                                    text-gray-400 shrink-0" />
                                <span className="leading-tight">
                                    {selectedAddress.primaryAddress}, {selectedAddress.state}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <FiPhone className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>
                                    {selectedAddress.primaryPhone}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <FiMail className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="break-all">
                                    {selectedAddress.email}
                                </span>
                            </div>
                        </div>
                    </div>
                    {currentUser && (
                        <button
                            onClick={() => setShowAddressForm(true)}
                            className="mt-3 text-sm flex items-center 
                                bg-gray-900 text-white font-semibold 
                                px-6 py-3 rounded-full hover:bg-gray-800 
                                transition-colors"
                        >
                            Update Information
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-sm text-gray-500">
                    {currentUser && <p>No delivery information saved</p>}
                    {currentUser && (
                        <Button
                            variant="text"
                            onClick={() => setShowAddressForm(true)}
                            className="mt-2 text-sm flex items-center"
                            icon={<FiPlus className="mr-1" />}
                        >
                            Add Information
                        </Button>
                    )}
                </div>
            )}

            {/* Modal Overlay */}
            {showAddressForm && currentUser && (
                <div className="fixed inset-0 z-50 flex items-center 
                    justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    {/* Modal Content */}
                    <div className="w-full max-w-sm overflow-y-auto max-h-[90vh] relative">
                        <div className="p-1">
                            <AddressForm
                                from="modal"
                                currentUser={currentUser}
                                onSave={(address) => {
                                    setSelectedAddress(address);
                                    setShowAddressForm(false);
                                }}
                                onCancel={() => setShowAddressForm(false)}
                                initialAddress={selectedAddress}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerAddressSection;
