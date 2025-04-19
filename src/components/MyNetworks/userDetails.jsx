import React from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

const UserDetails = () => {
  const { userId } = useParams();
  const user = connections.find(u => u.id === parseInt(userId));

  if (!user) {
    return <div className="user-not-found">User not found</div>;
  }

  return (
    <div className="user-detail-container">
      <div className="user-header">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>{user.title}</p>
        </div>
      </div>
      
      <div className="user-details">
        <h3>About</h3>
        <p>{user.details?.bio || "No bio available"}</p>
        
        <h3>Skills</h3>
        <div className="skills-list">
          {user.details?.skills?.length > 0 ? (
            user.details.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))
          ) : (
            <p>No skills listed</p>
          )}
        </div>
        
        <h3>Contact Information</h3>
        <p>Email: {user.details?.email || "Not provided"}</p>
        <p>Phone: {user.details?.phone || "Not provided"}</p>
        
        <button 
          className="back-button"
          onClick={() => window.history.back()}
        >
          Back to Network
        </button>
      </div>
    </div>
  );
};

export default UserDetails;