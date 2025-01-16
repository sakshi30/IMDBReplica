export default function MovieList({ movies, handleClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Item movie={movie} key={movie.imdbID} handleClick={handleClick} />
      ))}
    </ul>
  );
}

function Item({ movie, handleClick }) {
  return (
    <li key={movie.imdbID} onClick={() => handleClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
