import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';
import usePagination from '../../hooks/usePagination';
import DataTableFilters from '../../components/common/DataTableFilters';

const ShopManager = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [statusError, setStatusError] = useState(null);
  
  // Use the pagination hook
  const { pagination, updatePagination } = usePagination();

  // Fetch vendors from API
  const fetchVendors = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      let url = `api/v1/users?role=vendor&page=${page}&limit=${pagination.perPage}&search=${search}&fields=firstName,lastName,email,status,id,businessName,businessLogo,createdAt`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }

      const res = await axios.get(url);
      
      if (res.data.status === 'success') {
        console.log('RESULT:', res.data.data);
        
        setShops(res.data.data.users.map(user => ({
          id: user.id,
          name: user.businessName,
          owner: `${user.firstName} ${user.lastName}`,
          logo: user.businessLogo,
          category: user.category?.name || 'Uncategorized',
          status: user.status,
          joinDate: user.createdAt
        })));
        
        updatePagination({
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalItems: res.data.pagination.totalItems
        });
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors(1, searchQuery, statusFilter === 'all' ? '' : statusFilter);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchVendors(page, searchQuery, statusFilter === 'all' ? '' : statusFilter);
  };

  // Update vendor status
  const updateStatus = async (vendorId, newStatus) => {
    setStatusUpdating(vendorId);
    setStatusError(null);
    
    try {
      const res = await axios.patch(`api/v1/users/${vendorId}/status`, { 
        status: newStatus 
      });
      
      if (res.data.status === 'success') {
        toast.success(`Status updated successfully`);
        // Update local state immediately for better UX
        setShops(prevShops => 
          prevShops.map(shop => 
            shop.id === vendorId 
              ? { ...shop, status: newStatus } 
              : shop
          )
        );
      } else {
        toast.warning(res.data.message || 'Status updated with warning');
      }
    } catch (error) {
      const errorData = error.response?.data;
      
      if (errorData?.status === 'fail') {
        if (errorData.errors?.status) {
          setStatusError(`Invalid status: ${errorData.errors.status}`);
        } else if (errorData.errors?.message) {
          setStatusError(errorData.errors.message);
        } else {
          setStatusError(errorData.message || 'Failed to update status');
        }
        
        toast.error(errorData.message || 'Failed to update status');
      } else {
        setStatusError('Failed to update status. Please try again.');
        toast.error('Failed to update status. Please try again.');
      }
    } finally {
      setStatusUpdating(null);
      setActiveDropdown(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchVendors();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'deactivated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusActions = (currentStatus) => {
    const allActions = {
      active: [
        { label: 'Mark as Pending', value: 'pending' },
        { label: 'Deactivate Shop', value: 'deactivate' }
      ],
      pending: [
        { label: 'Approve (Active)', value: 'approve' },
        { label: 'Deny Application', value: 'deny' }
      ],
      denied: [
        { label: 'Approve (Active)', value: 'approve' },
        { label: 'Mark as Pending', value: 'pending' }
      ],
      deactivated: [
        { label: 'Reactivate Shop', value: 'approve' }
      ]
    };

    return allActions[currentStatus] || [];
  };

  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "denied", label: "Denied" },
    { value: "deactivated", label: "Deactivated" }
  ];

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    fetchVendors(1, searchQuery, status === 'all' ? '' : status);
  };

  const toggleDropdown = (shopId) => {
    setActiveDropdown(activeDropdown === shopId ? null : shopId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="">
      {/* Header and Search */}
      <div className="">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shop Manager</h1>

        <DataTableFilters
          searchTerm={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearchSubmit={handleSearch}
          filters={[
            {
              type: 'select',
              value: statusFilter,
              onChange: (e) => handleStatusChange(e.target.value),
              options: statusFilterOptions
            }
          ]}
          totalItems={pagination.totalItems}
          searchPlaceholder="Search vendors..."
        />
      </div>

      {/* Status error message */}
      {statusError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {statusError}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
        </div>
      )}

      {/* Table with data */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shops.length > 0 ? (
                  shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {shop.logo ? (
                              <img 
                                src={shop.logo} 
                                alt={shop.owner} 
                                className="h-full w-full rounded-full object-cover" 
                              />
                            ) : (
                              <FiShoppingBag className="text-blue-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <Link 
                              to={`/manage/admin/vendors/${shop.id}`} 
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {shop.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          shop.category === "Fashion" ? "bg-purple-100 text-purple-800" :
                          shop.category === "Food" ? "bg-green-100 text-green-800" :
                          shop.category === "Electronics" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {shop.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shop.status)}`}>
                          {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(shop.joinDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button 
                          onClick={() => toggleDropdown(shop.id)}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={statusUpdating === shop.id}
                        >
                          {statusUpdating === shop.id ? (
                            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <FaEllipsisV />
                          )}
                        </button>
                        
                        {activeDropdown === shop.id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                          >
                            <div className="py-1">
                              {getStatusActions(shop.status).map((action) => (
                                <button
                                  key={action.value}
                                  onClick={() => updateStatus(shop.id, action.value)}
                                  disabled={statusUpdating === shop.id}
                                  className={`block px-4 py-2 text-sm w-full text-left ${
                                    statusUpdating === shop.id 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {statusUpdating === shop.id ? (
                                    <span className="flex items-center">
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Processing...
                                    </span>
                                  ) : (
                                    action.label
                                  )}
                                </button>
                              ))}
                              <div className="border-t border-gray-100 my-1"></div>
                              <Link
                                to={`/manage/admin/vendors/${shop.id}`}
                                className="block py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No shops found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {shops.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              perPage={pagination.perPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ShopManager;