import React, { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import './index.css';

const MyNetwork = () => {
  const [connections, setConnections] = useState([]); // ✅ Already connected
  const [recommended, setRecommended] = useState([]); // ✅ Not yet connected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const token = localStorage.getItem('token');

        // ✅ Get connected users
        const connRes = await axios.get('/api/connections', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(connRes.data);

        // ✅ Get recommended users
        const recRes = await axios.get('/api/users/recommended', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecommended(recRes.data);

      } catch (err) {
        console.error('Error fetching network:', err);
      }
    };
    fetchNetwork();
  }, []);

  const handleConnect = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/connections',
        { targetUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Move user from recommended to connections
      const newConnection = recommended.find(user => user._id === userId);
      if (newConnection) {
        setConnections(prev => [...prev, newConnection]);
        setRecommended(prev => prev.filter(user => user._id !== userId));
        alert(`${newConnection.name} has been sent a connection request!`);
      }

    } catch (err) {
      console.error('Error connecting:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // ✅ Filter both lists
  const filteredConnections = connections.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.title?.toLowerCase().includes(searchTerm)
  );

  const filteredRecommended = recommended.filter(user =>
    user.name.toLowerCase().includes(searchTerm) ||
    user.title?.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="network-container">
      <div className="network-header">
        <h1>My Network</h1>
        <div className="network-search">
          <input
            type="text"
            placeholder="Search connections and people..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="connections-list">
        <h2>Your Connections ({filteredConnections.length})</h2>
        <div className="connection-cards">
          {filteredConnections.length === 0 && <p>No connections found.</p>}
          {filteredConnections.map(user => (
            <div key={user._id} className="connection-card">
              <img src={user.avatar} alt={user.name} className="connection-avatar" />
              <div className="connection-info">
                <h3>{user.name}</h3>
                <p>{user.title}</p>
              </div>
              <button className="connect-button" disabled>Connected</button>
            </div>
          ))}
        </div>
      </div>

      <div className="connections-list">
        <h2>Recommended Connections ({filteredRecommended.length})</h2>
        <div className="connection-cards">
          {filteredRecommended.length === 0 && <p>No recommendations found.</p>}
          {filteredRecommended.map(user => (
            <div key={user._id} className="connection-card">
              <img src={user.avatar} alt={user.name} className="connection-avatar" />
              <div className="connection-info">
                <h3>{user.name}</h3>
                <p>{user.title}</p>
              </div>
              <button
                className="connect-button"
                onClick={() => handleConnect(user._id)}
              >
                <FaUserPlus className="connect-icon" />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;
