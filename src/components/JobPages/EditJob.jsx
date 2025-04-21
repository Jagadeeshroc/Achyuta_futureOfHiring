import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    status: 'applied'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`https://backend-achyutanew.onrender.com/jobs/${id}`);
        setJob(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch job');
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://backend-achyutanew.onrender.com/jobs/${id}`, job);
      navigate('/jobs', { state: { message: 'Job updated successfully!' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update job');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`https://backend-achyutanew.onrender.com/jobs/${id}`);
        navigate('/jobs', { state: { message: 'Job deleted successfully!' } });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete job');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="job-edit-container">
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={job.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={job.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={job.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Requirements</label>
          <input
            type="text"
            name="requirements"
            value={job.requirements}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Salary</label>
          <input
            type="text"
            name="salary"
            value={job.salary}
            onChange={handleChange}
          />
        </div>
        

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={job.status}
            onChange={handleChange}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Update Job
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete Job
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/jobs')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobEdit;