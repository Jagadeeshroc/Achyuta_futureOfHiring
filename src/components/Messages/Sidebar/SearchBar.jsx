// src/components/messages/Sidebar/SearchBar.jsx
import React from 'react';

const SearchBar = ({ term, setTerm, show, toggle }) => {
  if (!show) return null;
  return (
    <div className="p-3 border-b border-gray-300">
      <input
        type="search"
        placeholder="Search users..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        autoFocus
      />
      <button
        onClick={toggle}
        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
      >
        Close Search
      </button>
    </div>
  );
};

export default SearchBar;
