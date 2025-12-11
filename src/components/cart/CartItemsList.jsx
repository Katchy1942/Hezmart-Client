import { FiMinus, FiPlus, FiTrash2, } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const CartItemsList = ({
    items,
    onQuantityChange,
    onRemoveItem,
    onClearCart,
}) => {
    const location = useLocation();
    const pathname = location.pathname;

    const getItemPrice = (item) => {
        if (item.product?.isOnFlashSale && item.product?.displayPrice) {
            return parseFloat(item.product.displayPrice);
        }
        if (item.product?.discountPrice && item.product.discountPrice !== "0.00") {
            return parseFloat(item.product.discountPrice);
        }
        return parseFloat(item.product?.price || 0);
    };

    return (
        <div className="lg:col-span-8">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {items.map((item) => {
                        const itemPrice = getItemPrice(item);
                        const originalPrice = parseFloat(item.product?.price || 0);
                        const hasDiscount = itemPrice < originalPrice;

                        return (
                            <li key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                            className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex gap-4">
                                    <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white 
                                        overflow-hidden rounded-xl sm:rounded-2xl border-2 border-gray-300 relative">
                                            <img
                                                src={item.product?.coverImage || ''}
                                                alt={item.product?.name || 'Product image'}
                                                className="w-full h-full object-cover"
                                            />
                                            {item.product?.isOnFlashSale && (
                                                <div className="absolute top-1 left-1 bg-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                                                    ⚡ SALE
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-base sm:text-lg max-w-100 font-semibold text-gray-900">
                                                    <Link to={`/product/${item.productId}`} className="hover:text-primary-light 
                                                    transition-colors line-clamp-2 sm:line-clamp-none">
                                                        {item.product?.name || 'Unnamed Product'}
                                                    </Link>
                                                </h3>

                                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                    <div className="mt-1 sm:mt-2 flex flex-wrap gap-2">
                                                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                            <span key={key} className="inline-flex items-center px-2 
                                                            py-0.5 sm:px-2.5 sm:py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                                {key}: {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {!item.available && (
                                                    <span className="inline-block mt-2 px-2.5 py-1 text-xs 
                                                    font-medium text-red-800 bg-red-100 rounded-md">
                                                        {item.product?.stockQuantity > 0
                                                            ? `Only ${item.product.stockQuantity} available`
                                                            : 'Out of stock'}
                                                    </span>
                                                )}

                                                {item.available && item.product?.stockQuantity <= 5 && (
                                                    <span className="inline-block mt-2 px-2.5 py-1 
                                                    text-xs font-medium text-orange-800 bg-orange-50 rounded-md">
                                                        Only {item.product.stockQuantity} left in stock!
                                                    </span>
                                                )}
                                            </div>

                                            {pathname === '/cart' && (
                                                <button
                                                    onClick={() => onRemoveItem(item.productId)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors border-2 
                                                    border-gray-300 hover:border-red-600 rounded-full p-1 h-fit shrink-0"
                                                    aria-label="Remove item"
                                                >
                                                    <FiTrash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-2 sm:mt-4 flex items-end justify-between flex-wrap gap-y-2 gap-x-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-2">
                                                    <p className={`text-lg sm:text-2xl font-bold ${
                                                        item.product?.isOnFlashSale 
                                                            ? 'text-red-600' 
                                                            : 'text-primary-light'
                                                    }`}>
                                                        ₦{(itemPrice * item.quantity).toLocaleString()}
                                                    </p>
                                                    
                                                    {hasDiscount && (
                                                        <p className="text-xs sm:text-sm text-gray-500 line-through">
                                                            ₦{(originalPrice * item.quantity).toLocaleString()}
                                                        </p>
                                                    )}
                                                    
                                                    {item.product?.isOnFlashSale && (
                                                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                                                            FLASH
                                                        </span>
                                                    )}
                                                </div>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        ₦{itemPrice.toLocaleString()} each
                                                    </p>
                                                )}
                                            </div>

                                            {pathname === '/cart' && (
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <span className="hidden sm:inline text-sm text-gray-600 font-medium">Qty:</span>
                                                    <div className="flex items-center border-2 border-gray-300 rounded-full overflow-hidden h-8 sm:h-auto">
                                                        <button
                                                            onClick={() => onQuantityChange(item.productId, -1)}
                                                            className="px-2 sm:px-4 py-1 sm:py-2 text-gray-700 
                                                            hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed 
                                                            transition-colors font-semibold"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </button>

                                                        <span className="px-2 sm:px-4 py-1 sm:py-2 bg-gray-50 text-gray-900 
                                                        font-semibold min-w-[2rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() => onQuantityChange(item.productId, 1)}
                                                            className="px-2 sm:px-4 py-1 sm:py-2 text-gray-700 hover:bg-gray-100 
                                                            disabled:opacity-40 disabled:cursor-not-allowed transition-colors 
                                                            font-semibold"
                                                            disabled={item.quantity >= (item.product?.stockQuantity || 0)}
                                                        >
                                                            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {pathname !== '/cart' && (
                                                <div className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {pathname === '/cart' && (
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        onClick={onClearCart}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border 
                        border-red-200 bg-red-50 text-red-600 hover:bg-red-100 
                        hover:text-red-700 transition-all text-sm font-semibold"
                    >
                        <FiTrash2 className="mr-2" />
                        Clear Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartItemsList;
