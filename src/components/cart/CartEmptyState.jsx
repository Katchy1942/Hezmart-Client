import { FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CartEmptyState = () => {
  return (
    <div className="text-center py-12">
      <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
      <p className="mt-1 text-gray-500">Start adding some products to your cart</p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-light hover:bg-primary-dark"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default CartEmptyState;