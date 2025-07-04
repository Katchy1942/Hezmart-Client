import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import InputField from "../../components/common/InputField";
import { toast } from 'react-toastify';
import axios from "../../lib/axios";
import { FiTrash2, FiCopy, FiEdit, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const PaymentSettingsTab = ({ paymentSettings }) => {
    const [errors, setErrors] = useState({});
    const [wallets, setWallets] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [expandedWallet, setExpandedWallet] = useState(null);
    const [barcodePreview, setBarcodePreview] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const handleSubmit = async (e) => {
        setProcessing(true);
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const res = await axios.post('api/v1/paymentOptions', formData);
            if (res.data.status === 'success') {
                toast.success('Wallet added successfully');
                getWallets();
                setShowForm(false);
                setErrors({});
                setBarcodePreview(null);
            }
        } catch (err) {
            if (err.response) {
                if (err.response.data.message) {
                    toast.error(err.response.data.message);
                }
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                }
            } else {
                toast.error(err.response?.data?.message || 'Failed to save wallet');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteWallet = async (id) => {
        if (window.confirm('Are you sure you want to delete this wallet?')) {
            setDeletingId(id);
            try {
                const res = await axios.delete(`api/v1/paymentOptions/${id}`);
                if (res.status === 204) {
                    toast.success('Wallet deleted successfully');
                    getWallets();
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete wallet');
            }finally{
                setDeletingId(null);
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Wallet address copied to clipboard');
    };

    const toggleWalletExpand = (id) => {
        setExpandedWallet(expandedWallet === id ? null : id);
    };

    const getWallets = async () => {
        try {
            const res = await axios.get('api/v1/paymentOptions');
            if (res.data.status === 'success') {
                setWallets(res.data.data.paymentOptions);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || 'Failed to fetch wallets');
        } finally {
            setLoading(false);
        }
    };

    const handleBarcodeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setBarcodePreview(previewUrl);
        } else {
            setBarcodePreview(null);
        }
    };

    useEffect(() => {
        getWallets();
    }, []);

    return (
        <div className="space-y-6">
            <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
                <div className='flex justify-between items-center border-b border-b-gray-200 p-4'>
                    <h2 className='text-lg font-semibold text-gray-800'>Payment Methods</h2>
                    {
                        showForm ? ( 
                            <button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowForm(false);
                                    setBarcodePreview(null);
                                }}
                                className="px-4 py-2 cursor-pointer border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                                >
                                Cancel
                            </button>
                        ) : (
                            <Button 
                                type="button" 
                                size="sm"
                                variant="primary"
                                onClick={() => {
                                    setShowForm(prev => !prev);
                                    setBarcodePreview(null); // reset preview
                                }}
                                iconLeft={<FiPlus className="mr-2" />}
                            >
                                Add Wallet
                            </Button>
                        )
                    }
                   
                </div>
                
                <div className='p-3 space-y-4'>
                    {showForm && (
                        <div className='p-3 bg-gray-50 rounded-lg border border-gray-200'>
                            <h3 className="text-md font-medium text-gray-700 mb-4">Add New Wallet</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-4">
                                    <InputField
                                        label="Network"
                                        name="networkName"
                                        placeholder="Enter network name e.g Bitcoin, Solana"
                                        error={errors.networkName}
                                    />
                                    <InputField
                                        label="Wallet Address"
                                        name="walletAddress"
                                        placeholder="Enter wallet address"
                                        error={errors.walletAddress}
                                    />
                                </div>  
                                
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Barcode (optional)</label>
                                    <input
                                        name="walletBarcode"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBarcodeChange}
                                        className="w-full py-2 px-4 transition-all duration-200 focus:outline-none border-1 border-solid border-[#D9E1EC] rounded-lg placeholder-[#A1A7C4] text-black focus:border-primary-light"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Upload a QR code or barcode image for easier payments</p>
                                    
                                    {barcodePreview && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                                            <img 
                                                src={barcodePreview} 
                                                alt="Barcode Preview"
                                                className="max-h-40 rounded border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div> 
                            
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowForm(false);
                                            setBarcodePreview(null);
                                        }}
                                        className="px-4 py-2 cursor-pointer border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <Button 
                                        type="submit"
                                        variant="primary"
                                        isLoading={processing}
                                        disabled={processing}
                                        loadingText="Saving..."
                                    >
                                        Save Wallet
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark"></div>
                        </div>
                    ) : wallets.length > 0 ? (
                        <div className="space-y-4">
                            <h3 className="text-md font-medium text-gray-700">Your Wallets</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {wallets.map((wallet) => (
                                    <div 
                                        key={wallet.id} 
                                        className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div 
                                            className="p-4 cursor-pointer flex justify-between items-center"
                                            onClick={() => toggleWalletExpand(wallet.id)}
                                        >
                                            <div>
                                                <h4 className="font-medium text-gray-800">{wallet.networkName}</h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {wallet.walletAddress.substring(0, 12)}...{wallet.walletAddress.substring(wallet.walletAddress.length - 4)}
                                                </p>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                {expandedWallet === wallet.id ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>
                                        </div>
                                        
                                        {expandedWallet === wallet.id && (
                                            <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                                                <div className="flex items-start justify-between items-center bg-gray-50 p-3 rounded">
                                                    <span className="text-sm font-medium text-gray-700">Address:</span>
                                                    <button 
                                                        onClick={() => copyToClipboard(wallet.walletAddress)}
                                                        className="text-primary-dark hover:text-primary-darker flex items-center"
                                                    >
                                                        <FiCopy className="mr-1" size={14} />
                                                        <span className="text-xs">Copy</span>
                                                    </button>
                                                </div>
                                                <div className="break-all text-xs bg-gray-50 p-3 rounded font-mono">
                                                    {wallet.walletAddress}
                                                </div>
                                                
                                                {wallet.barcode && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Barcode:</p>
                                                        <div className="flex justify-center bg-white p-2 rounded border border-gray-200">
                                                            <img 
                                                                src={wallet.barcode} 
                                                                alt={`${wallet.networkName} barcode`}
                                                                className="max-h-40 object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="flex justify-end pt-2">
                                                    <button
                                                        onClick={() => handleDeleteWallet(wallet.id)}
                                                        disabled={deletingId === location.id}
                                                        className="cursor-pointer text-red-600 hover:text-red-800 flex items-center text-sm"
                                                    >
                                                        {deletingId === location.id ? (
                                                            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-red-600 rounded-full"></div>
                                                        ) : (
                                                            <FiTrash2 className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiPlus className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No wallets added yet</h3>
                            <p className="text-gray-500 mb-4">Add your first wallet to start receiving payments</p>
                            <Button 
                                type="button" 
                                variant="primary"
                                onClick={() => setShowForm(true)}
                                iconLeft={<FiPlus className="mr-2" />}
                            >
                                Add Wallet
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSettingsTab;
