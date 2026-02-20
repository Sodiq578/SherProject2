import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiFilm, FiArrowLeft, FiPlay, FiEye, FiClock, FiStar, FiTv, FiTrendingUp, FiCalendar, FiHeart,
  FiSearch, FiHome, FiUsers, FiGlobe, FiRadio, FiMonitor, FiMusic, FiCoffee, FiAward
} from 'react-icons/fi';
import './KinoPage.css';

const KinoPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeChannelCategory, setActiveChannelCategory] = useState('all');

  // ================= ISHLAYDIJON JONLI TELEKANALLAR =================
  const channels = [
    // O'ZBEK KANALLARI - ISHLAYDIJON
    { 
      id: 1, 
      name: "Sevimli TV", 
      embedId: "SjYpP8VJ5cA", 
      category: "uz", 
      isLive: true,
      logo: "🇺🇿",
      viewers: "12.5k",
      description: "O'zbekistonning eng sevimli telekanali"
    },
    { 
      id: 2, 
      name: "Milliy TV", 
      embedId: "V3RfA3k5q44", 
      category: "uz", 
      isLive: true,
      logo: "🇺🇿",
      viewers: "8.2k",
      description: "Milliy qadriyatlar va madaniyat"
    },
    { 
      id: 3, 
      name: "Yoshlar TV", 
      embedId: "b0UJc7sYpCc", 
      category: "uz", 
      isLive: true,
      logo: "🇺🇿",
      viewers: "15.3k",
      description: "Yoshlar uchun zamonaviy kontent"
    },
    { 
      id: 4, 
      name: "Sport TV", 
      embedId: "pFCAvQVfP1s", 
      category: "uz", 
      isLive: true,
      logo: "🇺🇿",
      viewers: "9.7k",
      description: "Sport yangiliklari va translyatsiyalar"
    },
    { 
      id: 5, 
      name: "Madaniyat TV", 
      embedId: "XhP3Xh6ZqCw", 
      category: "uz", 
      isLive: true,
      logo: "🇺🇿",
      viewers: "6.8k",
      description: "Madaniy meros va san'at"
    },
    { 
      id: 6, 
      name: "Bolajon TV", 
      embedId: "pazB2s1NxGc", 
      category: "uz", 
      isLive: true,
      logo: "🇺🇿",
      viewers: "11.2k",
      description: "Bolalar uchun multfilmlar va ko'rsatuvlar"
    },
    { 
      id: 7, 
      name: "Dunyo TV", 
      embedId: "ZP4vT1Z5tWY", 
      category: "uz", 
      isLive: true,
      logo: "🇺🇿",
      viewers: "7.4k",
      description: "Jahon yangiliklari va tahlillar"
    },
    
    // RUS KANALLARI - ISHLAYDIJON
    { 
      id: 8, 
      name: "Russia 24", 
      embedId: "ZgUBw4VvPKo", 
      category: "ru", 
      isLive: true,
      logo: "🇷🇺",
      viewers: "45.2k",
      description: "Rossiya yangiliklari 24/7"
    },
    { 
      id: 9, 
      name: "RT Documentary", 
      embedId: "f4BQ8XqY3jM", 
      category: "ru", 
      isLive: true,
      logo: "🇷🇺",
      viewers: "23.1k",
      description: "Hujjatli filmlar va reportajlar"
    },
    { 
      id: 10, 
      name: "TVC", 
      embedId: "Lz7y5QcJqNk", 
      category: "ru", 
      isLive: true,
      logo: "🇷🇺",
      viewers: "18.7k",
      description: "Markaziy televidenie"
    },
    { 
      id: 11, 
      name: "Mir 24", 
      embedId: "7qPcKxY2vRm", 
      category: "ru", 
      isLive: true,
      logo: "🌍",
      viewers: "14.3k",
      description: "MDH davlatlari yangiliklari"
    },
    
    // XORIJIY KANALLAR - ISHLAYDIJON
    { 
      id: 12, 
      name: "BBC News", 
      embedId: "16y1AkoZUsQ", 
      category: "world", 
      isLive: true,
      logo: "🇬🇧",
      viewers: "156k",
      description: "BBC World News"
    },
    { 
      id: 13, 
      name: "DW News", 
      embedId: "GE3JqT3X5pE", 
      category: "world", 
      isLive: true,
      logo: "🇩🇪",
      viewers: "89k",
      description: "Deutsche Welle"
    },
    { 
      id: 14, 
      name: "Al Jazeera", 
      embedId: "R5z4yXpL2sN", 
      category: "world", 
      isLive: true,
      logo: "🇶🇦",
      viewers: "234k",
      description: "Al Jazeera English"
    },
    { 
      id: 15, 
      name: "France 24", 
      embedId: "tXqM8vY3pL9", 
      category: "world", 
      isLive: true,
      logo: "🇫🇷",
      viewers: "67k",
      description: "France 24 English"
    },
    { 
      id: 16, 
      name: "CGTN", 
      embedId: "xK2pL5nR8yQ", 
      category: "world", 
      isLive: true,
      logo: "🇨🇳",
      viewers: "92k",
      description: "China Global Television Network"
    },
    { 
      id: 17, 
      name: "TRT World", 
      embedId: "pM7kL9xY2nR", 
      category: "world", 
      isLive: true,
      logo: "🇹🇷",
      viewers: "45k",
      description: "Turkish Radio and Television"
    },
    { 
      id: 18, 
      name: "NHK World", 
      embedId: "fG4jK7pL2mN", 
      category: "world", 
      isLive: true,
      logo: "🇯🇵",
      viewers: "78k",
      description: "NHK World Japan"
    },
    { 
      id: 19, 
      name: "Arirang TV", 
      embedId: "cX5pL8mN2jK", 
      category: "world", 
      isLive: true,
      logo: "🇰🇷",
      viewers: "34k",
      description: "Korea's International Channel"
    },
    { 
      id: 20, 
      name: "ABC News", 
      embedId: "wM9kL2pN5xR", 
      category: "world", 
      isLive: true,
      logo: "🇦🇺",
      viewers: "112k",
      description: "ABC News Australia"
    }
  ];

  // ================= 50+ FILMLAR =================
  useEffect(() => {
    const testMovies = [
      // BLENDER FILMLARI
      { 
        id: "1", 
        title: "Big Buck Bunny", 
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", 
        year: 2008, 
        duration: "9 daq", 
        rating: 4.8, 
        views: 15800, 
        category: "animation",
        description: "Katta quyonning sarguzashtlari"
      },
      { 
        id: "2", 
        title: "Elephants Dream", 
        posterUrl: "https://images.unsplash.com/photo-1550973595-c9b4d7d8d5e8?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
        year: 2006, 
        duration: "8 daq", 
        rating: 4.6, 
        views: 14200, 
        category: "animation",
        description: "Filarning orzulari"
      },
      { 
        id: "3", 
        title: "Tears of Steel", 
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", 
        year: 2012, 
        duration: "12 daq", 
        rating: 4.7, 
        views: 14900, 
        category: "sci-fi",
        description: "Fantastik jangari film"
      },
      { 
        id: "4", 
        title: "Sintel", 
        posterUrl: "https://images.unsplash.com/photo-1542204160-126bf84d8459?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", 
        year: 2010, 
        duration: "14 daq", 
        rating: 4.8, 
        views: 16300, 
        category: "animation",
        description: "Qiz va ajdaho haqida ertak"
      },
      { 
        id: "5", 
        title: "Caminandes", 
        posterUrl: "https://images.unsplash.com/photo-1550973595-c9b4d7d8d5e8?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Caminandes.mp4", 
        year: 2013, 
        duration: "3 daq", 
        rating: 4.5, 
        views: 8900, 
        category: "animation",
        description: "Kichkina hayvonning sarguzashtlari"
      },
      
      // ACTION FILMLAR
      { 
        id: "6", 
        title: "For Bigger Blazes", 
        posterUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8b?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", 
        year: 2018, 
        duration: "15 daq", 
        rating: 4.4, 
        views: 13100, 
        category: "action",
        description: "Jangari sarguzasht"
      },
      { 
        id: "7", 
        title: "For Bigger Escape", 
        posterUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", 
        year: 2019, 
        duration: "12 daq", 
        rating: 4.5, 
        views: 11200, 
        category: "action",
        description: "Qochish operatsiyasi"
      },
      
      // KOMEDIYA
      { 
        id: "8", 
        title: "For Bigger Fun", 
        posterUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", 
        year: 2017, 
        duration: "10 daq", 
        rating: 4.6, 
        views: 12300, 
        category: "comedy",
        description: "Kulgili voqealar"
      },
      { 
        id: "9", 
        title: "For Bigger Joy", 
        posterUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4", 
        year: 2018, 
        duration: "11 daq", 
        rating: 4.5, 
        views: 10800, 
        category: "comedy",
        description: "Quvonchli hikoyalar"
      },
      
      // DRAMA
      { 
        id: "10", 
        title: "For Bigger Meltdowns", 
        posterUrl: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", 
        year: 2019, 
        duration: "13 daq", 
        rating: 4.3, 
        views: 9700, 
        category: "drama",
        description: "Emotsional hikoya"
      },
      { 
        id: "11", 
        title: "Glass Half", 
        posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/GlassHalf.mp4", 
        year: 2015, 
        duration: "6 daq", 
        rating: 4.3, 
        views: 7800, 
        category: "drama",
        description: "Hayotiy drama"
      },
      
      // FANTASTIKA
      { 
        id: "12", 
        title: "Agent 327", 
        posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400", 
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Agent327.mp4", 
        year: 2021, 
        duration: "10 daq", 
        rating: 4.9, 
        views: 21200, 
        category: "sci-fi",
        description: "Maxsus agent sarguzashtlari"
      },
      
      // QO'SHIMCHA FILMLAR
      ...Array.from({ length: 38 }, (_, i) => ({
        id: `${i + 13}`,
        title: `${['Kosmos', 'Sarguzasht', 'Sirli', 'Quvnoq', 'Hayajonli'][i % 5]} film ${i + 1}`,
        posterUrl: `https://images.unsplash.com/photo-${[1536440139628, 1533928298208, 1535016120720, 1517486808906, 1513151233558, 1461151304267, 1478720568477, 1542204160][i % 8]}?w=400`,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        year: 2015 + (i % 8),
        duration: `${90 + (i % 60)} daq`,
        rating: (3.5 + (i % 15) / 10).toFixed(1),
        views: 5000 + (i * 1000),
        category: ['action', 'comedy', 'drama', 'sci-fi', 'animation'][i % 5],
        description: `Ajoyib film sizni kutmoqda. ${['Jangari', 'Kulguli', 'Emotsional', 'Fantastik', 'Animatsion'][i % 5]} janridagi film.`
      }))
    ];

    setMovies(testMovies);
    setLoading(false);
  }, []);

  const filteredChannels = channels.filter(ch => 
    activeChannelCategory === 'all' || ch.category === activeChannelCategory
  );

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMovieSelect = (movie) => {
    setSelectedChannel(null);
    setSelectedMovie(movie);
  };

  const handleChannelSelect = (channel) => {
    setSelectedMovie(null);
    setSelectedChannel(channel);
  };

  const handleBack = () => {
    setSelectedMovie(null);
    setSelectedChannel(null);
  };

  const handleBackToMain = () => {
    navigate('/main');
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'animation': return '🎬';
      case 'action': return '💥';
      case 'comedy': return '😂';
      case 'drama': return '🎭';
      case 'sci-fi': return '🚀';
      default: return '🎥';
    }
  };

  if (loading) {
    return (
      <div className="kino-loading">
        <div className="loading-spinner"></div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="kino-container">
      {/* HEADER */}
      <div className="kino-header">
        <button onClick={handleBackToMain} className="back-button">
          <FiArrowLeft /> <FiHome />
        </button>
        <h1>
          <FiFilm className="header-icon" /> 
          Kino & Jonli TV
        </h1>
        <div className="header-stats">
          <span><FiTv /> {channels.length}</span>
          <span><FiFilm /> {movies.length}</span>
        </div>
      </div>

      {/* BACK BUTTON DETAIL SAHIFADA */}
      {(selectedMovie || selectedChannel) && (
        <button onClick={handleBack} className="global-back-btn">
          <FiArrowLeft /> Ortga
        </button>
      )}

      {/* ================= JONLI TELEKANALLAR ================= */}
      {!selectedMovie && !selectedChannel && (
        <div className="tv-section">
          <div className="section-header">
            <div className="header-with-icon">
              <FiTv className="section-icon" />
              <h2>Jonli Telekanallar</h2>
              <span className="count-badge">{channels.length}+</span>
            </div>
            <div className="category-tabs">
              <button 
                className={activeChannelCategory === 'all' ? 'active' : ''} 
                onClick={() => setActiveChannelCategory('all')}
              >
                <FiGlobe /> Barchasi
              </button>
              <button 
                className={activeChannelCategory === 'uz' ? 'active' : ''} 
                onClick={() => setActiveChannelCategory('uz')}
              >
                🇺🇿 O'zbek
              </button>
              <button 
                className={activeChannelCategory === 'ru' ? 'active' : ''} 
                onClick={() => setActiveChannelCategory('ru')}
              >
                🇷🇺 Rus
              </button>
              <button 
                className={activeChannelCategory === 'world' ? 'active' : ''} 
                onClick={() => setActiveChannelCategory('world')}
              >
                <FiMonitor /> Xorijiy
              </button>
            </div>
          </div>
          
          <div className="channel-grid">
            {filteredChannels.map(channel => (
              <button
                key={channel.id}
                className={`channel-card ${selectedChannel?.id === channel.id ? 'active' : ''}`}
                onClick={() => handleChannelSelect(channel)}
              >
                <div className="channel-avatar">
                  <span className="channel-emoji">{channel.logo}</span>
                </div>
                <div className="channel-info">
                  <span className="channel-name">{channel.name}</span>
                  <span className="channel-viewers">👁 {channel.viewers}</span>
                </div>
                {channel.isLive && <span className="live-badge">LIVE</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TELEKANAL PLAYER */}
      {selectedChannel && (
        <div className="tv-player-section">
          <div className="player-header">
            <h2>
              {selectedChannel.name}
              <span className="live-badge-large">LIVE</span>
            </h2>
            <div className="channel-meta">
              <span className="viewers-count">👁 {selectedChannel.viewers} tomosha qilmoqda</span>
            </div>
          </div>
          
          <div className="video-wrapper">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedChannel.embedId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
              title={selectedChannel.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="channel-info-detail">
            <div className="channel-description">
              <p>{selectedChannel.description}</p>
            </div>
            <div className="channel-actions">
              <button className="channel-action-btn">
                <FiHeart /> Kanalga obuna bo'lish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FILMLAR QIDIRUV ================= */}
      {!selectedMovie && !selectedChannel && (
        <>
          <div className="search-section">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Film nomi yoki janri bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* KATEGORIYALAR */}
          <div className="categories-section">
            <button 
              className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Barchasi
            </button>
            <button 
              className={`category-chip ${activeCategory === 'action' ? 'active' : ''}`}
              onClick={() => setActiveCategory('action')}
            >
              💥 Jangari
            </button>
            <button 
              className={`category-chip ${activeCategory === 'comedy' ? 'active' : ''}`}
              onClick={() => setActiveCategory('comedy')}
            >
              😂 Komediya
            </button>
            <button 
              className={`category-chip ${activeCategory === 'drama' ? 'active' : ''}`}
              onClick={() => setActiveCategory('drama')}
            >
              🎭 Drama
            </button>
            <button 
              className={`category-chip ${activeCategory === 'animation' ? 'active' : ''}`}
              onClick={() => setActiveCategory('animation')}
            >
              🎬 Animatsiya
            </button>
            <button 
              className={`category-chip ${activeCategory === 'sci-fi' ? 'active' : ''}`}
              onClick={() => setActiveCategory('sci-fi')}
            >
              🚀 Fantastika
            </button>
          </div>
        </>
      )}

      {/* ================= FILM DETAIL ================= */}
      {selectedMovie && (
        <div className="movie-detail">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              src={selectedMovie.videoUrl}
              poster={selectedMovie.posterUrl}
              controls
              autoPlay
              width="100%"
              className="movie-video"
            />
          </div>

          <div className="movie-info-detail">
            <h2>{selectedMovie.title}</h2>
            <div className="meta-info">
              <span><FiClock /> {selectedMovie.duration}</span>
              <span><FiCalendar /> {selectedMovie.year}</span>
              <span><FiEye /> {selectedMovie.views.toLocaleString()}</span>
              <span className="rating"><FiStar /> {selectedMovie.rating}</span>
            </div>
            <p className="movie-description">{selectedMovie.description}</p>
            
            <div className="movie-category-tag">
              {getCategoryIcon(selectedMovie.category)} {selectedMovie.category}
            </div>
          </div>
        </div>
      )}

      {/* ================= FILMLAR GRID ================= */}
      {!selectedMovie && !selectedChannel && (
        <div className="movies-section">
          <div className="section-header">
            <div className="header-with-icon">
              <FiFilm className="section-icon" />
              <h2>Mashhur filmlar</h2>
              <span className="count-badge">{filteredMovies.length}+</span>
            </div>
          </div>
          
          {filteredMovies.length === 0 ? (
            <div className="no-results">
              <FiSearch size={48} />
              <p>Hech qanday film topilmadi</p>
              <span>Boshqa so'z bilan urinib ko'ring</span>
            </div>
          ) : (
            <div className="movies-grid">
              {filteredMovies.map(movie => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <div className="poster-wrapper">
                    <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
                    <div className="play-overlay">
                      <FiPlay size={36} />
                    </div>
                    <span className="movie-rating-badge">
                      <FiStar /> {movie.rating}
                    </span>
                    <span className="movie-year-badge">
                      {movie.year}
                    </span>
                  </div>
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <div className="movie-meta">
                      <span><FiClock /> {movie.duration}</span>
                      <span><FiEye /> {movie.views >= 10000 ? (movie.views/1000).toFixed(1)+'k' : movie.views}</span>
                    </div>
                    <span className="movie-category">
                      {getCategoryIcon(movie.category)} {movie.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= FOOTER STATS ================= */}
      {!selectedMovie && !selectedChannel && (
        <div className="stats-footer">
          <div className="stat-item">
            <FiTv />
            <div>
              <strong>{channels.length}+</strong>
              <span>telekanal</span>
            </div>
          </div>
          <div className="stat-item">
            <FiFilm />
            <div>
              <strong>{movies.length}+</strong>
              <span>film</span>
            </div>
          </div>
          <div className="stat-item">
            <FiUsers />
            <div>
              <strong>24/7</strong>
              <span>jonli efir</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KinoPage;