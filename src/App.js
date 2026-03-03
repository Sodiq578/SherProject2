// src/App.js
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Lazy loading for better performance
const Gallery = lazy(() => import('./components/gallery/gallery'));
const Music = lazy(() => import('./components/music/music'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const MainPage = lazy(() => import('./components/Main/MainPage'));
const KinoPage = lazy(() => import('./components/Kino/KinoPage'));
const KinoWatch = lazy(() => import('./components/Kino/KinoWatch'));
const DatingPage = lazy(() => import('./components/Dating/DatingPage'));
const ProfileForm = lazy(() => import('./components/Dating/ProfileForm'));
const ElonlarPage = lazy(() => import('./components/Elonlar/ElonlarPage'));
const AdminLogin = lazy(() => import('./components/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const AdminMovies = lazy(() => import('./components/Admin/AdminMovies'));
const AdminUsers = lazy(() => import('./components/Admin/AdminUsers'));
const AdminDating = lazy(() => import('./components/Admin/AdminDating'));
const AdminAds = lazy(() => import('./components/Admin/AdminAds'));
const PollCard = lazy(() => import('./components/PollCard/PollCard'));
const AdminBanner = lazy(() => import('./components/Admin/AdminBaner')); // To'g'rilangan import

// Loading Component
const LoadingSpinner = () => (
  <div className="loading-screen">
    <div className="spinner"></div>
    <p>Yuklanmoqda...</p>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Xatolik yuz berdi</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Qayta yuklash
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route Constants
const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MAIN: '/main',
  KINO: '/kino',
  KINO_WATCH: '/kino/watch/:id',
  DATING: '/dating',
  DATING_FORM: '/dating/profile-form',
  MUSIC: '/music',
  GALLERY: '/gallery',
  ELONLAR: '/elonlar',
  SAVOLLAR: '/savollar',
  ADMIN: '/admin',
  ADMIN_BANNER: '/admin/banner',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MOVIES: '/admin/movies',
  ADMIN_USERS: '/admin/users',
  ADMIN_DATING: '/admin/dating',
  ADMIN_ADS: '/admin/ads'
};

// Keyboard Shortcuts Configuration
const KEYBOARD_SHORTCUTS = [
  { keys: 'Ctrl+Alt+T', desc: 'Admin panel', route: ROUTES.ADMIN },
  { keys: 'Ctrl+Alt+L', desc: 'Login', route: ROUTES.LOGIN },
  { keys: 'Ctrl+Alt+R', desc: 'Register', route: ROUTES.REGISTER },
  { keys: 'Ctrl+Alt+M', desc: 'Main page', route: ROUTES.MAIN },
  { keys: 'Ctrl+Alt+K', desc: 'Kino page', route: ROUTES.KINO },
  { keys: 'Ctrl+Alt+D', desc: 'Dating page', route: ROUTES.DATING },
  { keys: 'Ctrl+Alt+E', desc: 'E\'lonlar', route: ROUTES.ELONLAR },
  { keys: 'Ctrl+Alt+G', desc: 'Gallery', route: ROUTES.GALLERY },
  { keys: 'Ctrl+Alt+S', desc: 'Music', route: ROUTES.MUSIC },
  { keys: 'Ctrl+Alt+H', desc: 'Bu oynani ko\'rsatish/yopish', action: 'toggle' },
  { keys: 'ESC', desc: 'Oynani yopish', action: 'close' }
];

// Keyboard Handler Component
const KeyboardHandler = ({ children }) => {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || 
          e.target.tagName === 'TEXTAREA' || 
          e.target.isContentEditable) {
        return;
      }

      const shortcuts = {
        'ctrl+alt+t': () => navigate(ROUTES.ADMIN),
        'ctrl+alt+l': () => navigate(ROUTES.LOGIN),
        'ctrl+alt+r': () => navigate(ROUTES.REGISTER),
        'ctrl+alt+m': () => navigate(ROUTES.MAIN),
        'ctrl+alt+k': () => navigate(ROUTES.KINO),
        'ctrl+alt+d': () => navigate(ROUTES.DATING),
        'ctrl+alt+e': () => navigate(ROUTES.ELONLAR),
        'ctrl+alt+g': () => navigate(ROUTES.GALLERY),
        'ctrl+alt+s': () => navigate(ROUTES.MUSIC),
        'ctrl+alt+h': () => setShowShortcuts(prev => !prev),
        'escape': () => setShowShortcuts(false)
      };

      const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.altKey ? 'alt+' : ''}${e.key.toLowerCase()}`;
      
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      {children}
      {showShortcuts && (
        <ShortcutHint onClose={() => setShowShortcuts(false)} />
      )}
    </>
  );
};

// Shortcut Hint Component
const ShortcutHint = ({ onClose }) => {
  return (
    <div className="shortcut-overlay" onClick={onClose}>
      <div className="shortcut-modal" onClick={e => e.stopPropagation()}>
        <div className="shortcut-header">
          <h2>
            <span className="shortcut-icon">⌨️</span>
            Klaviatura yorliqlari
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Yopish">
            ✕
          </button>
        </div>
        <div className="shortcut-grid">
          {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
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
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const admin = JSON.parse(localStorage.getItem('admin'));
        
        setAuthState({
          isAuthenticated: !!currentUser,
          isAdmin: admin?.isAdmin || currentUser?.isAdmin || false,
          isLoading: false
        });
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.isLoading) {
    return <LoadingSpinner />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requireAdmin && !authState.isAdmin) {
    return <Navigate to={ROUTES.MAIN} replace />;
  }

  return children;
};

// 404 Not Found Component
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Sahifa topilmadi</h2>
        <p>Kechirasiz, siz qidirgan sahifa mavjud emas yoki o'chirilgan.</p>
        <div className="not-found-actions">
          <button onClick={() => navigate(ROUTES.MAIN)} className="home-btn">
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

// Main App Component
function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = () => {
      try {
        // Initialize default data if not exists
        if (!localStorage.getItem('users')) {
          const defaultUsers = [
            {
              id: 1,
              username: 'admin',
              email: 'admin@example.com',
              // Note: In production, never store plain passwords
              // This is just for demo purposes
              password: 'admin123',
              isAdmin: true,
              createdAt: new Date().toISOString()
            }
          ];
          localStorage.setItem('users', JSON.stringify(defaultUsers));
        }

        // Initialize admin session if not exists
        if (!localStorage.getItem('admin')) {
          localStorage.setItem('admin', JSON.stringify(null));
        }

        // Initialize current user if not exists
        if (!localStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', JSON.stringify(null));
        }

        console.log('App initialized successfully');
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="initial-loading">
        <div className="loader"></div>
        <p>Ilova yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <KeyboardHandler>
          <div className="App">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Redirect root to login */}
                <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
                
                {/* Auth Routes */}
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                
                {/* Protected Routes */}
                <Route 
                  path={ROUTES.MAIN} 
                  element={
                    <ProtectedRoute>
                      <MainPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.KINO} 
                  element={
                    <ProtectedRoute>
                      <KinoPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.KINO_WATCH} 
                  element={
                    <ProtectedRoute>
                      <KinoWatch />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.DATING} 
                  element={
                    <ProtectedRoute>
                      <DatingPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.DATING_FORM} 
                  element={
                    <ProtectedRoute>
                      <ProfileForm />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.MUSIC} 
                  element={
                    <ProtectedRoute>
                      <Music />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.GALLERY} 
                  element={
                    <ProtectedRoute>
                      <Gallery />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.ELONLAR} 
                  element={
                    <ProtectedRoute>
                      <ElonlarPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.SAVOLLAR} 
                  element={
                    <ProtectedRoute>
                      <PollCard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Banner Route */}
                <Route 
                  path={ROUTES.ADMIN_BANNER} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminBanner />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route path={ROUTES.ADMIN} element={<AdminLogin />} />
                
                <Route 
                  path={ROUTES.ADMIN_DASHBOARD} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.ADMIN_MOVIES} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminMovies />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.ADMIN_USERS} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminUsers />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.ADMIN_DATING} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDating />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path={ROUTES.ADMIN_ADS} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminAds />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </KeyboardHandler>
      </Router>
    </ErrorBoundary>
  );
}

export default App;