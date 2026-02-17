import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFilm, 
  FiPlus, 
  FiEdit2, 
  FiTrash2,
  FiStar,
  FiCalendar,
  FiTag,
  FiSave,
  FiX,
  FiShield,
  FiHome,
  FiUsers,
  FiHeart,
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiFilter,
  FiEye,
  FiClock,
  FiUser,
  FiVideo,           // ✅ VIDEO IKONKASI
  FiUpload,          // ✅ UPLOAD IKONKASI
  FiLink,            // ✅ LINK IKONKASI
  FiPlayCircle       // ✅ PLAY IKONKASI
} from 'react-icons/fi';
import './Admin.css';

const AdminMovies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [videoSource, setVideoSource] = useState('youtube'); // 'youtube', 'file', 'url'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    posterUrl: '',
    videoUrl: '',           // ✅ VIDEO URL
    videoFile: null,        // ✅ VIDEO FILE
    year: '',
    genre: [],
    rating: '',
    type: 'movie',
    duration: '',
    director: '',
    cast: ''
  });

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('adminUser'));
    if (!admin) {
      navigate('/admin');
      return;
    }
    setAdminUser(admin);
    loadMovies();
  }, [navigate]);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, filterType, filterYear]);

  const loadMovies = () => {
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    setMovies(savedMovies);
    setFilteredMovies(savedMovies);
  };

  const filterMovies = () => {
    let filtered = [...movies];

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(m => m.type === filterType);
    }

    if (filterYear !== 'all') {
      filtered = filtered.filter(m => m.year?.toString() === filterYear);
    }

    setFilteredMovies(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (e) => {
    const genres = e.target.value.split(',').map(g => g.trim());
    setFormData(prev => ({
      ...prev,
      genre: genres
    }));
  };

  const handleCastChange = (e) => {
    const cast = e.target.value.split(',').map(c => c.trim());
    setFormData(prev => ({
      ...prev,
      cast: cast
    }));
  };

  // ✅ VIDEO FILE UPLOAD HANDLER
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Video fayl tekshirish
      if (!file.type.startsWith('video/')) {
        alert('Iltimos, video fayl tanlang!');
        return;
      }

      // Hajm tekshirish (50MB dan katta bo'lmasin)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video hajmi 50MB dan kichik bo\'lishi kerak!');
        return;
      }

      setSelectedVideo(file);
      setFormData(prev => ({
        ...prev,
        videoFile: file
      }));

      // Video preview yaratish
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);

      // Progress simulyatsiyasi
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    }
  };

  // ✅ VIDEO URL HANDLER
  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      videoUrl: url
    }));

    // YouTube video ID ni olish
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        setVideoPreview(`https://img.youtube.com/vi/${videoId}/0.jpg`);
      }
    }
  };

  // ✅ YouTube ID ni olish
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Video ma'lumotlarini saqlash
    let videoData = {};
    if (videoSource === 'youtube' || videoSource === 'url') {
      videoData = { videoUrl: formData.videoUrl };
    } else if (videoSource === 'file' && selectedVideo) {
      // Faylni base64 formatiga o'tkazish (localStorage uchun)
      const reader = new FileReader();
      reader.readAsDataURL(selectedVideo);
      reader.onload = () => {
        videoData = { videoData: reader.result };
        saveMovie(videoData);
      };
      reader.onerror = () => {
        alert('Video yuklashda xatolik!');
      };
      return;
    }

    saveMovie(videoData);
  };

  const saveMovie = (videoData) => {
    const movieData = {
      ...formData,
      ...videoData,
      id: editingMovie ? editingMovie.id : Date.now().toString(),
      year: parseInt(formData.year),
      rating: parseFloat(formData.rating) || 0,
      createdAt: new Date().toISOString(),
      views: editingMovie ? editingMovie.views || 0 : 0
    };

    // videoFile ni o'chirish (base64 formatda saqlangan)
    delete movieData.videoFile;

    let updatedMovies;
    if (editingMovie) {
      updatedMovies = movies.map(m => m.id === editingMovie.id ? movieData : m);
    } else {
      updatedMovies = [movieData, ...movies];
    }

    localStorage.setItem('movies', JSON.stringify(updatedMovies));
    setMovies(updatedMovies);
    setShowForm(false);
    setEditingMovie(null);
    resetForm();
    setUploadProgress(0);
    setVideoPreview(null);
    setSelectedVideo(null);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      description: movie.description || '',
      posterUrl: movie.posterUrl || '',
      videoUrl: movie.videoUrl || '',
      year: movie.year?.toString() || '',
      genre: movie.genre?.join(', ') || '',
      rating: movie.rating?.toString() || '',
      type: movie.type || 'movie',
      duration: movie.duration || '',
      director: movie.director || '',
      cast: movie.cast?.join(', ') || ''
    });

    if (movie.videoData) {
      setVideoPreview(movie.videoData);
      setVideoSource('file');
    } else if (movie.videoUrl) {
      if (movie.videoUrl.includes('youtube')) {
        setVideoSource('youtube');
        const videoId = extractYouTubeId(movie.videoUrl);
        if (videoId) {
          setVideoPreview(`https://img.youtube.com/vi/${videoId}/0.jpg`);
        }
      } else {
        setVideoSource('url');
      }
    }

    setShowForm(true);
  };

  const handleDelete = (movieId) => {
    if (window.confirm('Bu kinoni o\'chirishni tasdiqlaysizmi?')) {
      const updatedMovies = movies.filter(m => m.id !== movieId);
      localStorage.setItem('movies', JSON.stringify(updatedMovies));
      setMovies(updatedMovies);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      posterUrl: '',
      videoUrl: '',
      videoFile: null,
      year: '',
      genre: [],
      rating: '',
      type: 'movie',
      duration: '',
      director: '',
      cast: ''
    });
    setVideoSource('youtube');
    setSelectedVideo(null);
    setVideoPreview(null);
    setUploadProgress(0);
  };

  const years = ['all', ...new Set(movies.map(m => m.year?.toString()).filter(Boolean))];

  return (
    <div className="admin-container">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-wrapper">
            <FiShield className="sidebar-logo" />
            <h3>Admin Panel</h3>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            <FiMenu />
          </button>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div className="profile-info">
            <span className="profile-name">{adminUser?.username}</span>
            <span className="profile-email">{adminUser?.email}</span>
          </div>
        </div>
        
        <div className="sidebar-menu">
          <button onClick={() => navigate('/admin/dashboard')} className="menu-item">
            <FiHome /> Dashboard
          </button>
          <button onClick={() => navigate('/admin/movies')} className="menu-item active">
            <FiFilm /> Kinolar
          </button>
          <button onClick={() => navigate('/admin/users')} className="menu-item">
            <FiUsers /> Foydalanuvchilar
          </button>
          <button onClick={() => navigate('/admin/dating')} className="menu-item">
            <FiHeart /> Dating Profillar
          </button>
          <button onClick={() => navigate('/admin/ads')} className="menu-item">
            <FiShoppingBag /> E'lonlar
          </button>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Chiqish
          </button>
        </div>
      </div>

      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="admin-header">
          <div className="header-title">
            <h1><FiFilm /> Kinolar</h1>
            <p>Jami {movies.length} ta kino</p>
          </div>
          <div className="header-actions">
            <button onClick={() => setShowForm(true)} className="admin-add-btn">
              <FiPlus /> Yangi kino
            </button>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Kino qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-buttons">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">Barcha turlar</option>
              <option value="movie">Filmlar</option>
              <option value="cartoon">Multfilmlar</option>
            </select>

            <select 
              value={filterYear} 
              onChange={(e) => setFilterYear(e.target.value)}
              className="filter-select"
            >
              <option value="all">Barcha yillar</option>
              {years.filter(y => y !== 'all').map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="admin-form-overlay">
            <div className="admin-form-modal" style={{maxWidth: '800px'}}>
              <div className="admin-form-header">
                <h3>{editingMovie ? 'Kino tahrirlash' : 'Yangi kino qo\'shish'}</h3>
                <button onClick={() => { setShowForm(false); setEditingMovie(null); resetForm(); }} className="close-btn">
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nomi *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Kino nomi"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tur *</label>
                    <select name="type" value={formData.type} onChange={handleChange} required>
                      <option value="movie">Film</option>
                      <option value="cartoon">Multfilm</option>
                    </select>
                  </div>
                </div>

                {/* ✅ VIDEO QO'SHISH BO'LIMI */}
                <div className="form-section">
                  <h4 className="section-title">
                    <FiVideo /> Video qo'shish
                  </h4>
                  
                  <div className="video-source-tabs">
                    <button 
                      type="button"
                      className={`source-tab ${videoSource === 'youtube' ? 'active' : ''}`}
                      onClick={() => setVideoSource('youtube')}
                    >
                      <FiPlayCircle /> YouTube
                    </button>
                    <button 
                      type="button"
                      className={`source-tab ${videoSource === 'url' ? 'active' : ''}`}
                      onClick={() => setVideoSource('url')}
                    >
                      <FiLink /> Video URL
                    </button>
                    <button 
                      type="button"
                      className={`source-tab ${videoSource === 'file' ? 'active' : ''}`}
                      onClick={() => setVideoSource('file')}
                    >
                      <FiUpload /> Fayl yuklash
                    </button>
                  </div>

                  {videoSource === 'youtube' && (
                    <div className="form-group">
                      <label>YouTube URL:</label>
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleVideoUrlChange}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      <small className="input-hint">
                        Misol: https://youtube.com/watch?v=abc123 yoki https://youtu.be/abc123
                      </small>
                    </div>
                  )}

                  {videoSource === 'url' && (
                    <div className="form-group">
                      <label>Video URL (MP4):</label>
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/video.mp4"
                      />
                      <small className="input-hint">
                        To'g'ridan-to'g'ri video fayl URL manzili (MP4 format)
                      </small>
                    </div>
                  )}

                  {videoSource === 'file' && (
                    <div className="form-group">
                      <label>Video fayl yuklash:</label>
                      <div className="file-upload-area">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileChange}
                          className="file-input"
                          id="video-file"
                        />
                        <label htmlFor="video-file" className="file-upload-label">
                          <FiUpload /> Fayl tanlash
                        </label>
                        {selectedVideo && (
                          <div className="selected-file-info">
                            <span>{selectedVideo.name}</span>
                            <small>({(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB)</small>
                          </div>
                        )}
                      </div>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="upload-progress">
                          <div className="progress-bar" style={{width: `${uploadProgress}%`}}></div>
                          <span>{uploadProgress}%</span>
                        </div>
                      )}
                      <small className="input-hint">
                        Maksimal hajm: 50MB. Qo'llab-quvvatlanadigan formatlar: MP4, AVI, MOV
                      </small>
                    </div>
                  )}

                  {videoPreview && (
                    <div className="video-preview">
                      <h5>Video preview:</h5>
                      {videoSource === 'file' ? (
                        <video 
                          src={videoPreview} 
                          controls 
                          style={{width: '100%', maxHeight: '200px'}}
                        />
                      ) : (
                        <img 
                          src={videoPreview} 
                          alt="Video preview" 
                          style={{width: '100%', maxHeight: '200px', objectFit: 'cover'}}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Yil *</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      placeholder="2024"
                      min="1900"
                      max="2025"
                    />
                  </div>

                  <div className="form-group">
                    <label>Reyting</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                    />
                  </div>

                  <div className="form-group">
                    <label>Davomiylik (daq)</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="120 daq"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Poster rasm URL:</label>
                  <input
                    type="url"
                    name="posterUrl"
                    value={formData.posterUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/poster.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>Rejissyor</label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleChange}
                    placeholder="Rejissyor nomi"
                  />
                </div>

                <div className="form-group">
                  <label>Janr (vergul bilan)</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleGenreChange}
                    placeholder="Action, Drama, Sci-Fi"
                  />
                </div>

                <div className="form-group">
                  <label>Aktyorlar (vergul bilan)</label>
                  <input
                    type="text"
                    name="cast"
                    value={formData.cast}
                    onChange={handleCastChange}
                    placeholder="Actor 1, Actor 2, Actor 3"
                  />
                </div>

                <div className="form-group">
                  <label>Ta'rif *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Kino haqida batafsil..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    <FiSave /> Saqlash
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingMovie(null); resetForm(); }} className="cancel-btn">
                    Bekor qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="movies-table-container">
          <table className="movies-table">
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Nomi / Video</th>
                <th>Yil</th>
                <th>Janr</th>
                <th>Reyting</th>
                <th>Tur</th>
                <th>Ko'rishlar</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.length > 0 ? (
                filteredMovies.map(movie => (
                  <tr key={movie.id}>
                    <td>
                      <img 
                        src={movie.posterUrl || 'https://via.placeholder.com/50x70'} 
                        alt={movie.title}
                        className="table-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50x70';
                        }}
                      />
                    </td>
                    <td>
                      <div className="movie-title-cell">
                        <strong>{movie.title}</strong>
                        {movie.director && <small>{movie.director}</small>}
                        {/* ✅ VIDEO BORLIGINI KO'RSATISH */}
                        {(movie.videoUrl || movie.videoData) && (
                          <span className="video-badge">
                            <FiVideo /> Video mavjud
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{movie.year}</td>
                    <td>
                      <div className="genre-tags">
                        {movie.genre?.slice(0, 2).map((g, i) => (
                          <span key={i} className="genre-tag">{g}</span>
                        ))}
                        {movie.genre?.length > 2 && <span className="genre-tag more">+{movie.genre.length - 2}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="rating-badge">
                        <FiStar /> {movie.rating?.toFixed(1) || '0.0'}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${movie.type}`}>
                        {movie.type === 'movie' ? 'Film' : 'Multfilm'}
                      </span>
                    </td>
                    <td>
                      <span className="views-badge">
                        <FiEye /> {movie.views || 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(movie)} className="action-btn edit" title="Tahrirlash">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(movie.id)} className="action-btn delete" title="O'chirish">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    <FiFilm className="no-data-icon" />
                    <p>Hozircha kinolar yo'q</p>
                    <button onClick={() => setShowForm(true)} className="add-first-btn">
                      <FiPlus /> Birinchi kinoni qo'shish
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMovies;