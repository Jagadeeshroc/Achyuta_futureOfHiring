// src/hooks/useMessages.js
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios'; // Import axios to use auth headers

export const useMessages = (conversation, currentUser, apiBaseUrl) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!conversation || !currentUser || !apiBaseUrl) return;

    const conversationId = conversation._id;
    socketRef.current = io(apiBaseUrl, { withCredentials: true });
    socketRef.current.emit('joinConversation', conversationId);
    socketRef.current.emit('joinUser', currentUser._id);

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseUrl}/api/conversations/${conversationId}/messages`
        );
        setMessages(data);
        await axios.put(
          `${apiBaseUrl}/api/conversations/${conversationId}/read`,
          {}
        );
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();

    socketRef.current.on('newMessage', (message) => {
      if (message.conversation === conversationId) {
        
        // --- FIX FOR DUPLICATES ---
        // If the incoming message is from the current user, ignore it
        // because we've already added it optimistically.
        if (message.sender._id === currentUser._id) {
          return;
        }
        // --- END OF FIX ---

        setMessages((prev) => [...prev, message]);
      }
    });

    socketRef.current.on('typing', (data) => {
      if (data.userId === currentUser._id) return; 
      setTyping(`${data.userName} is typing...`);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => setTyping(null), 3000);
    });

    return () => {
      socketRef.current.emit('leaveConversation', conversationId);
      socketRef.current.disconnect();
    };
  }, [conversation, currentUser, apiBaseUrl]);

  const sendMessage = async (content) => {
    if (!socketRef.current || !conversation || !currentUser) return;
    
    // --- THIS IS THE FIX: OPTIMISTIC UPDATE ---
    
    // 1. Create a temporary message object.
    // It must match the structure of a real message.
    const optimisticMessage = {
      _id: 'temp-' + Date.now(), // Give it a temporary unique ID
      conversation: conversation._id,
      content: content,
      createdAt: new Date().toISOString(),
      read: false, // Senders read their own messages
      sender: currentUser // Use the full currentUser object
    };

    // 2. Add it to the local state immediately
    setMessages((prev) => [...prev, optimisticMessage]);

    // --- END OF FIX ---

    // 3. Send the message to the backend in the background
    try {
      await axios.post(
        `${apiBaseUrl}/api/conversations/${conversation._id}`,
        { content }
      );
      // The backend will broadcast to everyone *else*.
    } catch (error) {
      console.error('Failed to send message:', error);
      // If the send fails, remove the optimistic message
      setMessages((prev) => prev.filter(m => m._id !== optimisticMessage._id));
    }
  };

  const emitTyping = () => {
    if (!socketRef.current || !conversation) return;
    socketRef.current.emit('typing', { 
      conversationId: conversation._id, 
      userId: currentUser._id,
      userName: currentUser.name
    });
  };

  return { messages, typing, sendMessage, emitTyping };
};