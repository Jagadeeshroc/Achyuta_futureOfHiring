// components/freelancePage/FreelancePostDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaShare, 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaMoneyBillAlt,
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaStar,
  FaExternalLinkAlt,
  FaPaperPlane,
  FaEnvelope
} from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";

// Utility function for image URLs
const getImageUrl = (imagePath, category = 'general') => {
  if (!imagePath) return getPlaceholderImage(category);
  
  if (imagePath.startsWith('http')) return imagePath;
  
  let filename;
  if (imagePath.startsWith('file://') || imagePath.includes('uploads') || imagePath.includes('freelance')) {
    filename = imagePath.split('/').pop() || imagePath.split('\\').pop();
  } else if (imagePath.startsWith('/')) {
    filename = imagePath.split('/').pop();
  } else {
    filename = imagePath;
  }
  
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/freelance/${filename}`;
};

const getPlaceholderImage = (category = 'general') => {
  const placeholders = {
    job: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    service: 'https://images.unsplash.com/photo-1556655848-f3a79cc6d4a4?auto=format&fit=crop&w=500&q=80',
    'part-time': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=500&q=80',
    'private-work': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=500&q=80',
    general: 'https://images.unsplash.com/photo-1556655848-f3a79cc6d4a4?auto=format&fit=crop&w=500&q=80'
  };
  return placeholders[category] || placeholders.general;
};

const FreelancePostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [userReview, setUserReview] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch post details
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/freelance/posts/${id}`);
      setPost(response.data);
      setLikesCount(response.data.likesCount || 0);
      setLiked(response.data.userLiked || false);
      fetchReviews();
    } catch (err) {
      console.error("Error fetching post:", err);
      setError("Post not found");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for this post and detect user's existing review
  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/api/freelance/posts/${id}/reviews`);
      setReviews(response.data);
      
      // Extract user ID from JWT token
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentUserId = payload.id || payload.userId || payload._id;
          
          if (currentUserId) {
            const userExistingReview = response.data.find(review => review.user._id === currentUserId);
            setUserReview(userExistingReview);
            
            // Pre-fill the form if user has an existing review
            if (userExistingReview) {
              setNewReview({
                rating: userExistingReview.rating,
                comment: userExistingReview.comment
              });
            }
          }
        }
      } catch (userErr) {
        console.log('Could not extract user ID from token:', userErr);
        setUserReview(null);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
  };

  // Handle like/unlike
  const handleLike = async () => {
    try {
      const response = await axiosInstance.post(`/api/freelance/posts/${id}/like`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/api/freelance/posts/${id}/reviews`, newReview);
      
      setNewReview({ rating: 5, comment: "" });
      fetchReviews(); // Refresh reviews
      
      // Show appropriate message based on whether it was created or updated
      const action = response.data.action; // 'created' or 'updated'
      if (action === 'updated') {
        setNotification({
          show: true,
          message: '✅ Review updated successfully!',
          type: 'success'
        });
      } else {
        setNotification({
          show: true,
          message: '✅ Review submitted successfully!',
          type: 'success'
        });
      }
      
    } catch (err) {
      console.error("Error submitting review:", err);
      
      let errorMessage = 'Error submitting review. Please try again.';
      
      if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'You have already reviewed this post';
      } else if (err.response?.status === 401) {
        errorMessage = 'Please log in to submit a review.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Post not found.';
      }
      
      setNotification({
        show: true,
        message: `❌ ${errorMessage}`,
        type: 'error'
      });
    }
  };

  // Contact Poster - Navigate to messaging
  const handleContactPoster = () => {
    if (!post || !post.user) return;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({
        show: true,
        message: '🔐 Please log in to contact the poster.',
        type: 'error'
      });
      return;
    }

    // Navigate to messages with the poster's user ID
    navigate(`/messages?user=${post.user._id}&post=${post._id}`);
  };

  // View Profile - Navigate to user profile
  const handleViewProfile = () => {
    if (!post || !post.user) return;
    navigate(`/profile/${post.user._id}`);
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setNotification({
      show: true,
      message: '📋 Link copied to clipboard!',
      type: 'success'
    });
    setShowShareModal(false);
  };

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <button
            onClick={() => navigate("/freelance")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="ml-4 text-white hover:text-gray-200 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-2!">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/freelance")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2!"
            >
              <FaArrowLeft />
              Back to Marketplace
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaShare />
                Share
              </button>
              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                {likesCount}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2!">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Post Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {post.attachments && post.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6!"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={getImageUrl(post.attachments[0], post.type)}
                    alt={post.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage(post.type);
                    }}
                  />
                  {post.attachments.length > 1 && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex gap-2 overflow-x-auto">
                        {post.attachments.slice(1).map((attachment, index) => (
                          <img
                            key={index}
                            src={getImageUrl(attachment, post.type)}
                            alt={`Attachment ${index + 2}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                            onError={(e) => {
                              e.target.src = getPlaceholderImage(post.type);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Post Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-3! m-2!"
            >
              <div className="flex items-start justify-between mb-2! p-2!">
                <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  post.type === 'job' ? 'bg-blue-100 text-blue-800' :
                  post.type === 'service' ? 'bg-green-100 text-green-800' :
                  post.type === 'part-time' ? 'bg-orange-100 text-orange-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {post.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>

              <p className="text-gray-700 text-lg mb-2! p-2! leading-relaxed">
                {post.description}
              </p>

              {/* Skills */}
              {post.skills && post.skills.length > 0 && (
                <div className="mb- p-2!">
                  <h3 className="text-lg font-semibold mb-1!">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="p-2! bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(post.budget || post.price) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMoneyBillAlt className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${post.budget || post.price}
                      </p>
                    </div>
                  </div>
                )}

                {post.location && (
                  <div className="flex items-center gap-3 p-3! bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-red-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{post.location}</p>
                    </div>
                  </div>
                )}

                {post.duration && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{post.duration}</p>
                    </div>
                  </div>
                )}

                {post.deliveryTime && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaClock className="text-orange-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Time</p>
                      <p className="text-lg font-semibold text-gray-900">{post.deliveryTime}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-3!"
            >
              <h3 className="text-2xl font-bold mb-3!">Reviews & Feedback</h3>
              
              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="mb-8 p-3! bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-2!">
                  {userReview ? '✏️ Update Your Review' : '⭐ Add Your Review'}
                </h4>
                
                {userReview && (
                  <div className="mb-3 p-2! bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium ">
                      📝 You've already reviewed this post. Submitting will update your existing review.
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2!">
                  <span className="text-sm text-gray-600">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-2xl ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-300`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">({newReview.rating}/5)</span>
                </div>
                
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder={userReview ?  "  Update your review..." : "  Share your experience with this post..."}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                  required
                />
                
                <button
                  type="submit"
                  className="p-2! bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-semibold"
                >
                  {userReview ? '🔄 Update Review' : '📤 Submit Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4 p-3! m-2!">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center gap-3 mb-2">
                        {review.user?.avatar ? (
                          <img
                            src={getImageUrl(review.user.avatar)}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-sm" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                size={14}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - User Info & Actions */}
          <div className="lg:col-span-1">
            {/* User Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-3! mb-6 sticky top-6"
            >
              <h3 className="text-xl font-bold mb-4">Posted By</h3>
              <div className="flex items-center gap-4 mb-2!">
                {post.user?.avatar ? (
                  <img
                    src={getImageUrl(post.user.avatar)}
                    alt={post.user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=indigo&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-xl" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-lg">{post.user?.name || post.user?.username}</h4>
                  <p className="text-gray-600 text-sm">{post.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 p-2!">
                <button 
                  onClick={handleContactPoster}
                  className="w-full bg-indigo-600 text-white p-2! m-1! rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Contact Poster
                </button>
                <button className="w-full border border-indigo-600 text-indigo-600 p-2! m-1! rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                  Save Post
                </button>
                <button 
                  onClick={handleViewProfile}
                  className="w-full border border-gray-300 text-gray-700 p-2! m-1! rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaExternalLinkAlt />
                  View Profile
                </button>
              </div>
            </motion.div>

            {/* Similar Posts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-3! m-2!"
            >
              <h3 className="text-xl font-bold mb-4!">Similar Posts</h3>
              <p className="text-gray-500 text-sm">Feature coming soon...</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Share this post</h3>
            <div className="space-y-3">
              <button
                onClick={copyToClipboard}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancePostDetails;