import { IoCheckmarkSharp } from "react-icons/io5";
import { useState, useEffect } from 'react';
import axios from "../../lib/axios";
import { toast } from 'react-toastify';

const PaymentMethodSection = ({ 
  paymentMethod, 
  setPaymentMethod,
  setSelectedWallet
}) => {
  const [cryptoWallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWalletId, setExpandedWalletId] = useState(null);

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

  useEffect(() => {
    if (paymentMethod === 'crypto') {
      getWallets();
    }
  }, [paymentMethod]);

  const handleToggleWallet = (wallet) => {
    setExpandedWalletId(expandedWalletId === wallet.id ? null : wallet.id);
    setSelectedWallet(wallet)
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Wallet address copied to clipboard");
  };

  

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${paymentMethod ? 'border-l-4 border-green-500' : ''}`}>
      <div className='flex justify-between mb-4'>
        <div className='flex gap-3 items-center'>
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white ${paymentMethod ? 'bg-green-500' : 'bg-gray-300'}`}>
            {paymentMethod && <IoCheckmarkSharp />}
          </div>
          <h1 className='uppercase text-sm font-semibold'>
            3. Payment Method
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setPaymentMethod('prepay')}
            className={`px-4 py-3 border rounded-md text-left ${paymentMethod === 'prepay' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'prepay' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
                {paymentMethod === 'prepay' && <IoCheckmarkSharp size={14} />}
              </div>
              <div>
                <h3 className="font-medium">Pre-pay Now</h3>
                <p className="text-sm text-gray-600 mt-1">Pay with Cards, Bank Transfer or USSD</p>
                <p className="text-xs text-gray-500 mt-1">You will be redirected to our secure checkout page.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`px-4 py-3 border rounded-md text-left ${paymentMethod === 'crypto' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
          >
            <div className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'crypto' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
                {paymentMethod === 'crypto' && <IoCheckmarkSharp size={14} />}
              </div>
              <div>
                <h3 className="font-medium">Crypto Payment</h3>
                <p className="text-sm text-gray-600 mt-1">Make payment using your preferred crypto network</p>
              </div>
            </div>
          </button>
        </div>

        {/* Crypto wallets */}
        {paymentMethod === 'crypto' && cryptoWallets?.length > 0 && (
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mt-4">
            <h4 className="font-medium text-sm mb-3">Available Crypto Wallets</h4>
            <div className="space-y-3">
              {cryptoWallets.map((wallet) => (
                <div 
                  key={wallet.id} 
                  className="p-3 bg-white rounded border border-gray-200 cursor-pointer hover:shadow transition"
                  onClick={() => handleToggleWallet(wallet)}
                >
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">{wallet.networkName}</h5>
                    {expandedWalletId !== wallet.id && (
                      <p className="text-xs text-gray-500">Click to get wallet address</p>
                    )}
                  </div>

                  {expandedWalletId === wallet.id && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Wallet Address:</p>
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <code className="text-sm break-all">{wallet.walletAddress}</code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(wallet.walletAddress);
                            }}
                            className="ml-2 cursor-pointer text-xs text-blue-600 hover:text-blue-800"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      {wallet.barcode && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Scan Barcode:</p>
                          <img
                            src={wallet.barcode}
                            alt={`${wallet.networkName} barcode`}
                            className="max-h-40 rounded border border-gray-200"
                          />
                        </div>
                      )}

                      {/* Warning message */}
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                        <h4 className="text-red-700 dark:text-red-300 text-sm font-semibold mb-1">
                          To avoid loss of funds:
                        </h4>
                        <ul className="text-red-600 dark:text-red-300 text-xs space-y-1">
                          <li className="flex items-start">
                            <span className="mr-1">•</span>
                            <span> Only send <strong>{wallet.networkName}</strong> to this address</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-1">•</span>
                            Make sure to copy the wallet address above and paste it into your crypto wallet
                          </li>
                          <li className="flex items-start">
                            <span className="mr-1">•</span>
                            <span> In your crypto wallet, select the{'   '}<strong>{wallet.networkName} </strong>{'   '}network when transferring</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-1">•</span>
                            Incorrect transfers may result in the loss of funds
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSection;
