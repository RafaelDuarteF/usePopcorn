import '../listMovieMain.css';
import Movie from '../Movie/Movie';

export default function ListMovies({movies, setMovieId}) {
    return(
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <Movie setMovieId={setMovieId} movie={movie} key={movie.imdbID} />
        ))}
      </ul>
    );
  }