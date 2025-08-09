import React from 'react';

const MovieCard = ({ movie: { Title, imdbRating, Poster, Released, Language } }) => {
  return (
    <div className="movie-card">
      <img 
        src={Poster && Poster !== "N/A" ? Poster : '/no-movie.png'} 
        alt={Title} 
      />
      
      <div className="mt-4">
        <h3>{Title}</h3>
        
        <div className="content">
            <div className="rating">
                <img src='star.svg' alt='Star Icon'/>
                <p>{imdbRating && imdbRating !== "N/A" 
                ? Number(imdbRating).toFixed(1) 
                : 'N/A'}</p>
            </div>
            
            <span>•</span>
            <p className='lang'>{Language}</p>
            <span>•</span>
            <p className='year'>
                {Released && Released !== "N/A" ? Released.split('-')[0]:'N/A' }
            </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
