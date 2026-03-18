// src/components/Kino/KinoPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FiFilm, 
  FiSearch, 
  FiFilter,
  FiStar,
  FiArrowLeft,
  FiPlay,
  FiClock,
  FiCalendar,
  FiUser,
  FiX,
  FiTrendingUp,
  FiAward,
  FiHeart,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import './KinoPage.css';

// YouTube treylerlar - KOMPONENTDAN TASHQARIDA
const trailers = {
  // ... (trailers obyekti o'zgarishsiz)
};

// Asl video manzillari - KOMPONENTDAN TASHQARIDA
const videoUrls = {
  // ... (videoUrls obyekti o'zgarishsiz)
};

// 50+ ta kinolar - KOMPONENTDAN TASHQARIDA
const sampleMovies = [
  // ... (sampleMovies arrayi o'zgarishsiz)
];

const KinoPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState([]);
  
  const trendingScrollRef = useRef(null);

  const genres = [
    'all', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 
    'Romance', 'Thriller', 'Fantasy', 'Animation', 'Adventure',
    'Crime', 'Mystery', 'Family', 'War', 'History', 'Biography',
    'Musical', 'Sport', 'Western'
  ];

  const years = [
    'all', '2024', '2023', '2022', '2021', '2020', '2019',
    '2018', '2017', '2016', '2015', '2010-2014', '2000-2009',
    '1990-1999', '1980-1989', '1970-1979'
  ];

  // Filter funksiyasi
  const filterMovies = useCallback(() => {
    setIsLoading(true);
    let filtered = [...movies];

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genre?.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
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

    if (selectedYear !== 'all') {
      if (selectedYear.includes('-')) {
        const [start, end] = selectedYear.split('-').map(Number);
        filtered = filtered.filter(m => {
          const year = parseInt(m.year);
          return year >= start && year <= end;
        });
      } else {
        filtered = filtered.filter(m => m.year === selectedYear);
      }
    }

    setTimeout(() => {
      setFilteredMovies(filtered);
      setIsLoading(false);
    }, 300);
  }, [movies, searchTerm, selectedGenre, selectedType, selectedYear]);

  // Kinolarni yuklash
  const loadMovies = useCallback(() => {
    setIsLoading(true);
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    
    if (savedMovies.length === 0) {
      // Video va treylerlarni qo'shish
      const moviesWithMedia = sampleMovies.map(movie => ({
        ...movie,
        videoUrl: videoUrls[movie.id] || null,
        trailerUrl: trailers[movie.id] || null
      }));
      localStorage.setItem('movies', JSON.stringify(moviesWithMedia));
      setMovies(moviesWithMedia);
      setFilteredMovies(moviesWithMedia);
    } else {
      setMovies(savedMovies);
      setFilteredMovies(savedMovies);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    filterMovies();
  }, [filterMovies]);

  // Like holatini yuklash
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setLikedMovies(savedLikes);
  }, []);

  const handleGoBack = () => {
    navigate('/main');
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handlePlay = (movie) => {
    if (movie.videoUrl || movie.trailerUrl) {
      navigate(`/kino/watch/${movie.id}`);
    }
  };

  const formatRating = (rating) => {
    return rating?.toFixed(1) || '0.0';
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSelectedType('all');
    setSelectedYear('all');
  };

  const handleLike = (movieId) => {
    const newLikes = likedMovies.includes(movieId)
      ? likedMovies.filter(id => id !== movieId)
      : [...likedMovies, movieId];
    
    setLikedMovies(newLikes);
    localStorage.setItem('likedMovies', JSON.stringify(newLikes));
  };

  const scrollTrending = (direction) => {
    if (trendingScrollRef.current) {
      const scrollAmount = 300;
      const currentScroll = trendingScrollRef.current.scrollLeft;
      trendingScrollRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const trendingMovies = movies.filter(m => m.trending).slice(0, 10);

  const getGenreLabel = (genre) => {
    if (genre === 'all') return t('all');
    return genre;
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'all': return t('all');
      case 'movie': return t('movie');
      case 'cartoon': return t('cartoon');
      default: return type;
    }
  };

  return (
    <div className="kino-container">
      {/* Header */}
      <div className="kino-header">
        <button onClick={handleGoBack} className="back-btn">
          <FiArrowLeft size={24} />
        </button>
        <h1>{t('movies')}</h1>
        <button onClick={() => setShowFilters(true)} className="filter-btn">
          <FiFilter size={22} />
          {(selectedGenre !== 'all' || selectedType !== 'all' || selectedYear !== 'all') && (
            <span className="filter-badge"></span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="kino-search-container">
        <div className="kino-search">
          <FiSearch className="search-icon" size={20} />
          <input
            type="text"
            placeholder={t('searchMovies')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Trending Section */}
      {trendingMovies.length > 0 && !searchTerm && selectedGenre === 'all' && selectedType === 'all' && selectedYear === 'all' && (
        <div className="trending-section">
          <div className="section-title">
            <FiTrendingUp className="trending-icon" />
            <h2>{t('trendingMovies')}</h2>
            <div className="karusel-controls">
              <button 
                className="karusel-btn"
                onClick={() => scrollTrending('left')}
              >
                <FiChevronLeft size={20} />
              </button>
              <button 
                className="karusel-btn"
                onClick={() => scrollTrending('right')}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="trending-scroll" ref={trendingScrollRef}>
            {trendingMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="trending-card"
                onClick={() => handleMovieClick(movie)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img src={movie.posterUrl} alt={movie.title} />
                <div className="trending-rating">
                  <FiStar /> {formatRating(movie.rating)}
                </div>
                <div className="trending-title">{movie.title}</div>
                {movie.awards && (
                  <div className="trending-award">
                    <FiAward size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(selectedGenre !== 'all' || selectedType !== 'all' || selectedYear !== 'all') && (
        <div className="active-filters">
          <span>{t('activeFilters')}:</span>
          {selectedGenre !== 'all' && (
            <span className="filter-tag">
              {getGenreLabel(selectedGenre)}
              <button onClick={() => setSelectedGenre('all')}>✕</button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="filter-tag">
              {getTypeLabel(selectedType)}
              <button onClick={() => setSelectedType('all')}>✕</button>
            </span>
          )}
          {selectedYear !== 'all' && (
            <span className="filter-tag">
              {selectedYear === 'all' ? t('all') : selectedYear}
              <button onClick={() => setSelectedYear('all')}>✕</button>
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="stats-bar">
        <span>📊 {filteredMovies.length} {t('moviesFound')}</span>
        {filteredMovies.length > 0 && (
          <span className="avg-rating">
            ⭐ {(filteredMovies.reduce((acc, m) => acc + m.rating, 0) / filteredMovies.length).toFixed(1)}
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>{t('loadingMovies')}</p>
        </div>
      ) : (
        /* Movies Grid */
        <div className="kino-grid">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="kino-card"
                onClick={() => handleMovieClick(movie)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="kino-poster">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x450?text=🎬';
                    }}
                  />
                  <div className="kino-rating">
                    <FiStar /> {formatRating(movie.rating)}
                  </div>
                  <div className={`kino-type-badge ${movie.type}`}>
                    {movie.type === 'movie' ? t('movie') : t('cartoon')}
                  </div>
                  {movie.trending && (
                    <div className="trending-badge">
                      <FiTrendingUp size={14} />
                    </div>
                  )}
                  {likedMovies.includes(movie.id) && (
                    <div className="liked-badge">
                      <FiHeart size={14} />
                    </div>
                  )}
                  {(movie.videoUrl || movie.trailerUrl) ? (
                    <div className="kino-play-overlay">
                      <FiPlay size={32} />
                    </div>
                  ) : (
                    <div className="kino-play-overlay" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <FiFilm size={32} style={{ opacity: 0.5 }} />
                    </div>
                  )}
                </div>
                <div className="kino-info">
                  <h3 className="kino-title">{movie.title}</h3>
                  <div className="kino-meta">
                    <span className="kino-year">
                      <FiCalendar /> {movie.year}
                    </span>
                    <span className="kino-duration">
                      <FiClock /> {movie.duration}
                    </span>
                  </div>
                  {movie.awards && (
                    <div className="kino-award">
                      <FiAward /> {movie.awards}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-movies">
              <FiFilm className="no-movies-icon" size={64} />
              <h3>{t('noMoviesFound')}</h3>
              <p>{t('tryDifferentSearch')}</p>
              <button 
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div className="filters-modal" onClick={() => setShowFilters(false)}>
          <div className="filters-content" onClick={e => e.stopPropagation()}>
            <div className="filters-header">
              <h3>📋 {t('filters')}</h3>
              <button onClick={() => setShowFilters(false)} className="close-filters">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="filter-section">
              <h4>🎭 {t('genre')}</h4>
              <div className="filter-options">
                {genres.map(genre => (
                  <button
                    key={genre}
                    className={`filter-option ${selectedGenre === genre ? 'active' : ''}`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {getGenreLabel(genre)}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>📺 {t('type')}</h4>
              <div className="filter-options">
                <button
                  className={`filter-option ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  {t('all')}
                </button>
                <button
                  className={`filter-option ${selectedType === 'movie' ? 'active' : ''}`}
                  onClick={() => setSelectedType('movie')}
                >
                  🎬 {t('movie')}
                </button>
                <button
                  className={`filter-option ${selectedType === 'cartoon' ? 'active' : ''}`}
                  onClick={() => setSelectedType('cartoon')}
                >
                  ✨ {t('cartoon')}
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h4>📅 {t('year')}</h4>
              <div className="filter-options">
                {years.map(year => (
                  <button
                    key={year}
                    className={`filter-option ${selectedYear === year ? 'active' : ''}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year === 'all' ? t('all') : year}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters-actions">
              <button 
                className="apply-filters"
                onClick={() => setShowFilters(false)}
              >
                {t('apply')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="movie-modal" onClick={() => setSelectedMovie(null)}>
          <div className="movie-modal-content" onClick={e => e.stopPropagation()}>
            <div className="movie-modal-header">
              <h2>{selectedMovie.title}</h2>
              <button onClick={() => setSelectedMovie(null)} className="close-modal">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="movie-modal-body">
              <div className="movie-poster-large">
                <img 
                  src={selectedMovie.posterUrl} 
                  alt={selectedMovie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x450?text=🎬';
                  }}
                />
                <div className="movie-large-rating">
                  <FiStar /> {formatRating(selectedMovie.rating)}
                </div>
                {selectedMovie.awards && (
                  <div className="movie-award-badge">
                    <FiAward /> {selectedMovie.awards}
                  </div>
                )}
              </div>
              
              <div className="movie-details">
                <div className="movie-detail-item">
                  <FiCalendar className="detail-icon" />
                  <span><strong>{t('year')}:</strong> {selectedMovie.year}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiFilm className="detail-icon" />
                  <span><strong>{t('genre')}:</strong> {selectedMovie.genre?.slice(0, 3).join(', ')}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiClock className="detail-icon" />
                  <span><strong>{t('duration')}:</strong> {selectedMovie.duration}</span>
                </div>
                
                {selectedMovie.director && (
                  <div className="movie-detail-item">
                    <FiUser className="detail-icon" />
                    <span><strong>{t('director')}:</strong> {selectedMovie.director}</span>
                  </div>
                )}
                
                <div className="movie-description-container">
                  <p className="movie-description">{selectedMovie.description}</p>
                </div>
                
                {selectedMovie.cast?.length > 0 && (
                  <div className="movie-cast">
                    <strong>{t('cast')}:</strong>
                    <div className="cast-list">
                      {selectedMovie.cast.slice(0, 4).map((actor, index) => (
                        <span key={index} className="cast-item">{actor}</span>
                      ))}
                      {selectedMovie.cast.length > 4 && (
                        <span className="cast-item">+{selectedMovie.cast.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="modal-actions">
                  <button 
                    onClick={() => handleLike(selectedMovie.id)}
                    className={`like-btn ${likedMovies.includes(selectedMovie.id) ? 'liked' : ''}`}
                  >
                    <FiHeart /> 
                    {likedMovies.includes(selectedMovie.id) ? t('favorite') : t('addToFavorites')}
                  </button>
                  
                  <button 
                    onClick={() => handlePlay(selectedMovie)}
                    className={`play-movie-btn ${(!selectedMovie.videoUrl && !selectedMovie.trailerUrl) ? 'disabled' : ''}`}
                    disabled={!selectedMovie.videoUrl && !selectedMovie.trailerUrl}
                  >
                    <FiPlay /> 
                    {(selectedMovie.videoUrl || selectedMovie.trailerUrl) ? t('watch') : t('comingSoon')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KinoPage;