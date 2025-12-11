import { useEffect, useState, useRef } from "react";
import axios from "../../lib/axios";
import Pagination from "../common/Pagination";
import ProductCard from "./ProductCard";
import FlashProductCard from "./FlashProductCard";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import usePagination from "../../hooks/usePagination";
import ProductSkeletonLoader from "../common/ProductSkeletonLoader";
import EmptyState from "../common/EmptyState";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const ProductsGrid = ({ 
    initialProducts = [], 
    fetchUrl = 'api/v1/products?status=active',
    itemsPerPage = 20,
    showPagination = true,
    enableHorizontalScroll = false,
    from,
    variant = 'standard'
}) => {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(!initialProducts.length);
    const { pagination, updatePagination } = usePagination();
    const { addToCart, cart } = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const scrollContainerRef = useRef(null);

    const CardComponent = variant === 'flash' ? FlashProductCard : ProductCard;

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            let res;
            if (from === "ProductDetails") {
                res = await axios.get(`${fetchUrl}&limit=${8}`);
            } else if (from === "HotRightNow") {
                res = await axios.get(`${fetchUrl}&sort=-viewsCount,-likesCount,-createdAt&limit=12`);
            } else if (from === "RecentlyViewed") {
                res = await axios.get(fetchUrl);
            } else {
                res = await axios.get(`${fetchUrl}&page=${page}&limit=${itemsPerPage}`);
            }

            if (res.data.status === "success") {
                setProducts(res.data.data.products);

                if (res.data.pagination) {
                    updatePagination({
                        currentPage: res.data.pagination.currentPage,
                        totalPages: res.data.pagination.totalPages,
                        totalItems: res.data.pagination.totalItems,
                        perPage: res.data.pagination.perPage
                    });
                } else {
                    updatePagination(null); // or set defaults
                }
            }

        } catch (error) {
            console.error("Error fetching products:", error);
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

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
           
            const scrollAmount = 260; 
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        if (!initialProducts.length) {
            fetchProducts();
        }
    }, [fetchUrl]);

    if (loading && !products.length) {
        return (
            <div>
                <ProductSkeletonLoader count={8} variant={variant} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-8 pt-4 relative group">
            
            {enableHorizontalScroll && products.length > 0 && (
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-[40%] -translate-y-1/2 z-20 bg-white/90 hover:bg-white 
                    shadow-lg border border-gray-200 rounded-full p-3 text-gray-800 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
                    aria-label="Scroll left"
                >
                    <FaChevronCircleLeft size={20} />
                </button>
            )}

            {/* PRODUCT CONTAINER */}
            <div 
                ref={scrollContainerRef}
                className={
                    enableHorizontalScroll
                    ? "flex overflow-x-auto gap-4 pb-4 scroll-smooth px-2 scrollbar-hide snap-x snap-mandatory"
                    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 mb-8"
                }
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div 
                        key={product.id} 
                        className={
                            enableHorizontalScroll 
                            ? "w-[160px] xs:w-[190px] md:w-[240px] flex-shrink-0 snap-start" 
                            : ""
                        }
                    >
                        <CardComponent 
                            product={product}
                            selectedProduct={selectedProduct}
                            cart={cart}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                ))}
            </div>

            {enableHorizontalScroll && products.length > 0 && (
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-[40%] -translate-y-1/2 z-20 bg-white/90 
                    hover:bg-white shadow-lg border border-gray-200 rounded-full p-3 
                    text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
                    aria-label="Scroll right"
                >
                    <FaChevronCircleRight size={20} />
                </button>
            )}

            {/* Empty State */}
            {products.length === 0 && !loading && (
                <EmptyState />
            )}

            {(products.length > 0 && showPagination && !enableHorizontalScroll) && (
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
