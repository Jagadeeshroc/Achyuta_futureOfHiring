// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext'; // Assuming this exists

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const socket = useSocket();
  const [unreadCounts, setUnreadCounts] = useState({}); // { convId: count }
  const [globalUnreadMessages, setGlobalUnreadMessages] = useState(0);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages globally
    socket.on('newMessage', (message) => {
      const { conversationId, senderId } = message; // Adjust based on your message schema
      const currentUserId = localStorage.getItem('user')?._id; // Or from useAuth

      if (senderId !== currentUserId) {
        // Increment if not from self
        setUnreadCounts((prev) => {
          const newCounts = { ...prev };
          newCounts[conversationId] = (newCounts[conversationId] || 0) + 1;
          return newCounts;
        });
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket]);

  // Compute global unread whenever per-conv changes
  useEffect(() => {
    const total = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    setGlobalUnreadMessages(total);
  }, [unreadCounts]);

  // Function to reset unread for a conversation (called when opening chat)
  const markConversationAsRead = (convId) => {
    setUnreadCounts((prev) => ({ ...prev, [convId]: 0 }));
  };

  return (
    <NotificationContext.Provider value={{ unreadCounts, globalUnreadMessages, markConversationAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);