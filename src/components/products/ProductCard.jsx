import { useState, useEffect } from 'react';
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const ProductCard = ({ product, selectedProduct, cart, onAddToCart }) => {
    const [isLiked, setIsLiked] = useState(false);   
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [likesCount, setLikesCount] = useState(product.likesCount || 0);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!user) return;
            
            try {
                const res = await axios.get(`api/v1/products/${product.id}/likes/like-status`);
                if (res.data.status === 'success') {
                    setIsLiked(res.data.data.liked);
                    setLikesCount(res.data.data.likesCount);
                }
            } catch (error) {
                console.log("Error fetching like status:", error);
            }
        };

        fetchLikeStatus();
    }, [product.id, user]);

    const handleLikeToggle = async () => {
        if (!user) {
            toast.info('Please login to like products');
            return;
        }

        setIsLikeLoading(true);
        try {
            // Optimistically update UI
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

            // Make API call
            const res = await axios.post(`api/v1/products/${product.id}/likes/toggle`);
            
            // Verify response
            if (res.data.status === 'success') {
                // Show success toast
                toast.success(
                    newLikedState 
                        ? 'Item added to wishlist successfully' 
                        : 'Item removed from wishlist successfully',
                    { position: "top-right" }
                );
                
                // Only update if there's a mismatch (should be rare)
                if (res.data.data.liked !== newLikedState) {
                    setIsLiked(res.data.data.liked);
                    setLikesCount(res.data.data.likesCount);
                }
            }
        } catch (error) {
            // Revert on error
            setIsLiked(prev => !prev);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
            
            console.log("Error toggling like:", error);
            toast.error(error.response?.data?.message || 'Failed to toggle like', { position: "top-right" });
        } finally {
            setIsLikeLoading(false);
        }
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

    const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);
    const displayPrice = parseFloat(product.discountPrice > 0 ? product.discountPrice : product.price);
    const stockPercentage = Math.min((product.stockQuantity / 20) * 100, 100);
    const stockLevelClass = getStockLevelClass(product.stockQuantity);
    const stockMessage = getStockMessage(product.stockQuantity);

    return (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* Product Image */}
            <div className="relative h-[120px] sm:h-[150px] md:h-[180px] lg:h-[200px] xl:h-[220px]">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.coverImage || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="absolute h-full w-full object-cover"
                    />
                </Link>
                {discountPercentage > 0 && (
                    <div className="absolute top-0 right-0 bg-[#3567A6] text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-2 rounded-bl-lg">
                        {discountPercentage}% OFF
                    </div>
                )}
                <button 
                    onClick={handleLikeToggle}
                    disabled={isLikeLoading}
                    className={`absolute bottom-2 right-2 p-1.5 sm:p-2 rounded-full shadow-md transition-colors duration-200 ${
                        isLiked 
                            ? 'bg-primary-light text-white hover:bg-primary-dark' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                    } ${isLikeLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLikeLoading ? (
                        <FaSpinner className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                        <FiHeart className={`h-3 w-3 sm:h-4 sm:w-4 ${isLiked ? 'fill-current' : ''}`} />
                    )}
                </button>
            </div>

            {/* Product Info */}
            <div className="p-2 sm:p-3 flex-grow flex flex-col">
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2 truncate">
                        {product.category?.name || 'Uncategorized'}
                    </p>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-1 sm:mb-2">
                    <div className="flex mr-1">
                        {renderRatingStars(product.ratingsAverage || 0).map((star, i) => (
                            <span key={i} className="text-[10px] sm:text-xs">{star}</span>
                        ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                        ({product.ratingsQuantity || 0})
                    </span>
                </div>

                {/* Stock Indicator */}
                <div className="mb-2 sm:mb-3">
                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">
                        <span>{stockMessage}</span>
                        <span>{product.stockQuantity || 0} avail.</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                            className={`h-1.5 sm:h-2 rounded-full ${stockLevelClass}`}
                            style={{ width: `${stockPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-primary-light">
                            ₦{displayPrice.toLocaleString()}
                        </span>
                        {discountPercentage > 0 && (
                            <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                                ₦{parseFloat(product.price).toLocaleString()}
                            </span>
                        )}
                    </div>
                    <button 
                        className="bg-primary-light cursor-pointer hover:bg-primary-dark text-white p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={product.stockQuantity <= 0}
                        onClick={() => onAddToCart(product)}
                    >
                        {cart.loading && selectedProduct?.id === product.id ? (
                            <FaSpinner className="h-3 w-3 sm:h-3 sm:w-3 animate-spin" />
                        ) : (
                            <FiShoppingCart className="h-3 w-3 sm:h-3 sm:w-3" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;