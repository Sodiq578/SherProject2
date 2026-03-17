import {
  FiFilm,
  FiUsers,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiHome,
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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const initialized = useRef(false);

  // Holatlar (states)
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

  // Banner bilan bog‘liq holatlar
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

  // Ma'lumotlarni yuklash (bir marta)
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
          text: `Yangi kino qo'shildi: ${m.title}`,
          time: m.createdAt || new Date().toISOString(),
        })),
        ...users.slice(0, 3).map(u => ({
          type: 'user',
          text: `Yangi foydalanuvchi: ${u.username}`,
          time: u.createdAt || new Date().toISOString(),
        })),
        ...banners.slice(0, 2).map(b => ({
          type: 'banner',
          text: `Yangi banner: ${b.title}`,
          time: b.createdAt || new Date().toISOString(),
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 7);

      setRecentActivities(activities);

      const notifs = [];
      if (movies.length === 0) {
        notifs.push({ type: 'warning', text: 'Hozircha hech qanday kino qo‘shilmagan' });
      }
      if (banners.length === 0) {
        notifs.push({ type: 'info', text: 'Bannerlar hali qo‘shilmagan' });
      }
      setNotifications(notifs);

    } catch (error) {
      console.error('Dashboard ma‘lumotlarini yuklashda xato:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    if (window.confirm('Haqiqatan ham chiqmoqchimisiz?')) {
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
    setBannerForm({ ...banner });
    setShowBannerModal(true);
  }, []);

  const handleDeleteBanner = useCallback((bannerId) => {
    if (window.confirm('Bu bannerni o‘chirishni xohlaysizmi?')) {
      const updatedBanners = banners.filter(b => b.id !== bannerId);
      setBanners(updatedBanners);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      setStats(prev => ({ ...prev, banners: updatedBanners.length }));
    }
  }, [banners]);

  const handleSaveBanner = useCallback((e) => {
    e.preventDefault();

    if (!bannerForm.imageUrl || !bannerForm.title) {
      alert('Rasm URL va sarlavha majburiy maydonlar!');
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
      {/* Mobil qurilmalar uchun overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Yon panel (Sidebar) */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <FiShield className="logo-icon" />
            <h2>Admin<span>Paneli</span></h2>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
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
            <span className="profile-email">{adminUser?.email || 'admin@admin.uz'}</span>
            <span className="profile-role">Super Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate('/admin/dashboard')} className="nav-item active">
            <FiHome /> Bosh sahifa
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
            onClick={() => document.getElementById('banners-section')?.scrollIntoView({ behavior: 'smooth' })}
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
                <span>Hozircha bildirishnoma yo‘q</span>
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

      {/* Asosiy kontent */}
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <div className="header-left">
            <h1>Boshqaruv paneli</h1>
            <p>Xush kelibsiz, <strong>{adminUser?.username || 'Admin'}</strong></p>
          </div>

          <div className="header-right">
            <button className="header-btn" title="Ma'lumotlarni yuklab olish">
              <FiDownload />
            </button>
            <button className="header-btn" title="Sozlamalar">
              <FiSettings />
            </button>
            <div className="header-date">
              <FiCalendar />
              <span>{new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Statistika kartalari */}
        <div className="stats-grid">
          <div className="stat-card users" onClick={() => navigate('/admin/users')}>
            <div className="stat-icon-wrapper"><FiUsers /></div>
            <div className="stat-content">
              <span className="stat-label">Foydalanuvchilar</span>
              <span className="stat-value">{stats.users.toLocaleString()}</span>
              <span className="stat-change positive">+{Math.floor(stats.users * 0.1)}%</span>
            </div>
          </div>

          <div className="stat-card movies" onClick={() => navigate('/admin/movies')}>
            <div className="stat-icon-wrapper"><FiFilm /></div>
            <div className="stat-content">
              <span className="stat-label">Kinolar</span>
              <span className="stat-value">{stats.movies.toLocaleString()}</span>
              <span className="stat-change">{stats.totalViews.toLocaleString()} ta ko‘rish</span>
            </div>
          </div>

          <div className="stat-card dating" onClick={() => navigate('/admin/dating')}>
            <div className="stat-icon-wrapper"><FiHeart /></div>
            <div className="stat-content">
              <span className="stat-label">Dating profillar</span>
              <span className="stat-value">{stats.dating.toLocaleString()}</span>
              <span className="stat-change positive">{stats.totalLikes.toLocaleString()} ta like</span>
            </div>
          </div>

          <div className="stat-card ads" onClick={() => navigate('/admin/ads')}>
            <div className="stat-icon-wrapper"><FiShoppingBag /></div>
            <div className="stat-content">
              <span className="stat-label">E'lonlar</span>
              <span className="stat-value">{stats.ads.toLocaleString()}</span>
              <span className="stat-change">{stats.activeUsers} ta faol</span>
            </div>
          </div>
        </div>

        {/* Bannerlar bo‘limi */}
        <section id="banners-section" className="dashboard-card banners-section">
          <div className="card-header">
            <div className="header-left">
              <FiImage className="section-icon" />
              <h2>Bannerlarni boshqarish</h2>
            </div>
            <button onClick={handleAddBanner} className="add-button">
              <FiPlus /> Yangi banner qo‘shish
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
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Rasm+topilmadi'; }}
                    />
                    {banner.discount && <span className="banner-badge">{banner.discount}</span>}
                    <div className="banner-order">#{banner.order || 0}</div>
                  </div>

                  <div className="banner-details">
                    <h3>{banner.title}</h3>
                    <p>{banner.description || 'Tavsif kiritilmagan'}</p>

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
                      <button onClick={() => handleEditBanner(banner)} className="action-btn edit">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDeleteBanner(banner.id)} className="action-btn delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FiImage className="empty-icon" />
                <h3>Bannerlar hali yo‘q</h3>
                <p>Birinchi bannerni hozir qo‘shing</p>
                <button onClick={handleAddBanner} className="empty-add-btn">
                  <FiPlus /> Banner qo‘shish
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Faoliyat va qo‘shimcha statistika */}
        <div className="dashboard-grid">
          {/* Oxirgi faoliyatlar */}
          <div className="dashboard-card activities-card">
            <div className="card-header">
              <h3>Oxirgi faoliyatlar</h3>
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
                  <p>Hozircha faoliyat yo‘q</p>
                </div>
              )}
            </div>
          </div>

          {/* Tezkor statistika */}
          <div className="dashboard-card stats-card">
            <div className="card-header">
              <h3>Tezkor statistika</h3>
              <FiBarChart2 className="card-icon" />
            </div>

            <div className="quick-stats">
              <div className="stat-item">
                <FiEye className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Umumiy ko‘rishlar</span>
                  <span className="stat-item-value">{stats.totalViews.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-item">
                <FiStar className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Umumiy like'lar</span>
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
                  <span className="stat-item-label">Bannerlar soni</span>
                  <span className="stat-item-value">{stats.banners.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tizim ma'lumotlari */}
          <div className="dashboard-card system-card">
            <div className="card-header">
              <h3>Tizim haqida</h3>
              <FiZap className="card-icon" />
            </div>

            <div className="system-info">
              <div className="info-row">
                <span>Versiya</span>
                <span className="info-value">2.0.0</span>
              </div>
              <div className="info-row">
                <span>Oxirgi yangilanish</span>
                <span className="info-value">{new Date().toLocaleDateString('uz-UZ')}</span>
              </div>
              <div className="info-row">
                <span>Admin</span>
                <span className="info-value">{adminUser?.email || 'admin@admin.uz'}</span>
              </div>
              <div className="info-row">
                <span>Holati</span>
                <span className="info-value status-active">● Faol</span>
              </div>
            </div>

            <div className="quick-actions">
              <h4>Tezkor harakatlar</h4>
              <div className="actions-grid">
                <button onClick={() => navigate('/admin/movies')} className="action-item">
                  <FiFilm /> Kino qo‘shish
                </button>
                <button onClick={handleAddBanner} className="action-item">
                  <FiImage /> Banner qo‘shish
                </button>
                <button onClick={() => navigate('/admin/users')} className="action-item">
                  <FiUsers /> Foydalanuvchilar
                </button>
                <button onClick={() => navigate('/admin/dating')} className="action-item">
                  <FiHeart /> Dating bo‘limi
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Banner qo‘shish/tahrirlash oynasi (Modal) */}
      {showBannerModal && (
        <div className="modal-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner qo‘shish'}</h3>
              <button className="close-btn" onClick={() => setShowBannerModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveBanner}>
              <div className="form-group">
                <label>Rasm manzili (URL) *</label>
                <input
                  type="url"
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="https://misol.com/rasm.jpg"
                  required
                />
                {bannerForm.imageUrl && (
                  <div className="image-preview">
                    <img
                      src={bannerForm.imageUrl}
                      alt="Oldindan ko‘rish"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Oldindan+ko‘rish'; }}
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
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="Banner sarlavhasi"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Chegirma / aksiya</label>
                  <input
                    type="text"
                    value={bannerForm.discount}
                    onChange={(e) => setBannerForm({ ...bannerForm, discount: e.target.value })}
                    placeholder="-30% yoki Bepul kirish"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Qisqacha tavsif</label>
                <textarea
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  placeholder="Banner haqida qisqa ma'lumot..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Havola (link)</label>
                  <input
                    type="text"
                    value={bannerForm.link}
                    onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                    placeholder="/kino/123 yoki https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Tartib raqami</label>
                  <input
                    type="number"
                    value={bannerForm.order}
                    onChange={(e) => setBannerForm({ ...bannerForm, order: parseInt(e.target.value) || 0 })}
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
                    onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                  />
                  Banner faol (ko‘rinadi)
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowBannerModal(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="save-btn">
                  {editingBanner ? 'Saqlash' : 'Qo‘shish'}
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