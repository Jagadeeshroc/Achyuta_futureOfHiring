import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './JobDetails.css';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewsError, setReviewsError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setReviewsError(null);
        
        // Fetch job details
        const jobResponse = await axios.get(`http://localhost:5000/jobs/${id}`);
        setJob(jobResponse.data);
        
        // Fetch reviews if available
        try {
          const reviewsResponse = await axios.get(`http://localhost:5000/jobs/${id}/reviews`);
          setReviews(reviewsResponse.data);
        } catch (err) {
          if (err.response?.status === 404) {
            setReviewsError('No reviews found for this job');
          } else {
            setReviewsError('Failed to load reviews');
            console.error('Reviews fetch error:', err);
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
        if (err.response?.status === 404) {
          navigate('/not-found', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || newReview.trim().length < 10) return;
    
    try {
      setIsSubmitting(true);
      setReviewsError(null);
      setSuccessMessage('');
      
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !user) {
        navigate('/login', { state: { from: `/jobs/${id}` } });
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5000/jobs/${id}/reviews`,
        {
          content: newReview,
          rating: rating,
          user_id: user.id,
          user_name: user.name // Make sure to include user name if your backend doesn't populate it
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Create a new review object with all necessary fields
      const newReviewObj = {
        ...response.data,
        user_name: user.name, // Ensure user_name is included
        created_at: new Date().toISOString() // Add current timestamp if not from server
      };
      
      // Update state by creating a new array with the new review first
      setReviews(prevReviews => [newReviewObj, ...prevReviews]);
      setNewReview('');
      setRating(5);
      setSuccessMessage('Your review has been submitted successfully!');
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Review submission error:', err);
      setReviewsError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Failed to submit review. Please try again.'
      );
      
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: `/jobs/${id}` } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!job) return <div className="not-found">Job not found</div>;

  return (
    <div className="job-details-container">
      {/* Job details rendering */}
      <div className="job-header">
        <h2>{job.title}</h2>
        <h3>Company : {job.company}</h3>
        <p className="location">{job.location}</p>
        <p className="salary">Salary: {job.salary || 'Not specified'}</p>
      </div>

      <div className="job-description">
        <h4>Description</h4>
        <p>{job.description}</p>
      </div>

      <div className="job-requirements">
        <h4>Requirements</h4>
        <p className='jobRequire'>{job.requirements}</p>
      </div>

      <button 
        onClick={() => setShowReviews(!showReviews)} 
        className={`toggle-reviews-btn ${showReviews ? 'active' : ''}`}
      >
        {showReviews ? 'Hide Reviews' : 'Show Reviews'}
      </button>

      {showReviews && (
        <div className="reviews-section">
          <h4 className="section-title">Reviews</h4>
          
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          
          {reviewsError ? (
            <div className="error-message">{reviewsError}</div>
          ) : reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.user_name}</span>
                    <span className="review-rating">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="star-icon">★</span>
                      ))}
                    </span>
                  </div>
                  <p className="review-content">{review.content}</p>
                  <div className="review-date">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          )}

          <form onSubmit={handleSubmitReview} className="review-form">
            <h5>Add Your Review</h5>
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`star ${rating >= num ? 'filled' : ''}`}
                    onClick={() => setRating(num)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience with this job (minimum 10 characters)..."
                required
                className="review-textarea"
                disabled={isSubmitting}
                minLength="10"
                maxLength="500"
              />
            </div>
            <div className="form-footer">
              <button 
                type="submit" 
                className={`submit-review-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting || !newReview.trim() || newReview.trim().length < 10}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
              <span className="char-count">
                {newReview.length}/500 characters
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}