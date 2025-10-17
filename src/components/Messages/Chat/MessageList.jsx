import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ groupedMessages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages or updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupedMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date} className="mb-6">
          {/* Date Separator - Classic centered pill */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 bg-white text-xs font-medium text-gray-600 rounded-full shadow-md border border-gray-200">
              {date}
            </span>
          </div>

          {msgs.map((msg, index) => {
            const isOwn = msg.sender === currentUserId; // True for sent (right), False for received (left)
            const showAvatar = !isOwn && (index === 0 || msgs[index - 1].sender !== msg.sender); // Avatar grouping for received

            return (
              <div
                key={msg._id}
                className={`flex my-3 ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-4`}
              >
                {/* Left side: Avatar for received messages (only on first in group) */}
                {!isOwn && showAvatar && (
                  <img
                    src={msg.senderAvatar || '/default-avatar.png'} // Use avatar from msg or fallback
                    alt="Sender"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-md"
                  />
                )}

                {/* Spacer if no avatar (keeps bubble alignment) */}
                {!isOwn && !showAvatar && <div className="w-10" />}

                {/* Message Bubble */}
                <div
                  className={`max-w-xs md:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}
                >
                  <MessageBubble msg={msg} isOwn={isOwn} read={msg.read} />
                </div>

                {/* Right side spacer for sent messages (symmetry) */}
                {isOwn && <div className="w-10" />}
              </div>
            );
          })}
        </div>
      ))}

      {/* Anchor for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
