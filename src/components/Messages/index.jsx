import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { 
  FiSearch, FiSend, FiUser, FiMoreVertical, FiArrowLeft 
} from 'react-icons/fi';
import { IoCheckmarkDone } from 'react-icons/io5';
import './index.css';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';



const MessageComponent = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  }
}, [navigate]);


  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket']
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Get logged-in user ID
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setCurrentUserId(id);
      // Set up axios auth header if token exists
      
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Check viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch conversations
 // ...existing code...
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get('/api/conversations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setConversations(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token invalid or expired
          localStorage.removeItem('token');
          navigate('/login');
        }
        console.error('Error fetching conversations:', err);
        setError(err.response?.data?.error || 'Failed to load conversations');
        setLoading(false);
      }
    };
    fetchConversations();
  }, [navigate]);


//   // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${activeConversation._id}`);
        setMessages(response.data);
        
        // Mark messages as read
        if (response.data.length > 0) {
          await axios.put(`/api/messages/${activeConversation._id}/read`);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load messages');
      }
    };
    
    fetchMessages();
    
    // Join conversation room
    if (socket && activeConversation) {
      socket.emit('joinConversation', activeConversation._id);
    }

    return () => {
      if (socket && activeConversation) {
        socket.emit('leaveConversation', activeConversation._id);
      }
    };
  }, [activeConversation, socket]);

  // Set up socket listeners
  useEffect(() => {
  if (!socket || !activeConversation) return;

  const handleReceiveMessage = (message) => {
    // Only add if the message belongs to the active conversation
    if (message.conversation === activeConversation._id) {
      setMessages(prev => {
        // Prevent duplicate messages
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    }
  };

  socket.on('receiveMessage', handleReceiveMessage);

  // Cleanup to prevent multiple listeners
  return () => {
    socket.off('receiveMessage', handleReceiveMessage);
  };
}, [socket, activeConversation]);
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search users
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      try {
        const response = await axios.get('/api/users/search', {
          params: { name: searchTerm }
        });
        setSearchResults(response.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Start new conversation
  const startConversation = async (userId) => {
    try {
      const response = await axios.post('/api/conversations', {
        participantId: userId
      });
      
      const newConversation = response.data;
      
      // Check if conversation already exists in state
      const existingConv = conversations.find(c => c._id === newConversation._id);
      
      if (!existingConv) {
        setConversations(prev => [newConversation, ...prev]);
      }
      
      setActiveConversation(newConversation);
      setSearchTerm('');
      setSearchResults([]);
      
      if (isMobileView) setShowChat(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start conversation');
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
     const tempId = Date.now().toString();
  const tempMessage = {
    _id: tempId, // Temporary ID
    conversation: activeConversation._id,
    sender: currentUserId,
    content: newMessage,
    read: false,
    createdAt: new Date().toISOString()
  };
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');

        try {
    const messageData = {
      conversationId: activeConversation._id,
      content: tempMessage.content
    };
      
      // Send message to server
      const response = await axios.post('/api/messages', messageData);
      
      // Replace temporary message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg._id === tempId ? response.data : msg
        )
      );
      
      // Emit socket event
      if (socket) {
        socket.emit('sendMessage', response.data);
      }
      
       // Update conversation list
    setConversations(prev =>
      prev
        .map(conv =>
          conv._id === activeConversation._id
            ? { ...conv, lastMessage: response.data, updatedAt: new Date().toISOString() }
            : conv
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to send message');
    // Remove temporary message if send failed
    setMessages(prev => prev.filter(msg => msg._id !== tempId));
  }
};

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherUser = (conversation) => {
    return conversation.participants.find(p => p._id?.toString() !== currentUserId);
  };

  return (
    <div className="message-container">
      {/* Sidebar */}
      {(!isMobileView || !showChat) && (
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="conversations-list">
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h4>Search Results</h4>
                  {searchResults.map((user) => (
                    <div 
                      key={user._id} 
                      className="user-item" 
                      onClick={() => startConversation(user._id)}
                    >
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <FiUser />
                        )}
                      </div>
                      <div className="user-info">
                        <h3>{user.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {conversations.length > 0 ? (
                conversations.map((conv) => {
                  const otherUser = getOtherUser(conv);
                  return (
                    <div
                      key={conv._id}
                      className={`conversation-item ${
                        activeConversation?._id === conv._id ? 'active' : ''
                      }`}
                      onClick={() => {
                        setActiveConversation(conv);
                        if (isMobileView) setShowChat(true);
                      }}
                    >
                      <div className="conversation-avatar">
                        {otherUser?.avatar ? (
                          <img src={otherUser.avatar} alt={otherUser.name} />
                        ) : (
                          <FiUser />
                        )}
                      </div>
                      <div className="conversation-info">
                        <h3>{otherUser?.name}</h3>
                        <p className="last-message">
                          {conv.lastMessage?.content?.substring(0, 30) || 'No messages yet'}
                          {conv.lastMessage?.content?.length > 30 ? '...' : ''}
                        </p>
                      </div>
                      <div className="conversation-meta">
                        <span className="time">{formatTime(conv.updatedAt)}</span>
                        {!conv.lastMessage?.read && 
                         conv.lastMessage?.sender !== currentUserId && (
                          <span className="unread-badge"></span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <p>No conversations yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chat area */}
      {(!isMobileView || showChat) && activeConversation && (
        <div className="chat-area">
          <div className="chat-header">
            {isMobileView && (
              <button 
                className="back-button" 
                onClick={() => setShowChat(false)}
              >
                <FiArrowLeft />
              </button>
            )}
            
            <div className="chat-user-info">
              <div className="user-avatar">
                {getOtherUser(activeConversation)?.avatar ? (
                  <img 
                    src={getOtherUser(activeConversation).avatar} 
                    alt={getOtherUser(activeConversation).name} 
                  />
                ) : (
                  <FiUser />
                )}
              </div>
              <div>
                <h3>{getOtherUser(activeConversation)?.name}</h3>
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${
                    msg.sender === currentUserId ? 'sent' : 'received'
                  }`}
                >
                  <div className="message-content">
                    <p>{msg.content}</p>
                    <div className="message-meta">
                      <span>{formatTime(msg.createdAt)}</span>
                      {msg.sender === currentUserId && (
                        <IoCheckmarkDone className={msg.read ? 'read' : 'unread'} />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-chat">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              className="send-button" 
              onClick={sendMessage} 
              disabled={!newMessage.trim()}
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}

      {!isMobileView && !activeConversation && (
        <div className="empty-chat-area">
          <h3>Select a conversation</h3>
          <p>Choose a chat or search for a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;