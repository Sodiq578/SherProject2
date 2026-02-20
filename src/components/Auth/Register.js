import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiUserPlus } from 'react-icons/fi';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Parollar mos kelmadi!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === formData.email)) {
      alert('Bu email allaqachon ro\'yxatdan o\'tgan!');
      return;
    }

    if (users.some(u => u.username === formData.username)) {
      alert('Bu username allaqachon mavjud!');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: formData.email,
      username: formData.username,
      password: formData.password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    alert('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
    navigate('/main');
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-form-container">
        <h2 className="register-form-title">Ro'yxatdan o'tish</h2>
        <form onSubmit={handleSubmit} className="register-form-fields">
          <div className="register-field-group">
            <label className="register-field-label">
              <FiMail className="register-field-icon" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Emailingizni kiriting"
              className="register-text-input"
            />
          </div>
          
          <div className="register-field-group">
            <label className="register-field-label">
              <FiUser className="register-field-icon" />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Username kiriting"
              className="register-text-input"
            />
          </div>
          
          <div className="register-field-group">
            <label className="register-field-label">
              <FiLock className="register-field-icon" />
              Parol
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Parolni kiriting"
              className="register-text-input"
            />
          </div>
          
          <div className="register-field-group">
            <label className="register-field-label">
              <FiLock className="register-field-icon" />
              Parolni takrorlang
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Parolni qayta kiriting"
              className="register-text-input"
            />
          </div>
          
          <button type="submit" className="register-submit-btn">
            <FiUserPlus /> Ro'yxatdan o'tish
          </button>
        </form>
        
        <p className="register-redirect-text">
          Hisobingiz bormi? <Link to="/login" className="register-redirect-link">Kirish</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;