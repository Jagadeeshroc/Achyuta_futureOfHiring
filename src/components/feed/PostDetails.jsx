// Frontend: src/components/PostDetails.jsx (New component for post details)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaComment, FaShare, FaTimes , FaDownload, FaUserCircle, FaArrowLeft, FaSpinner } from 'react-icons/fa';

axios.defaults.baseURL = "http://localhost:5000";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedUsers, setLikedUsers] = useState([]);
  const [showLikedModal, setShowLikedModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(res.data);
      setLikedUsers(res.data.likes || []);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(res.data);
      setLikedUsers(res.data.likes || []);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (comment) => {
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/posts/${id}/comment`, { comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(res.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleImageClick = (imageUrl) => {
    setImagePreview(imageUrl);
  };

  const downloadImage = (imageUrl, filename = 'post-image.jpg') => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{error || 'Post not found'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6">
          <FaArrowLeft />
          <span>Back to Feed</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Post Header */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-start space-x-4">
            <img
              src={post.user.avatar || '/default-avatar.png'}
              alt={post.user.name}
              className="w-12 h-12 rounded-full m-2"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{post.user.first_name} {post.user.last_name}</h3>
              <p className="text-sm text-gray-500">{post.user.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <p className="text-gray-800 m-2 whitespace-pre-wrap text-lg">{post.content}</p>
          {post.image && (
            <div className="relative h-50 p-2">
              <img
                src={post.image.startsWith('http') ? post.image : `${axios.defaults.baseURL}${post.image}`}
                alt="Post Image"
                className="w-full h-full object-cover! rounded-xl cursor-pointer"
                onClick={() => handleImageClick(post.image)}
                onError={(e) => {
                  e.target.src = '/default-placeholder.jpg';
                  console.error('Post image load error:', post.image);
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(post.image, 'post-image.jpg');
                }}
                className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              >
                <FaDownload />
              </button>
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex justify-around border-t border-gray-100 p-2 bg-gray-50">
          <button 
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors  rounded-lg"
          >
            <FaThumbsUp size={16} />
            <span className="text-sm">{post.likes.length} likes</span>
          </button>
          <button 
            onClick={() => setShowLikedModal(true)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors  rounded-lg cursor-pointer"
          >
            <FaThumbsUp size={16} />
            <span className="text-sm">See who liked</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors  rounded-lg">
            <FaShare size={16} />
            <span className="text-sm">Share</span>
          </button>
        </div>

        {/* Comments */}
        <div className="p-3 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Comments ({post.comments.length})</h4>
          <div className="space-y-4 mb-6">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <img 
                  src={comment.user?.avatar || '/default-avatar.png'} 
                  alt="Commenter" 
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  onError={(e) => { e.target.src = '/default-avatar.png'; }}
                />
                <div className="flex-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="font-medium text-gray-900 text-sm">{comment.user?.first_name} {comment.user?.last_name}</span>
                    <span className="text-xs text-gray-500">· {new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-3 p-2">
            <img src="/default-avatar.png" alt="Your Avatar" className="w-8 h-8 rounded-full m-2" />
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleComment(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button 
              onClick={() => {
                const input = document.querySelector('input[placeholder="Write a comment..."]');
                handleComment(input.value);
                input.value = '';
              }}
              className="text-blue-600 font-semibold hover:text-blue-700 m-2"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Liked Users Modal */}
      {showLikedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center  z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-3 border-b">
              <h3 className="text-lg font-bold text-gray-900">Liked by ({likedUsers.length})</h3>
            </div>
            <div className="p-3 space-y-4">
              {likedUsers.map((user) => (
                <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={user.avatar || '/default-avatar.png'} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full"
                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{user.name} </p>
                    <p className="text-sm text-gray-500">{user.title || 'User'}</p>
                  </div>
                </div>
              ))}
              {likedUsers.length === 0 && <p className="text-gray-500 text-center py-4">No likes yet</p>}
            </div>
            <div className="p-3 border-t flex justify-end">
              <button 
                onClick={() => setShowLikedModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full"
              onError={(e) => {
                e.target.src = '/default-placeholder.jpg';
              }}
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => downloadImage(imagePreview, 'post-image.jpg')}
                className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl"
              >
                <FaDownload size={20} />
              </button>
              <button
                onClick={() => setImagePreview(null)}
                className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;