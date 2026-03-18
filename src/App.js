// src/App.js
import React, { useEffect, useState, lazy, Suspense, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import './i18n'; 

// Lazy loading
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
const AdminBanner = lazy(() => import('./components/Admin/AdminBaner'));

// Loading Component
const LoadingSpinner = () => (
  <div className="loading-screen">
    <div className="spinner"></div>
    <p>Yuklanmoqda...</p>
  </div>
);

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

// Protected Route Component (Optimallashtirilgan)
const ProtectedRoute = React.memo(({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const checked = useRef(false);

  useEffect(() => {
    if (!checked.current) {
      checked.current = true;
      
      // LocalStorage ni bir marta o'qish
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const admin = JSON.parse(localStorage.getItem('admin'));
        
        setIsAuthenticated(!!currentUser);
        setIsAdmin(admin?.isAdmin || currentUser?.isAdmin || false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    }
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.MAIN} replace />;
  }

  return children;
});

// 404 Not Found
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Sahifa topilmadi</h2>
        <p>Kechirasiz, siz qidirgan sahifa mavjud emas</p>
        <button onClick={() => navigate(ROUTES.MAIN)}>
          Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
};

// Main App Component (Optimallashtirilgan)
function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Faqat bir marta ishga tushirish
    if (!initialized.current) {
      initialized.current = true;
      
      try {
        // Tekshirish: agar users bo'lmasa, yaratish
        if (!localStorage.getItem('users')) {
          const defaultUsers = [
            {
              id: 1,
              username: 'admin',
              email: 'admin@admin.com',
              password: 'admin123',
              isAdmin: true,
              role: 'super_admin',
              createdAt: new Date().toISOString()
            }
          ];
          localStorage.setItem('users', JSON.stringify(defaultUsers));
        }

        // Boshqa default ma'lumotlar
        if (!localStorage.getItem('admin')) {
          localStorage.setItem('admin', JSON.stringify(null));
        }
        
        if (!localStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', JSON.stringify(null));
        }

      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setIsInitialized(true);
      }
    }
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
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Redirect root to login */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
            
            {/* Auth Routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.ADMIN} element={<AdminLogin />} />
            
            {/* Protected Routes */}
            <Route path={ROUTES.MAIN} element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
            <Route path={ROUTES.KINO} element={<ProtectedRoute><KinoPage /></ProtectedRoute>} />
            <Route path={ROUTES.KINO_WATCH} element={<ProtectedRoute><KinoWatch /></ProtectedRoute>} />
            <Route path={ROUTES.DATING} element={<ProtectedRoute><DatingPage /></ProtectedRoute>} />
            <Route path={ROUTES.DATING_FORM} element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
            <Route path={ROUTES.MUSIC} element={<ProtectedRoute><Music /></ProtectedRoute>} />
            <Route path={ROUTES.GALLERY} element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
            <Route path={ROUTES.ELONLAR} element={<ProtectedRoute><ElonlarPage /></ProtectedRoute>} />
            <Route path={ROUTES.SAVOLLAR} element={<ProtectedRoute><PollCard /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_BANNER} element={<ProtectedRoute requireAdmin={true}><AdminBanner /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_MOVIES} element={<ProtectedRoute requireAdmin={true}><AdminMovies /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_USERS} element={<ProtectedRoute requireAdmin={true}><AdminUsers /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_DATING} element={<ProtectedRoute requireAdmin={true}><AdminDating /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_ADS} element={<ProtectedRoute requireAdmin={true}><AdminAds /></ProtectedRoute>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
