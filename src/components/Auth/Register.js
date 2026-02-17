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
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Ro'yxatdan o'tish</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label>
              <FiMail className="input-icon" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Emailingizni kiriting"
            />
          </div>
          
          <div className="input-group">
            <label>
              <FiUser className="input-icon" />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Username kiriting"
            />
          </div>
          
          <div className="input-group">
            <label>
              <FiLock className="input-icon" />
              Parol
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Parolni kiriting"
            />
          </div>
          
          <div className="input-group">
            <label>
              <FiLock className="input-icon" />
              Parolni takrorlang
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Parolni qayta kiriting"
            />
          </div>
          
          <button type="submit" className="register-button">
            <FiUserPlus /> Ro'yxatdan o'tish
          </button>
        </form>
        
        <p className="register-link">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;