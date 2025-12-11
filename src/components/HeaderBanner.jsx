import { useState, useEffect } from 'react';

const OFFERS = [
    {
        text: "You can get 50% off on your first order,",
        linkText: "Shop Now!",
        href: "#"
    },
    {
        text: "Free delivery on all orders over ₦100,000,",
        linkText: "Learn More",
        href: "#"
    },
    {
        text: "New soft life collection just dropped,",
        linkText: "View Collection",
        href: "#"
    }
];

const HeaderBanner = () => {
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            
            setTimeout(() => {
                setCurrentOfferIndex((prev) => (prev + 1) % OFFERS.length);
                setIsFading(false);
            }, 500); 
            
        }, 5000); 

        return () => clearInterval(interval);
    }, []);

    const currentOffer = OFFERS[currentOfferIndex];

    return (
        <>
            <style>
                {`
                    @keyframes gradient-flow {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .animate-gradient-flow {
                        background-size: 200% 200%;
                        animation: gradient-flow 10s ease infinite;
                    }
                `}
            </style>

            <div className="
                animate-gradient-flow 
                /* CHANGED: 'Apricot to Peach' gradient. 
                   Soft enough to be demure, but distinctly orange-toned. */
                bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200
                flex justify-center items-center py-2 relative overflow-hidden
            ">
                <div 
                    className={`
                        flex items-center gap-2 
                        text-orange-950 text-[14px] font-medium tracking-wide
                        transition-opacity duration-500 ease-in-out
                        ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
                    `}
                >
                    <span>{currentOffer.text}</span>
                    <a 
                        href={currentOffer.href}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer underline decoration-orange-800/40 
                        hover:decoration-orange-900 hover:text-black transition-all"
                    >
                        {currentOffer.linkText}
                    </a>
                </div>
            </div>
        </>
    )
}

export default HeaderBanner;