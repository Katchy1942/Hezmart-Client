import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CartItemsList = ({ 
  items, 
  onQuantityChange, 
  onRemoveItem,
  onClearCart 
}) => {
  return (
    <div className="lg:col-span-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
                  <img
                    src={item.product?.coverImage || ''}
                    alt={item.product?.name || 'Product image'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/product/${item.productId}`}>{item.product?.name || 'Unnamed Product'}</Link>
                      </h3>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {Object.entries(item.selectedOptions).map(([key, value]) => (
                            <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                      {!item.available && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded">
                          Only {item.product?.stockQuantity || 0} available
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="ml-4 text-primary-light hover:text-primary-dark cursor-pointer"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex-1 flex items-end justify-between">
                    <div>
                    {item.product?.discountPrice && item.product?.discountPrice !== "0.00" ? (
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-primary-light">
                          ₦{((item.product.discountPrice || 0) * item.quantity).toLocaleString()}
                        </p>
                        <p className="ml-2 text-sm text-gray-500 line-through">
                          ₦{((item.product.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      ) : (
                        <p className="text-lg font-medium text-primary-light">
                          ₦{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      )}
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          ₦{item.product?.discountPrice && item.product.discountPrice !== "0.00" 
                            ? item.product.discountPrice.toLocaleString() 
                            : (item.product?.price || 0).toLocaleString()} each
                        </p>
                      )}
                    </div>

                    <div className="flex items-center border border-gray-300 bg-[#F0F0F0] rounded-md">
                      <button
                        onClick={() => onQuantityChange(item.productId, -1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => onQuantityChange(item.productId, 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        disabled={item.quantity >= (item.product?.stockQuantity || 0)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearCart}
          className="text-sm text-red-600 hover:text-red-800 flex items-center cursor-pointer"
        >
          <FiTrash2 className="mr-1" /> Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartItemsList;