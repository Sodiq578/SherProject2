import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFilm, 
  FiSearch, 
  FiFilter,
  FiStar,
  FiArrowLeft,
  FiPlay
} from 'react-icons/fi'; // FiTrendingUp, FiRadio, FiMusic, FiCoffee, FiAward olib tashlandi
import './KinoPage.css';

const KinoPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const genres = [
    'all',
    'Action',
    'Drama',
    'Comedy',
    'Sci-Fi',
    'Horror',
    'Romance',
    'Thriller'
  ];

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, selectedGenre, selectedType]);

  const loadMovies = () => {
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    setMovies(savedMovies);
    setFilteredMovies(savedMovies);
  };

  const filterMovies = () => {
    let filtered = [...movies];

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(m => 
        m.genre?.includes(selectedGenre)
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(m => m.type === selectedType);
    }

    setFilteredMovies(filtered);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handlePlay = (movie) => {
    // Kino oynasini ochish
    navigate(`/kino/watch/${movie.id}`);
  };

  const formatRating = (rating) => {
    return rating?.toFixed(1) || '0.0';
  };

  return (
    <div className="kino-container">
      <div className="kino-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <FiArrowLeft />
        </button>
        <h1>Kinolar</h1>
        <button onClick={() => setShowFilters(true)} className="filter-btn">
          <FiFilter />
        </button>
      </div>

      <div className="kino-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Kino qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="kino-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <div 
              key={movie.id} 
              className="kino-card"
              onClick={() => handleMovieClick(movie)}
            >
              <div className="kino-poster">
                <img 
                  src={movie.posterUrl || 'https://via.placeholder.com/200x300'} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200x300';
                  }}
                />
                <div className="kino-rating">
                  <FiStar /> {formatRating(movie.rating)}
                </div>
                <div className="kino-type-badge">
                  {movie.type === 'movie' ? 'Film' : 'Multfilm'}
                </div>
                {movie.videoUrl || movie.videoData ? (
                  <div className="kino-play-overlay">
                    <FiPlay />
                  </div>
                ) : (
                  <div className="kino-soon-overlay">
                    Tez kunda
                  </div>
                )}
              </div>
              <div className="kino-info">
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-movies">
            <FiFilm className="no-movies-icon" />
            <p>Kinolar topilmadi</p>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="filters-modal" onClick={() => setShowFilters(false)}>
          <div className="filters-content" onClick={e => e.stopPropagation()}>
            <div className="filters-header">
              <h3>Filterlar</h3>
              <button onClick={() => setShowFilters(false)}>
                <FiFilter />
              </button>
            </div>
            
            <div className="filter-section">
              <h4>Janr</h4>
              <div className="filter-options">
                {genres.map(genre => (
                  <button
                    key={genre}
                    className={`filter-option ${selectedGenre === genre ? 'active' : ''}`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre === 'all' ? 'Barchasi' : genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Tur</h4>
              <div className="filter-options">
                <button
                  className={`filter-option ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  Barchasi
                </button>
                <button
                  className={`filter-option ${selectedType === 'movie' ? 'active' : ''}`}
                  onClick={() => setSelectedType('movie')}
                >
                  Film
                </button>
                <button
                  className={`filter-option ${selectedType === 'cartoon' ? 'active' : ''}`}
                  onClick={() => setSelectedType('cartoon')}
                >
                  Multfilm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMovie && (
        <div className="movie-modal" onClick={() => setSelectedMovie(null)}>
          <div className="movie-modal-content" onClick={e => e.stopPropagation()}>
            <div className="movie-modal-header">
              <h2>{selectedMovie.title}</h2>
              <button onClick={() => setSelectedMovie(null)} className="close-btn">
                <FiFilter />
              </button>
            </div>
            
            <div className="movie-modal-body">
              <div className="movie-poster-large">
                <img 
                  src={selectedMovie.posterUrl || 'https://via.placeholder.com/300x450'} 
                  alt={selectedMovie.title}
                />
              </div>
              
              <div className="movie-details">
                <p><strong>Yil:</strong> {selectedMovie.year}</p>
                <p><strong>Janr:</strong> {selectedMovie.genre?.join(', ')}</p>
                <p><strong>Rejissyor:</strong> {selectedMovie.director || 'Noma\'lum'}</p>
                <p><strong>Reyting:</strong> <FiStar /> {formatRating(selectedMovie.rating)}</p>
                <p><strong>Davomiylik:</strong> {selectedMovie.duration || 'Noma\'lum'}</p>
                <p className="movie-description">{selectedMovie.description}</p>
                
                {selectedMovie.cast?.length > 0 && (
                  <p><strong>Aktyorlar:</strong> {selectedMovie.cast.join(', ')}</p>
                )}
                
                <button 
                  onClick={() => handlePlay(selectedMovie)}
                  className="play-movie-btn"
                  disabled={!selectedMovie.videoUrl && !selectedMovie.videoData}
                >
                  <FiPlay /> 
                  {(selectedMovie.videoUrl || selectedMovie.videoData) ? 'Ko\'rish' : 'Tez kunda'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KinoPage;