// src/components/PostDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaThumbsUp,FaComment , FaShare, FaTimes, FaDownload, FaUserCircle,
  FaArrowLeft, FaSpinner, FaCompass
} from 'react-icons/fa';
import Avatar from '../ui/Avatar';

axios.defaults.baseURL = 'http://localhost:5000';

// Reusable PostHeader subcomponent
const PostHeader = ({ user, createdAt, className = '', renderName }) => (
  <div className={`p-3! border-b border-gray-100 ${className}`}>
    <div className="flex items-start space-x-4">
      <Avatar
        user={{
          avatar: user?.avatar,
          name: renderName ? renderName(user) : (user?.name || user?.email || 'Unknown User'),
        }}
        size={48}
        className="flex-shrink-0 mr-2!"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-lg">
          {renderName ? renderName(user) : (user?.name || user?.email || 'Unknown User')}
        </h3>
        <p className="text-sm text-gray-500">{user?.headline || 'No headline'}</p>
        <p className="text-xs text-gray-400 mt-1">{new Date(createdAt).toLocaleString()}</p>
      </div>
    </div>
  </div>
);

// Reusable PostContent subcomponent
const PostContent = ({ content, image, onImageClick, onDownload, className = '' }) => (
  <div className={`p-4! h-120! overflow-auto ${className}`}>
    <p className="text-gray-800 whitespace-pre-wrap text-lg mb-4!">{content}</p>
    {image && (
      <div className="relative">
        <img
          src={image.startsWith('http') ? image : `${axios.defaults.baseURL}${image}`}
          alt="Post Image"
          className="w-full h-full object-cover rounded-xl cursor-pointer"
          onClick={() => onImageClick(image)}
          onError={(e) => {
            e.target.src = '/default-placeholder.jpg';
            console.error('Post image load error:', image);
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(image, 'post-image.jpg');
          }}
          className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FaDownload size={16} />
        </button>
      </div>
    )}
  </div>
);

// Reusable CommentSection subcomponent
const CommentSection = ({ comments, onComment, currentUser, className = '' }) => {
  const [commentText, setCommentText] = useState('');

  return (
    <div className={`p-4! border-t border-gray-100 ${className}`}>
      <h4 className="font-semibold text-gray-900 mb-4 text-lg">Comments ({comments.length})</h4>
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex space-x-3">
            <Avatar
              user={{
                avatar: comment.user?.avatar,
                name: comment.user?.name || comment.user?.email || 'Unknown User',
              }}
              size={32}
              className="flex-shrink-0 m-1!"
            />
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-medium text-gray-900 text-sm">
                  {comment.user?.name || comment.user?.email || 'Unknown User'}
                </span>
                <span className="text-xs text-gray-500">· {new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-800 text-sm m-1!">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      {currentUser && (
        <div className="flex items-center space-x-3">
          <Avatar
            user={{
              avatar: currentUser?.avatar,
              name: currentUser?.name || currentUser?.email || 'Unknown User',
            }}
            size={32}
            className="flex-shrink-0 m-1!"
          />
          <input
            type="text"
            placeholder="   Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 p-2! border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && commentText.trim()) {
                onComment(commentText.trim());
                setCommentText('');
              }
            }}
          />
          <button
            onClick={() => {
              if (commentText.trim()) {
                onComment(commentText.trim());
                setCommentText('');
              }
            }}
            className="bg-blue-600 text-white p-2! rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable LikedUsersModal subcomponent
