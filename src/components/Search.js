import { useEffect, useRef, useState } from "react";

export default function Search({ onQueryChange }) {
  const [query, setQuery] = useState("");
  const inputEl = useRef(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    onQueryChange(e.target.value);
  };

  useEffect(() => {
    function callback(e) {
      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }
    document.addEventListener("keypress", callback);
    return () => document.removeEventListener("keydown", callback);
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={handleQueryChange}
      ref={inputEl}
    />
  );
}
