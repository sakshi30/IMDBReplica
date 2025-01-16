import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import Loader from "./components/Loader";
import ErrorComponent from "./components/Error";
import Search from "./components/Search";
import SelectedMovie from "./components/SelectedMovie";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const KEY = "e43d4367";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleWatchedMovies = (newMovie) => {
    const ids = watched.map((movie) => movie.imdbId);
    if (!ids.includes(newMovie.imdbId)) {
      setWatched((watched) => [...watched, newMovie]);
    }
  };

  const handleRemoveMovie = (movie) => {
    setWatched(watched.filter((mov) => mov.imdbId !== movie.imdbId));
  };
  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setIsLoading(true);

      try {
        setErrorMessage("");
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Couldn't fetch the movies");
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        setMovies(data.Search);
        setErrorMessage("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorMessage(err.message || "An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setErrorMessage("");
      return;
    }
    closeMovie();
    fetchData();
    return function () {
      controller.abort();
    };
  }, [query]);

  const closeMovie = () => {
    setSelectedId(null);
  };

  return (
    <>
      <NavBar>
        {
          <>
            <Search onQueryChange={setQuery} />

            <p className="num-results">
              Found <strong>{movies?.length}</strong> results
            </p>
          </>
        }
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !errorMessage && (
            <MovieList
              movies={movies}
              handleClick={(id) => setSelectedId(id === selectedId ? null : id)}
            />
          )}
          {errorMessage && <ErrorComponent message={errorMessage} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              closeMovie={closeMovie}
              handleWatchedMovies={handleWatchedMovies}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} removeMovie={handleRemoveMovie} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
