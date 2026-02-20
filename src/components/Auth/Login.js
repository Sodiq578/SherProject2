import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      u.email === formData.email && u.password === formData.password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/main');
    } else {
      alert('Email yoki parol noto\'g\'ri!');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-form-container">
        <h2 className="login-form-title">Kirish</h2>
        <form onSubmit={handleSubmit} className="login-form-fields">
          <div className="login-field-group">
            <label className="login-field-label">
              <FiMail className="login-field-icon" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Emailingizni kiriting"
              className="login-text-input"
            />
          </div>
          
          <div className="login-field-group">
            <label className="login-field-label">
              <FiLock className="login-field-icon" />
              Parol
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Parolingizni kiriting"
              className="login-text-input"
            />
          </div>
          
          <button type="submit" className="login-submit-btn">
            <FiLogIn /> Kirish
          </button>
        </form>
        
        <p className="login-redirect-text">
          Hisobingiz yo'qmi? <Link to="/register" className="login-redirect-link">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;