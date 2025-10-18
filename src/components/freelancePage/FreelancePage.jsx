// Frontend Code: src/pages/FreelancePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom'; // For redirecting to login
import FreelancingDetailsModal from './FreelancingDetailsModal';
import FreelancingForm from './FreelancingForm';
import FreelancingList from './FreelancingList';
import { FaBriefcase, FaLock, FaTools, FaSearch, FaStar, FaUserTie, FaSpinner } from 'react-icons/fa';

// Axios Interceptor for Authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Replace with your token storage method
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const FreelancePage = () => {
  const [activeSection, setActiveSection] = useState('jobs');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const socket = useSocket();
  const navigate = useNavigate(); // For redirecting to login

  useEffect(() => {
    fetchPosts(activeSection, searchTerm);
    fetchFeaturedPosts();
    if (socket) {
      socket.on('new-post', (newPost) => {
        if (newPost.type === activeSection) {
          setPosts([newPost, ...posts]);
          toast.info(`New post added: ${newPost.title}`);
        }
      });
      socket.on('new-application', (data) => {
        toast.info(`New application on your post: ${data.postTitle}`);
      });
      socket.on('new-like', (data) => {
        updatePostInList(data.postId, { likes: data.likes });
      });
      socket.on('new-comment', (data) => {
        updatePostInList(data.postId, { comments: data.comments });
      });
    }
    return () => {
      if (socket) {
        socket.off('new-post');
        socket.off('new-application');
        socket.off('new-like');
        socket.off('new-comment');
      }
    };
  }, [activeSection, socket]);

  const fetchPosts = async (section, search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/posts?type=${section}&search=${encodeURIComponent(search)}`);
      setPosts(res.data);
    } catch (err) {
      handleApiError(err, 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/posts/featured');
      setFeaturedPosts(res.data);
    } catch (err) {
      handleApiError(err, 'Failed to fetch featured posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = (err, defaultMessage) => {
    if (err.response?.status === 401) {
      toast.error('Please log in to access this content');
      navigate('/login'); // Redirect to login page
    } else if (err.response?.status === 400) {
      toast.error('Invalid request. Please check your input.');
    } else {
      toast.error(defaultMessage);
    }
    console.error(err);
    setError(defaultMessage);
  };

  const handlePostSubmit = async (postData) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/posts', postData);
      setPosts([res.data, ...posts]);
      socket.emit('new-post', res.data);
      toast.success('Post created successfully!');
    } catch (err) {
      handleApiError(err, 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (postId) => {
    try {
      const res = await axios.post(`/api/applications`, { postId });
      toast.success('Applied successfully!');
      socket.emit('apply', { postId, userId: 'currentUserId' }); // Replace with actual user ID
    } catch (err) {
      handleApiError(err, 'Failed to apply');
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like`);
      updatePostInList(postId, { likes: res.data.likes });
      socket.emit('like', { postId });
    } catch (err) {
      handleApiError(err, 'Failed to like post');
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, { text: comment });
      updatePostInList(postId, { comments: res.data.comments });
      socket.emit('comment', { postId });
    } catch (err) {
      handleApiError(err, 'Failed to add comment');
    }
  };

  const handleShare = (postId) => {
    const link = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const updatePostInList = (postId, updates) => {
    setPosts(posts.map(post => post._id === postId ? { ...post, ...updates } : post));
  };

  const openPostDetails = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleSearch = () => {
    fetchPosts(activeSection, searchTerm);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-indigo-800 mb-4 tracking-wide animate-fade-in">Freelance Hub</h1>
          <p className="text-xl text-gray-600 mb-6">Connect with top freelancers, discover opportunities, and grow your career seamlessly.</p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300">
            <FaUserTie className="inline mr-2" /> Get Started as a Freelancer
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveSection('jobs')}
            className={`px-6 py-3 mx-2 rounded-lg transition-all duration-300 flex items-center ${activeSection === 'jobs' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
          >
            <FaBriefcase className="mr-2" /> Freelance Jobs
          </button>
          <button
            onClick={() => setActiveSection('private-works')}
            className={`px-6 py-3 mx-2 rounded-lg transition-all duration-300 flex items-center ${activeSection === 'private-works' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
          >
            <FaLock className="mr-2" /> Private Works
          </button>
          <button
            onClick={() => setActiveSection('services')}
            className={`px-6 py-3 mx-2 rounded-lg transition-all duration-300 flex items-center ${activeSection === 'services' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
          >
            <FaTools className="mr-2" /> Services
          </button>
        </div>

        {/* Sticky Post Input Bar */}
        <div className="sticky top-0 z-10 bg-white shadow-md p-4 mb-8 rounded-lg">
          <FreelancingForm onSubmit={handlePostSubmit} section={activeSection} />
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search posts by title, skills, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-indigo-300 focus:outline-none focus:border-indigo-600 transition-all duration-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-0 top-0 h-full px-4 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-all duration-300"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center mb-8">
            <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
            <p className="text-gray-600 mt-2">Loading posts...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {/* Featured Posts Section */}
        {!isLoading && featuredPosts.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center">
              <FaStar className="mr-2 text-yellow-500" /> Featured Posts
            </h2>
            <FreelancingList posts={featuredPosts} onPostClick={openPostDetails} onApply={handleApply} isFeatured />
          </div>
        )}

        {/* Helpful Features Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Helpful Features for Freelancers</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Post jobs, works, or services and get real-time applications.</li>
            <li>Pay for premium features like boosted visibility or priority listings.</li>
            <li>Receive notifications for applications, likes, and comments.</li>
            <li>Engage with posts via likes, comments, and shares.</li>
            <li>Private messaging for negotiations (coming soon).</li>
            <li>Portfolio integration to showcase your work.</li>
            <li>Payment gateway for secure transactions (integrate Stripe or similar).</li>
            <li>Ratings and reviews system to build trust.</li>
            <li>Skill matching algorithm for better job recommendations.</li>
            <li>Analytics dashboard to track post performance and earnings.</li>
            <li>Community forums for tips and networking (coming soon).</li>
          </ul>
          <div className="mt-4 text-center">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300">
              Upgrade to Premium for More Features
            </button>
          </div>
        </div>

        {/* Posts List */}
        {!isLoading && posts.length === 0 && !error && (
          <div className="text-center text-gray-600 mb-8">No posts found. Try a different search or create a new post!</div>
        )}
        {!isLoading && posts.length > 0 && (
          <FreelancingList posts={posts} onPostClick={openPostDetails} onApply={handleApply} />
        )}

        {/* Post Details Modal */}
        {showModal && selectedPost && (
          <FreelancingDetailsModal
            post={selectedPost}
            onClose={() => setShowModal(false)}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default FreelancePage;