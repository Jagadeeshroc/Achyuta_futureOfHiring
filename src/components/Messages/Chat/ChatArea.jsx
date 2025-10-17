import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { groupMessagesByDate } from '../../../utils/dateFormat';

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
}) => {
  const otherUser = conversation.participants.find(p => p._id !== currentUserId);
  const grouped = groupMessagesByDate(messages);

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader otherUser={otherUser} typing={typing} isMobile={isMobile} goBack={goBack} />
      <MessageList groupedMessages={grouped} currentUserId={currentUserId} />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSend}
        onTyping={emitTyping}
      />
    </div>
  );
};

export default ChatArea;