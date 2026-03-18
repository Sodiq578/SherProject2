// src/components/LanguageSelector.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-selector">
      <button 
        className={`lang-btn ${i18n.language === 'uz' ? 'active' : ''}`}
        onClick={() => changeLanguage('uz')}
      >
        <img 
          src="https://flagcdn.com/16x12/uz.png" 
          alt="O'zbek" 
          width="20" 
          height="15"
        />
        <span>O'zbek</span>
      </button>
      <button 
        className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}
        onClick={() => changeLanguage('ru')}
      >
        <img 
          src="https://flagcdn.com/16x12/ru.png" 
          alt="Русский" 
          width="20" 
          height="15"
        />
        <span>Русский</span>
      </button>
      <button 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        <img 
          src="https://flagcdn.com/16x12/us.png" 
          alt="English" 
          width="20" 
          height="15"
        />
        <span>English</span>
      </button>
    </div>
  );
};

export default LanguageSelector;