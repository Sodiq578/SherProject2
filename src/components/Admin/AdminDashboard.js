// src/components/Admin/AdminDashboard.js
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

  // Asosiy statistika holatlari
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

  // Banner boshqaruvi holatlari
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

  // Dashboard ma'lumotlarini yuklash (bir marta ishlaydi)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadDashboardData();
    }

    return () => {
      mounted.current = false;
    };
  }, [loadDashboardData]); // exhaustive-deps xatosi tuzatildi

  const loadDashboardData = useCallback(() => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin')) ||
                    JSON.parse(localStorage.getItem('currentUser'));

      if (!admin || !admin.isAdmin) {
        navigate('/admin');
        return;
      }

      setAdminUser(admin);

      // LocalStorage dan ma'lumotlarni olish
      const users        = JSON.parse(localStorage.getItem('users')        || '[]');
      const movies       = JSON.parse(localStorage.getItem('movies')       || '[]');
      const dating       = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
      const ads          = JSON.parse(localStorage.getItem('ads')          || '[]');
      const bannersData  = JSON.parse(localStorage.getItem('banners')      || '[]');

      // Hisob-kitoblar
      const totalViews = movies.reduce((sum, m) => sum + (m.views || 0), 0) +
                         ads.reduce((sum, a) => sum + (a.views || 0), 0);

      const totalLikes = movies.reduce((sum, m) => sum + (m.likes || 0), 0) +
                         dating.reduce((sum, d) => sum + (d.likes || 0), 0);

      const activeUsers = users.filter(u => {
        if (!u.lastLogin) return false;
        const lastLogin = new Date(u.lastLogin);
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
        banners: bannersData.length,
        totalLikes,
        activeUsers
      });

      // Bannerlarni tartiblash
      setBanners(bannersData.sort((a, b) => (a.order || 0) - (b.order || 0)));

      // Oxirgi faoliyatlar (activities)
      const activities = [
        ...movies.slice(0, 3).map(m => ({
          type: 'movie',
          text: `Yangi kino qoshildi: ${m.title || 'Nomalum'}`,
          time: m.createdAt || new Date().toISOString()
        })),
        ...users.slice(0, 3).map(u => ({
          type: 'user',
          text: `Yangi foydalanuvchi: ${u.username || 'Nomalum'}`,
          time: u.createdAt || new Date().toISOString()
        })),
        ...bannersData.slice(0, 2).map(b => ({
          type: 'banner',
          text: `Yangi banner: ${b.title || 'Nomalum'}`,
          time: b.createdAt || new Date().toISOString()
        }))
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 7);

      setRecentActivities(activities);

      // Bildirishnomalar
      const notifs = [];
      if (movies.length === 0) {
        notifs.push({ type: 'warning', text: 'Hozircha hech qanday kino qo‘shilmagan' });
      }
      if (bannersData.length === 0) {
        notifs.push({ type: 'info', text: 'Bannerlar hali qo‘shilmagan' });
      }
      setNotifications(notifs);

    } catch (error) {
      console.error('Dashboard ma‘lumotlarini yuklashda xato yuz berdi:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    if (window.confirm('Haqiqatan ham tizimdan chiqmoqchimisiz?')) {
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
    if (window.confirm('Bu bannerni o‘chirishni xohlaysizmi? Ushbu amal qaytarib bo‘lmaydi.')) {
      const updated = banners.filter(b => b.id !== bannerId);
      setBanners(updated);
      localStorage.setItem('banners', JSON.stringify(updated));
      setStats(prev => ({ ...prev, banners: updated.length }));
    }
  }, [banners]);

  const handleSaveBanner = useCallback((e) => {
    e.preventDefault();

    if (!bannerForm.imageUrl.trim() || !bannerForm.title.trim()) {
      alert('Rasm manzili va sarlavha majburiy maydonlar!');
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
    const diffMs = Math.abs(now - date);
    const diffMin = Math.ceil(diffMs / (1000 * 60));
    const diffHour = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 60) return `${diffMin} daqiqa oldin`;
    if (diffHour < 24) return `${diffHour} soat oldin`;
    if (diffDay === 1) return 'Kecha';
    if (diffDay < 7) return `${diffDay} kun oldin`;
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard dark-theme">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Yon panel */}
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
            <FiFilm /> Kinolar {stats.movies > 0 && <span className="nav-badge">{stats.movies}</span>}
          </button>
          <button onClick={() => navigate('/admin/users')} className="nav-item">
            <FiUsers /> Foydalanuvchilar {stats.users > 0 && <span className="nav-badge">{stats.users}</span>}
          </button>
          <button onClick={() => navigate('/admin/dating')} className="nav-item">
            <FiHeart /> Dating {stats.dating > 0 && <span className="nav-badge">{stats.dating}</span>}
          </button>
          <button onClick={() => navigate('/admin/ads')} className="nav-item">
            <FiShoppingBag /> E'lonlar {stats.ads > 0 && <span className="nav-badge">{stats.ads}</span>}
          </button>
          <button
            onClick={() => document.getElementById('banners-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="nav-item"
          >
            <FiImage /> Bannerlar {stats.banners > 0 && <span className="nav-badge">{stats.banners}</span>}
          </button>
        </nav>

        <div className="sidebar-notifications">
          <h4>Bildirishnomalar</h4>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notif, i) => (
                <div key={i} className={`notification-item ${notif.type}`}>
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
            <button className="header-btn" title="Ma'lumotlarni yuklab olish"><FiDownload /></button>
            <button className="header-btn" title="Sozlamalar"><FiSettings /></button>
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
              <span className="stat-value">{stats.users.toLocaleString('uz-UZ')}</span>
              <span className="stat-change positive">+{Math.floor(stats.users * 0.1)}%</span>
            </div>
          </div>

          <div className="stat-card movies" onClick={() => navigate('/admin/movies')}>
            <div className="stat-icon-wrapper"><FiFilm /></div>
            <div className="stat-content">
              <span className="stat-label">Kinolar</span>
              <span className="stat-value">{stats.movies.toLocaleString('uz-UZ')}</span>
              <span className="stat-change">{stats.totalViews.toLocaleString('uz-UZ')} ko‘rish</span>
            </div>
          </div>

          <div className="stat-card dating" onClick={() => navigate('/admin/dating')}>
            <div className="stat-icon-wrapper"><FiHeart /></div>
            <div className="stat-content">
              <span className="stat-label">Dating profillar</span>
              <span className="stat-value">{stats.dating.toLocaleString('uz-UZ')}</span>
              <span className="stat-change positive">{stats.totalLikes.toLocaleString('uz-UZ')} like</span>
            </div>
          </div>

          <div className="stat-card ads" onClick={() => navigate('/admin/ads')}>
            <div className="stat-icon-wrapper"><FiShoppingBag /></div>
            <div className="stat-content">
              <span className="stat-label">E'lonlar</span>
              <span className="stat-value">{stats.ads.toLocaleString('uz-UZ')}</span>
              <span className="stat-change">{stats.activeUsers.toLocaleString('uz-UZ')} faol</span>
            </div>
          </div>
        </div>

        {/* Bannerlar bo'limi */}
        <section id="banners-section" className="dashboard-card banners-section">
          <div className="card-header">
            <div className="header-left">
              <FiImage className="section-icon" />
              <h2>Bannerlarni boshqarish</h2>
            </div>
            <button onClick={handleAddBanner} className="add-button">
              <FiPlus /> Yangi banner
            </button>
          </div>

          <div className="banners-grid">
            {banners.length > 0 ? banners.map(banner => (
              <div key={banner.id} className="banner-card">
                <div className="banner-image">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    onError={e => e.target.src = 'https://via.placeholder.com/300x200?text=Rasm+topilmadi'}
                  />
                  {banner.discount && <span className="banner-badge">{banner.discount}</span>}
                  <div className="banner-order">#{banner.order || 0}</div>
                </div>

                <div className="banner-details">
                  <h3>{banner.title}</h3>
                  <p>{banner.description || 'Tavsif mavjud emas'}</p>

                  <div className="banner-meta">
                    {banner.link && (
                      <a href={banner.link} target="_blank" rel="noopener noreferrer">
                        <FiGlobe /> Havola
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
            )) : (
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

        {/* Faoliyat va qo'shimcha statistika */}
        <div className="dashboard-grid">
          <div className="dashboard-card activities-card">
            <div className="card-header">
              <h3>Oxirgi faoliyatlar</h3>
              <FiActivity className="card-icon" />
            </div>
            <div className="activities-list">
              {recentActivities.length > 0 ? recentActivities.map((act, i) => (
                <div key={i} className={`activity-item ${act.type}`}>
                  <div className="activity-icon">
                    {act.type === 'movie' ? <FiFilm /> :
                     act.type === 'user'  ? <FiUsers /> :
                     <FiImage />}
                  </div>
                  <div className="activity-content">
                    <p>{act.text}</p>
                    <span className="activity-time">{formatDate(act.time)}</span>
                  </div>
                </div>
              )) : (
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
                  <span className="stat-item-label">Ko'rishlar</span>
                  <span className="stat-item-value">{stats.totalViews.toLocaleString('uz-UZ')}</span>
                </div>
              </div>
              <div className="stat-item">
                <FiStar className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Like'lar</span>
                  <span className="stat-item-value">{stats.totalLikes.toLocaleString('uz-UZ')}</span>
                </div>
              </div>
              <div className="stat-item">
                <FiUsers className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Faol foydalanuvchilar</span>
                  <span className="stat-item-value">{stats.activeUsers.toLocaleString('uz-UZ')}</span>
                </div>
              </div>
              <div className="stat-item">
                <FiImage className="stat-item-icon" />
                <div className="stat-item-content">
                  <span className="stat-item-label">Bannerlar</span>
                  <span className="stat-item-value">{stats.banners.toLocaleString('uz-UZ')}</span>
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
              <div className="info-row"><span>Versiya</span><span className="info-value">2.0.0</span></div>
              <div className="info-row"><span>Oxirgi yangilanish</span><span className="info-value">{new Date().toLocaleDateString('uz-UZ')}</span></div>
              <div className="info-row"><span>Admin</span><span className="info-value">{adminUser?.email || 'admin@admin.uz'}</span></div>
              <div className="info-row"><span>Holati</span><span className="info-value status-active">● Faol</span></div>
            </div>

            <div className="quick-actions">
              <h4>Tezkor harakatlar</h4>
              <div className="actions-grid">
                <button onClick={() => navigate('/admin/movies')} className="action-item"><FiFilm /> Kino qo‘shish</button>
                <button onClick={handleAddBanner} className="action-item"><FiImage /> Banner qo‘shish</button>
                <button onClick={() => navigate('/admin/users')} className="action-item"><FiUsers /> Foydalanuvchilar</button>
                <button onClick={() => navigate('/admin/dating')} className="action-item"><FiHeart /> Dating</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Banner qo'shish / tahrirlash oynasi */}
      {showBannerModal && (
        <div className="modal-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner qo‘shish'}</h3>
              <button className="close-btn" onClick={() => setShowBannerModal(false)}><FiX /></button>
            </div>

            <form onSubmit={handleSaveBanner}>
              <div className="form-group">
                <label>Rasm manzili (URL) *</label>
                <input
                  type="url"
                  value={bannerForm.imageUrl}
                  onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})}
                  placeholder="https://misol.com/rasm.jpg"
                  required
                />
                {bannerForm.imageUrl && (
                  <div className="image-preview">
                    <img
                      src={bannerForm.imageUrl}
                      alt="Oldindan ko‘rish"
                      onError={e => e.target.src = 'https://via.placeholder.com/300x200?text=Oldindan+ko‘rish'}
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
                    onChange={e => setBannerForm({...bannerForm, title: e.target.value})}
                    placeholder="Banner sarlavhasi"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Chegirma / aksiya</label>
                  <input
                    type="text"
                    value={bannerForm.discount}
                    onChange={e => setBannerForm({...bannerForm, discount: e.target.value})}
                    placeholder="-30% yoki Bepul"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Qisqacha tavsif</label>
                <textarea
                  value={bannerForm.description}
                  onChange={e => setBannerForm({...bannerForm, description: e.target.value})}
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
                    onChange={e => setBannerForm({...bannerForm, link: e.target.value})}
                    placeholder="/kino/123 yoki https://..."
                  />
                </div>
                <div className="form-group">
                  <label>Tartib raqami</label>
                  <input
                    type="number"
                    value={bannerForm.order}
                    onChange={e => setBannerForm({...bannerForm, order: Number(e.target.value) || 0})}
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
                    onChange={e => setBannerForm({...bannerForm, active: e.target.checked})}
                  />
                  Banner faol (saytda ko‘rinadi)
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