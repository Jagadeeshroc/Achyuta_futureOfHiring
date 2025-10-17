import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ConversationList from './ConversationList';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSearch } from '../../../hooks/useSearch';
import axios from 'axios';
import ReactMemo from 'react'; // For memoization

const Sidebar = ({
  conversations,
  loading,
  error,
  currentUserId,
  activeConversation,
  onConversationSelect,
  startConversation,
  unreadCounts = {}, // Default to empty object
  getOtherUser,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { results } = useSearch(searchTerm);

  const handleStart = async (userId) => {
    try {
      const { data } = await axios.post('/api/conversations', { participantId: userId });
      onConversationSelect(data);
      setSearchTerm('');
      setShowSearch(false);
    } catch (err) {
      console.error('Error starting conversation:', err);
      // Optional: Show toast/error UI
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-indigo-950 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Messages</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1 rounded-full hover:bg-indigo-700 transition-colors duration-200"
            aria-label="Toggle search"
          >
            <BsThreeDotsVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar 
        term={searchTerm} 
        setTerm={setSearchTerm} 
        show={showSearch} 
        toggle={() => setShowSearch(!showSearch)} 
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">{error}</div>
        ) : (
          <>
            {/* Search Results (if any) */}
            {showSearch && results.length > 0 && (
              <SearchResults results={results} onSelect={handleStart} />
            )}
            
            {/* Conversation List */}
            <ConversationList
              conversations={conversations}
              currentUserId={currentUserId}
              activeId={activeConversation?._id}
              onSelect={onConversationSelect}
              getOtherUser={getOtherUser}
              unreadCounts={unreadCounts} // Pass unread counts
            />
          </>
        )}
      </div>
    </div>
  );
};

Sidebar.defaultProps = {
  unreadCounts: {},
};

export default ReactMemo.memo(Sidebar); // Memoize to prevent unnecessary re-renders