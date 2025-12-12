import { Link, useNavigate, useLocation } from "react-router-dom";
import { logo } from "../assets/images";
import { LuChartLine, LuMenu } from "react-icons/lu";
import {
    FiUser,
    FiLogOut,
    FiShoppingBag,
    FiChevronDown,
    FiChevronUp,
    FiHeart,
    FiX,
    FiChevronRight,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import { useCart } from "./contexts/CartContext";
import { logout } from "../utils/logout";
import LoadingSpinner from "./common/LoadingSpinner";
import axios from "../lib/axios";
import { BiSearch, BiSolidShoppingBag } from "react-icons/bi";
import HeaderBanner from "./HeaderBanner";
import CategoryDropdown from "./common/CategoryDropdown";

const Header = () => {
    const { cartCount } = useCart();
    
    // User Profile Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Category Dropdown State (New)
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const mobileMenuRef = useRef(null);
    const location = useLocation();

    const [selectedResult, setSelectedResult] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    
    // User Profile Dropdown Ref
    const dropdownRef = useRef(null);

    // Handle User Profile Dropdown Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle Category Dropdown Click Outside (New)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');

    const user = (storedUser && storedUser !== "undefined")
        ? JSON.parse(storedUser)
        : null;

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await axios.get(
                `/api/v1/search?q=${query}`
            );
            setSearchResults(response.data.data.results);
        } catch (error) {
            console.log("Search error:", error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleResultSelect = (result) => {
        if (result.type === 'product') {
            navigate(`/product/${result.id}`);
        } else if (result.type === 'category') {
            navigate(`/category/${result.id}`);
        } else if (result.type === 'subcategory') {
            navigate(
                `/category/${result.category.id}/${result.id}`
            );
        }
        setSearchResults([]);
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
        // Ensure dropdowns are closed on navigation
        setIsCategoryDropdownOpen(false);
        setIsDropdownOpen(false);
        document.body.style.overflow = '';
    }, [location.pathname]);

    // Mobile Menu Categories Logic
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                'api/v1/categories?fields=name,id,icon'
            );
            setCategories(res.data.data.categories);
            const initialExpandedState = {};
            res.data.data.categories.forEach(cat => {
                initialExpandedState[cat.id] = false;
            });
            setExpandedCategories(initialExpandedState);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleCategory = (categoryId, hasSubcategories) => {
        if (hasSubcategories) {
            setExpandedCategories(prev => ({
                ...prev,
                [categoryId]: !prev[categoryId]
            }));
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
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target)
            ) {
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

    const UserAvatar = ({ user }) => {
        return (
            <div
                className="w-8 h-8 rounded-full bg-primary-light
                flex items-center justify-center overflow-hidden"
            >
                {user?.photo ? (
                    <img
                        src={user.photo}
                        alt={`${user.firstName || 'User'} profile`}
                        className="w-full h-full object-cover"
                        onError={e => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentNode.innerHTML =
                                `<div class='flex items-center justify-center w-full h-full'>
                                <svg class='text-white' xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512" width="16" height="16">
                                <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128
                                128 0 1 0 0 256zm89.6 32h-11.8c-22.2 10.2-46.9 16-73.8
                                16s-51.6-5.8-73.8-16h-11.8C62.1 288 0 350.1 0 425.6V464c0
                                26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-38.4c0-75.5-62.1-137.6-134.4-137.6z"/>
                                </svg></div>`;
                        }}
                    />
                ) : (
                    <FaUser className="text-white w-4 h-4" />
                )}
            </div>
        );
    };

    return (
        <div className="bg-[#f1f1f2]">
            <div
                className="fixed top-0 left-0 right-0
                z-50 bg-white shadow-sm"
            >
                <HeaderBanner />

                <div className="w-full">
                    {isMobile && (
                        <nav
                            className="lg:hidden flex items-center
                            justify-between px-4 sm:px-6 py-3"
                        >
                            <button
                                onClick={toggleMobileMenu}
                                className="font-black shadow-sm flex items-center
                                justify-center h-10 w-10 border-0 ring-1
                                ring-gray-200 rounded-full"
                            >
                                <LuMenu className="text-lg" />
                            </button>
                            <Link to='/'>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="w-32"
                                />
                            </Link>
                            <div className="flex gap-2">
                                <Link
                                    onClick={() => setShowSearch(true)}
                                    className="font-black shadow-sm flex items-center justify-center
                                            h-10 w-10 border-0 ring-1 ring-gray-200 rounded-full"
                                >
                                    <BiSearch className="text-lg" />
                                </Link>

                                {showSearch && (
                                    <div className="fixed inset-0 bg-white z-50 p-4 animate-fadeIn">
                                        <SearchBar
                                            placeholder="Search products, brands and categories"
                                            onSearch={handleSearch}
                                            results={searchResults}
                                            onResultSelect={handleResultSelect}
                                            loading={searchLoading}
                                            className="w-full"
                                        />

                                        <button
                                            onClick={() => setShowSearch(false)}
                                            className="absolute top-0 right-0 text-gray-500 text-2xl"
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                )}

                                <Link
                                    to="/cart"
                                    className="relative flex h-10 w-10 items-center
                                    justify-center rounded-full bg-primary-light
                                    text-white shadow-sm transition-all duration-300
                                    hover:bg-primary hover:shadow-lg hover:-translate-y-0.5
                                    active:translate-y-0 active:shadow-sm"
                                >
                                    <BiSolidShoppingBag className="text-lg" />
                                    <span
                                        className="absolute -right-1 -top-1 flex h-4
                                        w-4 items-center justify-center rounded-full
                                        bg-red-500 text-[10px] font-bold text-white
                                        shadow-sm ring-2 ring-white"
                                    >
                                        {cartCount || 0}
                                    </span>
                                </Link>
                            </div>
                        </nav>
                    )}

                    {!isMobile && (
                        <nav
                            className="hidden px-4 sm:px-6 lg:px-8
                            lg:flex items-center justify-between py-4
                            max-w-[1440px] mx-auto w-full"
                        >
                            <div className="flex-1 flex justify-start">
                                <Link to='/' className="flex-shrink-0">
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="w-40 object-contain"
                                    />
                                </Link>
                            </div>

                            <div className="w-full max-w-2xl px-4">
                                <SearchBar
                                    placeholder="Search products, brands and categories"
                                    onSearch={handleSearch}
                                    results={searchResults}
                                    onResultSelect={handleResultSelect}
                                    loading={searchLoading}
                                    className="w-full"
                                />
                                <div className="mt-2 mr-12">
                                    <ul
                                        className="flex gap-6 text-[13px] text-gray-500
                                        font-medium justify-center"
                                    >
                                        {/* Dropdown for Categories */}
                                        <li
                                            ref={categoryDropdownRef}
                                            className="relative h-full flex items-center"
                                        >
                                            <div
                                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                                className={`cursor-pointer transition-colors flex items-center gap-1 select-none
                                                    ${isCategoryDropdownOpen ? 'text-primary-light' : 'hover:text-primary-light'}`}
                                            >
                                                Categories
                                                <FiChevronDown
                                                    className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                                                />
                                            </div>

                                            {/* Dropdown Container */}
                                            {isCategoryDropdownOpen && (
                                                <div className="absolute top-full left-0 mt-6 w-[280px] z-50 
                                                border border-gray-100 rounded-md">
                                                    <CategoryDropdown />
                                                </div>
                                            )}
                                        </li>
                                        {/* End Dropdown */}

                                        <li
                                            className="hover:text-primary-light cursor-pointer
                                            transition-colors"
                                        >
                                            <Link to="sell-on-hezmart">
                                                Sell on Hezmart
                                            </Link>
                                        </li>
                                        <li
                                            className="hover:text-primary-light cursor-pointer
                                            transition-colors"
                                        >
                                            <a href="tel:09160002490">
                                                Call 09160002490 to Order
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div
                                className="flex-1 flex justify-end items-center
                                gap-4"
                            >
                                {user ? (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={toggleDropdown}
                                            className="flex items-center gap-2
                                            focus:outline-none group border-0 ring-1
                                            ring-gray-200 rounded-full py-2 px-4
                                            text-gray-900 shadow-sm hover:ring-primary-light
                                            transition-all"
                                        >
                                            <UserAvatar user={user} />
                                            <div className="flex items-center">
                                                {isDropdownOpen ? (
                                                    <FiChevronUp
                                                        className="text-gray-500
                                                        transition-transform"
                                                    />
                                                ) : (
                                                    <FiChevronDown
                                                        className="text-gray-500
                                                        transition-transform
                                                        group-hover:translate-y-0.5"
                                                    />
                                                )}
                                            </div>
                                        </button>

                                        {isDropdownOpen && (
                                            <div
                                                className="absolute right-0 mt-2
                                                w-48 bg-white rounded-xl shadow-lg
                                                py-1 z-50 border border-gray-100"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2
                                                    text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <FiUser
                                                        className="mr-2 text-gray-500"
                                                    />
                                                    My Profile
                                                </Link>
                                                {/* <Link
                                                    to="/orders"
                                                    className="flex items-center px-4 py-2
                                                    text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <FiShoppingBag
                                                        className="mr-2 text-gray-500"
                                                    />
                                                    My Orders
                                                </Link> */}
                                                <Link
                                                    to="/wishlist"
                                                    className="flex items-center px-4 py-2
                                                    text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <FiHeart
                                                        className="mr-2 text-gray-500"
                                                    />
                                                    Wishlist
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full
                                                    px-4 py-2 text-sm text-red-600
                                                    border-t border-gray-100
                                                    hover:bg-red-50 cursor-pointer"
                                                >
                                                    {processing ? (
                                                        <div
                                                            className="flex items-center
                                                            gap-2"
                                                        >
                                                            <LoadingSpinner size="sm" />
                                                            <span>Logging out...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <FiLogOut className="mr-2" />
                                                            Logout
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link
                                            to="/customer-register"
                                            className="text-white rounded-full
                                            text-[14px] font-medium py-2.5
                                            bg-primary-light px-6 hover:bg-primary
                                            transition-colors shadow-sm"
                                        >
                                            Signup
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="py-2.5 px-6 rounded-full
                                            text-[14px] font-medium border
                                            border-gray-200 text-gray-700
                                            hover:border-primary-light
                                            hover:text-primary-light transition-all"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                )}

                                {user && userRole !== 'customer' && (
                                    <Link
                                        to={dashboardLink}
                                        className="px-6 py-2.5 rounded-full
                                        bg-gray-900 text-white text-[14px]
                                        font-medium hover:bg-gray-800
                                        transition-colors shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                <Link
                                    to="/cart"
                                    className="group relative flex h-11 w-11
                                    items-center justify-center rounded-full
                                    bg-gray-100 text-gray-600 shadow-sm
                                    transition-all duration-300
                                    hover:bg-primary-light hover:text-white"
                                >
                                    <BiSolidShoppingBag className="text-xl" />
                                    {cartCount > 0 && (
                                        <span
                                            className="absolute -right-1 -top-1
                                            flex h-5 w-5 items-center
                                            justify-center rounded-full bg-red-500
                                            text-[10px] font-bold text-white
                                            shadow-sm ring-2 ring-white"
                                        >
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </nav>
                    )}
                </div>
            </div>

            <div className="h-[120px] w-full"></div>

            <div
                ref={mobileMenuRef}
                className={`lg:hidden fixed h-screen inset-y-0
                left-0 bg-white z-50 w-80 pt-4 overflow-y-auto
                transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                
                <div
                    className="flex justify-end border-b
                    border-b-gray-200 px-6 py-2"
                >
                    <button
                        onClick={toggleMobileMenu}
                        className="font-black shadow-sm flex items-center
                        justify-center h-10 w-10 border-0 ring-1
                        ring-gray-200 rounded-full"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>

                <div
                    className="flex flex-col border-b
                    border-b-gray-200 px-4 py-3"
                >
                    {user ? (
                        <>
                            <div
                                className="flex items-center gap-3
                                px-4 py-3 mb-2"
                            >
                                <UserAvatar user={user} />
                                <div>
                                    <p className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-700 text-xs px-4 mb-3">
                                MY HEZMART ACCOUNT
                            </p>

                            <Link
                                to="/profile"
                                className="flex text-sm items-center py-2 px-4
                                text-gray-700 hover:bg-gray-100 rounded"
                            >
                                <FiUser className="mr-3" />
                                My Profile
                            </Link>
                            {/* <Link
                                to="/orders"
                                className="flex text-sm items-center py-2 px-4
                                text-gray-700 hover:bg-gray-100 rounded"
                            >
                                <FiShoppingBag className="mr-3" />
                                My Orders
                            </Link> */}
                            <Link
                                to="/wishlist"
                                className="flex text-sm items-center px-4 py-2
                                text-gray-700 hover:bg-gray-100 rounded"
                            >
                                <FiHeart className="mr-3" />
                                Wishlist
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex text-sm items-center py-2 px-4
                                text-gray-700 hover:bg-gray-100 rounded text-left"
                            >
                                {processing ? (
                                    <div
                                        className="flex items-center
                                        justify-center gap-2"
                                    >
                                        <LoadingSpinner size="sm" />
                                        <span>Logging you out...</span>
                                    </div>
                                ) : (
                                    <>
                                        <FiLogOut className="mr-3" />
                                        Logout
                                    </>
                                )}
                            </button>

                            {userRole !== 'customer' && (
                                <Link
                                    to={dashboardLink}
                                    className="flex text-sm items-center py-2 px-4
                                    text-gray-700 hover:bg-gray-100 rounded text-left"
                                    title="Go to Dashboard"
                                >
                                    <span>
                                        <LuChartLine className="mr-3" />
                                    </span>
                                    Dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                to="/customer-register"
                                className="text-white w-full rounded-full
                                text-[14px] font-medium py-2 bg-primary-light
                                px-6 cursor-pointer text-center mb-2"
                            >
                                Signup
                            </Link>
                            <Link
                                to="/login"
                                className="cursor-pointer w-full py-2 px-6
                                rounded-full text-[14px] font-medium border
                                border-primary-light text-center"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>

                <div className='border-b border-b-gray-200 py-4 px-4 mt-3'>
                    <p className="text-gray-700 text-xs px-4 mb-3">
                        OUR CATEGORIES
                    </p>
                    <ul>
                        {categories.map((category) => {
                            const hasSubcategories =
                                category.subcategories?.length > 0;
                            return (
                                <li
                                    key={category.id}
                                    className="border-b text-sm border-gray-100
                                    last:border-b-0"
                                >
                                    {hasSubcategories ? (
                                        <div
                                            className={`flex items-center justify-between
                                            p-2 rounded-md cursor-pointer
                                            ${expandedCategories[category.id]
                                                ? 'bg-gray-50'
                                                : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() =>
                                                toggleCategory(
                                                    category.id,
                                                    hasSubcategories
                                                )
                                            }
                                        >
                                            <div
                                                className="flex items-center
                                                w-full"
                                            >
                                                {category.icon ? (
                                                    <div
                                                        className="w-10 h-10
                                                        min-w-[2.5rem] mr-3
                                                        rounded-full overflow-hidden
                                                        border border-gray-200
                                                        bg-white"
                                                    >
                                                        <img
                                                            src={category.icon}
                                                            alt={category.name}
                                                            className="w-full h-full
                                                            object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="w-10 h-10
                                                        min-w-[2.5rem] mr-3
                                                        bg-gray-200 rounded-full
                                                        flex items-center
                                                        justify-center text-gray-400"
                                                    >
                                                        <span className="text-xs">
                                                            IMG
                                                        </span>
                                                    </div>
                                                )}
                                                <span
                                                    className="text-gray-700
                                                    font-medium"
                                                >
                                                    {category.name}
                                                </span>
                                            </div>
                                            {hasSubcategories && (
                                                expandedCategories[category.id] ? (
                                                    <FiChevronDown
                                                        className="text-gray-500
                                                        flex-shrink-0"
                                                    />
                                                ) : (
                                                    <FiChevronRight
                                                        className="text-gray-500
                                                        flex-shrink-0"
                                                    />
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            to={`/category/${category.id}`}
                                            className="flex items-center p-2
                                            rounded-md hover:bg-gray-50"
                                            onClick={() =>
                                                window.innerWidth < 1024 &&
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            {category.icon ? (
                                                <div
                                                    className="w-10 h-10
                                                    min-w-[2.5rem] mr-3
                                                    rounded-full overflow-hidden
                                                    border border-gray-200
                                                    bg-white"
                                                >
                                                    <img
                                                        src={category.icon}
                                                        alt={category.name}
                                                        className="w-full h-full
                                                        object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-10 h-10
                                                    min-w-[2.5rem] mr-3
                                                    bg-gray-200 rounded-full flex
                                                    items-center justify-center
                                                    text-gray-400"
                                                >
                                                    <span className="text-xs">
                                                        IMG
                                                    </span>
                                                </div>
                                            )}
                                            <span
                                                className="text-gray-700
                                                font-medium"
                                            >
                                                {category.name}
                                            </span>
                                        </Link>
                                    )}

                                    {expandedCategories[category.id] &&
                                    hasSubcategories && (
                                        <ul
                                            className="ml-12 mt-1 space-y-1
                                            border-l-2 border-gray-100 pl-2"
                                        >
                                            {category.subcategories.map((sub) => (
                                                <li key={sub.id}>
                                                    <Link
                                                        to={`/category/${category.id}/${sub.id}`}
                                                        className="block p-2 text-sm
                                                        text-gray-600 hover:text-blue-600
                                                        hover:bg-gray-50 rounded-md
                                                        transition-colors"
                                                        onClick={() =>
                                                            window.innerWidth < 1024 &&
                                                            setIsMobileMenuOpen(false)
                                                        }
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="py-2 px-4">
                    <ul>
                        <li
                            className="flex items-center text-sm rounded-md
                            hover:bg-gray-50"
                        >
                            <Link
                                to="/sell-on-hezmart"
                                className="py-2 px-4 text-gray-700
                                hover:bg-gray-100 rounded w-full"
                            >
                                Sell on Hezmart
                            </Link>
                        </li>
                        <li
                            className="flex items-center text-sm rounded-md
                            hover:bg-gray-50"
                        >
                            <Link
                                to="/contact-us"
                                className="py-2 px-4 text-gray-700
                                hover:bg-gray-100 rounded w-full"
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li
                            className="flex items-center text-sm rounded-md
                            hover:bg-gray-50"
                        >
                            <Link
                                to="/help-center"
                                className="py-2 px-4 text-gray-700
                                hover:bg-gray-100 rounded w-full"
                            >
                                Help Center
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden
                transition-opacity duration-300 ${
                    isMobileMenuOpen
                        ? 'opacity-100'
                        : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleMobileMenu}
            />

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