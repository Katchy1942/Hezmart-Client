import { useState, useEffect } from 'react';
import { IoCheckmarkSharp } from "react-icons/io5";
import { FiCopy, FiAlertCircle, FiLoader } from "react-icons/fi";
import axios from "../../lib/axios";
import { toast } from 'react-toastify';

const PaymentMethodSection = ({
    paymentMethod,
    setPaymentMethod,
    setSelectedWallet
}) => {
    const [cryptoWallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedWalletId, setExpandedWalletId] = useState(null);

    const getWallets = async () => {
        try {
            setLoading(true);
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

    useEffect(() => {
        if (paymentMethod === 'crypto') {
            getWallets();
        }
    }, [paymentMethod]);

    const handleToggleWallet = (wallet) => {
        setExpandedWalletId(
            expandedWalletId === wallet.id ? null : wallet.id
        );
        setSelectedWallet(wallet);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Wallet address copied to clipboard");
    };

    return (
        <div className={`bg-white rounded-2xl shadow-sm p-6 
            ${paymentMethod ? 'border-2 border-green-500' : ''}`}>
            <div className='flex justify-between mb-4'>
                <div className='flex gap-3 items-center'>
                    <h1 className='text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                        Payment Method
                    </h1>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setPaymentMethod('prepay')}
                        className={`flex-1 px-4 py-4 border rounded-xl 
                            text-left transition-all duration-200
                            ${paymentMethod === 'prepay'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-200'}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 h-5 w-5 rounded-full border 
                                flex items-center justify-center shrink-0
                                ${paymentMethod === 'prepay'
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 bg-white'}`}>
                                {paymentMethod === 'prepay' &&
                                    <IoCheckmarkSharp size={14} />
                                }
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Pre-pay Now
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Pay with Cards, Bank Transfer or USSD.
                                    Redirects to secure checkout.
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('crypto')}
                        className={`flex-1 px-4 py-4 border rounded-xl 
                            text-left transition-all duration-200
                            ${paymentMethod === 'crypto'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-200'}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 h-5 w-5 rounded-full border 
                                flex items-center justify-center shrink-0
                                ${paymentMethod === 'crypto'
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 bg-white'}`}>
                                {paymentMethod === 'crypto' &&
                                    <IoCheckmarkSharp size={14} />
                                }
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    Crypto Payment
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Make payment manually using your
                                    preferred crypto network.
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Crypto wallets */}
                {paymentMethod === 'crypto' && (
                    <div className="animate-fade-in mt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <h4 className="font-semibold text-sm text-gray-700">
                                Select Network
                            </h4>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <FiLoader className="animate-spin text-primary-light h-8 w-8" />
                            </div>
                        ) : cryptoWallets?.length > 0 ? (
                            <div className="space-y-3">
                                {cryptoWallets.map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        className={`rounded-xl border transition-all 
                                            duration-200 overflow-hidden cursor-pointer
                                            ${expandedWalletId === wallet.id
                                                ? 'border-green-500 shadow-sm ring-1 ring-green-500/20'
                                                : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => handleToggleWallet(wallet)}
                                    >
                                        <div className={`p-4 flex items-center justify-between 
                                            ${expandedWalletId === wallet.id ? 'bg-green-50/50' : 'bg-white'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`h-4 w-4 rounded-full border 
                                                    flex items-center justify-center
                                                    ${expandedWalletId === wallet.id
                                                        ? 'border-green-500 bg-green-500'
                                                        : 'border-gray-300'}`}>
                                                    {expandedWalletId === wallet.id &&
                                                        <IoCheckmarkSharp size={10} className="text-white" />
                                                    }
                                                </div>
                                                <h5 className="font-semibold text-gray-800">
                                                    {wallet.networkName}
                                                </h5>
                                            </div>
                                            {expandedWalletId !== wallet.id && (
                                                <span className="text-xs text-gray-400 font-medium">
                                                    Click to view details
                                                </span>
                                            )}
                                        </div>

                                        {expandedWalletId === wallet.id && (
                                            <div className="px-4 pb-4 pt-0 bg-green-50/50">
                                                <div className="bg-white rounded-xl p-4 border border-green-100">
                                                    <div className="mb-4">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                                            Wallet Address
                                                        </p>
                                                        <div className="flex items-center gap-2 bg-gray-50 
                                                            border border-gray-200 p-2.5">
                                                            <code className="text-sm text-gray-800 break-all font-mono flex-1">
                                                                {wallet.walletAddress}
                                                            </code>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    copyToClipboard(wallet.walletAddress);
                                                                }}
                                                                className="p-1.5 text-gray-500 hover:text-primary-light 
                                                                    hover:bg-primary-light/10 rounded-md transition-colors"
                                                                title="Copy Address"
                                                            >
                                                                <FiCopy size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                                                        <div className="flex gap-4">
                                                            <div className="shrink-0">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                                                                    <FiAlertCircle className="h-5 w-5" />
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex-1 space-y-1.5">
                                                                <p className="text-sm font-bold text-red-900">
                                                                    Critical Warning
                                                                </p>
                                                                
                                                                <ul className="space-y-2 text-xs text-red-700">
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                                                                        <span className="leading-relaxed">
                                                                            Only send <strong className="rounded bg-red-100
                                                                             px-1.5 py-0.5 font-bold text-red-900">{wallet.networkName}</strong> to this address.
                                                                        </span>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                                                                        <span className="leading-relaxed">
                                                                            Ensure you are using the <strong className="font-bold 
                                                                            text-red-900">{wallet.networkName}</strong> network.
                                                                        </span>
                                                                    </li>
                                                                    <li className="flex items-start gap-2">
                                                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                                                                        <span className="leading-relaxed font-medium">
                                                                            Sending the wrong asset will result in permanent loss.
                                                                        </span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !loading &&
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-500">
                                    No crypto wallets available at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodSection;