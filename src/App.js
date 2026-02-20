import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
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

// Keyboard shortcut komponenti (sizniki saqlanib qoldi)
const KeyboardHandler = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === 't') {
        e.preventDefault();
        navigate('/admin');
      }
      if (e.ctrlKey && e.altKey && e.key === 'l') {
        e.preventDefault();
        navigate('/login');
      }
      if (e.ctrlKey && e.altKey && e.key === 'r') {
        e.preventDefault();
        navigate('/register');
      }
      if (e.ctrlKey && e.altKey && e.key === 'm') {
        e.preventDefault();
        navigate('/main');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return children;
};

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
        <div className="shortcut-item"><span className="shortcut-keys">Ctrl+Alt+T</span> <span>Admin panel</span></div>
        <div className="shortcut-item"><span className="shortcut-keys">Ctrl+Alt+L</span> <span>Login</span></div>
        <div className="shortcut-item"><span className="shortcut-keys">Ctrl+Alt+R</span> <span>Register</span></div>
        <div className="shortcut-item"><span className="shortcut-keys">Ctrl+Alt+M</span> <span>Main page</span></div>
        <div className="shortcut-item"><span className="shortcut-keys">Ctrl+Alt+H</span> <span>Bu oynani ko'rsatish/yopish</span></div>
      </div>
    </div>
  );
};

function App() {
  const deferredPrompt = useRef(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log("beforeinstallprompt eventi chiqdi!");
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      console.log("Ilova muvaffaqiyatli o'rnatildi!");
      setCanInstall(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) {
      alert("O'rnatish hozircha mavjud emas. Iltimos, HTTPS orqali oching va service worker ishlayotganiga ishonch hosil qiling.");
      return;
    }

    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    console.log("O'rnatish natijasi:", outcome);

    if (outcome === 'accepted') {
      setCanInstall(false);
    }
    deferredPrompt.current = null;
  };

  return (
    <Router>
      <KeyboardHandler>
        <div className="App">
          <ShortcutHint />

          {/* PWA o'rnatish tugmasi - pastda o'ngda fixed */}
          {canInstall && (
            <button 
              onClick={handleInstall}
              className="install-app-btn fixed-install-btn"
            >
              <FiDownload /> Ilovani o'rnatish
            </button>
          )}

          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/kino" element={<KinoPage />} />
            <Route path="/dating" element={<DatingPage />} />
            <Route path="/dating/profile-form" element={<ProfileForm />} />
            <Route path="/elonlar" element={<ElonlarPage />} />
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