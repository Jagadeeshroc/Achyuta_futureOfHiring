import React from 'react';
import { format } from 'date-fns';
import { FiCheck } from 'react-icons/fi';

const MessageBubble = ({ msg, isOwn, read }) => {
  const time = format(new Date(msg.createdAt), 'HH:mm');

  return (
    <div
      className={`p-3! m-1! rounded-2xl shadow-md relative break-words  ${
        isOwn
          ? 'bg-indigo-600 text-white rounded-tr-none' // Sent: Indigo, no top-right corner
          : 'bg-gray-100 text-gray-800 border border-gray-300 rounded-tl-none' // Received: Light Gray, no top-left
      }`}
    >
      <p className="text-sm p-1!">{msg.content}</p>

      {/* Time and status - bottom aligned */}
      <div
        className={`flex items-center justify-end mt-2! text-xs ${isOwn ? 'text-indigo-300' : 'text-gray-500'}`}
      >
        <span>{time}</span>
        {isOwn && (
          <span className="ml-1">
            {read ? (
              <FiCheck size={14} className="text-indigo-300" />
            ) : (
              <FiCheck size={14} className="text-gray-400" />
            )}
          </span>
        )}
      </div>

      {/* Bubble tail (subtle arrow effect) */}
      <div
        className={`absolute top-0 w-4 h-4 ${isOwn ? 'right-0 bg-indigo-600' : 'left-0 bg-gray-100 border border-gray-300'} transform ${
          isOwn ? '-translate-x-1/2 rotate-45' : 'translate-x-1/2 rotate-45'
        }`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      ></div>
    </div>
  );
};

export default MessageBubble;
