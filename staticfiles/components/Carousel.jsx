import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd'

export default function BannerCarousel() {

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

  return (
  
    <Carousel className="w-auto rounded-md overflow-hidden" arrows infinite autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
      {banners.map((image, key)=>(
      <div key={key} className="w-full flex-shrink-0">
      <img className="h-full w-full object-cover" src={image.url} alt={image.alt} />
      </div>
      ))}
    </Carousel>
  );
  }
  