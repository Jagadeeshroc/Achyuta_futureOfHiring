import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from './Sidebar/Sidebar';
import ChatArea from './Chat/ChatArea';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
  // Make sure this path is correct

const MessageComponent = ({ apiBaseUrl = 'http://localhost:5000' }) => {
  const { userId: currentUserId } = useAuth();
  const socketContext = useSocket();

  // Defensive check if context is null (optional)
  if (!socketContext) {
    return <div>Loading socket...</div>;
  }

  const { socket } = socketContext;

  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChat, setShowChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Load conversations initially
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${apiBaseUrl}/api/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchConversations();
  }, [apiBaseUrl, navigate]);

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${apiBaseUrl}/api/messages/${activeConversation._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data);
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchMessages();

    // Join Socket room for this conversation
    if (socket) {
      socket.emit('joinRoom', activeConversation._id);
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', activeConversation._id);
      }
    };
  }, [activeConversation, apiBaseUrl, navigate, socket]);

  // Real-time incoming message listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message.conversationId === activeConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleTyping = ({ conversationId, userId, isTyping }) => {
      if (conversationId === activeConversation?._id && userId !== currentUserId) {
        setTypingStatus(isTyping ? 'Typing...' : '');
      }
    };

    socket.on('message', handleNewMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('typing', handleTyping);
    };
  }, [socket, activeConversation, currentUserId]);

  // Send message
  const sendMessage = async (content) => {
    if (!content.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${apiBaseUrl}/api/messages`,
        {
          conversationId: activeConversation._id,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      socket.emit('sendMessage', data); // notify others in room
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  // Emit typing event
  const emitTyping = (isTyping) => {
    if (!socket || !activeConversation) return;
    socket.emit('typing', {
      conversationId: activeConversation._id,
      userId: currentUserId,
      isTyping,
    });
  };

  // Helper to get other user from conversation participants
  const getOtherUser = useCallback(
    (conv) => conv?.participants?.find((p) => p._id !== currentUserId),
    [currentUserId]
  );

  const selectConversation = (conv) => {
    setActiveConversation(conv);
    if (isMobile) setShowChat(true);
  };

  const startConversation = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${apiBaseUrl}/api/conversations`,
        { participantId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations((prev) => [...prev, data]);
      setActiveConversation(data);
      if (isMobile) setShowChat(true);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const sidebarVisible = !isMobile || !showChat;
  const chatVisible = !isMobile || showChat;

  return (
    <div className="flex h-full bg-gray-100 p-3 m-1 rounded-md shadow-lg">
      {sidebarVisible && (
        <div className={isMobile ? 'w-full' : 'w-1/3'}>
          <Sidebar
             conversations={conversations}
              currentUserId={currentUserId}
              activeConversation={activeConversation}
              onConversationSelect={selectConversation}
              startConversation={startConversation}
              getOtherUser={getOtherUser}
              apiBaseUrl={apiBaseUrl}
              onlineUsers={onlineUsers} 
          />
        </div>
      )}
      {chatVisible && activeConversation && (
        <div className={isMobile ? 'w-full' : 'w-2/3 flex flex-col'}>
          <ChatArea
            conversation={activeConversation}
            messages={messages}
            typing={typingStatus}
            currentUserId={currentUserId}
            isMobile={isMobile}
            goBack={() => setShowChat(false)}
            sendMessage={sendMessage}
            emitTyping={emitTyping}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            getOtherUser={getOtherUser}
          />
        </div>
      )}
      {!activeConversation && (
        <div className="flex flex-col justify-center items-center w-full text-gray-400 select-none">
          <h2 className="text-2xl font-semibold mb-2">No conversation selected</h2>
          <p>Search and select a user to start chatting.</p>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
