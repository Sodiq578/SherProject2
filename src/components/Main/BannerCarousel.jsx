import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './BannerCarousel.css';

const BannerCarousel = ({ onBannerClick }) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Bannerlarni localStorage dan yuklash
  useEffect(() => {
    const savedBanners = JSON.parse(localStorage.getItem('banners') || '[]');
    
    if (savedBanners.length > 0) {
      setBanners(savedBanners);
    } else {
      // Default bannerlar (agar localStorage bo'sh bo'lsa)
      const defaultBanners = [
        {
          id: 1,
          imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format',
          title: 'Yangi filmlar mavsumi',
          description: 'Eng so\'nggi kinolar sizni kutmoqda',
          link: '/kino',
          discount: '-20%'
        },
        {
          id: 2,
          imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&auto=format',
          title: 'Dating platforma',
          description: 'Yangi tanishlar orttiring, hayot sherigingizni toping',
          link: '/dating',
          discount: 'Bepul'
        },
        {
          id: 3,
          imageUrl: 'https://images.unsplash.com/photo-1607083206865-6c9a3f0aee12?w=600&auto=format',
          title: 'E\'lonlar bo\'limi',
          description: 'Sotuv, xarid va xizmatlar',
          link: '/elonlar',
          discount: 'Chegirma'
        }
      ];
      setBanners(defaultBanners);
      localStorage.setItem('banners', JSON.stringify(defaultBanners));
    }
  }, []);

  // Auto play
  useEffect(() => {
    let interval;
    if (isAutoPlaying && banners.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext();
    }
    if (touchStart - touchEnd < -75) {
      goToPrev();
    }
  };

  const handleBannerClick = () => {
    if (onBannerClick && banners[currentIndex]) {
      onBannerClick(banners[currentIndex]);
    } else if (banners[currentIndex]?.link) {
      navigate(banners[currentIndex].link);
    }
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <div 
      className="banner-carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main banner */}
      <div 
        className="banner-slide"
        onClick={handleBannerClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={banners[currentIndex].imageUrl} 
          alt={banners[currentIndex].title}
          loading="lazy"
        />
        
        {/* Discount badge */}
        {banners[currentIndex].discount && (
          <div className="banner-discount">
            {banners[currentIndex].discount}
          </div>
        )}

        {/* Banner content */}
        <div className="banner-content">
          <h3>{banners[currentIndex].title}</h3>
          <p>{banners[currentIndex].description}</p>
          <button className="banner-button">
            Batafsil →
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button 
            className="carousel-arrow prev"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
          >
            <FiChevronLeft />
          </button>
          <button 
            className="carousel-arrow next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <FiChevronRight />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {banners.length > 1 && (
        <div className="carousel-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;