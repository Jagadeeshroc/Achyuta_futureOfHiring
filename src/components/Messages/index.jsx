// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FiSearch, FiSend, FiUser, FiMoreVertical, FiArrowLeft, FiX } from 'react-icons/fi';
// import { IoCheckmarkDone } from 'react-icons/io5';
// import { BsThreeDotsVertical, BsEmojiSmile } from 'react-icons/bs';
// import { useSocket } from '../context/SocketContext';

// axios.defaults.baseURL = 'http://localhost:5000';
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// const MessageComponent = () => {
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isMobileView, setIsMobileView] = useState(false);
//   const [showChat, setShowChat] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState('');
//   const [typingStatus, ] = useState('');
//   const [showSearch, setShowSearch] = useState(false);

//   const socket = useSocket();
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const navigate = useNavigate();

//   // Authentication and initialization
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//       navigate('/login');
//     }

//     const id = localStorage.getItem('user');
//     if (id) {
//       setCurrentUserId(id);
//     } else {
//       navigate('/login');
//     }
//   }, [navigate]);

//   // Mobile view handling
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth <= 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Fetch conversations
//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('/api/conversations');
//         const uniqueConversations = Array.from(
//           new Map(response.data.map(conv => [conv._id, conv])).values()
//         ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//         setConversations(uniqueConversations);
//       } catch (err) {
//         console.error('Fetch conversations error:', err);
//         if (err.response?.status === 401) {
//           navigate('/login');
//         }
//         setError(err.response?.data?.error || 'Failed to load conversations');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchConversations();
//   }, [navigate]);

//   // Get other user function (refactored to avoid error)
//   const getOtherUser = useCallback((conversation) => {
//     if (!conversation?.participants) return null;
//     return conversation.participants.find(p => p._id !== currentUserId);
//   }, [currentUserId]);

//   const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) return 'Today';
//     if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
//     return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//   };

//   const groupMessagesByDate = (messages) => {
//     return messages.reduce((acc, message) => {
//       const date = formatDate(message.createdAt);
//       if (!acc[date]) acc[date] = [];
//       acc[date].push(message);
//       return acc;
//     }, {});
//   };

//   // Other code remains the same ...


//   // Event handlers
//   const handleTyping = () => {
//     if (!socket || !activeConversation) return;
//     const otherUser = getOtherUser(activeConversation);
//     if (otherUser) {
//       socket.emit('typing', {
//         conversationId: activeConversation._id,
//         userId: currentUserId,
//         isTyping: newMessage.length > 0
//       });
//     }
//   };

//   const startConversation = async (userId) => {
//     try {
//       const response = await axios.post('/api/conversations', { participantId: userId });
//       setActiveConversation(response.data);
//       setSearchTerm('');
//       setSearchResults([]);
//       if (isMobileView) setShowChat(true);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to start conversation');
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !activeConversation) return;
    
//     try {
//       const response = await axios.post(`/api/conversations/${activeConversation._id}`, {
//         content: newMessage
//       });
      
//       setMessages(prev => [...prev, response.data]); // Add locally
//       setNewMessage(''); // Clear input
      
//       if (socket) {
//         socket.emit('sendMessage', response.data); // Emit to server
//         socket.emit('typing', {
//           conversationId: activeConversation._id,
//           userId: currentUserId,
//           isTyping: false
//         });
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to send message');
//     }
//   };

//   const groupedMessages = groupMessagesByDate(messages);

//   // Avatar component
//   const Avatar = ({ user, size = 40, className = '' }) => {
//     const getAvatarUrl = (avatar) => (!avatar ? null : avatar.startsWith('http') ? avatar : `http://localhost:5000${avatar}`);
//     const [imgError, setImgError] = useState(false);
//     const avatarUrl = getAvatarUrl(user?.avatar);

//     if (imgError || !avatarUrl) {
//       return (
//         <div className={`rounded-full bg-gray-200 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
//           <FiUser size={size * 0.6} className="text-gray-500" />
//         </div>
//       );
//     }

