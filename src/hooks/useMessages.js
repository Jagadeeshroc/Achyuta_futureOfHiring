// src/hooks/useMessages.js
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useSocket } from '../components/context/SocketContext';

export const useMessages = (conversationId, currentUserId, onConvoUpdate) => { // Added callback for parent update
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    console.log('Fetching messages for conversationId:', conversationId);
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/conversations/${conversationId}/messages`);
        setMessages(data || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
        if (err.response?.status === 404) setMessages([]);
      }
    };
    load();
  }, [conversationId]);

  const handleNewMsg = useCallback((msg) => {
    if (msg.conversationId === conversationId || msg.conversation === conversationId) {
      setMessages((prev) => [...prev, msg]);
      onConvoUpdate?.(); // Notify parent to resort
    }
  }, [conversationId, onConvoUpdate]);

  const handleTyping = useCallback(({ userId, isTyping, convId }) => {
    if (convId === conversationId && userId !== currentUserId) {
      setTyping(isTyping ? 'typing...' : '');
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    if (!socket || !conversationId) return undefined;
    socket.on('message', handleNewMsg);
    socket.on('typing', handleTyping);
    return () => {
      socket.off('message', handleNewMsg);
      socket.off('typing', handleTyping);
    };
  }, [socket, conversationId, currentUserId, handleNewMsg, handleTyping]);

  const sendMessage = async (content) => {
    if (!content.trim() || !conversationId || !socket) return;
    try {
      const { data } = await axios.post(`/api/conversations/${conversationId}`, { content });
      setMessages((prev) => [...prev, data]);
      socket.emit('sendMessage', data);
      socket.emit('typing', { conversationId, userId: currentUserId, isTyping: false });
      onConvoUpdate?.(); // Resort sidebar
      return data;
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const emitTyping = (isTyping) => {
    if (!socket || !conversationId) return;
    socket.emit('typing', { conversationId, userId: currentUserId, isTyping });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return { messages, typing, sendMessage, emitTyping, messagesEndRef };
};