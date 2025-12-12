import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiTrash2,
    FiClock
} from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import { useCart } from '../../components/contexts/CartContext';
import { FaSpinner } from "react-icons/fa";
import ProductSkeletonLoader from '../../components/common/ProductSkeletonLoader';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
            }
            return "Expired";
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return <span>{timeLeft}</span>;
};

const WishListPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingItemId, setRemovingItemId] = useState(null);
    const [addingToCartId, setAddingToCartId] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get('api/v1/users/likes/my-likes');
                if (response.data.status === 'success') {
                    const likes = response.data.data.likes.map((item) => {
                        return item.product ? item.product : item; 
                    });
                    setWishlist(likes);
                }
            } catch (error) {
                console.error('Failed to fetch wishlist', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const handleRemoveItem = async (productId) => {
        try {
            setRemovingItemId(productId);
            const res = await axios.delete(`api/v1/products/${productId}/likes`);
            if (res.status === 204) {
                setWishlist((prev) => prev.filter((item) => item.id !== productId));
                toast.success('Item removed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove item');
        } finally {
            setRemovingItemId(null);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            setAddingToCartId(product.id);
            const result = await addToCart(product, 1, {});
            if (result.success) {
                toast.success(`${product.name} added to bag!`);
            } else {
                toast.error(result.error?.message || 'Failed to add to cart');
            }
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setAddingToCartId(null);
        }
    };

    if (loading) {
        return <div className='min-h-screen py-8'>
            <h1 className="text-2xl font-semibold font-['poppins'] text-gray-900 mb-6">My Wishlist</h1>
            <ProductSkeletonLoader count={8} />
        </div>;
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 font-['poppins']">My Wishlist</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {wishlist.length} {wishlist.length === 1 ? ' item' : ' items'} saved
                            </p>
                        </div>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 text-sm max-w-sm mb-8">
                            Looks like you haven't saved any items yet. Start browsing to find your new favorites.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center px-8 py-3 rounded-full shadow-md 
                            text-sm font-medium text-white bg-primary-light"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((product) => {
                            const isFlashSale = product.isFlashSale;
                            const activePrice = product.currentPrice || product.discountPrice || product.price;
                            const oldPrice = product.originalPrice || product.price;
                            
                            const discount = oldPrice > activePrice 
                                ? Math.round((1 - activePrice / oldPrice) * 100) 
                                : 0;

                            return (
                                <div 
                                    key={product.id} 
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm 
                                    hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col relative"
                                >
                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveItem(product.id);
                                        }}
                                        disabled={removingItemId === product.id}
                                        className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center 
                                        rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 
                                        hover:bg-red-50 shadow-sm transition-all border border-transparent hover:border-red-100"
                                        title="Remove from wishlist"
                                    >
                                        {removingItemId === product.id ? (
                                            <FaSpinner className="h-4 w-4 animate-spin text-red-500" />
                                        ) : (
                                            <FiTrash2 className="h-4 w-4" />
                                        )}
                                    </button>

                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                                        <img
                                            src={product.coverImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 
                                            transition-transform duration-500"
                                        />
                                        
                                        {/* Badge: Flash Sale or Regular Discount */}
                                        {discount > 0 && (
                                            <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 
                                            py-1 rounded-full shadow-sm ${isFlashSale ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`}>
                                                {isFlashSale ? '⚡ ' : ''}-{discount}%
                                            </div>
                                        )}

                                        {/* Out of Stock Overlay */}
                                        {product.stockQuantity <= 0 && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Flash Sale Timer Strip */}
                                    {isFlashSale && product.flashSaleEndTime && (
                                        <div className="bg-red-50 w-full py-1.5 px-3 flex items-center 
                                        justify-center gap-2 border-y border-red-100">
                                            <FiClock className="text-red-600 w-3.5 h-3.5" />
                                            <span className="text-red-600 text-xs font-bold tracking-wide">
                                                <CountdownTimer targetDate={product.flashSaleEndTime} />
                                            </span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <Link to={`/products/${product.slug || '#'}`} className="block">
                                            <h3 className="text-gray-900 font-medium line-clamp-1 
                                            group-hover:text-primary-light transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="mt-2 flex flex-col">
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-lg font-bold ${isFlashSale ? 'text-red-600' : 'text-gray-900'}`}>
                                                    ₦{parseFloat(activePrice).toLocaleString()}
                                                </span>
                                                {discount > 0 && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₦{parseFloat(oldPrice).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Low Stock Warning */}
                                            {product.stockQuantity > 0 && product.stockQuantity < 5 && (
                                                <span className="text-[10px] text-red-500 font-medium mt-1">
                                                    Only {product.stockQuantity} items left!
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stockQuantity <= 0 || addingToCartId === product.id}
                                                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent 
                                                rounded-full shadow-sm text-sm font-semibold text-white bg-primary-light 
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light 
                                                disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                                            >
                                                {addingToCartId === product.id ? (
                                                    <>
                                                        <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                                                        Adding...
                                                    </>
                                                ) : (
                                                    <>Add to Cart</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishListPage;