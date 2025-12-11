import FeaturedProducts from "../components/products/FeaturedProducts";
import FlashSales from "../components/products/FlashSales";
import HotRightNow from "../components/products/HotRightNow";
import RecentlyViewed from "../components/products/RecentlyViewed";

const Home = () => {
    return (
        <div className="min-h-screen max-w-7xl mx-auto pt-4 sm:px-4">
            
            
            <div className="flex flex-col gap-12 mt-8">
                <FlashSales />
                <HotRightNow />
                <RecentlyViewed />
                <FeaturedProducts />
            </div>
        </div>
    );
};

export default Home;