const LikedUsersModal = ({ likedUsers, onClose, className = '' }) => (
  <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
    <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-lg">
      <div className="p-4! border-b">
        <h3 className="text-lg font-bold text-gray-900">Liked by ({likedUsers.length})</h3>
      </div>
      <div className="p-4! space-y-4">
        {likedUsers.map((user) => (
          <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Avatar
              user={{
                avatar: user.avatar,
                name: user.name || user.email || 'Unknown User',
              }}
              size={40}
            />
            <div>
              <p className="font-semibold text-gray-900">{user.name || user.email || 'Unknown User'}</p>
              <p className="text-sm text-gray-500">{user.headline || 'User'}</p>
            </div>
          </div>
        ))}
        {likedUsers.length === 0 && <p className="text-gray-500 text-center py-4">No likes yet</p>}
      </div>
      <div className="p-2! border-t flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-800 p-2! rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Reusable Discover Post Card (adapted from Posts.jsx)
const renderDiscoverPostCard = (post, handlePostClick) => (
  <div
    key={post._id}
    className="bg-white rounded-2xl shadow-md overflow-hidden mb-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    onClick={() => handlePostClick(post._id)}
  >
    <div className="p-3! border-b border-gray-100">
      <div className="flex items-start space-x-3">
        <img
          src={post.user.avatar ? `${axios.defaults.baseURL}${post.user.avatar}` : '/default-avatar.png'}
          alt={post.user.name || post.user.email || 'Unknown User'}
          className="w-10 h-10 rounded-full object-cover m-1!"
          onError={(e) => (e.target.src = '/default-avatar.png')}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {post.user.name || post.user.email || 'Unknown User'}
          </h3>
          <p className="text-xs text-gray-500">{post.user.headline || 'No headline'}</p>
          <p className="text-xs text-gray-400 mt-1">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
    <div className="p-3!">
      <p className="text-gray-800 text-sm whitespace-pre-wrap line-clamp-3">{post.content}</p>
      {post.image && (
        <img
          src={post.image.startsWith('http') ? post.image : `${axios.defaults.baseURL}${post.image}`}
          alt="Post"
          className="w-full h-full object-cover rounded-xl mt-3"
          onError={(e) => (e.target.src = '/default-placeholder.jpg')}
        />
      )}
    </div>
    <div className="flex justify-around border-t border-gray-100 p-2! bg-gray-50">
      <div className="flex items-center space-x-1 p-2! text-gray-600">
        <FaThumbsUp size={14} />
        <span className="text-xs">{post.likes.length}</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-600">
        <FaComment size={14} />
        <span className="text-xs">{post.comments.length}</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-600">
        <FaShare size={14} />
        <span className="text-xs">Share</span>
      </div>
    </div>
  </div>
);

// Main PostDetails Component
const PostDetails = ({ apiBaseUrl = 'http://localhost:5000', className = '', actions = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [discoverPosts, setDiscoverPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedUsers, setLikedUsers] = useState([]);
  const [showLikedModal, setShowLikedModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios.defaults.baseURL = apiBaseUrl;

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser({ ...parsedUser, _id: parsedUser._id || parsedUser.id });
    }

    fetchData();
  }, [id, apiBaseUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch post details
      const postRes = await axios.get(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(postRes.data);
      setLikedUsers(postRes.data.likes || []);

      // Fetch discover posts
      const discoverRes = await axios.get('/api/posts/discover', { headers });
      setDiscoverPosts(discoverRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('You must be logged in to like a post');

      const res = await axios.post(`/api/posts/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(res.data);
      setLikedUsers(res.data.likes || []);
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Failed to like the post. Please try again.');
    }
  };

  const handleComment = async (comment) => {
    if (!comment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('You must be logged in to comment');

      const res = await axios.post(`/api/posts/${id}/comment`, { comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(res.data);
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleImageClick = (imageUrl) => setImagePreview(imageUrl);

  const downloadImage = (imageUrl, filename = 'post-image.jpg') => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-md">
          <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">{error || 'Post not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white p-5! m-2! rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <FaArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-190! overflow-auto bg-purple-200  ${className}`}>
      <div className=" p-3!">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft size={16} />
          <span className="font-semibold">Back to Feed</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-6 h-170! m-1! overflow-auto p-2!">
          {/* Post Details (8/12) */}
          <div className="lg:col-span-8 p-2!">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden p-2! ">
              <PostHeader user={post.user} createdAt={post.createdAt} />
              <PostContent
                content={post.content}
                image={post.image}
                onImageClick={handleImageClick}
                onDownload={downloadImage}
              />
              <div className="flex justify-around border-t border-gray-100 p-2! m-2! bg-gray-50">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg p-2!"
                >
                  <FaThumbsUp size={18} />
                  <span className="text-sm">{post.likes.length} likes</span>
                </button>
                <button
                  onClick={() => setShowLikedModal(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg p-2!"
                >
                  <FaThumbsUp size={18} />
                  <span className="text-sm">See who liked</span>
                </button>
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors rounded-lg p-2!"
                  >
                    {action.icon}
                    <span className="text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
              <CommentSection comments={post.comments} onComment={handleComment} currentUser={currentUser} className='m-2!'/>
            </div>
          </div>

          {/* Discover Posts (4/12) */}
          <div className="lg:col-span-4 h-190! overflow-auto p-2!">
            <div className="bg-white rounded-2xl shadow-md p-3! sticky top-4">
              <div className="flex items-center space-x-2 mb-4 p-2!">
                <FaCompass className="text-purple-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Discover</h2>
              </div>
              {discoverPosts.length === 0 ? (
                <div className="text-center py-8!">
                  <FaCompass className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Discover new posts and people.</p>
                </div>
              ) : (
                <div className="space-y-4 p-1!">
                  {discoverPosts.map((post) => renderDiscoverPostCard(post, handlePostClick))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLikedModal && (
        <LikedUsersModal likedUsers={likedUsers} onClose={() => setShowLikedModal(false)} />
      )}

      {imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                e.target.src = '/default-placeholder.jpg';
              }}
            />
            <div className="absolute top-4 right-4 m-1! flex space-x-2">
              <button
                onClick={() => downloadImage(imagePreview, 'post-image.jpg')}
                className="bg-white p-2! rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <FaDownload size={20} />
              </button>
              <button
                onClick={() => setImagePreview(null)}
                className="bg-white p-2! rounded-full shadow-lg hover:bg-gray-100 transition-colors"
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