import React, { useState } from "react";
import { 
  FaBell, 
  FaEnvelope, 
  FaThumbsUp, 
  FaUserPlus, 
  FaComment,
  FaHome,
  FaUserFriends,
  FaBookmark,
  FaCog,
  FaSearch,
  FaCheck
} from "react-icons/fa";
import { LuBadgePlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import './index.css';

const Notifications = () => {
  const initialNotifications = [
    {
      id: 1,
      type: "connection",
      message: "John Doe wants to connect with you",
      time: "2 hours ago",
      icon: <FaUserPlus className="notification-icon connection" />,
      read: false
    },
    {
      id: 2,
      type: "like",
      message: "Jane Smith liked your post",
      time: "5 hours ago",
      icon: <FaThumbsUp className="notification-icon like" />,
      read: false
    },
    {
      id: 3,
      type: "message",
      message: "New message from Alex Johnson",
      time: "1 day ago",
      icon: <FaEnvelope className="notification-icon message" />,
      read: true
    },
    {
      id: 4,
      type: "comment",
      message: "Mike Brown commented on your post",
      time: "2 days ago",
      icon: <FaComment className="notification-icon comment" />,
      read: true
    },
    {
      id: 5,
      type: "like",
      message: "Sarah Williams liked your comment",
      time: "3 days ago",
      icon: <FaThumbsUp className="notification-icon like" />,
      read: true
    },
    {
      id: 6,
      type: "connection",
      message: "David Miller accepted your connection request",
      time: "1 week ago",
      icon: <FaUserPlus className="notification-icon connection" />,
      read: true
    }
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "messages") return notification.type === "message";
    if (activeTab === "connections") return notification.type === "connection";
    return true;
  });

  return (
    <div className="notifications-app">
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-menu">
          <div className="menu-item">
            <FaBell className="menu-icon" />
            <span>Notifications</span>
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>
          <div className="menu-item">
            <FaEnvelope className="menu-icon" />
            <span><Link to='/messages'>Messages</Link></span>
            
          </div>
          <div className="menu-item">
            <FaBookmark className="menu-icon" />
            <span><Link to='/Bookmarks'>Bookmarks</Link></span>
          </div>
          <div className="menu-item">
          <LuBadgePlus className="menu-icon" />

            <span><Link to='/connections'>Connections</Link></span>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="menu-item">
            <FaCog className="menu-icon" />
            <span>
              <Link to='/settings'>Settings
              </Link></span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="notifications-container">
          <div className="notifications-header">
            <div className="header-left">
              <FaBell className="header-icon" />
              <h1>Notifications</h1>
             
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
              Messages
            </button>
            <button 
              className={`tab ${activeTab === "connections" ? "active" : ""}`}
              onClick={() => setActiveTab("connections")}
            >
              Connections
            </button>
          </div>

          <div className="notifications-list">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                >
                  <div className="notification-icon-container">
                    {notification.icon}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-time">{notification.time}</p>
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
    </div>
    </div>
  );
};

export default Notifications;