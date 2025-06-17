import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiHeart,
  FiShoppingCart,
  FiX
} from 'react-icons/fi';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import { useCart } from '../../components/contexts/CartContext';
import { FaSpinner } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [addingToCartId, setAddingToCartId] = useState(null);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('api/v1/users/likes/my-likes');
        if(response.data.status === 'success'){
          setWishlist(response.data.data.likes.map(like => like.product));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch wishlist');
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
      if(res.status === 204){
        setWishlist(wishlist.filter(item => item.id !== productId));
        toast.success('Item removed from wishlist');
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
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error(result.error?.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCartId(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link to="/profile" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Back to Account
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-6">My Wishlist ({wishlist.length})</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <FiHeart className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-gray-500">Save items you love by clicking the heart icon</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-light hover:bg-primary-dark"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {wishlist.map((product) => (
              <div key={product.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      className="h-24 w-24 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <div className="mt-1 flex items-center">
                          <span className="text-lg font-bold text-primary-light">
                            ₦{parseFloat(product.discountPrice  || product.price).toLocaleString('en-US')}
                          </span>
                          {product.discountPrice > 0 && (
                            <>
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ₦{parseFloat(product.price).toLocaleString('en-US')}
                              </span>
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                                {Math.round((1 - product.discountPrice/product.price) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        disabled={removingItemId === product.id}
                        className="text-primary-light hover:text-white flex mt-2 lg:mt-0 items-center justify-center transition-all duration-150 border cursor-pointer border-primary-light hover:bg-primary-light h-10 w-10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingItemId === product.id ? (
                          <FaSpinner className="h-5 w-5 animate-spin" />
                        ) : (
                          <FiX className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="mt-4 flex space-x-3 items-center">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity <= 0 || addingToCartId === product.id}
                        className="inline-flex items-center px-3 py-1 cursor-pointer border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-light hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {addingToCartId === product.id ? (
                          <>
                            <FaSpinner className="mr-1 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <FiShoppingCart className="mr-1 h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      {product.stockQuantity <= 0 && (
                        <span className="text-sm text-red-500">Out of stock</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;