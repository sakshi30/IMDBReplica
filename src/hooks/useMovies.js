import { useEffect, useState } from "react";

const KEY = "e43d4367";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);

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
    fetchData();
    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, errorMessage };
}
