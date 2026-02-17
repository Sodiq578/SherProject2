import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiCalendar,
  FiMusic,
  FiMonitor,
  FiCamera,
  FiCoffee,
  FiHeart,
  FiSave,
  FiX
} from 'react-icons/fi';
import './ProfileForm.css';

const ProfileForm = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    interests: [],
    bio: ''
  });

  const interestOptions = [
    { id: 'musiqa', label: 'Musiqa', icon: <FiMusic /> },
    { id: 'gaming', label: 'Gaming', icon: <FiMonitor /> },
    { id: 'sport', label: 'Sport', icon: <FiMonitor /> },
    { id: 'kino', label: 'Kino', icon: <FiCamera /> },
    { id: 'foto', label: 'Foto', icon: <FiCamera /> },
    { id: 'kafe', label: 'Kafe', icon: <FiCoffee /> },
    { id: 'sayokat', label: 'Sayohat', icon: <FiHeart /> }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    const profiles = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
    const existingProfile = profiles.find(p => p.userId === user.id);
    
    if (existingProfile) {
      setFormData({
        name: existingProfile.name,
        age: existingProfile.age.toString(),
        gender: existingProfile.gender,
        interests: existingProfile.interests || [],
        bio: existingProfile.bio || ''
      });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) return;

    const newProfile = {
      id: Date.now().toString(),
      userId: currentUser.id,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      interests: formData.interests,
      bio: formData.bio,
      photos: ['https://via.placeholder.com/400x400']
    };

    const profiles = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
    const existingIndex = profiles.findIndex(p => p.userId === currentUser.id);

    if (existingIndex >= 0) {
      profiles[existingIndex] = newProfile;
    } else {
      profiles.push(newProfile);
    }

    localStorage.setItem('datingProfiles', JSON.stringify(profiles));
    alert('Profil saqlandi!');
    navigate('/dating');
  };

  return (
    <div className="profile-form-container">
      <div className="profile-form-card">
        <h2><FiUser /> Anketa</h2>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>
              <FiUser /> Ism
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ismingiz"
            />
          </div>

          <div className="form-group">
            <label>
              <FiCalendar /> Yosh
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="16"
              max="100"
              placeholder="Yoshingiz"
            />
          </div>

          <div className="form-group">
            <label>Jins</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="male">Erkak</option>
              <option value="female">Ayol</option>
            </select>
          </div>

          <div className="form-group">
            <label>Qiziqishlar</label>
            <div className="interests-grid">
              {interestOptions.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`interest-btn ${formData.interests.includes(interest.id) ? 'selected' : ''}`}
                >
                  {interest.icon}
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="O'zingiz haqingizda..."
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              <FiSave /> Saqlash
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dating')}
              className="cancel-button"
            >
              <FiX /> Bekor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;