import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const JobReviews = ({ jobId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [jobId]);
  const fetchReviews = async () => {
    try {
      setFetching(true);
      setError('');
      const res = await axios.get(`http://localhost:5000/jobs/${jobId}/reviews`, {
        headers: user?.token ? {
          Authorization: `Bearer ${user.token}`
        } : {}
      });
      
      // Handle different response formats
      let reviewsArray = [];
      if (Array.isArray(res.data)) {
        reviewsArray = res.data;
      } else if (res.data && Array.isArray(res.data.reviews)) {
        reviewsArray = res.data.reviews;
      } else if (res.data && Array.isArray(res.data.data)) {
        reviewsArray = res.data.data;
      }
      
      setReviews(reviewsArray);
    } catch (err) {
      console.error('Fetch reviews error:', err);
      let errorMsg = 'Failed to load reviews';
      if (err.response) {
        errorMsg = err.response.data?.error || 
                  err.response.data?.message || 
                  errorMsg;
      }
      setError(errorMsg);
      setReviews([]);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Review content cannot be empty');
      return;
    }
    if (!user?.token) {
      setError('You must be logged in to submit a review');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
      const res = await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/reviews`, 
        { content, rating },
        { 
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}` 
          } 
        }
      );

      setSuccessMsg('Review added successfully!');
      setReviews([res.data, ...reviews]);
      setContent('');
      setRating(5);
    } catch (err) {
      console.error('Submit review error:', err);
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };



  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Job Reviews</h2>

      {fetching && !reviews.length && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <motion.div 
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p>{error}</p>
        </motion.div>
      )}

      {successMsg && (
        <motion.div 
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p>{successMsg}</p>
        </motion.div>
      )}

      {user && (
        <motion.form 
          onSubmit={handleSubmit} 
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-700">Write a Review</h3>

          <div className="flex items-center space-x-2 mb-2">
            <span className="text-gray-700">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <StarIcon 
                    className={`h-6 w-6 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your experience with this job..."
            rows={4}
            minLength={10}
            maxLength={500}
            required
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {content.length}/500 characters
            </span>
            <button
              type="submit"
              disabled={loading || content.length < 10}
              className={`px-4 py-2 rounded-lg text-white font-medium ${loading || content.length < 10 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Review'}
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 && !fetching ? (
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </motion.div>
        ) : (
          reviews.map((review) => (
            <motion.div 
              key={review._id || review.id}
              className="bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {review.user?.name || review.user_name || 'Anonymous'}
                  </p>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(review.createdAt || review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {user?._id === review.user?._id && (
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-3 text-gray-700">{review.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobReviews;