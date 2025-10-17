import React, { useRef } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

const MessageInput = ({
  value,
  onChange,
  onSend,
  onTyping,
}) => {
  const inputRef = useRef(null);

  const handleKey = (e) => {
    if (e.key === 'Enter') onSend();
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-white">
      <div className="flex items-center">
        <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
          <BsEmojiSmile size={20} />
        </button>
        <div className="flex-1 mx-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              onTyping(e.target.value.length > 0);
            }}
            onKeyPress={handleKey}
            className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <button
          className={`p-2 rounded-full transition ${value.trim() ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-400'}`}
          onClick={onSend}
          disabled={!value.trim()}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;