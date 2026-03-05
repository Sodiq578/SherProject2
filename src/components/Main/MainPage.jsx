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
  FiAward,
  FiHome,
  FiCompass,
  FiVideo,
  FiHeadphones
} from 'react-icons/fi';
import BannerCarousel from './BannerCarousel';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUserCount(users.length);

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    
    if (!user) {
      navigate('/');
    }

    const timer = setTimeout(() => setShowWelcome(false), 3000);
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('datingProfiles');
    navigate('/');
  };

  const handleFillProfile = () => {
    navigate('/dating/profile-form');
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
      <header className="main-header">
        <div className="header-left">
          <div className="greeting">
            <span className="greeting-text">{getGreeting()},</span>
            <h1 className="name-title">{currentUser?.username}</h1>
          </div>
        </div>

        <div className="header-right">
          <div className="notification-badge" onClick={() => navigate('/notifications')}>
            <FiBell />
            <span className="badge">3</span>
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
                   
                </div>
              </div>
              
              
              
              <div className="menu-divider"></div>
              
              <button onClick={() => { handleFillProfile(); setShowMenu(false); }} className="menu-item">
                <FiEdit2 /> Profil sozlash
              </button>
              
              <button className="menu-item">
                <FiSettings /> Sozlamalar
              </button>
              
              <button className="menu-item">
                <FiMessageCircle /> Xabarlar <span className="menu-badge">2</span>
              </button>
              
              <div className="menu-divider"></div>
              
              <button onClick={() => { handleLogout(); setShowMenu(false); }} className="menu-item logout">
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
      </div>

      {/* Daily Tip */}
      <div className="daily-tip">
        <FiStar className="tip-icon" />
        <div className="tip-content">
          <strong>Kunlik maslahat:</strong> Profilingizni to'ldiring va tanishish imkoniyatiga ega bo'ling!
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => { setActiveTab('home'); navigate('/'); }}
        >
          <FiHome className="nav-icon" />
          <span className="nav-label">Bosh</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => { setActiveTab('explore'); navigate('/explore'); }}
        >
          <FiCompass className="nav-icon" />
          <span className="nav-label">Kashf</span>
        </button>
        
        <button className="nav-item add-button" onClick={() => navigate('/create')}>
          <div className="add-button-inner">
            <FiVideo className="add-icon" />
          </div>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'kino' ? 'active' : ''}`}
          onClick={() => { setActiveTab('kino'); navigate('/kino'); }}
        >
          <FiFilm className="nav-icon" />
          <span className="nav-label">Kino</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'music' ? 'active' : ''}`}
          onClick={() => { setActiveTab('music'); navigate('/music'); }}
        >
          <FiHeadphones className="nav-icon" />
          <span className="nav-label">Musiqa</span>
        </button>
      </nav>
    </div>
  );
};

export default MainPage;