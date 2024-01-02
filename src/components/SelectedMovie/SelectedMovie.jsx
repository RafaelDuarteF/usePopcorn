import './selectedMovie.css';
import { useState, useEffect } from 'react';
import StarRating from '../../StarRating';
import Loader from '../Loader/Loader';

export default function SelectedMovie({keyApi ='1453ea82', setMovieSelected, movieSelected, selectedId, handleCloseMovie, onAddWatched, watchedMovies}) {

    const [movieLoading, setMovieLoading] = useState(false);
    const [rating, setRating] = useState(watchedMovies.filter(movie => movie.imdbID === selectedId)[0]?.userRating);
    const isBeforeWatched = watchedMovies.map(movie => movie.imdbID).includes(selectedId);
    const {Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre} = movieSelected;

    function handleAdd() {
      const newWatchedMovie = {
        imdbID: selectedId,
        title,
        year,
        poster,
        imdbRating: Number(imdbRating),
        runtime: Number(runtime.split(' ')[0]),
        userRating: rating,
        isBeforeWatched: isBeforeWatched,
      }
      onAddWatched(newWatchedMovie);
    }
  
    function handleSetRating(rating) {
      setRating(rating);
    }
  
    useEffect(() => {
      async function fetchMovieById() {
        try{ 
          setMovieLoading(true);
          const res = await fetch(`http://www.omdbapi.com/?apikey=${keyApi}&i=${selectedId}`);
  
          if(!res.ok) throw new Error("Something went wrong with get this movie")
  
          const data = await res.json()
  
          if(data.Response === "False") throw new Error("Invalid movie")
  
          setMovieSelected(data);
        } catch (err) {
          setMovieSelected({});
        } finally {
          setMovieLoading(false);
        }
      }
      fetchMovieById();
  
    }, [selectedId, setMovieSelected, keyApi])
  
    useEffect(() => {
      if(!title) {
        document.title = "Loading Movie..."
      }
      else {
        document.title = `Movie: ${title}`
      }
  
      return function() {
        document.title = "usePopcorn";
      }
    }, [title])
  
    
    useEffect(() => {
      function handleKeyDown(e) {
        
        if(e.code === 'Backspace') {
          handleCloseMovie();
        }
      };
  
      document.addEventListener('keydown', handleKeyDown);
      
      return function() {
        document.removeEventListener("keydown", handleKeyDown)
      }
      
    }, [handleCloseMovie])
  
    return( 
      <div className="details">
        {movieLoading ? <Loader /> : 
          <>
            <header>
              <button className="btn-back" onClick={handleCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${title} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>{released} &bull; {runtime}</p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating} imdbID rating
                </p>
              </div>
            </header>
  
            <section>
              <div className="rating">
                <StarRating maxRating={10} size={24} defaultRating={rating} onSetRating={handleSetRating} />
                {rating > 0 &&
                  <button className="btn-add" onClick={handleAdd}>
                    {
                      isBeforeWatched ? 
                      "+ Update rating in the list" 
                      : 
                      "+ Add to list"
                    }
                  </button>
                }
              </div>
              <p><em>{plot}</em></p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        }
      </div>
      
    );
}