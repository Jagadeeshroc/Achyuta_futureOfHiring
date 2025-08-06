import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobList from './JobList';
import './Dashboard.css';
import Loader from "../Loader";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/');
      const jobsWithType = res.data.map(job => ({
        ...job,
        type: job.type || 'Full-time',
      }));
      setJobs(jobsWithType);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job with token
  const handleDelete = async (jobId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to delete a job.');
      navigate('/login');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log("Deleting job at:", `/api/jobs/${jobId}`);

      setJobs(jobs.filter(job => job._id !== jobId));
      alert("Job deleted successfully!");

    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-load">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Job Dashboard</h1>
        <div className="action-buttons">
          <Link to="/Hiring" className="btn btn-primary">
            + Add Job
          </Link>
          <Link to="/messages" className="btn btn-secondary">
            💬 Messages
          </Link>
        </div>
      </header>

      <div className="jobs-section">
        <h2>Available Jobs</h2>
        <p>{jobs.length} job{jobs.length !== 1 && 's'} available</p>

        <JobList jobs={jobs} onDelete={handleDelete} />
      </div>
    </div>
  );
}