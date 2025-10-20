// src/context/NotificationContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

import { useAuth } from '../../hooks/useAuth';

const NotificationContext = createContext();

// Action types
const NOTIFICATION_ACTIONS = {
  SET_UNREAD_COUNTS: 'SET_UNREAD_COUNTS',
  INCREMENT_UNREAD: 'INCREMENT_UNREAD',
  MARK_CONVERSATION_READ: 'MARK_CONVERSATION_READ',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  unreadCounts: {},
  notifications: [],
  totalUnread: 0,
  loading: false,
  error: null
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNTS:
      const totalUnread = Object.values(action.payload).reduce((sum, count) => sum + count, 0);
      return {
        ...state,
        unreadCounts: action.payload,
        totalUnread,
        loading: false
      };

    case NOTIFICATION_ACTIONS.INCREMENT_UNREAD:
      const conversationId = action.payload;
      const newCount = (state.unreadCounts[conversationId] || 0) + 1;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [conversationId]: newCount
        },
        totalUnread: state.totalUnread + 1
      };

    case NOTIFICATION_ACTIONS.MARK_CONVERSATION_READ:
      const convId = action.payload;
      const currentCount = state.unreadCounts[convId] || 0;
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [convId]: 0
        },
        totalUnread: Math.max(0, state.totalUnread - currentCount)
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50) // Keep last 50
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        unreadCounts: {},
        totalUnread: 0
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

// Provider Component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { userId, isAuthenticated } = useAuth();

  // Fetch initial unread counts
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const fetchUnreadCounts = async () => {
      try {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
        
        const token = localStorage.getItem('token');
        const response = await fetch('/api/conversations/unread-counts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch unread counts');
        
        const unreadCounts = await response.json();
        dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNTS, payload: unreadCounts });
      } catch (error) {
        console.error('Error fetching unread counts:', error);
        dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      }
    };

    fetchUnreadCounts();
  }, [userId, isAuthenticated]);

  // Socket event listeners for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !socket) return;

    // Listen for new messages
    const handleNewMessage = (message) => {
      if (message.sender !== userId) {
        dispatch({ 
          type: NOTIFICATION_ACTIONS.INCREMENT_UNREAD, 
          payload: message.conversationId 
        });

        // Add push notification
        dispatch({
          type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
          payload: {
            id: Date.now().toString(),
            type: 'message',
            conversationId: message.conversationId,
            senderId: message.sender,
            senderName: message.senderName,
            content: message.content,
            timestamp: new Date().toISOString(),
            read: false
          }
        });

        // Show browser notification if permitted
        showBrowserNotification(message);
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (data) => {
      if (data.userId !== userId) {
        dispatch({
          type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
          payload: {
            id: `typing-${Date.now()}`,
            type: 'typing',
            conversationId: data.conversationId,
            userId: data.userId,
            userName: data.userName,
            timestamp: new Date().toISOString()
          }
        });
      }
    };

    // Listen for user online status
    const handleUserOnline = (data) => {
      dispatch({
        type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
        payload: {
          id: `online-${Date.now()}`,
          type: 'online',
          userId: data.userId,
          userName: data.userName,
          timestamp: new Date().toISOString()
        }
      });
    };

    // Socket event listeners
    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userOnline', handleUserOnline);

    // Cleanup
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userOnline', handleUserOnline);
    };
  }, [userId, isAuthenticated]);

  // Browser notification function
  const showBrowserNotification = (message) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(`${message.senderName} sent a message`, {
        body: message.content.length > 50 
          ? `${message.content.substring(0, 50)}...` 
          : message.content,
        icon: '/favicon.ico',
        tag: message.conversationId
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showBrowserNotification(message);
        }
      });
    }
  };

  // Actions
  const markConversationAsRead = (conversationId) => {
    dispatch({ 
      type: NOTIFICATION_ACTIONS.MARK_CONVERSATION_READ, 
      payload: conversationId 
    });
  };

  const removeNotification = (notificationId) => {
    dispatch({ 
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, 
      payload: notificationId 
    });
  };

  const clearAllNotifications = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS });
  };

  const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
      return Promise.resolve('not-supported');
    }

    return Notification.requestPermission();
  };

  const value = {
    // State
    unreadCounts: state.unreadCounts,
    notifications: state.notifications,
    totalUnread: state.totalUnread,
    loading: state.loading,
    error: state.error,

    // Actions
    markConversationAsRead,
    removeNotification,
    clearAllNotifications,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};