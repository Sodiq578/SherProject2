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
  FiEdit2,
  FiArrowLeft,
  FiStar
} from 'react-icons/fi';
import './DatingPage.css';

const DatingPage = () => {
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  // ✅ currentProfileIndex ishlatilmayapti - olib tashlandi
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState(JSON.parse(localStorage.getItem('currentUser') || 'null'));
  const [userHasProfile, setUserHasProfile] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Simulyatsiya uchun 1-2 soniya kechikish (realda backenddan olinadi)
    setTimeout(() => {
      const allProfiles = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
      const userProfile = allProfiles.find(p => p.userId === currentUser.id);
      setUserHasProfile(!!userProfile);

      const otherProfiles = allProfiles.filter(p => p.userId !== currentUser.id);
      setProfiles(otherProfiles);

      if (otherProfiles.length > 0) {
        setCurrentProfile(otherProfiles[0]);
        // ✅ currentProfileIndex ishlatilmayapti - olib tashlandi
      }
      setLoading(false);
    }, 800);
  }, [currentUser, navigate]);

  const handleNext = () => {
    if (!profiles.length) return;
    
    const currentIndex = profiles.findIndex(p => p.id === currentProfile?.id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < profiles.length) {
      setCurrentProfile(profiles[nextIndex]);
    } else {
      setCurrentProfile(null);
    }
  };

  const handleLike = () => {
    if (!currentProfile) return;

    // Allaqachon like bosilganligini tekshirish
    const liked = JSON.parse(localStorage.getItem('likedProfiles') || '[]');
    if (liked.includes(currentProfile.userId)) {
      alert("Siz bu profilga allaqachon like bosgansiz!");
      handleNext();
      return;
    }

    // Like saqlash
    localStorage.setItem('likedProfiles', JSON.stringify([...liked, currentProfile.userId]));

    // Oddiy match tekshiruvi (real loyihada backend orqali amalga oshiriladi)
    const theirLikes = JSON.parse(localStorage.getItem('likedProfiles') || '[]');
    const isMatch = theirLikes.includes(currentUser.id);

    if (isMatch) {
      alert(`Match! 🎉 Siz va ${currentProfile.name} bir-biringizga like bosdingiz!`);
      // Bu yerda chiroyli match modal ochsa bo'ladi
    } else {
      alert(`Like yuborildi! ${currentProfile.name} ga xabar bordi ❤️`);
    }

    handleNext();
  };

  const handleDislike = () => {
    // Istasangiz disliked ro'yxatiga qo'shish mumkin (keyinchalik ko'rsatmaslik uchun)
    handleNext();
  };

  const handleSuperLike = () => {
    alert("Super Like yuborildi! ✨ Bu profil sizga juda yoqdi deb bildirildi.");
    handleNext();
  };

  const handleGoBack = () => {
    navigate('/main');
  };

  const getInterestIcon = (interest) => {
    switch (interest?.toLowerCase()) {
      case 'musiqa': return <FiMusic />;
      case 'gaming': return <FiMonitor />;
      case 'foto':   return <FiCamera />;
      case 'kafe':   return <FiCoffee />;
      default:       return <FiHeart />;
    }
  };

  if (loading) {
    return (
      <div className="dating-container loading">
        <div className="loading-spinner" />
        <p>Profillar yuklanmoqda...</p>
      </div>
    );
  }

  if (!userHasProfile) {
    return (
      <div className="dating-container">
        <div className="dating-header">
          <button onClick={handleGoBack} className="back-button">
            <FiArrowLeft />
          </button>
          <h1><FiHeart /> Dating</h1>
          <div className="header-placeholder" />
        </div>
        <div className="empty-state">
          <FiUser className="empty-icon" />
          <h3>Anketa to'ldirilmagan</h3>
          <p>Avval o'zingiz haqingizda ma'lumot kiriting</p>
          <button 
            onClick={() => navigate('/dating/profile-form')} 
            className="action-button primary"
          >
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
          <button onClick={handleGoBack} className="back-button">
            <FiArrowLeft />
          </button>
          <h1><FiHeart /> Dating</h1>
          <div className="header-placeholder" />
        </div>
        <div className="empty-state">
          <FiUser className="empty-icon" />
          <h3>Hozircha boshqa foydalanuvchilar yo'q</h3>
          <p>Keyinroq qayta urinib ko'ring yoki do'stlaringizni taklif qiling</p>
          <button onClick={handleGoBack} className="action-button primary">
            Bosh sahifaga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dating-container">
      <div className="dating-header">
        <button onClick={handleGoBack} className="back-button">
          <FiArrowLeft />
        </button>
        <h1><FiHeart /> Dating</h1>
        <div className="header-placeholder" />
      </div>

      <div className="dating-card">
        <div className="profile-image-wrapper">
          <img
            src={currentProfile.photos?.[0] || 'https://via.placeholder.com/400x500?text=' + currentProfile.name?.[0]}
            alt={currentProfile.name}
            className="profile-image"
          />
        </div>

        <div className="profile-content">
          <h2>{currentProfile.name}, {currentProfile.age}</h2>

          <div className="interests-list">
            {currentProfile.interests?.map((interest, idx) => (
              <span key={idx} className="interest-item">
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
          <button onClick={handleDislike} className="action-circle dislike" title="Yoqtirmayman">
            <FiX />
          </button>
          <button onClick={handleSuperLike} className="action-circle super" title="Super Like">
            <FiStar />
          </button>
          <button onClick={handleNext} className="action-circle next" title="Keyingisi">
            ⏭️
          </button>
          <button onClick={handleLike} className="action-circle like" title="Like">
            <FiHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatingPage;