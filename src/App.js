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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/kino" element={<KinoPage />} />
          <Route path="/dating" element={<DatingPage />} />
          <Route path="/dating/profile-form" element={<ProfileForm />} />
          <Route path="/elonlar" element={<ElonlarPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;