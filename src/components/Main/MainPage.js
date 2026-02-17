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
  FiMenu
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
    navigate('/');
  };

  const handleFillProfile = () => {
    navigate('/dating/profile-form');
  };

  return (
    <div className="main-container">
      <div className="main-header">
        <div className="header-left">
          <h1>Sherbek</h1>
        </div>
        <div className="header-right">
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>
            <FiMenu />
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <div className="user-info-menu">
                <FiUser /> @{currentUser?.username}
              </div>
              <button onClick={handleLogout} className="logout-button">
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