import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  FiAward, 
  FiHome, 
  FiCompass, 
  FiVideo, 
  FiHeadphones, 
  FiSearch, 
  FiPlus, 
  FiGrid,
  FiMapPin,
  FiClock,
  FiThumbsUp,
  FiShare2,
  FiBookmark,
  FiMoreVertical
} from 'react-icons/fi';
import BannerCarousel from './BannerCarousel';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userCount, setUserCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [notifications, setNotifications] = useState(3);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUserCount(users.length);

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    
    if (!user) {
      navigate('/');
    }

    // Get current path for active tab
    const path = location.pathname;
    if (path === '/') setActiveTab('home');
    else if (path === '/explore') setActiveTab('explore');
    else if (path === '/kino') setActiveTab('kino');
    else if (path === '/music') setActiveTab('music');
    else if (path === '/dating') setActiveTab('dating');
    else if (path === '/elonlar') setActiveTab('elonlar');
    else if (path === '/savollar') setActiveTab('savollar');

    const timer = setTimeout(() => setShowWelcome(false), 3000);
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Scroll event for scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('datingProfiles');
    navigate('/');
  };

  const handleFillProfile = () => {
    navigate('/dating/profile-form');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.header-right')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  // Ekran kengligiga qarab card sonini aniqlash
  const getGridColumns = () => {
    if (windowWidth <= 360) return 1;
    if (windowWidth <= 480) return 2;
    return 3;
  };

  // Navigatsiya funksiyalari
  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
    setShowMenu(false);
  };

  // Featured content
  const featuredContent = [
    { id: 1, title: 'O\'zbek kinolari', image: 'https://via.placeholder.com/150', icon: <FiFilm /> },
    { id: 2, title: 'Trenddagi musiqalar', image: 'https://via.placeholder.com/150', icon: <FiMusic /> },
    { id: 3, title: 'Yangi tanishlar', image: 'https://via.placeholder.com/150', icon: <FiHeart /> },
    { id: 4, title: 'Mashhur e\'lonlar', image: 'https://via.placeholder.com/150', icon: <FiShoppingBag /> }
  ];

  return (
    <div className="main-container">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="welcome-toast">
          <FiStar className="welcome-icon" />
          <span>Xush kelibsiz, {currentUser?.username}!</span>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <FiTrendingUp />
        </button>
      )}

      {/* Header */}
      <header className="main-header">
        <div className="header-left">
          <div className="greeting">
            <span className="greeting-text">{getGreeting()},</span>
            <h1 className="name-title">{currentUser?.username}</h1>
          </div>
          <div className="location-badge">
            <FiMapPin />
            <span>Toshkent</span>
          </div>
        </div>

        <div className="header-right">
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
            aria-label="Menu"
          >
            {showMenu ? <FiX /> : <FiMenu />}
          </button>
          
          {showMenu && (
            <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="user-info-menu">
                <div className="user-avatar">
                  <FiUser />
                </div>
                <div className="user-details">
                  <span className="user-name">{currentUser?.username}</span>
                  <span className="user-email">{currentUser?.email}</span>
                  <span className="user-badge">Premium</span>
                </div>
              </div>
              
              <div className="menu-stats">
                <div className="menu-stat-item">
                  <FiHeart />
                  <span>24</span>
                </div>
                <div className="menu-stat-item">
                  <FiUsers />
                  <span>12</span>
                </div>
                <div className="menu-stat-item">
                  <FiStar />
                  <span>4.8</span>
                </div>
              </div>
              
              <div className="menu-divider"></div>
              
              <button onClick={() => { handleFillProfile(); setShowMenu(false); }} className="menu-item">
                <FiEdit2 /> Profil sozlash
              </button>
              
              <button className="menu-item" onClick={() => navigate('/settings')}>
                <FiSettings /> Sozlamalar
              </button>
              
              <button className="menu-item" onClick={() => navigate('/messages')}>
                <FiMessageCircle /> Xabarlar 
                <span className="menu-badge">2</span>
              </button>

              <button className="menu-item" onClick={() => navigate('/saved')}>
                <FiBookmark /> Saqlanganlar
              </button>
              
              <div className="menu-divider"></div>
              
              <button onClick={handleLogout} className="menu-item logout">
                <FiLogOut /> Chiqish
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Banner Carousel */}
      <BannerCarousel 
        onBannerClick={(banner) => {
          if (banner.link) {
            if (banner.link.startsWith('http')) {
              window.open(banner.link, '_blank');
            } else {
              navigate(banner.link);
            }
          }
        }}
      />

      {/* Stats Cards Row */}
      <div className="stats-row" style={{ gridTemplateColumns: `repeat(${Math.min(3, getGridColumns())}, 1fr)` }}>
        <div className="stats-card small" onClick={() => navigate('/users')}>
          <FiUsers className="stats-icon small" />
          <div className="stats-info">
            <span className="stats-label">Foydalanuvchilar</span>
            <span className="stats-number small">{userCount}</span>
          </div>
        </div>

        <div className="stats-card small" onClick={() => navigate('/dating/matches')}>
          <FiHeart className="stats-icon small" />
          <div className="stats-info">
            <span className="stats-label">Mosliklar</span>
            <span className="stats-number small">24</span>
          </div>
        </div>

        <div className="stats-card small" onClick={() => navigate('/active-now')}>
          <FiTrendingUp className="stats-icon small" />
          <div className="stats-info">
            <span className="stats-label">Hozir online</span>
            <span className="stats-number small">127</span>
          </div>
        </div>
      </div>

      {/* Main Feature Buttons */}
      <div className="main-buttons" style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}>
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

      {/* Featured Section */}
      <div className="featured-section">
        <h3 className="section-title">
          <FiAward className="section-icon" />
          Mashhur kontentlar
        </h3>
        <div className="featured-grid">
          {featuredContent.map(item => (
            <div key={item.id} className="featured-card">
              <div className="featured-image">
                {item.icon}
              </div>
              <span className="featured-title">{item.title}</span>
            </div>
          ))}
        </div>
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
          <button className="action-chip" onClick={() => navigate('/favorites')}>
            <FiHeart /> Tanlanganlar
          </button>
          <button className="action-chip" onClick={() => navigate('/kino/latest')}>
            <FiFilm /> Kinolar
          </button>
          <button className="action-chip" onClick={() => navigate('/friends')}>
            <FiUser /> Do'stlar
          </button>
          <button className="action-chip" onClick={() => navigate('/search')}>
            <FiSearch /> Qidirish
          </button>
          <button className="action-chip" onClick={() => navigate('/trending')}>
            <FiTrendingUp /> Trend
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
            <span className="profile-status">
              {currentUser?.profileCompleted ? 'To\'ldirilgan' : 'To\'ldirilmagan'}
            </span>
          </div>
        </div>
        
        <button onClick={handleFillProfile} className="profile-button">
          <FiEdit2 /> {currentUser?.profileCompleted ? 'Tahrirlash' : 'Anketani to\'ldirish'}
        </button>
        
        <div className="profile-info">
          <p className="info-text">
            <FiStar className="info-icon" />
            Anketa to'ldirilsa, boshqalarning anketalarini ko'rish mumkin
          </p>
        </div>

        <div className="profile-progress">
          <div className="progress-label">
            <span>Profil to'liqligi</span>
            <span>65%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '65%'}}></div>
          </div>
        </div>

        <div className="profile-stats-mini">
          <div className="mini-stat">
            <FiClock />
            <span>2 kun</span>
          </div>
          <div className="mini-stat">
            <FiThumbsUp />
            <span>45</span>
          </div>
          <div className="mini-stat">
            <FiShare2 />
            <span>12</span>
          </div>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="daily-tip">
        <FiStar className="tip-icon" />
        <div className="tip-content">
          <strong>Kunlik maslahat:</strong> Profilingizni to'ldiring va tanishish imkoniyatiga ega bo'ling!
        </div>
      </div>

      {/* Activity Feed */}
      <div className="activity-feed">
        <h3 className="section-title">
          <FiClock className="section-icon" />
          So'nggi faoliyatlar
        </h3>
        <div className="feed-items">
          <div className="feed-item">
            <div className="feed-icon">
              <FiHeart />
            </div>
            <div className="feed-content">
              <span className="feed-text">Sevimli filmingizga like qo'yildi</span>
              <span className="feed-time">5 daqiqa oldin</span>
            </div>
          </div>
          <div className="feed-item">
            <div className="feed-icon">
              <FiMessageCircle />
            </div>
            <div className="feed-content">
              <span className="feed-text">Yangi xabar kelib tushdi</span>
              <span className="feed-time">15 daqiqa oldin</span>
            </div>
          </div>
          <div className="feed-item">
            <div className="feed-icon">
              <FiUser />
            </div>
            <div className="feed-content">
              <span className="feed-text">Yangi obunachi qo'shildi</span>
              <span className="feed-time">1 soat oldin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - iPhone Style (Baland qilingan) */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigation('home', '/')}
        >
          <FiHome className="nav-icon" />
          <span className="nav-label">Bosh sahifa</span>
          {activeTab === 'home' && <span className="nav-indicator"></span>}
        </button>
        
      
        
        <button 
          className={`nav-item ${activeTab === 'dating' ? 'active' : ''}`}
          onClick={() => handleNavigation('dating', '/dating')}
        >
          <FiHeart className="nav-icon" />
          <span className="nav-label">Tanishuv</span>
          {activeTab === 'dating' && <span className="nav-indicator"></span>}
          <span className="nav-badge hot">3</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'kino' ? 'active' : ''}`}
          onClick={() => handleNavigation('kino', '/kino')}
        >
          <FiFilm className="nav-icon" />
          <span className="nav-label">Kinolar</span>
          {activeTab === 'kino' && <span className="nav-indicator"></span>}
          <span className="nav-badge">Yangi</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'music' ? 'active' : ''}`}
          onClick={() => handleNavigation('music', '/music')}
        >
          <FiHeadphones className="nav-icon" />
          <span className="nav-label">Musiqa</span>
          {activeTab === 'music' && <span className="nav-indicator"></span>}
        </button>
      </nav>
    </div>
  );
};

export default MainPage;