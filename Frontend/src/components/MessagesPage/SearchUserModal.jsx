// src/components/pages/SearchUserModal.jsx
import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const SearchUserModal = ({ isOpen, onClose, users, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent! bg-opacity-50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-purple-200 p-3! dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4! border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Message
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4! border-b dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for people..."
              className="w-full pl-10 p-2! border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
          </div>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const avatarSrc = user.avatar
                ? `${API_URL}${user.avatar}`
                : 'https://i.pravatar.cc/40';

              return (
                <div
                  key={user._id}
                  onClick={() => onUserSelect(user._id)}
                  className="flex items-center p-4! hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <img
                    src={avatarSrc}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mr-3!"
                  />
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="p-4! text-center text-gray-500 dark:text-gray-400">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};