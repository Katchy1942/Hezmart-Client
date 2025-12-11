import { Link } from 'react-router-dom';

const CartEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-20">
            <h3 className="text-2xl font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-gray-500 text-[14px]">Start by adding some products to your cart.</p>
            <div className="mt-6">
                <Link
                    to="/"
                    className="text-[14px] font-medium text-white bg-primary-light px-8 py-2 rounded-full"
                >
                    Browse Products
                </Link>
            </div>
        </div>
    );
};

export default CartEmptyState;