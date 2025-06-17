import ProductsGrid from "../components/products/ProductsGrid";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Hero";
import {useState} from 'react'
const Home = () => {
    
    return (
        <div className="max-w-7xl mx-auto  pt-4">
           

            <div className="flex flex-col lg:flex-row gap-x-4 mb-14">
                {/* Navbar - Hidden on mobile unless toggled */}
                <div className={`hidden lg:block fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:shadow-md rounded-lg p-4 h-auto lg:h-full overflow-y-auto`}>
                    <Navbar />
                </div>
                
                {/* Hero section - full width on mobile */}
                <div className="w-full lg:w-[calc(100%-16rem)]">
                    <Hero />
                </div>
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