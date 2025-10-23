// src/components/messages/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ConversationList from './ConversationList';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../hooks/useSearch';

const Sidebar = ({
  conversations,
  currentUserId,
  activeConversation,
  onConversationSelect,
  startConversation,
  getOtherUser,
   onlineUsers ,
  apiBaseUrl = 'http://localhost:5000',
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { results, loading: searchLoading, error: searchError } = useSearch(searchTerm, apiBaseUrl);

  const handleStartConversation = async (userId) => {
    await startConversation(userId);
    setSearchTerm('');
    setShowSearch(false);
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-190 rounded-l-md shadow-inner">
      <div className="p-3 bg-indigo-600 text-white flex justify-between items-center rounded-t-md">
        <h1 className="text-xl font-bold select-none">Messages</h1>
        <button
          onClick={() => setShowSearch(!showSearch)}
          aria-label="Toggle search"
          className="hover:bg-indigo-700 p-2 rounded-md transition"
        >
          🔍
        </button>
      </div>

      <SearchBar term={searchTerm} setTerm={setSearchTerm} show={showSearch} toggle={() => setShowSearch(!showSearch)} />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {showSearch ? (
          <>
            {searchLoading && <p className="p-4 text-center">Loading...</p>}
            {searchError && <p className="p-4 text-center text-red-500">{searchError}</p>}
            {!searchLoading && results.length === 0 && searchTerm && <p className="p-4 text-center text-gray-500">No users found.</p>}
            {results.length > 0 && <SearchResults results={results} onSelect={handleStartConversation} />}
          </>
        ) : (
          <ConversationList
            conversations={conversations}
            currentUserId={currentUserId}
            activeId={activeConversation?._id}
            onSelect={onConversationSelect}
            getOtherUser={getOtherUser}
            onlineUsers={onlineUsers}
            

          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