//     return (
//       <img
//         src={avatarUrl}
//         alt={user?.name || 'User'}
//         className={`rounded-full object-cover ${className}`}
//         style={{ width: size, height: size }}
//         onError={() => setImgError(true)}
//       />
//     );
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       {(!isMobileView || !showChat) && (
//         <div className={`${isMobileView ? 'w-full' : 'w-1/3'} bg-white border-r border-gray-200 flex flex-col`}>
//           <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
//             <h1 className="text-xl font-bold">Messages</h1>
//             <div className="flex space-x-4">
//               <button onClick={() => setShowSearch(!showSearch)} className="p-1 rounded-full hover:bg-indigo-500 transition">
//                 <FiSearch size={20} />
//               </button>
//               <button className="p-1 rounded-full hover:bg-indigo-500 transition">
//                 <BsThreeDotsVertical size={20} />
//               </button>
//             </div>
//           </div>

//           {showSearch && (
//             <div className="p-3 bg-white border-b border-gray-200 flex items-center">
//               <div className="relative flex-grow">
//                 <FiSearch className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search people..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 {searchTerm && (
//                   <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
//                     <FiX size={18} />
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="flex-1 overflow-y-auto">
//             {loading ? (
//               <div className="flex justify-center items-center h-full">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//               </div>
//             ) : error ? (
//               <div className="p-4 text-red-500">{error}</div>
//             ) : (
//               <>
//                 {searchResults.length > 0 && (
//                   <div className="p-2 border-b border-gray-200">
//                     <h4 className="px-2 py-1 text-sm font-medium text-gray-500">Search Results</h4>
//                     {searchResults.map((user) => (
//                       <div
//                         key={user._id}
//                         className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition"
//                         onClick={() => startConversation(user._id)}
//                       >
//                         <Avatar user={user} size={48} />
//                         <div className="ml-3">
//                           <h3 className="font-medium text-gray-900">{user.name}</h3>
//                           <p className="text-sm text-gray-500">Start conversation</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="divide-y divide-gray-100">
//                   {conversations.map((conversation) => {
//                     const otherUser = getOtherUser(conversation);
//                     const isUnread = conversation.unreadCount > 0;
//                     const lastMessage = conversation.lastMessage;
//                     return (
//                       <div
//                         key={conversation._id}
//                         className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition ${activeConversation?._id === conversation._id ? 'bg-blue-50' : ''}`}
//                         onClick={() => {
//                           setActiveConversation(conversation);
//                           if (isMobileView) setShowChat(true);
//                         }}
//                       >
//                         <Avatar user={otherUser} size={48} className="flex-shrink-0" />
//                         <div className="ml-3 flex-1 min-w-0">
//                           <div className="flex justify-between items-baseline">
//                             <h3 className="text-sm font-medium text-gray-900 truncate">{otherUser?.name}</h3>
//                             <span className="text-xs text-gray-500">
//                               {conversation.updatedAt && formatTime(conversation.updatedAt)}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <p className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
//                               {lastMessage?.content || 'No messages yet'}
//                             </p>
//                             {isUnread && (
//                               <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs">
//                                 {conversation.unreadCount}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Chat area */}
//       {(!isMobileView || showChat) && activeConversation && (
//         <div className={`${isMobileView ? 'w-full' : 'w-2/3'} flex flex-col bg-white`}>
//           <div className="p-3 border-b border-gray-200 flex items-center bg-indigo-600 text-white">
//             {isMobileView && (
//               <button className="mr-2 p-1 rounded-full hover:bg-indigo-500 transition" onClick={() => setShowChat(false)}>
//                 <FiArrowLeft size={20} />
//               </button>
//             )}
//             <Avatar user={getOtherUser(activeConversation)} size={40} className="border-2 border-white" />
//             <div className="ml-3 flex-1">
//               <h3 className="font-medium">{getOtherUser(activeConversation)?.name}</h3>
//               <p className="text-xs opacity-80">{typingStatus || 'Online'}</p>
//             </div>
//             <button className="p-1 rounded-full hover:bg-indigo-500 transition">
//               <BsThreeDotsVertical size={20} />
//             </button>
//           </div>

//          <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ backgroundImage: 'linear-gradient(rgba(229, 231, 235, 0.7), rgba(229, 231, 235, 0.7))' }}>
//     {Object.entries(groupedMessages).map(([date, dateMessages]) => (
//       <div key={date} className="mb-4">
//         <div className="flex justify-center">
//           <span className="px-3 py-1 bg-white text-xs text-gray-500 rounded-full shadow-sm">{date}</span>
//         </div>
//         {dateMessages.map((msg) => (
//           <div
//             key={msg._id} // Unique key from backend
//             className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'} my-2`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 msg.sender === currentUserId ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
//               }`}
//             >
//               <p className="text-xl">{msg.content}</p>
//               <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
//                 msg.sender === currentUserId ? 'text-indigo-400' : 'text-gray-500'
//               }`}>
//                 <span>{formatTime(msg.createdAt)}</span>
//                 {msg.sender === currentUserId && <IoCheckmarkDone className={msg.read ? 'text-blue-300' : 'text-gray-400'} />}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     ))}
//     <div ref={messagesEndRef} />
//   </div>

//           <div className="p-3 border-t border-gray-200 bg-white">
//             <div className="flex items-center">
//               <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
//                 <BsEmojiSmile size={20} />
//               </button>
//               <div className="flex-1 mx-2">
//                 <input
//                   ref={inputRef}
//                   type="text"
//                   placeholder="Type a message..."
//                   value={newMessage}
//                   onChange={(e) => {
//                     setNewMessage(e.target.value);
//                     handleTyping();
//                   }}
//                   onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                   className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                 />
//               </div>
//               <button
//                 className={`p-2 rounded-full transition ${newMessage.trim() ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-400'}`}
//                 onClick={sendMessage}
//                 disabled={!newMessage.trim()}
//               >
//                 <FiSend size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageComponent;