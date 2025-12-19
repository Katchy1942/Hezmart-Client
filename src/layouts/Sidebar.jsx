import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logo_white as logo } from '../assets/images';
import {
    FaTachometerAlt,
    FaBox,
    FaTags,
    FaUsers,
    FaShoppingCart,
    FaChartLine,
    FaCog,
    FaStore,
    FaUserCircle,
    FaTimes,
    FaSignOutAlt
} from 'react-icons/fa';
import { logout } from '../utils/logout';
import { FaSpinner } from 'react-icons/fa6';
import { useState, useEffect } from 'react';

const Sidebar = ({ user, isToggle, setToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const vendorLinks = [
        { name: "Dashboard", path: "vendor/dashboard", icon: <FaTachometerAlt /> },
        { name: "Products", path: "vendor/products", icon: <FaBox /> },
        { name: "Orders", path: "vendor/orders", icon: <FaShoppingCart /> },
        { name: "Store Settings", path: "vendor/settings", icon: <FaStore /> },
    ];

    const adminLinks = [
        { name: "Dashboard", path: "admin/dashboard", icon: <FaChartLine /> },
        { name: "Products", path: "admin/products", icon: <FaBox /> },
        { name: "Categories", path: "admin/categories", icon: <FaTags /> },
        { name: "Orders", path: "admin/orders", icon: <FaShoppingCart /> },
        { name: "Customers", path: "admin/customers", icon: <FaUsers /> },
        { name: "Vendors", path: "admin/vendors", icon: <FaStore /> },
        { name: "Coupons", path: "admin/coupons", icon: <FaChartLine /> },
        { name: "Subscribers", path: "admin/subscribers", icon: <FaUsers /> },
        { name: "Settings", path: "admin/settings", icon: <FaCog /> },
    ];

    const links = user?.role === "admin" ? adminLinks : vendorLinks;
    
    // Check if mobile and handle scroll lock
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        // Initial check
        handleResize();
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        if (isMobile && isToggle) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isToggle, isMobile]);

    const handleLogout = async () => {
        setProcessing(true);
        try {
            await logout(navigate);
        } catch (err) {
            console.log(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isToggle && isMobile && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setToggle(false)}
                />
            )}
            
            <aside 
                className={
                    `fixed top-0 left-0 z-20 w-56 h-screen bg-[#E67002] shadow-md transition-all duration-300 ${
                    isToggle ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div className="h-full flex flex-col text-white">
                    {/* Close button */}
                    {isMobile && (
                        <button 
                            onClick={() => setToggle(false)}
                            className="md:hidden absolute top-4 right-4 text-white hover:text-gray-200"
                            aria-label="Close sidebar"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    )}
                    
                    {/* Logo */}
                    <div className="h-16 px-3 flex items-center justify-center">
                        <Link to='/' className='block w-full'>
                            <img src={logo} className='w-1/2' alt="Logo"/>
                        </Link>
                    </div>
                    
                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul>
                            {links.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`flex items-center text-sm font-medium px-4 py-3 mx-2 rounded-md transition-colors ${
                                            location.pathname.includes(link.path) 
                                                ? 'bg-[#c4650d]' 
                                                : 'text-white hover:bg-[#c4650d]'
                                        }`}
                                        onClick={() => isMobile && setToggle(false)}
                                        title={link.name}
                                    >
                                        <span className="mr-3">{link.icon}</span>
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    
                    <div className="p-4">
                        {/* <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200
                                flex items-center justify-center overflow-hidden">
                                {user?.photo && !imageError ? (
                                    <img src={user.photo} alt="User"
                                        className="w-full h-full object-cover"
                                        onError={handleImageError} />
                                ) : (
                                    <FaUserCircle className="text-gray-500 text-xl" />
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{user?.firstName || 'User'}</p>
                                <p className="text-xs text-orange-100 capitalize">{user?.role || 'user'}</p>
                            </div>
                        </div> */}
                        
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center py-3 px-3 rounded-md 
                                hover:text-gray-900 bg-red-600 text-sm font-medium text-white transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            disabled={processing}
                            aria-label="Logout"
                        >
                            {processing ? (
                                <FaSpinner className="animate-spin mr-2" />
                            ) : (
                                <FaSignOutAlt className="mr-2" />
                            )}
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;