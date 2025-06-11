import ProductsGrid from "../components/products/ProductsGrid";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Hero";
import {useState} from 'react'
import { FiMenu, FiX } from "react-icons/fi";
const Home = () => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
            {/* Mobile Nav Toggle Button */}
            <button 
                className="lg:hidden fixed top-24 left-4 z-50 bg-white p-2 rounded-md shadow-md"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
                {mobileNavOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className="flex flex-col lg:flex-row gap-x-4 mb-14">
                {/* Mobile Nav Overlay */}
                {mobileNavOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    />
                )}
                
                {/* Navbar - Hidden on mobile unless toggled */}
                <div className={`${mobileNavOpen ? 'block' : 'hidden'} lg:block fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:shadow-md rounded-lg p-4 h-auto lg:h-full overflow-y-auto`}>
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