import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../lib/axios";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/common/Pagination";
import ProductCard from "../components/products/ProductCard";
import { FaSpinner, FaStore } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../components/contexts/CartContext";
import Breadcrumbs from "../components/common/Breadcrumbs";

const VendorProductsPage = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVendor, setLoadingVendor] = useState(true);
  const { pagination, updatePagination } = usePagination();
  const { addToCart, cart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch vendor details
  const fetchVendor = async () => {
    setLoadingVendor(true);
    try {
      const res = await axios.get(`api/v1/users/?id=${vendorId}?fields=id,businessName,businessLogo,description`);
      if (res.data.status === "success") {   
        setVendor(res.data.data.users[0]);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
      toast.error("Failed to load vendor information");
    } finally {
      setLoadingVendor(false);
    }
  };

  // Fetch vendor products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/v1/products?status=active&userId=${vendorId}&page=${page}&limit=12`
      );
      
      if (res.data.status === "success") {
        setProducts(res.data.data.products);
        updatePagination({
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalItems: res.data.pagination.totalItems,
          perPage: res.data.pagination.perPage
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load vendor products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!product) return;
    setSelectedProduct(product);
    const result = await addToCart(product, 1, {});
    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.error?.message || 'Failed to add to cart');
    }
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  useEffect(() => {
    fetchVendor();
    fetchProducts();
  }, [vendorId]);

  if (loadingVendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <FaStore className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Vendor not found</h3>
        <p className="text-gray-500 mb-4">The vendor you're looking for doesn't exist</p>
        <Link 
          to="/shops" 
          className="text-primary-light hover:text-primary-dark font-medium"
        >
          Browse all vendors →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Shops', href: '/shops' },
          { name: vendor.businessName, href: '#' },
        ]}
      />

      {/* Vendor Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {vendor.businessLogo ? (
            <img
              src={vendor.businessLogo}
              alt={vendor.businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaStore className="text-4xl text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.businessName}</h1>
          {vendor.description && (
            <p className="text-gray-600 max-w-3xl">{vendor.description}</p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Products by {vendor.businessName}
        </h2>

        {loading && !products.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedProduct={selectedProduct}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <FiShoppingCart className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No products available
                </h3>
                <p className="text-gray-500">
                  This vendor hasn't added any products yet
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
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

export default VendorProductsPage;