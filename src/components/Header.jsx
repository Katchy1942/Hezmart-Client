import { Link, useNavigate } from "react-router-dom";
import { logo_white, logo } from "../assets/images";
import { LuShoppingCart, LuMenu } from "react-icons/lu";
import { 
  FiUser, 
  FiLogOut, 
  FiShoppingBag,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiGrid,
  FiX
} from "react-icons/fi";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { useCart } from "./contexts/CartContext";
import { logout } from "../utils/logout";
import LoadingSpinner from "./common/LoadingSpinner";

const Header = () => {
    const { cartCount } = useCart();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Determine user role and dashboard link
    const userRole = user?.role?.toLowerCase();
    const dashboardLink = userRole === 'admin' 
        ? '/manage/admin/dashboard' 
        : '/manage/vendor/dashboard';

    const handleLogout = async () => {
        setProcessing(true);
        try {
            const res = await logout(navigate);
            setProcessing(false);
            setIsMobileMenuOpen(false);
        } catch (err) {
            setProcessing(false);
            console.log(err);
        }
    };

    return (
        <div className="sticky top-0 z-50 bg-white">
            {/* Top Bar */}
            <div className="bg-primary-light w-full px-4 sm:px-6 lg:px-8 lg:py-1 py-[10px]">
                <div className="flex items-center justify-between">
                    <Link to='sell-on-hezmart' className="text-white lg:text-base text-xs cursor-pointer">
                        Sell on Hezmart
                    </Link>

                    <img src={logo_white} alt="Logo" width={76} className="mx-auto lg:mx-0 lg:-translate-x-8"/>
                    
                    {/* Mobile cart icon */}
                    {isMobile && (
                        <div className="flex items-center gap-4">
                            <Link to='/cart' className="relative text-white">
                                <LuShoppingCart className="text-2xl" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-white text-primary-dark rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button onClick={toggleMobileMenu} className="text-white">
                                {isMobileMenuOpen ? <FiX size={24} /> : <LuMenu size={24} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
           
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex max-w-7xl mx-auto bg-white shadow px-4 sm:px-6 lg:px-8 py-3 justify-between">
                <Link to='/'>
                    <img src={logo} alt="Logo"/>
                </Link>
                <SearchBar/>
                <div className="flex gap-3 items-center">
                    {user ? (
                        // Show different UI based on user role
                        userRole === 'customer' ? (
                            // Customer dropdown
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
                                
                                {/* Dropdown Menu for Customers */}
                                {isDropdownOpen && (
                                    <div 
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={closeDropdown}
                                        >
                                            <FiUser className="mr-2 text-gray-500" />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={closeDropdown}
                                        >
                                            <FiShoppingBag className="mr-2 text-gray-500" />
                                            My Orders
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
                            // Admin/Vendor dashboard link
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
                        // Show login/signup buttons when no user
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

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-white z-40 pt-4 px-4 overflow-y-auto">
                    <div className="flex justify-end mb-4">
                        <button onClick={toggleMobileMenu} className="text-gray-700">
                            <FiX size={24} />
                        </button>
                    </div>
                    
                    <div className="mb-6">
                        <SearchBar mobile={true} />
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                        {user ? (
                            userRole === 'customer' ? (
                                <>
                                    <Link 
                                        to="/profile" 
                                        onClick={toggleMobileMenu}
                                        className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                                    >
                                        <FiUser className="mr-3" />
                                        My Profile
                                    </Link>
                                    <Link 
                                        to="/orders" 
                                        onClick={toggleMobileMenu}
                                        className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                                    >
                                        <FiShoppingBag className="mr-3" />
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded text-left"
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
                                    onClick={toggleMobileMenu}
                                    className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    <FiGrid className="mr-3" />
                                    Dashboard
                                </Link>
                            )
                        ) : (
                            <>
                                <Link
                                    to="/customer-register"
                                    onClick={toggleMobileMenu}
                                    className="text-white bg-gradient-to-r rounded-xl py-3 from-primary-light to-primary-dark px-5 cursor-pointer text-center"
                                >
                                    Signup
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={toggleMobileMenu}
                                    className="cursor-pointer py-3 px-5 rounded-xl text-primary-light border border-primary-light text-center"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                        
                        <Link
                            to="/sell-on-hezmart"
                            onClick={toggleMobileMenu}
                            className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            Sell on Hezmart
                        </Link>
                    </div>
                </div>
            )}

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