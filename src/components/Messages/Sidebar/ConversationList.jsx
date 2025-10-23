import React from 'react';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();

  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const baseURL = 'http://localhost:5000'; // adjust to your backend/media URL

const ConversationList = ({ conversations, currentUserId, activeId, onSelect, getOtherUser, onlineUsers }) => (
  <ul>
    {conversations.map((conv) => {
      const otherUser = getOtherUser(conv);
      console.log('Other user:', otherUser); // For debugging

      return (
        <li
          key={conv._id}
          onClick={() => onSelect(conv)}
          className={`flex items-center p-3!  cursor-pointer hover:bg-indigo-100 rounded-md mb-1 transition ${
            activeId === conv._id ? 'bg-indigo-200 font-semibold' : ''
          }`}
        >
          <img
            src={otherUser?.avatar ? baseURL + otherUser.avatar : 'https://i.pravatar.cc/40'}
            alt={otherUser?.name || 'User'}
            className="w-10 h-10 rounded-full m-3! object-cover"
          />
          <div className="flex-1">
            <p>{otherUser?.name || 'Unknown User'}</p>
            <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content || 'No messages yet.'}</p>
          </div>
          {/* Optionally, add online status here */}
        </li>
      );
    })}
  </ul>
);



export default ConversationList;
