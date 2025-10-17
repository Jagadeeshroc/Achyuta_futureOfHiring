import React from 'react';
import Avatar from '../../ui/Avatar';

const SearchResults = ({ results, onSelect }) => (
  <div className="p-2 border-b border-gray-200">
    <h4 className="px-2 py-1 text-sm font-medium text-gray-500">Search Results</h4>
    {results.map((user) => (
      <div
        key={user._id}
        className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition"
        onClick={() => onSelect(user._id)}
      >
        <Avatar user={user} size={48} />
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">Start conversation</p>
        </div>
      </div>
    ))}
  </div>
);

export default SearchResults;