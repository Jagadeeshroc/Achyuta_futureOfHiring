// src/components/messages/Sidebar/ConversationList.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ConversationList = ({
  conversations,
  currentUserId,
  activeId,
  onSelect,
  getOtherUser,
  unreadCounts = {},
}) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations yet. Start chatting!
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conv) => {
        const otherUser = getOtherUser(conv);
        const unread = unreadCounts[conv._id] || 0;
        const isActive = activeId === conv._id;
        const lastMessage = conv.lastMessage;

        const previewText = lastMessage
          ? (lastMessage.senderId === currentUserId ? 'You: ' : '') +
            (lastMessage.content || 'Media message')
          : 'No messages yet';

        const timeAgo = lastMessage
          ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })
          : '';

        const avatarUrl = otherUser?.avatar
          ? otherUser.avatar.startsWith('http')
            ? otherUser.avatar
            : `${API_BASE_URL.replace(/\/$/, '')}${otherUser.avatar.startsWith('/') ? '' : '/'}${otherUser.avatar}`
          : '/default-avatar.png';

        return (
          <div
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={`flex items-center p-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50 ${
              isActive ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
            }`}
          >
            <div className="relative mr-3">
              <img
                src={avatarUrl}
                alt={otherUser?.name || otherUser?.email || 'Unknown User'}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              {otherUser?.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className={`font-semibold text-gray-900 truncate ${unread > 0 ? 'font-bold' : ''}`}>
                  {otherUser?.name || otherUser?.email || 'Unknown User'}
                </p>
                {timeAgo && <p className="text-xs text-gray-500 ml-2">{timeAgo}</p>}
              </div>
              <p className={`text-sm text-gray-600 truncate ${unread > 0 ? 'font-medium' : ''}`}>
                {previewText}
              </p>
            </div>
            {unread > 0 && (
              <div className="ml-3 flex-shrink-0">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                  {unread > 99 ? '99+' : unread}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ConversationList);