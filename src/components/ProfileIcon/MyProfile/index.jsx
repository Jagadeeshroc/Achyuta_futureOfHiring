
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCommentAlt, FaBullseye, FaChartLine, FaCog, FaBell, FaTimes } from "react-icons/fa";
import axios from "axios";
import "./index.css";

const MyProfile = () => {
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) throw new Error('Authentication data missing');

        let userId = null;
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser._id || parsedUser.id;
        } catch {
          throw new Error('Invalid user data in localStorage');
        }

        if (!userId) throw new Error('User ID missing');

        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data) throw new Error('Invalid user data received');

        const currentUser = response.data;

        const normalizedUser = {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
          title: currentUser.headline || currentUser.title,
          location: currentUser.location,
          about: currentUser.about,
          phone: currentUser.phone,
          skills: currentUser.skills , // Use the skills from API response
          socialLinks: currentUser.socialLinks || {},
          experience: currentUser.experience || [],
          education: currentUser.education || []
        };

        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const openImagePopup = () => setIsImagePopupOpen(true);
  const closeImagePopup = () => setIsImagePopupOpen(false);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h3 className="text-red-600 text-xl font-semibold">Error loading profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <p className="mt-2 text-sm">
            Or <Link to="/login" className="text-blue-500 underline">login again</Link>
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h3 className="text-gray-800 text-xl">No profile data available</h3>
          <Link to="/login" className="text-blue-500 underline mt-2">Please login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <Link to="/feedback" className="sidebar-item">
            <FaCommentAlt className="sidebar-icon" />
            <span>Feedback</span>
          </Link>
          <Link to="/goals" className="sidebar-item">
            <FaBullseye className="sidebar-icon" />
            <span>Goals</span>
          </Link>
          <Link to="/grow" className="sidebar-item">
            <FaChartLine className="sidebar-icon" />
            <span>Grow</span>
          </Link>
          <Link to="/reviews" className="sidebar-item">
            <FaCommentAlt className="sidebar-icon" />
            <span>Reviews</span>
          </Link>
          <Link to="/settings" className="sidebar-item">
            <FaCog className="sidebar-icon" />
            <span>Settings</span>
          </Link>
          <Link to="/updates" className="sidebar-item">
            <FaBell className="sidebar-icon" />
            <span>Updates</span>
          </Link>
        </div>

        <div className="profile-main">
          <div className="profile-card">
            <div className="profile-info">
              <img
                src={`http://localhost:5000${user.avatar}`}
                alt="Profile"
                className="fullProfile-image"
                onClick={openImagePopup}
                style={{ cursor: "pointer" }}
                onError={(e) => (e.target.src = 'src/assets/images/default-profile.png')}
              />
              <div className="profile-text">
                <h1>{user.name}</h1>
                <p className="profile-title">{user.title}</p>
                <p className="profile-location">{user.location}</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <h3>About</h3>
                <p>{user.about}</p>
              </div>

              <div className="detail-section">
                <h3>Contact</h3>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>

              <div className="detail-section">
                <h3>Skills</h3>
               <div className="skills-container">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="skill-tag"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">{user.skills}</p>
                )}
              </div>
              </div>

              <Link to={`/FullDetails/${user._id}`} className="view-more-btn">
                View Full Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isImagePopupOpen && (
        <div className="image-popup-overlay" onClick={closeImagePopup}>
          <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup-btn" onClick={closeImagePopup}>
              <FaTimes />
            </button>
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="Profile"
              className="popup-image"
              onError={(e) => (e.target.src = 'src/assets/images/default-profile-large.png')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;