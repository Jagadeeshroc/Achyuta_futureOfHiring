// src/components/ui/Avatar.jsx

import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';

// For Vite: use import.meta.env.VITE_API_URL  
// For CRA: use process.env.REACT_APP_API_URL  
const API_BASE_URL = (import.meta?.env?.VITE_API_URL) 
  || process.env.REACT_APP_API_URL 
  || 'http://localhost:5000';

const Avatar = ({ user, size = 40, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const avatarUrl = user?.avatar && !imgError
    ? (
        user.avatar.startsWith('http')
          ? user.avatar
          : `${API_BASE_URL.replace(/\/$/, '')}${user.avatar}`
      )
    : null;

  if (!avatarUrl) {
    // fallback
    return (
      <div
        className={`rounded-full bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <FiUser size={size * 0.6} className="text-gray-500" />
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={user?.name || 'User Avatar'}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={() => {
        console.warn('Avatar failed to load:', avatarUrl);
        setImgError(true);
      }}
      loading="lazy"
    />
  );
};

export default Avatar;
