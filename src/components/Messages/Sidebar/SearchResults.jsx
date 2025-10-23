// src/components/messages/Sidebar/SearchResults.jsx
import React from 'react';

const SearchResults = ({ results, onSelect }) => (
  <ul className="divide-y divide-gray-200">
    {results.map((user) => (
      <li
        key={user._id}
        className="flex items-center p-3 hover:bg-indigo-100 cursor-pointer rounded-md transition"
        onClick={() => onSelect(user._id)}
      >
        <img
          src={user.avatar || 'https://i.pravatar.cc/40'}
          alt={user.username}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <span className="font-medium">{user.name}</span>
      </li>
    ))}
  </ul>
);

export default SearchResults;
