import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLogOut, 
  FiFilm, 
  FiHeart, 
  FiShoppingBag,
  FiUser,
  FiUsers,
  FiEdit2,
  FiMenu,
  FiX,
  FiSettings,
  FiBell,
  FiStar,
  FiTrendingUp,
  FiCalendar,
  FiMessageCircle,
  FiMusic,
  FiCamera,
  FiGift,
  FiAward
} from 'react-icons/fi';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [recentActivities, setRecentActivities] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUserCount(users.length);

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    
    if (!user) {
      navigate('/');
    }

    // Soxta aktivliklar
    setRecentActivities([
      { id: 1, text: 'Yangi kino qo\'shildi: "Dune 2"', time: '5 min', icon: '🎬' },
      { id: 2, text: 'Datingda 3 ta yangi profil', time: '15 min', icon: '💕' },
      { id: 3, text: 'E\'lonlar bo\'limida 5 ta yangi e\'lon', time: '30 min', icon: '📦' },
    ]);

    // Welcome xabarni 3 sekundan keyin yopish
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('datingProfiles');
    navigate('/');
  };

  const handleFillProfile = () => {
    navigate('/dating/profile-form');
  };

  // Menu yopish uchun
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-right')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Kun vaqtiga qarab greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  return (
    <div className="main-container">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="welcome-toast">
          <FiStar className="welcome-icon" />
          <span>Xush kelibsiz, {currentUser?.username}!</span>
        </div>
      )}

      {/* Header */}
      <div className="main-header">
        <div className="header-left">
          <div className="greeting">
            <span className="greeting-text">{getGreeting()},</span>
            <h1 className='name-title'>{currentUser?.username}</h1>
          </div>
        </div>
        
    

        <div className="header-right">
          {/* Notification Bell */}
          <div className="notification-badge" onClick={() => navigate('/notifications')}>
            <FiBell />
            {notifications > 0 && <span className="badge">{notifications}</span>}
          </div>

          <button 
            className="menu-button" 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            {showMenu ? <FiX /> : <FiMenu />}
          </button>
          
          {/* Burger menu */}
          {showMenu && (
            <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="user-info-menu">
                <div className="user-avatar">
                  <FiUser />
                </div>
                <div className="user-details">
                  <span className="user-name">{currentUser?.username}</span>
                  <span className="user-email">{currentUser?.email}</span>
                  <span className="user-badge">Premium Foydalanuvchi</span>
                </div>
              </div>
              
              <div className="menu-stats">
                <div className="menu-stat-item">
                  <FiAward />
                  <span>Level 5</span>
                </div>
                <div className="menu-stat-item">
                  <FiStar />
                  <span>250 ball</span>
                </div>
              </div>
              
              <div className="menu-divider"></div>
              
              <button 
                onClick={() => {
                  handleFillProfile();
                  setShowMenu(false);
                }} 
                className="menu-item"
              >
                <FiEdit2 /> Profil sozlash
              </button>
              
              <button className="menu-item">
                <FiSettings /> Sozlamalar
              </button>
              
              <button className="menu-item">
                <FiMessageCircle /> Xabarlar <span className="menu-badge">2</span>
              </button>
              
              <div className="menu-divider"></div>
              
              <button 
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }} 
                className="menu-item logout"
              >
                <FiLogOut /> Chiqish
              </button>
            </div>
          )}
        </div>
      </div>


  <div className="banner-reklama">
       <img src="https://plus.unsplash.com/premium_photo-1682681903841-1f98ce6a1175?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRyaW5rfGVufDB8fDB8fHww" alt="" />
      </div>
      {/* Stats Cards Row */}
      <div className="stats-row">
        <div className="stats-card small">
          <FiUsers className="stats-icon small" />
          <div className="stats-info">
            <span className="stats-label">Foydalanuvchilar</span>
            <span className="stats-number small">{userCount}</span>
          </div>
        </div>

        <div className="stats-card small">
          <FiTrendingUp className="stats-icon small" />
          <div className="stats-info">
            <span className="stats-label">Online</span>
            <span className="stats-number small">24</span>
          </div>
        </div>

        <div className="stats-card small">
          <FiCalendar className="stats-icon small" />
          <div className="stats-info">
            <span className="stats-label">Kunlik</span>
            <span className="stats-number small">156</span>
          </div>
        </div>
      </div>

      {/* Main Feature Buttons */}
      <div className="main-buttons">
        <button onClick={() => navigate('/kino')} className="main-button kino">
          <div className="button-glow"></div>
          <FiFilm className="button-icon" />
          <span className="button-text">Kino</span>
          <span className="button-badge">Yangi</span>
        </button>
        
        <button onClick={() => navigate('/dating')} className="main-button dating">
          <div className="button-glow"></div>
          <FiHeart className="button-icon" />
          <span className="button-text">Dating</span>
          <span className="button-badge hot">Trend</span>
        </button>
        
        <button onClick={() => navigate('/elonlar')} className="main-button elon">
          <div className="button-glow"></div>
          <FiShoppingBag className="button-icon" />
          <span className="button-text">E'lonlar</span>
          <span className="button-badge">+5</span>
        </button>

        <button onClick={() => navigate('/savollar')} className="main-button savollar">
          <div className="button-glow"></div>
          <FiMessageCircle className="button-icon" />
          <span className="button-text">Savollar</span>
        </button>

        <button onClick={() => navigate('/music')} className="main-button music">
          <div className="button-glow"></div>
          <FiMusic className="button-icon" />
          <span className="button-text">Musiqa</span>
        </button>

        <button onClick={() => navigate('/gallery')} className="main-button gallery">
          <div className="button-glow"></div>
          <FiCamera className="button-icon" />
          <span className="button-text">Gallery</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">
          <FiGift className="section-icon" />
          Tezkor amallar
        </h3>
        <div className="action-chips">
          <button className="action-chip" onClick={handleFillProfile}>
            <FiEdit2 /> Anketa
          </button>
          <button className="action-chip">
            <FiHeart /> Tanlanganlar
          </button>
          <button className="action-chip">
            <FiFilm /> Kinolar
          </button>
          <button className="action-chip">
            <FiUser /> Do'stlar
          </button>
        </div>
      </div>

     

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div className="profile-title">
            <h3>Mening profilim</h3>
            <span className="profile-status">Anketa {currentUser?.profileCompleted ? 'to\'ldirilgan' : 'to\'ldirilmagan'}</span>
          </div>
        </div>
        
        <button onClick={handleFillProfile} className="profile-button">
          <FiEdit2 /> {currentUser?.profileCompleted ? 'Profilni tahrirlash' : 'Anketani to\'ldirish'}
        </button>
        
        <div className="profile-info">
          <p className="info-text">
            <FiStar className="info-icon" />
            Anketa to'ldirilsa, boshqalarning anketalarini ko'rish va ular bilan tanishish mumkin
          </p>
       
        </div>

        {/* Progress Bar */}
        <div className="profile-progress">
          <div className="progress-label">
            <span>Profil to'liqligi</span>
            <span>65%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '65%'}}></div>
          </div>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="daily-tip">
        <FiStar className="tip-icon" />
        <div className="tip-content">
          <strong>Kunlik maslahat:</strong> Profilingizni to'ldiring va boshqa foydalanuvchilar bilan tanishish imkoniyatiga ega bo'ling!
        </div>
      </div>
    </div>
  );
};

export default MainPage;