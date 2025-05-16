import ProductsGrid from "../components/products/ProductsGrid";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Hero";

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
            <div className="flex gap-x-4 mb-14">
                <Navbar />
                <Hero />
            </div>
            
            <ProductsGrid 
                showHeader={true}
                headerTitle="Featured Products"
                headerSubtitle="Discover our latest collection"
            />
        </div>
    );
};

export default Home;