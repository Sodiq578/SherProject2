import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiTrash2,
  FiUser,
  FiCalendar,
  FiShield,
  FiHome,
  FiFilm,
  FiHeart,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiX
} from 'react-icons/fi'; // FiMail, FiEye, FiUserCheck, FiUserX olib tashlandi
import './Admin.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // filterUsers ni useCallback bilan memoize qilish
  const filterUsers = useCallback(() => {
    if (searchTerm) {
      const filtered = users.filter(u => 
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchTerm]);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminUser'));
    if (!admin) {
      navigate('/admin');
      return;
    }
    setAdminUser(admin);
    loadUsers();
  }, [navigate]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]); // filterUsers dependency sifatida

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
    setFilteredUsers(savedUsers);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Bu foydalanuvchini o\'chirishni tasdiqlaysizmi?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setSelectedUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

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
          <button onClick={() => navigate('/admin/users')} className="menu-item active">
            <FiUsers /> Foydalanuvchilar
          </button>
          <button onClick={() => navigate('/admin/dating')} className="menu-item">
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
            <h1><FiUsers /> Foydalanuvchilar</h1>
            <p>Jami {users.length} ta foydalanuvchi</p>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Foydalanuvchi qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="users-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="user-card" onClick={() => viewUserDetails(user)}>
                <div className="user-card-header">
                  <div className="user-avatar">
                    <FiUser />
                  </div>
                  <div className="user-status">
                    {user.id === adminUser?.id ? (
                      <span className="status-badge admin">Admin</span>
                    ) : (
                      <span className="status-badge user">User</span>
                    )}
                  </div>
                </div>
                <div className="user-card-body">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                  <div className="user-meta">
                    <span><FiCalendar /> {formatDate(user.createdAt)}</span>
                  </div>
                </div>
                {user.id !== adminUser?.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }} 
                    className="delete-user-btn"
                    title="O'chirish"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="no-data">
              <FiUsers className="no-data-icon" />
              <p>Foydalanuvchilar topilmadi</p>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="admin-form-overlay" onClick={() => setSelectedUser(null)}>
            <div className="user-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Foydalanuvchi ma'lumotlari</h3>
                <button onClick={() => setSelectedUser(null)} className="close-btn">
                  <FiX />
                </button>
              </div>
              <div className="user-details-content">
                <div className="detail-avatar">
                  <FiUser />
                </div>
                <div className="detail-info">
                  <div className="detail-row">
                    <label>Username:</label>
                    <span>{selectedUser.username}</span>
                  </div>
                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="detail-row">
                    <label>ID:</label>
                    <span>{selectedUser.id}</span>
                  </div>
                  <div className="detail-row">
                    <label>Ro'yxatdan o'tgan:</label>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="detail-row">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedUser.id === adminUser?.id ? 'admin' : 'user'}`}>
                      {selectedUser.id === adminUser?.id ? 'Admin' : 'Foydalanuvchi'}
                    </span>
                  </div>
                </div>
              </div>
              {selectedUser.id !== adminUser?.id && (
                <div className="modal-footer">
                  <button onClick={() => handleDelete(selectedUser.id)} className="delete-confirm-btn">
                    <FiTrash2 /> Foydalanuvchini o'chirish
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;