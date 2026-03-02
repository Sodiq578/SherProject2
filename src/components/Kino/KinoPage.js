import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

const KinoPage = () => {
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

  // 50+ ta kinolar
  const sampleMovies = [
   
    {
      id: 4,
      title: "Oppenheimer",
      year: "2023",
      genre: ["Drama", "History", "Biography"],
      director: "Christopher Nolan",
      rating: 9.3,
      duration: "3h 0m",
      description: "Atom bombasining yaratilish tarixi va uning yaratuvchisi J. Robert Oppenheimerning hayoti haqida.",
      cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
      type: "movie",
      trending: true,
      awards: "7 Oscar"
    },
    {
      id: 5,
      title: "Barbie",
      year: "2023",
      genre: ["Comedy", "Adventure", "Fantasy"],
      director: "Greta Gerwig",
      rating: 8.7,
      duration: "1h 54m",
      description: "Barbie va Ken haqiqiy dunyoga sayohat qilishadi.",
      cast: ["Margot Robbie", "Ryan Gosling", "America Ferrera"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
      type: "movie"
    },
    {
      id: 6,
      title: "Spider-Man: Across the Spider-Verse",
      year: "2023",
      genre: ["Animation", "Action", "Adventure"],
      director: "Joaquim Dos Santos",
      rating: 9.4,
      duration: "2h 20m",
      description: "Miles Morales o'rgimchak-odamlar multiverse bo'ylab yangi sarguzashtni boshlaydi.",
      cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg",
      type: "cartoon",
      trending: true
    },
    {
      id: 7,
      title: "John Wick: Chapter 4",
      year: "2023",
      genre: ["Action", "Crime", "Thriller"],
      director: "Chad Stahelski",
      rating: 9.1,
      duration: "2h 49m",
      description: "John Wick o'zining so'nggi jangiga tayyor.",
      cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWJhMTEtOTdkZGFjNmZiMTEwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
      type: "movie"
    },
    {
      id: 8,
      title: "Top Gun: Maverick",
      year: "2022",
      genre: ["Action", "Drama"],
      director: "Joseph Kosinski",
      rating: 9.2,
      duration: "2h 10m",
      description: "36 yildan so'ng Maverick yangi avlod uchuvchilarni tayyorlaydi.",
      cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjI4MjA5MzA@._V1_.jpg",
      type: "movie",
      trending: true
    },
    {
      id: 9,
      title: "Avatar: The Way of Water",
      year: "2022",
      genre: ["Sci-Fi", "Adventure", "Fantasy"],
      director: "James Cameron",
      rating: 8.9,
      duration: "3h 12m",
      description: "Jake Sully va Neytiri Pandoraning suv osti dunyosida yashaydigan Metkayina qabilasiga qo'shilishadi.",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg",
      type: "movie"
    },
    {
      id: 10,
      title: "The Batman",
      year: "2022",
      genre: ["Action", "Crime", "Drama"],
      director: "Matt Reeves",
      rating: 8.8,
      duration: "2h 56m",
      description: "Betmen Gotham shahridagi korrupsiyaga qarshi kurashadi.",
      cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
      type: "movie"
    },
    {
      id: 11,
      title: "Dune: Part One",
      year: "2021",
      genre: ["Sci-Fi", "Adventure", "Drama"],
      director: "Denis Villeneuve",
      rating: 8.8,
      duration: "2h 35m",
      description: "Pol Atreides oilasi bilan birga eng xavfli sayyoraga ko'chib o'tadi.",
      cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      type: "movie"
    },
    {
      id: 12,
      title: "Spider-Man: No Way Home",
      year: "2021",
      genre: ["Action", "Adventure", "Fantasy"],
      director: "Jon Watts",
      rating: 9.3,
      duration: "2h 28m",
      description: "O'rgimchak-odamning kimligi oshkor bo'lgach, u Doktor Strenjdan yordam so'raydi.",
      cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg",
      type: "movie",
      trending: true
    },
    {
      id: 13,
      title: "Encanto",
      year: "2021",
      genre: ["Animation", "Comedy", "Family"],
      director: "Jared Bush",
      rating: 8.6,
      duration: "1h 42m",
      description: "Kolumbiyada sehrli kuchlarga ega oila haqida.",
      cast: ["Stephanie Beatriz", "John Leguizamo", "Diane Guerrero"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNjE5NzA4ZDctOTJkZi00NzM0LTkwOTYtMDI4MmNkMzIxODhkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg",
      type: "cartoon"
    },
    {
      id: 14,
      title: "Tenet",
      year: "2020",
      genre: ["Action", "Sci-Fi", "Thriller"],
      director: "Christopher Nolan",
      rating: 8.2,
      duration: "2h 30m",
      description: "Vaqtni orqaga qaytarish orqali dunyoni qutqarish.",
      cast: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDE5NzhjNGYtNGMxZS00YzUwLWE3YjUtNGJjZTMyNTA2M2NlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      type: "movie"
    },
    {
      id: 15,
      title: "Soul",
      year: "2020",
      genre: ["Animation", "Comedy", "Family"],
      director: "Pete Docter",
      rating: 8.9,
      duration: "1h 40m",
      description: "O'zining haqiqiy iste'dodini kashf etish haqida.",
      cast: ["Jamie Foxx", "Tina Fey", "Graham Norton"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTFkZS00NzllLTgyMTMtZmU4YzU5Y2Q0Y2U4XkEyXkFqcGdeQXVyMTM0NTc2NDgw._V1_.jpg",
      type: "cartoon",
      awards: "Oscar"
    },
    {
      id: 16,
      title: "Avengers: Endgame",
      year: "2019",
      genre: ["Action", "Adventure", "Sci-Fi"],
      director: "Anthony Russo",
      rating: 9.5,
      duration: "3h 1m",
      description: "Qasoskorlar Thanos bilan so'nggi jangda.",
      cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
      type: "movie",
      trending: true
    },
    {
      id: 17,
      title: "Joker",
      year: "2019",
      genre: ["Crime", "Drama", "Thriller"],
      director: "Todd Phillips",
      rating: 9.2,
      duration: "2h 2m",
      description: "Jokerning kelib chiqish hikoyasi.",
      cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk5YmY3MzIwXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
      type: "movie",
      awards: "2 Oscar"
    },
    {
      id: 18,
      title: "Toy Story 4",
      year: "2019",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Josh Cooley",
      rating: 8.7,
      duration: "1h 40m",
      description: "Vudi va uning do'stlari Forkini qutqarishadi.",
      cast: ["Tom Hanks", "Tim Allen", "Annie Potts"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_.jpg",
      type: "cartoon"
    },
    {
      id: 19,
      title: "Avengers: Infinity War",
      year: "2018",
      genre: ["Action", "Adventure", "Sci-Fi"],
      director: "Anthony Russo",
      rating: 9.1,
      duration: "2h 29m",
      description: "Qasoskorlar Thanosga qarshi birlashadi.",
      cast: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg",
      type: "movie"
    },
    {
      id: 20,
      title: "Spider-Man: Into the Spider-Verse",
      year: "2018",
      genre: ["Animation", "Action", "Adventure"],
      director: "Bob Persichetti",
      rating: 9.4,
      duration: "1h 57m",
      description: "Miles Morales o'rgimchak-odamga aylanadi.",
      cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzMV5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_.jpg",
      type: "cartoon",
      awards: "Oscar"
    },
    {
      id: 21,
      title: "Dunkirk",
      year: "2017",
      genre: ["Action", "Drama", "History"],
      director: "Christopher Nolan",
      rating: 8.6,
      duration: "1h 46m",
      description: "Ikkinchi jahon urushidagi Dunkirk evakuatsiyasi.",
      cast: ["Fionn Whitehead", "Tom Hardy", "Mark Rylance"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BN2YyZjQ0NTEtNzU5MS00NGZkLTg0MTEtYzJmMWY3MWRhZjM2XkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_.jpg",
      type: "movie"
    },
    {
      id: 22,
      title: "Coco",
      year: "2017",
      genre: ["Animation", "Adventure", "Family"],
      director: "Lee Unkrich",
      rating: 9.1,
      duration: "1h 45m",
      description: "Migel o'z oilasining tarixini kashf etadi.",
      cast: ["Anthony Gonzalez", "Gael García Bernal", "Benjamin Bratt"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODA4OTIyOQ@@._V1_.jpg",
      type: "cartoon",
      awards: "2 Oscar"
    },
    {
      id: 23,
      title: "The Revenant",
      year: "2016",
      genre: ["Adventure", "Drama", "Thriller"],
      director: "Alejandro G. Iñárritu",
      rating: 8.6,
      duration: "2h 36m",
      description: "Ovchi Hugh Glass omon qolish uchun kurashadi.",
      cast: ["Leonardo DiCaprio", "Tom Hardy", "Will Poulter"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMDE5OWMzM2QtOTU2ZS00NzAyLWI2MDEtOTRlYjIxZGM0OWRjXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
      type: "movie",
      awards: "3 Oscar"
    },
    {
      id: 24,
      title: "Zootopia",
      year: "2016",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Byron Howard",
      rating: 8.8,
      duration: "1h 48m",
      description: "Judy Hopps Zootopia shahrida jinoyatni ochadi.",
      cast: ["Ginnifer Goodwin", "Jason Bateman", "Idris Elba"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOTMyMjEyNzIzMV5BMl5BanBnXkFtZTgwNzIyNjU0NzE@._V1_.jpg",
      type: "cartoon",
      awards: "Oscar"
    },
    {
      id: 25,
      title: "Mad Max: Fury Road",
      year: "2015",
      genre: ["Action", "Adventure", "Sci-Fi"],
      director: "George Miller",
      rating: 8.7,
      duration: "2h 0m",
      description: "Max va Furiosa cho'lda ozodlik uchun kurashadi.",
      cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
      type: "movie",
      awards: "6 Oscar"
    },
    {
      id: 26,
      title: "Inside Out",
      year: "2015",
      genre: ["Animation", "Comedy", "Family"],
      director: "Pete Docter",
      rating: 9.0,
      duration: "1h 35m",
      description: "Rileyning his-tuyg'ulari uning hayotini boshqaradi.",
      cast: ["Amy Poehler", "Bill Hader", "Lewis Black"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_.jpg",
      type: "cartoon",
      awards: "Oscar"
    },
    {
      id: 27,
      title: "Interstellar",
      year: "2014",
      genre: ["Sci-Fi", "Drama", "Adventure"],
      director: "Christopher Nolan",
      rating: 9.2,
      duration: "2h 49m",
      description: "Yer sayyorasi o'lim arafasida turgan bir paytda, bir guruh kashfiyotchilar insoniyatni qutqarish uchun kosmosga sayohat qiladi.",
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
      type: "movie",
      trending: true
    },
    {
      id: 28,
      title: "The LEGO Movie",
      year: "2014",
      genre: ["Animation", "Action", "Adventure"],
      director: "Phil Lord",
      rating: 8.2,
      duration: "1h 40m",
      description: "Oddiy lego figurasi Emmet dunyoni qutqarish uchun sayohatga chiqadi.",
      cast: ["Chris Pratt", "Will Ferrell", "Elizabeth Banks"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTg4MDk1ODExN15BMl5BanBnXkFtZTgwNzIyNjU0NzE@._V1_.jpg",
      type: "cartoon"
    },
    {
      id: 29,
      title: "The Wolf of Wall Street",
      year: "2013",
      genre: ["Biography", "Comedy", "Crime"],
      director: "Martin Scorsese",
      rating: 8.8,
      duration: "3h 0m",
      description: "Jordan Belfortning Wall Streetdagi yuksalishi va qulashi.",
      cast: ["Leonardo DiCaprio", "Jonah Hill", "Margot Robbie"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_.jpg",
      type: "movie"
    },
    {
      id: 30,
      title: "Frozen",
      year: "2013",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Chris Buck",
      rating: 8.4,
      duration: "1h 42m",
      description: "Elsa va Anna opa-singillar qirollikni qutqarishadi.",
      cast: ["Kristen Bell", "Idina Menzel", "Jonathan Groff"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_.jpg",
      type: "cartoon",
      awards: "2 Oscar"
    },
    {
      id: 31,
      title: "The Dark Knight Rises",
      year: "2012",
      genre: ["Action", "Drama", "Thriller"],
      director: "Christopher Nolan",
      rating: 8.8,
      duration: "2h 44m",
      description: "Betmen Bane bilan jang qiladi.",
      cast: ["Christian Bale", "Tom Hardy", "Anne Hathaway"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_.jpg",
      type: "movie"
    },
    {
      id: 32,
      title: "Wreck-It Ralph",
      year: "2012",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Rich Moore",
      rating: 8.1,
      duration: "1h 41m",
      description: "Ralph video o'yinlar dunyosida sarguzashtni boshlaydi.",
      cast: ["John C. Reilly", "Sarah Silverman", "Jack McBrayer"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNzMxNTExOTkyMF5BMl5BanBnXkFtZTcwMzEyNDc0OA@@._V1_.jpg",
      type: "cartoon"
    },
    {
      id: 33,
      title: "Inception",
      year: "2010",
      genre: ["Action", "Adventure", "Sci-Fi"],
      director: "Christopher Nolan",
      rating: 9.3,
      duration: "2h 28m",
      description: "Dominik Kokk odamlarning tushlariga kirib ma'lumot o'g'irlaydi.",
      cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      type: "movie",
      trending: true,
      awards: "4 Oscar"
    },
    {
      id: 34,
      title: "Toy Story 3",
      year: "2010",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Lee Unkrich",
      rating: 8.9,
      duration: "1h 43m",
      description: "Vudi va uning do'stlari yangi uyga ko'chib o'tishadi.",
      cast: ["Tom Hanks", "Tim Allen", "Joan Cusack"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTgxOTY4Mjc0MF5BMl5BanBnXkFtZTcwNTA4MDQyMw@@._V1_.jpg",
      type: "cartoon",
      awards: "2 Oscar"
    },
    {
      id: 35,
      title: "Avatar",
      year: "2009",
      genre: ["Action", "Adventure", "Fantasy"],
      director: "James Cameron",
      rating: 8.5,
      duration: "2h 42m",
      description: "Pandora sayyorasida insonlar va Na'vilar o'rtasidagi mojaro.",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
      type: "movie",
      awards: "3 Oscar"
    },
    {
      id: 36,
      title: "The Dark Knight",
      year: "2008",
      genre: ["Action", "Crime", "Drama"],
      director: "Christopher Nolan",
      rating: 9.5,
      duration: "2h 32m",
      description: "Betmen Joker bilan jang qiladi.",
      cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
      type: "movie",
      trending: true,
      awards: "2 Oscar"
    },
    {
      id: 37,
      title: "WALL·E",
      year: "2008",
      genre: ["Animation", "Adventure", "Family"],
      director: "Andrew Stanton",
      rating: 8.9,
      duration: "1h 38m",
      description: "Yer sayyorasidagi so'nggi robot EVAni sevib qoladi.",
      cast: ["Ben Burtt", "Elissa Knight", "Jeff Garlin"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTczOTA3MzY2N15BMl5BanBnXkFtZTcwOTYwNjE2MQ@@._V1_.jpg",
      type: "cartoon",
      awards: "Oscar"
    },
    {
      id: 38,
      title: "The Prestige",
      year: "2006",
      genre: ["Drama", "Mystery", "Sci-Fi"],
      director: "Christopher Nolan",
      rating: 8.8,
      duration: "2h 10m",
      description: "Ikki sehrgar o'rtasidagi raqobat.",
      cast: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_.jpg",
      type: "movie"
    },
    {
      id: 39,
      title: "The Lord of the Rings: The Return of the King",
      year: "2003",
      genre: ["Adventure", "Drama", "Fantasy"],
      director: "Peter Jackson",
      rating: 9.6,
      duration: "3h 21m",
      description: "Frodo va Sem Uzukni yo'q qilish uchun Mordorga boradi.",
      cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
      type: "movie",
      awards: "11 Oscar"
    },
    {
      id: 40,
      title: "Finding Nemo",
      year: "2003",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Andrew Stanton",
      rating: 8.7,
      duration: "1h 40m",
      description: "Marlin o'g'li Nemoni qutqarish uchun okean bo'ylab sayohat qiladi.",
      cast: ["Albert Brooks", "Ellen DeGeneres", "Alexander Gould"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZTAzNWZlNmUtZDEzYi00ZjA5LWIwYjEtZGM1NWE1MjE4YWRhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      type: "cartoon",
      awards: "Oscar"
    },
    {
      id: 41,
      title: "The Matrix",
      year: "1999",
      genre: ["Action", "Sci-Fi"],
      director: "Lana Wachowski",
      rating: 9.0,
      duration: "2h 16m",
      description: "Kompyuter dasturchisi Neo haqiqatni kashf etadi.",
      cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      type: "movie",
      awards: "4 Oscar"
    },
    {
      id: 42,
      title: "Toy Story 2",
      year: "1999",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "John Lasseter",
      rating: 8.5,
      duration: "1h 32m",
      description: "Vudi o'g'irlanadi va uning do'stlari uni qutqarishadi.",
      cast: ["Tom Hanks", "Tim Allen", "Joan Cusack"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMWM5ZDcxMTYtNTEyNS00MDRkLWI3YTItNThmMGExMWY4NDIwXkEyXkFqcGdeQXVyNjUwNzk3NDc@._V1_.jpg",
      type: "cartoon"
    },
    {
      id: 43,
      title: "Titanic",
      year: "1997",
      genre: ["Drama", "Romance"],
      director: "James Cameron",
      rating: 8.7,
      duration: "3h 14m",
      description: "Titanik kemasidagi sevgi hikoyasi.",
      cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
      type: "movie",
      awards: "11 Oscar"
    },
    {
      id: 44,
      title: "Pulp Fiction",
      year: "1994",
      genre: ["Crime", "Drama"],
      director: "Quentin Tarantino",
      rating: 9.3,
      duration: "2h 34m",
      description: "Los-Anjeles jinoyat dunyosidagi bir-biri bilan bog'langan hikoyalar.",
      cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
      type: "movie"
    },
    {
      id: 45,
      title: "The Lion King",
      year: "1994",
      genre: ["Animation", "Adventure", "Drama"],
      director: "Roger Allers",
      rating: 9.1,
      duration: "1h 28m",
      description: "Arslon Simba o'z taxtini qaytarib olishi kerak.",
      cast: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_.jpg",
      type: "cartoon",
      awards: "2 Oscar"
    },
    {
      id: 46,
      title: "Schindler's List",
      year: "1993",
      genre: ["Biography", "Drama", "History"],
      director: "Steven Spielberg",
      rating: 9.5,
      duration: "3h 15m",
      description: "Oskar Shindler yahudiylarni qutqarish uchun harakat qiladi.",
      cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
      type: "movie",
      awards: "7 Oscar"
    },
    {
      id: 47,
      title: "Back to the Future",
      year: "1985",
      genre: ["Adventure", "Comedy", "Sci-Fi"],
      director: "Robert Zemeckis",
      rating: 9.0,
      duration: "1h 56m",
      description: "Marty McFly vaqt mashinasida o'tmishga boradi.",
      cast: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
      type: "movie"
    },
    {
      id: 48,
      title: "The Breakfast Club",
      year: "1985",
      genre: ["Comedy", "Drama"],
      director: "John Hughes",
      rating: 8.3,
      duration: "1h 37m",
      description: "Besh o'quvchi yakshanba kuni maktabda qolishadi.",
      cast: ["Emilio Estevez", "Judd Nelson", "Molly Ringwald"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BOTM5N2ZmZTMtNjlmOS00YzU2LWE5YzktYzY5NzUzNjYzYzJiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
      type: "movie"
    },
    {
      id: 49,
      title: "E.T. the Extra-Terrestrial",
      year: "1982",
      genre: ["Family", "Sci-Fi"],
      director: "Steven Spielberg",
      rating: 8.5,
      duration: "1h 55m",
      description: "Yerda qolib ketgan o'zga sayyoralik bola bilan do'stlashadi.",
      cast: ["Henry Thomas", "Drew Barrymore", "Peter Coyote"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BMTQ2ODFlMDAtNzdhOC00ZDYzLWE3YTMtNDU4ZGFmZmJmYTczXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
      type: "movie",
      awards: "4 Oscar"
    },
    {
      id: 50,
      title: "The Empire Strikes Back",
      year: "1980",
      genre: ["Action", "Adventure", "Fantasy"],
      director: "Irvin Kershner",
      rating: 9.2,
      duration: "2h 4m",
      description: "Imperiya qarshi zarba beradi va Lyuk Darth Vader bilan jang qiladi.",
      cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
      posterUrl: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
      type: "movie"
    }
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
  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [filterMovies]);

  // Like holatini yuklash
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setLikedMovies(savedLikes);
  }, []);

  const loadMovies = () => {
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
  };

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

  return (
    <div className="kino-container">
      {/* Header */}
      <div className="kino-header">
        <button onClick={handleGoBack} className="back-btn">
          <FiArrowLeft size={24} />
        </button>
        <h1>🎬 KINOLAR</h1>
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
            placeholder="Kino qidirish..."
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
            <h2>Trenddagi kinolar</h2>
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
          <span>Aktiv filterlar:</span>
          {selectedGenre !== 'all' && (
            <span className="filter-tag">
              {selectedGenre}
              <button onClick={() => setSelectedGenre('all')}>✕</button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="filter-tag">
              {selectedType === 'movie' ? 'Film' : 'Multfilm'}
              <button onClick={() => setSelectedType('all')}>✕</button>
            </span>
          )}
          {selectedYear !== 'all' && (
            <span className="filter-tag">
              {selectedYear}
              <button onClick={() => setSelectedYear('all')}>✕</button>
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="stats-bar">
        <span>📊 {filteredMovies.length} ta kino topildi</span>
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
          <p>Kinolar yuklanmoqda...</p>
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
                    {movie.type === 'movie' ? '🎬 Film' : '✨ Multfilm'}
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
              <h3>Kinolar topilmadi</h3>
              <p>Boshqa qidiruv so'zini kiriting yoki filtrlarni tozalang</p>
              <button 
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                Filterlarni tozalash
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
              <h3>📋 Filterlar</h3>
              <button onClick={() => setShowFilters(false)} className="close-filters">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="filter-section">
              <h4>🎭 Janr</h4>
              <div className="filter-options">
                {genres.map(genre => (
                  <button
                    key={genre}
                    className={`filter-option ${selectedGenre === genre ? 'active' : ''}`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre === 'all' ? 'Barchasi' : genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>📺 Tur</h4>
              <div className="filter-options">
                <button
                  className={`filter-option ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  Barchasi
                </button>
                <button
                  className={`filter-option ${selectedType === 'movie' ? 'active' : ''}`}
                  onClick={() => setSelectedType('movie')}
                >
                  🎬 Film
                </button>
                <button
                  className={`filter-option ${selectedType === 'cartoon' ? 'active' : ''}`}
                  onClick={() => setSelectedType('cartoon')}
                >
                  ✨ Multfilm
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h4>📅 Yil</h4>
              <div className="filter-options">
                {years.map(year => (
                  <button
                    key={year}
                    className={`filter-option ${selectedYear === year ? 'active' : ''}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year === 'all' ? 'Barchasi' : year}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters-actions">
              <button 
                className="apply-filters"
                onClick={() => setShowFilters(false)}
              >
                Qo'llash
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
                  <span><strong>Yil:</strong> {selectedMovie.year}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiFilm className="detail-icon" />
                  <span><strong>Janr:</strong> {selectedMovie.genre?.join(', ')}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiUser className="detail-icon" />
                  <span><strong>Rejissyor:</strong> {selectedMovie.director || 'Noma\'lum'}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiClock className="detail-icon" />
                  <span><strong>Davomiylik:</strong> {selectedMovie.duration}</span>
                </div>
                
                <p className="movie-description">{selectedMovie.description}</p>
                
                {selectedMovie.cast?.length > 0 && (
                  <div className="movie-cast">
                    <strong>Aktyorlar:</strong>
                    <div className="cast-list">
                      {selectedMovie.cast.map((actor, index) => (
                        <span key={index} className="cast-item">{actor}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="modal-actions">
                  <button 
                    onClick={() => handleLike(selectedMovie.id)}
                    className={`like-btn ${likedMovies.includes(selectedMovie.id) ? 'liked' : ''}`}
                  >
                    <FiHeart /> {likedMovies.includes(selectedMovie.id) ? 'Sevimli' : 'Sevimlilarga qo\'shish'}
                  </button>
                  
                  <button 
                    onClick={() => handlePlay(selectedMovie)}
                    className={`play-movie-btn ${(!selectedMovie.videoUrl && !selectedMovie.trailerUrl) ? 'disabled' : ''}`}
                    disabled={!selectedMovie.videoUrl && !selectedMovie.trailerUrl}
                  >
                    <FiPlay /> 
                    {(selectedMovie.videoUrl || selectedMovie.trailerUrl) ? '▶️ Ko\'rish' : '⏳ Tez kunda'}
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