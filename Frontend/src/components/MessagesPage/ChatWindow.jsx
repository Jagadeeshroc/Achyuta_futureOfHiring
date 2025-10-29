// src/components/pages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
// Import ArrowLeft for the back button
import { Send, MessageSquarePlus, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const ChatWindow = ({
  conversation,
  messages,
  currentUser,
  onSendMessage,
  onBackClick // <-- New prop for the back button
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!conversation) {
    // This placeholder is now hidden on mobile (md:flex)
    return (
      <div className="flex-1 items-center justify-center h-full hidden md:flex">
        <div className="text-center">
            <MessageSquarePlus size={64} className="mx-auto text-gray-300 dark:text-gray-600" />
            <h3 className="mt-2 text-xl font-medium text-gray-800 dark:text-gray-200">Select a conversation</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Or start a new one to begin chatting.
            </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const otherUser = conversation.participants.find(
    (p) => p?._id !== currentUser?._id
  );

  if (!otherUser) {
     return (
        <div className="flex-1 flex items-center justify-center h-full">
            <p>Error: Could not load user details.</p>
        </div>
     );
  }

  const headerAvatarSrc = otherUser.avatar
    ? `${API_URL}${otherUser.avatar}`
    : 'https://placeholder.co/150';

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4! border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        
        {/* --- THIS IS THE NEW BACK BUTTON --- */}
        {/* It's hidden on medium screens and up (md:hidden) */}
        <button 
          onClick={onBackClick}
          className="mr-2! p-2! text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full md:hidden"
          title="Back to messages"
        >
          <ArrowLeft size={20} />
        </button>
        {/* --- END OF FIX --- */}

        <img
          src={headerAvatarSrc}
          alt={otherUser.name}
          className="w-10 h-10 rounded-full mr-3!"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {otherUser.name}
        </h3>
      </div>

      {/* Message List */}
      <div className="flex-1 p-5!  bg-amber-300 h-100 overflow-auto ">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} currentUser={currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3! bg-purple-200 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3! border rounded-lg! focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="p-2! m-1! bg-purple-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Sub-component for Chat Bubbles ---
const MessageBubble = ({ message, currentUser }) => {
  if (!message || !message.sender) {
    return null; 
  }
  const isSentByCurrentUser = message.sender._id === currentUser._id;
  const bubbleAvatarSrc = message.sender.avatar
    ? `${API_URL}${message.sender.avatar}`
    : 'https://placeholder.co/150';

  return (
    <div className={`flex mb-2!  ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end max-w-xs md:max-w-md">
        
        <div>
          <div
            className={`p-2! rounded-2xl ${
              isSentByCurrentUser
                ? 'bg-purple-600 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
           <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1! px-1 ${
               isSentByCurrentUser ? 'text-right' : 'text-left'
           }`}>
               {format(new Date(message.createdAt), 'p')}
           </span>
        </div>
      </div>
    </div>
  );
};