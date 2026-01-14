import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';


const API_BASE_URL = 'https://api.themoviedb.org/3';

// TODO: USE API KEY FROM env.local 
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjRhNDk3MTEzN2ExMGFmMTMzOWRhYmI2NzU1YTQzOCIsIm5iZiI6MTc2NzkwNTU5MC42MDgsInN1YiI6IjY5NjAxOTM2MmY0NTZjMjA0YTE3MGJmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aBCtBgX6ZHPmRobD0BL7rf6a0KcUeEvOaKJPH8spQLI';

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');
  
  const [trendingMovies, setTrendingMovies] = useState([])

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async(query ='') => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      //TODO: remove console when env.local is used
      console.log('TMDB TOKEN:', API_KEY);

    const endpoint = query 
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, API_OPTIONS);
    if(!response.ok) {
      throw new Error('Failed to fetch movies')
    }
    
    const data = await response.json();
      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fecth movies');
        setMovieList([])
        return
      }
      setMovieList(data.results || [])
      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

    } catch(error) { 
      console.error(error);
      setErrorMessage('Error fetching movies');
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <>
    <div className='pattern' />

    <div className='wrapper'>
      <header>
        <img src='/hero.png' alt='hero img'></img>
        <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </header>

      {trendingMovies.length > 0 && (
        <section className='trending'>
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title}/>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className='all-movies'>
        <h2 className='mt-10'>All Movies</h2>

        {isLoading ? (
          //TODO: add loading spinner          
          // <p className='text-white'>Loading...</p>
          <Spinner />
        ) : errorMessage ? (
          <p className='text-red-500'>{errorMessage}</p>

        ) : (
          <ul>
            {movieList.map(movie => (              
               <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </div>    
    </>
  )
}


export default App


