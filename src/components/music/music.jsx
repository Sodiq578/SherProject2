import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiHeart,
  FiList,
  FiSearch,
  FiFilter,
  FiX,
  FiVolume2,
  FiVolumeX,
  FiMusic,
  FiUser,
  FiCalendar,
  FiAward
} from 'react-icons/fi';
import './Music.css';

// Qo'shiqlar ro'yxati - KOMPONENTDAN TASHQARIDA
const mockSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    genre: "pop",
    mood: "energetic",
    language: "english",
    year: 2020,
    plays: 2500000,
    likes: 150000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    featured: true
  },
  {
    id: 2,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷",
    duration: "3:54",
    genre: "pop",
    mood: "romantic",
    language: "english",
    year: 2017,
    plays: 3500000,
    likes: 200000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    featured: true
  },
  {
    id: 3,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    genre: "rock",
    mood: "epic",
    language: "english",
    year: 1975,
    plays: 5000000,
    likes: 300000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    featured: true
  },
  {
    id: 4,
    title: "Yomg'ir",
    artist: "Yulduz Usmonova",
    album: "Sevgi",
    duration: "4:15",
    genre: "uzpop",
    mood: "sad",
    language: "uzbek",
    year: 2019,
    plays: 1500000,
    likes: 80000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273c8c0d8c6d8f8c8c8c8c8c8c8",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    featured: false
  },
  {
    id: 5,
    title: "Sen Ketma",
    artist: "Jahongir Otajonov",
    album: "Yurak",
    duration: "3:45",
    genre: "uzpop",
    mood: "romantic",
    language: "uzbek",
    year: 2021,
    plays: 1200000,
    likes: 60000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273d8d8d8d8d8d8d8d8d8d8d8d8",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    featured: false
  },
  {
    id: 6,
    title: "Lose Yourself",
    artist: "Eminem",
    album: "8 Mile",
    duration: "5:26",
    genre: "rap",
    mood: "energetic",
    language: "english",
    year: 2002,
    plays: 4000000,
    likes: 250000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2737a6c9e3c8c8c8c8c8c8c8c8",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    featured: true
  },
  {
    id: 7,
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    duration: "5:01",
    genre: "rock",
    mood: "energetic",
    language: "english",
    year: 1991,
    plays: 4500000,
    likes: 280000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b2735c5c5c5c5c5c5c5c5c5c5c5c",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    featured: true
  },
  {
    id: 8,
    title: "Uzizim",
    artist: "Shoxrux",
    album: "Sevgi",
    duration: "4:30",
    genre: "uzpop",
    mood: "romantic",
    language: "uzbek",
    year: 2022,
    plays: 900000,
    likes: 45000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273e8e8e8e8e8e8e8e8e8e8e8e8",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    featured: false
  },
  {
    id: 9,
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    genre: "rock",
    mood: "calm",
    language: "english",
    year: 1976,
    plays: 6000000,
    likes: 350000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273f9f9f9f9f9f9f9f9f9f9f9f9",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    featured: true
  },
  {
    id: 10,
    title: "Dance Monkey",
    artist: "Tones and I",
    album: "The Kids Are Coming",
    duration: "3:29",
    genre: "pop",
    mood: "energetic",
    language: "english",
    year: 2019,
    plays: 5500000,
    likes: 320000,
    coverUrl: "https://i.scdn.co/image/ab67616d0000b273a0a0a0a0a0a0a0a0a0a0a0a0",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    featured: false
  }
];

