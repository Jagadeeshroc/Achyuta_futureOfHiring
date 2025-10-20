import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaUsers, FaBriefcase, FaTag, FaUser } from 'react-icons/fa';
import JobReviews from './JobReviews';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSuccess(null);
      setError('You must be logged in to apply for this job.');
      return;
    }

    setIsApplying(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setError(null);
      setSuccess(response.data.message);
    } catch (err) {
      console.error('Apply error:', err);
      setSuccess(null);
      setError(err.response?.data?.error || 'Failed to apply for the job');
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Invalid job ID');
      setLoading(false);
      navigate('/jobs', { replace: true });
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        if (!response.data) {
          throw new Error('Job not found');
        }
        if (!response.data.posted_By) {
          console.warn('Job data missing posted_By:', response.data);
          response.data.posted_By = { name: 'Unknown', email: 'N/A', avatar: null };
        }
        if (!Array.isArray(response.data.skillsRequired)) {
          console.warn('Job data missing or invalid skillsRequired:', response.data.skillsRequired);
          response.data.skillsRequired = [];
        }
        console.log('Posted By data:', response.data.posted_By);
        if (!response.data.posted_By.avatar) {
          console.warn('No avatar found for posted_By, using fallback');
        }
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load job details');
        navigate('/jobs', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar || avatar === '') {
      console.log('Avatar is null or empty, using default fallback');
      return '/images/pexels-njeromin-12149149.jpg';
    }
    if (avatar.startsWith('http')) {
      console.log('Using absolute avatar URL:', avatar);
      return avatar;
    }
    const normalizedPath = avatar.replace(/^\/[Uu]ploads/, '/Uploads');
    const fullUrl = `http://localhost:5000${normalizedPath}`;
    console.log('Constructed avatar URL:', fullUrl);
    return fullUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-blue-500"
        >
          <FaClock className="text-4xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-100"
      >
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md max-w-md mx-auto">
          {error}
        </div>
      </motion.div>
    );
  }

  if (!job) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-100"
      >
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md max-w-md mx-auto">
          Job not found
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gray-100 py-4 px-2 sm:py-6 sm:px-4 lg:py-8 lg:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden sm:rounded-xl lg:rounded-2xl">
        {/* Job Header */}
        <motion.div 
          className="p-3! border-b border-gray-200 sm:p-5 lg:p-6" 
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl m-1!">{job.title}</h2>
          <div className="mt-2 flex items-center text-gray-600 m-2!">
            <FaBuilding className="mr-2 text-blue-500" />
            <h3 className="text-base font-semibold sm:text-lg m-1!">{job.company}</h3>
          </div>
          <div className="m-2! flex flex-wrap gap-2 text-sm text-gray-600 sm:gap-3 sm:text-base">
            <div className="flex items-center">
              <FaMapMarkerAlt className="m-2! text-blue-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="m-2! text-green-500" />
              <span>{job.salary || 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <FaBriefcase className="m-2! text-purple-500" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="m-2! text-red-500" />
              <span>Apply by {formatDate(job.deadline)}</span>
            </div>
            <div className="flex items-center">
              <FaUsers className="m-2! text-indigo-500" />
              <span>{job.applicantsCount} Applicants</span>
            </div>
            <div className="flex items-center">
              <FaTag className="m-2! text-yellow-500" />
              <span>{job.status}</span>
            </div>
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div 
          className="p-3! border-b border-gray-200 sm:p-5 lg:p-6" 
          variants={itemVariants}
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2 sm:text-xl m-1!">Description</h4>
          <p className="text-gray-700 leading-relaxed m-2!">{job.description}</p>
        </motion.div>

        {/* Job Requirements */}
        <motion.div 
          className="p-3! border-b border-gray-200 sm:p-5 lg:p-6" 
          variants={itemVariants}
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2 sm:text-xl m-1!">Requirements</h4>
          <div className="mb-3">
            <h5 className="text-base font-medium text-gray-800 sm:text-lg m-1!">Skills Required</h5>
            <div className="flex flex-wrap gap-2 m-3!">
              {Array.isArray(job.skillsRequired) && job.skillsRequired.length > 0 ? (
                job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs font-medium p-2! rounded-full sm:text-sm sm:px-3"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No skills specified</span>
              )}
            </div>
          </div>
          <div>
            <h5 className="text-base font-medium text-gray-800 sm:text-lg m-1!">Experience Required</h5>
            <p className="text-gray-700">{job.experienceRequired || 'Not specified'}</p>
          </div>
        </motion.div>

        {/* Posted By */}
        <motion.div 
          className="p-3! border-b border-gray-200 sm:p-5 lg:p-6" 
          variants={itemVariants}
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-2! sm:text-xl">Posted By</h4>
          <div className="flex items-center text-gray-700">
            <motion.img
              src={getAvatarUrl(job.posted_By?.avatar)}
              alt={`${job.posted_By?.name || 'User'} avatar`}
              className="w-10 h-10 rounded-full m-2! object-cover"
              onError={(e) => {
                console.log('Avatar failed to load, using fallback:', job.posted_By?.avatar);
                e.target.onerror = null;
                e.target.src = '/images/pexels-njeromin-12149149.jpg';
              }}
              variants={avatarVariants}
              initial="hidden"
              animate="visible"
            />
            <div>
              <p className="font-medium text-sm sm:text-base">{job.posted_By?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500 sm:text-sm">{job.posted_By?.email || 'N/A'}</p>
            </div>
          </div>
        </motion.div>

        {/* Job Actions */}
        <motion.div 
          className="p-3 sm:p-5 lg:p-6" 
          variants={itemVariants}
        >
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-lg sm:p-4"
              >
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg sm:p-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleApply}
            disabled={isApplying || !!success}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={ ` m-5! p-2! rounded-lg! text-white font-semibold transition-all sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 ${
              isApplying || success
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
            }`}
          >
            {isApplying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Applying...
              </div>
            ) : success ? (
              'Applied'
            ) : (
              'Apply Now'
            )}
          </motion.button>
        </motion.div>

        {/* Job Reviews */}
        <motion.div 
          className="p-3 sm:p-5 lg:p-6" 
          variants={itemVariants}
        >
          <JobReviews jobId={id} />
        </motion.div>
      </div>
    </motion.div>
  );
}
// Note: Ensure that the JobReviews component is implemented to handle job reviews