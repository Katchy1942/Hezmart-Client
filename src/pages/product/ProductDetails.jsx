import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useParams, Link } from "react-router-dom";
import { FiHeart, FiShare2, FiMinus, FiPlus, FiClock } from "react-icons/fi";
import { ReviewComponent, } from "./ReviewComponent";
import { DescriptionSpecsReviews } from "./DescriptionSpecsReviews";
import { useCart } from "../../components/contexts/CartContext.jsx";
import { toast } from 'react-toastify';
import Button from "../../components/common/Button.jsx";
import ProductsGrid from "../../components/products/ProductsGrid.jsx";
import ProductSkeletonLoader from "../../components/common/ProductSkeletonLoader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

const ProductDetails = () => {
    const { addToCart, cart } = useCart();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(null);
  
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const url = user?.role === 'admin' || user?.role === 'vendor' 
        ? `api/v1/products/${id}` 
        : `api/v1/products/${id}?status=active`;

    const fetchProductDetail = async () => {
        try {
            const res = await axios.get(url);
            if (res.data.status === 'success') {
                setProduct(res.data.data.product);
                setLikesCount(res.data.data.product.likesCount || 0);

                if (user) {
                    fetchLikeStatus();
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikeStatus = async () => {
        try {
            const res = await axios.get(`api/v1/products/${id}/likes/like-status`);
            if (res.data.status === 'success') {
                setIsLiked(res.data.data.liked);
                setLikesCount(res.data.data.likesCount);
            }
        } catch (error) {
            console.log("Error fetching like status:", error);
        }
    };

    const handleLikeToggle = async () => {
        if (!user) {
            toast.info('Please login to like products');
            return;
        }

        setIsLikeLoading(true);
        try {
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

            const res = await axios.post(`api/v1/products/${id}/likes/toggle`);
            
            if (res.data.status === 'success') {
                toast.success(
                    newLikedState 
                        ? 'Item added to wishlist successfully' 
                        : 'Item removed from wishlist successfully'
                );
                
                if (res.data.data.liked !== newLikedState) {
                    setIsLiked(res.data.data.liked);
                    setLikesCount(res.data.data.likesCount);
                }
            }
        } catch (error) {
            setIsLiked(prev => !prev);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
            
            console.log("Error toggling like:", error);
            toast.error(error.response?.data?.message || 'Failed to toggle like');
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleOptionSelect = (optionName, value) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value
        }));
    };

    const handleQuantityChange = (change) => {
        setQuantity(prev => {
            const newQuantity = prev + change;
            return newQuantity < 1 ? 1 : newQuantity > product.stockQuantity ? product.stockQuantity : newQuantity;
        });
    };

    const handleAddToCart = async () => {
        if (!product) return;

        const hasUnselectedOptions = product.options?.filter(option => option.values?.length).some(
            option => !selectedOptions[option.name]
        );

        if (hasUnselectedOptions) {
            toast.error('Please select a product option, Eg. Size');
            return;
        }
        
        const result = await addToCart(product, quantity, selectedOptions);
        if (result.success) {
            toast.success(`${product.name} added to cart!`);
        } else {
            toast.error(result.error?.message || 'Failed to add to cart');
        }
    };

    const calculateDiscountPercentage = () => {
        const discountPrice = parseFloat(product.discountPrice);
        const actualPrice = parseFloat(product.price);
        
        if (!discountPrice || discountPrice >= actualPrice) return 0;
        
        return Math.round((1 - discountPrice / actualPrice) * 100);
    };

    const getDisplayPrice = () => {
        if (product.isOnFlashSale) {
            return parseFloat(product.displayPrice);
        }
        return parseFloat(product.discountPrice || product.price);
    };

    const calculateTimeRemaining = () => {
        if (!product?.isOnFlashSale || !product?.flashSaleDetails?.endTime) {
            return null;
        }

        const now = new Date().getTime();
        const end = new Date(product.flashSaleDetails.endTime).getTime();
        const diff = end - now;

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title:'Check this out!',
                text:'I found a great product for you.',
                url: window.location.href,
            })
            .then(() => console.log('Shared successfully'))
            .catch(err => console.log('Error Sharing', err));
        } else {
            const shareUrl = `https://twitter.com/intent/
            tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl, '_blank');
        }
    }

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    useEffect(() => {
        if (product?.isOnFlashSale) {
            const timer = setInterval(() => {
                setTimeRemaining(calculateTimeRemaining());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [product]);

    if (loading) {
        return (
            <div>
                <ProductSkeletonLoader from="ProductDetails" />
            </div>
        );
    }

    if (!product) {
        return (
            <EmptyState />
        );
    }

    const discountPercentage = product.isOnFlashSale 
        ? Math.round((1 - parseFloat(product.displayPrice) / parseFloat(product.price)) * 100)
        : calculateDiscountPercentage();
    
    const displayPrice = getDisplayPrice();

    const reviewsSection = (
        <ReviewComponent
            product={product}
            user={user}
        />
    );

    const allImages = [
        product.coverImage,
        ...(product.images || [])
    ].filter(Boolean);

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12 max-w-7xl mx-auto sm:px-4">

                {/* Image */}
                <div className="flex flex-col gap-4">
                    <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden relative">
                        <img
                            src={allImages[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {allImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-20 h-20 rounded-full overflow-hidden border transition ${
                                    selectedImage === index
                                        ? "border-2 border-black"
                                        : "border-gray-200 opacity-70 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name}-${index}`}
                                    className="w-full h-full object-contain bg-gray-50"
                                />
                            </button>
                        ))}
                    </div>
                </div>


                {/* Info */}
                <div className="flex flex-col gap-8">

                    <div className="flex flex-col gap-1">

                        <h1 className="text-3xl lg:text-4xl font-bold font-['poppins'] leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase">
                            <span>{product.category?.name}</span>
                            <span>→</span>
                            <span>{product.subCategory?.name}</span>
                        </div>

                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">
                            ₦{displayPrice.toLocaleString("en-US")}
                        </span>

                        {discountPercentage > 0 && (
                            <>
                                <span className="line-through text-gray-400">
                                    ₦{parseFloat(product.price).toLocaleString("en-US")}
                                </span>

                                <span className={`text-xs px-3 py-1 rounded-full border ${
                                    product.isOnFlashSale 
                                        ? 'text-red-600 border-red-600 bg-red-50' 
                                        : 'text-red-600'
                                }`}>
                                    {discountPercentage}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {product.options
                        ?.filter(option => option.values?.length)
                        .map(option => (
                            <div key={option.id}>
                                <p className="text-lg font-semibold mb-2">
                                    {option.name}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {option.values.map(value => (
                                        <button
                                            key={value.id}
                                            onClick={() =>
                                                handleOptionSelect(option.name, value.value)
                                            }
                                            className={`px-4 py-1 rounded-full text-sm border transition ${
                                                selectedOptions[option.name] === value.value
                                                    ? "border-black"
                                                    : "border-gray-300 hover:border-gray-500"
                                            }`}
                                        >
                                            {value.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    }

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center border rounded-full overflow-hidden w-fit">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="w-10 h-10 flex items-center justify-center text-lg rounded-full transition 
                                        hover:bg-gray-300 active:scale-95"
                            >
                                <FiMinus />
                            </button>

                            <span className="w-10 text-center font-medium">
                                {quantity}
                            </span>

                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="w-10 h-10 flex items-center justify-center text-lg rounded-full transition 
                                        hover:bg-gray-300 active:scale-95"
                            >
                                <FiPlus />
                            </button>
                        </div>

                        <span className="text-xs text-gray-500 pl-2">
                            Just {product.stockQuantity} available
                        </span>

                    </div>

                    <div className="flex flex-col gap-4">

                        <Button
                            onClick={handleAddToCart}
                            disabled={cart.loading || product.stockQuantity <= 0}
                            isLoading={cart.loading}
                            loadingText="Adding..."
                            className={`w-full py-3 font-medium text-base rounded-full ${
                                product.isOnFlashSale 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : ''
                            }`}
                        >
                            {product.isOnFlashSale ? '⚡ Grab Flash Deal' : 'Add to Cart'}
                        </Button>

                        {product.isOnFlashSale && timeRemaining && (
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 
                            border-2 border-red-200 rounded-2xl p-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <FiClock className="text-red-600 text-lg" />
                                    <span className="text-sm font-semibold text-red-800">
                                        Flash Sale Ends In:
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-center gap-3 flex-wrap">
                                    <div className="flex flex-col items-center bg-white rounded-lg 
                                    px-4 py-2 min-w-[72px] shadow-sm">
                                        <span className="text-2xl font-bold text-red-600">
                                            {String(timeRemaining.days).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            Days
                                        </span>
                                    </div>

                                    <span className="text-2xl font-bold text-red-600">:</span>

                                    <div className="flex flex-col items-center bg-white 
                                    rounded-lg px-3 py-2 min-w-[60px] shadow-sm">
                                        <span className="text-2xl font-bold text-red-600">
                                            {String(timeRemaining.hours).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            Hours
                                        </span>
                                    </div>

                                    <span className="text-2xl font-bold text-red-600">:</span>

                                    <div className="flex flex-col items-center bg-white 
                                    rounded-lg px-3 py-2 min-w-[60px] shadow-sm">
                                        <span className="text-2xl font-bold text-red-600">
                                            {String(timeRemaining.minutes).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            Mins
                                        </span>
                                    </div>

                                    <span className="text-2xl font-bold text-red-600">:</span>

                                    <div className="flex flex-col items-center bg-white 
                                    rounded-lg px-3 py-2 min-w-[60px] shadow-sm">
                                        <span className="text-2xl font-bold text-red-600">
                                            {String(timeRemaining.seconds).padStart(2, '0')}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            Secs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={handleLikeToggle}
                                disabled={isLikeLoading}
                                className={`flex-1  md:w-14 h-12 md:h-14 flex items-center 
                                justify-center rounded-full border transition-all duration-200 
                                ${isLiked ? "border-red-600 text-red-600" : "border-gray-300 text-gray-600"}`}
                            >
                                <FiHeart className={`${isLiked ? "fill-red-600" : ""}`} />
                                <span className="ml-2 font-medium text-sm">Wishlist</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="flex-1  md:w-14 h-12 md:h-14 flex items-center 
                                justify-center rounded-full border border-gray-300 text-gray-600 
                                hover:bg-gray-50 transition-all duration-200"
                            >
                                <FiShare2 />
                                <span className="ml-2 font-medium text-sm">Share</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8">
                        <p className="text-sm text-blue-800">
                            Free return within 7 days for ALL eligible items.{' '}
                            <Link 
                                to="/returns-refunds-policy" 
                                className="font-medium underline text-blue-600"
                            >
                                Details
                            </Link>
                        </p>
                    </div>
                </div>
            </div>  

            <DescriptionSpecsReviews
                product={product}
                reviewsSection={reviewsSection}
            />

            {/* Similar Products */}
            <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-4 font-['Poppins']">Customers Also Bought</h2>
                <ProductsGrid 
                fetchUrl={
                    `api/v1/products?status=active&categoryId=${product.categoryId}&subCategoryId=${product.subCategoryId}`
                }
                showHeader={true}
                itemsPerPage={8}
                showPagination={false}
                from="ProductDetails"
            />
            </div>
        </div>
    );
};

export default ProductDetails;