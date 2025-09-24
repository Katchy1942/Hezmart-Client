import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMail, FiPhone, FiMapPin, FiUser, FiFileText, FiCalendar, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          ninNumber: userData.ninNumber,
          phoneNumber2: userData.phoneNumber2,
          totalProducts: userData.totalProducts || 0,
          totalOrders: userData.totalOrders || 0
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

  // Delete vendor function
  const deleteVendor = async () => {
    setDeleting(true);
    try {
      const res = await axios.delete(`api/v1/users/${id}`);

      if (res.status === 204) {
        toast.success('Vendor deleted successfully');
        navigate('/manage/admin/vendors');
      } else {
        toast.warning(res.data.message || 'Vendor deleted with warning');
      }
    } catch (error) {
      const errorData = error.response?.data;
      
      // Handle foreign key constraint error
      if (errorData?.errno === 1451 || errorData?.code === 'ER_ROW_IS_REFERENCED_2') {
        toast.error('Cannot delete vendor with existing products or orders. Please deactivate instead.');
      } else {
        const message = errorData?.message || 'Failed to delete vendor';
        toast.error(message);
      }
      console.error('Error deleting vendor:', error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    if (vendor.totalProducts > 0 || vendor.totalOrders > 0) {
      const proceed = window.confirm(
        `⚠️ WARNING: This vendor has ${vendor.totalProducts} product(s) and ${vendor.totalOrders} order(s).\n\nDELETING WILL PERMANENTLY REMOVE:\n• All vendor data\n• All associated products\n• All order history\n\nAre you absolutely sure you want to proceed?`
      );
      if (proceed) {
        setShowDeleteConfirm(true);
      }
    } else {
      setShowDeleteConfirm(true);
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Vendor Details</h1>
          <button
            onClick={handleDeleteClick}
            disabled={deleting}
            className="cursor-pointer flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {deleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="mr-2" />
                Delete Vendor
              </>
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Confirm Deletion</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to permanently delete <strong>{vendor.businessName}</strong>? 
              This action cannot be undone and will remove all vendor data.
            </p>
            
            {vendor.totalProducts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ This vendor has {vendor.totalProducts} product(s) that will also be deleted.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="cursor-pointer px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteVendor}
                disabled={deleting}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Permanently'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>{vendor.totalProducts || 0} Products</span>
                <span>{vendor.totalOrders || 0} Orders</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default VendorDetails;