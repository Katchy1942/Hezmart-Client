import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carousel_1, carousel_2, carousel_3, carousel_4 } from '../assets/images';
import Button from './common/Button';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    carousel_1, carousel_2, carousel_3, carousel_4
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
      {/* Background images with fade transition */}
      <div className="absolute inset-0 flex transition-opacity duration-1000 ease-in-out">
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fadeIn">
          Get Quality Products At Affordable Price
        </h1>
        
        <Link to="/shops" className="w-full md:w-auto">
            <Button className="w-full md:w-auto flex items-center justify-center gap-2 px-3 py-2 sm:py-3">
                Shop Now
            </Button>
        </Link>
        
        {/* Image indicators */}
        <div className="absolute bottom-4 sm:bottom-8 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white sm:w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;