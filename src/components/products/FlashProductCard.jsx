import { useState, useEffect } from 'react';
import { FiHeart, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from '../../lib/axios';
import { toast } from 'react-toastify';

const FlashProductCard = ({ product }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    
    const flashSale = product.flashSales?.find(sale => {
        const now = new Date();
        return new Date(sale.endTime) > now;
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(
                    `api/v1/products/${product.id}/likes/like-status`
                );
                if (res.data.status === 'success') {
                    setIsLiked(res.data.data.liked);
                }
            } catch (error) {
                console.log("Error fetching like status");
            }
        };
        fetchLikeStatus();
    }, [product.id, userId]);

    useEffect(() => {
        if (!flashSale?.endTime) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(flashSale.endTime).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [flashSale]);

    const handleLikeToggle = async (e) => {
        e.preventDefault(); 
        if (!userId) {
            toast.info('Please login to like products');
            return;
        }

        setIsLiked(!isLiked);

        try {
            const res = await axios.post(
                `api/v1/products/${product.id}/likes/toggle`
            );
            if (res.data.status === 'success') {
                setIsLiked(res.data.data.liked);
                toast.success(res.data.data.liked ? 'Saved' : 'Removed', { 
                    autoClose: 1000 
                });
            }
        } catch (error) {
            setIsLiked(!isLiked);
            toast.error('Failed to toggle like');
        }
    };

    const currentPrice = parseFloat(flashSale?.salePrice || product.price);
    const originalPrice = parseFloat(product.price);
    const discount = Math.round((1 - currentPrice / originalPrice) * 100);
    const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 5;

    return (
        <div className="group relative flex flex-col h-full bg-white 
            rounded-2xl border-2 border-red-100 overflow-hidden shadow-sm 
            hover:shadow-md transition-all duration-300">
            
            <Link to={`/product/${product.id}`} className="relative block 
                aspect-[4/5] w-full overflow-hidden bg-gray-50">
                <img
                    src={product.coverImage || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover 
                        transition-transform duration-700 hover:scale-105"
                />

                {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 
                        text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        -{discount}%
                    </div>
                )}

                <button 
                    onClick={handleLikeToggle}
                    className="absolute top-2 right-2 p-1.5 rounded-full 
                        bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 
                        transition-colors duration-200 shadow-sm"
                >
                    <FiHeart className={`h-4 w-4 ${isLiked ? 
                        'fill-red-500 text-red-500' : 'fill-transparent'}`} />
                </button>
            </Link>

            <div className="bg-red-50 px-2 mx-2 mt-1 rounded-full py-1.5 flex items-center 
                justify-center gap-1.5 text-xs font-semibold text-red-600">
                <FiClock className="w-3 h-3" />
                <span className="tracking-tight">
                    {timeLeft.d}d : {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s
                </span>
            </div>

            <div className="flex flex-col flex-grow p-3">
                <Link to={`/product/${product.id}`} className="mb-1">
                    <h3 className="text-sm font-medium text-gray-900 
                        line-clamp-1 hover:text-red-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-base font-bold text-gray-900">
                            ₦{currentPrice.toLocaleString()}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                ₦{originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {isLowStock ? (
                        <p className="text-[10px] font-semibold text-red-500">
                            Only {product.stockQuantity} items left!
                        </p>
                    ) : (
                        <div className="h-[15px]"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlashProductCard;
