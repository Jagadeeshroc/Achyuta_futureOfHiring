// src/components/messages/Chat/ChatArea.jsx
import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({
  conversation,
  messages,
  typing,
  currentUserId,
  isMobile,
  goBack,
  sendMessage,
  emitTyping,
  newMessage,
  setNewMessage,
  getOtherUser,
}) => {
  const otherUser = getOtherUser(conversation);
  const messageListRef = useRef();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-190 p-3! bg-white rounded-r-md shadow-inner">
      <ChatHeader otherUser={otherUser} isMobile={isMobile} goBack={goBack} typing={typing} />

      <div
        ref={messageListRef}
        className="flex-1 overflow-y-auto  p-2! scrollbar-thin scrollbar-thumb-indigo-300"
      >
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      <MessageInput
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          emitTyping(e.target.value.length > 0);
        }}
        onSend={() => sendMessage(newMessage)}
      />
    </div>
  );
};

export default ChatArea;
