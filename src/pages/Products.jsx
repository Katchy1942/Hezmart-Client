import { useState } from "react"
import ProductsGrid from "../components/products/ProductsGrid";

const Products = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="min-h-screen">
            <h1 className="text-xl md:text-2xl font-semibold mb-4 font-['Poppins'] pt-4">All Products</h1>
            <ProductsGrid />
        </div>
    )
}

export default Products