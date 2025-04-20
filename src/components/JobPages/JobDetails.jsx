import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './JobDetails.css';
import React from 'react';
import JobReviews from './JobReviews'; 
export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')); // Get user if authenticated

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobRes = await axios.get(`https://backend-achyutanew.onrender.com/jobs/${id}`);
        setJob(jobRes.data);
      } catch (err) {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <div className="job-details-container">Loading...</div>;
  if (error) return <div className="job-details-container error">{error}</div>;

  return (
    <div className="job-details-container">
      <div className="job-header">
        <h2>{job.title}</h2>
        <h3>Company: {job.company}</h3>
        <p className="location">{job.location}</p>
        <p className="salary">Salary: {job.salary || 'Not specified'}</p>
      </div>

      <div className="job-description">
        <h4>Description</h4>
        <p>{job.description}</p>
      </div>

      <div className="job-requirements">
        <h4>Requirements</h4>
        <p className="jobRequire">{job.requirements}</p>
      </div>

      {/* Inject the review component and pass props */}
      <JobReviews jobId={id} user={user} />
    </div>
  );
}
