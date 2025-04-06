import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import JobList from "./JobList";
import './Dashboard.css';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs');
        // Ensure each job has a type property with a default value
        const jobsWithDefaults = response.data.map(job => ({
          ...job,
          type: job.type || 'Full-time' // Default value if type is missing
        }));
        setJobs(jobsWithDefaults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`http://localhost:5000/jobs/${id}`);
        setJobs(jobs.filter(job => job.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Job Dashboard</h1>
        <div className="action-buttons">
          <Link to='/Hiring' className="btn btn-primary">
            <span className="btn-icon">+</span> Add Job
          </Link>
          <Link to='/messages' className="btn btn-secondary">
            <span className="btn-icon">💬</span> Messages
          </Link>
        </div>
      </header>

      <div className="jobs-section">
        <h2 className="section-title">Available Jobs</h2>
        <p className="job-count">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available</p>
        
        <JobList jobs={jobs} onDelete={handleDelete} />
      </div>
    </div>
  );
}