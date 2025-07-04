import React, { useState, useEffect } from 'react';

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Banner images - ads, offers, promotions
  const banners = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
      alt: "Summer Sale Banner"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop",
      alt: "New Collection Banner"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      alt: "Special Offer Banner"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&fit=crop",
      alt: "Free Shipping Banner"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      alt: "Holiday Deals Banner"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // Touch handlers for swipe support
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Simple Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="w-full flex-shrink-0"
            >
              <img
                src={banner.url}
                alt={banner.alt}
                className="w-full h-48 md:h-64 lg:h-80 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

     </div>
  );
  }
  