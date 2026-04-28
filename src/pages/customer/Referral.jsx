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

   useEffect(() => {
      fetchReferralData();
   }, []);

   if (loading) {
      return <div className='min-h-screen flex items-center justify-center'>
         <FiLoader className='w-8 h-8 animate-spin text-green-600' />
      </div>;
   }

   return (
      <section className='flex items-center justify-center py-6 md:py-10 min-h-[calc(100vh-100px)] relative'>
         <div className='flex flex-col gap-8 md:gap-12 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-4'>
            <div className='flex flex-col items-center justify-center'>
               <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Referrals</h1>
               <p className='text-gray-600 text-sm max-w-2xl text-center mt-2'>Earn each a referred customer makes a purchase!</p>
               <div className='mt-6'>
                  <span className={`text-green-700 text-xs uppercase tracking-tighter font-mono cursor-pointer`}                  >
                     <div className='flex items-center gap-2'>
                        {referralData.referralCode ? (
                           <>
                              <span className='underline'>https://hezmart.com/customer-register?referral={referralData.referralCode}</span>
                              <button onClick={handleCopy} className='bg-green-600 px-1 text-white text-xs uppercase tracking-tighter font-mono cursor-pointer'>Copy</button>
                           </>
                        ) : (
                           <span>No referral code available</span>
                        )}
                     </div>
                  </span>
               </div>
            </div>

            <div className="flex items-center justify-center">
               <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {[
                     { label: 'Total Earnings (NGN)', value: (referralData.totalEarnings || 0).toLocaleString() },
                     { label: 'Used Bonus (NGN)', value: (referralData.usedBonus || 0).toLocaleString() },
                     { label: 'Total Referrals', value: referralData.totalReferrals || 0 }
                  ].map((stat, index) => (
                     <div key={index} className='flex flex-col bg-[#f1f1f2] p-2 shadow-sm border border-gray-200 rounded-xl items-center text-center'>
                        <div className='flex items-center justify-between'>
                           <span className='text-xs font-light tracking-tighter text-gray-500 uppercase'>{stat.label}</span>
                        </div>
                        <h2 className='text-gray-900 font-medium text-3xl'>{stat.value}</h2>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   )
}

export default Referral
