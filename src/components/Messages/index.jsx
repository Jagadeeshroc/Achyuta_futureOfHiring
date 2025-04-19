import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiSend, 
  FiUser, 
  FiMoreVertical, 
  FiPaperclip, 
  FiSmile, 
  FiMessageSquare, 
  FiArrowLeft 
} from 'react-icons/fi';
import { IoCheckmarkDone } from 'react-icons/io5';
import './index.css';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Sample conversation data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '',
      lastMessage: 'Hey, how are you doing?',
      time: '10:30 AM',
      unread: 2,
      online: true,
      messages: [
        { id: 1, text: 'Hi there!', sent: true, time: '10:20 AM', read: true },
        { id: 2, text: 'Hey, how are you doing?', sent: false, time: '10:30 AM', read: false }
      ]
    },
    {
      id: 2,
      name: 'Work Group',
      avatar: '',
      lastMessage: 'Meeting at 3pm tomorrow',
      time: 'Yesterday',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Don\'t forget the deadline', sent: true, time: 'Yesterday', read: true },
        { id: 2, text: 'Meeting at 3pm tomorrow', sent: false, time: 'Yesterday', read: true }
      ]
    },
    {
      id: 3,
      name: 'Alex Parker',
      avatar: '',
      lastMessage: 'The project files are ready',
      time: 'Monday',
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: 'When will the project be ready?', sent: true, time: 'Monday', read: true },
        { id: 2, text: 'The project files are ready', sent: false, time: 'Monday', read: false }
      ]
    },
    {
      id: 4,
      name: 'Ganlapadu Srinath',
      avatar: '',
      lastMessage: 'The project files are ready',
      time: 'Monday',
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: 'When will the project be ready?', sent: true, time: 'Monday', read: true },
        { id: 2, text: 'briyani tinntunna ready chestha', sent: false, time: 'Monday', read: false }
      ]
    },
    {
      id: 5,
      name: 'Amit',
      avatar: '',
      lastMessage: 'The project files are ready',
      time: 'Monday',
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: 'When will the project be ready?', sent: true, time: 'Monday', read: true },
        { id: 2, text: 'The project files are ready', sent: false, time: 'Monday', read: false }
      ]
    }
  ]);

  // Check if mobile view on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Filter and sort conversations
  const filteredConversations = conversations
    .filter(conv => conv.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a.unread > 0 && b.unread === 0) return -1;
      if (a.unread === 0 && b.unread > 0) return 1;
      return 0;
    });

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeChat.id) {
        const newMsg = {
          id: conv.messages.length + 1,
          text: newMessage,
          sent: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        
        return {
          ...conv,
          lastMessage: newMessage,
          time: 'Just now',
          unread: 0,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setActiveChat(updatedConversations.find(conv => conv.id === activeChat.id));
    setNewMessage('');
  };

  // Mark messages as read
  const markAsRead = (conversationId) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unread: 0,
          messages: conv.messages.map(msg => ({ ...msg, read: true }))
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    if (activeChat?.id === conversationId) {
      setActiveChat(updatedConversations.find(conv => conv.id === conversationId));
    }
  };

  // Handle conversation click (mobile-specific behavior)
  const handleConversationClick = (conversation) => {
    setActiveChat(conversation);
    markAsRead(conversation.id);
    if (isMobileView) {
      setShowChat(true);
    }
  };

  // Handle back to conversations list (mobile)
  const handleBackToConversations = () => {
    setShowChat(false);
  };

  return (
    <div className={`messages-container ${showChat ? 'show-chat' : ''}`}>
      {/* Sidebar - shown always on desktop, conditionally on mobile */}
      {(!isMobileView || !showChat) && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-title">Messages</h1>
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search conversations"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="conversation-list">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`conversation-item ${activeChat?.id === conversation.id ? 'active' : ''} ${
                    conversation.unread > 0 ? 'unread-conversation' : ''
                  }`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="avatar-container">
                    <div className="avatar">
                      {conversation.avatar ? (
                        <img src={conversation.avatar} alt={conversation.name} className="avatar-img" />
                      ) : (
                        <FiUser size={20} />
                      )}
                    </div>
                    {conversation.online && <div className="online-status"></div>}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{conversation.name}</h3>
                      <span className={`conversation-time ${conversation.unread > 0 ? 'unread' : 'read'}`}>
                        {conversation.time}
                      </span>
                    </div>
                    <div className="conversation-preview">
                      <p className="last-message">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="unread-count">{conversation.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <div className="no-conversations-icon">
                  <FiMessageSquare size={24} />
                </div>
                <p className="no-conversations-text">No conversations found</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chat area - conditionally rendered */}
      {(!isMobileView || showChat) && (
        activeChat ? (
          <div className="chat-area">
            <div className="chat-header">
              {isMobileView && (
                <button className="back-button" onClick={handleBackToConversations}>
                  <FiArrowLeft size={20} />
                </button>
              )}
              <div className="chat-user">
                <div className="avatar-container">
                  <div className="chat-avatar">
                    {activeChat.avatar ? (
                      <img src={activeChat.avatar} alt={activeChat.name} className="chat-avatar-img" />
                    ) : (
                      <FiUser size={18} />
                    )}
                  </div>
                  {activeChat.online && <div className="chat-user-status"></div>}
                </div>
                <div className="chat-user-info">
                  <h3 className="chat-username">{activeChat.name}</h3>
                  <p className="chat-status">
                    {activeChat.online ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              <button className="input-button">
                <FiMoreVertical />
              </button>
            </div>
            
            <div className="messages-container">
              <div className="message-list">
                {activeChat.messages.map(message => (
                  <div 
                    key={message.id}
                    className={`message ${message.sent ? 'sent' : 'received'}`}
                  >
                    <div className={`message-bubble ${message.sent ? 'sent' : 'received'}`}>
                      <p className="message-text">{message.text}</p>
                      <div className="message-meta">
                        <span className="message-time">{message.time}</span>
                        {message.sent && (
                          <IoCheckmarkDone className={message.read ? 'read-icon' : 'unread-icon'} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="message-input-container">
              <div className="input-group">
                <button className="input-button">
                  <FiPaperclip />
                </button>
                <button className="input-button">
                  <FiSmile />
                </button>
                <input
                  type="text"
                  placeholder="Type a message"
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="send-button" onClick={handleSendMessage}>
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
        ) : (
          !isMobileView && (
            <div className="empty-state">
              <div className="empty-state-content">
                <div className="empty-state-icon">
                  <FiMessageSquare size={24} />
                </div>
                <h3 className="empty-state-title">Select a conversation</h3>
                <p className="empty-state-text">Choose an existing chat or start a new one</p>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default Messages;