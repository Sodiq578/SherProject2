import React, { useEffect, useState } from 'react';  // ✅ useState qo'shildi
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Main
import MainPage from './components/Main/MainPage';

// Kino
import KinoPage from './components/Kino/KinoPage';

// Dating
import DatingPage from './components/Dating/DatingPage';
import ProfileForm from './components/Dating/ProfileForm';

// Elonlar
import ElonlarPage from './components/Elonlar/ElonlarPage';

// Admin
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminMovies from './components/Admin/AdminMovies';
import AdminUsers from './components/Admin/AdminUsers';
import AdminDating from './components/Admin/AdminDating';
import AdminAds from './components/Admin/AdminAds';

// Keyboard shortcut komponenti
const KeyboardHandler = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Alt+T bosilganda admin panelga o'tish
      if (e.ctrlKey && e.altKey && e.key === 't') {
        e.preventDefault();
        console.log('Ctrl+Alt+T pressed - navigating to admin');
        navigate('/admin');
      }
      
      // Ctrl+Alt+L bosilganda login sahifasiga o'tish
      if (e.ctrlKey && e.altKey && e.key === 'l') {
        e.preventDefault();
        console.log('Ctrl+Alt+L pressed - navigating to login');
        navigate('/login');
      }
      
      // Ctrl+Alt+R bosilganda register sahifasiga o'tish
      if (e.ctrlKey && e.altKey && e.key === 'r') {
        e.preventDefault();
        console.log('Ctrl+Alt+R pressed - navigating to register');
        navigate('/register');
      }
      
      // Ctrl+Alt+M bosilganda main sahifasiga o'tish
      if (e.ctrlKey && e.altKey && e.key === 'm') {
        e.preventDefault();
        console.log('Ctrl+Alt+M pressed - navigating to main');
        navigate('/main');
      }
      
      // Ctrl+Alt+H bosilganda shortcutlarni ko'rsatish
      if (e.ctrlKey && e.altKey && e.key === 'h') {
        e.preventDefault();
        console.log('Ctrl+Alt+H pressed - toggling shortcuts');
        // Bu funksiya ShortcutHint komponenti ichida
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return children;
};

// Keyboard shortcut ko'rsatmalari komponenti
const ShortcutHint = () => {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'h') {
        e.preventDefault();
        setShowHint(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!showHint) return null;

  return (
    <div className="shortcut-hint">
      <div className="shortcut-header">
        <h3>Keyboard Shortcuts</h3>
        <button onClick={() => setShowHint(false)}>✕</button>
      </div>
      <div className="shortcut-list">
        <div className="shortcut-item">
          <span className="shortcut-keys">Ctrl+Alt+T</span>
          <span className="shortcut-desc">Admin panel</span>
        </div>
        <div className="shortcut-item">
          <span className="shortcut-keys">Ctrl+Alt+L</span>
          <span className="shortcut-desc">Login</span>
        </div>
        <div className="shortcut-item">
          <span className="shortcut-keys">Ctrl+Alt+R</span>
          <span className="shortcut-desc">Register</span>
        </div>
        <div className="shortcut-item">
          <span className="shortcut-keys">Ctrl+Alt+M</span>
          <span className="shortcut-desc">Main page</span>
        </div>
        <div className="shortcut-item">
          <span className="shortcut-keys">Ctrl+Alt+H</span>
          <span className="shortcut-desc">Bu oynani ko'rsatish/yopish</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <KeyboardHandler>
        <div className="App">
          <ShortcutHint />
          <Routes>
            {/* Auth */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Main */}
            <Route path="/main" element={<MainPage />} />
            
            {/* Kino */}
            <Route path="/kino" element={<KinoPage />} />
            
            {/* Dating */}
            <Route path="/dating" element={<DatingPage />} />
            <Route path="/dating/profile-form" element={<ProfileForm />} />
            
            {/* Elonlar */}
            <Route path="/elonlar" element={<ElonlarPage />} />
            
            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/movies" element={<AdminMovies />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/dating" element={<AdminDating />} />
            <Route path="/admin/ads" element={<AdminAds />} />
          </Routes>
        </div>
      </KeyboardHandler>
    </Router>
  );
}

export default App;