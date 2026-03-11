import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  FiImage,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiActivity,
  FiBarChart2,
  FiStar,
  FiZap,
  FiGlobe
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const initialized = useRef(false);
  
  // State'lar
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    dating: 0,
    ads: 0,
    totalViews: 0,
    banners: 0,
    totalLikes: 0,
    activeUsers: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
    discount: '',
    order: 0,
    active: true,
    createdAt: ''
  });

  // Ma'lumotlarni yuklash
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadDashboardData();
    }
    
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadDashboardData = useCallback(() => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin')) || 
                    JSON.parse(localStorage.getItem('currentUser'));
      
      if (!admin?.isAdmin) {
        navigate('/admin');
        return;
      }
      
      setAdminUser(admin);

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const movies = JSON.parse(localStorage.getItem('movies') || '[]');
      const dating = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
      const ads = JSON.parse(localStorage.getItem('ads') || '[]');
      const banners = JSON.parse(localStorage.getItem('banners') || '[]');

      const totalViews = movies.reduce((sum, m) => sum + (m.views || 0), 0) + 
                        ads.reduce((sum, a) => sum + (a.views || 0), 0);
      
      const totalLikes = movies.reduce((sum, m) => sum + (m.likes || 0), 0) + 
                        dating.reduce((sum, d) => sum + (d.likes || 0), 0);
      
      const activeUsers = users.filter(u => {
        const lastLogin = new Date(u.lastLogin || 0);
        const now = new Date();
        const diffDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
        return diffDays < 7;
      }).length;

      setStats({
        users: users.length,
        movies: movies.length,
        dating: dating.length,
        ads: ads.length,
        totalViews,
        banners: banners.length,
        totalLikes,
        activeUsers
      });

      setBanners(banners.sort((a, b) => (a.order || 0) - (b.order || 0)));

      const activities = [
        ...movies.slice(0, 3).map(m => ({ 
          type: 'movie', 
          text: `Yangi kino: ${m.title}`, 
          time: m.createdAt || new Date().toISOString(),
        })),
        ...users.slice(0, 3).map(u => ({ 
          type: 'user', 
          text: `Yangi foydalanuvchi: ${u.username}`, 
          time: u.createdAt || new Date().toISOString(),
        })),
        ...banners.slice(0, 2).map(b => ({ 
          type: 'banner', 
          text: `Banner: ${b.title}`, 
          time: b.createdAt || new Date().toISOString(),
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 7);

      setRecentActivities(activities);

      const notifs = [];
      if (movies.length === 0) {
        notifs.push({ type: 'warning', text: 'Hali kinolar qo\'shilmagan' });
      }
      if (banners.length === 0) {
        notifs.push({ type: 'info', text: 'Bannerlar mavjud emas' });
      }
      setNotifications(notifs);

    } catch (error) {
      console.error('Dashboard yuklash xatosi:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    if (window.confirm('Chiqishni xohlaysizmi?')) {
      localStorage.removeItem('admin');
      localStorage.removeItem('currentUser');
      navigate('/admin');
    }
  }, [navigate]);

  const handleAddBanner = useCallback(() => {
    setEditingBanner(null);
    setBannerForm({
      id: Date.now().toString(),
      imageUrl: '',
      title: '',
      description: '',
      link: '',
      discount: '',
      order: banners.length + 1,
      active: true,
      createdAt: new Date().toISOString()
    });
    setShowBannerModal(true);
  }, [banners.length]);

  const handleEditBanner = useCallback((banner) => {
    setEditingBanner(banner);
    setBannerForm(banner);
    setShowBannerModal(true);
  }, []);

  const handleDeleteBanner = useCallback((bannerId) => {
    if (window.confirm('Bu bannerni o\'chirishni xohlaysizmi?')) {
      const updatedBanners = banners.filter(b => b.id !== bannerId);
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      setStats(prev => ({ ...prev, banners: updatedBanners.length }));
    }
  }, [banners]);

  const handleSaveBanner = useCallback((e) => {
    e.preventDefault();
    
    if (!bannerForm.imageUrl || !bannerForm.title) {
      alert('Rasm va sarlavha majburiy!');
      return;
    }

    let updatedBanners;
    if (editingBanner) {
      updatedBanners = banners.map(b => 
        b.id === editingBanner.id ? { ...bannerForm } : b
      );
    } else {
      updatedBanners = [...banners, { ...bannerForm }];
    }

    updatedBanners.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    setBanners(updatedBanners);
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    setStats(prev => ({ ...prev, banners: updatedBanners.length }));
    setShowBannerModal(false);
  }, [banners, editingBanner, bannerForm]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays === 1) return 'Kecha';
    if (diffDays < 7) return `${diffDays} kun oldin`;
    return date.toLocaleDateString('uz-UZ');
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Dashboard yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard dark-theme">
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <FiShield className="logo-icon" />
            <h2>Admin<span>Panel</span></h2>
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {adminUser?.avatar ? (
              <img src={adminUser.avatar} alt={adminUser.username} />
            ) : (
              <FiUser />
            )}
          </div>
          <div className="profile-info">
            <span className="profile-name">{adminUser?.username || 'Admin'}</span>
            <span className="profile-email">{adminUser?.email || 'admin@admin.com'}</span>
            <span className="profile-role">Super Admin</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button onClick={() => navigate('/admin/dashboard')} className="nav-item active">
            <FiHome /> Dashboard
          </button>
          <button onClick={() => navigate('/admin/movies')} className="nav-item">
            <FiFilm /> Kinolar
            {stats.movies > 0 && <span className="nav-badge">{stats.movies}</span>}
          </button>
          <button onClick={() => navigate('/admin/users')} className="nav-item">
            <FiUsers /> Foydalanuvchilar
            {stats.users > 0 && <span className="nav-badge">{stats.users}</span>}
          </button>
          <button onClick={() => navigate('/admin/dating')} className="nav-item">
            <FiHeart /> Dating
            {stats.dating > 0 && <span className="nav-badge">{stats.dating}</span>}
          </button>
          <button onClick={() => navigate('/admin/ads')} className="nav-item">
            <FiShoppingBag /> E'lonlar
            {stats.ads > 0 && <span className="nav-badge">{stats.ads}</span>}
          </button>
          <button 
            onClick={() => {
              document.getElementById('banners-section')?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="nav-item"
          >
            <FiImage /> Bannerlar
            {stats.banners > 0 && <span className="nav-badge">{stats.banners}</span>}
          </button>
        </nav>

        <div className="sidebar-notifications">
          <h4>Bildirishnomalar</h4>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <div key={index} className={`notification-item ${notif.type}`}>
                  <FiBell />
                  <span>{notif.text}</span>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <FiBell />
                <span>Bildirishnomalar yo'q</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Xush kelibsiz, <strong>{adminUser?.username || 'Admin'}</strong></p>
          </div>
          
          <div className="header-right">
            <button className="header-btn" title="Yuklab olish">
              <FiDownload />
            </button>
            <button className="header-btn" title="Sozlamalar">
              <FiSettings />
            </button>
            <div className="header-date">
              <FiCalendar />
              <span>
                {new Date().toLocaleDateString('uz-UZ', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card users" onClick={() => navigate('/admin/users')}>
            <div className="stat-icon-wrapper">
              <FiUsers />
            </div>
            <div className="stat-content">
              <span className="stat-label">Foydalanuvchilar</span>
              <span className="stat-value">{stats.users.toLocaleString()}</span>
              <span className="stat-change positive">
                +{Math.floor(stats.users * 0.1)}%
              </span>
            </div>
          </div>

          <div className="stat-card movies" onClick={() => navigate('/admin/movies')}>
            <div className="stat-icon-wrapper">
              <FiFilm />
            </div>
            <div className="stat-content">
              <span className="stat-label">Kinolar</span>
              <span className="stat-value">{stats.movies.toLocaleString()}</span>
              <span className="stat-change">
                {stats.totalViews.toLocaleString()} ko'rish
              </span>
            </div>
          </div>

          <div className="stat-card dating" onClick={() => navigate('/admin/dating')}>
            <div className="stat-icon-wrapper">
              <FiHeart />
            </div>
            <div className="stat-content">
              <span className="stat-label">Dating Profillar</span>
              <span className="stat-value">{stats.dating.toLocaleString()}</span>
              <span className="stat-change positive">
                {stats.totalLikes.toLocaleString()} like
              </span>
            </div>
          </div>

          <div className="stat-card ads" onClick={() => navigate('/admin/ads')}>
            <div className="stat-icon-wrapper">
              <FiShoppingBag />
            </div>
            <div className="stat-content">
              <span className="stat-label">E'lonlar</span>
              <span className="stat-value">{stats.ads.toLocaleString()}</span>
              <span className="stat-change">
                {stats.activeUsers} faol
              </span>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <section id="banners-section" className="dashboard-card banners-section">
          <div className="card-header">
            <div className="header-left">
              <FiImage className="section-icon" />
              <h2>Bannerlar boshqaruvi</h2>
            </div>
            <button onClick={handleAddBanner} className="add-button">
              <FiPlus /> Yangi banner
            </button>
          </div>

          <div className="banners-grid">
            {banners.length > 0 ? (
              banners.map((banner) => (
                <div key={banner.id} className="banner-card">
                  <div className="banner-image">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Rasm+topilmadi';
                      }}
                    />
                    {banner.discount && (
                      <span className="banner-badge">{banner.discount}</span>
                    )}
                    <div className="banner-order">#{banner.order || 0}</div>
                  </div>
                  
                  <div className="banner-details">
                    <h3>{banner.title}</h3>
                    <p>{banner.description || 'Tavsif mavjud emas'}</p>
                    
                    <div className="banner-meta">
                      {banner.link && (
                        <a href={banner.link} target="_blank" rel="noopener noreferrer">
                          <FiGlobe /> {banner.link}
                        </a>
                      )}
                      <span className={`status-badge ${banner.active ? 'active' : 'inactive'}`}>
                        {banner.active ? 'Faol' : 'Faol emas'}
                      </span>
                    </div>

                    <div className="banner-actions">
                      <button 
                        onClick={() => handleEditBanner(banner)}
                        className="action-btn edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="action-btn delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FiImage className="empty-icon" />
                <h3>Bannerlar mavjud emas</h3>
                <p>Birinchi bannerni qo'shish orqali boshlang</p>
                <button onClick={handleAddBanner} className="empty-add-btn">
                  <FiPlus /> Banner qo'shish
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Activity and Stats Grid */}
        <div className="dashboard-grid">
          {/* Recent Activities */}
          <div className="dashboard-card activities-card">
            <div className="card-header">
              <h3>Oxirgi aktiviteler</h3>
              <FiActivity className="card-icon" />
            </div>
            
            <div className="activities-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'movie' ? <FiFilm /> : 
                       activity.type === 'user' ? <FiUsers /> : 
                       <FiImage />}
                    </div>
                    <div className="activity-content">
                      <p>{activity.text}</p>
                      <span className="activity-time">{formatDate(activity.time)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-activities">
                  <p>Aktiviteler yo'q</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <h3>Tezkor statistika</h3>
              <FiBarChart2 className="card-icon" />
            </div>
            
            <div className="quick-stats">
              <div className="stat-item">
                <FiEye className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Ko'rishlar</span>
                  <span className="stat-item-value">{stats.totalViews.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="stat-item">
                <FiStar className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Like'lar</span>
                  <span className="stat-item-value">{stats.totalLikes.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="stat-item">
                <FiUsers className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Faol foydalanuvchilar</span>
                  <span className="stat-item-value">{stats.activeUsers.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="stat-item">
                <FiImage className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Bannerlar</span>
                  <span className="stat-item-value">{stats.banners.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="dashboard-card system-card">
            <div className="card-header">
              <h3>Tizim ma'lumoti</h3>
              <FiZap className="card-icon" />
            </div>
            
            <div className="system-info">
              <div className="info-row">
                <span>Versiya</span>
                <span className="info-value">2.0.0</span>
              </div>
              <div className="info-row">
                <span>Oxirgi yangilanish</span>
                <span className="info-value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span>Admin</span>
                <span className="info-value">{adminUser?.email || 'admin@admin.com'}</span>
              </div>
              <div className="info-row">
                <span>Status</span>
                <span className="info-value status-active">● Aktiv</span>
              </div>
            </div>

            <div className="quick-actions">
              <h4>Tezkor amallar</h4>
              <div className="actions-grid">
                <button onClick={() => navigate('/admin/movies')} className="action-item">
                  <FiFilm /> Kino qo'shish
                </button>
                <button onClick={handleAddBanner} className="action-item">
                  <FiImage /> Banner qo'shish
                </button>
                <button onClick={() => navigate('/admin/users')} className="action-item">
                  <FiUsers /> Foydalanuvchilar
                </button>
                <button onClick={() => navigate('/admin/dating')} className="action-item">
                  <FiHeart /> Dating
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="modal-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
                  type="url"
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({...bannerForm, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {bannerForm.imageUrl && (
                  <div className="image-preview">
                    <img 
                      src={bannerForm.imageUrl} 
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Preview';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sarlavha *</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                    placeholder="Banner sarlavhasi"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Chegirma</label>
                  <input
                    type="text"
                    value={bannerForm.discount}
                    onChange={(e) => setBannerForm({...bannerForm, discount: e.target.value})}
                    placeholder="-20% yoki Bepul"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tavsif</label>
                <textarea
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                  placeholder="Banner haqida qisqacha"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Havola</label>
                  <input
                    type="text"
                    value={bannerForm.link}
                    onChange={(e) => setBannerForm({...bannerForm, link: e.target.value})}
                    placeholder="/kino yoki https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Tartib raqami</label>
                  <input
                    type="number"
                    value={bannerForm.order}
                    onChange={(e) => setBannerForm({...bannerForm, order: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={bannerForm.active}
                    onChange={(e) => setBannerForm({...bannerForm, active: e.target.checked})}
                  />
                  Faol banner
                </label>
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