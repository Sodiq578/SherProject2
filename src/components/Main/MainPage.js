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
  FiX
} from 'react-icons/fi';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setUserCount(users.length);

    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('datingProfiles'); // Profil ma'lumotlarini ham tozalash
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

  return (
    <div className="main-container">
      <div className="main-header">
        <div className="header-left">
          <h1>Sherbek</h1>
        </div>
        
        <div className="header-right">
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
                <FiUser className="menu-icon" />
                <div className="user-details">
                  <span className="user-name">@{currentUser?.username}</span>
                  <span className="user-email">{currentUser?.email}</span>
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

      <div className="stats-card">
        <FiUsers className="stats-icon" />
        <div className="stats-info">
          <span className="stats-label">Foydalanuvchilar</span>
          <span className="stats-number">{userCount}</span>
        </div>
      </div>

      <div className="main-buttons">
        <button onClick={() => navigate('/kino')} className="main-button kino">
          <FiFilm className="button-icon" />
          <span className="button-text">Kino</span>
        </button>
        
        <button onClick={() => navigate('/dating')} className="main-button dating">
          <FiHeart className="button-icon" />
          <span className="button-text">Dating</span>
        </button>
        
        <button onClick={() => navigate('/elonlar')} className="main-button elon">
          <FiShoppingBag className="button-icon" />
          <span className="button-text">E'lonlar</span>
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <FiUser className="profile-icon" />
          <h3>Mening profilim</h3>
        </div>
        
        <button onClick={handleFillProfile} className="profile-button">
          <FiEdit2 /> Anketani to'ldirish
        </button>
        
        <div className="profile-info">
          <p className="info-text">
            Anketa to'ldirilsa, boshqalarning anketalarini ko'rish mumkin
          </p>
          <div className="interests-hint">
            <small>Jins • Yosh • Musiqa • Gaming • Sport • Sayohat</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;