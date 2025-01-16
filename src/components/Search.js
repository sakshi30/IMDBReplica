import { useState } from "react";

export default function Search({ onQueryChange }) {
  const [query, setQuery] = useState("");

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    onQueryChange(e.target.value);
  };
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={handleQueryChange}
    />
  );
}
