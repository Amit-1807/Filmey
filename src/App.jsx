import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import Spinner from './components/spinner';
import MovieCard from './components/MovieCard';

const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_OPTIONS = { method: 'GET' };

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (term) => {
    // Prevent API calls for very short search terms
    if (term.trim().length < 3) {
      setMovieList([]);
      setErrorMessage('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const query = term.trim() || 'Iron Man';
      const endpoint = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;

      console.log("API endpoint:", endpoint);

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error('Failed to fetch movies');

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      // 🔹 Fetch full details for each movie so we get Released & Language
      const detailedMovies = await Promise.all(
        (data.Search || []).map(async (movie) => {
          try {
            const detailsRes = await fetch(
              `${API_BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}`,
              API_OPTIONS
            );
            if (!detailsRes.ok) return movie;
            const detailsData = await detailsRes.json();
            return { ...movie, ...detailsData };
          } catch {
            return movie;
          }
        })
      );

      setMovieList(detailedMovies);
     
    } catch (error) {
      console.error(`Error Fetching movies: ${error}`);
      setErrorMessage('Error fetching Movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce effect → waits for typing to stop before searching
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMovies(searchTerm || 'Iron Man');
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero-Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
