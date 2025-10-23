import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useMessages = (conversationId, currentUserId, apiBaseUrl) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    // Connect socket
    socketRef.current = io(apiBaseUrl);

    // Join the conversation room
    socketRef.current.emit('joinRoom', conversationId);

    // Fetch initial messages via API
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/messages/${conversationId}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();

    // Listen for new incoming messages
    socketRef.current.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicator
    socketRef.current.on('typing', (userName) => {
      setTyping(`${userName} is typing...`);
      // Clear after 3 sec
      setTimeout(() => setTyping(null), 3000);
    });

    return () => {
      // Leave room & disconnect on cleanup
      socketRef.current.emit('leaveRoom', conversationId);
      socketRef.current.disconnect();
    };
  }, [conversationId, apiBaseUrl]);

  const sendMessage = (content) => {
    if (!socketRef.current) return;
    const message = {
      conversationId,
      sender: currentUserId,
      content,
      createdAt: new Date(),
    };
    // Emit message to server
    socketRef.current.emit('sendMessage', message);

    // Optimistic UI update
    setMessages((prev) => [...prev, message]);
  };

  const emitTyping = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('typing', { conversationId, userName: 'You' });
  };

  return { messages, typing, sendMessage, emitTyping };
};
