import React, { useState, useEffect } from "react";
import {
  FaUserFriends,
  FaUserCheck,
  FaClock,
  FaUserPlus,
  FaExclamationTriangle
} from "react-icons/fa";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import useNetworkData from "./useNetworkData";
import UserCard from "./UserCard";
import Pagination from "./Pagination";
import NetworkStats from "./NetworkStats";
import TabNavigation from "./TabNavigation";
import UserDetailModal from "./UserDetailModal";


axios.defaults.baseURL = "http://localhost:5000";

const MyNetwork = () => {
  const [searchTerm, ] = useState("");
  const [currentPageRecommended, setCurrentPageRecommended] = useState(1);
  const [currentPageConnections, setCurrentPageConnections] = useState(1);
  const [currentPageSentRequests, setCurrentPageSentRequests] = useState(1);
  const [currentPageIncomingRequests, setCurrentPageIncomingRequests] = useState(1);
  const [usersPerPage] = useState(8);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState({});
  const [activeTab, setActiveTab] = useState("connections");
  const socket = useSocket();

  const currentUserId = localStorage.getItem("userId");

  const {
   
    incomingRequests,
    outgoingRequests,
    fetchNetwork,
    getAvatarUrl,
    openModal,
    handleConnect,
    handleCancelRequest,
    handleRequest,
    
    filteredConnections,
    filteredRecommended,
    
    
    currentConnections,
    totalConnectionPages,
    currentRecommendedUsers,
    totalRecommendedPages,
    currentSentRequests,
    totalSentRequestsPages,
    currentIncomingRequests,
    totalIncomingRequestsPages,
  } = useNetworkData({
    currentUserId,
    searchTerm,
    usersPerPage,
    currentPageConnections,
    currentPageRecommended,
    currentPageSentRequests,
    currentPageIncomingRequests,
    loadingRequests,
    setLoadingRequests,
    setError,
  });

  useEffect(() => {
    fetchNetwork();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (notification) => {
        if (
          ["connection_request", "connection_accepted", "connection_rejected"].includes(
            notification.type
          )
        ) {
          fetchNetwork();
        }
      });
    }

    return () => {
      if (socket) socket.off("newNotification");
    };
  }, [socket, fetchNetwork]);

  useEffect(() => {
    setCurrentPageRecommended(1);
    setCurrentPageConnections(1);
    setCurrentPageSentRequests(1);
    setCurrentPageIncomingRequests(1);
  }, [searchTerm, activeTab]);

  const handleOpenUserModal = async (userId) => {
    if (!userId) return;
    const user = await openModal(userId);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "connections":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
              {currentConnections.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FaUserFriends className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No connections found</p>
                  <p className="text-gray-400">Start building your network by connecting with others</p>
                </div>
              ) : (
                currentConnections.map((user) => (
                  <div key={user._id} onClick={() => handleOpenUserModal(user._id)} className="cursor-pointer">
                    <UserCard
                      user={user} 
                      type="connected"
                      getAvatarUrl={getAvatarUrl}
                    />
                  </div>
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPageConnections}
              totalPages={totalConnectionPages}
              onPageChange={setCurrentPageConnections}
            />
          </>
        );
      
      case "recommended":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentRecommendedUsers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FaUserCheck className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No recommendations available</p>
                  <p className="text-gray-400">We'll suggest connections based on your profile and network</p>
                </div>
              ) : (
                currentRecommendedUsers.map((user) => (
                  <div key={user._id} onClick={() => handleOpenUserModal(user._id)} className="cursor-pointer">
                    <UserCard 
                      user={user} 
                      type="recommended"
                      onAction={handleConnect}
                      getAvatarUrl={getAvatarUrl}
                    />
                  </div>
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPageRecommended}
              totalPages={totalRecommendedPages}
              onPageChange={setCurrentPageRecommended}
            />
          </>
        );
      
      case "requests":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentIncomingRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No pending requests</p>
                  <p className="text-gray-400">Connection requests from others will appear here</p>
                </div>
              ) : (
                currentIncomingRequests.map((user) => (
                  <div key={user._id} onClick={() => handleOpenUserModal(user.userId)} className="cursor-pointer">
                    <UserCard 
                      user={user}
                      type="request"
                      onAction={handleRequest}
                      getAvatarUrl={getAvatarUrl}
                    />
                  </div>
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPageIncomingRequests}
              totalPages={totalIncomingRequestsPages}
              onPageChange={setCurrentPageIncomingRequests}
            />
          </>
        );
      
      case "sent":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentSentRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FaUserPlus className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No sent requests</p>
                  <p className="text-gray-400">Your connection requests will appear here</p>
                </div>
              ) : (
                currentSentRequests.map((user) => (
                  <div key={user._id} onClick={() => handleOpenUserModal(user.userId)} className="cursor-pointer">
                    <UserCard 
                      user={user}
                      type="sent"
                      onCancel={handleCancelRequest}
                      getAvatarUrl={getAvatarUrl}
                    />
                  </div>
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPageSentRequests}
              totalPages={totalSentRequestsPages}
              onPageChange={setCurrentPageSentRequests}
            />
          </>
        );
      
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-purple-400 to-indigo-200 p-4">
        <div className="bg-white rounded-3xl shadow-2xl   w-full text-center">
          <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 py-8 px-4">
      <div className="p-3!">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Network
          </h1>
        </div>

        {/* Stats Cards */}
        <NetworkStats
          connectionsCount={filteredConnections.length}
          recommendationsCount={filteredRecommended.length}
          pendingCount={incomingRequests.length}
          sentCount={outgoingRequests.length}
        />

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{
            connections: filteredConnections.length,
            recommended: filteredRecommended.length,
            requests: incomingRequests.length,
            sent: outgoingRequests.length,
          }}
        />

        {/* Content */}
        {renderContent()}

        {/* User Detail Modal */}
        <UserDetailModal
          isOpen={isModalOpen}
          user={selectedUser}
          onClose={closeModal}
          getAvatarUrl={getAvatarUrl}
        />
      </div>
    </div>
  );
};

export default MyNetwork;