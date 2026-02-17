import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiLogIn, FiShield, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import './Admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Admin tekshirish
    setTimeout(() => {
      if (formData.email === 'admin@admin.com' && formData.password === 'admin123') {
        const adminUser = {
          id: 'admin1',
          email: 'admin@admin.com',
          username: 'admin',
          role: 'admin',
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        navigate('/admin/dashboard');
      } else {
        setError('Email yoki parol noto\'g\'ri!');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">
            <FiShield />
          </div>
          <h2>Admin Panel</h2>
          <p>Sherbek App boshqaruv tizimi</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="input-wrapper">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </div>
          
          <div className="input-wrapper">
            <FiLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Parol"
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <FiLogIn /> Kirish
              </>
            )}
          </button>
        </form>
        
        <div className="admin-login-info">
          <div className="info-item">
            <FiUser />
            <span>admin@admin.com</span>
          </div>
          <div className="info-item">
            <FiLock />
            <span>admin123</span>
          </div>
        </div>

        <div className="admin-login-footer">
          <a href="/">← Asosiy sahifaga qaytish</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;