import{ useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from './../components/ScrollToTop'
import { FiX } from 'react-icons/fi'
import { referral } from '../assets/images';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const BaseLayout = () => {
    const storedUser = localStorage.getItem('user');
    const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

    const [showReferralModal, setShowReferralModal] = useState(false);
    
    useEffect(() => {
        setTimeout(() => {
            setShowReferralModal(true);
        }, 3000);
    }, []);

    const buildTawkChatWidget = async () => {
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/686df6e300e160190f563035/1ivmooqnn';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
    }


    const buildSmartsuppWidget = () => {
        window._smartsupp = window._smartsupp || {};
        window._smartsupp.key = "2e29c9cc80df07a647929a7de83abc95dc1fbcbf";

        (function (d) {
            var s,
                c,
                o = (window.smartsupp = function () {
                o._.push(arguments);
                });
            o._ = [];
            s = d.getElementsByTagName("script")[0];
            c = d.createElement("script");
            c.type = "text/javascript";
            c.charset = "utf-8";
            c.async = true;
            c.src = "https://www.smartsuppchat.com/loader.js?";
            s.parentNode.insertBefore(c, s);
        })(document);
    };

    useEffect(() => {
        // buildSmartsuppWidget()
    }, [])

    return (
        <div className='relative'>
            <ScrollToTop />
            <Header />
            <div className='bg-[#f1f1f2] relative px-4 sm:px-6 lg:px-8 pb-8'>
                <Outlet />
            </div>
            <Footer />
            <AnimatePresence>
                {showReferralModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#f1f1f2] rounded-3xl shadow-lg p-8 max-w-lg w-full relative"
                        >
                            {/* Close */}
                            <button
                                onClick={() => setShowReferralModal(false)}
                                className="absolute top-4 right-4 rounded-full p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                            >
                                <FiX className="w-6 h-6 text-gray-600" />
                            </button>

                            {/* Content */}
                            <div className="flex flex-col items-center text-center">
                                {/* Headline */}
                                <h2 className="text-2xl font-bold">
                                    Earn ₦100 for every friend you invite
                                </h2>

                                {/* Sub text */}
                                <p className="text-sm text-gray-600 mt-2">
                                    They get a bonus too. No limits.
                                </p>

                                {/* Image */}
                                <img
                                    src={referral}
                                    alt="referral-flyer"
                                    className="w-full object-cover rounded-xl mt-6"
                                />

                                {/* CTA */}
                                <Link
                                    to="/referral"
                                    className="mt-6 w-full bg-primary-light text-white rounded-xl shadow-md px-8 py-3 text-sm font-medium hover:opacity-90 transition-colors"
                                >
                                    Get my invite link
                                </Link>

                                {/* Soft exit */}
                                <button
                                    onClick={() => setShowReferralModal(false)}
                                    className="mt-3 text-sm text-gray-500 hover:underline"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default BaseLayout