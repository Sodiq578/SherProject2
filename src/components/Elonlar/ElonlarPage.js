import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiPlus,
  FiX,
  FiTrash2,
  FiArrowLeft,
  FiMapPin,
  FiTag
} from 'react-icons/fi';
import './ElonlarPage.css';

const ElonlarPage = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: 'Toshkent'
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    
    if (!user) {
      navigate('/');
      return;
    }

    const savedAds = JSON.parse(localStorage.getItem('ads') || '[]');
    setAds(savedAds);
  }, [navigate]);

  const handleChange = (e) => {
    setNewAd({
      ...newAd,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ad = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      ...newAd,
      price: parseInt(newAd.price),
      createdAt: new Date().toISOString(),
      views: 0
    };

    const updatedAds = [ad, ...ads];
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    setAds(updatedAds);
    setShowForm(false);
    setNewAd({
      title: '',
      description: '',
      price: '',
      category: '',
      location: 'Toshkent'
    });
  };

  const handleDelete = (adId) => {
    if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
      const updatedAds = ads.filter(ad => ad.id !== adId);
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setAds(updatedAds);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  };

  return (
    <div className="elonlar-container">
      <div className="elonlar-header">
        <button onClick={() => navigate('/main')} className="back-btn">
          <FiArrowLeft />
        </button>
        <h1><FiShoppingBag /> E'lonlar</h1>
        <button onClick={() => setShowForm(true)} className="add-btn">
          <FiPlus />
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-modal-header">
              <h3>Yangi e'lon</h3>
              <button onClick={() => setShowForm(false)} className="close-btn">
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="ad-form">
              <input
                type="text"
                name="title"
                value={newAd.title}
                onChange={handleChange}
                placeholder="Sarlavha"
                required
                className="form-input"
              />
              
              <select
                name="category"
                value={newAd.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Kategoriya</option>
                <option value="elektronika">Elektronika</option>
                <option value="transport">Transport</option>
                <option value="mebel">Mebel</option>
                <option value="kiyim">Kiyim</option>
                <option value="boshqa">Boshqa</option>
              </select>
              
              <input
                type="number"
                name="price"
                value={newAd.price}
                onChange={handleChange}
                placeholder="Narx (so'm)"
                required
                className="form-input"
              />
              
              <input
                type="text"
                name="location"
                value={newAd.location}
                onChange={handleChange}
                placeholder="Manzil"
                className="form-input"
              />
              
              <textarea
                name="description"
                value={newAd.description}
                onChange={handleChange}
                placeholder="Ta'rif"
                required
                rows="3"
                className="form-textarea"
              />
              
              <button type="submit" className="submit-btn">
                Qo'shish
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="ads-list">
        {ads.length === 0 ? (
          <div className="empty-ads">
            <FiShoppingBag className="empty-icon" />
            <p>Hozircha e'lonlar yo'q</p>
            <button onClick={() => setShowForm(true)} className="add-first-btn">
              <FiPlus /> Birinchi e'lonni qo'shish
            </button>
          </div>
        ) : (
          ads.map(ad => (
            <div key={ad.id} className="ad-card">
              <div className="ad-image">
                <FiShoppingBag className="ad-icon" />
              </div>
              <div className="ad-content">
                <h3>{ad.title}</h3>
                <p className="ad-price">{formatPrice(ad.price)}</p>
                <div className="ad-meta">
                  <span><FiTag /> {ad.category}</span>
                  <span><FiMapPin /> {ad.location}</span>
                </div>
                <p className="ad-description">{ad.description.substring(0, 60)}...</p>
                <div className="ad-footer">
                  <span className="ad-seller">@{ad.username}</span>
                  <span className="ad-date">
                    {new Date(ad.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                {ad.userId === currentUser?.id && (
                  <button onClick={() => handleDelete(ad.id)} className="delete-btn">
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ElonlarPage;