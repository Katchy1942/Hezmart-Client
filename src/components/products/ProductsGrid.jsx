import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import Pagination from "../common/Pagination";
import ProductCard from "./ProductCard";
import { FaSpinner } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import usePagination from "../../hooks/usePagination";
import { FiShoppingCart } from "react-icons/fi";

const ProductsGrid = ({ 
    initialProducts = [], 
    fetchUrl = 'api/v1/products?status=active',
    itemsPerPage = 12,
    showHeader = true,
    headerTitle = "Featured Products",
    headerSubtitle = "Discover our latest collection"
}) => {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(!initialProducts.length);
    const { pagination, updatePagination } = usePagination();
    const { addToCart, cart } = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`${fetchUrl}&page=${page}&limit=${itemsPerPage}`);
            
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
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        fetchProducts(page);
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

    useEffect(() => {
        if (!initialProducts.length) {
            fetchProducts();
        }
    }, [fetchUrl]);

    if (loading && !products.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-8 pt-4">
            {/* Page Header */}
            {showHeader && (
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{headerTitle}</h1>
                    <p className="text-gray-600">{headerSubtitle}</p>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                    <p className="text-gray-500">Check back later for new arrivals</p>
                </div>
            )}

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

export default ProductsGrid;