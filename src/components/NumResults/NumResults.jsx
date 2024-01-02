import './numResults.css';

export default function NumResults({numMovies}) {
    return(
      <p className="num-results">
          Found <strong>{numMovies}</strong> results
      </p>
    );
  }