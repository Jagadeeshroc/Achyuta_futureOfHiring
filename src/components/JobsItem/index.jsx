import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const JobsDetails = ({ jobsData }) => {
  const applyJob = () => {
    alert("Applied Successfully!");
  };

  const { 
    id,
    title,
    description: jobDescription,
    location,
    packagePerAnnum,
    employmentType,
    companyLogoUrl,
    rating
  } = jobsData;

  return (
    <Link to={`/jobs/${id}`} className="job-item-link">
      <div className="job-item-card">
        <div className="job-header">
          <img src={companyLogoUrl} alt="Company Logo" className="company-logo" />
          <div className="job-title-container">
            <h3 className="job-title">{title}</h3>
            <div className="job-rating">
              <FaStar className="rating-icon" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
        
        <div className="job-details">
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{location}</span>
          </div>
          <div className="detail-item">
            <FaMoneyBillWave className="detail-icon" />
            <span>{packagePerAnnum}</span>
          </div>
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <span>{employmentType}</span>
          </div>
        </div>
        
        <div className="job-description">
          <h4>Description:</h4>
          <p>{jobDescription}</p>
        </div>
        
        <button className="apply-button" onClick={applyJob}>Apply</button>
      </div>
    </Link>
  );
};

export default JobsDetails;
