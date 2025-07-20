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
  
  const vendorLinks = [
    { name: "Dashboard", path: "vendor/dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", path: "vendor/products", icon: <FaBox /> },
    { name: "Orders", path: "vendor/orders", icon: <FaShoppingCart /> },
    { name: "Store Settings", path: "vendor/settings", icon: <FaStore /> },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "admin/dashboard", icon: <FaTachometerAlt /> },
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
        className={`fixed top-0 left-0 z-20 w-56 h-screen bg-[#E67002] shadow-md transition-all duration-300 ${
          isToggle ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col text-white">
          {/* Close button */}
          {isMobile && (
            <button 
              onClick={() => setToggle(false)}
              className="md:hidden absolute top-4 right-4 text-white hover:text-gray-200"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <div className="h-16 px-3 flex items-center justify-center border-b border-orange-300">
            <Link to='/' className='block w-full'>
              <img src={logo} className='w-2/4' alt="Logo"/>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul>
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center px-4 py-3 mx-2 rounded-md transition-colors ${
                      location.pathname.includes(link.path) 
                        ? 'bg-white text-[#E67002] font-medium' 
                        : 'text-white hover:bg-orange-500'
                    }`}
                    onClick={() => isMobile && setToggle(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile & Logout - Always visible */}
          <div className="p-4 border-t border-orange-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center overflow-hidden">
                {user?.photo ? (
                  <img src={user.photo} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className="text-[#E67002] text-xl" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-orange-100 capitalize">{user?.role || 'user'}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white transition-colors"
              disabled={processing}
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