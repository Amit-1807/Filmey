import { useState , useEffect} from 'react';
import './App.css';
import Search from './components/search';
import Spinner from './components/spinner';

const API_BASE_URL = "https://www.omdbapi.com/";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY

const API_OPTIONS = {
  method : 'GET'
}

const App = () => {
  const [searchTerm,setSearchTerm] = useState('')
  const [errorMessage,setErrorMessage] = useState('')
  const [movieList,setMovieList] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  

  const fetchMovies = async () => {
      

     setIsLoading(true)

    try{
       const query = searchTerm.trim() || 'Iron Man';
       const endpoint = `${API_BASE_URL}?apikey=${API_KEY}&s=${query}`;


       console.log("API endpoint:", endpoint);

       const response = await fetch(endpoint)
       
       if(!response.ok){
        throw new Error('Failed to fetch movies')
       }

       const data = await response.json()
        
       if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([])
        return
       }

      setMovieList(data.Search || [])

      
    } catch(error){
      console.error(`Error Fetching movies: ${error}`)
      setErrorMessage('Error fetching Movies please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchMovies()
  },[searchTerm])

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src='./hero.png' alt='Hero-Banner' />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without hassle
          </h1>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

  
          {isLoading?(
            <Spinner/>
          ) : errorMessage ?(
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                 <li key={movie.imdbID} className="text-white">{movie.Title}</li>
               ))}

            </ul>
          )
        }


        </section>
        
      </div>
    </main>
  );
};

export default App;
