// src/components/Main/AdminBanner.js
import React, { useState, useEffect } from 'react';
import './AdminBanner.css';

const AdminBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    active: true,
    order: 0
  });

  // Mock data - load banners
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBanners = [
        {
          id: 1,
          title: 'Yangi filmlar',
          description: 'Eng so\'nggi filmlar bilan tanishing',
          imageUrl: 'https://via.placeholder.com/1200x400/1e1e2f/ffffff?text=Kino+Banner',
          link: '/kino',
          active: true,
          order: 1,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'Tanishuv platformasi',
          description: 'Yangi tanishlar orttiring',
          imageUrl: 'https://via.placeholder.com/1200x400/2a2a3a/ffffff?text=Dating+Banner',
          link: '/dating',
          active: true,
          order: 2,
          createdAt: '2024-01-16'
        },
        {
          id: 3,
          title: 'Musiqa dunyosi',
          description: 'Sevimli qo\'shiqlaringizni tinglang',
          imageUrl: 'https://via.placeholder.com/1200x400/3a3a4a/ffffff?text=Music+Banner',
          link: '/music',
          active: false,
          order: 3,
          createdAt: '2024-01-17'
        }
      ];
      setBanners(mockBanners);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBanner) {
      // Update existing banner
      setBanners(banners.map(b => 
        b.id === editingBanner.id ? { ...formData, id: b.id } : b
      ));
    } else {
      // Add new banner
      const newBanner = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBanners([...banners, newBanner]);
    }
    
    // Reset form
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      active: true,
      order: banners.length + 1
    });
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      link: banner.link,
      active: banner.active,
      order: banner.order
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu banner ni o\'chirishni xohlaysizmi?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    ));
  };

  if (loading) {
    return (
      <div className="admin-banner-loading">
        <div className="spinner"></div>
        <p>Bannerlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="admin-banner-container">
      <div className="admin-banner-header">
        <h1>Bannerlarni boshqarish</h1>
        <button 
          className="add-banner-btn"
          onClick={() => {
            setEditingBanner(null);
            setFormData({
              title: '',
              description: '',
              imageUrl: '',
              link: '',
              active: true,
              order: banners.length + 1
            });
          }}
        >
          + Yangi banner
        </button>
      </div>

      {/* Banner Form */}
      <div className="banner-form-container">
        <h2>{editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner qo\'shish'}</h2>
        <form onSubmit={handleSubmit} className="banner-form">
          <div className="form-group">
            <label htmlFor="title">Sarlavha</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Banner sarlavhasi"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Tavsif</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Banner tavsifi"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Rasm URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Preview" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="link">Havola (Link)</label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="/kino yoki https://example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order">Tartib raqami</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                Faol
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingBanner ? 'Yangilash' : 'Qo\'shish'}
            </button>
            {editingBanner && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setEditingBanner(null);
                  setFormData({
                    title: '',
                    description: '',
                    imageUrl: '',
                    link: '',
                    active: true,
                    order: banners.length + 1
                  });
                }}
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Banners List */}
      <div className="banners-list">
        <h2>Bannerlar ro'yxati</h2>
        <div className="banners-grid">
          {banners.map(banner => (
            <div key={banner.id} className={`banner-card ${!banner.active ? 'inactive' : ''}`}>
              <div className="banner-image">
                <img src={banner.imageUrl} alt={banner.title} />
                <div className="banner-status">
                  <span className={`status-badge ${banner.active ? 'active' : 'inactive'}`}>
                    {banner.active ? 'Faol' : 'Faol emas'}
                  </span>
                </div>
              </div>
              
              <div className="banner-content">
                <h3>{banner.title}</h3>
                <p>{banner.description}</p>
                
                <div className="banner-meta">
                  <span className="banner-order">Tartib: {banner.order}</span>
                  <span className="banner-date">Qo'shilgan: {banner.createdAt}</span>
                </div>

                {banner.link && (
                  <a href={banner.link} className="banner-link" target="_blank" rel="noopener noreferrer">
                    {banner.link}
                  </a>
                )}
              </div>

              <div className="banner-actions">
                <button 
                  className="toggle-btn"
                  onClick={() => handleToggleActive(banner.id)}
                  title={banner.active ? 'Faolsizlashtirish' : 'Faollashtirish'}
                >
                  {banner.active ? '🔴' : '🟢'}
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(banner)}
                  title="Tahrirlash"
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(banner.id)}
                  title="O'chirish"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="no-banners">
            <p>Hozircha bannerlar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBanner;