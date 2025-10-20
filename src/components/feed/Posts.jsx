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
      className="bg-gray-50 rounded-lg! shadow-lg overflow-hidden mb-3! cursor-pointer hover:shadow-xl transition-shadow p-1!"
      onClick={() => handlePostClick(post._id)}
    >
      <div className="p-3! border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="  flex items-start space-x-4 flex-1">
            <img
              src={post.user.avatar ? `${axios.defaults.baseURL}${post.user.avatar}` : '/default-avatar.png'}
              alt={post.user.name || post.user.email || 'Unknown User'}
              className="w-12 h-12 rounded-full m-2!"
              onError={(e) => (e.target.src = '/default-avatar.png')}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate m-1!">
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
              className={` p-2! rounded-full text-sm font-semibold transition-colors ${
                isFollowing(post.user._id)
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing(post.user._id) ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <div className="p-3! bg-gray-200">
        <p className="text-gray-800 m-2! whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image.startsWith('http') ? post.image : `${axios.defaults.baseURL}${post.image}`}
            alt="Post"
            className="w-full h-64 object-cover rounded-xl mb-4"
            onError={(e) => (e.target.src = '/default-placeholder.jpg')}
          />
        )}
      </div>

      <div className="flex justify-around border-t border-gray-100 p-2! m-2! bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-500 p-2!">
          <FaThumbsUp size={16} />
          <span className="text-sm">{post.likes.length}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 p-2!">
          <FaComment size={16} />
          <span className="text-sm">{post.comments.length}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 p-2!">
          <FaShare size={16} />
          <span className="text-sm">Share</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`sticky top-0  bg-gray-50 p-4! ${className}`}>
      <div className="">
     

        {/* Post form only for logged-in users */}
        {currentUser ? (
          <div className=" sticky top-0 z-5 bg-white rounded-2xl shadow-lg p-2! w-full! mb-8! mx-auto!">
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div className="flex items-start space-x-4 p-2!">
                <img
                  src={
                    currentUser?.avatar
                      ? currentUser.avatar.startsWith('http')
                        ? currentUser.avatar
                        : `${apiBaseUrl}${currentUser.avatar.replace(/^\/Uploads/, '/uploads')}`
                      : '/default-avatar.png'
                  }
                  alt={currentUser?.name || currentUser?.email || 'Unknown User'}
                  className="w-12 h-12 rounded-full m-2!"
                />
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="    What's on your mind?"
                  className="flex-1 p-3! m-2! border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {imagePreview && (
                <div className="relative bg-gray-100 rounded-xl overflow-hidden p-2!">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2! rounded-full"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between  pt-3!">
                <label className="flex items-center space-x-2 cursor-pointer text-gray-500 hover:text-blue-500">
                  <FaImage size={20} className='m-2!'/>
                  <span className="text-sm m-2!">Add Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <button
                  type="submit"
                  disabled={submitting || !newPost.trim()}
                  className="bg-blue-600 text-white p-1! rounded-md! font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? <FaSpinner className="animate-spin m-1!" /> : <FaPaperPlane />}
                  <span className='m-1!'>{submitting ? 'Posting...' : 'Post'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center bg-white p-6 rounded-2xl shadow-md mb-8 max-w-2xl mx-auto">
            <p className="text-gray-600 mb-4">Want to share something?</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              Log in to post
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {currentUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4! p-2!">
                <FaUsers className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Following</h2>
              </div>
              {followingPosts.length === 0 ? (
                <div className="text-center py-12">
                  <FaUserCircle className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Follow more people to see their posts here.</p>
                </div>
              ) : (
                followingPosts.map((post) => renderPostCard(post, 'following'))
              )}
            </div>
          )}

          <div className="space-y-6 ">
            <div className="flex items-center space-x-2 mb-4! p-2!">
              <FaCompass className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Discover</h2>
            </div>
            {discoverPosts.length === 0 ? (
              <div className="text-center py-12">
                <FaCompass className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Discover new posts and people.</p>
              </div>
            ) : (
              discoverPosts.map((post) => renderPostCard(post, 'discover'))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
