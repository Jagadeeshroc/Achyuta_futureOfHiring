import React from 'react';

const ChatHeader = ({ otherUser, isMobile, goBack, typing }) => {
  console.log('ChatHeader otherUser:', otherUser); // Debug log

  const avatarSrc = otherUser?.avatar
    ? otherUser.avatar.startsWith('http')
      ? otherUser.avatar
      : `${process.env.REACT_APP_API_BASE_URL || ''}${otherUser.avatar}`
    : 'https://i.pravatar.cc/40';

  return (
    <div className="flex items-center justify-between p-4! border-b border-gray-200 bg-indigo-600 text-white rounded-t-md">
      {isMobile && (
        <button
          onClick={goBack}
          className="mr-3 p-2 rounded-md hover:bg-indigo-700"
          aria-label="Go back to conversations"
        >
          ←
        </button>
      )}
      <div className="flex items-center space-x-3">
        <img
          src={avatarSrc}
          alt={otherUser?.name || 'User'}
          onError={(e) => { e.currentTarget.src = 'https://i.pravatar.cc/40'; }}
          className="w-10 h-10 m-1! rounded-full object-cover"
        />
        <div>
          <h2 className="font-semibold text-lg">{otherUser?.name || 'Unknown User'}</h2>
          {typing && <p className="text-sm italic text-indigo-200">{typing}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
