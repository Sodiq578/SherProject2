// src/components/Main/MainPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  FiMessageCircle, 
  FiMusic, 
  FiHome, 
  FiHeadphones,
  FiClock,
  FiThumbsUp,
  FiShare2,
  FiBookmark
} from 'react-icons/fi';
import BannerCarousel from './BannerCarousel';
import LanguageSelector from '../LanguageSelector';
import './MainPage.css';

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [userCount, setUserCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [randomMatches] = useState(() => Math.floor(Math.random() * 200) + 1);
  
  // Notifications soni
  const notifications = 3;

  useEffect(() => {
    // Tilni localStorage dan olish
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

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
    else if (path === '/dating') setActiveTab('dating');
    else if (path === '/kino') setActiveTab('kino');
    else if (path === '/music') setActiveTab('music');

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
    if (hour < 12) return t('morning');
    if (hour < 18) return t('afternoon');
    return t('evening');
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

  return (
    <div className="main-container">
      {/* Language Selector */}
      <LanguageSelector />

      {/* Welcome Animation */}
      {showWelcome && currentUser && (
        <div className="welcome-toast">
          <FiStar className="welcome-icon" />
          <span>{t('welcome', { username: currentUser?.username })}</span>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop} title={t('scrollToTop')}>
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
        </div>

        <div className="header-right">
          <div className="notification-badge" onClick={() => navigate('/notifications')} title={t('notifications')}>
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
                  <span className="user-badge">{t('premium')}</span>
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
                <FiEdit2 /> {t('editProfile')}
              </button>
              
              <button className="menu-item" onClick={() => navigate('/settings')}>
                <FiSettings /> {t('settings')}
              </button>
              
              <button className="menu-item" onClick={() => navigate('/messages')}>
                <FiMessageCircle /> {t('messages')}
                <span className="menu-badge">2</span>
              </button>

              <button className="menu-item" onClick={() => navigate('/saved')}>
                <FiBookmark /> {t('saved')}
              </button>
              
              <div className="menu-divider"></div>
              
              <button onClick={handleLogout} className="menu-item logout">
                <FiLogOut /> {t('logout')}
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
            <span className="stats-label">{t('users')}</span>
            <span className="stats-number small flags">
              <img 
                src="https://flagcdn.com/16x12/uz.png" 
                alt="O'zbekiston" 
                style={{ width: '16px', height: 'auto', marginRight: '4px' }} 
              />
              <img 
                src="https://flagcdn.com/16x12/ru.png" 
                alt="Rossiya" 
                style={{ width: '16px', height: 'auto', marginRight: '4px' }} 
              />
              <img 
                src="https://flagcdn.com/16x12/kz.png" 
                alt="Qozog'iston" 
                style={{ width: '16px', height: 'auto', marginRight: '4px' }} 
              />
              <img 
                src="https://flagcdn.com/16x12/tj.png" 
                alt="Tojikiston" 
                style={{ width: '16px', height: 'auto' }} 
              />
            </span>
          </div>
        </div>

        <div className="stats-card small" onClick={() => navigate('/dating/matches')}>
          <FiHeart className="stats-icon small" />
          <div className="stats-info">
            <span className="stats-label">{t('matches')}</span>
            <span className="stats-number small">{randomMatches}</span>
          </div>
        </div>
      </div>

      {/* Main Feature Buttons */}
      <div className="main-buttons">
        <button 
          onClick={() => navigate('/kino')} 
          className="main-button kino active-button"
        >
          <div className="button-glow"></div>
          <FiFilm className="button-icon" />
          <span className="button-text">{t('cinema')}</span>
          <span className="button-badge">{t('new')}</span>
        </button>
        
        <button 
          className="main-button dating disabled-button"
          disabled
        >
          <div className="button-glow"></div>
          <FiHeart className="button-icon" />
          <span className="button-text">{t('dating')}</span>
          <span className="button-badge hot">{t('hot')}</span>
          <span className="coming-soon">{t('comingSoon')}</span>
        </button>
        
        <button 
          className="main-button elon disabled-button"
          disabled
        >
          <div className="button-glow"></div>
          <FiShoppingBag className="button-icon" />
          <span className="button-text">{t('ads')}</span>
          <span className="button-badge">{t('plus', { count: 5 })}</span>
          <span className="coming-soon">{t('comingSoon')}</span>
        </button>

        <button 
          className="main-button savollar disabled-button"
          disabled
        >
          <div className="button-glow"></div>
          <FiMessageCircle className="button-icon" />
          <span className="button-text">{t('questions')}</span>
          <span className="coming-soon">{t('comingSoon')}</span>
        </button>

        <button 
          className="main-button music disabled-button"
          disabled
        >
          <div className="button-glow"></div>
          <FiMusic className="button-icon" />
          <span className="button-text">{t('music')}</span>
          <span className="coming-soon">{t('comingSoon')}</span>
        </button>
      </div>
 
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div className="profile-title">
            <h3>{t('myProfile')}</h3>
            <span className="profile-status">
              {currentUser?.profileCompleted ? t('completed') : t('notCompleted')}
            </span>
          </div>
        </div>
        
        <button onClick={handleFillProfile} className="profile-button">
          <FiEdit2 /> {currentUser?.profileCompleted ? t('edit') : t('fillProfile')}
        </button>
        
        <div className="profile-info">
          <p className="info-text">
            <FiStar className="info-icon" />
            {t('profileInfo')}
          </p>
        </div>

        <div className="profile-progress">
          <div className="progress-label">
            <span>{t('profileCompleteness')}</span>
            <span>65%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '65%'}}></div>
          </div>
        </div>

        <div className="profile-stats-mini">
          <div className="mini-stat">
            <FiClock />
            <span>{t('days', { count: 2 })}</span>
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
          <strong>{t('dailyTip')}</strong> {t('tipText')}
        </div>
      </div>

      {/* Bottom Navigation - iPhone Style */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigation('home', '/')}
        >
          <FiHome className="nav-icon" />
          <span className="nav-label">{t('home')}</span>
          {activeTab === 'home' && <span className="nav-indicator"></span>}
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'dating' ? 'active' : ''} disabled-nav-item`}
          disabled
        >
          <FiHeart className="nav-icon" />
          <span className="nav-label">{t('dating')}</span>
          {activeTab === 'dating' && <span className="nav-indicator"></span>}
          <span className="nav-badge hot">3</span>
          <span className="nav-coming-soon">{t('comingSoon')}</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'kino' ? 'active' : ''}`}
          onClick={() => handleNavigation('kino', '/kino')}
        >
          <FiFilm className="nav-icon" />
          <span className="nav-label">{t('cinema')}</span>
          {activeTab === 'kino' && <span className="nav-indicator"></span>}
          <span className="nav-badge">{t('new')}</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'music' ? 'active' : ''} disabled-nav-item`}
          disabled
        >
          <FiHeadphones className="nav-icon" />
          <span className="nav-label">{t('music')}</span>
          {activeTab === 'music' && <span className="nav-indicator"></span>}
          <span className="nav-coming-soon">{t('comingSoon')}</span>
        </button>
      </nav>
    </div>
  );
};

export default MainPage;