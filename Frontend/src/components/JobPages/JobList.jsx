import { Link } from 'react-router-dom';
import './JobList.css';

export default function JobList({ jobs, onDelete }) {
  // Safe type handling function
  const getJobTypeClass = (type) => {
    if (!type) return 'full-time';
    const lowerType = type.toLowerCase();
    if (['full-time', 'part-time', 'contract', 'remote'].includes(lowerType)) {
      return lowerType;
    }
    return 'full-time';
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

  const renderRequirements = (requirements, jobId) => {
    if (!requirements) return <span className="no-requirements">Not Specified</span>;
    
    const requirementsStr = String(requirements);
    const reqList = requirementsStr.split(/[,|\n]/)
      .map(req => req.trim())
      .filter(req => req !== '');
    
    return (
      <ul className="requirements-list">
        {reqList.map((req, index) => (
          <li key={`req-${jobId}-${index}-${req.substring(0, 5)}`} className="requirement-item">
            {req}
            <span className="remove-requirement" onClick={(e) => e.stopPropagation()}>
              ×
            </span>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => {
          // Use consistent ID field (prefer _id if available)
          const jobId = job._id || job.id;
          return (
            <div key={`job-${jobId}`} className="job-card">
              <Link to={`/jobs/${jobId}`} className="job-info-link">
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
                    {renderRequirements(job.requirements, jobId)}
                  </div>
                </div>
              </Link>
              <div className="job-actions">
                <Link 
                  to={`/jobs/${jobId}/edit`} 
                  className="btn-action btn-edit"
                  role="button"
                >
                  ✏️ Edit
                </Link>
                <button 
                  onClick={() => onDelete(job._id)} 
                  className="btn-action btn-delete"
                >
                  🗑️ Delete
                </button>
                <button 
                  onClick={() => handleShare(job)} 
                  className="btn-action btn-share"
                >
                  ↗️ Share
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-jobs">
          <p>No jobs available. Add your first job!</p>
        </div>
      )}
    </div>
  );
}