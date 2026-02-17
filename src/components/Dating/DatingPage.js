import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiX, 
  FiUser,
  FiMusic,
  FiMonitor,
  FiCamera,
  FiCoffee,
  FiEdit2
} from 'react-icons/fi';
import './DatingPage.css';

const DatingPage = () => {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUser] = useState(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  const [userHasProfile, setUserHasProfile] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const profiles = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
    const userProfile = profiles.find(p => p.userId === currentUser.id);
    setUserHasProfile(!!userProfile);

    const otherProfiles = profiles.filter(p => p.userId !== currentUser.id);
    setProfiles(otherProfiles);
    
    if (otherProfiles.length > 0) {
      setCurrentProfile(otherProfiles[0]);
    }
  }, [currentUser, navigate]);

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentProfile(profiles[currentIndex + 1]);
    } else {
      setCurrentProfile(null);
    }
  };

  const handleLike = () => {
    alert('Like berildi!');
    handleNext();
  };

  const handleDislike = () => {
    handleNext();
  };

  const getInterestIcon = (interest) => {
    switch(interest?.toLowerCase()) {
      case 'musiqa': return <FiMusic />;
      case 'gaming': return <FiMonitor />;
      case 'foto': return <FiCamera />;
      case 'kafe': return <FiCoffee />;
      default: return <FiHeart />;
    }
  };

  if (!userHasProfile) {
    return (
      <div className="dating-container">
        <div className="dating-header">
          <h1><FiHeart /> Dating</h1>
        </div>
        <div className="empty-state">
          <FiUser className="empty-icon" />
          <h3>Anketa to'ldirilmagan</h3>
          <p>Avval anketangizni to'ldiring</p>
          <button onClick={() => navigate('/dating/profile-form')} className="action-button">
            <FiEdit2 /> Anketa to'ldirish
          </button>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="dating-container">
        <div className="dating-header">
          <h1><FiHeart /> Dating</h1>
        </div>
        <div className="empty-state">
          <FiUser className="empty-icon" />
          <h3>Hozircha boshqa foydalanuvchilar yo'q</h3>
          <button onClick={() => navigate('/main')} className="action-button">
            Bosh sahifa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dating-container">
      <div className="dating-header">
        <h1><FiHeart /> Dating</h1>
      </div>
      
      <div className="dating-card">
        <div className="profile-image-wrapper">
          <img 
            src={currentProfile.photos?.[0] || 'https://via.placeholder.com/400x400'} 
            alt={currentProfile.name}
            className="profile-image"
          />
        </div>
        
        <div className="profile-content">
          <h2>{currentProfile.name}, {currentProfile.age}</h2>
          
          <div className="interests-list">
            {currentProfile.interests?.map((interest, index) => (
              <span key={index} className="interest-item">
                {getInterestIcon(interest)}
                {interest}
              </span>
            ))}
          </div>
          
          {currentProfile.bio && (
            <div className="bio-text">
              <p>{currentProfile.bio}</p>
            </div>
          )}
        </div>
        
        <div className="action-row">
          <button onClick={handleDislike} className="action-circle dislike">
            <FiX />
          </button>
          <button onClick={handleNext} className="action-circle next">
            ⏭️
          </button>
          <button onClick={handleLike} className="action-circle like">
            <FiHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatingPage;