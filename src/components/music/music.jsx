import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaMusic,
  FaHeadphones,
  FaRandom,
  FaRedoAlt,
  FaVolumeUp,
  FaList
} from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import './Music.css';

const API_URL = 'https://free-music-api2.vercel.app/getSongs';
const CACHE_DURATION = 5 * 60 * 1000; // 5 daqiqa
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop';

// Preload funksiyasi
const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

// Vaqtni formatlash (kesh bilan)
const timeCache = new Map();
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const cacheKey = Math.floor(seconds);
  if (timeCache.has(cacheKey)) {
    return timeCache.get(cacheKey);
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const result = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  timeCache.set(cacheKey, result);
  return result;
};

export default function Music() {
  // State'larni birlashtirish
  const [songs, setSongs] = useState([]);
  const [currentState, setCurrentState] = useState({
    song: null,
    index: -1,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    volume: 1,
    showPlaylist: true
  });
  const [progress, setProgress] = useState({
    currentTime: 0,
    duration: 0,
    percent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reflar
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const animationRef = useRef(null);
  const cacheRef = useRef({
    songs: null,
    timestamp: null
  });

  // Yuklash funksiyasi
  const fetchSongs = useCallback(async (force = false) => {
    // Keshni tekshirish
    if (!force && cacheRef.current.songs && 
        Date.now() - cacheRef.current.timestamp < CACHE_DURATION) {
      setSongs(cacheRef.current.songs);
      if (cacheRef.current.songs.length > 0) {
        setCurrentState(prev => ({
          ...prev,
          song: cacheRef.current.songs[0],
          index: 0
        }));
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 sekund timeout

      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Ma\'lumotlarni yuklashda xatolik');
      }
      
      const data = await response.json();
      
      // Ma'lumotlarni keshlash
      cacheRef.current = {
        songs: data,
        timestamp: Date.now()
      };
      
      setSongs(data);
      
      if (data.length > 0) {
        // Birinchi rasmni preload qilish
        preloadImage(data[0]?.songBanner || FALLBACK_IMAGE);
        
        setCurrentState(prev => ({
          ...prev,
          song: data[0],
          index: 0
        }));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('So\'rov vaqti tugadi');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Dastlabki yuklash
  useEffect(() => {
    fetchSongs();
    
    // Cleanup - animationRef.current ni o'zgaruvchiga saqlash
    const currentAnimation = animationRef.current;
    return () => {
      if (currentAnimation) {
        cancelAnimationFrame(currentAnimation);
      }
    };
  }, [fetchSongs]);

  // Keyingi qo'shiq
  const handleNext = useCallback(() => {
    if (songs.length === 0 || !currentState.song) return;
    
    let nextIndex;
    if (currentState.isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentState.index + 1) % songs.length;
    }
    
    // Keyingi qo'shiqni preload qilish
    if (songs[nextIndex + 1]) {
      preloadImage(songs[nextIndex + 1].songBanner);
    }
    
    setCurrentState(prev => ({
      ...prev,
      song: songs[nextIndex],
      index: nextIndex,
      isPlaying: true
    }));
  }, [songs, currentState.song, currentState.index, currentState.isShuffle]);

  // Oldingi qo'shiq
  const handlePrev = useCallback(() => {
    if (songs.length === 0 || !currentState.song) return;
    
    let prevIndex = currentState.index - 1;
    if (prevIndex < 0) {
      prevIndex = songs.length - 1;
    }
    
    setCurrentState(prev => ({
      ...prev,
      song: songs[prevIndex],
      index: prevIndex,
      isPlaying: true
    }));
  }, [songs, currentState.song, currentState.index]);

  // Tasodifiy qo'shiq
  const handleShuffle = useCallback(() => {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    
    setCurrentState(prev => ({
      ...prev,
      song: songs[randomIndex],
      index: randomIndex,
      isPlaying: true
    }));
  }, [songs]);

  // Audio event listener'lar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setProgress(prev => ({
        ...prev,
        duration: audio.duration
      }));
    };

    const updateProgress = () => {
      setProgress({
        currentTime: audio.currentTime,
        duration: audio.duration,
        percent: (audio.currentTime / audio.duration) * 100 || 0
      });
    };

    const handleEnded = () => {
      if (currentState.isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else if (currentState.isShuffle) {
        handleShuffle();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentState.isRepeat, currentState.isShuffle, handleNext, handleShuffle]);

  // Audio play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentState.song) return;

    if (currentState.isPlaying) {
      audio.play().catch(e => {
        console.error("Playback xatosi:", e);
        setCurrentState(prev => ({ ...prev, isPlaying: false }));
      });
    } else {
      audio.pause();
    }
  }, [currentState.isPlaying, currentState.song]);

  // Ovoz balandligi
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentState.volume;
    }
  }, [currentState.volume]);

  // Progress barni optimallashtirish
  const handleProgressChange = useCallback((e) => {
    if (!progressRef.current || !audioRef.current || !progress.duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    const newTime = (percentage / 100) * progress.duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(prev => ({ ...prev, currentTime: newTime }));
  }, [progress.duration]);

  // Qo'shiq tanlash
  const handleSongSelect = useCallback((song, index) => {
    if (currentState.song?._id === song._id) {
      setCurrentState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    } else {
      // Keyingi rasmni preload qilish
      if (songs[index + 1]) {
        preloadImage(songs[index + 1].songBanner);
      }
      
      setCurrentState(prev => ({
        ...prev,
        song,
        index,
        isPlaying: true
      }));
    }
  }, [currentState.song, songs]);

  // Memoized qiymatlar
  const currentSong = useMemo(() => currentState.song, [currentState.song]);
  const currentTimeFormatted = useMemo(() => 
    formatTime(progress.currentTime), [progress.currentTime]
  );
  const durationFormatted = useMemo(() => 
    formatTime(progress.duration), [progress.duration]
  );

  // Yuklanayotgan holat
  if (loading) {
    return (
      <div className="music-loader">
        <div className="loader-spinner">
          <FaHeadphones className="spinner-icon" />
        </div>
        <p className="loader-text">Musiqalar yuklanmoqda...</p>
        <div className="loader-progress">
          <div className="loader-bar"></div>
        </div>
      </div>
    );
  }

  // Xatolik
  if (error) {
    return (
      <div className="music-error">
        <div className="error-content">
          <FaMusic className="error-icon" />
          <h2>Xatolik yuz berdi</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => fetchSongs(true)} className="error-button">
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="music-app">
      {/* Background (optimallashtirilgan) */}
      <div className="music-bg">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <div className="music-main">
        {/* Header */}
        <div className="music-header">
          <div className="header-left">
            <FaHeadphones className="header-icon" />
            <h1>Musiqa Dunyosi</h1>
          </div>
          <div className="header-right">
            <button 
              className="header-button" 
              onClick={() => setCurrentState(prev => ({ ...prev, showPlaylist: !prev.showPlaylist }))}
            >
              <FaList />
            </button>
            <button className="header-button">
              <FiMoreVertical />
            </button>
          </div>
        </div>

        <div className="music-content">
          {/* Player Section */}
          <div className={`player-wrapper ${!currentState.showPlaylist ? 'expanded' : ''}`}>
            {currentSong ? (
              <>
                <div className="player-card">
                  <div className="album-wrapper">
                    <div className="album-glow"></div>
                    <img 
                      src={currentSong.songBanner || FALLBACK_IMAGE} 
                      alt={currentSong.songName}
                      className="album-image"
                      loading="lazy"
                      decoding="async"
                    />
                    {currentState.isPlaying && (
                      <div className="playing-badge">
                        <span className="playing-dot"></span>
                        <span>Playing</span>
                      </div>
                    )}
                  </div>

                  <div className="song-details">
                    <h2 className="song-title">{currentSong.songName}</h2>
                    <p className="song-artist">{currentSong.singer}</p>
                    
                    {/* Progress Bar */}
                    <div className="progress-container">
                      <span className="time current">{currentTimeFormatted}</span>
                      <div 
                        className="progress-bar" 
                        ref={progressRef}
                        onClick={handleProgressChange}
                      >
                        <div className="progress-fill" style={{ width: `${progress.percent}%` }}>
                          <div className="progress-handle"></div>
                        </div>
                      </div>
                      <span className="time total">{durationFormatted}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="control-buttons">
                      <button 
                        className={`control-btn ${currentState.isShuffle ? 'active' : ''}`}
                        onClick={() => setCurrentState(prev => ({ ...prev, isShuffle: !prev.isShuffle }))}
                      >
                        <FaRandom />
                      </button>
                      <button className="control-btn" onClick={handlePrev}>
                        <FaStepBackward />
                      </button>
                      <button 
                        className="control-btn play-btn" 
                        onClick={() => setCurrentState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                      >
                        {currentState.isPlaying ? <FaPause /> : <FaPlay />}
                      </button>
                      <button className="control-btn" onClick={handleNext}>
                        <FaStepForward />
                      </button>
                      <button 
                        className={`control-btn ${currentState.isRepeat ? 'active' : ''}`}
                        onClick={() => setCurrentState(prev => ({ ...prev, isRepeat: !prev.isRepeat }))}
                      >
                        <FaRedoAlt />
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="volume-control">
                      <FaVolumeUp className="volume-icon" />
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={currentState.volume}
                        onChange={(e) => setCurrentState(prev => ({ 
                          ...prev, 
                          volume: parseFloat(e.target.value) 
                        }))}
                        className="volume-slider"
                      />
                    </div>
                  </div>
                </div>

                <audio 
                  ref={audioRef}
                  src={currentSong.url}
                  preload="metadata"
                />
              </>
            ) : (
              <div className="no-song">
                <FaMusic className="no-song-icon" />
                <h3>Qo'shiq tanlanmagan</h3>
                <p>Iltimos, ro'yxatdan qo'shiq tanlang</p>
              </div>
            )}
          </div>

          {/* Playlist Section */}
          {currentState.showPlaylist && (
            <div className="playlist-wrapper">
              <div className="playlist-header">
                <h3>Qo'shiqlar ro'yxati</h3>
                <span className="song-count">{songs.length} ta qo'shiq</span>
              </div>
              
              <div className="playlist-grid">
                {songs.map((song, index) => (
                  <div
                    key={song._id}
                    className={`playlist-card ${currentSong?._id === song._id ? 'active' : ''}`}
                    onClick={() => handleSongSelect(song, index)}
                  >
                    <div className="card-image">
                      <img 
                        src={song.songBanner || FALLBACK_IMAGE} 
                        alt={song.songName}
                        loading="lazy"
                        decoding="async"
                      />
                      {currentSong?._id === song._id && currentState.isPlaying && (
                        <div className="card-playing">
                          <span className="bar"></span>
                          <span className="bar"></span>
                          <span className="bar"></span>
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <h4 className="card-title">{song.songName}</h4>
                      <p className="card-artist">{song.singer}</p>
                    </div>
                    <button className="card-more">
                      <FiMoreVertical />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}