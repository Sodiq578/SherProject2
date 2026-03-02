import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiShare2, 
  FiHeart,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiMinimize2,
  FiPlay,
  FiPause,
  FiSettings,
  FiStar,
  FiFilm,
  FiInfo,
  FiCalendar,
  FiClock,
  FiX
} from 'react-icons/fi';
import './KinoWatch.css';

const KinoWatch = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [videoError, setVideoError] = useState(false);
  const [isTrailer, setIsTrailer] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  // YouTube treylerlar
  const trailers = {
    1: "https://www.youtube.com/embed/U2Qp5pL3ovA?autoplay=1",
    2: "https://www.youtube.com/embed/Idh8n5XuYIA?autoplay=1",
    3: "https://www.youtube.com/embed/_inKs4eeHiI?autoplay=1",
    4: "https://www.youtube.com/embed/bK6ldnjE3Y0?autoplay=1",
    5: "https://www.youtube.com/embed/pBk4NYhWNMM?autoplay=1",
    6: "https://www.youtube.com/embed/shW9i6k8cB0?autoplay=1",
    7: "https://www.youtube.com/embed/qEVUtrk8_B4?autoplay=1",
    8: "https://www.youtube.com/embed/giXco2jaZ_4?autoplay=1",
    9: "https://www.youtube.com/embed/a8Gx8wiNbs8?autoplay=1",
    10: "https://www.youtube.com/embed/mqqft2x_Aa4?autoplay=1",
    11: "https://www.youtube.com/embed/8g18jFHCLXk?autoplay=1",
    12: "https://www.youtube.com/embed/JfVOs4VSpmA?autoplay=1",
    13: "https://www.youtube.com/embed/CaimKeDcudo?autoplay=1",
    14: "https://www.youtube.com/embed/LdOM0x0XDMo?autoplay=1",
    15: "https://www.youtube.com/embed/4TojlZYqPUo?autoplay=1",
    16: "https://www.youtube.com/embed/TcMBFSGVi1c?autoplay=1",
    17: "https://www.youtube.com/embed/zAGVQLHvwOY?autoplay=1",
    18: "https://www.youtube.com/embed/wmiIUN-7qhE?autoplay=1",
    19: "https://www.youtube.com/embed/6ZfuNTqbHE8?autoplay=1",
    20: "https://www.youtube.com/embed/g4Hbz2jLxvQ?autoplay=1",
    21: "https://www.youtube.com/embed/F-eMt3SrfFU?autoplay=1",
    22: "https://www.youtube.com/embed/Ga6RYejo6Hk?autoplay=1",
    23: "https://www.youtube.com/embed/LoebZZ8K5N0?autoplay=1",
    24: "https://www.youtube.com/embed/jWM0ct-OLsM?autoplay=1",
    25: "https://www.youtube.com/embed/hEJnMQG9ev8?autoplay=1",
    26: "https://www.youtube.com/embed/seMwpP0yeu4?autoplay=1",
    27: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1",
    28: "https://www.youtube.com/embed/fZ_JOBCLF-I?autoplay=1",
    29: "https://www.youtube.com/embed/iszwuX1AK6A?autoplay=1",
    30: "https://www.youtube.com/embed/TbQm5doF_Uc?autoplay=1",
    31: "https://www.youtube.com/embed/g8evyE9TuYk?autoplay=1",
    32: "https://www.youtube.com/embed/87E6N7ToCxs?autoplay=1",
    33: "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1",
    34: "https://www.youtube.com/embed/JcpWXaA2qeg?autoplay=1",
    35: "https://www.youtube.com/embed/5PSNL1qE6VY?autoplay=1",
    36: "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1",
    37: "https://www.youtube.com/embed/CZ1CATNbXg0?autoplay=1",
    38: "https://www.youtube.com/embed/RLtaA9fFNXU?autoplay=1",
    39: "https://www.youtube.com/embed/r5X-hFf6Bwo?autoplay=1",
    40: "https://www.youtube.com/embed/2zLkasScy7A?autoplay=1",
    41: "https://www.youtube.com/embed/vKQi3bBA1y8?autoplay=1",
    42: "https://www.youtube.com/embed/Lu0sotERXhI?autoplay=1",
    43: "https://www.youtube.com/embed/CHekzSiZjrY?autoplay=1",
    44: "https://www.youtube.com/embed/s7EdQ4FqbhY?autoplay=1",
    45: "https://www.youtube.com/embed/lFzVJEksoDY?autoplay=1",
    46: "https://www.youtube.com/embed/gG22XNhtnoY?autoplay=1",
    47: "https://www.youtube.com/embed/qvsgGtivCgs?autoplay=1",
    48: "https://www.youtube.com/embed/BSXBvor47Zs?autoplay=1",
    49: "https://www.youtube.com/embed/qYAETtIIClk?autoplay=1",
    50: "https://www.youtube.com/embed/JNwNXF9Y6kY?autoplay=1"
  };

  // Asl video manzillari
  const videoUrls = {
    1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    16: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    27: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    33: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    36: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    41: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    43: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    44: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    45: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  };

  useEffect(() => {
    loadMovie();
  }, [id]);

  useEffect(() => {
    if (videoRef.current && !isTrailer) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.addEventListener('ended', handleVideoEnd);
      videoRef.current.addEventListener('error', handleVideoError);
    }

    return () => {
      if (videoRef.current && !isTrailer) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoRef.current.removeEventListener('ended', handleVideoEnd);
        videoRef.current.removeEventListener('error', handleVideoError);
      }
    };
  }, [movie, isTrailer]);

  const loadMovie = () => {
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    const foundMovie = savedMovies.find(m => m.id === parseInt(id));
    
    if (foundMovie) {
      if (videoUrls[foundMovie.id]) {
        foundMovie.videoUrl = videoUrls[foundMovie.id];
        setIsTrailer(false);
      } else if (trailers[foundMovie.id]) {
        foundMovie.trailerUrl = trailers[foundMovie.id];
        setIsTrailer(true);
      }
      
      setMovie(foundMovie);
      loadRecommendedMovies(foundMovie, savedMovies);
      
      const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
      setIsLiked(likedMovies.includes(foundMovie.id));
    }
    
    setIsLoading(false);
  };

  const loadRecommendedMovies = (currentMovie, allMovies) => {
    const recommended = allMovies
      .filter(m => m.id !== currentMovie.id && 
             m.genre?.some(g => currentMovie.genre?.includes(g)))
      .slice(0, 6)
      .map(m => ({
        ...m,
        trailerUrl: trailers[m.id],
        videoUrl: videoUrls[m.id]
      }));
    setRecommendedMovies(recommended);
  };

  const handleVideoError = () => {
    setVideoError(true);
    if (movie && trailers[movie.id]) {
      setIsTrailer(true);
      setVideoError(false);
    }
  };

  const handleGoBack = () => {
    navigate('/kino');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link nusxalandi!');
    }
  };

  const handleDownload = () => {
    if (movie.videoUrl) {
      window.open(movie.videoUrl, '_blank');
    } else if (movie.trailerUrl) {
      window.open(movie.trailerUrl.replace('?autoplay=1', ''), '_blank');
    }
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    if (newLiked) {
      likedMovies.push(movie.id);
    } else {
      const index = likedMovies.indexOf(movie.id);
      if (index > -1) likedMovies.splice(index, 1);
    }
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const togglePlay = () => {
    if (isTrailer) {
      const iframe = document.querySelector('iframe');
      if (iframe) {
        const src = iframe.src;
        iframe.src = '';
        iframe.src = src;
      }
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    if (!isTrailer && videoRef.current) {
      const seekTime = parseFloat(e.target.value);
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (!isTrailer && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    if (!isTrailer && videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlaybackSpeed = (speed) => {
    if (!isTrailer && videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setShowSettings(false);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/kino/watch/${movieId}`);
    window.location.reload();
  };

  const retryVideo = () => {
    setVideoError(false);
    if (movie && trailers[movie.id]) {
      setIsTrailer(true);
    } else if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  if (isLoading) {
    return (
      <div className="watch-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Kino yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="watch-container">
        <div className="error-container">
          <FiFilm size={64} className="error-icon" />
          <h2>Kino topilmadi</h2>
          <p>Kechirasiz, siz qidirayotgan kino mavjud emas.</p>
          <button onClick={handleGoBack} className="back-btn-large">
            <FiArrowLeft /> Kinolarga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-container" ref={containerRef}>
      {/* Header */}
      <div className="watch-header">
        <button onClick={handleGoBack} className="watch-back-btn">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="watch-title">{movie.title}</h1>
        <div className="watch-actions">
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            className={`action-btn ${showInfo ? 'active' : ''}`}
            title="Ma'lumot"
          >
            <FiInfo size={20} />
          </button>
          <button 
            onClick={handleLike} 
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            title={isLiked ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
          >
            <FiHeart size={20} />
          </button>
          <button onClick={handleShare} className="action-btn" title="Ulashish">
            <FiShare2 size={20} />
          </button>
          <button onClick={handleDownload} className="action-btn" title="Yuklab olish">
            <FiDownload size={20} />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div 
        className="video-player-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {isTrailer ? (
          <>
            <iframe
              src={movie.trailerUrl}
              className="video-player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={movie.title}
            ></iframe>
            
            <div className="trailer-badge">
              <FiFilm /> TREYLER
            </div>
          </>
        ) : movie.videoUrl && !videoError ? (
          <>
            <video
              ref={videoRef}
              className="video-player"
              poster={movie.posterUrl}
              onClick={togglePlay}
              autoPlay
              onError={handleVideoError}
            >
              <source src={movie.videoUrl} type="video/mp4" />
              Sizning brauzeringiz video formatini qo'llab-quvvatlamaydi.
            </video>

            {!isPlaying && (
              <div className="video-paused-overlay" onClick={togglePlay}>
                <div className="play-button-large">
                  <FiPlay size={48} />
                </div>
              </div>
            )}

            <div className={`video-controls ${showControls ? 'visible' : ''}`}>
              <div className="progress-bar-container">
                <input
                  type="range"
                  className="progress-bar"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  style={{
                    background: `linear-gradient(to right, #0066ff 0%, #0066ff ${(currentTime / duration) * 100}%, #333 ${(currentTime / duration) * 100}%, #333 100%)`
                  }}
                />
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="controls-bottom">
                <div className="controls-left">
                  <button onClick={togglePlay} className="control-btn">
                    {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
                  </button>
                  
                  <div className="volume-control">
                    <button onClick={toggleMute} className="control-btn">
                      {isMuted || volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      className="volume-slider"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                    />
                  </div>
                </div>

                <div className="controls-right">
                  <div className="settings-container">
                    <button 
                      className="control-btn"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <FiSettings size={20} />
                    </button>
                    
                    {showSettings && (
                      <div className="settings-menu">
                        <div className="settings-section">
                          <h4>Tezlik</h4>
                          {[0.5, 1, 1.25, 1.5, 2].map(speed => (
                            <button
                              key={speed}
                              className={`settings-option ${playbackSpeed === speed ? 'active' : ''}`}
                              onClick={() => handlePlaybackSpeed(speed)}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button onClick={toggleFullscreen} className="control-btn">
                    {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-video-placeholder">
            <FiFilm size={64} />
            <h3>Video tayyorlanmoqda</h3>
            <p>Bu kino uchun video hozircha mavjud emas</p>
            <p className="coming-soon">Tez kunda!</p>
            <button onClick={handleGoBack} className="retry-btn">
              Kinolarga qaytish
            </button>
          </div>
        )}
      </div>

      {/* Movie Info Panel */}
      <div className={`movie-info-panel ${showInfo ? 'visible' : ''}`}>
        <div className="movie-info-header">
          <h3>Film haqida</h3>
          <button onClick={() => setShowInfo(false)} className="close-info">
            <FiX size={20} />
          </button>
        </div>
        
        <div className="movie-info-content">
          <div className="movie-stats-grid">
            <div className="stat-card">
              <FiStar className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Reyting</span>
                <span className="stat-value">{movie.rating?.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <FiCalendar className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Yil</span>
                <span className="stat-value">{movie.year}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <FiClock className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Davomiylik</span>
                <span className="stat-value">{movie.duration}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <FiFilm className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Janr</span>
                <span className="stat-value">{movie.genre?.[0]}</span>
              </div>
            </div>
          </div>

          <div className="movie-description">
            <h4>Syujet</h4>
            <p>{movie.description}</p>
          </div>

          {movie.director && (
            <div className="movie-director">
              <h4>Rejissyor</h4>
              <p>{movie.director}</p>
            </div>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <div className="movie-cast">
              <h4>Aktyorlar</h4>
              <div className="cast-list">
                {movie.cast.map((actor, index) => (
                  <span key={index} className="cast-item">{actor}</span>
                ))}
              </div>
            </div>
          )}

          {movie.awards && (
            <div className="movie-awards">
              <h4>Mukofotlar</h4>
              <p>{movie.awards}</p>
            </div>
          )}

          {isTrailer && (
            <div className="trailer-notice">
              <FiInfo />
              <span>Bu kino uchun treyler ko'rsatilmoqda. To'liq film tez kunda!</span>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Movies */}
      {recommendedMovies.length > 0 && (
        <div className="recommended-section">
          <h3>Sizga ham yoqishi mumkin</h3>
          <div className="recommended-grid">
            {recommendedMovies.map(recMovie => (
              <div 
                key={recMovie.id} 
                className="recommended-card"
                onClick={() => handleMovieClick(recMovie.id)}
              >
                <div className="recommended-poster">
                  <img src={recMovie.posterUrl} alt={recMovie.title} />
                  {recMovie.trailerUrl && !recMovie.videoUrl && (
                    <div className="recommended-trailer-badge">TREYLER</div>
                  )}
                </div>
                <div className="recommended-info">
                  <h4>{recMovie.title}</h4>
                  <div className="recommended-meta">
                    <span className="recommended-year">{recMovie.year}</span>
                    <span className="recommended-rating">
                      <FiStar /> {recMovie.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KinoWatch;