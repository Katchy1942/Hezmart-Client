import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiMail, FiPhone, FiMapPin, FiUser, FiFileText, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch vendor details
  const fetchVendorDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`api/v1/users/${id}`);
      
      if (res.data.status === 'success') {
        const userData = res.data.user;
        setVendor({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          status: userData.status,
          primaryAddress: userData.primaryAddress,
          primaryPhone: userData.primaryPhone,
          businessName: userData.businessName,
          businessLogo: userData.businessLogo,
          createdAt: userData.createdAt,
          category: userData.category?.name || 'Uncategorized',
          ninNumber: userData.ninNumber, // Assuming this field exists
          phoneNumber2: userData.phoneNumber2 // Assuming this field exists
        });
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      toast.error('Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  // Update vendor status
  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await axios.patch(`api/v1/users/${id}/status`, { 
        status: newStatus 
      });
      
      if (res.data.status === 'success') {
        toast.success(`Status updated successfully`);
        setVendor(prev => ({ ...prev, status: newStatus }));
      } else {
        toast.warning(res.data.message || 'Status updated with warning');
      }
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVendorDetails();
    }
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'deactivated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Vendor not found</p>
        <Link to="/admin/shops" className="text-primary-dark hover:underline mt-2 inline-block">
          Back to Shop Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/manage/admin/vendors" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Back to Shop Manager
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Vendor Details</h1>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg mb-6 flex justify-between items-center ${getStatusColor(vendor.status)}`}>
        <div>
          <span className="font-semibold">Status: </span>
          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
        </div>
        <div className="flex space-x-2">
          {vendor.status === 'pending' && (
            <>
              <button
                onClick={() => updateStatus('approve')}
                disabled={updatingStatus}
                className="cursor-pointer px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {updatingStatus ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => updateStatus('deny')}
                disabled={updatingStatus}
                className="cursor-pointer px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {updatingStatus ? 'Processing...' : 'Deny'}
              </button>
            </>
          )}
          {vendor.status === 'active' && (
            <button
              onClick={() => updateStatus('deactivate')}
              disabled={updatingStatus}
              className="cursor-pointer px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50"
            >
              {updatingStatus ? 'Processing...' : 'Deactivate'}
            </button>
          )}
          {(vendor.status === 'denied' || vendor.status === 'deactivated') && (
            <button
              onClick={() => updateStatus('approve')}
              disabled={updatingStatus}
              className="cursor-pointer px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {updatingStatus ? 'Processing...' : 'Reactivate'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Business Information Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>
          
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              {vendor.businessLogo ? (
                <img 
                  src={vendor.businessLogo} 
                  alt={vendor.businessName} 
                  className="h-full w-full rounded-full object-cover" 
                />
              ) : (
                <FiShoppingBag className="text-blue-600 text-xl" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{vendor.businessName}</h3>
              <p className="text-sm text-gray-500">{vendor.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="flex items-center text-gray-700">
              <FiFileText className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Registration Number:</span>
              <span>{vendor.registrationNumber || 'N/A'}</span>
            </div> */}
            <div className="flex items-center text-gray-700">
              <FiCalendar className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Joined:</span>
              <span>{formatDate(vendor.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-700">
              <FiUser className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Full Name:</span>
              <span>{vendor.firstName} {vendor.lastName}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiMail className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Email:</span>
              <span>{vendor.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiPhone className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Phone Number:</span>
              <span>{vendor.primaryPhone}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiPhone className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Phone Number 2:</span>
              <span>{vendor.phoneNumber2 || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiFileText className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">NIN Number:</span>
              <span>{vendor.ninNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FiMapPin className="mr-2 text-gray-500" />
              <span className="font-medium mr-2">Address:</span>
              <span>{vendor.primaryAddress || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Additional Sections can be added here for products, orders, etc. */}
        {/* <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
          <p className="text-gray-500 italic">More vendor details and statistics can be added here.</p>
        </div> */}
      </div>
    </div>
  );
};

export default VendorDetails;