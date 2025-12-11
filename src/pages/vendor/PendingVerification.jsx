import {ExtraLayout} from '../../layouts/ExtraLayout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../../utils/logout';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

const PendingVerification = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);

    const handleLogout = async () => {
        setProcessing(true);
        try {
            await logout(navigate);
        } finally {
            setProcessing(false);
        }
    };

    const handleContinue = () => {
        navigate('/vendor/dashboard');
    };

    const status = user?.status || 'pending';

    return (
        <ExtraLayout>
            <div className="text-center">

                {status === 'active' && (
                    <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                        <FaCheckCircle className="text-green-500 text-xl" />
                    </div>
                )}
                {status === 'pending' && (
                    <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                        <FaHourglassHalf className="text-amber-500 text-xl" />
                    </div>
                )}
                {status === 'denied' && (
                    <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                        <FaTimesCircle className="text-red-500 text-xl" />
                    </div>
                )}

                <h1 className="text-xl font-bold text-slate-900 mb-1">
                    {status === 'active' && 'Account Verified!'}
                    {status === 'pending' && 'Account Under Review'}
                    {status === 'denied' && 'Application Declined'}
                </h1>

                <p className="text-sm text-slate-500 mb-6">
                    Dear <span className="font-semibold text-slate-700">{user?.firstName}</span>,
                </p>

                {status === 'active' && (
                    <div className="space-y-3 text-slate-600 text-sm">
                        <p>Great news! Your vendor documentation has been verified.</p>
                        <p>You now have full access to the Hezmart Vendor Dashboard and can start listing your products immediately.</p>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                        <p>Your account was created successfully and is currently being processed by our compliance team.</p>
                        
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-amber-800">
                            <p className="font-medium mb-1">Expected Wait Time: ~30 Minutes</p>
                            <p className="opacity-80 text-[10px]">This page will automatically redirect once approved. You can also check your email for updates.</p>
                        </div>
                    </div>
                )}

                {status === 'denied' && (
                    <div className="space-y-3 text-slate-600 leading-relaxed text-sm">
                        <p>Unfortunately, we could not verify your vendor application at this time.</p>
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-red-700">
                            This is often due to unclear document uploads or invalid business registration numbers (NIN/RC).
                        </div>
                        <p>Please contact support or try registering again with clear documents.</p>
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-2.5">
                    {status === 'active' && (
                        <button
                            onClick={handleContinue}
                            className="w-full inline-flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 text-sm transition-all shadow-sm hover:shadow-md"
                        >
                            Continue to Dashboard
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
                        disabled={processing}
                        className={`w-full inline-flex items-center justify-center rounded-full font-medium px-6 py-2.5 text-sm transition-all
                            ${status === 'active' 
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                : 'bg-primary-light hover:bg-primary text-white shadow-sm hover:shadow-md'
                            }
                        `}
                    >
                        {processing ? 'Logging out...' : (status === 'active' ? 'Log Out' : 'Logout & Return Home')}
                    </button>

                    {status === 'denied' && (
                         <button className="text-primary hover:text-primary-dark text-sm font-medium mt-1">
                            Contact Support
                         </button>
                    )}
                </div>

            </div>
        </ExtraLayout>
    );
};

export default PendingVerification;
