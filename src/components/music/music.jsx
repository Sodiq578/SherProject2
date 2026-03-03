import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiPlay,
  FiPause,
  FiSkipForward,
  FiSkipBack,
  FiHeart,
  FiMoreVertical,
  FiSearch,
  FiHeadphones,
  FiTrendingUp,
  FiMusic,
  FiUser,
  FiClock,
  FiCalendar,
  FiList,
  FiVolume2,
  FiVolumeX,
  FiDownload,
  FiShare2,
  FiPlus,
  FiGlobe,
  FiFlag
} from 'react-icons/fi';
import './Music.css';

const Music = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  
  const audioRef = useRef(null);
  const searchTimeout = useRef(null);

  // Dastlabki ma'lumotlar (API bo'lmaganda ishlatish uchun)
  const mockSongs = [
    // O'ZBEK QO'SHIQLARI
    {
      id: 1,
      title: "Yodingdami",
      artist: "Jahongir Otajonov",
      album: "Sevgi qo'shiqlari",
      duration: "3:45",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      category: "pop",
      country: "uzbek",
      year: 2023,
      plays: 1250000,
      likes: 45000,
      trending: true,
      language: "O'zbek"
    },
    {
      id: 2,
      title: "Sen Ketding",
      artist: "Ozodbek Nazarbekov",
      album: "Muhabbat",
      duration: "4:12",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      category: "folk",
      country: "uzbek",
      year: 2022,
      plays: 980000,
      likes: 32000,
      trending: true,
      language: "O'zbek"
    },
    {
      id: 3,
      title: "Mayli manda",
      artist: "Shohruhxon",
      album: "Yurak",
      duration: "3:30",
      cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      category: "pop",
      country: "uzbek",
      year: 2023,
      plays: 2100000,
      likes: 67000,
      trending: true,
      language: "O'zbek"
    },
    {
      id: 4,
      title: "Unutmadim",
      artist: "Rayhon",
      album: "Sevgilim",
      duration: "3:55",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      category: "pop",
      country: "uzbek",
      year: 2023,
      plays: 890000,
      likes: 28000,
      trending: false,
      language: "O'zbek"
    },
    {
      id: 5,
      title: "Yomg'ir",
      artist: "Sardor Tairov",
      album: "Hayot",
      duration: "4:05",
      cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      category: "rap",
      country: "uzbek",
      year: 2023,
      plays: 560000,
      likes: 19000,
      trending: false,
      language: "O'zbek"
    },
    {
      id: 6,
      title: "Sevgi nima?",
      artist: "Ulug'bek Rahmatullayev",
      album: "Sevgi",
      duration: "3:48",
      cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      category: "pop",
      country: "uzbek",
      year: 2022,
      plays: 750000,
      likes: 24000,
      trending: true,
      language: "O'zbek"
    },

    // XORIJY QO'SHIQLAR (INGLIZ)
    {
      id: 7,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      category: "pop",
      country: "usa",
      year: 2020,
      plays: 3500000,
      likes: 120000,
      trending: true,
      language: "Ingliz"
    },
    {
      id: 8,
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷",
      duration: "3:53",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      category: "pop",
      country: "uk",
      year: 2017,
      plays: 5200000,
      likes: 180000,
      trending: true,
      language: "Ingliz"
    },
    {
      id: 9,
      title: "Dance Monkey",
      artist: "Tones and I",
      album: "The Kids Are Coming",
      duration: "3:29",
      cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      category: "pop",
      country: "australia",
      year: 2019,
      plays: 4800000,
      likes: 150000,
      trending: true,
      language: "Ingliz"
    },

    // RUS QO'SHIQLARI
    {
      id: 10,
      title: "Кукла колдуна",
      artist: "Король и Шут",
      album: "Камнем по голове",
      duration: "4:20",
      cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
      category: "rock",
      country: "russia",
      year: 1999,
      plays: 2100000,
      likes: 89000,
      trending: false,
      language: "Rus"
    },
    {
      id: 11,
      title: "Пчеловод",
      artist: "RASA",
      album: "Пчеловод",
      duration: "2:55",
      cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
      category: "pop",
      country: "russia",
      year: 2020,
      plays: 1800000,
      likes: 67000,
      trending: true,
      language: "Rus"
    },

    // TURK QO'SHIQLARI
    {
      id: 12,
      title: "Mi Mariposa",
      artist: "Tarkan",
      album: "Karma",
      duration: "3:45",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
      category: "pop",
      country: "turkey",
      year: 2001,
      plays: 1500000,
      likes: 55000,
      trending: false,
      language: "Turk"
    },
    {
      id: 13,
      title: "Yalancı Bahar",
      artist: "Mustafa Ceceli",
      album: "Mustafa Ceceli",
      duration: "4:10",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
      category: "pop",
      country: "turkey",
      year: 2015,
      plays: 1200000,
      likes: 43000,
      trending: true,
      language: "Turk"
    },

    // KOREYS QO'SHIQLARI (K-POP)
    {
      id: 14,
      title: "Dynamite",
      artist: "BTS",
      album: "BE",
      duration: "3:19",
      cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
      category: "kpop",
      country: "korea",
      year: 2020,
      plays: 4500000,
      likes: 200000,
      trending: true,
      language: "Koreys"
    },
    {
      id: 15,
      title: "How You Like That",
      artist: "BLACKPINK",
      album: "THE ALBUM",
      duration: "3:02",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
      category: "kpop",
      country: "korea",
      year: 2020,
      plays: 3800000,
      likes: 175000,
      trending: true,
      language: "Koreys"
    },

    // YAPON QO'SHIQLARI (J-POP)
    {
      id: 16,
      title: "Lemon",
      artist: "Kenshi Yonezu",
      album: "STRAY SHEEP",
      duration: "4:15",
      cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
      category: "jpop",
      country: "japan",
      year: 2018,
      plays: 2900000,
      likes: 98000,
      trending: true,
      language: "Yapon"
    },

    // HIND QO'SHIQLARI
    {
      id: 17,
      title: "Tum Hi Ho",
      artist: "Arijit Singh",
      album: "Aashiqui 2",
      duration: "4:22",
      cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3",
      category: "bollywood",
      country: "india",
      year: 2013,
      plays: 3200000,
      likes: 145000,
      trending: true,
      language: "Hind"
    },

    // ARAB QO'SHIQLARI
    {
      id: 18,
      title: "Ya Lili",
      artist: "Balti ft. Hamouda",
      album: "Ya Lili",
      duration: "3:45",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3",
      category: "arabic",
      country: "tunisia",
      year: 2019,
      plays: 1700000,
      likes: 76000,
      trending: true,
      language: "Arab"
    },

    // TOJIK QO'SHIQLARI
    {
      id: 19,
      title: "Modar",
      artist: "Shabnam Surayo",
      album: "Tojik qo'shiqlari",
      duration: "4:30",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3",
      category: "folk",
      country: "tajikistan",
      year: 2021,
      plays: 450000,
      likes: 18000,
      trending: false,
      language: "Tojik"
    },

    // QOZOQ QO'SHIQLARI
    {
      id: 20,
      title: "Aiganym",
      artist: "Dimash Kudaibergen",
      album: "Qazaq",
      duration: "5:10",
      cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3",
      category: "classical",
      country: "kazakhstan",
      year: 2020,
      plays: 890000,
      likes: 45000,
      trending: true,
      language: "Qozoq"
    },

    // QIRG'IZ QO'SHIQLARI
    {
      id: 21,
      title: "Kyrgyz Elim",
      artist: "Mirbek Atabekov",
      album: "Kyrgyzstan",
      duration: "3:55",
      cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3",
      category: "folk",
      country: "kyrgyzstan",
      year: 2022,
      plays: 340000,
      likes: 12000,
      trending: false,
      language: "Qirg'iz"
    },

    // FRANSUZ QO'SHIQLARI
    {
      id: 22,
      title: "Dernière Danse",
      artist: "Indila",
      album: "Mini World",
      duration: "3:33",
      cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3",
      category: "pop",
      country: "france",
      year: 2013,
      plays: 2300000,
      likes: 89000,
      trending: true,
      language: "Fransuz"
    },

    // NEMIS QO'SHIQLARI
    {
      id: 23,
      title: "Atemlos durch die Nacht",
      artist: "Helene Fischer",
      album: "Farbenspiel",
      duration: "3:38",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3",
      category: "pop",
      country: "germany",
      year: 2013,
      plays: 1900000,
      likes: 67000,
      trending: true,
      language: "Nemis"
    },

    // ITALYAN QO'SHIQLARI
    {
      id: 24,
      title: "Volare",
      artist: "Domenico Modugno",
      album: "Nel blu dipinto di blu",
      duration: "3:35",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3",
      category: "classical",
      country: "italy",
      year: 1958,
      plays: 1200000,
      likes: 55000,
      trending: false,
      language: "Italyan"
    },

    // ISPAN QO'SHIQLARI
    {
      id: 25,
      title: "Despacito",
      artist: "Luis Fonsi ft. Daddy Yankee",
      album: "Vida",
      duration: "3:48",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3",
      category: "latin",
      country: "spain",
      year: 2017,
      plays: 6800000,
      likes: 250000,
      trending: true,
      language: "Ispan"
    }
  ];

  // API dan ma'lumot olish
  const fetchSongsFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock ma'lumotlar
      setTimeout(() => {
        setSongs(mockSongs);
        setFilteredSongs(mockSongs);
        
        // Trend qo'shiqlarni filter qilish
        const trending = mockSongs.filter(song => song.trending);
        setTrendingSongs(trending);
        
        // LocalStorage dan favorite va recently played larni olish
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
        const savedRecently = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
        const savedPlaylists = JSON.parse(localStorage.getItem('playlists') || '[]');
        
        setFavorites(savedFavorites);
        setRecentlyPlayed(savedRecently);
        setPlaylists(savedPlaylists);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('API xatosi:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongsFromAPI();
  }, [fetchSongsFromAPI]);

  // Qidiruv funksiyasi
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      let filtered = songs;

      // Qidiruv bo'yicha filter
      if (searchQuery) {
        filtered = filtered.filter(song => 
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Kategoriya bo'yicha filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(song => song.category === selectedCategory);
      }

      // Davlat bo'yicha filter
      if (selectedCountry !== 'all') {
        filtered = filtered.filter(song => song.country === selectedCountry);
      }

      setFilteredSongs(filtered);
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery, selectedCategory, selectedCountry, songs]);

  // Audio player funksiyalari
  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(song);
      setShowPlayer(true);
      
      // Recently played ga qo'shish
      const updatedRecently = [song, ...recentlyPlayed.filter(s => s.id !== song.id)].slice(0, 10);
      setRecentlyPlayed(updatedRecently);
      localStorage.setItem('recentlyPlayed', JSON.stringify(updatedRecently));
      
      // Audio yuklangandan keyin play qilish
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentSong) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const nextSong = filteredSongs[currentIndex + 1] || filteredSongs[0];
    setCurrentSong(nextSong);
    
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 100);
  };

  const playPrevious = () => {
    if (!currentSong) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentSong.id);
    const prevSong = filteredSongs[currentIndex - 1] || filteredSongs[filteredSongs.length - 1];
    setCurrentSong(prevSong);
    
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 100);
  };

  const toggleFavorite = (song) => {
    let updatedFavorites;
    if (favorites.some(f => f.id === song.id)) {
      updatedFavorites = favorites.filter(f => f.id !== song.id);
    } else {
      updatedFavorites = [...favorites, song];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteSongs', JSON.stringify(updatedFavorites));
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Playlist yaratish
  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
      created: new Date().toISOString()
    };
    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  };

  const addToPlaylist = (playlistId, song) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId && !playlist.songs.some(s => s.id === song.id)) {
        return { ...playlist, songs: [...playlist.songs, song] };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  };

  // Statistik ma'lumotlar
  const getTotalPlays = () => {
    return songs.reduce((acc, song) => acc + song.plays, 0).toLocaleString();
  };

  const getUniqueArtists = () => {
    return new Set(songs.map(s => s.artist)).size;
  };

  return (
    <div className="music-container">
      {/* Header */}
      <div className="music-header">
        <div className="header-left">
          <h1>
            <FiHeadphones className="header-icon" />
            Musiqa Dunyosi
          </h1>
          <div className="header-stats">
            <span className="stat-item">
              <FiMusic /> {songs.length} ta qo'shiq
            </span>
            <span className="stat-item">
              <FiUser /> {getUniqueArtists()} ta artist
            </span>
            <span className="stat-item">
              <FiTrendingUp /> {getTotalPlays()} marta eshitilgan
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Qo'shiq, artist yoki albom qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="music-filters">
        <div className="filter-group">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Barchasi
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'pop' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('pop')}
          >
            Pop
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'rock' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('rock')}
          >
            Rock
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'rap' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('rap')}
          >
            Rap
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'folk' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('folk')}
          >
            Folk
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'kpop' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('kpop')}
          >
            K-Pop
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'classical' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('classical')}
          >
            Klassik
          </button>
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${selectedCountry === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('all')}
          >
            <FiGlobe /> Barcha davlatlar
          </button>
          <button
            className={`filter-btn ${selectedCountry === 'uzbek' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('uzbek')}
          >
            <FiFlag /> O'zbek
          </button>
          <button
            className={`filter-btn ${selectedCountry === 'usa' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('usa')}
          >
            <FiFlag /> USA
          </button>
          <button
            className={`filter-btn ${selectedCountry === 'uk' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('uk')}
          >
            <FiFlag /> UK
          </button>
          <button
            className={`filter-btn ${selectedCountry === 'russia' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('russia')}
          >
            <FiFlag /> Rossiya
          </button>
          <button
            className={`filter-btn ${selectedCountry === 'turkey' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('turkey')}
          >
            <FiFlag /> Turkiya
          </button>
          <button
            className={`filter-btn ${selectedCountry === 'korea' ? 'active' : ''}`}
            onClick={() => setSelectedCountry('korea')}
          >
            <FiFlag /> Koreya
          </button>
        </div>
      </div>

      {/* Trend bo'limi */}
      {trendingSongs.length > 0 && (
        <div className="trending-section">
          <h2 className="section-title">
            <FiTrendingUp className="section-icon" />
            Trenddagi qo'shiqlar
          </h2>
          <div className="trending-grid">
            {trendingSongs.slice(0, 6).map(song => (
              <div key={song.id} className="trending-card" onClick={() => playSong(song)}>
                <div className="trending-image">
                  <img src={song.cover} alt={song.title} />
                  <div className="trending-overlay">
                    <button className="play-mini-btn">
                      {isPlaying && currentSong?.id === song.id ? <FiPause /> : <FiPlay />}
                    </button>
                  </div>
                </div>
                <div className="trending-info">
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                  <span className="trending-badge">
                    <FiTrendingUp /> #{song.plays.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asosiy qo'shiqlar ro'yxati */}
      <div className="songs-section">
        <h2 className="section-title">
          <FiMusic className="section-icon" />
          Barcha qo'shiqlar {filteredSongs.length > 0 && `(${filteredSongs.length})`}
        </h2>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Qo'shiqlar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="songs-list">
            {filteredSongs.map((song, index) => (
              <div key={song.id} className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}>
                <div className="song-index">{index + 1}</div>
                <div className="song-cover">
                  <img src={song.cover} alt={song.title} />
                  <button className="play-btn-small" onClick={() => playSong(song)}>
                    {isPlaying && currentSong?.id === song.id ? <FiPause /> : <FiPlay />}
                  </button>
                </div>
                <div className="song-info">
                  <h3 className="song-title">{song.title}</h3>
                  <p className="song-artist">{song.artist}</p>
                  <div className="song-meta">
                    <span className="meta-item">
                      <FiCalendar /> {song.year}
                    </span>
                    <span className="meta-item">
                      <FiHeadphones /> {song.plays.toLocaleString()}
                    </span>
                    <span className="meta-item country-tag">
                      <FiFlag /> {song.language}
                    </span>
                  </div>
                </div>
                <div className="song-duration">{song.duration}</div>
                <div className="song-actions">
                  <button 
                    className={`action-btn ${favorites.some(f => f.id === song.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(song)}
                  >
                    <FiHeart />
                  </button>
                  <button className="action-btn" onClick={() => {
                    setSelectedPlaylist(song);
                    setShowPlaylistModal(true);
                  }}>
                    <FiPlus />
                  </button>
                  <button className="action-btn">
                    <FiMoreVertical />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audio Player */}
      {showPlayer && currentSong && (
        <div className="music-player">
          <audio
            ref={audioRef}
            src={currentSong.audio}
            onTimeUpdate={handleTimeUpdate}
            onEnded={playNext}
          ></audio>

          <div className="player-left">
            <img src={currentSong.cover} alt={currentSong.title} className="player-cover" />
            <div className="player-info">
              <h4>{currentSong.title}</h4>
              <p>{currentSong.artist}</p>
            </div>
          </div>

          <div className="player-center">
            <div className="player-controls">
              <button className="control-btn" onClick={playPrevious}>
                <FiSkipBack />
              </button>
              <button className="control-btn play-pause" onClick={togglePlay}>
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <button className="control-btn" onClick={playNext}>
                <FiSkipForward />
              </button>
            </div>

            <div className="progress-container">
              <span className="time">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="progress-bar"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
              />
              <span className="time">{formatTime(duration || 0)}</span>
            </div>
          </div>

          <div className="player-right">
            <button className="volume-btn" onClick={toggleMute}>
              {isMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
            <button className="player-action-btn">
              <FiHeart className={favorites.some(f => f.id === currentSong.id) ? 'active' : ''} />
            </button>
            <button className="player-action-btn">
              <FiDownload />
            </button>
          </div>
        </div>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="modal-overlay" onClick={() => setShowPlaylistModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Playlistga qo'shish</h3>
            <div className="playlist-list">
              {playlists.length > 0 ? (
                playlists.map(playlist => (
                  <div key={playlist.id} className="playlist-item" onClick={() => {
                    addToPlaylist(playlist.id, selectedPlaylist);
                    setShowPlaylistModal(false);
                  }}>
                    <FiList />
                    <span>{playlist.name}</span>
                    <span className="playlist-count">{playlist.songs.length} ta</span>
                  </div>
                ))
              ) : (
                <p className="empty-playlists">Playlistlar mavjud emas</p>
              )}
            </div>
            <button className="create-playlist-btn" onClick={() => {
              const name = prompt('Playlist nomini kiriting:');
              if (name) {
                createPlaylist(name);
              }
            }}>
              <FiPlus /> Yangi playlist yaratish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Music;