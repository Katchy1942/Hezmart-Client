import { FaBell, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../components/contexts/CartContext';

const Header = ({ user, toggle, setToggle }) => {
  const { cartCount } = useCart();
  return (
    <header className="fixed top-0 right-0 left-0 md:left-56 bg-white shadow-sm z-10 h-16 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        {/* Mobile menu button */}
        <button 
          onClick={() => setToggle(!toggle)}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          {toggle ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-md mx-4">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent border-none outline-none w-full text-gray-700"
          />
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-gray-900">
            <FaBell className="text-xl" />
            {/* Notification will be display here
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span> */}
          </button>
          
          <button className="relative text-gray-600 hover:text-gray-900">
            <FaShoppingCart className="text-xl" />
            {/* Cart total will be display here
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">5</span> */}
          </button>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.photo ? (
                <img src={user.photo} alt="User" className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle className="text-gray-500 text-xl" />
              )}
            </div>
            <span className="ml-2 text-sm font-medium hidden md:inline">Hi {user?.firstName || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;