import { useState, useRef } from 'react';
import {
    FaTimes, 
    FaMoneyBillWave, 
    FaCheckCircle 
} from 'react-icons/fa';
import axios from '../lib/axios';

const SalesRepresentativeProgram = ({ onClose }) => {
    const [name, setName] = useState('');
    const [motive, setMotive] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append("name", name);
        formData.append("motive", motive);

        try {
            const res = await axios.post('/api/v1/sales-rep/apply', formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            setSuccess('Application submitted successfully!');
            setName('');
            setMotive('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] relative overflow-hidden">
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-black/20 cursor-pointer hover:bg-black/40 text-white rounded-full transition backdrop-blur-sm"
            >
                <FaTimes />
            </button>

            {/* Header Image */}
            <div className="shrink-0 h-40 relative w-full">
                <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                    alt="Sales Representative Program" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                    <div className="p-6 text-white w-full">
                        <h2 className="text-xl font-bold">Sales Representative Program</h2>
                        <p className="text-xs text-gray-200 mt-1">Join our elite network of sales professionals.</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Become a face of our brand. We are looking for motivated individuals to drive growth and build lasting relationships.
                </p>

                {/* Requirements */}
                <div className="space-y-3 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Requirements</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                <FaCheckCircle className="text-blue-500 text-xs shrink-0" />
                                <span>Must have over <span className="font-bold text-gray-900">500 contacts.</span></span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                <FaCheckCircle className="text-blue-500 text-xs shrink-0" />
                                <span>Must be an <span className="font-bold text-gray-900">Admin in 3+ WhatsApp groups.</span></span>
                            </li>
                        </ul>
                    </div>

                    {/* Commission Info */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-start gap-3 shadow-sm">
                        <div className="p-2 bg-green-100 rounded-full shrink-0">
                            <FaMoneyBillWave className="text-green-600" />
                        </div>
                        <div>
                            <h4 className="text-green-900 font-bold text-sm">Commission Reward</h4>
                            <p className="text-green-800 text-sm mt-0.5 leading-snug">
                                Get a <span className="font-bold underline decoration-green-400 decoration-2 underline-offset-2">₦100 payout</span> each time a user you refer buys something from the app. Forever.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{success}</div>}
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition text-sm"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Motive */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Your Motive</label>
                        <textarea 
                            value={motive}
                            onChange={(e) => setMotive(e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition resize-none text-sm"
                            placeholder="Tell us why you want to join..."
                            required
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 pb-2">
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-primary-light text-white font-semibold py-3 rounded-full text-sm transition duration-200 shadow-md hover:shadow-lg transform active:scale-[0.99] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SalesRepresentativeProgram;
