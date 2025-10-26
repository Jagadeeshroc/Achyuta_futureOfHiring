// src/components/pages/MessagesAdvanced.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { Search, MessageSquarePlus } from 'lucide-react';

// Make sure your paths to these components are correct
import { SearchUserModal } from './SearchUserModal';
import { ConversationList } from './ConversationList'; // Adjusted path for simplicity
import { ChatWindow } from './ChatWindow';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MessagingAdvanced = () => {
  // --- 1. CALL ALL HOOKS FIRST ---
  const { user: currentUser, checked } = useAuth(); 
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useRef(null);

  // --- 2. DEFINE ALL useEffects ---

  // Initial Data Fetching
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return; 
    }

    setLoading(true);
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/conversations`, {
          withCredentials: true,
        });
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users`, {
          withCredentials: true,
        });
        setUsers(data.filter((u) => u._id !== currentUser._id));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchConversations();
    fetchUsers();
  }, [currentUser]);

  // Socket.IO Setup
  useEffect(() => {
    if (!currentUser) return; 

    socket.current = io(API_URL, { withCredentials: true });
    socket.current.emit('joinUser', currentUser._id);

    socket.current.on('newMessage', (newMessage) => {
      // --- FIX: Prevent duplicate messages ---
      // If the incoming message is from the current user, ignore it.
      // We already added it to the UI optimistically.
      if (newMessage.sender._id === currentUser._id) {
        return;
      }
      // --- END OF FIX ---

      if (newMessage.conversation === activeConversation?._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      setConversations((prevConvos) =>
        prevConvos.map((convo) =>
          convo._id === newMessage.conversation
            ? { ...convo, lastMessage: newMessage, updatedAt: newMessage.createdAt }
            : convo
        )
      );
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser, activeConversation?._id]); 

  // Handling Conversation Selection
  useEffect(() => {
    if (!activeConversation) return;
    if (!socket.current) return;

    const fetchMessages = async () => {
      try {
        socket.current.emit('joinConversation', activeConversation._id);
        const { data } = await axios.get(
          `${API_URL}/api/conversations/${activeConversation._id}/messages`,
          { withCredentials: true }
        );
        setMessages(data);
        
        await axios.put(
          `${API_URL}/api/conversations/${activeConversation._id}/read`,
          {},
          { withCredentials: true }
        );

        setConversations(prev => prev.map(c => 
          c._id === activeConversation._id 
            ? { ...c, unreadCount: 0 } 
            : c
        ));
      } catch (error) {
        console.error('Error fetching or marking messages:', error);
      }
    };

    fetchMessages();

    return () => {
      if (activeConversation && socket.current) {
        socket.current.emit('leaveConversation', activeConversation._id);
      }
    };
  }, [activeConversation]);

  // --- 3. DEFINE ALL HANDLERS ---
  const handleSendMessage = async (content) => {
    if (!activeConversation || !currentUser) return;

    // --- FIX: OPTIMISTIC UPDATE ---
    
    // 1. Create a temporary message object.
    const optimisticMessage = {
      _id: 'temp-' + Date.now(),
      conversation: activeConversation._id,
      content: content,
      createdAt: new Date().toISOString(),
      read: true,
      sender: currentUser // Use the full currentUser object
    };

    // 2. Add it to the local state immediately
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
    
    // 3. Update the conversation list sidebar optimistically
    setConversations((prevConvos) =>
      prevConvos.map((convo) =>
        convo._id === activeConversation._id
          ? { ...convo, lastMessage: optimisticMessage, updatedAt: optimisticMessage.createdAt }
          : convo
      )
    );
    // --- END OF FIX ---

    // 4. Send the message to the backend
    try {
      await axios.post(
        `${API_URL}/api/conversations/${activeConversation._id}`,
        { content },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // If sending fails, remove the optimistic message
      setMessages((prev) => prev.filter(m => m._id !== optimisticMessage._id));
T   }
  };

  const handleStartConversation = async (participantId) => {
    setIsModalOpen(false);
    try {
      const { data: newOrExistingConvo } = await axios.post(
        `${API_URL}/api/conversations`,
        { participantId },
        { withCredentials: true }
      );
      
      if (!conversations.find(c => c._id === newOrExistingConvo._id)) {
        const participant = users.find(u => u._id === participantId);
        setConversations(prev => [
            {...newOrExistingConvo, participants: [currentUser, participant]}, 
            ...prev
        ]);
      }
      
      setActiveConversation(newOrExistingConvo);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // --- 4. CONDITIONAL RENDERING (AFTER ALL HOOKS) ---
  if (!checked) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading user...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Please log in to see your messages.</p>
      </div>
    );
  }
  
  // --- 5. FINAL RETURN (Full UI) ---
  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900 shadow-2xl rounded-lg overflow-hidden">
      <SearchUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        onUserSelect={handleStartConversation}
      />

      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="p-4! border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Messages</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            title="New Message"
          >
            <MessageSquarePlus size={20} />
          </button>
        </div>
        
        <ConversationList
          conversations={conversations}
          currentUser={currentUser}
          activeConversationId={activeConversation?._id}
          onSelectConversation={setActiveConversation}
          loading={loading}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default MessagingAdvanced;