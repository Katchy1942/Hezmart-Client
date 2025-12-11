import { logo, facebook, instagram, twitter, callIcon, message, tiktok } from '../assets/images';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputField from './common/InputField';
import axios from '../lib/axios';
import { toast } from 'react-toastify';
import Button from "./../components/common/Button";

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const formData = new FormData(e.target);
            const dataToSend = Object.fromEntries(formData);
            const res = await axios.post('api/v1/subscribers', dataToSend);
            if (res.data.status === 'success') {
                toast.success('Details submitted successfully');
                e.target.reset();
            }
        } catch (err) {
            console.log(err);
            if (err.response) {
                if (err.response.data.message) {
                    toast.error(err.response.data.message);
                }
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                }
            } else {
                toast.error(err.response?.data?.message || 'Failed to submit details');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className='relative'>
            <footer className="bg-[#FCF4ED]">
                <div className="lg:px-8 lg:py-6 p-4">
                    <div className="flex justify-between items-center">
                        <Link to='/'>
                            <img src={logo} alt="logo" className='w-36' />
                        </Link>
                        <div className="flex items-center justify-between bg-primary-light px-3 py-1.5 rounded-full gap-x-4">
                            <Link to="https://web.facebook.com/profile.php?id=61566347349473" target='_blank'>
                                <img src={facebook} width={24} height={24} alt="facebook" />
                            </Link>
                            <Link to="https://www.instagram.com/hezmart_ng/?igsh=bzYwY2c1YmxhcDlo#" target='_blank'>
                                <img src={instagram} width={24} height={24} alt="instagram" />
                            </Link>
                            <Link to="https://www.tiktok.com/@hezmart.com?_t=ZS-8z4XfDw4EXy&_r=1" target='_blank'>
                                <img src={tiktok} width={24} height={24} alt="tiktok" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 text-[14px] border-b border-gray-200 pb-12">
                        <div className="footer-section">
                            <h3 className="text-lg font-bold text-[#111827] mb-4">Need Help</h3>
                            <ul className="space-y-3">
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">Chat with Us</Link></li>
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">Help Center</Link></li>
                                <li><Link to="/contact" className="text-[#6B7280] hover:text-primary-dark transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="text-lg font-bold text-[#111827] mb-4">About Hezmart</h3>
                            <ul className="space-y-3">
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">About Us</Link></li>
                                <li><Link to="/privacy-policy" className="text-[#6B7280] hover:text-primary-dark transition-colors">Privacy Notice</Link></li>
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">Terms and Conditions</Link></li>
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">Cookie Notice</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="text-lg font-bold text-[#111827] mb-4">Useful Links</h3>
                            <ul className="space-y-3">
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">Dispute Resolution Policy</Link></li>
                                <li><Link to="/returns-refunds-policy" className="text-[#6B7280] hover:text-primary-dark transition-colors">Return Policy</Link></li>
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">Pickup Stations</Link></li>
                                <li><Link to="/" className="text-[#6B7280] hover:text-primary-dark transition-colors">How to return a product</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="text-lg font-bold text-[#111827] mb-4">Make Money With Hezmart</h3>
                            <ul className="space-y-3">
                                <li><Link to="/sell-on-hezmart" className="text-[#6B7280] hover:text-primary-dark transition-colors">Sell on Hezmart</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            
                            <div className="lg:col-span-7 flex flex-col space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Do You Need Help?
                                    </h3>
                                    <p className="text-gray-500 mt-2 text-sm max-w-lg">
                                        Our support team is available to assist you with any inquiries regarding your orders, shipping, or returns.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-white border 
                                    border-gray-100 shadow-sm transition hover:shadow-md group">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center 
                                        justify-center bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                                            <img src={callIcon} alt="call-icon" className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                Mon-Fri: 08am-9pm
                                            </span>
                                            <Link 
                                                to="tel:+2349160002490" 
                                                className="mt-1 text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors"
                                            >
                                                +234 9160002490
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-5 rounded-xl bg-white 
                                    border border-gray-100 shadow-sm transition hover:shadow-md group">
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center 
                                        justify-center bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                                            <img src={message} alt="message-icon" className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                Support Email
                                            </span>
                                            <Link 
                                                to="mailto:hezmartng@gmail.com" 
                                                className="mt-1 text-lg font-bold text-gray-900 
                                                hover:text-orange-600 transition-colors break-all"
                                            >
                                                hezmartng@gmail.com
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 
                                    rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
                                    <div className="relative z-10">
                                        <div>
                                            <h5 className="text-xl font-bold text-gray-900">
                                                Join our newsletter
                                            </h5>
                                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                                Register now to get latest updates on promotions & coupons. No spam!
                                            </p>
                                        </div>

                                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                                            <InputField
                                                name="name"
                                                label="Name"
                                                placeholder="Please enter your name"
                                                classNames="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                error={errors.name}
                                            />

                                            <InputField
                                                name="email"
                                                label="Email"
                                                placeholder="Please enter your email"
                                                classNames="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                error={errors.email}
                                            />

                                            <div className="pt-2">
                                                <Button 
                                                    type="submit"
                                                    variant="primary"
                                                    isLoading={processing}
                                                    disabled={processing}
                                                    loadingText="Processing..."
                                                    className="w-full justify-center py-3 text-base font-semibold 
                                                    shadow-md hover:shadow-lg transition-all transform 
                                                    active:scale-95 bg-primary hover:bg-primary-dark text-white"
                                                >
                                                    Subscribe
                                                </Button>
                                            </div>
                                        </form>

                                        <p className="mt-5 text-xs text-center text-gray-400">
                                            By subscribing you agree to our{' '}
                                            <Link
                                                to="/"
                                                className="font-medium text-gray-600 underline hover:text-orange-600 transition-colors"
                                            >
                                                Terms & Conditions and Privacy
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </footer>

            <div className="py-4 flex flex-col items-center justify-center bg-[#543d28] text-xs px-4 text-center">
                <h3 className="text-white/90 mb-1">&copy; {new Date().getFullYear()} Hezmart. All rights reserved.</h3>
            </div>

            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-xl 
                    hover:bg-primary-dark transition-all duration-300 focus:outline-none transform hover:-translate-y-1 z-50"
                    aria-label="Scroll to top"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Footer;