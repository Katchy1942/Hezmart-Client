import { Link, useNavigate, useLocation } from "react-router-dom";
import { logo, logo_png } from "../assets/images";
import { LuShoppingCart, LuMenu } from "react-icons/lu";
import { 
  FiUser, 
  FiLogOut, 
  FiShoppingBag,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiGrid,
  FiHeart,
  FiX
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import { useCart } from "./contexts/CartContext";
import { logout } from "../utils/logout";
import LoadingSpinner from "./common/LoadingSpinner";
import axios from "../lib/axios";

const Header = () => {
    const { cartCount } = useCart();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const mobileMenuRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const topBarRef = useRef(null);
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
    }, [location.pathname]);

    const [categories, setCategories] = useState([]);
    const fetchCategories = async () => {
        try {
            const res = await axios.get('api/v1/categories?fields=name,id,icon');
            setCategories(res.data.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
                document.body.style.overflow = '';
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const callToActionHeight = 40;
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            setIsSticky(scrollPosition > callToActionHeight);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
        if (!isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
                document.body.style.overflow = '';
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const userRole = user?.role?.toLowerCase();
    const dashboardLink = userRole === 'admin' 
        ? '/manage/admin/dashboard' 
        : '/manage/vendor/dashboard';

    const handleLogout = async () => {
        setProcessing(true);
        try {
            await logout(navigate);
            setProcessing(false);
            setIsMobileMenuOpen(false);
            document.body.style.overflow = '';
        } catch (err) {
            setProcessing(false);
            console.log(err);
        }
    };

    const openWhatsApp = () => {
        const formattedNumber = '09160002490'.replace(/\D/g, '');
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const whatsappUrl = isIOS 
            ? `whatsapp://send?phone=${formattedNumber}`
            : `https://wa.me/${formattedNumber}`;

         setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 100);
        
        window.open(whatsappUrl, '_blank');
    };

    //  <div className="bg-primary-light flex justify-center lg:justify-end items-center py-2 px-4 sm:px-6 lg:px-8">
    //             <div className="flex items-center gap-2 text-white text-sm sm:text-base">
    //                 <span>CALL TO ORDER:</span>
    //                 <a 
    //                     href={`https://wa.me/${'09160002490'.replace(/\D/g, '')}`}
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     className="font-bold cursor-pointer hover:underline flex items-center"
    //                 >
    //                     09160002490
    //                 </a>
    //                 {/* <button 
    //                     onClick={openWhatsApp}
    //                     className="font-bold cursor-pointer hover:underline flex items-center"
    //                 >
    //                     <span>09160002490</span>
    //                 </button> */}
    //             </div>
    //         </div>

    return (
        <div className="bg-white">
            {/* Call-to-action */}
            <div className="bg-primary-light flex justify-center lg:justify-end items-center py-2 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-white text-sm sm:text-base">
                    <span>CALL TO ORDER:</span>
                     <a 
                        href={`https://wa.me/2349160002490`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold cursor-pointer hover:underline flex items-center"
                    >
                        09160002490
                    </a>
                    {/* <button 
                        onClick={openWhatsApp}
                        className="font-bold cursor-pointer hover:underline flex items-center"
                    >
                        <span>09160002490</span>
                    </button> */}
                </div>
            </div>
            
            {/* Top Bar */}
            <div 
                ref={topBarRef}
                className={`bg-white lg:bg-[#f1f1f2] w-full lg:py-2 py-[10px] transition-all duration-300 ${
                    isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : 'relative'
                }`}
            >
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
                    <Link to='sell-on-hezmart' className="text-primary-light font-bold text-xs cursor-pointer">
                        Sell on Hezmart
                    </Link>

                    <Link to='/'>
                        <img src={logo_png} alt="Logo" width={76} className="mx-auto lg:mx-0 lg:-translate-x-8"/>
                    </Link>
                    
                    {/* Mobile cart icon */}
                    {isMobile && (
                        <div className="flex items-center gap-4">
                            <Link to='/cart' className="relative text-black">
                                <LuShoppingCart className="text-2xl" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-white text-primary-dark rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button onClick={toggleMobileMenu} className="text-black">
                                {isMobileMenuOpen ? <FiX size={24} /> : <LuMenu size={24} />}
                            </button>
                        </div>
                    )}
                </div>
                <div className="lg:hidden pt-3 px-4 sm:px-6 lg:px-8">
                    <SearchBar />
                </div>
           
                {/* Desktop Navigation */}
                <nav className="hidden px-4 sm:px-6 lg:px-8 lg:flex items-center bg-white shadow py-3 justify-between">
                    <button onClick={toggleMobileMenu} className="text-black">
                        {isMobileMenuOpen ? <FiX size={24} /> : <LuMenu size={24} />}
                    </button>
                    <Link to='/'>
                        <img src={logo} alt="Logo" className="w-48"/>
                    </Link>
                    <SearchBar/>
                    <div className="flex gap-3 items-center">
                        {user ? (
                            userRole === 'customer' ? (
                                <div className="relative">
                                    <button 
                                        onClick={toggleDropdown}
                                        className="flex items-center gap-2 focus:outline-none group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                                            {user.firstName?.charAt(0) || <FiUser />}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-gray-700 mr-1">
                                                {user.firstName || 'Profile'}
                                            </span>
                                            {isDropdownOpen ? (
                                                <FiChevronUp className="text-gray-500 transition-transform" />
                                            ) : (
                                                <FiChevronDown className="text-gray-500 transition-transform group-hover:translate-y-0.5" />
                                            )}
                                        </div>
                                    </button>
                                    
                                    {isDropdownOpen && (
                                        <div 
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiUser className="mr-2 text-gray-500" />
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiShoppingBag className="mr-2 text-gray-500" />
                                                My Orders
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiHeart className="mr-2 text-gray-500" />
                                                Wishlist
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 border-t border-gray-100 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {processing ? (
                                                    <LoadingSpinner size="sm" />
                                                ) : (
                                                    <>
                                                    <FiLogOut className="mr-2 text-gray-500" />
                                                    Logout
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link 
                                    to={dashboardLink}
                                    className="flex items-center gap-2 text-gray-700 hover:text-primary-dark transition-colors"
                                    title="Go to Dashboard"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                                        {user.firstName?.charAt(0) || <FiGrid />}
                                    </div>
                                    <FiGrid className="text-xl" />
                                </Link>
                            )
                        ) : (
                            <>
                                <Link
                                    to="/customer-register"
                                    className="text-white bg-gradient-to-r rounded-xl py-2 from-primary-light to-primary-dark px-5 cursor-pointer"
                                >
                                    Signup
                                </Link>
                                <Link
                                    to="/login"
                                    className="cursor-pointer py-2 px-5 rounded-xl text-primary-light border border-primary-light"
                                >
                                    Login
                                </Link>
                            </>
                        )}

                        <Link to='/cart' className="bg-primary-light py-2 gap-x-1 font-medium text-white px-5 ml-4 flex items-center rounded shadow">
                            <LuShoppingCart className="text-2xl" />
                            {cartCount > 0 && <span>{cartCount}</span>}
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Mobile Navigation */}
            <div 
                ref={mobileMenuRef}
                className={`lg:hidden fixed h-screen inset-y-0 left-0 bg-white z-50 w-80 pt-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand section */}
                <div className="flex justify-between mb-4 border-b border-b-gray-200 px-6 py-2">
                    <button onClick={toggleMobileMenu} className="font-black">
                        <FiX size={24} />
                    </button>
                    <img src={logo} alt="" width={150}/>
                </div>
                
                {/* User Navigation Section */}
                <div className="flex flex-col border-b border-b-gray-200 px-4">
                    {user ? (
                        userRole === 'customer' ? (
                            <>
                                <p className="text-gray-700 text-xs px-4 mb-3">MY HEZMART ACCOUNT</p>
                                <Link 
                                    to="/profile" 
                                    className="flex text-sm items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    <FiUser className="mr-3" />
                                    My Profile
                                </Link>
                                <Link 
                                    to="/orders" 
                                    className="flex text-sm items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    <FiShoppingBag className="mr-3" />
                                    My Orders
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="flex text-sm items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    <FiHeart className="mr-3" />
                                    Wishlist
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex text-sm items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded text-left"
                                >
                                    {processing ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                        <FiLogOut className="mr-3" />
                                        Logout
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <Link 
                                to={dashboardLink}
                                className="flex items-center text-sm py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                            >
                                <FiGrid className="mr-3" />
                                Dashboard
                            </Link>
                        )
                    ) : (
                        <>
                            <Link
                                to="/customer-register"
                                className="text-white bg-gradient-to-r rounded-xl py-3 from-primary-light to-primary-dark px-5 cursor-pointer text-center mb-2"
                            >
                                Signup
                            </Link>
                            <Link
                                to="/login"
                                className="cursor-pointer py-3 px-5 rounded-xl text-primary-light border border-primary-light text-center"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>

                {/* Categories Section */}
                <div className='border-b border-b-gray-200 py-2 px-4 mt-3'>
                    <p className="text-gray-700 text-xs px-4 mb-3">OUR CATEGORIES</p>
                    <ul>
                       {categories && categories.length > 0 && categories.map(category => (
                        <li key={category.id}>
                            <Link
                                to={`/category/${category.id}`}
                                className="flex items-center py-3 px-5 text-sm rounded-md hover:bg-gray-50"
                            >
                                {category.icon ? (
                                    <img 
                                        src={category.icon} 
                                        alt={category.name} 
                                        className="w-4 h-4 mr-2 object-contain"
                                    />
                                ) : (
                                    <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div>
                                )}
                                <span className="text-gray-700">{category.name}</span>
                            </Link>
                        </li>
                       ))}
                    </ul>
                </div>

                {/* Action-Center */}
                <div className="py-2 px-4">
                    <ul>
                        <li className="flex items-center text-sm rounded-md hover:bg-gray-50">
                            <Link
                                to="/sell-on-hezmart"
                                className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded w-full"
                            >
                                Sell on Hezmart
                            </Link>
                        </li>
                        <li className="flex items-center text-sm rounded-md hover:bg-gray-50">
                            <Link
                                to="/contact-us"
                                className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded w-full"
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li className="flex items-center text-sm rounded-md hover:bg-gray-50">
                            <Link
                                to="/help-center"
                                className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded w-full"
                            >
                                Help Center
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleMobileMenu}
            />

            {/* Close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={closeDropdown}
                />
            )}
        </div>
    );
};

export default Header;