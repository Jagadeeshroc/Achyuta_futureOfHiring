// src/components/messages/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ConversationList from './ConversationList';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSearch } from '../../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({
  conversations,
  loading,
  error,
  currentUserId,
  activeConversation,
  onConversationSelect,
  startConversation,
  unreadCounts = {},
  getOtherUser,
  apiBaseUrl = 'http://localhost:5000',
}) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { results, loading: searchLoading, error: searchError } = useSearch(searchTerm, apiBaseUrl);

  const handleStart = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await startConversation(userId);
      setSearchTerm('');
      setShowSearch(false);
    } catch (err) {
      console.error('Error starting conversation:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
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

      <SearchBar
        term={searchTerm}
        setTerm={setSearchTerm}
        show={showSearch}
        toggle={() => setShowSearch(!showSearch)}
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">{error}</div>
        ) : (
          <>
            {showSearch && (
              <>
                {searchLoading && (
                  <div className="p-4 text-center">
                    <LoadingSpinner />
                  </div>
                )}
                {searchError && (
                  <div className="p-4 text-red-500 text-center">{searchError}</div>
                )}
                {!searchLoading && !searchError && results.length === 0 && searchTerm && (
                  <div className="p-4 text-gray-500 text-center">No users found</div>
                )}
                {results.length > 0 && (
                  <SearchResults results={results} onSelect={handleStart} />
                )}
              </>
            )}
            <ConversationList
              conversations={conversations}
              currentUserId={currentUserId}
              activeId={activeConversation?._id}
              onSelect={onConversationSelect}
              getOtherUser={getOtherUser}
              unreadCounts={unreadCounts}
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

export default React.memo(Sidebar);