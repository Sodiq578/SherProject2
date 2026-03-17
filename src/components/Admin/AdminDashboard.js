import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

import {
  FiFilm, FiUsers, FiShoppingBag, FiHeart,
  FiLogOut, FiMenu, FiHome, FiShield,
  FiCalendar, FiEye, FiDownload, FiSettings,
  FiBell, FiUser, FiImage, FiEdit2,
  FiTrash2, FiPlus, FiX, FiActivity,
  FiBarChart2, FiStar, FiZap, FiGlobe
} from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const mounted = useRef(true);
  const initialized = useRef(false);

  // ✅ SAFE PARSE
  const safeParse = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };

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

  const [banners, setBanners] = useState([]);

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
      const admin =
        JSON.parse(localStorage.getItem('admin')) ||
        JSON.parse(localStorage.getItem('currentUser'));

      if (!admin?.isAdmin) {
        navigate('/admin');
        return;
      }

      setAdminUser(admin);

      const users = safeParse('users');
      const movies = safeParse('movies');
      const dating = safeParse('datingProfiles');
      const ads = safeParse('ads');
      const bannersData = safeParse('banners');

      const totalViews =
        movies.reduce((s, m) => s + (m.views || 0), 0) +
        ads.reduce((s, a) => s + (a.views || 0), 0);

      const totalLikes =
        movies.reduce((s, m) => s + (m.likes || 0), 0) +
        dating.reduce((s, d) => s + (d.likes || 0), 0);

      const activeUsers = users.filter((u) => {
        const last = new Date(u.lastLogin || 0);
        return (Date.now() - last) / 86400000 < 7;
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

      setBanners(
        bannersData.sort((a, b) => (a.order || 0) - (b.order || 0))
      );

      setRecentActivities([
        ...movies.slice(0, 3).map((m) => ({
          text: `Kino: ${m.title}`,
          time: m.createdAt
        })),
        ...users.slice(0, 3).map((u) => ({
          text: `User: ${u.username}`,
          time: u.createdAt
        }))
      ]);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">

      <aside className={sidebarOpen ? 'open' : ''}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FiMenu />
        </button>

        <button onClick={() => navigate('/admin/dashboard')}>
          <FiHome /> Dashboard
        </button>

        <button onClick={() => navigate('/admin/users')}>
          <FiUsers /> Users
        </button>

        <button onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </aside>

      <main>
        <h1>Dashboard</h1>
        <p>Salom {adminUser?.username}</p>

        <div>
          Users: {stats.users} <br />
          Movies: {stats.movies} <br />
          Views: {stats.totalViews}
        </div>

        <h2>Bannerlar</h2>
        {banners.map((b) => (
          <div key={b.id}>
            <img src={b.imageUrl} width="100" alt="" />
            <p>{b.title}</p>
          </div>
        ))}
      </main>

    </div>
  );
};

export default AdminDashboard;