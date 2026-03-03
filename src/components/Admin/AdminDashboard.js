import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFilm, 
  FiUsers, 
  FiShoppingBag, 
  FiHeart,
  FiLogOut,
  FiMenu,
  FiHome,
  FiTrendingUp,
  FiShield,
  FiCalendar,
  FiEye,
  FiDownload,
  FiSettings,
  FiBell,
  FiUser,
  FiImage, // Yangi import
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX
} from 'react-icons/fi';
import './Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    dating: 0,
    ads: 0,
    totalViews: 0,
    banners: 0 // Yangi
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // Banner state'lari
  const [banners, setBanners] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    id: '',
    imageUrl: '',
    title: '',
    description: '',
    link: '',
    discount: ''
  });

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminUser'));
    if (!admin) {
      navigate('/admin');
      return;
    }
    setAdminUser(admin);

    // Statistikani hisoblash
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const movies = JSON.parse(localStorage.getItem('movies') || '[]');
    const dating = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const banners = JSON.parse(localStorage.getItem('banners') || '[]');

    // Kinolardan umumiy ko'rishlar soni
    const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);

    setStats({
      users: users.length,
      movies: movies.length,
      dating: dating.length,
      ads: ads.length,
      totalViews,
      banners: banners.length // Yangi
    });

    setBanners(banners);

    // Oxirgi aktiviteler
    const activities = [
      ...movies.slice(0, 3).map(m => ({ type: 'movie', text: `Yangi kino: ${m.title}`, time: m.createdAt })),
      ...users.slice(0, 3).map(u => ({ type: 'user', text: `Yangi foydalanuvchi: ${u.username}`, time: new Date().toISOString() })),
      ...banners.slice(0, 2).map(b => ({ type: 'banner', text: `Banner: ${b.title}`, time: new Date().toISOString() }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    setRecentActivities(activities);

    // Bildirishnomalar
    const notifs = [];
    if (movies.length === 0) {
      notifs.push({ type: 'warning', text: 'Hali kinolar qo\'shilmagan' });
    }
    if (banners.length === 0) {
      notifs.push({ type: 'info', text: 'Bannerlar mavjud emas' });
    }
    setNotifications(notifs);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  // Banner funksiyalari
  const handleAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      id: Date.now().toString(),
      imageUrl: '',
      title: '',
      description: '',
      link: '',
      discount: ''
    });
    setShowBannerModal(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerForm(banner);
    setShowBannerModal(true);
  };

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Bu bannerni o\'chirishni xohlaysizmi?')) {
      const updatedBanners = banners.filter(b => b.id !== bannerId);
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      
      // Statistikani yangilash
      setStats(prev => ({ ...prev, banners: updatedBanners.length }));
      
      // Aktivitelarga qo'shish
      const newActivity = {
        type: 'banner',
        text: 'Banner o\'chirildi',
        time: new Date().toISOString()
      };
      setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    
    if (!bannerForm.imageUrl || !bannerForm.title) {
      alert('Rasm va sarlavha majburiy!');
      return;
    }

    let updatedBanners;
    if (editingBanner) {
      // Tahrirlash
      updatedBanners = banners.map(b => 
        b.id === editingBanner.id ? bannerForm : b
      );
    } else {
      // Yangi qo'shish
      updatedBanners = [...banners, { ...bannerForm, id: Date.now().toString() }];
    }

    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    
    // Statistikani yangilash
    setStats(prev => ({ ...prev, banners: updatedBanners.length }));
    
    // Aktivitelarga qo'shish
    const newActivity = {
      type: 'banner',
      text: editingBanner ? 'Banner tahrirlandi' : 'Yangi banner qo\'shildi',
      time: new Date().toISOString()
    };
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    
    setShowBannerModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugun';
    if (diffDays === 1) return 'Kecha';
    if (diffDays < 7) return `${diffDays} kun oldin`;
    return date.toLocaleDateString('uz-UZ');
  };

  return (
    <div className="admin-container">
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
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
          <button onClick={() => navigate('/admin/dashboard')} className="menu-item active">
            <FiHome /> Dashboard
          </button>
          <button onClick={() => navigate('/admin/movies')} className="menu-item">
            <FiFilm /> Kinolar
            {stats.movies > 0 && <span className="menu-badge">{stats.movies}</span>}
          </button>
          <button onClick={() => navigate('/admin/users')} className="menu-item">
            <FiUsers /> Foydalanuvchilar
            {stats.users > 0 && <span className="menu-badge">{stats.users}</span>}
          </button>
          <button onClick={() => navigate('/admin/dating')} className="menu-item">
            <FiHeart /> Dating Profillar
            {stats.dating > 0 && <span className="menu-badge">{stats.dating}</span>}
          </button>
          <button onClick={() => navigate('/admin/ads')} className="menu-item">
            <FiShoppingBag /> E'lonlar
            {stats.ads > 0 && <span className="menu-badge">{stats.ads}</span>}
          </button>
          <button onClick={() => {
            // Bannerlar bo'limiga o'tish
            document.getElementById('banners-section').scrollIntoView({ behavior: 'smooth' });
          }} className="menu-item">
            <FiImage /> Bannerlar
            {stats.banners > 0 && <span className="menu-badge">{stats.banners}</span>}
          </button>
        </div>

        <div className="sidebar-notifications">
          <h4>Bildirishnomalar</h4>
          {notifications.map((notif, index) => (
            <div key={index} className={`notification-item ${notif.type}`}>
              <FiBell />
              <span>{notif.text}</span>
            </div>
          ))}
        </div>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Chiqish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="admin-header">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Xush kelibsiz, {adminUser?.username}!</p>
          </div>
          <div className="header-actions">
            <button className="header-btn">
              <FiDownload />
            </button>
            <button className="header-btn">
              <FiSettings />
            </button>
            <div className="header-date">
              <FiCalendar />
              {new Date().toLocaleDateString('uz-UZ', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card users" onClick={() => navigate('/admin/users')}>
            <div className="stat-icon-wrapper">
              <FiUsers className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Foydalanuvchilar</span>
              <span className="stat-value">{stats.users}</span>
              <span className="stat-change">+{Math.floor(stats.users * 0.1)}%</span>
            </div>
          </div>

          <div className="stat-card movies" onClick={() => navigate('/admin/movies')}>
            <div className="stat-icon-wrapper">
              <FiFilm className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Kinolar</span>
              <span className="stat-value">{stats.movies}</span>
              <span className="stat-change">+{stats.movies > 0 ? '2' : '0'} ta yangi</span>
            </div>
          </div>

          <div className="stat-card dating" onClick={() => navigate('/admin/dating')}>
            <div className="stat-icon-wrapper">
              <FiHeart className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Dating Profillar</span>
              <span className="stat-value">{stats.dating}</span>
              <span className="stat-change">{stats.dating} ta faol</span>
            </div>
          </div>

          <div className="stat-card ads" onClick={() => navigate('/admin/ads')}>
            <div className="stat-icon-wrapper">
              <FiShoppingBag className="stat-icon" />
            </div>
            <div className="stat-content">
              <span className="stat-label">E'lonlar</span>
              <span className="stat-value">{stats.ads}</span>
              <span className="stat-change">{stats.totalViews} ko'rish</span>
            </div>
          </div>
        </div>

        {/* Banner Section - Yangi qo'shilgan qism */}
        <div id="banners-section" className="dashboard-card banners-section">
          <div className="card-header">
            <div className="header-left">
              <FiImage className="section-icon" />
              <h3>Bannerlar boshqaruvi</h3>
            </div>
            <button onClick={handleAddBanner} className="add-banner-btn">
              <FiPlus /> Yangi banner
            </button>
          </div>

          <div className="banners-grid">
            {banners.length > 0 ? (
              banners.map((banner) => (
                <div key={banner.id} className="banner-item">
                  <div className="banner-preview">
                    <img src={banner.imageUrl} alt={banner.title} />
                    {banner.discount && (
                      <span className="banner-discount-badge">{banner.discount}</span>
                    )}
                  </div>
                  <div className="banner-info">
                    <h4>{banner.title}</h4>
                    <p>{banner.description}</p>
                    <div className="banner-meta">
                      <span className="banner-link">{banner.link || 'Havola yo\'q'}</span>
                    </div>
                    <div className="banner-actions">
                      <button 
                        onClick={() => handleEditBanner(banner)}
                        className="banner-action edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="banner-action delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-banners">
                <FiImage className="no-banners-icon" />
                <p>Hali bannerlar mavjud emas</p>
                <button onClick={handleAddBanner} className="add-first-banner">
                  <FiPlus /> Birinchi banner qo'shish
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="dashboard-grid">
          <div className="dashboard-card recent-activities">
            <div className="card-header">
              <h3>Oxirgi aktiviteler</h3>
              <FiEye className="card-icon" />
            </div>
            <div className="activities-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'movie' ? <FiFilm /> : 
                       activity.type === 'user' ? <FiUsers /> : 
                       activity.type === 'banner' ? <FiImage /> : <FiBell />}
                    </div>
                    <div className="activity-content">
                      <p>{activity.text}</p>
                      <span>{formatDate(activity.time)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activities">
                  <p>Hozircha aktiviteler yo'q</p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card quick-actions">
            <div className="card-header">
              <h3>Tezkor amallar</h3>
              <FiTrendingUp className="card-icon" />
            </div>
            <div className="actions-grid">
              <button onClick={() => navigate('/admin/movies')} className="quick-action">
                <FiFilm />
                <span>Kino qo'shish</span>
              </button>
              <button onClick={() => navigate('/admin/users')} className="quick-action">
                <FiUsers />
                <span>Foydalanuvchilar</span>
              </button>
              <button onClick={() => navigate('/admin/dating')} className="quick-action">
                <FiHeart />
                <span>Dating</span>
              </button>
              <button onClick={() => navigate('/admin/ads')} className="quick-action">
                <FiShoppingBag />
                <span>E'lonlar</span>
              </button>
              <button onClick={handleAddBanner} className="quick-action banner">
                <FiImage />
                <span>Banner qo'shish</span>
              </button>
            </div>
          </div>

          <div className="dashboard-card system-info">
            <div className="card-header">
              <h3>Tizim ma'lumoti</h3>
            </div>
            <div className="info-list">
              <div className="info-row">
                <span>Versiya</span>
                <span className="info-value">1.0.0</span>
              </div>
              <div className="info-row">
                <span>Oxirgi yangilanish</span>
                <span className="info-value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span>Admin</span>
                <span className="info-value">{adminUser?.email}</span>
              </div>
              <div className="info-row">
                <span>Status</span>
                <span className="info-value status-active">Aktiv</span>
              </div>
              <div className="info-row">
                <span>Bannerlar</span>
                <span className="info-value">{stats.banners}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="modal-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="modal-content banner-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner qo\'shish'}</h3>
              <button className="close-btn" onClick={() => setShowBannerModal(false)}>
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSaveBanner}>
              <div className="form-group">
                <label>Rasm URL *</label>
                <input
                  type="text"
                  value={bannerForm.imageUrl}
                  onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {bannerForm.imageUrl && (
                  <div className="image-preview">
                    <img src={bannerForm.imageUrl} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Sarlavha *</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={e => setBannerForm({...bannerForm, title: e.target.value})}
                  placeholder="Banner sarlavhasi"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tavsif</label>
                <textarea
                  value={bannerForm.description}
                  onChange={e => setBannerForm({...bannerForm, description: e.target.value})}
                  placeholder="Banner tavsifi"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Havola (Link)</label>
                  <input
                    type="text"
                    value={bannerForm.link}
                    onChange={e => setBannerForm({...bannerForm, link: e.target.value})}
                    placeholder="/kino yoki https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Chegirma</label>
                  <input
                    type="text"
                    value={bannerForm.discount}
                    onChange={e => setBannerForm({...bannerForm, discount: e.target.value})}
                    placeholder="-20% yoki Bepul"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowBannerModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="save-btn">
                  {editingBanner ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;