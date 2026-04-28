import ProductsGrid from "../components/products/ProductsGrid";

const Products = () => {

   return (
      <div className="min-h-screen py-16">
         <h1 className="text-xl md:text-2xl font-semibold mb-4   pt-8">All Products</h1>
         <ProductsGrid />
      </div>
   )
}

export default Products