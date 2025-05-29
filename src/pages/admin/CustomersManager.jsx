import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import Pagination from '../../components/common/Pagination';
import usePagination from '../../hooks/usePagination';
import DataTableFilters from '../../components/common/DataTableFilters';

const CustomersManager = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const { pagination, updatePagination } = usePagination();

  const fetchVendors = async (page = 1, search = '', status = '') => {
    setLoading(true);
    try {
      let url = `api/v1/users?role=customer&page=${page}&limit=${pagination.perPage}&search=${search}&fields=firstName,lastName,email,photo,status,id,primaryAddress,primaryPhone,businessName,businessLogo`;
      if (status && status !== 'all') url += `&status=${status}`;

      const res = await axios.get(url);
      if (res.data.status === 'success') {
        setCustomers(res.data.data.users.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          photo: user.photo,
          email: user.email,
          mobile: user.primaryPhone,
          address: user.primaryAddress,
          status: user.status
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors(1, searchQuery, activeTab === 'all' ? '' : activeTab);
  };

  const handlePageChange = (page) => {
    fetchVendors(page, searchQuery, activeTab === 'all' ? '' : activeTab);
  };

  const updateStatus = async (vendorId, newStatusKeyword) => {
    const statusMap = {
      approve: 'active',
      deactivate: 'deactivated',
      deny: 'denied',
      pending: 'pending'
    };

    const newStatus = statusMap[newStatusKeyword] || newStatusKeyword;

    setStatusUpdating(vendorId);
    setStatusError(null);

    try {
      const res = await axios.patch(`api/v1/users/${vendorId}/status`, {
        status: newStatus
      });

      if (res.data.status === 'success') {
        toast.success(`Status updated to "${newStatus}"`);
        setCustomers(prev => prev.map(shop =>
          shop.id === vendorId ? { ...shop, status: newStatus } : shop
        ));
      } else {
        toast.warning(res.data.message || 'Status updated with warning');
      }
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.message || 'Failed to update status';
      setStatusError(message);
      toast.error(message);
    } finally {
      setStatusUpdating(null);
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    const actions = {
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

    return actions[currentStatus] || [];
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customers Manager</h1>

      <DataTableFilters
        searchTerm={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSearchSubmit={handleSearch}
        filters={[{
          type: 'select',
          value: statusFilter,
          onChange: (e) => handleStatusChange(e.target.value),
          options: statusFilterOptions
        }]}
        totalItems={pagination.totalItems}
        searchPlaceholder="Search customers..."
      />

      {statusError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">{statusError}</div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Mobile', 'Status', 'Address', 'Actions'].map((header, idx) => (
                    <th key={idx} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header === 'Actions' ? 'text-right' : ''}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length > 0 ? (
                  customers.map((customer) => {
                    const actions = getStatusActions(customer.status);
                    return (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {customer.photo ? (
                                <img src={customer.photo} alt={customer.name} className="h-full w-full rounded-full object-cover" />
                              ) : (
                                <FiShoppingBag className="text-blue-600" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{customer.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{customer.mobile}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{customer.address}</td>
                        <td className="px-6 py-4 text-right relative" ref={dropdownRef}>
                          {actions.length > 0 && (
                            <div className="inline-block text-left">
                              <button
                                onClick={() => toggleDropdown(customer.id)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                              >
                                <FaEllipsisV />
                              </button>

                              {activeDropdown === customer.id && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                  <div className="py-1">
                                    {actions.map((action) => (
                                      <button
                                        key={action.value}
                                        onClick={() => updateStatus(customer.id, action.value)}
                                        disabled={statusUpdating === customer.id}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        {action.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              perPage={pagination.perPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManager;
