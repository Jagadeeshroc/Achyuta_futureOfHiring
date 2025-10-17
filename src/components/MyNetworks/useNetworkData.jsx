// src/components/MyNetwork/useNetworkData.js
import { useState,  useMemo, useCallback } from "react";
import axios from "axios";

const useNetworkData = ({
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
}) => {
  const [connections, setConnections] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const fetchNetwork = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const [connRes, incomingRes, outgoingRes, recRes] = await Promise.all([
        axios.get("/api/connections", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/connections/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/connections/requests/outgoing", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/connections/recommended", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      console.log("Incoming requests:", incomingRes.data); // Debug log
      console.log("Outgoing requests:", outgoingRes.data); // Debug log
      
      setConnections(connRes.data || []);
      setIncomingRequests(incomingRes.data || []);
      setOutgoingRequests(outgoingRes.data || []);
      
      // Filter out users who are already connected or have pending requests
      const connectedUserIds = new Set();
      connRes.data.forEach(conn => {
        if (conn.requester._id === currentUserId) {
          connectedUserIds.add(conn.recipient._id);
        } else {
          connectedUserIds.add(conn.requester._id);
        }
      });
      
      const outgoingUserIds = new Set();
      outgoingRes.data.forEach(req => {
        outgoingUserIds.add(req.recipient._id);
      });

      const incomingUserIds = new Set();
      incomingRes.data.forEach(req => {
        incomingUserIds.add(req.requester._id);
      });
      
      const filteredRecommended = recRes.data.filter(user => 
        !connectedUserIds.has(user._id) && 
        !outgoingUserIds.has(user._id) &&
        !incomingUserIds.has(user._id)
      );

      setRecommended(
        filteredRecommended.map((user) => ({
          _id: user._id,
          name:
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            user.name ||
            "Unknown User",
          title: user.title || "",
          avatar: user.avatar || user.profilePic || null,
          status: "recommended",
          mutualConnections: Math.floor(Math.random() * 50) + 1,
          company: user.company || "",
          location: user.location || "",
        })) || []
      );
    } catch (err) {
      console.error("Error fetching network:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch network data. Please try again."
      );
      setConnections([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setRecommended([]);
    }
  }, [currentUserId, setError]);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    return avatar.startsWith("http")
      ? avatar
      : `${axios.defaults.baseURL}${avatar}`;
  };

  const openModal = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return null;
      }
      const res = await axios.get(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fullUser = res.data;
      return {
        _id: fullUser._id,
        name:
          `${fullUser.first_name || ""} ${fullUser.last_name || ""}`.trim() ||
          fullUser.name ||
          "Unknown User",
        title: fullUser.title || "",
        avatar: fullUser.avatar || fullUser.profilePic || null,
        bio: fullUser.bio || fullUser.details?.bio || "",
        skills: fullUser.skills || fullUser.details?.skills || [],
        email: fullUser.email || fullUser.details?.email || "",
        phone: fullUser.phone || fullUser.details?.phone || "",
        location: fullUser.location || fullUser.details?.location || "",
        company: fullUser.company || fullUser.details?.company || "",
      };
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.response?.data?.error || "Failed to fetch user details");
      return null;
    }
  };

  const handleConnect = async (userId) => {
    if (loadingRequests[userId]) {
      return; // Prevent multiple requests
    }
    try {
      setLoadingRequests((prev) => ({ ...prev, [userId]: true }));
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      await axios.post(`/api/connections/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from recommended and add to outgoing requests
      setRecommended(prev => prev.filter(user => user._id !== userId));
      
      // Fetch updated outgoing requests to get the complete request object
      const outgoingRes = await axios.get("/api/connections/requests/outgoing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutgoingRequests(outgoingRes.data || []);
      
    } catch (err) {
      console.error("Error connecting:", err);
      setError(err.response?.data?.error || "Failed to send connection request");
    } finally {
      setLoadingRequests((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      setLoadingRequests(prev => ({ ...prev, [requestId]: true }));
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      await axios.delete(`/api/connections/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove from outgoing requests
      setOutgoingRequests(prev => prev.filter(req => req._id !== requestId));
      
    } catch (err) {
      console.error("Error canceling request:", err);
      setError(err.response?.data?.error || "Failed to cancel request");
    } finally {
      setLoadingRequests(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      setLoadingRequests(prev => ({ ...prev, [requestId]: true }));
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      const endpoint =
        action === "accept"
          ? `/api/connections/${requestId}/accept`
          : `/api/connections/${requestId}/reject`;
          
      await axios.put(endpoint, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      // Remove from incoming requests
      setIncomingRequests(prev => prev.filter(req => req._id !== requestId));
      
      // If accepted, refresh connections
      if (action === "accept") {
        const connRes = await axios.get("/api/connections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(connRes.data || []);
      }
      
    } catch (err) {
      console.error("Error handling request:", err);
      setError(err.response?.data?.error || "Failed to process request");
    } finally {
      setLoadingRequests(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const getUserFromConnection = (connection) => {
    const userObj =
      connection.requester._id === currentUserId
        ? connection.recipient
        : connection.requester;
    return {
      _id: userObj._id,
      name:
        `${userObj.first_name || ""} ${userObj.last_name || ""}`.trim() ||
        userObj.name ||
        "Unknown User",
      title: userObj.title || "",
      avatar: userObj.avatar || userObj.profilePic || null,
      mutualConnections: Math.floor(Math.random() * 30) + 1,
      company: userObj.company || "",
      location: userObj.location || "",
    };
  };

  const getSentRequestUser = (request) => {
    return {
      _id: request._id, // Use request ID for cancellation
      userId: request.recipient._id, // Use user ID for modal
      name:
        `${request.recipient.first_name || ""} ${request.recipient.last_name || ""}`.trim() ||
        request.recipient.name ||
        "Unknown User",
      title: request.recipient.title || "",
      avatar: request.recipient.avatar || request.recipient.profilePic || null,
      mutualConnections: Math.floor(Math.random() * 30) + 1,
      company: request.recipient.company || "",
      location: request.recipient.location || "",
      status: "sent",
    };
  };

  const getIncomingRequestUser = (request) => {
    return {
      _id: request._id, // Use request ID for accept/reject
      userId: request.requester._id, // Use user ID for modal
      name:
        `${request.requester.first_name || ""} ${request.requester.last_name || ""}`.trim() ||
        request.requester.name ||
        "Unknown User",
      title: request.requester.title || "",
      avatar: request.requester.avatar || request.requester.profilePic || null,
      mutualConnections: Math.floor(Math.random() * 30) + 1,
      company: request.requester.company || "",
      location: request.requester.location || "",
      status: "request",
    };
  };

  // Filtered lists
  const filteredConnections = useMemo(() => 
    connections
      .map(getUserFromConnection)
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.company?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [connections, searchTerm, currentUserId]
  );

  const filteredRecommended = useMemo(() => 
    recommended.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [recommended, searchTerm]
  );

  const filteredIncomingRequests = useMemo(() => 
    incomingRequests.map(getIncomingRequestUser).filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [incomingRequests, searchTerm, currentUserId]
  );

  const filteredOutgoingRequests = useMemo(() => 
    outgoingRequests.map(getSentRequestUser).filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [outgoingRequests, searchTerm]
  );

  // Pagination calculations
  const indexOfLastConnection = currentPageConnections * usersPerPage;
  const currentConnections = useMemo(() => 
    filteredConnections.slice(
      indexOfLastConnection - usersPerPage,
      indexOfLastConnection
    ),
    [filteredConnections, currentPageConnections, usersPerPage]
  );
  const totalConnectionPages = useMemo(() => 
    Math.ceil(filteredConnections.length / usersPerPage),
    [filteredConnections.length, usersPerPage]
  );

  const indexOfLastRecommended = currentPageRecommended * usersPerPage;
  const currentRecommendedUsers = useMemo(() => 
    filteredRecommended.slice(
      indexOfLastRecommended - usersPerPage,
      indexOfLastRecommended
    ),
    [filteredRecommended, currentPageRecommended, usersPerPage]
  );
  const totalRecommendedPages = useMemo(() => 
    Math.ceil(filteredRecommended.length / usersPerPage),
    [filteredRecommended.length, usersPerPage]
  );

  const indexOfLastSentRequest = currentPageSentRequests * usersPerPage;
  const currentSentRequests = useMemo(() => 
    filteredOutgoingRequests.slice(
      indexOfLastSentRequest - usersPerPage,
      indexOfLastSentRequest
    ),
    [filteredOutgoingRequests, currentPageSentRequests, usersPerPage]
  );
  const totalSentRequestsPages = useMemo(() => 
    Math.ceil(filteredOutgoingRequests.length / usersPerPage),
    [filteredOutgoingRequests.length, usersPerPage]
  );

  const indexOfLastIncomingRequest = currentPageIncomingRequests * usersPerPage;
  const currentIncomingRequests = useMemo(() => 
    filteredIncomingRequests.slice(
      indexOfLastIncomingRequest - usersPerPage,
      indexOfLastIncomingRequest
    ),
    [filteredIncomingRequests, currentPageIncomingRequests, usersPerPage]
  );
  const totalIncomingRequestsPages = useMemo(() => 
    Math.ceil(filteredIncomingRequests.length / usersPerPage),
    [filteredIncomingRequests.length, usersPerPage]
  );

  return {
    connections,
    recommended,
    incomingRequests,
    outgoingRequests,
    fetchNetwork,
    getAvatarUrl,
    openModal,
    handleConnect,
    handleCancelRequest,
    handleRequest,
    getUserFromConnection,
    getSentRequestUser,
    getIncomingRequestUser,
    filteredConnections,
    filteredRecommended,
    filteredIncomingRequests,
    filteredOutgoingRequests,
    currentConnections,
    totalConnectionPages,
    currentRecommendedUsers,
    totalRecommendedPages,
    currentSentRequests,
    totalSentRequestsPages,
    currentIncomingRequests,
    totalIncomingRequestsPages,
  };
};

export default useNetworkData;