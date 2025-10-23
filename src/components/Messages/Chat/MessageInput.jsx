// src/components/messages/Chat/MessageInput.jsx
import React from 'react';

const MessageInput = ({ value, onChange, onSend }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 border-t border-gray-300">
      <textarea
        rows={2}
        placeholder="Type a message..."
        className="w-full border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={onSend}
        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!value.trim()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
