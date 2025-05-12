import { useEffect, useState } from "react";
import axios from "../lib/axios";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/common/Pagination";
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../components/contexts/CartContext";
import { FaSpinner } from "react-icons/fa";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Hero";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { pagination, updatePagination } = usePagination();
    const { addToCart, cart } = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`api/v1/products?status=active&page=${page}&limit=12`);
            
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

    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FiStar key={i} className="text-primary-light fill-current" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FiStar key={i} className="text-primary-light fill-current opacity-50" />);
            } else {
                stars.push(<FiStar key={i} className="text-gray-300" />);
            }
        }
        return stars;
    };

    const calculateDiscountPercentage = (price, discountPrice) => {
        if (!discountPrice || parseFloat(discountPrice) <= 0 || parseFloat(discountPrice) >= parseFloat(price)) return 0;
        return Math.round((1 - parseFloat(discountPrice) / parseFloat(price)) * 100);
    };

    const getStockLevelClass = (stockQuantity) => {
        if (stockQuantity <= 0) return 'bg-red-500';
        if (stockQuantity <= 5) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStockMessage = (stockQuantity) => {
        if (stockQuantity <= 0) return 'Out of stock';
        if (stockQuantity <= 5) return `Only ${stockQuantity} left!`;
        return 'In stock';
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
            <div className="flex gap-x-4 mb-14">
                <Navbar />
                <Hero />
            </div>
            
            {/* Page Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h1>
                <p className="text-gray-600">Discover our latest collection</p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {products.map((product) => {
                    const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);
                    const displayPrice = parseFloat(product.discountPrice > 0 ? product.discountPrice : product.price);
                    const stockPercentage = Math.min((product.stockQuantity / 20) * 100, 100);
                    const stockLevelClass = getStockLevelClass(product.stockQuantity);
                    const stockMessage = getStockMessage(product.stockQuantity);
                    
                    return (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            {/* Product Image */}
                            <div className="relative pb-[100%] bg-gray-100">
                                <Link to={`/product/${product.id}`}>
                                    <img
                                        src={product.coverImage}
                                        alt={product.name}
                                        className="absolute h-full w-full object-cover"
                                    />
                                </Link>
                                {discountPercentage > 0 && (
                                    <div className="absolute top-0 right-0 bg-[#3567A6] text-white text-xs font-bold p-3 rounded-bl-2xl ">
                                        {discountPercentage}% <br /> OFF
                                    </div>
                                )}
                                <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                                    <FiHeart className="text-gray-600" />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex-grow flex flex-col">
                                <Link to={`/product/${product.id}`} className="block">
                                    <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
                                </Link>

                                {/* Rating */}
                                <div className="flex items-center mb-2">
                                    <div className="flex mr-1">
                                        {renderRatingStars(product.ratingsAverage)}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        ({product.ratingsQuantity})
                                    </span>
                                </div>

                                {/* Stock Indicator */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>{stockMessage}</span>
                                        <span>{product.stockQuantity} available</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${stockLevelClass}`}
                                            style={{ width: `${stockPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Price and Add to Cart */}
                                <div className="mt-auto flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-bold text-primary-light">
                                            ₦{displayPrice.toLocaleString()}
                                        </span>
                                        {discountPercentage > 0 && (
                                            <span className="ml-2 text-sm text-gray-500 line-through">
                                                ₦{parseFloat(product.price).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <button 
                                        className="bg-primary-light cursor-pointer hover:bg-primary-dark text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={product.stockQuantity <= 0}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        {cart.loading && selectedProduct?.id === product.id ? (
                                            <FaSpinner className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <FiShoppingCart className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
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

export default Home;