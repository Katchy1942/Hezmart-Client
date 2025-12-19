import { FaSearch, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa6';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../utils/logout';

const Header = ({ user, toggle, setToggle }) => {
    const [imageError, setImageError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Morning';
        if (hour >= 12 && hour < 17) return 'Afternoon';
        if (hour >= 17 && hour < 22) return 'Evening';
        return 'Night';
    };

    const handleImageError = () => {
        setImageError(true);
    };

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

    const getSettingsPath = () => {
        return user?.role === 'admin' ? '/manage/admin/settings' : '/manage/vendor/settings';
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-56
            bg-white shadow-sm z-10 h-16 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
                {/* Left side - Mobile menu + User Profile */}
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setToggle(!toggle)}
                        className="md:hidden text-gray-600 hover:text-gray-900"
                    >
                        <div className="flex flex-col space-y-1">
                            <div className="w-4 h-0.5 bg-current"></div>
                            <div className="w-3 h-0.5 bg-current"></div>
                        </div>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center">
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
                            {
                                (user.firstName && user.lastName) ? (
                                    <span className="ml-2 text-sm font-medium">
                                        {getTimeBasedGreeting()}, {user.firstName}
                                    </span>
                                ) : (
                                    <span className="ml-2 text-sm font-medium">
                                        {getTimeBasedGreeting()} Hustler
                                    </span>
                                )
                            }
                    </div>
                </div>

                <div className="flex items-center md:space-x-3 text-sm">
                    <Link
                        to={getSettingsPath()}
                        className="flex items-center space-x-2 px-3 py-3
                            text-gray-600 hover:text-gray-900 bg-gray-100
                            rounded-md transition-colors font-medium"
                    >
                        <FaCog className="text-lg" />
                        <span>Settings</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        disabled={processing}
                        className="hidden md:flex items-center space-x-2 px-3 py-3
                            text-white hover:text-gray-900 bg-red-600
                            rounded-md transition-colors font-medium
                            disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {processing ? (
                            <FaSpinner className="text-lg animate-spin" />
                        ) : (
                            <FaSignOutAlt className="text-lg" />
                        )}
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;