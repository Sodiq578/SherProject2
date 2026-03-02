// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Gallery
import Gallery from './components/gallery/gallery';

// Music
import Music from './components/music/music';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Main Page
import MainPage from './components/Main/MainPage';

// Kino Components
import KinoPage from './components/Kino/KinoPage';
import KinoWatch from "./components/Kino/KinoWatch";

// Dating Components
import DatingPage from './components/Dating/DatingPage';
import ProfileForm from './components/Dating/ProfileForm';

// Elonlar Components
import ElonlarPage from './components/Elonlar/ElonlarPage';

// Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminMovies from './components/Admin/AdminMovies';
import AdminUsers from './components/Admin/AdminUsers';
import AdminDating from './components/Admin/AdminDating';
import AdminAds from './components/Admin/AdminAds';

// Poll/Savollar Components
import PollCard from './components/PollCard/PollCard';

// Keyboard Handler Component
const KeyboardHandler = ({ children }) => {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Alt+T - Admin panel
      if (e.ctrlKey && e.altKey && e.key === 't') {
        e.preventDefault();
        console.log('Ctrl+Alt+T pressed - navigating to admin');
        navigate('/admin');
      }
      
      // Ctrl+Alt+L - Login
      if (e.ctrlKey && e.altKey && e.key === 'l') {
        e.preventDefault();
        console.log('Ctrl+Alt+L pressed - navigating to login');
        navigate('/login');
      }
      
      // Ctrl+Alt+R - Register
      if (e.ctrlKey && e.altKey && e.key === 'r') {
        e.preventDefault();
        console.log('Ctrl+Alt+R pressed - navigating to register');
        navigate('/register');
      }
      
      // Ctrl+Alt+M - Main page
      if (e.ctrlKey && e.altKey && e.key === 'm') {
        e.preventDefault();
        console.log('Ctrl+Alt+M pressed - navigating to main');
        navigate('/main');
      }
      
      // Ctrl+Alt+K - Kino page
      if (e.ctrlKey && e.altKey && e.key === 'k') {
        e.preventDefault();
        console.log('Ctrl+Alt+K pressed - navigating to kino');
        navigate('/kino');
      }
      
      // Ctrl+Alt+D - Dating page
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        e.preventDefault();
        console.log('Ctrl+Alt+D pressed - navigating to dating');
        navigate('/dating');
      }
      
      // Ctrl+Alt+E - Elonlar page
      if (e.ctrlKey && e.altKey && e.key === 'e') {
        e.preventDefault();
        console.log('Ctrl+Alt+E pressed - navigating to elonlar');
        navigate('/elonlar');
      }
      
      // Ctrl+Alt+G - Gallery
      if (e.ctrlKey && e.altKey && e.key === 'g') {
        e.preventDefault();
        console.log('Ctrl+Alt+G pressed - navigating to gallery');
        navigate('/gallery');
      }
      
      // Ctrl+Alt+S - Music
      if (e.ctrlKey && e.altKey && e.key === 's') {
        e.preventDefault();
        console.log('Ctrl+Alt+S pressed - navigating to music');
        navigate('/music');
      }
      
      // Ctrl+Alt+H - Show shortcuts
      if (e.ctrlKey && e.altKey && e.key === 'h') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
      
      // Escape - Close shortcuts
      if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showShortcuts]);

  return (
    <>
      {children}
      {showShortcuts && <ShortcutHint onClose={() => setShowShortcuts(false)} />}
    </>
  );
};

// Shortcut Hint Component
const ShortcutHint = ({ onClose }) => {
  const shortcuts = [
    { keys: 'Ctrl+Alt+T', desc: 'Admin panel' },
    { keys: 'Ctrl+Alt+L', desc: 'Login' },
    { keys: 'Ctrl+Alt+R', desc: 'Register' },
    { keys: 'Ctrl+Alt+M', desc: 'Main page' },
    { keys: 'Ctrl+Alt+K', desc: 'Kino page' },
    { keys: 'Ctrl+Alt+D', desc: 'Dating page' },
    { keys: 'Ctrl+Alt+E', desc: 'E\'lonlar' },
    { keys: 'Ctrl+Alt+G', desc: 'Gallery' },
    { keys: 'Ctrl+Alt+S', desc: 'Music' },
    { keys: 'Ctrl+Alt+H', desc: 'Bu oynani ko\'rsatish/yopish' },
    { keys: 'ESC', desc: 'Oynani yopish' }
  ];

  return (
    <div className="shortcut-overlay" onClick={onClose}>
      <div className="shortcut-modal" onClick={e => e.stopPropagation()}>
        <div className="shortcut-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="shortcut-grid">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-item">
              <span className="shortcut-keys">{shortcut.keys}</span>
              <span className="shortcut-desc">{shortcut.desc}</span>
            </div>
          ))}
        </div>
        <div className="shortcut-footer">
          <p>Tez o'tish uchun klaviatura tugmalaridan foydalaning</p>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const admin = JSON.parse(localStorage.getItem('admin') || 'null');
      if (admin && admin.isAdmin) {
        setIsAdmin(true);
      } else {
        navigate('/admin');
      }
      setIsLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return isAdmin ? children : null;
};

// Main App Component
function App() {
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    // App yuklanganini belgilash
    setAppLoaded(true);

    // LocalStorage ni tekshirish va default ma'lumotlarni o'rnatish
    if (!localStorage.getItem('users')) {
      // Default users
      const defaultUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          isAdmin: true
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Admin ma'lumotlarini tekshirish
    if (!localStorage.getItem('admin')) {
      const defaultAdmin = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        isAdmin: true,
        loggedIn: false
      };
      localStorage.setItem('admin', JSON.stringify(defaultAdmin));
    }

    console.log('App initialized successfully');
  }, []);

  if (!appLoaded) {
    return (
      <div className="initial-loading">
        <div className="loader"></div>
        <p>Ilova yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <Router>
      <KeyboardHandler>
        <div className="App">
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Main Routes */}
            <Route 
              path="/main" 
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Kino Routes */}
            <Route 
              path="/kino" 
              element={
                <ProtectedRoute>
                  <KinoPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/kino/watch/:id" 
              element={
                <ProtectedRoute>
                  <KinoWatch />
                </ProtectedRoute>
              } 
            />
            
            {/* Dating Routes */}
            <Route 
              path="/dating" 
              element={
                <ProtectedRoute>
                  <DatingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dating/profile-form" 
              element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Music Route */}
            <Route 
              path="/music" 
              element={
                <ProtectedRoute>
                  <Music />
                </ProtectedRoute>
              } 
            />
            
            {/* Gallery Route */}
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } 
            />
            
            {/* Elonlar Route */}
            <Route 
              path="/elonlar" 
              element={
                <ProtectedRoute>
                  <ElonlarPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Savollar/Poll Route */}
            <Route 
              path="/savollar" 
              element={
                <ProtectedRoute>
                  <PollCard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/movies" 
              element={
                <AdminRoute>
                  <AdminMovies />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/dating" 
              element={
                <AdminRoute>
                  <AdminDating />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/ads" 
              element={
                <AdminRoute>
                  <AdminAds />
                </AdminRoute>
              } 
            />
            
            {/* 404 - Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </KeyboardHandler>
    </Router>
  );
}

// 404 Not Found Component
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Sahifa topilmadi</h2>
        <p>Kechirasiz, siz qidirgan sahifa mavjud emas.</p>
        <div className="not-found-actions">
          <button onClick={() => navigate('/main')} className="home-btn">
            Bosh sahifaga qaytish
          </button>
          <button onClick={() => navigate(-1)} className="back-btn">
            Orqaga qaytish
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;