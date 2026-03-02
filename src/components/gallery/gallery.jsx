import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiImage,
  FiSearch,
  FiHeart,
  FiDownload,
  FiShare2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiFilter,
  FiCamera,
  FiSun,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiBookmark,
  FiAward,
  FiUser,
  FiFlag        // Bu muhim!
} from 'react-icons/fi';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOrientation, setSelectedOrientation] = useState('all');
  const [likedImages, setLikedImages] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(0);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0
  });

  const observerRef = useRef();
  const lastImageRef = useCallback(node => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, loading]);

  // Barcha rasmlar (100+ rasm)
  const allMockImages = [
    // TABIAT RASMLARI (20 ta)
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      title: "Quyosh botishi",
      description: "Tog'lar ustida quyosh botishi",
      category: "nature",
      orientation: "landscape",
      photographer: "John Doe",
      photographerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      location: "Swiss Alps",
      date: "2024-01-15",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4000,
      height: 3000,
      tags: ["sunset", "mountains", "nature"],
      featured: Math.random() > 0.7
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
      thumb: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
      title: "O'rmon manzarasi",
      description: "Tumanli o'rmon tongi",
      category: "nature",
      orientation: "landscape",
      photographer: "Jane Smith",
      photographerAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
      location: "Black Forest, Germany",
      date: "2024-02-20",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4500,
      height: 3000,
      tags: ["forest", "fog", "trees"],
      featured: Math.random() > 0.7
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1434725039720-aaad6dd32df4?w=800",
      thumb: "https://images.unsplash.com/photo-1434725039720-aaad6dd32df4?w=400",
      title: "Daryo bo'yi",
      description: "Sokin daryo va tog'lar",
      category: "nature",
      orientation: "landscape",
      photographer: "Alex Johnson",
      photographerAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
      location: "Norway",
      date: "2024-03-10",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["river", "mountains", "landscape"],
      featured: Math.random() > 0.7
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=800",
      thumb: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=400",
      title: "Dengiz to'lqinlari",
      description: "Okean to'lqinlari",
      category: "nature",
      orientation: "landscape",
      photographer: "Sarah Wilson",
      photographerAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      location: "Maldives",
      date: "2024-01-05",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5500,
      height: 3500,
      tags: ["ocean", "waves", "beach"],
      featured: Math.random() > 0.7
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      title: "Yomg'irli o'rmon",
      description: "Yomg'irli tropik o'rmon",
      category: "nature",
      orientation: "portrait",
      photographer: "Michael Brown",
      photographerAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
      location: "Amazon Rainforest",
      date: "2024-02-28",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 4500,
      tags: ["rainforest", "tropical", "green"],
      featured: Math.random() > 0.7
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1682686581740-2c5f76eb86d1?w=800",
      thumb: "https://images.unsplash.com/photo-1682686581740-2c5f76eb86d1?w=400",
      title: "Qorli tog'lar",
      description: "Qor bilan qoplangan tog' cho'qqilari",
      category: "nature",
      orientation: "landscape",
      photographer: "Eco Explorer",
      photographerAvatar: "https://randomuser.me/api/portraits/men/25.jpg",
      location: "Himalayas, Nepal",
      date: "2024-04-01",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 6000,
      height: 4000,
      tags: ["snow", "mountains", "winter"],
      featured: Math.random() > 0.7
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1682695798256-28a674122872?w=800",
      thumb: "https://images.unsplash.com/photo-1682695798256-28a674122872?w=400",
      title: "Kuzgi o'rmon",
      description: "Kuzgi ranglardagi o'rmon",
      category: "nature",
      orientation: "landscape",
      photographer: "Season Lover",
      photographerAvatar: "https://randomuser.me/api/portraits/women/27.jpg",
      location: "Vermont, USA",
      date: "2024-03-25",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5500,
      height: 3700,
      tags: ["autumn", "forest", "colors"],
      featured: Math.random() > 0.7
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=800",
      thumb: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=400",
      title: "Sharshara",
      description: "Tog'li hududdagi sharshara",
      category: "nature",
      orientation: "portrait",
      photographer: "Waterfall Hunter",
      photographerAvatar: "https://randomuser.me/api/portraits/men/26.jpg",
      location: "Iceland",
      date: "2024-03-18",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 5200,
      tags: ["waterfall", "nature", "water"],
      featured: Math.random() > 0.7
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1682695798522-6e208131916d?w=800",
      thumb: "https://images.unsplash.com/photo-1682695798522-6e208131916d?w=400",
      title: "Sahro",
      description: "Qumli sahro manzarasi",
      category: "nature",
      orientation: "landscape",
      photographer: "Desert Nomad",
      photographerAvatar: "https://randomuser.me/api/portraits/men/27.jpg",
      location: "Sahara Desert",
      date: "2024-02-28",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5800,
      height: 3600,
      tags: ["desert", "sand", "dunes"],
      featured: Math.random() > 0.7
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1682695798176-bb7f231c9520?w=800",
      thumb: "https://images.unsplash.com/photo-1682695798176-bb7f231c9520?w=400",
      title: "Gullar",
      description: "Yovvoyi gullar",
      category: "nature",
      orientation: "square",
      photographer: "Flower Power",
      photographerAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
      location: "Netherlands",
      date: "2024-04-05",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4000,
      height: 4000,
      tags: ["flowers", "nature", "colorful"],
      featured: Math.random() > 0.7
    },

    // SHAHAR RASMLARI (15 ta)
    {
      id: 11,
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
      thumb: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
      title: "Nyu-York kechasi",
      description: "Nyu-York shahrining tungi manzarasi",
      category: "city",
      orientation: "landscape",
      photographer: "David Lee",
      photographerAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
      location: "New York City",
      date: "2024-03-15",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["new york", "city", "night"],
      featured: Math.random() > 0.7
    },
    {
      id: 12,
      url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
      thumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400",
      title: "Tokio ko'chalari",
      description: "Tokioning gavjum ko'chalari",
      category: "city",
      orientation: "landscape",
      photographer: "Yuki Tanaka",
      photographerAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
      location: "Tokyo, Japan",
      date: "2024-02-10",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4800,
      height: 3200,
      tags: ["tokyo", "japan", "street"],
      featured: Math.random() > 0.7
    },
    {
      id: 13,
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      thumb: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
      title: "Parij",
      description: "Eyfel minorasi",
      category: "city",
      orientation: "portrait",
      photographer: "Marie Dubois",
      photographerAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
      location: "Paris, France",
      date: "2024-01-20",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 5000,
      tags: ["paris", "eiffel", "france"],
      featured: Math.random() > 0.7
    },
    {
      id: 14,
      url: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800",
      thumb: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400",
      title: "London",
      description: "London ko'prigi",
      category: "city",
      orientation: "landscape",
      photographer: "James Wilson",
      photographerAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
      location: "London, UK",
      date: "2024-03-05",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5200,
      height: 3400,
      tags: ["london", "bridge", "uk"],
      featured: Math.random() > 0.7
    },
    {
      id: 15,
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      thumb: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
      title: "Dubay",
      description: "Dubay silueti",
      category: "city",
      orientation: "landscape",
      photographer: "Ahmed Al-Rashid",
      photographerAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
      location: "Dubai, UAE",
      date: "2024-02-18",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5500,
      height: 3500,
      tags: ["dubai", "uae", "skyscraper"],
      featured: Math.random() > 0.7
    },
    {
      id: 16,
      url: "https://images.unsplash.com/photo-1683009427470-d36a46fea7c5?w=800",
      thumb: "https://images.unsplash.com/photo-1683009427470-d36a46fea7c5?w=400",
      title: "Singapur",
      description: "Singapur silueti",
      category: "city",
      orientation: "landscape",
      photographer: "City Lights",
      photographerAvatar: "https://randomuser.me/api/portraits/men/28.jpg",
      location: "Singapore",
      date: "2024-03-30",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 6000,
      height: 4000,
      tags: ["singapore", "city", "modern"],
      featured: Math.random() > 0.7
    },
    {
      id: 17,
      url: "https://images.unsplash.com/photo-1683009427513-28e163402d5e?w=800",
      thumb: "https://images.unsplash.com/photo-1683009427513-28e163402d5e?w=400",
      title: "Shanxay",
      description: "Shanxay tungi manzarasi",
      category: "city",
      orientation: "landscape",
      photographer: "Metropolis",
      photographerAvatar: "https://randomuser.me/api/portraits/women/29.jpg",
      location: "Shanghai, China",
      date: "2024-03-20",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5800,
      height: 3800,
      tags: ["shanghai", "china", "night"],
      featured: Math.random() > 0.7
    },

    // PORT RET RASMLAR (10 ta)
    {
      id: 18,
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      title: "Portret",
      description: "Ayol portreti",
      category: "portrait",
      orientation: "portrait",
      photographer: "Emma Watson",
      photographerAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
      location: "Studio",
      date: "2024-01-25",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 4500,
      tags: ["portrait", "woman", "beauty"],
      featured: Math.random() > 0.7
    },
    {
      id: 19,
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
      thumb: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      title: "Erkak portreti",
      description: "Erkak portreti",
      category: "portrait",
      orientation: "portrait",
      photographer: "Tom Hardy",
      photographerAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
      location: "London",
      date: "2024-02-22",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3300,
      height: 4500,
      tags: ["portrait", "man", "style"],
      featured: Math.random() > 0.7
    },
    {
      id: 20,
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
      thumb: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      title: "Qiz portreti",
      description: "Qiz portreti",
      category: "portrait",
      orientation: "portrait",
      photographer: "Sophie Turner",
      photographerAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
      location: "Paris",
      date: "2024-03-12",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3400,
      height: 4600,
      tags: ["portrait", "girl", "beautiful"],
      featured: Math.random() > 0.7
    },

    // HAYVONLAR (15 ta)
    {
      id: 21,
      url: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
      thumb: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400",
      title: "Yo'lbars",
      description: "Yo'lbars portreti",
      category: "animals",
      orientation: "portrait",
      photographer: "Wildlife Pro",
      photographerAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
      location: "India",
      date: "2024-01-30",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 4500,
      tags: ["tiger", "wildlife", "animal"],
      featured: Math.random() > 0.7
    },
    {
      id: 22,
      url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800",
      thumb: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400",
      title: "Fil",
      description: "Afrika fili",
      category: "animals",
      orientation: "landscape",
      photographer: "Safari Guide",
      photographerAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
      location: "Kenya",
      date: "2024-02-05",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["elephant", "africa", "wildlife"],
      featured: Math.random() > 0.7
    },
    {
      id: 23,
      url: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800",
      thumb: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=400",
      title: "Mushuk",
      description: "Mushuk",
      category: "animals",
      orientation: "square",
      photographer: "Pet Lover",
      photographerAvatar: "https://randomuser.me/api/portraits/women/8.jpg",
      location: "Home",
      date: "2024-03-08",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4000,
      height: 4000,
      tags: ["cat", "pet", "cute"],
      featured: Math.random() > 0.7
    },
    {
      id: 24,
      url: "https://images.unsplash.com/photo-1554456854-55a089fd4cb2?w=800",
      thumb: "https://images.unsplash.com/photo-1554456854-55a089fd4cb2?w=400",
      title: "It",
      description: "Kuchukcha",
      category: "animals",
      orientation: "square",
      photographer: "Dog Walker",
      photographerAvatar: "https://randomuser.me/api/portraits/men/9.jpg",
      location: "Park",
      date: "2024-02-15",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4000,
      height: 4000,
      tags: ["dog", "puppy", "pet"],
      featured: Math.random() > 0.7
    },
    {
      id: 25,
      url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800",
      thumb: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400",
      title: "Sher",
      description: "Afrika sheri",
      category: "animals",
      orientation: "landscape",
      photographer: "Wild Safari",
      photographerAvatar: "https://randomuser.me/api/portraits/men/31.jpg",
      location: "Tanzania",
      date: "2024-01-12",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5500,
      height: 3600,
      tags: ["lion", "africa", "wildlife"],
      featured: Math.random() > 0.7
    },

    // ARXITEKTURA (10 ta)
    {
      id: 26,
      url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      thumb: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400",
      title: "Modern uy",
      description: "Zamonaviy arxitektura",
      category: "architecture",
      orientation: "landscape",
      photographer: "Arch Daily",
      photographerAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
      location: "California",
      date: "2024-01-18",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5500,
      height: 3500,
      tags: ["architecture", "modern", "house"],
      featured: Math.random() > 0.7
    },
    {
      id: 27,
      url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800",
      thumb: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400",
      title: "Qadimiy bino",
      description: "Qadimiy arxitektura",
      category: "architecture",
      orientation: "portrait",
      photographer: "History Lover",
      photographerAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
      location: "Rome, Italy",
      date: "2024-02-25",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 5000,
      tags: ["architecture", "ancient", "historic"],
      featured: Math.random() > 0.7
    },

    // FOOD (10 ta)
    {
      id: 28,
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      title: "Taom",
      description: "Mazali taom",
      category: "food",
      orientation: "square",
      photographer: "Food Blogger",
      photographerAvatar: "https://randomuser.me/api/portraits/women/10.jpg",
      location: "Restaurant",
      date: "2024-01-22",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4000,
      height: 4000,
      tags: ["food", "restaurant", "delicious"],
      featured: Math.random() > 0.7
    },
    {
      id: 29,
      url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800",
      thumb: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400",
      title: "Pitsa",
      description: "Italiyan pitsasi",
      category: "food",
      orientation: "landscape",
      photographer: "Pizza Master",
      photographerAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
      location: "Naples, Italy",
      date: "2024-02-28",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4800,
      height: 3200,
      tags: ["pizza", "italian", "food"],
      featured: Math.random() > 0.7
    },

    // SPORT (10 ta)
    {
      id: 30,
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
      thumb: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
      title: "Futbol",
      description: "Futbol o'yini",
      category: "sports",
      orientation: "landscape",
      photographer: "Sports Photographer",
      photographerAvatar: "https://randomuser.me/api/portraits/men/13.jpg",
      location: "Stadium",
      date: "2024-01-28",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5500,
      height: 3500,
      tags: ["football", "sports", "game"],
      featured: Math.random() > 0.7
    },
    {
      id: 31,
      url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
      thumb: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
      title: "Basketbol",
      description: "Basketbol",
      category: "sports",
      orientation: "portrait",
      photographer: "NBA Fan",
      photographerAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
      location: "Court",
      date: "2024-02-20",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 4500,
      tags: ["basketball", "sports", "nba"],
      featured: Math.random() > 0.7
    },

    // FASHION (8 ta)
    {
      id: 32,
      url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
      thumb: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400",
      title: "Moda",
      description: "Moda ko'rinishi",
      category: "fashion",
      orientation: "portrait",
      photographer: "Fashion Week",
      photographerAvatar: "https://randomuser.me/api/portraits/women/13.jpg",
      location: "Milan",
      date: "2024-01-12",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 3500,
      height: 5000,
      tags: ["fashion", "model", "style"],
      featured: Math.random() > 0.7
    },

    // TRAVEL (10 ta)
    {
      id: 33,
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
      thumb: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
      title: "Sayohat",
      description: "Sayohat",
      category: "travel",
      orientation: "landscape",
      photographer: "Traveler",
      photographerAvatar: "https://randomuser.me/api/portraits/men/15.jpg",
      location: "Bali",
      date: "2024-01-08",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5500,
      height: 3500,
      tags: ["travel", "vacation", "beach"],
      featured: Math.random() > 0.7
    },

    // TECHNOLOGY (8 ta)
    {
      id: 34,
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
      thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
      title: "Texnologiya",
      description: "Zamonaviy texnologiya",
      category: "technology",
      orientation: "landscape",
      photographer: "Tech Guru",
      photographerAvatar: "https://randomuser.me/api/portraits/men/17.jpg",
      location: "Lab",
      date: "2024-01-25",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["technology", "circuit", "future"],
      featured: Math.random() > 0.7
    },

    // BUSINESS (6 ta)
    {
      id: 35,
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
      thumb: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
      title: "Biznes",
      description: "Biznes uchrashuvi",
      category: "business",
      orientation: "landscape",
      photographer: "CEO",
      photographerAvatar: "https://randomuser.me/api/portraits/women/18.jpg",
      location: "Office",
      date: "2024-01-30",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["business", "meeting", "office"],
      featured: Math.random() > 0.7
    },

    // HEALTH (6 ta)
    {
      id: 36,
      url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
      thumb: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      title: "Salomatlik",
      description: "Salomatlik",
      category: "health",
      orientation: "landscape",
      photographer: "Wellness Coach",
      photographerAvatar: "https://randomuser.me/api/portraits/women/20.jpg",
      location: "Gym",
      date: "2024-01-15",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["health", "wellness", "fitness"],
      featured: Math.random() > 0.7
    },

    // ABSTRACT (6 ta)
    {
      id: 37,
      url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
      thumb: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
      title: "Abstrakt",
      description: "Abstrakt san'at",
      category: "abstract",
      orientation: "square",
      photographer: "Digital Artist",
      photographerAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
      location: "Studio",
      date: "2024-01-20",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 4000,
      height: 4000,
      tags: ["abstract", "art", "colorful"],
      featured: Math.random() > 0.7
    },

    // MUSIC (6 ta)
    {
      id: 38,
      url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
      thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
      title: "Musiqa",
      description: "Musiqa asboblari",
      category: "music",
      orientation: "landscape",
      photographer: "Musician",
      photographerAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
      location: "Studio",
      date: "2024-01-10",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["music", "instruments", "studio"],
      featured: Math.random() > 0.7
    },

    // EDUCATION (6 ta)
    {
      id: 39,
      url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
      thumb: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
      title: "Ta'lim",
      description: "Kutubxona",
      category: "education",
      orientation: "landscape",
      photographer: "Teacher",
      photographerAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
      location: "Library",
      date: "2024-01-25",
      views: Math.floor(Math.random() * 50000) + 5000,
      likes: Math.floor(Math.random() * 5000) + 500,
      downloads: Math.floor(Math.random() * 3000) + 200,
      width: 5000,
      height: 3500,
      tags: ["education", "library", "books"],
      featured: Math.random() > 0.7
    },
     {
    id: 51,
    url: "https://images.unsplash.com/photo-1682686581740-2c5f76eb86d1?w=800",
    thumb: "https://images.unsplash.com/photo-1682686581740-2c5f76eb86d1?w=400",
    title: "Qorli tog'lar",
    description: "Qor bilan qoplangan tog' cho'qqilari",
    category: "nature",
    orientation: "landscape",
    photographer: "Eco Explorer",
    photographerAvatar: "https://randomuser.me/api/portraits/men/25.jpg",
    location: "Himalayas, Nepal",
    date: "2024-04-01",
    views: 28976,
    likes: 4234,
    downloads: 1567,
    width: 6000,
    height: 4000,
    tags: ["snow", "mountains", "winter"],
    featured: true
  },
  {
    id: 52,
    url: "https://images.unsplash.com/photo-1682695798256-28a674122872?w=800",
    thumb: "https://images.unsplash.com/photo-1682695798256-28a674122872?w=400",
    title: "Kuzgi o'rmon",
    description: "Kuzgi ranglardagi o'rmon",
    category: "nature",
    orientation: "landscape",
    photographer: "Season Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/women/27.jpg",
    location: "Vermont, USA",
    date: "2024-03-25",
    views: 19876,
    likes: 3123,
    downloads: 1432,
    width: 5500,
    height: 3700,
    tags: ["autumn", "forest", "colors"],
    featured: true
  },
  {
    id: 53,
    url: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=800",
    thumb: "https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=400",
    title: "Sharshara",
    description: "Tog'li hududdagi sharshara",
    category: "nature",
    orientation: "portrait",
    photographer: "Waterfall Hunter",
    photographerAvatar: "https://randomuser.me/api/portraits/men/26.jpg",
    location: "Iceland",
    date: "2024-03-18",
    views: 24567,
    likes: 3890,
    downloads: 1789,
    width: 3500,
    height: 5200,
    tags: ["waterfall", "nature", "water"],
    featured: false
  },
  {
    id: 54,
    url: "https://images.unsplash.com/photo-1682695798522-6e208131916d?w=800",
    thumb: "https://images.unsplash.com/photo-1682695798522-6e208131916d?w=400",
    title: "Sahro",
    description: "Qumli sahro manzarasi",
    category: "nature",
    orientation: "landscape",
    photographer: "Desert Nomad",
    photographerAvatar: "https://randomuser.me/api/portraits/men/27.jpg",
    location: "Sahara Desert",
    date: "2024-02-28",
    views: 16789,
    likes: 2765,
    downloads: 1234,
    width: 5800,
    height: 3600,
    tags: ["desert", "sand", "dunes"],
    featured: true
  },
  {
    id: 55,
    url: "https://images.unsplash.com/photo-1682695798176-bb7f231c9520?w=800",
    thumb: "https://images.unsplash.com/photo-1682695798176-bb7f231c9520?w=400",
    title: "Gullar",
    description: "Yovvoyi gullar",
    category: "nature",
    orientation: "square",
    photographer: "Flower Power",
    photographerAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    location: "Netherlands",
    date: "2024-04-05",
    views: 14567,
    likes: 2987,
    downloads: 1098,
    width: 4000,
    height: 4000,
    tags: ["flowers", "nature", "colorful"],
    featured: false
  },

  // SHAHAR RASMLARI - QO'SHIMCHA
  {
    id: 56,
    url: "https://images.unsplash.com/photo-1683009427470-d36a46fea7c5?w=800",
    thumb: "https://images.unsplash.com/photo-1683009427470-d36a46fea7c5?w=400",
    title: "Singapur",
    description: "Singapur silueti",
    category: "city",
    orientation: "landscape",
    photographer: "City Lights",
    photographerAvatar: "https://randomuser.me/api/portraits/men/28.jpg",
    location: "Singapore",
    date: "2024-03-30",
    views: 31234,
    likes: 4987,
    downloads: 2345,
    width: 6000,
    height: 4000,
    tags: ["singapore", "city", "modern"],
    featured: true
  },
  {
    id: 57,
    url: "https://images.unsplash.com/photo-1683009427513-28e163402d5e?w=800",
    thumb: "https://images.unsplash.com/photo-1683009427513-28e163402d5e?w=400",
    title: "Shanxay",
    description: "Shanxay tungi manzarasi",
    category: "city",
    orientation: "landscape",
    photographer: "Metropolis",
    photographerAvatar: "https://randomuser.me/api/portraits/women/29.jpg",
    location: "Shanghai, China",
    date: "2024-03-20",
    views: 28765,
    likes: 4567,
    downloads: 1987,
    width: 5800,
    height: 3800,
    tags: ["shanghai", "china", "night"],
    featured: true
  },
  {
    id: 58,
    url: "https://images.unsplash.com/photo-1683009427698-5c9c6f8b47a9?w=800",
    thumb: "https://images.unsplash.com/photo-1683009427698-5c9c6f8b47a9?w=400",
    title: "Barselona",
    description: "Barselona arxitekturasi",
    category: "city",
    orientation: "portrait",
    photographer: "Spanish Eyes",
    photographerAvatar: "https://randomuser.me/api/portraits/men/29.jpg",
    location: "Barcelona, Spain",
    date: "2024-02-25",
    views: 19876,
    likes: 3456,
    downloads: 1654,
    width: 3400,
    height: 5200,
    tags: ["barcelona", "spain", "architecture"],
    featured: false
  },
  {
    id: 59,
    url: "https://images.unsplash.com/photo-1683009427913-5ef7ecb2a1f1?w=800",
    thumb: "https://images.unsplash.com/photo-1683009427913-5ef7ecb2a1f1?w=400",
    title: "Amsterdam",
    description: "Amsterdam kanallari",
    category: "city",
    orientation: "landscape",
    photographer: "Canal Dreamer",
    photographerAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
    location: "Amsterdam, Netherlands",
    date: "2024-04-02",
    views: 22345,
    likes: 3789,
    downloads: 1876,
    width: 5600,
    height: 3700,
    tags: ["amsterdam", "canals", "netherlands"],
    featured: true
  },
  {
    id: 60,
    url: "https://images.unsplash.com/photo-1683009428052-0a8c5b8edc8d?w=800",
    thumb: "https://images.unsplash.com/photo-1683009428052-0a8c5b8edc8d?w=400",
    title: "San-Fransisko",
    description: "Golden Gate ko'prigi",
    category: "city",
    orientation: "landscape",
    photographer: "Bridge Viewer",
    photographerAvatar: "https://randomuser.me/api/portraits/men/30.jpg",
    location: "San Francisco, USA",
    date: "2024-03-15",
    views: 26789,
    likes: 4321,
    downloads: 2109,
    width: 5900,
    height: 3900,
    tags: ["san francisco", "bridge", "california"],
    featured: true
  },

  // HAYVONLAR - QO'SHIMCHA
  {
    id: 61,
    url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800",
    thumb: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400",
    title: "Sher",
    description: "Afrika sheri",
    category: "animals",
    orientation: "landscape",
    photographer: "Wild Safari",
    photographerAvatar: "https://randomuser.me/api/portraits/men/31.jpg",
    location: "Tanzania",
    date: "2024-01-12",
    views: 34567,
    likes: 5678,
    downloads: 2876,
    width: 5500,
    height: 3600,
    tags: ["lion", "africa", "wildlife"],
    featured: true
  },
  {
    id: 62,
    url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800",
    thumb: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400",
    title: "Jirafa",
    description: "Jirafa",
    category: "animals",
    orientation: "portrait",
    photographer: "Savanna Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/women/31.jpg",
    location: "Kenya",
    date: "2024-02-08",
    views: 19876,
    likes: 3123,
    downloads: 1543,
    width: 3300,
    height: 5000,
    tags: ["giraffe", "africa", "savanna"],
    featured: false
  },
  {
    id: 63,
    url: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800",
    thumb: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400",
    title: "Zebra",
    description: "Zebra",
    category: "animals",
    orientation: "landscape",
    photographer: "Pattern Hunter",
    photographerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Botswana",
    date: "2024-03-05",
    views: 16543,
    likes: 2876,
    downloads: 1234,
    width: 5200,
    height: 3400,
    tags: ["zebra", "africa", "stripes"],
    featured: true
  },
  {
    id: 64,
    url: "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=800",
    thumb: "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=400",
    title: "Panda",
    description: "Panda ayiq",
    category: "animals",
    orientation: "square",
    photographer: "Panda Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    location: "China",
    date: "2024-01-30",
    views: 28765,
    likes: 4987,
    downloads: 2345,
    width: 4000,
    height: 4000,
    tags: ["panda", "bear", "china"],
    featured: true
  },
  {
    id: 65,
    url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
    thumb: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400",
    title: "Tulki",
    description: "Qizil tulki",
    category: "animals",
    orientation: "portrait",
    photographer: "Forest Guardian",
    photographerAvatar: "https://randomuser.me/api/portraits/men/33.jpg",
    location: "Finland",
    date: "2024-02-18",
    views: 17654,
    likes: 2987,
    downloads: 1456,
    width: 3500,
    height: 4800,
    tags: ["fox", "wildlife", "forest"],
    featured: false
  },
  {
    id: 66,
    url: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800",
    thumb: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=400",
    title: "Mushukcha",
    description: "Kichkina mushukcha",
    category: "animals",
    orientation: "square",
    photographer: "Cat Mom",
    photographerAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    location: "Home",
    date: "2024-03-22",
    views: 23456,
    likes: 4123,
    downloads: 1987,
    width: 4000,
    height: 4000,
    tags: ["kitten", "cat", "cute"],
    featured: true
  },
  {
    id: 67,
    url: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800",
    thumb: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=400",
    title: "To'ti",
    description: "Rangli to'ti",
    category: "animals",
    orientation: "portrait",
    photographer: "Bird Watcher",
    photographerAvatar: "https://randomuser.me/api/portraits/men/34.jpg",
    location: "Amazon",
    date: "2024-02-25",
    views: 15432,
    likes: 2765,
    downloads: 1098,
    width: 3400,
    height: 4800,
    tags: ["parrot", "bird", "colorful"],
    featured: true
  },
  {
    id: 68,
    url: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
    thumb: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=400",
    title: "Yo'lbars bolasi",
    description: "Yo'lbars bolasi",
    category: "animals",
    orientation: "landscape",
    photographer: "Wildlife Protector",
    photographerAvatar: "https://randomuser.me/api/portraits/women/34.jpg",
    location: "India",
    date: "2024-04-01",
    views: 19876,
    likes: 3345,
    downloads: 1678,
    width: 5200,
    height: 3400,
    tags: ["tiger", "cub", "wildlife"],
    featured: false
  },
  {
    id: 69,
    url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800",
    thumb: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400",
    title: "Tulki",
    description: "Qizil tulki",
    category: "animals",
    orientation: "landscape",
    photographer: "Nature Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/men/35.jpg",
    location: "Canada",
    date: "2024-03-10",
    views: 16789,
    likes: 2890,
    downloads: 1345,
    width: 5000,
    height: 3500,
    tags: ["fox", "wild", "nature"],
    featured: true
  },
  {
    id: 70,
    url: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=800",
    thumb: "https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400",
    title: "Kiyik",
    description: "Kiyik",
    category: "animals",
    orientation: "portrait",
    photographer: "Deer Spotter",
    photographerAvatar: "https://randomuser.me/api/portraits/women/35.jpg",
    location: "Scotland",
    date: "2024-02-15",
    views: 14567,
    likes: 2654,
    downloads: 1123,
    width: 3500,
    height: 5000,
    tags: ["deer", "wildlife", "forest"],
    featured: false
  },

  // SPORT - QO'SHIMCHA
  {
    id: 71,
    url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
    thumb: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
    title: "Basketbol",
    description: "Basketbol o'yini",
    category: "sports",
    orientation: "landscape",
    photographer: "Sports Action",
    photographerAvatar: "https://randomuser.me/api/portraits/men/36.jpg",
    location: "NBA Arena",
    date: "2024-01-18",
    views: 27654,
    likes: 4567,
    downloads: 2345,
    width: 5500,
    height: 3600,
    tags: ["basketball", "sports", "game"],
    featured: true
  },
  {
    id: 72,
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    thumb: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    title: "Futbol",
    description: "Futbol o'yini",
    category: "sports",
    orientation: "landscape",
    photographer: "Football Fanatic",
    photographerAvatar: "https://randomuser.me/api/portraits/men/37.jpg",
    location: "Stadium",
    date: "2024-02-22",
    views: 29876,
    likes: 4987,
    downloads: 2567,
    width: 5800,
    height: 3800,
    tags: ["football", "soccer", "game"],
    featured: true
  },
  {
    id: 73,
    url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    thumb: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400",
    title: "Marafon",
    description: "Yugurish marafoni",
    category: "sports",
    orientation: "landscape",
    photographer: "Runner's World",
    photographerAvatar: "https://randomuser.me/api/portraits/women/36.jpg",
    location: "Boston",
    date: "2024-03-28",
    views: 18765,
    likes: 3123,
    downloads: 1654,
    width: 5200,
    height: 3400,
    tags: ["marathon", "running", "race"],
    featured: false
  },
  {
    id: 74,
    url: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800",
    thumb: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=400",
    title: "Suzish",
    description: "Suzish musobaqasi",
    category: "sports",
    orientation: "landscape",
    photographer: "Aqua Sports",
    photographerAvatar: "https://randomuser.me/api/portraits/men/38.jpg",
    location: "Pool",
    date: "2024-02-05",
    views: 16543,
    likes: 2876,
    downloads: 1432,
    width: 5000,
    height: 3300,
    tags: ["swimming", "sports", "water"],
    featured: true
  },
  {
    id: 75,
    url: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800",
    thumb: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400",
    title: "Tog' chang'isi",
    description: "Chang'i sporti",
    category: "sports",
    orientation: "portrait",
    photographer: "Snow Rider",
    photographerAvatar: "https://randomuser.me/api/portraits/women/37.jpg",
    location: "Swiss Alps",
    date: "2024-01-30",
    views: 23456,
    likes: 3987,
    downloads: 1987,
    width: 3500,
    height: 5000,
    tags: ["skiing", "winter", "snow"],
    featured: true
  },

  // FASHION - QO'SHIMCHA
  {
    id: 76,
    url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
    thumb: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400",
    title: "Moda ko'rinishi",
    description: "Podiumda",
    category: "fashion",
    orientation: "portrait",
    photographer: "Fashion Forward",
    photographerAvatar: "https://randomuser.me/api/portraits/women/38.jpg",
    location: "Milan Fashion Week",
    date: "2024-02-28",
    views: 25678,
    likes: 4321,
    downloads: 2109,
    width: 3500,
    height: 5200,
    tags: ["fashion", "runway", "style"],
    featured: true
  },
  {
    id: 77,
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    thumb: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
    title: "Kuzgi moda",
    description: "Kuzgi kiyimlar",
    category: "fashion",
    orientation: "portrait",
    photographer: "Style Icon",
    photographerAvatar: "https://randomuser.me/api/portraits/women/39.jpg",
    location: "Paris",
    date: "2024-03-15",
    views: 19876,
    likes: 3456,
    downloads: 1765,
    width: 3400,
    height: 5000,
    tags: ["autumn", "fashion", "style"],
    featured: false
  },
  {
    id: 78,
    url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800",
    thumb: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400",
    title: "Aksessuarlar",
    description: "Zamonaviy aksessuarlar",
    category: "fashion",
    orientation: "square",
    photographer: "Accessory Queen",
    photographerAvatar: "https://randomuser.me/api/portraits/women/40.jpg",
    location: "New York",
    date: "2024-04-05",
    views: 14567,
    likes: 2654,
    downloads: 1234,
    width: 4000,
    height: 4000,
    tags: ["accessories", "jewelry", "fashion"],
    featured: true
  },
  {
    id: 79,
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
    thumb: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400",
    title: "Yozgi moda",
    description: "Yozgi kiyimlar",
    category: "fashion",
    orientation: "landscape",
    photographer: "Summer Vibes",
    photographerAvatar: "https://randomuser.me/api/portraits/women/41.jpg",
    location: "Miami",
    date: "2024-03-20",
    views: 17654,
    likes: 2987,
    downloads: 1543,
    width: 5200,
    height: 3400,
    tags: ["summer", "fashion", "beach"],
    featured: false
  },
  {
    id: 80,
    url: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800",
    thumb: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=400",
    title: "Streetwear",
    description: "Ko'cha modasi",
    category: "fashion",
    orientation: "portrait",
    photographer: "Street Style",
    photographerAvatar: "https://randomuser.me/api/portraits/men/39.jpg",
    location: "Tokyo",
    date: "2024-02-12",
    views: 18765,
    likes: 3234,
    downloads: 1654,
    width: 3500,
    height: 5000,
    tags: ["streetwear", "urban", "style"],
    featured: true
  },

  // TEXNOLOGIYA - QO'SHIMCHA
  {
    id: 81,
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    title: "Mikrochip",
    description: "Kompyuter chipi",
    category: "technology",
    orientation: "square",
    photographer: "Tech Geek",
    photographerAvatar: "https://randomuser.me/api/portraits/men/40.jpg",
    location: "Lab",
    date: "2024-01-22",
    views: 23456,
    likes: 3987,
    downloads: 1876,
    width: 4000,
    height: 4000,
    tags: ["chip", "technology", "computer"],
    featured: true
  },
  {
    id: 82,
    url: "https://images.unsplash.com/photo-1517430816045-df4b7de01e3d?w=800",
    thumb: "https://images.unsplash.com/photo-1517430816045-df4b7de01e3d?w=400",
    title: "Ish stoli",
    description: "Zamonaviy ish stoli",
    category: "technology",
    orientation: "landscape",
    photographer: "Digital Workspace",
    photographerAvatar: "https://randomuser.me/api/portraits/women/42.jpg",
    location: "Office",
    date: "2024-02-18",
    views: 16543,
    likes: 2876,
    downloads: 1345,
    width: 5500,
    height: 3600,
    tags: ["desktop", "workspace", "technology"],
    featured: false
  },
  {
    id: 83,
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    title: "VR",
    description: "Virtual reallik",
    category: "technology",
    orientation: "portrait",
    photographer: "Future Tech",
    photographerAvatar: "https://randomuser.me/api/portraits/men/41.jpg",
    location: "Tech Expo",
    date: "2024-03-25",
    views: 19876,
    likes: 3456,
    downloads: 1654,
    width: 3500,
    height: 5000,
    tags: ["vr", "virtual reality", "future"],
    featured: true
  },
  {
    id: 84,
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    thumb: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    title: "Robot",
    description: "Zamonaviy robot",
    category: "technology",
    orientation: "landscape",
    photographer: "AI Enthusiast",
    photographerAvatar: "https://randomuser.me/api/portraits/women/43.jpg",
    location: "Tech Lab",
    date: "2024-04-01",
    views: 22345,
    likes: 3789,
    downloads: 1987,
    width: 5200,
    height: 3400,
    tags: ["robot", "ai", "technology"],
    featured: true
  },
  {
    id: 85,
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    thumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    title: "Koinot",
    description: "Koinot texnologiyalari",
    category: "technology",
    orientation: "landscape",
    photographer: "Space Explorer",
    photographerAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    location: "NASA",
    date: "2024-02-28",
    views: 31234,
    likes: 5123,
    downloads: 2789,
    width: 6000,
    height: 4000,
    tags: ["space", "technology", "universe"],
    featured: true
  },

  // OZIQ-OVQAT - QO'SHIMCHA
  {
    id: 86,
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    title: "Burger",
    description: "Mazali burger",
    category: "food",
    orientation: "square",
    photographer: "Food Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/men/43.jpg",
    location: "Restaurant",
    date: "2024-01-15",
    views: 27654,
    likes: 4567,
    downloads: 2345,
    width: 4000,
    height: 4000,
    tags: ["burger", "fast food", "delicious"],
    featured: true
  },
  {
    id: 87,
    url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800",
    thumb: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400",
    title: "Pitsa",
    description: "Pitsa",
    category: "food",
    orientation: "landscape",
    photographer: "Pizza Chef",
    photographerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Italy",
    date: "2024-02-20",
    views: 24567,
    likes: 4123,
    downloads: 2109,
    width: 5500,
    height: 3600,
    tags: ["pizza", "italian", "food"],
    featured: true
  },
  {
    id: 88,
    url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800",
    thumb: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400",
    title: "Nonushta",
    description: "Nonushta",
    category: "food",
    orientation: "landscape",
    photographer: "Morning Meal",
    photographerAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
    location: "Cafe",
    date: "2024-03-12",
    views: 18765,
    likes: 3123,
    downloads: 1654,
    width: 5000,
    height: 3500,
    tags: ["breakfast", "food", "morning"],
    featured: false
  },
  {
    id: 89,
    url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
    thumb: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400",
    title: "Salat",
    description: "Sog'lom salat",
    category: "food",
    orientation: "square",
    photographer: "Healthy Eats",
    photographerAvatar: "https://randomuser.me/api/portraits/men/44.jpg",
    location: "Kitchen",
    date: "2024-02-05",
    views: 15432,
    likes: 2765,
    downloads: 1234,
    width: 4000,
    height: 4000,
    tags: ["salad", "healthy", "food"],
    featured: true
  },
  {
    id: 90,
    url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
    thumb: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
    title: "Ichimlik",
    description: "Kokteyl",
    category: "food",
    orientation: "portrait",
    photographer: "Mixologist",
    photographerAvatar: "https://randomuser.me/api/portraits/women/46.jpg",
    location: "Bar",
    date: "2024-03-30",
    views: 17654,
    likes: 2987,
    downloads: 1456,
    width: 3500,
    height: 5000,
    tags: ["cocktail", "drink", "bar"],
    featured: false
  },

  // SAYOHAT - QO'SHIMCHA
  {
    id: 91,
    url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    thumb: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
    title: "Plyaj",
    description: "Maldiv plyaji",
    category: "travel",
    orientation: "landscape",
    photographer: "Beach Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/women/47.jpg",
    location: "Maldives",
    date: "2024-01-28",
    views: 34567,
    likes: 5678,
    downloads: 2987,
    width: 6000,
    height: 4000,
    tags: ["beach", "paradise", "vacation"],
    featured: true
  },
  {
    id: 92,
    url: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800",
    thumb: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400",
    title: "Yo'l",
    description: "Cheksiz yo'l",
    category: "travel",
    orientation: "landscape",
    photographer: "Road Trip",
    photographerAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    location: "USA",
    date: "2024-02-15",
    views: 23456,
    likes: 4123,
    downloads: 1987,
    width: 5800,
    height: 3800,
    tags: ["road", "travel", "adventure"],
    featured: true
  },
  {
    id: 93,
    url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800",
    thumb: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400",
    title: "Samolyot",
    description: "Samolyot oynasidan ko'rinish",
    category: "travel",
    orientation: "landscape",
    photographer: "Frequent Flyer",
    photographerAvatar: "https://randomuser.me/api/portraits/women/48.jpg",
    location: "Above Clouds",
    date: "2024-03-18",
    views: 19876,
    likes: 3456,
    downloads: 1765,
    width: 5200,
    height: 3400,
    tags: ["plane", "travel", "clouds"],
    featured: false
  },
  {
    id: 94,
    url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800",
    thumb: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400",
    title: "Venetsiya",
    description: "Venetsiya kanallari",
    category: "travel",
    orientation: "landscape",
    photographer: "Italy Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/men/46.jpg",
    location: "Venice, Italy",
    date: "2024-04-08",
    views: 27654,
    likes: 4789,
    downloads: 2345,
    width: 5600,
    height: 3700,
    tags: ["venice", "italy", "canal"],
    featured: true
  },
  {
    id: 95,
    url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
    thumb: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400",
    title: "Fuji tog'i",
    description: "Fuji tog'i",
    category: "travel",
    orientation: "portrait",
    photographer: "Japan Explorer",
    photographerAvatar: "https://randomuser.me/api/portraits/women/49.jpg",
    location: "Japan",
    date: "2024-03-05",
    views: 31234,
    likes: 5234,
    downloads: 2678,
    width: 3500,
    height: 5200,
    tags: ["fuji", "japan", "mountain"],
    featured: true
  },

  // SAN'AT - QO'SHIMCHA
  {
    id: 96,
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
    thumb: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400",
    title: "Abstrakt san'at",
    description: "Abstrakt rasm",
    category: "art",
    orientation: "square",
    photographer: "Abstract Artist",
    photographerAvatar: "https://randomuser.me/api/portraits/men/47.jpg",
    location: "Gallery",
    date: "2024-01-20",
    views: 18765,
    likes: 3123,
    downloads: 1543,
    width: 4000,
    height: 4000,
    tags: ["abstract", "art", "colorful"],
    featured: true
  },
  {
    id: 97,
    url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    thumb: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
    title: "Bo'yoqlar",
    description: "Rassom bo'yoqlari",
    category: "art",
    orientation: "landscape",
    photographer: "Painter",
    photographerAvatar: "https://randomuser.me/api/portraits/women/50.jpg",
    location: "Studio",
    date: "2024-02-25",
    views: 14567,
    likes: 2543,
    downloads: 1098,
    width: 5000,
    height: 3500,
    tags: ["paint", "art", "colors"],
    featured: false
  },
  {
    id: 98,
    url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    thumb: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    title: "Haykal",
    description: "Qadimiy haykal",
    category: "art",
    orientation: "portrait",
    photographer: "Sculpture Lover",
    photographerAvatar: "https://randomuser.me/api/portraits/men/48.jpg",
    location: "Museum",
    date: "2024-03-22",
    views: 17654,
    likes: 2987,
    downloads: 1345,
    width: 3500,
    height: 5000,
    tags: ["sculpture", "art", "statue"],
    featured: true
  },
  {
    id: 99,
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    thumb: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
    title: "Grafiti",
    description: "Ko'cha san'ati",
    category: "art",
    orientation: "landscape",
    photographer: "Street Artist",
    photographerAvatar: "https://randomuser.me/api/portraits/women/51.jpg",
    location: "Berlin",
    date: "2024-02-10",
    views: 19876,
    likes: 3345,
    downloads: 1765,
    width: 5500,
    height: 3600,
    tags: ["graffiti", "street art", "urban"],
    featured: true
  },
  {
    id: 100,
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad2b119?w=800",
    thumb: "https://images.unsplash.com/photo-1579783900882-c0d3dad2b119?w=400",
    title: "Zamonaviy san'at",
    description: "Zamonaviy san'at ko'rgazmasi",
    category: "art",
    orientation: "landscape",
    photographer: "Modern Art",
    photographerAvatar: "https://randomuser.me/api/portraits/men/49.jpg",
    location: "Gallery",
    date: "2024-04-12",
    views: 22345,
    likes: 3876,
    downloads: 1987,
    width: 5800,
    height: 3800,
    tags: ["modern art", "exhibition", "contemporary"],
    featured: false
  }
  ];

  // Rasmlarni random tartibda aralashtirish funksiyasi
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Rasmlarni yuklash
  const fetchImages = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      // Rasmlarni random tartibda aralashtirish
      const shuffledImages = shuffleArray(allMockImages);
      setTotalImages(shuffledImages.length);

      // Pagination: har safar 12 tadan rasm yuklash
      const imagesPerPage = 12;
      const startIndex = (page - 1) * imagesPerPage;
      const endIndex = startIndex + imagesPerPage;
      
      // Random tartibdagi rasmlardan pagination qilish
      const paginatedImages = shuffledImages.slice(startIndex, endIndex);

      // Har bir rasmga random views, likes, downloads
      const imagesWithRandomStats = paginatedImages.map(img => ({
        ...img,
        views: Math.floor(Math.random() * 50000) + 5000,
        likes: Math.floor(Math.random() * 5000) + 500,
        downloads: Math.floor(Math.random() * 3000) + 200,
        featured: Math.random() > 0.7
      }));

      if (reset) {
        setImages(imagesWithRandomStats);
        setFilteredImages(imagesWithRandomStats);
      } else {
        setImages(prev => [...prev, ...imagesWithRandomStats]);
        setFilteredImages(prev => [...prev, ...imagesWithRandomStats]);
      }

      setHasMore(endIndex < shuffledImages.length);
      
    } catch (error) {
      console.error('Rasmlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchImages(true);
  }, []);

  // Page o'zgarganda yuklash
  useEffect(() => {
    if (page > 1) {
      fetchImages();
    }
  }, [page]);

  // Filterlash
  useEffect(() => {
    let filtered = images;

    if (searchQuery) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }

    if (selectedOrientation !== 'all') {
      filtered = filtered.filter(img => img.orientation === selectedOrientation);
    }

    setFilteredImages(filtered);
  }, [searchQuery, selectedCategory, selectedOrientation, images]);

  const handleLike = (image) => {
    if (likedImages.includes(image.id)) {
      setLikedImages(prev => prev.filter(id => id !== image.id));
      setStats(prev => ({ ...prev, totalLikes: prev.totalLikes - 1 }));
    } else {
      setLikedImages(prev => [...prev, image.id]);
      setStats(prev => ({ ...prev, totalLikes: prev.totalLikes + 1 }));
    }
  };

  const handleSave = (image) => {
    if (savedImages.includes(image.id)) {
      setSavedImages(prev => prev.filter(id => id !== image.id));
    } else {
      setSavedImages(prev => [...prev, image.id]);
    }
  };

  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setStats(prev => ({ ...prev, totalDownloads: prev.totalDownloads + 1 }));
  };

  const categories = [
    { id: 'all', name: 'Barchasi', icon: <FiGrid /> },
    { id: 'nature', name: 'Tabiat', icon: <FiSun /> },
    { id: 'city', name: 'Shahar', icon: <FiMapPin /> },
    { id: 'portrait', name: 'Portret', icon: <FiUser /> },
    { id: 'animals', name: 'Hayvonlar', icon: <FiCamera /> },
    { id: 'architecture', name: 'Arxitektura', icon: <FiImage /> },
    { id: 'food', name: 'Taomlar', icon: <FiImage /> },
    { id: 'sports', name: 'Sport', icon: <FiImage /> },
    { id: 'fashion', name: 'Moda', icon: <FiImage /> },
    { id: 'travel', name: 'Sayohat', icon: <FiMapPin /> },
    { id: 'technology', name: 'Texnologiya', icon: <FiImage /> },
    { id: 'business', name: 'Biznes', icon: <FiImage /> },
    { id: 'health', name: 'Salomatlik', icon: <FiImage /> },
    { id: 'abstract', name: 'Abstrakt', icon: <FiImage /> },
    { id: 'music', name: 'Musiqa', icon: <FiImage /> },
    { id: 'education', name: 'Ta\'lim', icon: <FiImage /> }
  ];

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-left">
          <h1>
            <FiCamera className="header-icon" />
            Galereya
          </h1>
          <div className="header-stats">
            <span className="stat-item">
              <FiImage /> {totalImages} ta rasm
            </span>
            <span className="stat-item">
              <FiEye /> {stats.totalViews.toLocaleString()} ko'rilgan
            </span>
            <span className="stat-item">
              <FiHeart /> {stats.totalLikes} like
            </span>
            <span className="stat-item">
              <FiDownload /> {stats.totalDownloads} yuklangan
            </span>
          </div>
        </div>

        <div className="header-right">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rasm qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter />
          </button>
          
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h3>Kategoriyalar</h3>
            <div className="category-grid">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Orientatsiya</h3>
            <div className="orientation-btns">
              <button
                className={`orientation-btn ${selectedOrientation === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('all')}
              >
                Barchasi
              </button>
              <button
                className={`orientation-btn ${selectedOrientation === 'landscape' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('landscape')}
              >
                Landshaft
              </button>
              <button
                className={`orientation-btn ${selectedOrientation === 'portrait' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('portrait')}
              >
                Portret
              </button>
              <button
                className={`orientation-btn ${selectedOrientation === 'square' ? 'active' : ''}`}
                onClick={() => setSelectedOrientation('square')}
              >
                Kvadrat
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h3>Jami: {filteredImages.length} ta rasm</h3>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading && page === 1 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Rasmlar yuklanmoqda...</p>
        </div>
      ) : (
        <>
          <div className={`gallery-grid ${viewMode}`}>
            {filteredImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className={`gallery-item ${viewMode}`}
                ref={index === filteredImages.length - 1 ? lastImageRef : null}
              >
                <div className="image-wrapper" onClick={() => setSelectedImage(image)}>
                  <img src={image.thumb} alt={image.title} loading="lazy" />
                  
                  {image.featured && (
                    <div className="featured-badge">
                      <FiAward />
                    </div>
                  )}

                  <div className="image-overlay">
                    <div className="overlay-header">
                      <button className="overlay-btn like" onClick={(e) => {
                        e.stopPropagation();
                        handleLike(image);
                      }}>
                        <FiHeart className={likedImages.includes(image.id) ? 'active' : ''} />
                        <span>{image.likes}</span>
                      </button>
                      <button className="overlay-btn" onClick={(e) => {
                        e.stopPropagation();
                        handleSave(image);
                      }}>
                        <FiBookmark className={savedImages.includes(image.id) ? 'active' : ''} />
                      </button>
                    </div>

                    <div className="overlay-footer">
                      <div className="photographer-info">
                        <img src={image.photographerAvatar} alt={image.photographer} />
                        <span>{image.photographer}</span>
                      </div>
                      <button className="overlay-btn" onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}>
                        <FiDownload />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="image-info">
                  <h3>{image.title}</h3>
                  <p>{image.description}</p>
                  <div className="image-meta">
                    <span className="meta-item">
                      <FiCamera /> {image.width} x {image.height}
                    </span>
                    <span className="meta-item">
                      <FiEye /> {image.views.toLocaleString()}
                    </span>
                    <span className="meta-item">
                      <FiDownload /> {image.downloads}
                    </span>
                  </div>
                  <div className="image-tags">
                    {image.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination indicator */}
          {!loading && filteredImages.length > 0 && (
            <div className="pagination-info">
              <span>
                {filteredImages.length} / {totalImages} ta rasm ko'rsatilmoqda
              </span>
              {hasMore && !loadingMore && (
                <span className="scroll-hint">
                  Yana yuklash uchun pastga scrolling qiling
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="loading-more">
          <div className="spinner small"></div>
          <span>Ko'proq rasmlar yuklanmoqda...</span>
        </div>
      )}

      {/* No more images */}
      {!hasMore && !loading && filteredImages.length > 0 && (
        <div className="no-more-images">
          <p>Barcha rasmlar yuklandi</p>
        </div>
      )}

      {/* No results */}
      {!loading && filteredImages.length === 0 && (
        <div className="no-results">
          <FiImage size={50} />
          <h3>Hech qanday rasm topilmadi</h3>
          <p>Boshqa qidiruv so'zi yoki filtrni tanlang</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <FiX />
            </button>
            
            <div className="lightbox-image-container">
              <img src={selectedImage.url} alt={selectedImage.title} />
            </div>

            <div className="lightbox-info">
              <div className="lightbox-header">
                <div className="photographer-detail">
                  <img src={selectedImage.photographerAvatar} alt={selectedImage.photographer} />
                  <div>
                    <h4>{selectedImage.photographer}</h4>
                    <p>
                      <FiMapPin /> {selectedImage.location}
                    </p>
                  </div>
                </div>
                <div className="lightbox-actions">
                  <button 
                    className={`action-btn ${likedImages.includes(selectedImage.id) ? 'active' : ''}`}
                    onClick={() => handleLike(selectedImage)}
                  >
                    <FiHeart />
                  </button>
                  <button 
                    className={`action-btn ${savedImages.includes(selectedImage.id) ? 'active' : ''}`}
                    onClick={() => handleSave(selectedImage)}
                  >
                    <FiBookmark />
                  </button>
                  <button className="action-btn" onClick={() => handleDownload(selectedImage)}>
                    <FiDownload />
                  </button>
                  <button className="action-btn">
                    <FiShare2 />
                  </button>
                </div>
              </div>

              <h2>{selectedImage.title}</h2>
              <p className="description">{selectedImage.description}</p>

              <div className="lightbox-stats">
                <div className="stat-item">
                  <FiEye />
                  <div>
                    <span className="stat-value">{selectedImage.views.toLocaleString()}</span>
                    <span className="stat-label">ko'rilgan</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FiHeart />
                  <div>
                    <span className="stat-value">{selectedImage.likes.toLocaleString()}</span>
                    <span className="stat-label">like</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FiDownload />
                  <div>
                    <span className="stat-value">{selectedImage.downloads.toLocaleString()}</span>
                    <span className="stat-label">yuklangan</span>
                  </div>
                </div>
              </div>

              <div className="lightbox-details">
                <div className="detail-item">
                  <FiCalendar />
                  <span>Yuklangan: {new Date(selectedImage.date).toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="detail-item">
                  <FiCamera />
                  <span>O'lcham: {selectedImage.width} x {selectedImage.height}</span>
                </div>
                <div className="detail-item">
                  <FiFlag />
                  <span>Kategoriya: {selectedImage.category}</span>
                </div>
              </div>

              <div className="lightbox-tags">
                {selectedImage.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>

            <button className="lightbox-prev" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
              if (currentIndex > 0) {
                setSelectedImage(filteredImages[currentIndex - 1]);
              }
            }}>
              <FiChevronLeft />
            </button>

            <button className="lightbox-next" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
              if (currentIndex < filteredImages.length - 1) {
                setSelectedImage(filteredImages[currentIndex + 1]);
              }
            }}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;