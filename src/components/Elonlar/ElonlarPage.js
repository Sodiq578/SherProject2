import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiPlus,
  FiX,
  FiTrash2,
  FiArrowLeft,
  FiMapPin,
  FiTag,
  FiUser,
  FiClock,
  FiEye
} from 'react-icons/fi';
import './ElonlarPage.css';

const ElonlarPage = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterCategory, setFilterCategory] = useState('barchasi');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    totalViews: 0,
    categories: {}
  });

  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: 'Toshkent',
    phone: '',
    condition: 'yangi'
  });

  // Kategoriyalar ro'yxati
  const categories = [
    { id: 'barchasi', name: 'Barchasi', icon: '📱' },
    { id: 'elektronika', name: 'Elektronika', icon: '💻' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'mebel', name: 'Mebel', icon: '🪑' },
    { id: 'kiyim', name: 'Kiyim', icon: '👕' },
    { id: 'boshqa', name: 'Boshqa', icon: '📦' }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    
    if (!user) {
      navigate('/');
      return;
    }

    loadAds();
  }, [navigate]);

  useEffect(() => {
    calculateStats();
  }, [ads]);

  const loadAds = () => {
    const savedAds = JSON.parse(localStorage.getItem('ads') || '[]');
    // Sort by date (newest first)
    const sortedAds = savedAds.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setAds(sortedAds);
  };

  const calculateStats = () => {
    const total = ads.length;
    const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
    
    const categories = {};
    ads.forEach(ad => {
      categories[ad.category] = (categories[ad.category] || 0) + 1;
    });

    setStats({ total, totalViews, categories });
  };

  const handleChange = (e) => {
    setNewAd({
      ...newAd,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!newAd.title.trim() || !newAd.description.trim() || !newAd.price || !newAd.category) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    if (parseInt(newAd.price) < 0) {
      alert("Narx manfiy bo'lishi mumkin emas!");
      return;
    }

    const ad = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar || '👤',
      ...newAd,
      price: parseInt(newAd.price),
      createdAt: new Date().toISOString(),
      views: 0,
      status: 'active'
    };

    const updatedAds = [ad, ...ads];
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
    
    // Reset form
    setShowForm(false);
    setNewAd({
      title: '',
      description: '',
      price: '',
      category: '',
      location: 'Toshkent',
      phone: '',
      condition: 'yangi'
    });
  };

  const handleDelete = (adId) => {
    if (window.confirm("E'lonni o'chirishni tasdiqlaysizmi?")) {
      const updatedAds = ads.filter(ad => ad.id !== adId);
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setAds(updatedAds);
    }
  };

  const handleViewAd = (adId) => {
    const updatedAds = ads.map(ad => {
      if (ad.id === adId) {
        return { ...ad, views: (ad.views || 0) + 1 };
      }
      return ad;
    });
    
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
  };

  const formatPrice = (price) => {
    if (!price) return "Narx kelishilgan";
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('UZS', 'so\'m');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Bugun";
    if (diffDays === 1) return "Kecha";
    if (diffDays < 7) return `${diffDays} kun oldin`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`;
    return date.toLocaleDateString('uz-UZ');
  };

  // Filter and sort ads
  const getFilteredAds = () => {
    let filtered = [...ads];

    // Filter by category
    if (filterCategory !== 'barchasi') {
      filtered = filtered.filter(ad => ad.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(term) ||
        ad.description.toLowerCase().includes(term) ||
        ad.location.toLowerCase().includes(term)
      );
    }

    // Sort
    switch(sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredAds = getFilteredAds();

  return (
    <div className="elonlar-container">
      {/* Header */}
      <div className="elonlar-header">
        <button onClick={() => navigate('/main')} className="back-btn">
          <FiArrowLeft />
        </button>
        <div className="header-title">
          <FiShoppingBag className="header-icon" />
          <h1>E'lonlar taxtasi</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="add-btn">
          <FiPlus />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon blue">📊</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Jami e'lonlar</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">👁️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalViews}</span>
            <span className="stat-label">Ko'rishlar</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📌</div>
          <div className="stat-info">
            <span className="stat-value">
              {Object.keys(stats.categories).length}
            </span>
            <span className="stat-label">Kategoriyalar</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">🆕 Eng yangi</option>
            <option value="oldest">📅 Eski e'lonlar</option>
            <option value="price-high">💰 Narxi: katta  kichik</option>
            <option value="price-low">💰 Narxi: kichik  katta</option>
            <option value="popular">🔥 Eng ko'p ko'rilgan</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${filterCategory === cat.id ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            {cat.name}
            {cat.id !== 'barchasi' && stats.categories[cat.id] && (
              <span className="category-count">{stats.categories[cat.id]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h3>Yangi e'lon qo'shish</h3>
              <button onClick={() => setShowForm(false)} className="close-btn">
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="ad-form">
              <div className="form-group">
                <label>Sarlavha</label>
                <input
                  type="text"
                  name="title"
                  value={newAd.title}
                  onChange={handleChange}
                  placeholder="Masalan: iPhone 14 Pro"
                  required
                  className="form-input"
                  maxLength="100"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Kategoriya</label>
                  <select
                    name="category"
                    value={newAd.category}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Tanlang</option>
                    {categories.filter(c => c.id !== 'barchasi').map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Holati</label>
                  <select
                    name="condition"
                    value={newAd.condition}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="yangi">Yangi</option>
                    <option value="ideal">Ideal</option>
                    <option value="yaxshi">Yaxshi</option>
                    <option value="qoniqarli">Qoniqarli</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Narx (so'm)</label>
                  <input
                    type="number"
                    name="price"
                    value={newAd.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="form-input"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Manzil</label>
                  <input
                    type="text"
                    name="location"
                    value={newAd.location}
                    onChange={handleChange}
                    placeholder="Toshkent, Chilonzor"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Telefon raqam</label>
                <input
                  type="tel"
                  name="phone"
                  value={newAd.phone}
                  onChange={handleChange}
                  placeholder="+998 90 123 45 67"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Ta'rif</label>
                <textarea
                  name="description"
                  value={newAd.description}
                  onChange={handleChange}
                  placeholder="Mahsulot haqida batafsil..."
                  required
                  rows="4"
                  className="form-textarea"
                  maxLength="1000"
                />
                <small>{newAd.description.length}/1000</small>
              </div>
              
              <button type="submit" className="submit-btn">
                E'lonni joylash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ads List */}
      <div className="ads-list">
        {filteredAds.length === 0 ? (
          <div className="empty-ads">
            <div className="empty-icon-wrapper">
              <FiShoppingBag className="empty-icon" />
            </div>
            <h3>E'lonlar topilmadi</h3>
            <p>
              {searchTerm || filterCategory !== 'barchasi' 
                ? "Boshqa qidiruv so'zini yoki kategoriyani tanlang"
                : "Hozircha hech qanday e'lon mavjud emas"}
            </p>
            <button onClick={() => setShowForm(true)} className="add-first-btn">
              <FiPlus /> Birinchi e'lonni qo'shish
            </button>
          </div>
        ) : (
          <>
            <div className="results-info">
              <span>{filteredAds.length} ta e'lon topildi</span>
            </div>
            
            {filteredAds.map(ad => (
              <div 
                key={ad.id} 
                className="ad-card"
                onClick={() => handleViewAd(ad.id)}
              >
                <div className="ad-image">
                  <div className="ad-image-placeholder">
                    {categories.find(c => c.id === ad.category)?.icon || '📦'}
                  </div>
                  {ad.condition && (
                    <span className={`condition-badge ${ad.condition}`}>
                      {ad.condition === 'yangi' ? '🆕 Yangi' : 
                       ad.condition === 'ideal' ? '✨ Ideal' :
                       ad.condition === 'yaxshi' ? '👍 Yaxshi' : '👌 Qoniqarli'}
                    </span>
                  )}
                </div>
                
                <div className="ad-content">
                  <div className="ad-header">
                    <h3 className="ad-title">{ad.title}</h3>
                    <div className="ad-price-tag">
                      <span className="ad-price">{formatPrice(ad.price)}</span>
                    </div>
                  </div>
                  
                  <p className="ad-description">
                    {ad.description.length > 100 
                      ? ad.description.substring(0, 100) + '...' 
                      : ad.description}
                  </p>
                  
                  <div className="ad-meta">
                    <span className="meta-item">
                      <FiTag /> {categories.find(c => c.id === ad.category)?.name || ad.category}
                    </span>
                    <span className="meta-item">
                      <FiMapPin /> {ad.location}
                    </span>
                    {ad.phone && (
                      <span className="meta-item phone">
                        📞 {ad.phone}
                      </span>
                    )}
                  </div>
                  
                  <div className="ad-footer">
                    <div className="seller-info">
                      <div className="seller-avatar">
                        {ad.userAvatar}
                      </div>
                      <span className="seller-name">@{ad.username}</span>
                    </div>
                    
                    <div className="ad-stats">
                      <span className="stat">
                        <FiEye /> {ad.views || 0}
                      </span>
                      <span className="stat">
                        <FiClock /> {formatDate(ad.createdAt)}
                      </span>
                    </div>
                    
                    {ad.userId === currentUser?.id && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ad.id);
                        }} 
                        className="delete-btn"
                        title="O'chirish"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer with additional info */}
      {ads.length > 0 && (
        <div className="elonlar-footer">
          <p>
            <FiShoppingBag /> Jami {stats.total} ta e'lon, 
            {stats.totalViews} marta ko'rilgan
          </p>
        </div>
      )}
    </div>
  );
};

export default ElonlarPage;