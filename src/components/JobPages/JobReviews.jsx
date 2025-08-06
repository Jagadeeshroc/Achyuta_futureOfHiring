import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JobReviews({ jobId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/${jobId}/reviews`, {
          validateStatus: function (status) {
            return status < 500; // Don't throw error for 404
          }
        });
  
        if (response.status === 404) {
          setReviews([]); // No reviews found is okay
        } else {
          setReviews(response.data);
        }
      } catch (err) {
        console.error('Fetch reviews error:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    if (jobId) {
      fetchReviews();
    }
  }, [jobId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to post a review');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/${jobId}/reviews`,
        { content: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([response.data, ...reviews]);
      setNewReview('');
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="job-reviews">
      <h3>Reviews</h3>
      
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id}>
              <p>{review.content}</p>
              <small>By: {review.user?.name || 'Anonymous'}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet. Be the first to review!</p>
      )}

      {token ? (
        <form onSubmit={handleSubmitReview}>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      ) : (
        <p>Please log in to post a review.</p>
      )}
    </div>
  );
}