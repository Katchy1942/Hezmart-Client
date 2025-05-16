import { useEffect, useState } from "react";
import axios from "../lib/axios";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/common/Pagination";
import { FaSpinner, FaStore } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import SearchBar from "../components/common/SearchBar";


const Shops = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { pagination, updatePagination } = usePagination({
    perPage: 12 // Default number of vendors per page
  });

  const fetchVendors = async (page = 1, search = '') => {
    setLoading(true);
    try {
      let url = `api/v1/users?status=active&role=vendor&page=${page}&limit=${pagination.perPage}&search=${search}&fields=id,businessName,businessLogo`;
      
      const res = await axios.get(url);
      
      if (res.data.status === "success") {
        setVendors(res.data.data.users);
        updatePagination({
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalItems: res.data.pagination.totalItems,
          perPage: res.data.pagination.perPage
        });
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchVendors(1, query);
  };

  const handlePageChange = (page) => {
    fetchVendors(page, searchQuery);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  if (loading && !vendors.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Vendors</h1>
        <p className="text-gray-600">Discover products from these amazing shops</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <SearchBar 
          placeholder="Search vendors..." 
          onSearch={handleSearch}
          delay={300}
        />
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
        {vendors.map((vendor) => (
          <Link 
            key={vendor.id} 
            to={`/vendor/${vendor.slug || vendor.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center h-full">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {vendor.businessLogo ? (
                  <img
                    src={vendor.businessLogo}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaStore className="text-4xl text-gray-400" />
                )}
              </div>
              <h3 className="font-medium text-gray-900 text-center group-hover:text-primary-light transition-colors">
                {vendor.businessName}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {vendors.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <FaStore className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No vendors found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try a different search' : 'Check back later for new vendors'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {vendors.length > 0 && (
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
  );
};

export default Shops;