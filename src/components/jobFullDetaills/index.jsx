import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch job details using the ID
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`https://jsonfakery.com/jobs/${id}`);
        const data = await response.json();
        setJob(data.job);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="job-detail-page">
      <h1>{job.title}</h1>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salaryFrom} - {job.salaryTo}</p>
      <p><strong>Employment Type:</strong> {job.employmentType}</p>
      <p><strong>Application Deadline:</strong> {job.applicationDeadline}</p>
      <p><strong>Qualifications:</strong> {job.qualifications}</p>
      <p><strong>Contact:</strong> {job.contact}</p>
      <p><strong>Job Description:</strong> {job.description}</p>
    </div>
  );
};

export default JobDetailPage;
