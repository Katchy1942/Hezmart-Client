import ProductsGrid from "./ProductsGrid"
import { Link } from "react-router-dom"

const FeaturedProducts = () => {
    return (
        <div>
            <div>
                <h1 className="text-xl md:text-2xl font-semibold mb-4 font-['Poppins',sans-serif]">
                    Featured Products
                </h1>
            </div>
            <div>
                <ProductsGrid showPagination={false} />
            </div>
            <p className="text-center text-xs text-gray-800">
                Can't find what you're looking for?{' '}
                <a href="tel:09160002490" className="font-medium text-blue-600 hover:underline">
                    Call us at 09160002490
                </a>
                , use the search bar above, or{' '}
                <Link to="/products" className="font-medium text-blue-600 hover:underline">
                    browse all products
                </Link>
                .
            </p>
        </div>
    )
}

export default FeaturedProducts