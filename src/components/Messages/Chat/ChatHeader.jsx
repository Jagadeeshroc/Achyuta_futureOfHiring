// src/components/messages/Chat/ChatHeader.jsx
import React from 'react';
import Avatar from '../../ui/Avatar';
import { FiArrowLeft } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';

const ChatHeader = ({ otherUser, typing, isMobile, goBack }) => (
  <div className="p-3 border-b border-gray-200 flex items-center bg-indigo-600 text-white">
    {isMobile && (
      <button
        className="mr-2 p-1 rounded-full hover:bg-indigo-500 transition"
        onClick={goBack}
      >
        <FiArrowLeft size={20} />
      </button>
    )}
    <Avatar
      user={{
        avatar: otherUser?.avatar,
        name: otherUser?.name || otherUser?.email || 'Unknown User',
      }}
      size={40}
      className="border-2 border-white"
    />
    <div className="ml-3 flex-1">
      <h3 className="font-medium">{otherUser?.name || otherUser?.email || 'Unknown User'}</h3>
      <p className="text-xs opacity-80">{typing || 'Online'}</p>
    </div>
    <button className="p-1 rounded-full hover:bg-indigo-500 transition">
      <BsThreeDotsVertical size={20} />
    </button>
  </div>
);

export default ChatHeader;