// src/components/Posts.jsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserCircle, FaThumbsUp, FaComment, FaShare, FaPaperPlane,
  FaImage, FaTimes, FaSpinner, FaUsers, FaCompass
} from 'react-icons/fa';

const Posts = ({ apiBaseUrl = 'http://localhost:5000', className = '' }) => {
  const navigate = useNavigate();
  const [followingPosts, setFollowingPosts] = useState([]);
  const [discoverPosts, setDiscoverPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('following');

  useEffect(() => {
    axios.defaults.baseURL = apiBaseUrl;
    fetchPosts();
    fetchFollowingIfLoggedIn();
  }, [apiBaseUrl]);

  useLayoutEffect(() => {
    const updateUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setCurrentUser({ ...parsedUser, _id: parsedUser._id || parsedUser.id });
      } else {
        setCurrentUser(null);
      }
    };
    updateUser();
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  const fetchFollowingIfLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('/api/users/me/following', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFollowing(res.data.map((u) => u._id));
    } catch (err) {
      console.error('Error fetching following list:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const discoverRes = await axios.get('/api/posts/discover', { headers });
      let followingRes = { data: [] };

      if (token) {
        followingRes = await axios.get('/api/posts/following', { headers });
      }

      setFollowingPosts(followingRes.data || []);
      setDiscoverPosts(discoverRes.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const requireLogin = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!requireLogin()) return;
    if (!newPost.trim()) return;

    const formData = new FormData();
    formData.append('content', newPost);
    if (selectedImage) formData.append('image', selectedImage);

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFollowingPosts([res.data, ...followingPosts]);
      setNewPost('');
      setImagePreview(null);
      setSelectedImage(null);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId, column) => {
    if (!requireLogin()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (column === 'following') {
        setFollowingPosts(followingPosts.map((p) => (p._id === postId ? res.data : p)));
      } else {
        setDiscoverPosts(discoverPosts.map((p) => (p._id === postId ? res.data : p)));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId, comment, column) => {
    if (!requireLogin()) return;
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/posts/${postId}/comment`, { comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (column === 'following') {
        setFollowingPosts(followingPosts.map((p) => (p._id === postId ? res.data : p)));
      } else {
        setDiscoverPosts(discoverPosts.map((p) => (p._id === postId ? res.data : p)));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleFollow = async (userId) => {
    if (!requireLogin()) return;
    try {
      const token = localStorage.getItem('token');
      const method = isFollowing(userId) ? 'delete' : 'post';
      const url = `/api/users/${userId}/follow`;
      await axios[method](url, {}, { headers: { Authorization: `Bearer ${token}` } });
      setFollowing(isFollowing(userId)
        ? following.filter((id) => id !== userId)
        : [...following, userId]
      );
      fetchPosts();
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handlePostClick = (postId) => {
    if (!requireLogin()) return;
    navigate(`/posts/${postId}`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
  };

  const isFollowing = (userId) => following.includes(userId);

  const renderPostCard = (post, column) => (
    <div
      key={post._id}
      className="bg-white rounded-2xl shadow-md overflow-hidden m-3! cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onClick={() => handlePostClick(post._id)}
    >
      <div className="p-4! border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <img
              src={post.user.avatar ? `${axios.defaults.baseURL}${post.user.avatar}` : '/default-avatar.png'}
              alt={post.user.name || post.user.email || 'Unknown User'}
              className="w-12 h-12 rounded-full object-cover m-1!"
              onError={(e) => (e.target.src = '/default-avatar.png')}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-lg">
                {post.user.name || post.user.email || 'Unknown User'}
              </h3>
              <p className="text-sm text-gray-500">{post.user.headline || 'No headline'}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          {currentUser && currentUser._id !== post.user._id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(post.user._id);
              }}
              className={`p-2! rounded-full text-sm font-medium transition-colors ${
                isFollowing(post.user._id)
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing(post.user._id) ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div className="p-4! h-180 w-180">
        <p className="text-gray-800 whitespace-pre-wrap mb-4!">{post.content}</p>
        {post.image && (
          <img
            src={post.image.startsWith('http') ? post.image : `${axios.defaults.baseURL}${post.image}`}
            alt="Post"
            className="w-full! h-full object-cover rounded-xl m-1!"
            onError={(e) => (e.target.src = '/default-placeholder.jpg')}
          />
        )}
      </div>

      <div className="flex justify-around border-t border-gray-100 p-3! bg-gray-50">
        <button
          className="flex items-center space-x-2 p-2! text-gray-600 hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleLike(post._id, column);
          }}
        >
          <FaThumbsUp size={18} />
          <span className="text-sm">{post.likes.length}</span>
        </button>
        <button
          className="flex items-center space-x-2 p-2! text-gray-600 hover:text-blue-600 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <FaComment size={18} />
          <span className="text-sm">{post.comments.length}</span>
        </button>
        <button
          className="flex items-center space-x-2 p-2! text-gray-600 hover:text-blue-600 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <FaShare size={18} />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${className}`}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-50 max-w-4xl ml-15! mx-auto bg-transparent backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto p-1.5!">
          {/* First Row: Post Form */}
          {currentUser ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
              <div className="flex items-center justify-between">
                {/* User Info and Input */}
                <div className="flex items-center space-x-3 flex-1">
                  <img
                    src={
                      currentUser?.avatar
                        ? currentUser.avatar.startsWith('http')
                          ? currentUser.avatar
                          : `${apiBaseUrl}${currentUser.avatar.replace(/^\/Uploads/, '/uploads')}`
                        : '/default-avatar.png'
                    }
                    alt={currentUser?.name || currentUser?.email || 'Unknown User'}
                    className="w-12 h-12 m-1! rounded-xl object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <form onSubmit={handlePostSubmit} className="flex items-center space-x-3">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="  What's inspiring you today?"
                        className="flex-1 p-2! border-0 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm placeholder-gray-400 min-h-[50px]"
                        rows={1}
                      />
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {/* Add Photo Button */}
                        <label className="flex items-center cursor-pointer text-gray-500 hover:text-blue-500 transition-all duration-200 p-2! rounded-lg hover:bg-blue-50 group">
                          <FaImage size={20} className="group-hover:scale-110 transition-transform m-1!" />
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        
                        {/* Share Post Button */}
                        <button
                          type="submit"
                          disabled={submitting || !newPost.trim()}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2! rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 disabled:transform-none transform hover:scale-105 text-sm min-w-[100px] justify-center"
                        >
                          {submitting ? (
                            <FaSpinner className="animate-spin m-1!" size={14} />
                          ) : (
                            <FaPaperPlane className="transform -rotate-45 m-1!" size={14} />
                          )}
                          <span>{submitting ? 'Posting...' : 'Post'}</span>
                        </button>
                      </div>
                      <div className="flex justify-center ml-10!">
            <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200 shadow-sm w-full max-w-md">
              <button
                className={`flex-1 flex items-center justify-center space-x-2 m-2! p-2! rounded-lg font-semibold transition-all duration-200 text-sm ${
                  activeTab === 'following'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('following')}
              >
                <FaUsers size={16} />
                <span>Following</span>
              </button>
              <button
                className={`flex-1 flex items-center justify-center space-x-2 p-2! rounded-lg font-semibold transition-all duration-200 text-sm ${
                  activeTab === 'discover'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('discover')}
              >
                <FaCompass size={16} />
                <span>Discover</span>
              </button>
            </div>
          </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white/90 text-gray-600 p-1.5 rounded-lg hover:bg-white hover:text-red-500 transition-all shadow-sm backdrop-blur-sm"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 p-3! rounded-2xl shadow-lg mb-3! text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaUserCircle className="text-2xl opacity-90 mr-2! " />
                  <div className="text-left">
                    <h3 className="text-lg font-bold">Join the Conversation</h3>
                    <p className="text-blue-100 text-sm">
                      Sign in to share your thoughts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 p-1! rounded-xl font-bold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm"
                >
                  Sign In
                </button>
              </div>


              
            </div>
          )}
        </div>
      </div>

      {/* Posts Display */}
      <div className="flex justify-center p-3! m-3! bg-purple-100">
        <div className="space-y-6 m-3!">
          {activeTab === 'following' && currentUser ? (
            followingPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <FaUserCircle className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Follow more people to see their posts here.</p>
              </div>
            ) : (
              followingPosts.map((post) => renderPostCard(post, 'following'))
            )
          ) : activeTab === 'discover' ? (
            discoverPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <FaCompass className="text-5xl text-gray-300 mx-auto mb-4! " />
                <p className="text-gray-500 text-lg">Discover new posts and people.</p>
              </div>
            ) : (
              discoverPosts.map((post) => renderPostCard(post, 'discover'))
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Posts;