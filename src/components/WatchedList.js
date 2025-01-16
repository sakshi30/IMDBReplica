export default function WatchedList({ watched, removeMovie }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <WatchedItem
            movie={movie}
            key={movie.imdbID}
            removeMovie={removeMovie}
          />
        ))}
      </ul>
    </>
  );
}

function WatchedItem({ movie, removeMovie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => removeMovie(movie)}>
        ❌
      </button>
    </li>
  );
}
