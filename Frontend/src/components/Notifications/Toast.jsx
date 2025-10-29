// src/components/notifications/Toast.jsx
import React, { useEffect } from 'react';

const Toast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'message':
        return 'bg-indigo-600 text-white';
      case 'typing':
        return 'bg-yellow-500 text-white';
      case 'online':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'typing':
        return '✍️';
      case 'online':
        return '🟢';
      default:
        return '🔔';
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${getToastStyles(notification.type)}`}>
      <div className="flex items-center space-x-3">
        <span className="text-lg">{getToastIcon(notification.type)}</span>
        <div className="flex-1">
          <p className="font-medium text-sm">
            {notification.senderName || notification.userName}
          </p>
          <p className="text-sm opacity-90">
            {notification.type === 'message' 
              ? notification.content.length > 50 
                ? `${notification.content.substring(0, 50)}...`
                : notification.content
              : notification.type === 'typing'
                ? 'is typing...'
                : 'is now online'
            }
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;