import React, { useState, useEffect } from "react";
import { 
  FaBell, FaEnvelope, FaThumbsUp, FaUserPlus, FaComment,
  FaCheck, FaTimes
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import './index.css';

axios.defaults.baseURL = 'http://localhost:5000';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const socket = useSocket();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchNotifications();

    // Socket listener for new notifications
    if (socket) {
      socket.on('newNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newNotification');
      }
    };
  }, [socket]);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "messages") return notification.type === "message";
    if (activeTab === "connections") return notification.type === "connection";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'connection': return <FaUserPlus className="notification-icon connection" />;
      case 'message': return <FaEnvelope className="notification-icon message" />;
      case 'like': return <FaThumbsUp className="notification-icon like" />;
      case 'comment': return <FaComment className="notification-icon comment" />;
      default: return <FaBell className="notification-icon" />;
    }
  };

  return (
    <div className="notifications-app">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="header-left">
            <FaBell className="header-icon" />
            <h1>Notifications</h1>
            {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                <FaCheck /> Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="notifications-tabs">
          <button 
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button 
            className={`tab ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            <Link to='/messages' className="no-underline!">
            Messages
            </Link>
          </button>
          <button 
            className={`tab ${activeTab === "connections" ? "active" : ""}`}
            onClick={() => setActiveTab("connections")}
          >
             <Link to='/myNetworks' className="no-underline!">
            Connections
            </Link>
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.read ? '' : 'unread'}`}
                onClick={() => markAsRead(notification._id)}
              >
                <div className="notification-icon-container">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.content}</p>
                  <p className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && <div className="unread-dot"></div>}
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;