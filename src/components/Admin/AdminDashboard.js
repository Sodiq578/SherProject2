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
  FiUser
} from 'react-icons/fi'; // FiStar olib tashlandi
import './Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    dating: 0,
    ads: 0,
    totalViews: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

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

    // Kinolardan umumiy ko'rishlar soni
    const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);

    setStats({
      users: users.length,
      movies: movies.length,
      dating: dating.length,
      ads: ads.length,
      totalViews
    });

    // Oxirgi aktiviteler
    const activities = [
      ...movies.slice(0, 3).map(m => ({ type: 'movie', text: `Yangi kino: ${m.title}`, time: m.createdAt })),
      ...users.slice(0, 3).map(u => ({ type: 'user', text: `Yangi foydalanuvchi: ${u.username}`, time: new Date().toISOString() })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

    setRecentActivities(activities);

    // Bildirishnomalar
    if (movies.length === 0) {
      setNotifications([{ type: 'warning', text: 'Hali kinolar qo\'shilmagan' }]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin');
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
                      {activity.type === 'movie' ? <FiFilm /> : <FiUsers />}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;