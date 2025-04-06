import { Link } from 'react-router-dom';
import './JobList.css';

export default function JobList({ jobs, onDelete }) {
  // Safe type handling function
  const getJobTypeClass = (type) => {
    if (!type) return 'full-time'; // Default if type is missing
    
    const lowerType = type.toLowerCase();
    if (['full-time', 'part-time', 'contract', 'remote'].includes(lowerType)) {
      return lowerType;
    }
    return 'full-time'; // Fallback to full-time if type is unexpected
  };

  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job at ${job.company}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Share this job: ${job.title} at ${job.company}`);
    }
  };

  // Function to render requirements as a list
  const renderRequirements = (requirements) => {
    if (!requirements) return <span className="no-requirements">Not Specified</span>;
    
    // Split requirements by comma or newline
    const reqList = requirements.split(/[,|\n]/).filter(req => req.trim() !== '');
    
    return (
      <ul className="requirements-list">
        {reqList.map((req, index) => (
          <li key={index} className="requirement-item">
            {req.trim()}
            <span className="remove-requirement" onClick={(e) => {
              e.stopPropagation();
              // You can add a handler here to remove this requirement
            }}>×</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="job-card">
            <Link to={`/jobs/${job.id}`} className="job-info-link">
              <div className="job-info">
                <h3 className="job-title">{job.title || 'No title provided'}</h3>
                <p className="job-company">{job.company || 'Company not specified'}</p>
                <div className="job-meta">
                  <span className="job-location">📍 {job.location || 'Location not specified'}</span>
                  <span className="job-salary">💰 ${job.salary || 'Salary not specified'}</span>
                  <span className={`job-type ${getJobTypeClass(job.type)}`}>
                    {job.type || 'Full-time'}
                  </span>
                </div>
                <div className="job-requirements">
                  <label>Requirements:</label>
                  {renderRequirements(job.requirements)}
                </div>
              </div>
            </Link>
            <div className="job-actions">
              <Link to={`/jobs/${job.id}/edit`} className="btn-edit">
                ✏️ Edit
              </Link>
              <button onClick={() => onDelete(job.id)} className="btn-delete">
                🗑️ Delete
              </button>
              <button onClick={() => handleShare(job)} className="btn-share">
                ↗️ Share
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-jobs">
          <p>No jobs available. Add your first job!</p>
        </div>
      )}
    </div>
  );
}