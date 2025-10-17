import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ term, setTerm, show, toggle }) => {
  return (
    <>
      <div className="p-3 bg-white border-b border-gray-200 flex items-center">
        <button
          onClick={toggle}
          className="mr-2 p-1 rounded-full hover:bg-gray-100"
        >
          <FiSearch />
        </button>
        {show && (
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {term && (
              <button
                onClick={() => setTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;