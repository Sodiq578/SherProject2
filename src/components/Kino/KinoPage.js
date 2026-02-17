import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFilm, 
  FiStar, 
  FiArrowLeft,
  FiCalendar,
  FiTag,
  FiFilter,
  FiPlay,
  FiEye,
  FiClock,
  FiUser,
  FiHeart,
  FiShare2,
  FiDownload,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize
} from 'react-icons/fi';
import './KinoPage.css';

const KinoPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
    loadMovies();
  }, []);

  const loadMovies = () => {
    setLoading(true);
    try {
      // localStorage dan kinolarni olish
      const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
      
      // Agar localStorage bo'sh bo'lsa, test ma'lumotlarni qo'shish
      if (savedMovies.length === 0) {
        const testMovies = [
          {
            id: '1',
            title: 'Inception',
            description: 'Dom Cobb - professional o\'g\'ri, odamlarning tushlariga kirib sirlarni o\'g\'irlaydi. Uning so\'nggi vazifasi - tush ichida tush yaratish.',
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            year: 2010,
            genre: ['Sci-Fi', 'Action', 'Thriller'],
            rating: 4.5,
            type: 'movie',
            duration: '148 daq',
            director: 'Christopher Nolan',
            cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
            views: 1250,
            likes: 342,
            createdAt: '2024-01-15T10:30:00.000Z'
          },
          {
            id: '2',
            title: 'The Dark Knight',
            description: 'Betmen Joker nomli yangi dushmanga qarshi kurashadi. Joker Gotham shahrida tartibsizlik keltiradi.',
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            year: 2008,
            genre: ['Action', 'Drama', 'Crime'],
            rating: 4.8,
            type: 'movie',
            duration: '152 daq',
            director: 'Christopher Nolan',
            cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
            views: 2100,
            likes: 567,
            createdAt: '2024-01-16T11:20:00.000Z'
          },
          {
            id: '3',
            title: 'Toy Story',
            description: 'O\'yinchoqlar hayoti haqida ajoyib multfilm. Vudi va Buzz Lightyear sarguzashtlari.',
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_.jpg',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            year: 1995,
            genre: ['Animation', 'Comedy', 'Family'],
            rating: 4.7,
            type: 'cartoon',
            duration: '81 daq',
            director: 'John Lasseter',
            cast: ['Tom Hanks', 'Tim Allen', 'Don Rickles'],
            views: 3400,
            likes: 891,
            createdAt: '2024-01-17T09:15:00.000Z'
          }
        ];
        setMovies(testMovies);
        localStorage.setItem('movies', JSON.stringify(testMovies));
      } else {
        setMovies(savedMovies);
      }
      
      // Kommentariyalarni yuklash
      const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
      setComments(savedComments);
      
    } catch (err) {
      setError('Kinolar yuklanmadi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (movieId, rating) => {
    if (!currentUser) {
      alert('Baho berish uchun tizimga kiring!');
      return;
    }

    setMovies(prev => prev.map(movie => {
      if (movie.id === movieId) {
        const updatedMovie = { 
          ...movie, 
          userRating: rating, 
          rating: (movie.rating + rating) / 2 
        };
        
        // localStorage ga saqlash
        const updatedMovies = movies.map(m => m.id === movieId ? updatedMovie : m);
        localStorage.setItem('movies', JSON.stringify(updatedMovies));
        
        return updatedMovie;
      }
      return movie;
    }));
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    // Ko'rishlar sonini oshirish
    const updatedMovies = movies.map(m => {
      if (m.id === movie.id) {
        const updated = { ...m, views: (m.views || 0) + 1 };
        return updated;
      }
      return m;
    });
    setMovies(updatedMovies);
    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    
    // O'xshash kinolarni topish
    const related = movies.filter(m => 
      m.id !== movie.id && 
      m.genre.some(g => movie.genre.includes(g))
    ).slice(0, 4);
    setRelatedMovies(related);
    
    setVideoError(false);
  };

  // Video player controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLike = () => {
    if (!currentUser) {
      alert('Like bosish uchun tizimga kiring!');
      return;
    }
    setLiked(!liked);
    // Like sonini oshirish/kamaytirish
    if (selectedMovie) {
      const updatedMovies = movies.map(m => {
        if (m.id === selectedMovie.id) {
          return { 
            ...m, 
            likes: liked ? (m.likes - 1) : (m.likes + 1) 
          };
        }
        return m;
      });
      setMovies(updatedMovies);
      localStorage.setItem('movies', JSON.stringify(updatedMovies));
      setSelectedMovie(updatedMovies.find(m => m.id === selectedMovie.id));
    }
  };

  const handleSave = () => {
    if (!currentUser) {
      alert('Saqlash uchun tizimga kiring!');
      return;
    }
    setSaved(!saved);
    
    // Saqlangan kinolarni localStorage ga yozish
    const savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');
    if (!saved) {
      savedMovies.push(selectedMovie.id);
    } else {
      const index = savedMovies.indexOf(selectedMovie.id);
      if (index > -1) savedMovies.splice(index, 1);
    }
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedMovie.title,
        text: selectedMovie.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link nusxalandi!');
    }
  };

  const handleDownload = () => {
    if (selectedMovie.videoUrl) {
      window.open(selectedMovie.videoUrl, '_blank');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Fikr qoldirish uchun tizimga kiring!');
      return;
    }
    
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      movieId: selectedMovie.id,
      userId: currentUser.id,
      username: currentUser.username,
      text: commentText,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setCommentText('');
  };

  const videoRef = React.useRef(null);

  const filteredMovies = filter === 'all' 
    ? movies 
    : movies.filter(m => m.type === filter);

  if (loading) {
    return (
      <div className="kino-container loading">
        <div className="loading-spinner"></div>
        <p>Kinolar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="kino-container error">
        <FiFilm className="error-icon" />
        <h2>Xatolik yuz berdi</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Qayta urinish
        </button>
      </div>
    );
  }

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
            {/* Video Player */}
            <div className="video-player-container">
              {selectedMovie.videoUrl && !videoError ? (
                <>
                  <video
                    ref={videoRef}
                    src={selectedMovie.videoUrl}
                    poster={selectedMovie.posterUrl}
                    className="video-player"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onError={() => setVideoError(true)}
                    onClick={handlePlayPause}
                  />
                  
                  {/* Custom Controls */}
                  <div className={`video-controls ${showControls ? 'visible' : ''}`}>
                    <div className="progress-bar-container">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="progress-bar"
                      />
                      <div className="time-display">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    <div className="controls-row">
                      <div className="left-controls">
                        <button onClick={handlePlayPause} className="control-btn">
                          {isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <button onClick={handleMute} className="control-btn">
                          {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="volume-slider"
                        />
                      </div>
                      
                      <div className="right-controls">
                        <button onClick={handleFullscreen} className="control-btn">
                          {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="video-placeholder">
                  <FiFilm className="placeholder-icon" />
                  <p>Video mavjud emas</p>
                  <img 
                    src={selectedMovie.posterUrl} 
                    alt={selectedMovie.title}
                    className="placeholder-poster"
                  />
                </div>
              )}
            </div>
            
            <div className="detail-info">
              <div className="movie-title-section">
                <h2>{selectedMovie.title}</h2>
                <div className="movie-actions">
                  <button 
                    onClick={handleLike} 
                    className={`action-btn ${liked ? 'liked' : ''}`}
                  >
                    <FiHeart /> {selectedMovie.likes || 0}
                  </button>
                  <button 
                    onClick={handleSave} 
                    className={`action-btn ${saved ? 'saved' : ''}`}
                  >
                    {saved ? '✅ Saqlangan' : '🔖 Saqlash'}
                  </button>
                  <button onClick={handleShare} className="action-btn">
                    <FiShare2 />
                  </button>
                  {selectedMovie.videoUrl && (
                    <button onClick={handleDownload} className="action-btn">
                      <FiDownload />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="detail-meta">
                <span><FiCalendar /> {selectedMovie.year}</span>
                <span><FiClock /> {selectedMovie.duration}</span>
                <span><FiEye /> {selectedMovie.views || 0}</span>
              </div>
              
              <div className="detail-tags">
                {selectedMovie.genre?.map((g, i) => (
                  <span key={i} className="genre-tag">{g}</span>
                ))}
              </div>
              
              <div className="detail-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                      key={star}
                      className={`star ${star <= (selectedMovie.userRating || selectedMovie.rating) ? 'filled' : ''}`}
                      onClick={() => handleRating(selectedMovie.id, star)}
                    />
                  ))}
                </div>
                <span className="rating-value">{selectedMovie.rating?.toFixed(1)} / 5</span>
              </div>
              
              <div className="movie-crew">
                <p><strong>Rejissyor:</strong> {selectedMovie.director || "Noma'lum"}</p>
                <p><strong>Aktyorlar:</strong> {selectedMovie.cast?.join(', ') || "Noma'lum"}</p>
              </div>
              
              <p className="detail-description">{selectedMovie.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3>Fikrlar ({comments.filter(c => c.movieId === selectedMovie.id).length})</h3>
            
            {currentUser ? (
              <form onSubmit={handleAddComment} className="comment-form">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Fikringizni yozing..."
                  className="comment-input"
                />
                <button type="submit" className="comment-submit">Yuborish</button>
              </form>
            ) : (
              <p className="login-to-comment">
                <FiUser /> Fikr qoldirish uchun <button onClick={() => navigate('/login')}>tizimga kiring</button>
              </p>
            )}
            
            <div className="comments-list">
              {comments
                .filter(c => c.movieId === selectedMovie.id)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <FiUser className="comment-avatar" />
                      <div>
                        <strong>@{comment.username}</strong>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Related Movies */}
          {relatedMovies.length > 0 && (
            <div className="related-movies">
              <h3>O'xshash kinolar</h3>
              <div className="related-grid">
                {relatedMovies.map(movie => (
                  <div 
                    key={movie.id} 
                    className="related-card"
                    onClick={() => handleMovieSelect(movie)}
                  >
                    <img src={movie.posterUrl} alt={movie.title} />
                    <div className="related-info">
                      <h4>{movie.title}</h4>
                      <p>{movie.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="movies-stats">
            <p>Jami {filteredMovies.length} ta kino</p>
          </div>
          
          <div className="movies-grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map(movie => (
                <div 
                  key={movie.id} 
                  className="movie-card"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <div className="movie-poster-container">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title}
                      className="movie-poster"
                    />
                    {movie.videoUrl && (
                      <div className="play-overlay">
                        <FiPlay className="play-icon" />
                      </div>
                    )}
                    <span className="movie-type">{movie.type === 'movie' ? '🎬 Film' : '📺 Multfilm'}</span>
                  </div>
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <div className="movie-meta">
                      <span>{movie.year}</span>
                      <span><FiClock /> {movie.duration || '?'}</span>
                    </div>
                    <div className="movie-rating">
                      <FiStar className="star-icon" />
                      <span>{movie.rating?.toFixed(1)}</span>
                      <span className="movie-views">
                        <FiEye /> {movie.views || 0}
                      </span>
                    </div>
                    <div className="movie-genres">
                      {movie.genre?.slice(0, 2).map((g, i) => (
                        <span key={i} className="mini-genre">{g}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-movies">
                <FiFilm className="no-movies-icon" />
                <h3>Hozircha kinolar yo'q</h3>
                <p>Tez orada yangi kinolar qo'shiladi</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KinoPage;