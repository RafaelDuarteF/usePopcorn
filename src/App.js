import { useEffect, useState } from "react";

import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import NavBar from "./components/NavBar/NavBar";
import Search from "./components/Search/Search";
import NumResults from "./components/NumResults/NumResults";
import Main from "./components/Main/Main";
import ListMovies from "./components/ListMovie/ListMovies/ListMovies";
import WatchedList from "./components/ListMovie/WatchedList/WatchedList";
import Box from "./components/Box/Box";
import WatchedSummary from "./components/WatchedSummary/WatchedSummary";
import SelectedMovie from "./components/SelectedMovie/SelectedMovie";

export default function App() {

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(JSON.parse(localStorage.getItem("watched")) ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [movieSelected, setMovieSelected] = useState({});
  const numMovies = movies?.length;
  const KEY = '1453ea82';

  useEffect(() => {

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});

        if(!res.ok) throw new Error("Something went wrong with fetching movies");
        
        const data = await res.json();

        if(data.Response === "False") throw new Error("Movie not found")
        
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if(err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if(!query.length) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovies();

    return function() {
      controller.abort();
    }
  }, [query])

  
  function handleSelectMovie(id) {
    setSelectedId((curId) => curId === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
    setMovieSelected({});
  }

  function handleAddWatched(movie) {
    if(movie.isBeforeWatched) {
      setWatched(watched => watched.map(beforeMovie => beforeMovie.imdbID === movie.imdbID ? {...beforeMovie, userRating: movie.userRating} : beforeMovie))
      localStorage.setItem("watched", JSON.stringify(watched.map(beforeMovie => beforeMovie.imdbID === movie.imdbID ? {...beforeMovie, userRating: movie.userRating} : beforeMovie)))
    }
    else {
      setWatched((watched) => [...watched, movie]);
      localStorage.setItem("watched", JSON.stringify([...watched, movie]))
    }
    setSelectedId(null);
  }

  function handleDeleteWatched(id) {
    const newWatched = watched.filter(movieWatched => movieWatched.imdbID !== id);
    setWatched(newWatched);
  }
  
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults numMovies={numMovies} />
      </NavBar>
      <Main>
        <Box>
          { 
            isLoading ? <Loader />
            : 
            error ? <ErrorMessage message={error} />
            :
            <ListMovies setMovieId={handleSelectMovie} movies={movies} />
          }
        </Box>
        <Box>
          { 
            selectedId ? <SelectedMovie keyApi={KEY} handleCloseMovie={handleCloseMovie} movieSelected={movieSelected} setMovieSelected={setMovieSelected} watchedMovies={watched} onAddWatched={handleAddWatched} key={selectedId} setSelectedId={setSelectedId} selectedId={selectedId} />
            :
            <>
              <WatchedSummary watched={watched} />
              <WatchedList onDeleteWatched={handleDeleteWatched} watched={watched} />
            </>
          }
          
        </Box>
      </Main>
    </>
  );
}