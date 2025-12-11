import { useState, useEffect } from 'react';
import { FiHeart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [likesCount, setLikesCount] = useState(product.likesCount || 0);
    
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!userId) return;
            
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
    }, [product.id, userId]);

    const handleLikeToggle = async (e) => {
        e.preventDefault(); 
        if (!userId) {
            toast.info('Please login to like products');
            return;
        }

        if (isLikeLoading) return;
        setIsLikeLoading(true);

        const previousLikedState = isLiked;
        const previousCount = likesCount;

        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

        try {
            const res = await axios.post(`api/v1/products/${product.id}/likes/toggle`);
            
            if (res.data.status === 'success') {
                const serverLiked = res.data.data.liked;
                const serverCount = res.data.data.likesCount;

                toast.success(
                    serverLiked ? 'Item added to wishlist' : 'Item removed from wishlist',
                    { position: "top-right", autoClose: 2000 }
                );
                
                if (serverLiked !== newLikedState || serverCount !== (newLikedState ? previousCount + 1 : previousCount - 1)) {
                    setIsLiked(serverLiked);
                    setLikesCount(serverCount);
                }
            }
        } catch (error) {
            setIsLiked(previousLikedState);
            setLikesCount(previousCount);
            toast.error(error.response?.data?.message || 'Failed to toggle like');
        } finally {
            setIsLikeLoading(false);
        }
    };

    const calculateDiscountPercentage = (price, discountPrice) => {
        if (!discountPrice || parseFloat(discountPrice) <= 0 || parseFloat(discountPrice) >= parseFloat(price)) return 0;
        return Math.round((1 - parseFloat(discountPrice) / parseFloat(price)) * 100);
    };

    const discountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);
    const displayPrice = parseFloat(product.discountPrice > 0 ? product.discountPrice : product.price);
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
    const isOutOfStock = product.stockQuantity <= 0;

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-2xl 
        border border-gray-100 shadow-sm overflow-hidden transition-all duration-300
        hover:shadow-md">
            <Link 
                to={`/product/${product.id}`} 
                className="relative block aspect-square w-full overflow-hidden bg-gray-50"
            >
                <img
                    src={product.coverImage || '/placeholder-product.jpg'}
                    alt={product.name}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform 
                        duration-700 ease-in-out hover:scale-110 
                        ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                />
                
                {discountPercentage > 0 && !isOutOfStock && (
                    <div className="absolute top-3 left-3 bg-white/90 
                    backdrop-blur-sm text-red-600 
                    text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        -{discountPercentage}%
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                        <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                            Sold Out
                        </span>
                    </div>
                )}

                <button 
                    onClick={handleLikeToggle}
                    disabled={isLikeLoading}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md 
                    text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-200 
                    shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 
                    translate-y-[-10px] group-hover:translate-y-0"
                >
                    <FiHeart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-transparent'}`} />
                </button>
            </Link>

            <div className="flex flex-col flex-grow p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1 truncate">
                            {product.category?.name || 'Collection'}
                        </p>
                        <Link to={`/product/${product.id}`}>
                            <h3 className="text-sm font-semibold text-gray-900 leading-tight
                            line-clamp-2 hover:text-primary-light transition-colors">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                    {/* {product.ratingsAverage > 0 && (
                        <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md">
                            <FiStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-700">
                                {product.ratingsAverage.toFixed(1)}
                            </span>
                        </div>
                    )} */}
                </div>

                <div className="mt-auto pt-3 flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">
                                ₦{displayPrice.toLocaleString()}
                            </span>
                            {discountPercentage > 0 && (
                                <span className="text-xs text-gray-400 line-through decoration-gray-400">
                                    ₦{parseFloat(product.price).toLocaleString()}
                                </span>
                            )}
                        </div>
                        {isLowStock && (
                            <p className="text-[10px] font-medium text-amber-600 mt-1">
                                Only {product.stockQuantity} left
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;