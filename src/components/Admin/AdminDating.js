import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiTrash2,
  FiUser,
  FiShield,
  FiHome,
  FiFilm,
  FiUsers,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiX,
  FiEdit2,
  FiMusic,
  FiMonitor,
  FiCamera,
  FiCoffee
} from 'react-icons/fi'; // FiArrowRight olib tashlandi
import './Admin.css';

const AdminDating = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    interests: [],
    bio: '',
    photos: []
  });

  // filters va setFilters olib tashlandi - ishlatilmayapti
  // const [filters, setFilters] = useState({...});

  const interestOptions = [
    { id: 'musiqa', label: 'Musiqa', icon: <FiMusic /> },
    { id: 'gaming', label: 'Gaming', icon: <FiMonitor /> },
    { id: 'sport', label: 'Sport', icon: <FiMonitor /> },
    { id: 'kino', label: 'Kino', icon: <FiCamera /> },
    { id: 'foto', label: 'Foto', icon: <FiCamera /> },
    { id: 'kafe', label: 'Kafe', icon: <FiCoffee /> },
    { id: 'sayokat', label: 'Sayohat', icon: <FiHeart /> }
  ];

  const filterProfiles = useCallback(() => {
    if (searchTerm) {
      const filtered = profiles.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(profiles);
    }
  }, [profiles, searchTerm]);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminUser'));
    if (!admin) {
      navigate('/admin');
      return;
    }
    setAdminUser(admin);
    loadProfiles();
  }, [navigate]);

  useEffect(() => {
    filterProfiles();
  }, [filterProfiles]);

  const loadProfiles = () => {
    const savedProfiles = JSON.parse(localStorage.getItem('datingProfiles') || '[]');
    setProfiles(savedProfiles);
    setFilteredProfiles(savedProfiles);
  };

  const handleDelete = (profileId) => {
    if (window.confirm('Bu profilni o\'chirishni tasdiqlaysizmi?')) {
      const updatedProfiles = profiles.filter(p => p.id !== profileId);
      localStorage.setItem('datingProfiles', JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      setSelectedProfile(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const viewProfileDetails = (profile) => {
    setSelectedProfile(profile);
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name || '',
      age: profile.age?.toString() || '',
      gender: profile.gender || 'male',
      interests: profile.interests || [],
      bio: profile.bio || '',
      photos: profile.photos || []
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === editingProfile?.userId) || users[0];

    const profileData = {
      ...formData,
      id: editingProfile ? editingProfile.id : Date.now().toString(),
      userId: editingProfile ? editingProfile.userId : (user?.id || 'unknown'),
      age: parseInt(formData.age),
      createdAt: editingProfile ? editingProfile.createdAt : new Date().toISOString()
    };

    let updatedProfiles;
    if (editingProfile) {
      updatedProfiles = profiles.map(p => p.id === editingProfile.id ? profileData : p);
    } else {
      updatedProfiles = [...profiles, profileData];
    }

    localStorage.setItem('datingProfiles', JSON.stringify(updatedProfiles));
    setProfiles(updatedProfiles);
    setShowForm(false);
    setEditingProfile(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'male',
      interests: [],
      bio: '',
      photos: []
    });
  };

  const getInterestIcon = (interest) => {
    switch(interest) {
      case 'musiqa': return <FiMusic />;
      case 'gaming': return <FiMonitor />;
      case 'sport': return <FiMonitor />;
      case 'foto': return <FiCamera />;
      case 'kafe': return <FiCoffee />;
      default: return <FiHeart />;
    }
  };

  // formatAge funksiyasi olib tashlandi - ishlatilmayapti
  // const formatAge = (age) => { ... };

  const formatDate = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  return (
    <div className="admin-container">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <FiShield className="sidebar-logo" />
            <h3>Admin Panel</h3>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            <FiMenu />
          </button>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div className="profile-info">
            <span className="profile-name">{adminUser?.username}</span>
            <span className="profile-email">{adminUser?.email}</span>
          </div>
        </div>
        
        <div className="sidebar-menu">
          <button onClick={() => navigate('/admin/dashboard')} className="menu-item">
            <FiHome /> Dashboard
          </button>
          <button onClick={() => navigate('/admin/movies')} className="menu-item">
            <FiFilm /> Kinolar
          </button>
          <button onClick={() => navigate('/admin/users')} className="menu-item">
            <FiUsers /> Foydalanuvchilar
          </button>
          <button onClick={() => navigate('/admin/dating')} className="menu-item active">
            <FiHeart /> Dating Profillar
          </button>
          <button onClick={() => navigate('/admin/ads')} className="menu-item">
            <FiShoppingBag /> E'lonlar
          </button>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Chiqish
          </button>
        </div>
      </div>

      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="admin-header">
          <div className="header-title">
            <h1><FiHeart /> Dating Profillar</h1>
            <p>Jami {profiles.length} ta profil</p>
          </div>
          <div className="header-actions">
            <button onClick={() => setShowForm(true)} className="admin-add-btn">
              <FiUser /> Yangi profil
            </button>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Profil qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showForm && (
          <div className="admin-form-overlay">
            <div className="admin-form-modal">
              <div className="admin-form-header">
                <h3>{editingProfile ? 'Profil tahrirlash' : 'Yangi profil qo\'shish'}</h3>
                <button onClick={() => { setShowForm(false); setEditingProfile(null); resetForm(); }} className="close-btn">
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Ism *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ism"
                    />
                  </div>

                  <div className="form-group">
                    <label>Yosh *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      min="16"
                      max="100"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Jins</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Erkak</option>
                    <option value="female">Ayol</option>
                    <option value="other">Boshqa</option>
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
                    placeholder="O'zi haqida..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Saqlash
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingProfile(null); resetForm(); }} className="cancel-btn">
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="profiles-grid">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map(profile => (
              <div key={profile.id} className="profile-card" onClick={() => viewProfileDetails(profile)}>
                <div className="profile-card-header">
                  <div className="profile-avatar-large">
                    {profile.photos?.[0] ? (
                      <img src={profile.photos[0]} alt={profile.name} />
                    ) : (
                      <FiUser />
                    )}
                  </div>
                  <div className="profile-status">
                    <span className="status-badge user">Profil</span>
                  </div>
                </div>
                <div className="profile-card-body">
                  <h3>{profile.name}, {profile.age}</h3>
                  <div className="profile-interests">
                    {profile.interests?.slice(0, 3).map((interest, i) => (
                      <span key={i} className="interest-tag">
                        {getInterestIcon(interest)}
                        {interest}
                      </span>
                    ))}
                  </div>
                  {profile.bio && (
                    <p className="profile-bio-preview">{profile.bio.substring(0, 50)}...</p>
                  )}
                </div>
                <div className="profile-card-footer">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(profile); }} 
                    className="action-btn edit"
                    title="Tahrirlash"
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }} 
                    className="action-btn delete"
                    title="O'chirish"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <FiHeart className="no-data-icon" />
              <p>Hozircha profillar yo'q</p>
              <button onClick={() => setShowForm(true)} className="add-first-btn">
                <FiUser /> Birinchi profilni qo'shish
              </button>
            </div>
          )}
        </div>

        {selectedProfile && (
          <div className="admin-form-overlay" onClick={() => setSelectedProfile(null)}>
            <div className="user-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Profil ma'lumotlari</h3>
                <button onClick={() => setSelectedProfile(null)} className="close-btn">
                  <FiX />
                </button>
              </div>
              <div className="profile-details-content">
                <div className="detail-avatar-large">
                  {selectedProfile.photos?.[0] ? (
                    <img src={selectedProfile.photos[0]} alt={selectedProfile.name} />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <div className="detail-info">
                  <div className="detail-row">
                    <label>Ism:</label>
                    <span>{selectedProfile.name}, {selectedProfile.age} yosh</span>
                  </div>
                  <div className="detail-row">
                    <label>Jins:</label>
                    <span>{selectedProfile.gender === 'male' ? 'Erkak' : selectedProfile.gender === 'female' ? 'Ayol' : 'Boshqa'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Qiziqishlar:</label>
                    <div className="profile-interests-detail">
                      {selectedProfile.interests?.map((interest, i) => (
                        <span key={i} className="interest-tag">
                          {getInterestIcon(interest)}
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedProfile.bio && (
                    <div className="detail-row">
                      <label>Bio:</label>
                      <p className="bio-text">{selectedProfile.bio}</p>
                    </div>
                  )}
                  <div className="detail-row">
                    <label>ID:</label>
                    <span>{selectedProfile.id}</span>
                  </div>
                  <div className="detail-row">
                    <label>Foydalanuvchi ID:</label>
                    <span>{selectedProfile.userId}</span>
                  </div>
                  <div className="detail-row">
                    <label>Qo'shilgan:</label>
                    <span>{formatDate(selectedProfile.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => handleEdit(selectedProfile)} className="edit-confirm-btn">
                  <FiEdit2 /> Tahrirlash
                </button>
                <button onClick={() => handleDelete(selectedProfile.id)} className="delete-confirm-btn">
                  <FiTrash2 /> O'chirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDating;