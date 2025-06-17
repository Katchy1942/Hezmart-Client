import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiShare2 } from "react-icons/fi";
import { ReviewsSection, renderRatingStars } from "./ReviewComponent";
import { ProductTabs } from "./ProductTabs";
import { useCart } from "../../components/contexts/CartContext.jsx";
import { toast } from 'react-toastify';
import Button from "../../components/common/Button.jsx";
import ProductsGrid from "../../components/products/ProductsGrid.jsx";

const ProductDetails = () => {
    const { addToCart, cart } = useCart();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
  
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
            if(res.data.status === 'success'){
                setProduct(res.data.data.product);
                setLikesCount(res.data.data.product.likesCount || 0);
                
                const initialOptions = {};
                if (res.data.data.product.options) {
                    res.data.data.product.options.forEach(option => {
                        initialOptions[option.name] = option.values[0].value;
                    });
                }
                setReviews(res.data.data.product.reviews);
                
                // Fetch like status if user is logged in
                if (user) {
                    fetchLikeStatus();
                }
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product details");
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
            // Optimistically update UI
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

            // Make API call
            const res = await axios.post(`api/v1/products/${id}/likes/toggle`);
            
            // Verify response
            if (res.data.status === 'success') {
                // Show success toast
                toast.success(
                    newLikedState 
                        ? 'Item added to wishlist successfully' 
                        : 'Item removed from wishlist successfully'
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
        return parseFloat(product.discountPrice || product.price);
    };

    const handleShare = ()=>{
        if(navigator.share){
            navigator
            .share({
                title:'Check this out!',
                text:'I found a great product for you.',
                url:window.location.href
            })
            .then(()=>console.log('Shared successfully'))
            .catch(err => console.log('Error Sharing', err))
        }
    }

    useEffect(() => {
        fetchProductDetail();
    }, [id]);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4">
                <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-8 w-8 text-rose-500" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The product you're looking for doesn't exist or may have been removed.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Go Back
                        </button>
                        <Link
                            to="/"
                            className="inline-block w-full px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow active:scale-95"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const discountPercentage = calculateDiscountPercentage();
    
    const displayPrice = getDisplayPrice();

    const reviewsSection = (
        <ReviewsSection
            product={product}
            reviews={reviews}
        />
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Product Overview */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                        <img 
                            src={product.images?.[selectedImage] || product.coverImage} 
                            alt={product.name} 
                            className="w-full h-96 object-contain"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {product.images?.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                            >
                                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 bg-white rounded-lg shadow-md p-4">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <div className="flex items-center mt-2">
                            <div className="flex mr-2">
                                {renderRatingStars(product.ratingsAverage)}
                            </div>
                            <span className="text-sm text-gray-500">
                                ({product.ratingsQuantity} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-gray-900">
                                  ₦{displayPrice.toLocaleString('en-US')}
                            </span>
                           
                            {discountPercentage > 0  && (
                                <>
                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                        ₦{parseFloat(product.price).toLocaleString('en-US')}
                                    </span>
                                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                                        {discountPercentage}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Product Options */}
                    {product.options?.map(option => (
                        <div key={option.id} className="mb-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {option.values.map(value => (
                                    <button
                                        key={value.id}
                                        onClick={() => handleOptionSelect(option.name, value.value)}
                                        className={`px-3 py-1 border rounded-md text-sm ${selectedOptions[option.name] === value.value 
                                            ? 'bg-blue-100 border-blue-500 text-blue-800' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {value.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Quantity and Add to Cart */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <span className="text-sm font-medium text-gray-900 mr-4">Quantity</span>
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                    onClick={() => handleQuantityChange(-1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 text-gray-900">{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                            <span className="ml-4 text-sm text-gray-500">
                                {product.stockQuantity} available
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleAddToCart}
                                disabled={cart.loading || product.stockQuantity <= 0}
                                isLoading={cart.loading}
                                loadingText="Adding to cart..."
                                icon={<FiShoppingCart />}
                                iconPosition="left"
                                className="flex-1 py-3 px-6"
                            >
                                Add to Cart
                            </Button>
                            <button 
                                onClick={handleLikeToggle}
                                disabled={isLikeLoading}
                                className={`p-3 border cursor-pointer rounded-md hover:bg-gray-50 flex items-center justify-center ${
                                    isLiked ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-300 text-gray-600'
                                }`}
                            >
                                {isLikeLoading ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <FiHeart className={`${isLiked ? 'fill-current' : ''}`} />
                                        {likesCount > 0 && (
                                            <span className="ml-1 text-xs">{likesCount}</span>
                                        )}
                                    </>
                                )}
                            </button>
                            <button onClick={handleShare} className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                                <FiShare2 className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Category:</span>
                                <span className="ml-2 text-gray-900">
                                    {product.category?.name} &gt; {product.subCategory?.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Vendor:</span>
                                <span className="ml-2 text-gray-900">
                                    {product.user?.businessName}
                                </span>
                            </div>
                            
                            <div>
                                <span className="text-gray-500">Weight:</span>
                                <span className="ml-2 text-gray-900">{product.weight} kg</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <ProductTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                product={product}
                reviewsSection={reviewsSection}
            />

            {/* Similar Products */}
            <ProductsGrid 
                fetchUrl={`api/v1/products?status=active&categoryId=${product.categoryId}&subCategoryId=${product.subCategoryId}`}
                showHeader={true}
                headerTitle="Similar Products"
                headerSubtitle={`Similar products based on ${product.category?.name} > ${product.subCategory?.name}`}
            />
        </div>
    );
};

export default ProductDetails;