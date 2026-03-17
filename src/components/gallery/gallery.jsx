import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiImage,
  FiSearch,
  FiHeart,
  FiDownload,
  FiShare2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiFilter,
  FiCamera,
  FiSun,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiBookmark,
  FiAward,
  FiUser,
  FiFlag
} from 'react-icons/fi';
import './Gallery.css';

// Barcha rasmlar - KOMPONENTDAN TASHQARIDA (qisqartirilgan versiya)
const allMockImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    title: "Quyosh botishi",
    description: "Tog'lar ustida quyosh botishi",
    category: "nature",
    orientation: "landscape",
    photographer: "John Doe",
    photographerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    location: "Swiss Alps",
    date: "2024-01-15",
    width: 4000,
    height: 3000,
    tags: ["sunset", "mountains", "nature"],
    featured: true
  },
  
  ];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrientation, setSelectedOrientation] = useState('all');
  const [likedImages, setLikedImages] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(allMockImages.length);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0
  });

  const observerRef = useRef();
  const lastImageRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, loading]);

  // Rasmlarni random tartibda aralashtirish funksiyasi
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Rasmlarni yuklash
  const fetchImages = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      // Rasmlarni random tartibda aralashtirish
      const shuffledImages = shuffleArray(allMockImages);
      setTotalImages(shuffledImages.length);

      // Pagination: har safar 6 tadan rasm yuklash
      const imagesPerPage = 6;
      const startIndex = (page - 1) * imagesPerPage;
      const endIndex = startIndex + imagesPerPage;
      
      const paginatedImages = shuffledImages.slice(startIndex, endIndex);

      const imagesWithRandomStats = paginatedImages.map(img => ({
        ...img,
        views: Math.floor(Math.random() * 50000) + 5000,
        likes: Math.floor(Math.random() * 5000) + 500,
        downloads: Math.floor(Math.random() * 3000) + 200
      }));

      if (reset) {
        setImages(imagesWithRandomStats);
        setFilteredImages(imagesWithRandomStats);
      } else {
        setImages(prev => [...prev, ...imagesWithRandomStats]);
        setFilteredImages(prev => [...prev, ...imagesWithRandomStats]);
      }

      setHasMore(endIndex < shuffledImages.length);
      
    } catch (error) {
      console.error('Rasmlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages(true);
  }, [fetchImages]);

  useEffect(() => {
    if (page > 1) {
      fetchImages();
    }
  }, [page, fetchImages]);

  // Filterlash
  useEffect(() => {
    let filtered = images;

    if (searchQuery) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    if (selectedOrientation !== 'all') {
      filtered = filtered.filter(img => img.orientation === selectedOrientation);
    }

    setFilteredImages(filtered);
  }, [searchQuery, selectedCategory, selectedOrientation, images]);

  // Statistikalarni yangilash
  useEffect(() => {
    const totalViews = filteredImages.reduce((acc, img) => acc + (img.views || 0), 0);
    const totalLikes = filteredImages.reduce((acc, img) => acc + (img.likes || 0), 0);
    const totalDownloads = filteredImages.reduce((acc, img) => acc + (img.downloads || 0), 0);
    
    setStats({
      totalViews,
      totalLikes,
      totalDownloads
    });
  }, [filteredImages]);

  const handleLike = (image) => {
    if (likedImages.includes(image.id)) {
      setLikedImages(prev => prev.filter(id => id !== image.id));
    } else {
      setLikedImages(prev => [...prev, image.id]);
    }
  };

  const handleSave = (image) => {
    if (savedImages.includes(image.id)) {
      setSavedImages(prev => prev.filter(id => id !== image.id));
    } else {
      setSavedImages(prev => [...prev, image.id]);
    }
  };

  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    window.history.back();
  };

  const categories = [
    { id: 'all', name: 'Barchasi', icon: <FiGrid /> },
    { id: 'nature', name: 'Tabiat', icon: <FiSun /> },
    { id: 'city', name: 'Shahar', icon: <FiMapPin /> },
    { id: 'portrait', name: 'Portret', icon: <FiUser /> },
    { id: 'animals', name: 'Hayvonlar', icon: <FiCamera /> },
    { id: 'architecture', name: 'Arxitektura', icon: <FiImage /> },
    { id: 'food', name: 'Taomlar', icon: <FiImage /> },
    { id: 'sports', name: 'Sport', icon: <FiImage /> },
    { id: 'fashion', name: 'Moda', icon: <FiImage /> },
    { id: 'travel', name: 'Sayohat', icon: <FiMapPin /> }
  ];

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <FiChevronLeft size={24} />
          </button>
          <div className="header-content">
            <h1>
              <FiCamera className="header-icon" />
              Galereya
            </h1>
            <div className="header-stats">
              <span className="stat-item">
                <FiImage /> {totalImages} ta rasm
              </span>
              <span className="stat-item">
                <FiEye /> {stats.totalViews.toLocaleString()} ko'rilgan
              </span>
              <span className="stat-item">
                <FiHeart /> {stats.totalLikes.toLocaleString()} like
              </span>
              <span className="stat-item">
                <FiDownload /> {stats.totalDownloads.toLocaleString()} yuklangan
              </span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rasm qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid />
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h3>Kategoriyalar</h3>
            <div className="category-grid">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Orientatsiya</h3>
            <div className="orientation-btns">
              <button
                className={`orientation-btn ${selectedOrientation === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('all')}
              >
                Barchasi
              </button>
              <button
                className={`orientation-btn ${selectedOrientation === 'landscape' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('landscape')}
              >
                Landshaft
              </button>
              <button
                className={`orientation-btn ${selectedOrientation === 'portrait' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('portrait')}
              >
                Portret
              </button>
              <button
                className={`orientation-btn ${selectedOrientation === 'square' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('square')}
              >
                Kvadrat
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>Jami: {filteredImages.length} ta rasm</h3>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading && page === 1 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Rasmlar yuklanmoqda...</p>
        </div>
      ) : (
        <>
          <div className={`gallery-grid ${viewMode}`}>
            {filteredImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className={`gallery-item ${viewMode}`}
                ref={index === filteredImages.length - 1 ? lastImageRef : null}
              >
                <div className="image-wrapper" onClick={() => setSelectedImage(image)}>
                  <img src={image.thumb} alt={image.title} loading="lazy" />
                  
                  {image.featured && (
                    <div className="featured-badge">
                      <FiAward />
                    </div>
                  )}

                  <div className="image-overlay">
                    <div className="overlay-header">
                      <button className="overlay-btn like" onClick={(e) => {
                        e.stopPropagation();
                        handleLike(image);
                      }}>
                        <FiHeart className={likedImages.includes(image.id) ? 'active' : ''} />
                        <span>{image.likes || 0}</span>
                      </button>
                      <button className="overlay-btn" onClick={(e) => {
                        e.stopPropagation();
                        handleSave(image);
                      }}>
                        <FiBookmark className={savedImages.includes(image.id) ? 'active' : ''} />
                      </button>
                    </div>

                    <div className="overlay-footer">
                      <div className="photographer-info">
                        <img src={image.photographerAvatar} alt={image.photographer} />
                        <span>{image.photographer}</span>
                      </div>
                      <button className="overlay-btn" onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}>
                        <FiDownload />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="image-info">
                  <h3>{image.title}</h3>
                  <p>{image.description}</p>
                  <div className="image-meta">
                    <span className="meta-item">
                      <FiCamera /> {image.width} x {image.height}
                    </span>
                    <span className="meta-item">
                      <FiEye /> {(image.views || 0).toLocaleString()}
                    </span>
                    <span className="meta-item">
                      <FiDownload /> {image.downloads || 0}
                    </span>
                  </div>
                  <div className="image-tags">
                    {image.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination indicator */}
          {!loading && filteredImages.length > 0 && (
            <div className="pagination-info">
              <span>
                {filteredImages.length} / {totalImages} ta rasm ko'rsatilmoqda
              </span>
              {hasMore && !loadingMore && (
                <span className="scroll-hint">
                  Yana yuklash uchun pastga scrolling qiling
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="loading-more">
          <div className="spinner small"></div>
          <span>Ko'proq rasmlar yuklanmoqda...</span>
        </div>
      )}

      {/* No more images */}
      {!hasMore && !loading && filteredImages.length > 0 && (
        <div className="no-more-images">
          <p>Barcha rasmlar yuklandi</p>
        </div>
      )}

      {/* No results */}
      {!loading && filteredImages.length === 0 && (
        <div className="no-results">
          <FiImage size={50} />
          <h3>Hech qanday rasm topilmadi</h3>
          <p>Boshqa qidiruv so'zi yoki filtrni tanlang</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <FiX />
            </button>
            
            <div className="lightbox-image-container">
              <img src={selectedImage.url} alt={selectedImage.title} />
            </div>

            <div className="lightbox-info">
              <div className="lightbox-header">
                <div className="photographer-detail">
                  <img src={selectedImage.photographerAvatar} alt={selectedImage.photographer} />
                  <div>
                    <h4>{selectedImage.photographer}</h4>
                    <p>
                      <FiMapPin /> {selectedImage.location}
                    </p>
                  </div>
                </div>
                <div className="lightbox-actions">
                  <button 
                    className={`action-btn ${likedImages.includes(selectedImage.id) ? 'active' : ''}`}
                    onClick={() => handleLike(selectedImage)}
                  >
                    <FiHeart />
                  </button>
                  <button 
                    className={`action-btn ${savedImages.includes(selectedImage.id) ? 'active' : ''}`}
                    onClick={() => handleSave(selectedImage)}
                  >
                    <FiBookmark />
                  </button>
                  <button className="action-btn" onClick={() => handleDownload(selectedImage)}>
                    <FiDownload />
                  </button>
                  <button className="action-btn">
                    <FiShare2 />
                  </button>
                </div>
              </div>

              <h2>{selectedImage.title}</h2>
              <p className="description">{selectedImage.description}</p>

              <div className="lightbox-stats">
                <div className="stat-item">
                  <FiEye />
                  <div>
                    <span className="stat-value">{(selectedImage.views || 0).toLocaleString()}</span>
                    <span className="stat-label">ko'rilgan</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FiHeart />
                  <div>
                    <span className="stat-value">{(selectedImage.likes || 0).toLocaleString()}</span>
                    <span className="stat-label">like</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FiDownload />
                  <div>
                    <span className="stat-value">{(selectedImage.downloads || 0).toLocaleString()}</span>
                    <span className="stat-label">yuklangan</span>
                  </div>
                </div>
              </div>

              <div className="lightbox-details">
                <div className="detail-item">
                  <FiCalendar />
                  <span>Yuklangan: {new Date(selectedImage.date).toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="detail-item">
                  <FiCamera />
                  <span>O'lcham: {selectedImage.width} x {selectedImage.height}</span>
                </div>
                <div className="detail-item">
                  <FiFlag />
                  <span>Kategoriya: {selectedImage.category}</span>
                </div>
              </div>

              <div className="lightbox-tags">
                {selectedImage.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>

            <button className="lightbox-prev" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
              if (currentIndex > 0) {
                setSelectedImage(filteredImages[currentIndex - 1]);
              }
            }}>
              <FiChevronLeft />
            </button>

            <button className="lightbox-next" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
              if (currentIndex < filteredImages.length - 1) {
                setSelectedImage(filteredImages[currentIndex + 1]);
              }
            }}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;