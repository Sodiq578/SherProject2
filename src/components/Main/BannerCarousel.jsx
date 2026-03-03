import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './BannerCarousel.css';

const BannerCarousel = ({ banners: propBanners, onBannerClick, isAdmin = false, onBannerUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Local storage dan bannerlarni yuklash
  useEffect(() => {
    if (propBanners) {
      setBanners(propBanners);
    } else {
      const savedBanners = JSON.parse(localStorage.getItem('banners') || '[]');
      if (savedBanners.length > 0) {
        setBanners(savedBanners);
      } else {
        // Default bannerlar
        const defaultBanners = [
          {
            id: 1,
            imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format',
            title: 'Yangi filmlar',
            description: 'Eng so\'nggi kinolar sizni kutmoqda',
            link: '/kino',
            discount: '-20%'
          },
          {
            id: 2,
            imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&auto=format',
            title: 'Dating platforma',
            description: 'Yangi tanishlar orttiring',
            link: '/dating',
            discount: 'Bepul'
          },
          {
            id: 3,
            imageUrl: 'https://images.unsplash.com/photo-1607083206865-6c9a3f0aee12?w=600&auto=format',
            title: 'E\'lonlar bo\'limi',
            description: 'Sotuv va xarid qiling',
            link: '/elonlar',
            discount: 'Chegirma'
          }
        ];
        setBanners(defaultBanners);
        localStorage.setItem('banners', JSON.stringify(defaultBanners));
      }
    }
  }, [propBanners]);

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
      window.location.href = banners[currentIndex].link;
    }
  };

  // Admin functions
  const handleAddBanner = () => {
    setEditingBanner({
      id: Date.now(),
      imageUrl: '',
      title: '',
      description: '',
      link: '',
      discount: ''
    });
    setShowEditModal(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowEditModal(true);
  };

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Bu bannerni o\'chirishni xohlaysizmi?')) {
      const updatedBanners = banners.filter(b => b.id !== bannerId);
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      if (onBannerUpdate) onBannerUpdate(updatedBanners);
      if (currentIndex >= updatedBanners.length) {
        setCurrentIndex(Math.max(0, updatedBanners.length - 1));
      }
    }
  };

  const handleSaveBanner = (bannerData) => {
    let updatedBanners;
    if (banners.some(b => b.id === bannerData.id)) {
      // Update existing
      updatedBanners = banners.map(b => b.id === bannerData.id ? bannerData : b);
    } else {
      // Add new
      updatedBanners = [...banners, bannerData];
    }
    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    if (onBannerUpdate) onBannerUpdate(updatedBanners);
    setShowEditModal(false);
    setEditingBanner(null);
  };

  if (banners.length === 0) {
    return (
      <div className="banner-empty">
        {isAdmin ? (
          <button onClick={handleAddBanner} className="add-banner-btn">
            + Banner qo'shish
          </button>
        ) : (
          <p>Bannerlar mavjud emas</p>
        )}
      </div>
    );
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

        {/* Admin controls */}
        {isAdmin && (
          <div className="banner-admin-controls">
            <button 
              className="admin-btn edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEditBanner(banners[currentIndex]);
              }}
            >
              <FiEdit2 />
            </button>
            <button 
              className="admin-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBanner(banners[currentIndex].id);
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        )}
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

      {/* Add banner button for admin */}
      {isAdmin && banners.length > 0 && (
        <button 
          className="add-banner-fab"
          onClick={handleAddBanner}
        >
          +
        </button>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <BannerEditModal
          banner={editingBanner}
          onSave={handleSaveBanner}
          onClose={() => {
            setShowEditModal(false);
            setEditingBanner(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Modal Component
const BannerEditModal = ({ banner, onSave, onClose }) => {
  const [formData, setFormData] = useState(banner);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUrl || !formData.title) {
      alert('Rasm va title majburiy!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{banner.id ? 'Bannerni tahrirlash' : 'Yangi banner qo\'shish'}</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rasm URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label>Sarlavha</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="Banner sarlavhasi"
              required
            />
          </div>

          <div className="form-group">
            <label>Tavsif</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Banner tavsifi"
            />
          </div>

          <div className="form-group">
            <label>Havola (Link)</label>
            <input
              type="text"
              value={formData.link || ''}
              onChange={e => setFormData({...formData, link: e.target.value})}
              placeholder="/kino yoki https://..."
            />
          </div>

          <div className="form-group">
            <label>Chegirma (ixtiyoriy)</label>
            <input
              type="text"
              value={formData.discount || ''}
              onChange={e => setFormData({...formData, discount: e.target.value})}
              placeholder="-20% yoki Bepul"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Bekor qilish
            </button>
            <button type="submit" className="save-btn">
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerCarousel;