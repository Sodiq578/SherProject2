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

  // YouTube trailers
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

  // Video URLs (working samples)
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

  // 50+ movies with working poster URLs
  const sampleMovies = [
    {
      id: 1,
      title: "Dune: Part Two",
      year: "2024",
      genre: ["Sci-Fi", "Adventure", "Action"],
      director: "Denis Villeneuve",
      rating: 9.2,
      duration: "2h 46m",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"],
      posterUrl: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      type: "movie",
      trending: true
    },
    {
      id: 2,
      title: "Deadpool 3",
      year: "2024",
      genre: ["Action", "Comedy", "Adventure"],
      director: "Shawn Levy",
      rating: 8.9,
      duration: "2h 10m",
      description: "Deadpool travels through time with Wolverine, experiencing new adventures in the Marvel multiverse.",
      cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
      posterUrl: "https://image.tmdb.org/t/p/w500/4wbD3rxCqS3z8QkJ9Lge6DUMueP.jpg",
      type: "movie",
      trending: true
    },
    {
      id: 3,
      title: "Kung Fu Panda 4",
      year: "2024",
      genre: ["Animation", "Action", "Adventure"],
      director: "Mike Mitchell",
      rating: 8.5,
      duration: "1h 34m",
      description: "Po must train a new warrior to fight a new enemy - a magical chameleon, and maintain peace in the Valley of Peace.",
      cast: ["Jack Black", "Awkwafina", "Viola Davis"],
      posterUrl: "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
      type: "cartoon",
      trending: true
    },
    {
      id: 4,
      title: "Oppenheimer",
      year: "2023",
      genre: ["Drama", "History", "Biography"],
      director: "Christopher Nolan",
      rating: 9.3,
      duration: "3h 0m",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
      posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      type: "movie",
      trending: true,
      awards: "7 Oscars"
    },
    {
      id: 5,
      title: "Barbie",
      year: "2023",
      genre: ["Comedy", "Adventure", "Fantasy"],
      director: "Greta Gerwig",
      rating: 8.7,
      duration: "1h 54m",
      description: "Barbie and Ken travel to the real world and discover the joys and perils of being human.",
      cast: ["Margot Robbie", "Ryan Gosling", "America Ferrera"],
      posterUrl: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
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
      description: "Miles Morales embarks on a new adventure across the multiverse with various Spider-People.",
      cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"],
      posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
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
      description: "John Wick faces his most dangerous adversaries yet in his final battle for freedom.",
      cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård"],
      posterUrl: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
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
      description: "After 36 years, Maverick trains a new generation of pilots for a dangerous mission.",
      cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly"],
      posterUrl: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
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
      description: "Jake Sully and Neytiri join the Metkayina clan to protect their underwater world.",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      posterUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
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
      description: "Batman fights corruption in Gotham City while confronting the Riddler.",
      cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
      posterUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
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
      description: "Paul Atreides moves with his family to the most dangerous planet, Arrakis.",
      cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
      posterUrl: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
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
      description: "When Spider-Man's identity is revealed, he asks Doctor Strange for help, opening the multiverse.",
      cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch"],
      posterUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
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
      description: "A magical family in Colombia discovers the power of being ordinary.",
      cast: ["Stephanie Beatriz", "John Leguizamo", "Diane Guerrero"],
      posterUrl: "https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tj4xy0nf4Ih.jpg",
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
      description: "A secret agent manipulates time to prevent World War III.",
      cast: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki"],
      posterUrl: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
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
      description: "A jazz musician discovers the true meaning of life and passion.",
      cast: ["Jamie Foxx", "Tina Fey", "Graham Norton"],
      posterUrl: "https://image.tmdb.org/t/p/w500/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
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
      description: "The Avengers assemble for their final battle against Thanos.",
      cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
      posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
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
      description: "The origin story of Gotham's most infamous villain.",
      cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
      posterUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      type: "movie",
      awards: "2 Oscars"
    },
    {
      id: 18,
      title: "Toy Story 4",
      year: "2019",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Josh Cooley",
      rating: 8.7,
      duration: "1h 40m",
      description: "Woody and his friends rescue Forky and discover new adventures.",
      cast: ["Tom Hanks", "Tim Allen", "Annie Potts"],
      posterUrl: "https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg",
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
      description: "The Avengers unite to stop Thanos from collecting all Infinity Stones.",
      cast: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
      posterUrl: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
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
      description: "Miles Morales becomes Spider-Man and meets other spider-people.",
      cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
      posterUrl: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8acv2xMksHbA.jpg",
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
      description: "The evacuation of Dunkirk during World War II.",
      cast: ["Fionn Whitehead", "Tom Hardy", "Mark Rylance"],
      posterUrl: "https://image.tmdb.org/t/p/w500/ebSnODDg9lbsMJhN9N3VvBY2KzN.jpg",
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
      description: "Miguel discovers his family's history on the Day of the Dead.",
      cast: ["Anthony Gonzalez", "Gael García Bernal", "Benjamin Bratt"],
      posterUrl: "https://image.tmdb.org/t/p/w500/askg3SMvhqEl4OL52YuvdtY40Yb.jpg",
      type: "cartoon",
      awards: "2 Oscars"
    },
    {
      id: 23,
      title: "The Revenant",
      year: "2016",
      genre: ["Adventure", "Drama", "Thriller"],
      director: "Alejandro G. Iñárritu",
      rating: 8.6,
      duration: "2h 36m",
      description: "A frontiersman fights for survival after being left for dead.",
      cast: ["Leonardo DiCaprio", "Tom Hardy", "Will Poulter"],
      posterUrl: "https://image.tmdb.org/t/p/w500/tUcBYxV6I6HPpmF2fS3D7TbeYqD.jpg",
      type: "movie",
      awards: "3 Oscars"
    },
    {
      id: 24,
      title: "Zootopia",
      year: "2016",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Byron Howard",
      rating: 8.8,
      duration: "1h 48m",
      description: "Judy Hopps solves a mystery in the city of Zootopia.",
      cast: ["Ginnifer Goodwin", "Jason Bateman", "Idris Elba"],
      posterUrl: "https://image.tmdb.org/t/p/w500/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg",
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
      description: "Max and Furiosa fight for freedom in the desert wasteland.",
      cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
      posterUrl: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
      type: "movie",
      awards: "6 Oscars"
    },
    {
      id: 26,
      title: "Inside Out",
      year: "2015",
      genre: ["Animation", "Comedy", "Family"],
      director: "Pete Docter",
      rating: 9.0,
      duration: "1h 35m",
      description: "The emotions inside a young girl's mind guide her through life.",
      cast: ["Amy Poehler", "Bill Hader", "Lewis Black"],
      posterUrl: "https://image.tmdb.org/t/p/w500/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg",
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
      description: "A team of explorers travel through a wormhole in space to save humanity.",
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
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
      description: "An ordinary LEGO figure is mistakenly identified as the key to saving the world.",
      cast: ["Chris Pratt", "Will Ferrell", "Elizabeth Banks"],
      posterUrl: "https://image.tmdb.org/t/p/w500/lMfpp3QZ8R2QqV5r5CpkP8DOhpB.jpg",
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
      description: "The rise and fall of stockbroker Jordan Belfort on Wall Street.",
      cast: ["Leonardo DiCaprio", "Jonah Hill", "Margot Robbie"],
      posterUrl: "https://image.tmdb.org/t/p/w500/34m2tygAYBGmqA8aYC2jF3rUZBg.jpg",
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
      description: "Two sisters must save their kingdom from an eternal winter.",
      cast: ["Kristen Bell", "Idina Menzel", "Jonathan Groff"],
      posterUrl: "https://image.tmdb.org/t/p/w500/kgwjIb2JDHRhNk13lmSxiClFjVk.jpg",
      type: "cartoon",
      awards: "2 Oscars"
    },
    {
      id: 31,
      title: "The Dark Knight Rises",
      year: "2012",
      genre: ["Action", "Drama", "Thriller"],
      director: "Christopher Nolan",
      rating: 8.8,
      duration: "2h 44m",
      description: "Batman faces his greatest challenge yet against Bane.",
      cast: ["Christian Bale", "Tom Hardy", "Anne Hathaway"],
      posterUrl: "https://image.tmdb.org/t/p/w500/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
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
      description: "A video game villain wants to be a hero and explores other games.",
      cast: ["John C. Reilly", "Sarah Silverman", "Jack McBrayer"],
      posterUrl: "https://image.tmdb.org/t/p/w500/93FsJavRjaDfC9cT3HqS3s2DnuP.jpg",
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
      description: "A thief who enters people's dreams must plant an idea instead of stealing one.",
      cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
      posterUrl: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
      type: "movie",
      trending: true,
      awards: "4 Oscars"
    },
    {
      id: 34,
      title: "Toy Story 3",
      year: "2010",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Lee Unkrich",
      rating: 8.9,
      duration: "1h 43m",
      description: "Woody and his friends face being donated to a daycare center.",
      cast: ["Tom Hanks", "Tim Allen", "Joan Cusack"],
      posterUrl: "https://image.tmdb.org/t/p/w500/mMltbSxwEdNE4Cv8QYLpzkHWTDo.jpg",
      type: "cartoon",
      awards: "2 Oscars"
    },
    {
      id: 35,
      title: "Avatar",
      year: "2009",
      genre: ["Action", "Adventure", "Fantasy"],
      director: "James Cameron",
      rating: 8.5,
      duration: "2h 42m",
      description: "A paralyzed marine becomes part of the Na'vi on the planet Pandora.",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      posterUrl: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      type: "movie",
      awards: "3 Oscars"
    },
    {
      id: 36,
      title: "The Dark Knight",
      year: "2008",
      genre: ["Action", "Crime", "Drama"],
      director: "Christopher Nolan",
      rating: 9.5,
      duration: "2h 32m",
      description: "Batman faces his greatest enemy, the Joker, who wants to create chaos.",
      cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
      posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      type: "movie",
      trending: true,
      awards: "2 Oscars"
    },
    {
      id: 37,
      title: "WALL·E",
      year: "2008",
      genre: ["Animation", "Adventure", "Family"],
      director: "Andrew Stanton",
      rating: 8.9,
      duration: "1h 38m",
      description: "The last robot on Earth falls in love with another robot from space.",
      cast: ["Ben Burtt", "Elissa Knight", "Jeff Garlin"],
      posterUrl: "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpAIPM.jpg",
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
      description: "Two rival magicians engage in a bitter competition to create the ultimate illusion.",
      cast: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"],
      posterUrl: "https://image.tmdb.org/t/p/w500/5t8PTvaoJhSJxin3T9KdLhjSWYp.jpg",
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
      description: "Frodo and Sam journey to Mordor to destroy the One Ring.",
      cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
      posterUrl: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      type: "movie",
      awards: "11 Oscars"
    },
    {
      id: 40,
      title: "Finding Nemo",
      year: "2003",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "Andrew Stanton",
      rating: 8.7,
      duration: "1h 40m",
      description: "A clownfish searches the ocean for his missing son.",
      cast: ["Albert Brooks", "Ellen DeGeneres", "Alexander Gould"],
      posterUrl: "https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
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
      description: "A computer programmer discovers reality is a simulation controlled by machines.",
      cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
      posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      type: "movie",
      awards: "4 Oscars"
    },
    {
      id: 42,
      title: "Toy Story 2",
      year: "1999",
      genre: ["Animation", "Adventure", "Comedy"],
      director: "John Lasseter",
      rating: 8.5,
      duration: "1h 32m",
      description: "Woody is stolen by a toy collector, and his friends set out to rescue him.",
      cast: ["Tom Hanks", "Tim Allen", "Joan Cusack"],
      posterUrl: "https://image.tmdb.org/t/p/w500/3CmK3X1cZX2T9U2R7H0s2C7tG6B.jpg",
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
      description: "A love story unfolds aboard the ill-fated RMS Titanic.",
      cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
      posterUrl: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      type: "movie",
      awards: "11 Oscars"
    },
    {
      id: 44,
      title: "Pulp Fiction",
      year: "1994",
      genre: ["Crime", "Drama"],
      director: "Quentin Tarantino",
      rating: 9.3,
      duration: "2h 34m",
      description: "Interconnected stories of crime in Los Angeles.",
      cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
      posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
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
      description: "A young lion prince must reclaim his kingdom from his evil uncle.",
      cast: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"],
      posterUrl: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
      type: "cartoon",
      awards: "2 Oscars"
    },
    {
      id: 46,
      title: "Schindler's List",
      year: "1993",
      genre: ["Biography", "Drama", "History"],
      director: "Steven Spielberg",
      rating: 9.5,
      duration: "3h 15m",
      description: "Oskar Schindler saves Jews during the Holocaust.",
      cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
      posterUrl: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
      type: "movie",
      awards: "7 Oscars"
    },
    {
      id: 47,
      title: "Back to the Future",
      year: "1985",
      genre: ["Adventure", "Comedy", "Sci-Fi"],
      director: "Robert Zemeckis",
      rating: 9.0,
      duration: "1h 56m",
      description: "A teenager is accidentally sent 30 years into the past in a time-traveling DeLorean.",
      cast: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson"],
      posterUrl: "https://image.tmdb.org/t/p/w500/xlBivetfrtFj4dYpE0IF9RYo2iK.jpg",
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
      description: "Five high school students bond during Saturday detention.",
      cast: ["Emilio Estevez", "Judd Nelson", "Molly Ringwald"],
      posterUrl: "https://image.tmdb.org/t/p/w500/6N2Wj1xpdG7YqR8QhAq6F9iN2xj.jpg",
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
      description: "A young boy befriends a stranded alien and helps him return home.",
      cast: ["Henry Thomas", "Drew Barrymore", "Peter Coyote"],
      posterUrl: "https://image.tmdb.org/t/p/w500/8htLKK03TJjKZOXJgihZCu8v0Pw.jpg",
      type: "movie",
      awards: "4 Oscars"
    },
    {
      id: 50,
      title: "The Empire Strikes Back",
      year: "1980",
      genre: ["Action", "Adventure", "Fantasy"],
      director: "Irvin Kershner",
      rating: 9.2,
      duration: "2h 4m",
      description: "Luke Skywalker trains with Yoda while his friends are pursued by Darth Vader.",
      cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
      posterUrl: "https://image.tmdb.org/t/p/w500/7BuH8itoSrLExs2YZSsM01Qk2no.jpg",
      type: "movie"
    }
  ];

  // Filter function
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

  // Load movies
  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [filterMovies]);

  // Load liked movies
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setLikedMovies(savedLikes);
  }, []);

  const loadMovies = () => {
    setIsLoading(true);
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    
    if (savedMovies.length === 0) {
      // Add videos and trailers
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
        <h1>🎬 MOVIES</h1>
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
            placeholder="Search movies..."
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
            <h2>Trending Movies</h2>
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
          <span>Active filters:</span>
          {selectedGenre !== 'all' && (
            <span className="filter-tag">
              {selectedGenre}
              <button onClick={() => setSelectedGenre('all')}>✕</button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="filter-tag">
              {selectedType === 'movie' ? 'Movie' : 'Cartoon'}
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
        <span>📊 {filteredMovies.length} movies found</span>
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
          <p>Loading movies...</p>
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
                    {movie.type === 'movie' ? '🎬 Movie' : '✨ Cartoon'}
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
              <h3>No movies found</h3>
              <p>Try a different search term or clear filters</p>
              <button 
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                Clear Filters
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
              <h3>📋 Filters</h3>
              <button onClick={() => setShowFilters(false)} className="close-filters">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="filter-section">
              <h4>🎭 Genre</h4>
              <div className="filter-options">
                {genres.map(genre => (
                  <button
                    key={genre}
                    className={`filter-option ${selectedGenre === genre ? 'active' : ''}`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre === 'all' ? 'All' : genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>📺 Type</h4>
              <div className="filter-options">
                <button
                  className={`filter-option ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  All
                </button>
                <button
                  className={`filter-option ${selectedType === 'movie' ? 'active' : ''}`}
                  onClick={() => setSelectedType('movie')}
                >
                  🎬 Movie
                </button>
                <button
                  className={`filter-option ${selectedType === 'cartoon' ? 'active' : ''}`}
                  onClick={() => setSelectedType('cartoon')}
                >
                  ✨ Cartoon
                </button>
              </div>
            </div>

            <div className="filter-section">
              <h4>📅 Year</h4>
              <div className="filter-options">
                {years.map(year => (
                  <button
                    key={year}
                    className={`filter-option ${selectedYear === year ? 'active' : ''}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year === 'all' ? 'All' : year}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters-actions">
              <button 
                className="apply-filters"
                onClick={() => setShowFilters(false)}
              >
                Apply
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
                  <span><strong>Year:</strong> {selectedMovie.year}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiFilm className="detail-icon" />
                  <span><strong>Genre:</strong> {selectedMovie.genre?.join(', ')}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiUser className="detail-icon" />
                  <span><strong>Director:</strong> {selectedMovie.director || 'Unknown'}</span>
                </div>
                
                <div className="movie-detail-item">
                  <FiClock className="detail-icon" />
                  <span><strong>Duration:</strong> {selectedMovie.duration}</span>
                </div>
                
                <p className="movie-description">{selectedMovie.description}</p>
                
                {selectedMovie.cast?.length > 0 && (
                  <div className="movie-cast">
                    <strong>Cast:</strong>
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
                    <FiHeart /> {likedMovies.includes(selectedMovie.id) ? 'Favorited' : 'Add to Favorites'}
                  </button>
                  
                  <button 
                    onClick={() => handlePlay(selectedMovie)}
                    className={`play-movie-btn ${(!selectedMovie.videoUrl && !selectedMovie.trailerUrl) ? 'disabled' : ''}`}
                    disabled={!selectedMovie.videoUrl && !selectedMovie.trailerUrl}
                  >
                    <FiPlay /> 
                    {(selectedMovie.videoUrl || selectedMovie.trailerUrl) ? '▶️ Watch' : '⏳ Coming Soon'}
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