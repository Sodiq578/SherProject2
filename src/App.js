import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminDating from './components/Admin/AdminDating';  // ✅ QO'SHILDI
import AdminAds from './components/Admin/AdminAds';        // ✅ QO'SHILDI

function App() {
  return (
    <Router>
      <div className="App">
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
          <Route path="/admin/dating" element={<AdminDating />} />    {/* ✅ YANGI */}
          <Route path="/admin/ads" element={<AdminAds />} />          {/* ✅ YANGI */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;