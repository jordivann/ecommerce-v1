import React from 'react';

const SearchBar = ({ value, onSearch }) => (
  <input
    className="searchbar-input"
    type="text"
    value={value}
    onChange={e => onSearch(e.target.value)}
    placeholder="Buscar productos..."
  />
);

export default SearchBar;