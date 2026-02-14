import { FiCopy, FiLoader, FiX, FiClock, FiCheck, FiSlash } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from '../../lib/axios'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Referral = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [referralData, setReferralData] = useState({
        referralCode: '',
        referrals: [],
        totalReferrals: 0,
        totalReferralAmount: 0,
        pendingReferralAmount: 0,
        lastReferral: null
    });

    const fetchReferralData = async () => {
        try {
            await axios.get('/api/v1/users/me');
            const { data } = await axios.get('/api/v1/referrals/get_referral_history');
            if (data.status === 'success') {
                setReferralData(prev => ({ ...prev, ...data.data }));
            }
        } catch (error) {
            console.error("Referral fetch error:", error);
            
            toast.error("Please log in to continue.");
            localStorage.removeItem('user');
            
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!referralData.referralCode) return;
        navigator.clipboard.writeText(`https://hezmart.com/customer-register?referral=${referralData.referralCode}`);
        toast.success('Link copied to clipboard');
    }

    const handleWithdraw = () => {
        if (referralData.pendingReferralAmount < 5000) {
            toast.info("Minimum withdrawal amount is N5,000");
        } else {
            // Todo
            toast.info("Withdrawal request feature coming soon.");
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    }

    useEffect(() => {
        fetchReferralData();
    }, []);

    if (loading) {
        return <div className='min-h-screen flex items-center justify-center'>
            <FiLoader className='w-8 h-8 animate-spin text-green-600' />
        </div>;
    }

    return (
        <section className='max-w-7xl mx-auto py-6 md:py-10 min-h-[calc(100vh-100px)] relative'>
            <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-xl font-semibold text-gray-900'>Referrals</h1>
                    <p className='text-gray-600 text-sm max-w-2xl'>Share your unique referral link with friends and family. Earn rewards every time they sign up and make a purchase! 😋</p>
                    <div className='mt-4'>
                        <span className={`text-green-700 font-medium text-sm bg-green-50 border-green-200 px-5 py-2 rounded-2xl cursor-pointer border inline-flex items-center gap-3 transition-all hover:shadow-xs max-w-full overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden`}
                            onClick={handleCopy}
                        >
                            <div className='flex items-center gap-2'>
                                {referralData.referralCode ? (
                                    <>
                                        <FiCopy className='w-5 h-5' />
                                        <span>https://hezmart.com/customer-register?referral={referralData.referralCode}</span>
                                    </>
                                ) : (
                                    <span>No referral code available</span>
                                )}
                            </div>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className='text-xl font-semibold text-gray-800'>Your Journey So Far</h1>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleWithdraw}
                                className="px-4 py-2.5 text-sm font-medium cursor-pointer text-white bg-green-600 rounded-2xl hover:bg-green-700 focus:ring-4 focus:ring-green-100 transition-colors shadow-sm"
                            >
                                Withdraw Funds
                            </button>
                        </div>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div className='flex flex-col bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow'>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-xs font-bold tracking-wider text-gray-500 uppercase'>Pending Withdrawal (NGN)</span>
                            </div>
                            <h2 className='text-gray-900 font-bold text-3xl'>{(referralData.pendingReferralAmount || 0).toLocaleString()}</h2>
                        </div>
                        <div className='flex flex-col bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow'>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-xs font-bold tracking-wider text-gray-500 uppercase'>Total Referrals</span>
                            </div>
                            <h2 className='text-gray-900 font-bold text-3xl'>{referralData.totalReferrals || 0}</h2>
                        </div>
                        <div className='flex flex-col bg-white p-6 rounded-3xl border border-gray-200 shadow-xs hover:shadow-sm transition-shadow'>
                            <div className='flex items-center justify-between mb-2'>
                                <span className='text-xs font-bold tracking-wider text-gray-500 uppercase'>Last Referral</span>
                            </div>
                            <h2 className='text-gray-900 font-bold text-lg md:text-xl'>{formatDate(referralData.lastReferral)}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Referral
