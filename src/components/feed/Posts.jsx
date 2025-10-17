import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaThumbsUp, FaComment, FaShare, FaPaperPlane, FaImage, FaTimes, FaSpinner, FaUsers, FaCompass, FaEye } from 'react-icons/fa';

axios.defaults.baseURL = "http://localhost:5000";

const Posts = () => {
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
    fetchFollowing();
    fetchPosts();
  }, []);

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

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/me/following', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowing(res.data.map(u => u._id));
    } catch (err) {
      console.error('Error fetching following:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [followingRes, discoverRes] = await Promise.all([
        axios.get('/api/posts/following', { headers }),
        axios.get('/api/posts/discover', { headers })
      ]);
      setFollowingPosts(followingRes.data);
      setDiscoverPosts(discoverRes.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const formData = new FormData();
    formData.append('content', newPost);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFollowingPosts([res.data, ...followingPosts]);
      setNewPost('');
      setImagePreview(null);
      setSelectedImage(null);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    } finally {
      setSubmitting(false);
    }
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

  const handleLike = async (postId, column) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (column === 'following') {
        setFollowingPosts(followingPosts.map(p => p._id === postId ? res.data : p));
      } else {
        setDiscoverPosts(discoverPosts.map(p => p._id === postId ? res.data : p));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId, comment, column) => {
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/posts/${postId}/comment`, { comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (column === 'following') {
        setFollowingPosts(followingPosts.map(p => p._id === postId ? res.data : p));
      } else {
        setDiscoverPosts(discoverPosts.map(p => p._id === postId ? res.data : p));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const isFollowing = (userId) => following.includes(userId);

  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const method = isFollowing(userId) ? 'delete' : 'post';
      const url = `/api/users/${userId}/follow`;
      await axios[method](url, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (isFollowing(userId)) {
        setFollowing(following.filter(id => id !== userId));
      } else {
        setFollowing([...following, userId]);
      }
      fetchPosts();
    } catch (err) {
      console.error('Error handling follow:', err);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const renderPostCard = (post, column) => (
    <div 
      key={post._id} 
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => handlePostClick(post._id)}
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <img
              src={post.user.avatar ? `${axios.defaults.baseURL}${post.user.avatar}` : '/default-avatar.png'}
              alt={post.user.name}
              className="w-12 h-12 rounded-full"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{post.user.name}</h3>
              <p className="text-sm text-gray-500">{post.user.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFollow(post.user._id);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              isFollowing(post.user._id)
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing(post.user._id) ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image.startsWith('http') ? post.image : `${axios.defaults.baseURL}${post.image}`}
            alt="Post Image"
            className="w-full h-64 object-cover rounded-xl mb-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onError={(e) => {
              e.target.src = '/default-placeholder.jpg';
              console.error('Post image load error:', post.image);
            }}
          />
        )}
      </div>

      <div className="flex justify-around border-t border-gray-100 p-4 bg-gray-50">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleLike(post._id, column);
          }}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg"
        >
          <FaThumbsUp size={16} />
          <span className="text-sm">{post.likes.length}</span>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handlePostClick(post._id);
          }}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg"
        >
          <FaComment size={16} />
          <span className="text-sm">{post.comments.length}</span>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors p-2 rounded-lg"
        >
          <FaShare size={16} />
          <span className="text-sm">Share</span>
        </button>
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Feed
          </h1>
          <p className="text-gray-600">Connect, share, and grow with your professional network.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        <div className=" sticky top-1 bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-2xl mx-auto ">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="flex items-start space-x-4 ">
              <img
                src={currentUser?.avatar ? currentUser.avatar.startsWith('http') ? currentUser.avatar : `http://localhost:5000${currentUser.avatar.replace(/^\/Uploads/, '/uploads')}` : "/default-avatar.png"}
                alt="Your Avatar"
                className="w-12 h-12 rounded-full"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
              <input
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share an update, article, or idea..."
                className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {imagePreview && (
              <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer text-gray-500 hover:text-blue-500 transition-colors">
                  <FaImage size={20} />
                  <span className="text-sm">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting || !newPost.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                <span>{submitting ? 'Posting...' : 'Post'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
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

          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
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