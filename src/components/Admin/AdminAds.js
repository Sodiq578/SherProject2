import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiTrash2,
  FiUser,
  FiShield,
  FiHome,
  FiFilm,
  FiUsers,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiEye,
  FiX,
  FiEdit2,
  FiMapPin
} from 'react-icons/fi';
import './Admin.css';

const AdminAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedAd, setSelectedAd] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: 'Toshkent',
    photos: []
  });

  const categories = [
    'elektronika',
    'transport',
    'mebel',
    'kiyim',
    'texnika',
    'sport',
    'boshqa'
  ];

  // filterAds ni useCallback bilan memoize qilish
  const filterAds = useCallback(() => {
    let filtered = [...ads];

    if (searchTerm) {
      filtered = filtered.filter(ad => 
        ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(ad => ad.category === filterCategory);
    }

    setFilteredAds(filtered);
  }, [ads, searchTerm, filterCategory]);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminUser'));
    if (!admin) {
      navigate('/admin');
      return;
    }
    setAdminUser(admin);
    loadAds();
  }, [navigate]);

  useEffect(() => {
    filterAds();
  }, [filterAds]); // filterAds dependency sifatida

  const loadAds = () => {
    const savedAds = JSON.parse(localStorage.getItem('ads') || '[]'); // ✅ TUZATILDI: lStorage -> localStorage
    setAds(savedAds);
    setFilteredAds(savedAds);
  };

  const handleDelete = (adId) => {
    if (window.confirm('Bu e\'lonni o\'chirishni tasdiqlaysizmi?')) {
      const updatedAds = ads.filter(ad => ad.id !== adId);
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setAds(updatedAds);
      setSelectedAd(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const viewAdDetails = (ad) => {
    setSelectedAd(ad);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title || '',
      description: ad.description || '',
      price: ad.price?.toString() || '',
      category: ad.category || '',
      location: ad.location || 'Toshkent',
      photos: ad.photos || []
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === editingAd?.userId) || users[0];

    const adData = {
      ...formData,
      id: editingAd ? editingAd.id : Date.now().toString(),
      userId: editingAd ? editingAd.userId : (user?.id || 'unknown'),
      username: editingAd ? editingAd.username : (user?.username || 'unknown'),
      price: parseInt(formData.price),
      views: editingAd ? editingAd.views || 0 : 0,
      createdAt: editingAd ? editingAd.createdAt : new Date().toISOString()
    };

    let updatedAds;
    if (editingAd) {
      updatedAds = ads.map(ad => ad.id === editingAd.id ? adData : ad);
    } else {
      updatedAds = [adData, ...ads];
    }

    localStorage.setItem('ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
    setShowForm(false);
    setEditingAd(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      location: 'Toshkent',
      photos: []
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  return (
    <div className="admin-container">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <FiShield className="sidebar-logo" />
            <h3>Admin Panel</h3>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            <FiMenu />
          </button>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div className="profile-info">
            <span className="profile-name">{adminUser?.username}</span>
            <span className="profile-email">{adminUser?.email}</span>
          </div>
        </div>
        
        <div className="sidebar-menu">
          <button onClick={() => navigate('/admin/dashboard')} className="menu-item">
            <FiHome /> Dashboard
          </button>
          <button onClick={() => navigate('/admin/movies')} className="menu-item">
            <FiFilm /> Kinolar
          </button>
          <button onClick={() => navigate('/admin/users')} className="menu-item">
            <FiUsers /> Foydalanuvchilar
          </button>
          <button onClick={() => navigate('/admin/dating')} className="menu-item">
            <FiHeart /> Dating Profillar
          </button>
          <button onClick={() => navigate('/admin/ads')} className="menu-item active">
            <FiShoppingBag /> E'lonlar
          </button>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Chiqish
          </button>
        </div>
      </div>

      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="admin-header">
          <div className="header-title">
            <h1><FiShoppingBag /> E'lonlar</h1>
            <p>Jami {ads.length} ta e'lon</p>
          </div>
          <div className="header-actions">
            <button onClick={() => setShowForm(true)} className="admin-add-btn">
              <FiShoppingBag /> Yangi e'lon
            </button>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="E'lon qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-buttons">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">Barcha kategoriyalar</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="admin-form-overlay">
            <div className="admin-form-modal">
              <div className="admin-form-header">
                <h3>{editingAd ? 'E\'lon tahrirlash' : 'Yangi e\'lon qo\'shish'}</h3>
                <button onClick={() => { setShowForm(false); setEditingAd(null); resetForm(); }} className="close-btn">
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Sarlavha *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="E'lon sarlavhasi"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kategoriya *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                      <option value="">Tanlang</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Narx (so'm) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="100000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Manzil</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Toshkent"
                  />
                </div>

                <div className="form-group">
                  <label>Ta'rif *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="E'lon haqida batafsil..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Saqlash
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingAd(null); resetForm(); }} className="cancel-btn">
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="ads-grid">
          {filteredAds.length > 0 ? (
            filteredAds.map(ad => (
              <div key={ad.id} className="ad-card" onClick={() => viewAdDetails(ad)}>
                <div className="ad-card-header">
                  <div className="ad-icon">
                    <FiShoppingBag />
                  </div>
                  <div className="ad-category-badge">{ad.category}</div>
                </div>
                <div className="ad-card-body">
                  <h3>{ad.title}</h3>
                  <div className="ad-price">{formatPrice(ad.price)}</div>
                  <p className="ad-description-preview">{ad.description?.substring(0, 60)}...</p>
                  <div className="ad-meta">
                    <span><FiMapPin /> {ad.location}</span>
                    <span><FiEye /> {ad.views || 0}</span>
                  </div>
                  <div className="ad-seller">
                    <FiUser /> @{ad.username}
                  </div>
                </div>
                <div className="ad-card-footer">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(ad); }} 
                    className="action-btn edit"
                    title="Tahrirlash"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(ad.id); }} 
                    className="action-btn delete"
                    title="O'chirish"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <FiShoppingBag className="no-data-icon" />
              <p>Hozircha e'lonlar yo'q</p>
              <button onClick={() => setShowForm(true)} className="add-first-btn">
                <FiShoppingBag /> Birinchi e'lonni qo'shish
              </button>
            </div>
          )}
        </div>

        {selectedAd && (
          <div className="admin-form-overlay" onClick={() => setSelectedAd(null)}>
            <div className="ad-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>E'lon ma'lumotlari</h3>
                <button onClick={() => setSelectedAd(null)} className="close-btn">
                  <FiX />
                </button>
              </div>
              <div className="ad-details-content">
                <div className="detail-row">
                  <label>Sarlavha:</label>
                  <span className="ad-title">{selectedAd.title}</span>
                </div>
                <div className="detail-row">
                  <label>Kategoriya:</label>
                  <span className="ad-category-detail">{selectedAd.category}</span>
                </div>
                <div className="detail-row">
                  <label>Narx:</label>
                  <span className="ad-price-detail">{formatPrice(selectedAd.price)}</span>
                </div>
                <div className="detail-row">
                  <label>Manzil:</label>
                  <span><FiMapPin /> {selectedAd.location}</span>
                </div>
                <div className="detail-row">
                  <label>Ta'rif:</label>
                  <p className="ad-description-full">{selectedAd.description}</p>
                </div>
                <div className="detail-row">
                  <label>Sotuvchi:</label>
                  <span><FiUser /> @{selectedAd.username}</span>
                </div>
                <div className="detail-row">
                  <label>Ko'rishlar:</label>
                  <span><FiEye /> {selectedAd.views || 0}</span>
                </div>
                <div className="detail-row">
                  <label>ID:</label>
                  <span>{selectedAd.id}</span>
                </div>
                <div className="detail-row">
                  <label>Qo'shilgan:</label>
                  <span>{formatDate(selectedAd.createdAt)}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => handleEdit(selectedAd)} className="edit-confirm-btn">
                  <FiEdit2 /> Tahrirlash
                </button>
                <button onClick={() => handleDelete(selectedAd.id)} className="delete-confirm-btn">
                  <FiTrash2 /> O'chirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAds;