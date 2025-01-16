import { useEffect, useState } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
const KEY = "e43d4367";

export default function SelectedMovie({
  selectedId,
  closeMovie,
  handleWatchedMovies,
  watched,
}) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const watchedIds = watched.map((movie) => movie.imdbId);
  const isWatched = watchedIds.includes(selectedId);
  const watchedUserRating = watched.find(
    (watched) => watched.imdbId === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedMovie;
  useEffect(() => {
    async function loadMovie() {
      setIsLoading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await response.json();
      setSelectedMovie(data);
      setIsLoading(false);
    }
    loadMovie();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        closeMovie();
      }
    }
    document.addEventListener("keydown", callback);

    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [closeMovie]);

  const handleSetRating = (rating) => {
    const newMovie = {
      ...selectedMovie,
      imdbId: selectedId,
      userRating,
      year,
      runtime: Number(runtime.split(" ")[0]),
    };
    handleWatchedMovies(newMovie);
    closeMovie();
  };
  return (
    <div className="details" key={selectedId}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={closeMovie}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  {" "}
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleSetRating}>
                      + Add to watched list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You have already watched this movie {watchedUserRating} ⭐️
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
