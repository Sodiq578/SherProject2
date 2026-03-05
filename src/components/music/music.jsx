import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaMusic } from 'react-icons/fa';
import './Music.css';

const API_URL = 'https://free-music-api2.vercel.app/getSongs';

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);

  const audioRef = useRef(null);

  // API dan qo'shiqlarni olish
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        }
        const data = await response.json();
        setSongs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // Audio element holatini kuzatish
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback xatosi:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  // Qo'shiq tanlash
  const handleSongSelect = (song, index) => {
    if (currentSong?._id === song._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  // Keyingi qo'shiqqa o'tish
  const handleNext = () => {
    if (songs.length > 0 && currentSongIndex < songs.length - 1) {
      const nextIndex = currentSongIndex + 1;
      setCurrentSong(songs[nextIndex]);
      setCurrentSongIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  // Oldingi qo'shiqqa qaytish
  const handlePrev = () => {
    if (songs.length > 0 && currentSongIndex > 0) {
      const prevIndex = currentSongIndex - 1;
      setCurrentSong(songs[prevIndex]);
      setCurrentSongIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  // Yuklanayotgan holat
  if (loading) {
    return (
      <div className="music-container">
        <div className="loader-container">
          <FaMusic className="loader-icon" />
          <p className="loader-text">Musiqalar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Xatolik yuz berganda
  if (error) {
    return (
      <div className="music-container">
        <div className="error-container">
          <p className="error-text">Xatolik: {error}</p>
          <button onClick={() => window.location.reload()} className="reload-button">
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  // Asosiy interfeys
  return (
    <div className="music-container">
      {/* Chap tomondagi pleer va hozirgi qo'shiq ma'lumotlari */}
      <div className="player-section">
        {currentSong ? (
          <>
            <div className="album-art-container">
              <img 
                src={currentSong.songBanner} 
                alt={currentSong.songName}
                className="album-art"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x300?text=🎵';
                }}
              />
            </div>
            <div className="song-info">
              <h2 className="song-name">{currentSong.songName}</h2>
              <p className="singer-name">{currentSong.singer}</p>
            </div>
            <div className="controls">
              <button onClick={handlePrev} className="control-button">
                <FaStepBackward />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className="control-button play-button"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={handleNext} className="control-button">
                <FaStepForward />
              </button>
            </div>
            <audio 
              ref={audioRef}
              src={currentSong.url}
              onEnded={handleNext}
            />
          </>
        ) : (
          <div className="no-song-selected">
            <FaMusic className="no-song-icon" />
            <p>Qo'shiq tanlang</p>
          </div>
        )}
      </div>

      {/* O'ng tomondagi qo'shiqlar ro'yxati */}
      <div className="playlist-section">
        <h2 className="playlist-title">🎵 Qo'shiqlar ro'yxati</h2>
        <div className="playlist">
          {songs.map((song, index) => (
            <div
              key={song._id}
              className={`playlist-item ${currentSong?._id === song._id ? 'active-item' : ''}`}
              onClick={() => handleSongSelect(song, index)}
            >
              <img 
                src={song.songBanner} 
                alt={song.songName}
                className="playlist-item-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/50x50?text=🎵';
                }}
              />
              <div className="playlist-item-info">
                <p className="playlist-item-name">{song.songName}</p>
                <p className="playlist-item-singer">{song.singer}</p>
              </div>
              {currentSong?._id === song._id && isPlaying && (
                <div className="playing-indicator">
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}