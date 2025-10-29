import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { motion } from 'framer-motion';
import { FiSave, FiTrash2, FiX, FiBriefcase, FiMapPin, FiDollarSign, FiFileText, FiAward } from 'react-icons/fi';
import './EditJob.css'; // Custom CSS for additional styling

const JobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    type: 'Full-time',
    salary: '',
    skillsRequired: [],
    experienceRequired: 'Entry-level',
    deadline: '',
    status: 'Open'
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob({
          ...response.data,
          deadline: response.data.deadline ? new Date(response.data.deadline).toISOString().split('T')[0] : ''
        });
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

  const handleSkillAdd = () => {
    if (currentSkill.trim() && !job.skillsRequired.includes(currentSkill.trim())) {
      setJob(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setJob(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to update this job');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, job, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Job updated successfully!');
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update job');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to delete this job');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Job deleted successfully!');
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete job');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="job-edit-container"
    >
      <div className="job-edit-header">
        <h1>Edit Job Posting</h1>
        <div className="3d-model-container">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Box args={[2, 1, 1]} rotation={[0.5, 0.5, 0]}>
              <meshStandardMaterial color="#4f46e5" />
            </Box>
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="alert alert-error"
        >
          {error}
          <button onClick={() => setError(null)} className="alert-close">
            <FiX />
          </button>
        </motion.div>
      )}

      {success && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="alert alert-success"
        >
          {success}
        </motion.div>
      )}

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="job-edit-form"
      >
        <div className="form-grid">
          <div className="form-group">
            <label>
              <FiBriefcase className="input-icon" />
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={job.title}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>
              <FiBriefcase className="input-icon" />
              Company
            </label>
            <input
              type="text"
              name="company"
              value={job.company}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>
              <FiMapPin className="input-icon" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={job.location}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>
              <FiBriefcase className="input-icon" />
              Job Type
            </label>
            <select
              name="type"
              value={job.type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <FiDollarSign className="input-icon" />
              Salary
            </label>
            <input
              type="text"
              name="salary"
              value={job.salary}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. $50,000 - $70,000"
            />
          </div>

          <div className="form-group">
            <label>
              <FiAward className="input-icon" />
              Experience Level
            </label>
            <select
              name="experienceRequired"
              value={job.experienceRequired}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <FiFileText className="input-icon" />
              Description
            </label>
            <textarea
              name="description"
              value={job.description}
              onChange={handleChange}
              rows="5"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiAward className="input-icon" />
              Skills Required
            </label>
            <div className="skills-input-container">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                className="input-field"
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd()}
              />
              <button 
                type="button" 
                onClick={handleSkillAdd}
                className="add-skill-btn"
              >
                Add
              </button>
            </div>
            <div className="skills-tags">
              {job.skillsRequired.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="skill-tag"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleSkillRemove(skill)}
                    className="skill-remove"
                  >
                    <FiX size={12} />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={job.deadline}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={job.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <motion.button 
            type="submit" 
            className="btn btn-save"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSave /> Update Job
          </motion.button>
          
          <motion.button
            type="button"
            className="btn btn-delete"
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTrash2 /> Delete Job
          </motion.button>
          
          <motion.button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate('/jobs')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiX /> Cancel
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default JobEdit;