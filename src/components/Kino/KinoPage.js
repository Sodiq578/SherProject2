import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFilm, 
  FiStar, 
  FiArrowLeft,
  FiCalendar,
  FiTag,
  FiFilter
} from 'react-icons/fi';
import './KinoPage.css';

const KinoPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);

    const testMovies = [
      {
        id: '1',
        title: 'Inception',
        description: 'Dom Cobb - professional o\'g\'ri, odamlarning tushlariga kirib sirlarni o\'g\'irlaydi.',
        posterUrl: 'https://via.placeholder.com/300x450',
        year: 2010,
        genre: ['Sci-Fi', 'Action'],
        averageRating: 4.5,
        type: 'movie'
      },
      {
        id: '2',
        title: 'The Dark Knight',
        description: 'Betmen Joker nomli yangi dushmanga qarshi kurashadi.',
        posterUrl: 'https://via.placeholder.com/300x450',
        year: 2008,
        genre: ['Action', 'Drama'],
        averageRating: 4.8,
        type: 'movie'
      },
      {
        id: '3',
        title: 'Toy Story',
        description: 'O\'yinchoqlar hayoti haqida ajoyib multfilm.',
        posterUrl: 'https://via.placeholder.com/300x450',
        year: 1995,
        genre: ['Animation', 'Comedy'],
        averageRating: 4.7,
        type: 'cartoon'
      }
    ];

    setMovies(testMovies);
  }, []);

  const handleRating = (movieId, rating) => {
    if (!currentUser) {
      alert('Baho berish uchun tizimga kiring!');
      return;
    }

    setMovies(prev => prev.map(movie => {
      if (movie.id === movieId) {
        return { ...movie, userRating: rating, averageRating: rating };
      }
      return movie;
    }));
  };

  const filteredMovies = filter === 'all' 
    ? movies 
    : movies.filter(m => m.type === filter);

  return (
    <div className="kino-container">
      <div className="kino-header">
        <button onClick={() => navigate('/main')} className="back-button">
          <FiArrowLeft />
        </button>
        <h1><FiFilm /> Kino</h1>
        <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
          <FiFilter />
        </button>
      </div>

      {showFilter && (
        <div className="filter-menu">
          <button 
            className={`filter-option ${filter === 'all' ? 'active' : ''}`}
            onClick={() => { setFilter('all'); setShowFilter(false); }}
          >
            Hammasi
          </button>
          <button 
            className={`filter-option ${filter === 'movie' ? 'active' : ''}`}
            onClick={() => { setFilter('movie'); setShowFilter(false); }}
          >
            Filmlar
          </button>
          <button 
            className={`filter-option ${filter === 'cartoon' ? 'active' : ''}`}
            onClick={() => { setFilter('cartoon'); setShowFilter(false); }}
          >
            Multfilmlar
          </button>
        </div>
      )}

      {selectedMovie ? (
        <div className="movie-detail">
          <button onClick={() => setSelectedMovie(null)} className="detail-back">
            <FiArrowLeft /> Ortga
          </button>
          
          <div className="detail-card">
            <img 
              src={selectedMovie.posterUrl} 
              alt={selectedMovie.title}
              className="detail-poster"
            />
            
            <div className="detail-info">
              <h2>{selectedMovie.title}</h2>
              
              <div className="detail-meta">
                <span><FiCalendar /> {selectedMovie.year}</span>
                <span><FiTag /> {selectedMovie.genre.join(', ')}</span>
              </div>
              
              <div className="detail-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                      key={star}
                      className={`star ${star <= (selectedMovie.userRating || selectedMovie.averageRating) ? 'filled' : ''}`}
                      onClick={() => handleRating(selectedMovie.id, star)}
                    />
                  ))}
                </div>
                <span className="rating-value">{selectedMovie.averageRating.toFixed(1)}</span>
              </div>
              
              <p className="detail-description">{selectedMovie.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <div 
              key={movie.id} 
              className="movie-card"
              onClick={() => setSelectedMovie(movie)}
            >
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
                <div className="movie-rating">
                  <FiStar className="star-icon" />
                  <span>{movie.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KinoPage;