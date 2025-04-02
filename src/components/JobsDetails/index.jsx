import React from 'react';
import { ColorRing } from 'react-loader-spinner';


const JobsDetails = ({ jobsData }) => {
    const { 
        id,
        title,
        description: jobDescription,
        company,
        location,
        salaryFrom,
        salaryTo,
        employmentType,
        applicationDeadline,
        qualifications,
        contact,
        jobCategory,
        isRemoteWork,
        numberOfOpening,
        createdAt,
        updatedAt,
        companyLogoUrl,
        rating,
        packagePerAnnum

    } = jobsData;
    return (
        <div className="job-details">
        <img src= alt="Company Logo" className="company-logo" />
        <h2>{title}</h2>
        <p><strong>Rating:</strong> {rating}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Package:</strong> {packagePerAnnum}</p>
        <p><strong>Employment Type:</strong> {employmentType}</p>
        <p><strong>Job Description:</strong> {jobDescription}</p>
        </div>
    );
}

export default JobsDetails;