// src/components/messages/MessageComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import ChatArea from './Chat/ChatArea';

import { useAuth } from '../../hooks/useAuth';
import { useConversations } from '../../hooks/useConversations';
import { useMessages } from '../../hooks/useMessages';
import axios from 'axios';
import { useNotifications } from '../context/NotificationContext';

const MessageComponent = ({ apiBaseUrl = 'http://localhost:5000' }) => {
  const navigate = useNavigate();
  const { userId: currentUserId } = useAuth();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChat, setShowChat] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const { conversations, loading, error } = useConversations();
  const { messages, typing, sendMessage, emitTyping } = useMessages(
    activeConversation?._id,
    currentUserId
  );
  const { unreadCounts, markConversationAsRead } = useNotifications();

  useEffect(() => {
    axios.defaults.baseURL = apiBaseUrl;
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [apiBaseUrl]);

  const getOtherUser = useCallback(
    (conv) => conv?.participants?.find((p) => p._id !== currentUserId),
    [currentUserId]
  );

  const selectConversation = (conv) => {
    setActiveConversation(conv);
    markConversationAsRead(conv._id);
    if (isMobile) setShowChat(true);
  };

  const startConversation = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const { data } = await axios.post(
        '/api/conversations',
        { participantId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActiveConversation(data);
      if (isMobile) setShowChat(true);
    } catch (err) {
      console.error('Error starting conversation:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const sidebarVisible = !isMobile || !showChat;
  const chatVisible = !isMobile || showChat;

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarVisible && (
        <div className={isMobile ? 'w-full' : 'w-1/3'}>
          <Sidebar
            conversations={conversations}
            loading={loading}
            error={error}
            currentUserId={currentUserId}
            activeConversation={activeConversation}
            onConversationSelect={selectConversation}
            startConversation={startConversation}
            getOtherUser={getOtherUser}
            unreadCounts={unreadCounts}
            apiBaseUrl={apiBaseUrl}
          />
        </div>
      )}

      {chatVisible && activeConversation && (
        <div className={isMobile ? 'w-full' : 'w-2/3'}>
          <ChatArea
            conversation={activeConversation}
            messages={messages}
            typing={typing}
            currentUserId={currentUserId}
            isMobile={isMobile}
            goBack={() => setShowChat(false)}
            sendMessage={(content) => sendMessage(content)}
            emitTyping={(isTyping) => emitTyping(isTyping)}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
          />
        </div>
      )}
    </div>
  );
};

export default MessageComponent;