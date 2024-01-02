import '../listMovieMain.css';
import MovieWatched from '../MovieWatched/MovieWatched';

export default function WatchedList({watched, onDeleteWatched}) {
    return(
      <ul className="list">
        {watched.map((movie) => (
          <MovieWatched onDeleteWatched={onDeleteWatched} movie={movie} key={movie.imdbID} />
        ))}
      </ul>
    );
}
  