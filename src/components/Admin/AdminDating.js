import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiUser, 
  FiFilter, 
  FiX,
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiMessageCircle
} from 'react-icons/fi';
import './Admin.css';

const DatingPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0); // currentIndex o'rniga currentProfileIndex
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 40],
    gender: 'all',
    interests: []
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    loadProfiles();
    loadLikedProfiles();
  }, [navigate]);

  const loadProfiles = () => {
    const allProfiles = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
    setProfiles(allProfiles);
  };

  const loadLikedProfiles = () => {
    const liked = JSON.parse(localStorage.getItem('likedProfiles') || '[]');
    setLikedProfiles(liked);
  };

  const handleLike = (profile) => {
    const updatedLiked = [...likedProfiles, profile.id];
    setLikedProfiles(updatedLiked);
    localStorage.setItem('likedProfiles', JSON.stringify(updatedLiked));
    
    // Keyingi profilga o'tish
    handleNext();
  };

  const handleNext = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // Profillar tugadi
      setCurrentProfileIndex(-1);
    }
  };

  const handlePrevious = () => {
    if (currentProfileIndex > 0) {
      setCurrentProfileIndex(prev => prev - 1);
    }
  };

  const getInterestIcon = (interest) => {
    switch(interest) {
      case 'musiqa': return '🎵';
      case 'sport': return '⚽';
      case 'kino': return '🎬';
      case 'foto': return '📷';
      case 'kafe': return '☕';
      default: return '❤️';
    }
  };

  const formatAge = (age) => {
    return `${age} yosh`;
  };

  if (!currentUser) {
    return null;
  }

  if (profiles.length === 0) {
    return (
      <div className="dating-container">
        <div className="dating-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FiArrowLeft />
          </button>
          <h1>Dating</h1>
          <button onClick={() => setShowFilters(true)} className="filter-btn">
            <FiFilter />
          </button>
        </div>
        <div className="no-profiles">
          <FiHeart className="no-profiles-icon" />
          <h3>Hozircha profillar yo'q</h3>
          <p>Keyinroq qayta urinib ko'ring</p>
        </div>
      </div>
    );
  }

  if (currentProfileIndex === -1) {
    return (
      <div className="dating-container">
        <div className="dating-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FiArrowLeft />
          </button>
          <h1>Dating</h1>
          <button onClick={() => setShowFilters(true)} className="filter-btn">
            <FiFilter />
          </button>
        </div>
        <div className="no-more-profiles">
          <FiHeart className="no-more-icon" />
          <h3>Barcha profillarni ko'rib chiqdingiz</h3>
          <p>Keyinroq qayta urinib ko'ring</p>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="dating-container">
      <div className="dating-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft />
        </button>
        <h1>Dating</h1>
        <button onClick={() => setShowFilters(true)} className="filter-btn">
          <FiFilter />
        </button>
      </div>

      <div className="dating-content">
        <div className="profile-card-large">
          <div className="profile-image">
            {currentProfile.photos?.[0] ? (
              <img src={currentProfile.photos[0]} alt={currentProfile.name} />
            ) : (
              <FiUser />
            )}
          </div>
          
          <div className="profile-info">
            <h2>{currentProfile.name}, {currentProfile.age}</h2>
            <p className="profile-bio">{currentProfile.bio}</p>
            
            <div className="profile-details">
              <div className="detail-item">
                <FiMapPin />
                <span>Toshkent</span>
              </div>
              <div className="detail-item">
                <FiBriefcase />
                <span>{currentProfile.gender === 'male' ? 'Erkak' : 'Ayol'}</span>
              </div>
              <div className="detail-item">
                <FiCalendar />
                <span>Online</span>
              </div>
            </div>

            <div className="profile-interests">
              {currentProfile.interests?.map((interest, i) => (
                <span key={i} className="interest-badge">
                  {getInterestIcon(interest)} {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={handlePrevious} className="action-btn dislike">
              <FiX />
            </button>
            <button onClick={() => handleLike(currentProfile)} className="action-btn like">
              <FiHeart />
            </button>
            <button onClick={() => {}} className="action-btn message">
              <FiMessageCircle />
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filters-modal" onClick={() => setShowFilters(false)}>
          <div className="filters-content" onClick={e => e.stopPropagation()}>
            <div className="filters-header">
              <h3>Filterlar</h3>
              <button onClick={() => setShowFilters(false)}>
                <FiX />
              </button>
            </div>
            {/* Filter content here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatingPage;