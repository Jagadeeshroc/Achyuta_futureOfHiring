import { useState } from 'react';
import { FiSettings, FiUser, FiBell, FiMoon, FiSun, FiLock, FiHelpCircle, FiMail, FiLogOut } from 'react-icons/fi';
import './settings.css'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
    const navigate = useNavigate(); // Added this hook

 const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Now properly using the navigate function
  };

  return (
    
    <div className={`settings-container ${darkMode ? 'dark-mode' : ''}`}>
      
      <div className="settings-sidebar">
        <div className="sidebar-header">
          <FiSettings className="settings-icon" />
          <h2 className='k1'>Settings</h2>
        </div>
        
        <ul className="settings-menu">
          <li 
            className={activeTab === 'general' ? 'active' : ''} 
            onClick={() => setActiveTab('general')}
          >
            <FiSettings /> General
          </li>
          <li 
            className={activeTab === 'account' ? 'active' : ''} 
            onClick={() => setActiveTab('account')}
          >
            <FiUser /> Account
          </li>
          <li 
            className={activeTab === 'notifications' ? 'active' : ''} 
            onClick={() => setActiveTab('notifications')}
          >
            <FiBell /> Notifications
          </li>
          <li 
            className={activeTab === 'privacy' ? 'active' : ''} 
            onClick={() => setActiveTab('privacy')}
          >
            <FiLock /> Privacy
          </li>
          <li 
            className={activeTab === 'help' ? 'active' : ''} 
            onClick={() => setActiveTab('help')}
          >
            <FiHelpCircle /> Help & Support
          </li>
        </ul>
        
        <div className="sidebar-footer">
            <div className="logout-btn">
            
            <button  onClick={handleLogout} className="btnLog">
            <FiLogOut /> Logout
            </button>
            </div>
        
        </div>
      </div>
      
      <div className="settings-content">
        {activeTab === 'general' && (
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="setting-item">
              <div className="setting-info">
                <FiMoon className="setting-icon" />
                <div>
                  <h4>Dark Mode</h4>
                  <p>Switch between light and dark theme</p>
                </div>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <FiMail className="setting-icon" />
                <div>
                  <h4>Email Updates</h4>
                  <p>Receive product updates and newsletters</p>
                </div>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={emailUpdates} 
                  onChange={() => setEmailUpdates(!emailUpdates)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        )}
        
        {activeTab === 'account' && (
          <div className="settings-section">
            <h3>Account Settings</h3>
            <div className="account-info">
              <div className="avatar">U</div>
              <div className="user-details">
                <h4>User Name</h4>
                <p>user@example.com</p>
              </div>
            </div>
            
            <form className="account-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h3>Notification Settings</h3>
            <div className="setting-item">
              <div className="setting-info">
                <FiBell className="setting-icon" />
                <div>
                  <h4>Push Notifications</h4>
                  <p>Receive notifications on this device</p>
                </div>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={() => setNotifications(!notifications)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="notification-types">
              <h4>Notification Types</h4>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" checked /> Messages
                </label>
                <label>
                  <input type="checkbox" checked /> Reminders
                </label>
                <label>
                  <input type="checkbox" /> Promotions
                </label>
                <label>
                  <input type="checkbox" checked /> System Updates
                </label>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'privacy' && (
          <div className="settings-section">
            <h3>Privacy Settings</h3>
            <div className="setting-item">
              <div className="setting-info">
                <FiLock className="setting-icon" />
                <div>
                  <h4>Private Account</h4>
                  <p>Make your account private</p>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="privacy-options">
              <h4>Data Sharing</h4>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" /> Share usage data
                </label>
                <label>
                  <input type="checkbox" checked /> Personalized ads
                </label>
                <label>
                  <input type="checkbox" checked /> Improve product suggestions
                </label>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'help' && (
          <div className="settings-section">
            <h3 className='h1'>Help & Support</h3>
            <div className="help-options">
                
                   <div className="help-card">
                   <div className='help-card1'>
                    <FiHelpCircle className="help-icon" />
                    <h4>FAQs</h4>
                </div>
                <p>Find answers to common questions</p>
                <button className="help-btn">Browse FAQs</button>
              </div>
              <div className="help-card">
              <div className="help-card2">
                <FiMail className="help-icon" />
                <h4>Contact Us</h4>
                </div>
              
                <p>Reach out to our support team</p>
                
                
                <button className="help-btn">Send Message</button>
              </div>
            </div>
            
            <div className="feedback-section">
                
              <h4 className='j2'>Send Feedback</h4>
              <div className='j1'>
              <p>Your feedback helps us improve our services</p>
              </div>
              <div className='j4'> 
              <textarea placeholder="Share your thoughts..." className='f1'></textarea>
              <button className="feedback-btn">Submit Feedback</button>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;