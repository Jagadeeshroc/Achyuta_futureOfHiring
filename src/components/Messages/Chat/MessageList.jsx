// src/components/messages/Chat/MessageList.jsx
import React from 'react';
import classNames from 'classnames';

const MessageList = ({ messages, currentUserId }) => (
  <>
    {messages.map((msg) => {
      const isCurrentUser = msg.sender === currentUserId;
      return (
        <div
          key={msg._id || msg.createdAt}
          className={classNames(
            'flex items-end space-x-2 ',
            isCurrentUser ? 'justify-end' : 'justify-start'
          )}
        >
          {!isCurrentUser && (
            <img
              src={msg.senderAvatar || 'https://i.pravatar.cc/40'}
              alt="sender avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div
            className={classNames(
              'max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap',
              isCurrentUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'
            )}
          >
            {msg.content}
          </div>
          {isCurrentUser && (
            <img
              src={msg.senderAvatar || 'https://i.pravatar.cc/40'}
              alt="sender avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
        </div>
      );
    })}
  </>
);

export default MessageList;
