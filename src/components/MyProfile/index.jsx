import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaCommentAlt, FaBullseye, FaChartLine, FaCog, FaBell, FaTimes } from "react-icons/fa";
import "./index.css"

const MyProfile = () => {
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const openImagePopup = () => {
    setIsImagePopupOpen(true);
  };

  const closeImagePopup = () => {
    setIsImagePopupOpen(false);
  };

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
          <Link to="/goal" className="sidebar-item">
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
                src="https://media-hosting.imagekit.io//b66601905e134787/AChyuta.png?Expires=1837053793&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=NUMYiJKUd6n5r0NFviaEYAEeSN2n5km7VB1~qQppAyi~zOJpDZDsOpLcdlBlaD6fskIsbn-rFdI3JPUJoR8lfggtUtum2bn~B2iwkU~YHmvCURnna34ZCRG8D7zv3LKIj7rzYvw4e7eo272AbZA198~k2qqgtxPE5HzGtiUibgKQSwqxm~-~DqHxLP1EcshWKnu0qUgPNh-1UPHKmm~whGoviFpBFRjjJLdKjYxNBTtdIrZmtHs-2J2KeM8Sffwy-JuDc6FUT7YW1Qo3wEja3gjzeb69GW89MeAt2ZNTRYYDeixb5kPgx~Hez-nPpSFKqDnquO6ebmQdbzMZ4xuzrA__"
                alt="Profile"
                className="profile-image"
                onClick={openImagePopup}
                style={{ cursor: "pointer" }}
              />
              <div className="profile-text">
                <h1>ROCKY</h1>
                <p className="profile-title">Web Developer | React Enthusiast</p>
                <p className="profile-location">Ananthapur, India</p>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <h3>About</h3>
                <p>Passionate web developer with expertise in React, JavaScript, and modern web technologies.</p>
              </div>

              <div className="detail-section">
                <h3>Contact</h3>
                <p>jagadeeshvanganooru@gmail.com</p>
                <p>+91 994956577</p>
              </div>

              <div className="detail-section">
                <h3>Skills</h3>
                <div className="skills-container">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">HTML5</span>
                  <span className="skill-tag">CSS3</span>
                  <span className="skill-tag">Redux</span>
                  <span className="skill-tag">Node.js</span>
                </div>
              </div>

              <Link to="/FullDetails" className="view-more-btn">
                View Full Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup Modal */}
      {isImagePopupOpen && (
        <div className="image-popup-overlay" onClick={closeImagePopup}>
          <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup-btn" onClick={closeImagePopup}>
              <FaTimes />
            </button>
            <img
              src="https://media-hosting.imagekit.io//b66601905e134787/AChyuta.png?Expires=1837053793&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=NUMYiJKUd6n5r0NFviaEYAEeSN2n5km7VB1~qQppAyi~zOJpDZDsOpLcdlBlaD6fskIsbn-rFdI3JPUJoR8lfggtUtum2bn~B2iwkU~YHmvCURnna34ZCRG8D7zv3LKIj7rzYvw4e7eo272AbZA198~k2qqgtxPE5HzGtiUibgKQSwqxm~-~DqHxLP1EcshWKnu0qUgPNh-1UPHKmm~whGoviFpBFRjjJLdKjYxNBTtdIrZmtHs-2J2KeM8Sffwy-JuDc6FUT7YW1Qo3wEja3gjzeb69GW89MeAt2ZNTRYYDeixb5kPgx~Hez-nPpSFKqDnquO6ebmQdbzMZ4xuzrA__"
              alt="Profile"
              className="popup-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;