const Music = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const genres = ['all', 'pop', 'rock', 'rap', 'uzpop', 'classic', 'jazz', 'electronic'];
  const moods = ['all', 'energetic', 'romantic', 'sad', 'calm', 'epic'];
  const languages = ['all', 'english', 'uzbek', 'russian', 'korean'];

  // Qo'shiqlarni yuklash
  const loadSongs = useCallback(() => {
    const savedSongs = JSON.parse(localStorage.getItem('songs') || '[]');
    
    if (savedSongs.length === 0) {
      localStorage.setItem('songs', JSON.stringify(mockSongs));
      setSongs(mockSongs);
      setFilteredSongs(mockSongs);
    } else {
      setSongs(savedSongs);
      setFilteredSongs(savedSongs);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  // Like holatini yuklash
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    setLikedSongs(savedLikes);
  }, []);

  // Filterlash
  const filterSongs = useCallback(() => {
    let filtered = songs;

    if (searchTerm) {
      filtered = filtered.filter(song => 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(song => song.genre === selectedGenre);
    }

    if (selectedMood !== 'all') {
      filtered = filtered.filter(song => song.mood === selectedMood);
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(song => song.language === selectedLanguage);
    }

    setFilteredSongs(filtered);
  }, [songs, searchTerm, selectedGenre, selectedMood, selectedLanguage]);

  useEffect(() => {
    filterSongs();
  }, [filterSongs]);

  // Audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  const handlePlay = (song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  const handleLike = (songId) => {
    const newLikes = likedSongs.includes(songId)
      ? likedSongs.filter(id => id !== songId)
      : [...likedSongs, songId];
    
    setLikedSongs(newLikes);
    localStorage.setItem('likedSongs', JSON.stringify(newLikes));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSelectedMood('all');
    setSelectedLanguage('all');
  };

  const getGenreName = (genre) => {
    const names = {
      'pop': 'Pop',
      'rock': 'Rock',
      'rap': 'Rap',
      'uzpop': 'O\'zbek pop',
      'classic': 'Klassik',
      'jazz': 'Jazz',
      'electronic': 'Elektron'
    };
    return names[genre] || genre;
  };

  const featuredSongs = songs.filter(s => s.featured).slice(0, 5);

  if (loading) {
    return (
      <div className="music-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Qo'shiqlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="music-container">
      <audio ref={audioRef} src={currentSong?.audioUrl} />

      {/* Header */}
      <div className="music-header">
        <h1>
          <FiMusic className="header-icon" />
          Musiqa
        </h1>
        <div className="header-right">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Qo'shiq yoki artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FiX size={16} />
              </button>
            )}
          </div>
          <button 
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Featured Section */}
      {featuredSongs.length > 0 && !searchTerm && selectedGenre === 'all' && selectedMood === 'all' && selectedLanguage === 'all' && (
        <div className="featured-section">
          <h2>Tavsiya etilgan</h2>
          <div className="featured-grid">
            {featuredSongs.map(song => (
              <div key={song.id} className="featured-card">
                <img src={song.coverUrl} alt={song.title} />
                <div className="featured-info">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                  <button 
                    className="play-featured"
                    onClick={() => handlePlay(song)}
                  >
                    {currentSong?.id === song.id && isPlaying ? <FiPause /> : <FiPlay />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters sdsfv */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h4>Janr</h4>
            <div className="filter-options">
              {genres.map(genre => (
                <button
                  key={genre}
                  className={`filter-option ${selectedGenre === genre ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre === 'all' ? 'Barchasi' : getGenreName(genre)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Kayfiyat</h4>
            <div className="filter-options">
              {moods.map(mood => (
                <button
                  key={mood}
                  className={`filter-option ${selectedMood === mood ? 'active' : ''}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood === 'all' ? 'Barchasi' : mood}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Til</h4>
            <div className="filter-options">
              {languages.map(lang => (
                <button
                  key={lang}
                  className={`filter-option ${selectedLanguage === lang ? 'active' : ''}`}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang === 'all' ? 'Barchasi' : lang}
                </button>
              ))}
            </div>
          </div>

          <div className="filters-actions">
            <button className="clear-filters" onClick={clearFilters}>
              Tozalash
            </button>
          </div>
        </div>
      )}

      {/* Songs List */}
      <div className="songs-list">
        <div className="list-header">
          <span className="col-number">#</span>
          <span className="col-title">Qo'shiq</span>
          <span className="col-artist">Artist</span>
          <span className="col-album">Albom</span>
          <span className="col-duration">Davomiylik</span>
          <span className="col-actions"></span>
        </div>

        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <div 
              key={song.id} 
              className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
            >
              <span className="col-number">{index + 1}</span>
              <div className="col-title">
                <img src={song.coverUrl} alt={song.title} className="song-cover-small" />
                <div>
                  <div className="song-title">{song.title}</div>
                  {song.featured && <span className="featured-badge">Tavsiya</span>}
                </div>
              </div>
              <span className="col-artist">{song.artist}</span>
              <span className="col-album">{song.album}</span>
              <span className="col-duration">{song.duration}</span>
              <div className="col-actions">
                <button 
                  className={`like-btn ${likedSongs.includes(song.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(song.id)}
                >
                  <FiHeart />
                </button>
                <button 
                  className="play-btn"
                  onClick={() => handlePlay(song)}
                >
                  {currentSong?.id === song.id && isPlaying ? <FiPause /> : <FiPlay />}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <FiMusic size={48} />
            <h3>Qo'shiqlar topilmadi</h3>
            <p>Boshqa qidiruv so'zini kiriting yoki filtrlarni tozalang</p>
            <button className="clear-all-btn" onClick={clearFilters}>
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </div>

      {/* Player Controls */}
      {currentSong && (
        <div className="player-controls">
          <div className="player-info">
            <img src={currentSong.coverUrl} alt={currentSong.title} className="player-cover" />
            <div>
              <div className="player-title">{currentSong.title}</div>
              <div className="player-artist">{currentSong.artist}</div>
            </div>
            <button 
              className={`player-like ${likedSongs.includes(currentSong.id) ? 'liked' : ''}`}
              onClick={() => handleLike(currentSong.id)}
            >
              <FiHeart />
            </button>
          </div>

          <div className="player-main">
            <div className="player-buttons">
              <button className="player-btn">
                <FiSkipBack />
              </button>
              <button 
                className="player-btn play-pause"
                onClick={() => handlePlay(currentSong)}
              >
                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
              </button>
              <button className="player-btn">
                <FiSkipForward />
              </button>
            </div>

            <div className="player-progress">
              <span className="time">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="progress-bar"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
              />
              <span className="time">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="player-volume">
            <button className="volume-btn" onClick={toggleMute}>
              {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
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
      )}
    </div>
  );
};

export default Music;