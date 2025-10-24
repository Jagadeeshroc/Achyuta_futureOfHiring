// src/components/Home.jsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiBriefcase, FiDollarSign, FiMapPin, FiClock, FiArrowRight, FiCompass } from 'react-icons/fi';
import { FaThumbsUp, FaComment, FaShare, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import Slider from 'react-slick';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Custom Arrow Components
const NextArrow = memo(({ onClick }) => (
  <button
    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all z-10"
    onClick={onClick}
    aria-label="Next slide"
  >
    <FiArrowRight size={20} />
  </button>
));

const PrevArrow = memo(({ onClick }) => (
  <button
    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all z-10"
    onClick={onClick}
    aria-label="Previous slide"
  >
    <FiArrowRight className="rotate-180" size={20} />
  </button>
));

// Memoized Discover Post Card
const DiscoverPostCard = memo(({ post, onClick }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer m-2! hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    }}
    whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    onClick={onClick}
  >
    <div className="p-4! border-b border-gray-100">
      <div className="flex items-start space-x-3">
        <LazyLoadImage
          src={post.user.avatar ? `${axios.defaults.baseURL}${post.user.avatar}` : '/default-avatar.png'}
          alt={post.user.name || post.user.email || 'Unknown User'}
          className="w-10 h-10 rounded-full object-cover mr-2!"
          placeholderSrc="/default-avatar-placeholder.png"
          effect="blur"
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
    <div className="m-1!">
      <p className="text-gray-800 text-sm whitespace-pre-wrap line-clamp-3 mb-3!">{post.content}</p>
      {post.image && (
        <LazyLoadImage
          src={post.image.startsWith('http') ? post.image : `${axios.defaults.baseURL}${post.image}`}
          alt="Post"
          className="w-full h-40 object-cover rounded-xl mt-3"
          placeholderSrc="/default-placeholder.jpg"
          effect="blur"
          onError={(e) => (e.target.src = '/default-placeholder.jpg')}
        />
      )}
    </div>
    <div className="flex justify-around border-t border-gray-100 p-2! bg-gray-50">
      <div className="flex items-center space-x-1 text-gray-600">
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
  </motion.div>
));

const Home = ({ apiBaseUrl = 'http://localhost:5000' }) => {
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(!localStorage.getItem('token'));
  const [discoverPosts, setDiscoverPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  // Cache for API responses
  const cache = new Map();

  useEffect(() => {
    axios.defaults.baseURL = apiBaseUrl;
    fetchDiscoverPosts();
  }, [apiBaseUrl]);

  const fetchDiscoverPosts = useCallback(async () => {
    const cacheKey = '/api/posts/discover?limit=10';
    if (cache.has(cacheKey)) {
      setDiscoverPosts(cache.get(cacheKey));
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get('/api/posts/discover?limit=10', { headers });
      const posts = res.data || [];
      cache.set(cacheKey, posts);
      setDiscoverPosts(posts);
    } catch (err) {
      console.error('Error fetching discover posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyJob = useCallback(() => {
    alert('Applied successfully');
  }, []);

  const handleSearch = useCallback(() => {
    console.log('Searching for:', keyword, location);
  }, [keyword, location]);



  const handlePostClick = useCallback((postId) => {
    navigate(`/posts/${postId}`);
  }, [navigate]);

  if (shouldRedirect) {
    return <Navigate to="/login" />;
  }

  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const hoverEffect = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: discoverPosts.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    lazyLoad: 'ondemand',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: discoverPosts.length > 2,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: discoverPosts.length > 1,
        },
      },
    ],
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
    

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-center p-5! sm:px-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-[80vh]">
        <motion.div variants={itemVariants} className="flex-1 ml-10! max-w-lg lg:max-w-xl text-center lg:text-left">
          <h1 className="text-4xl! sm:text-5xl! font-bold text-gray-900 mb-6! leading-tight">
            Find Your <span className="text-6xl! text-purple-600">Dream</span> Job Today
          </h1>
          <p className="text-lg! text-gray-600 mb-8!">
            Join thousands of companies hiring the best talent on our platform
          </p>
          <motion.div variants={itemVariants} className="mb-8!">
            <div className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-lg p-2 max-w-md mx-auto lg:mx-0">
              <input
                type="text"
                placeholder="Job title, or company"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="flex-1 p-3! border-none outline-none text-gray-700 text-sm rounded-lg sm:rounded-r-none"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 p-3! border-none outline-none text-gray-700 text-sm rounded-lg sm:rounded-none sm:border-x border-gray-200"
              />
              <motion.button
                onClick={handleSearch}
                whileHover={hoverEffect}
                className="bg-purple-600 text-white p-2! rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm sm:rounded-l-none"
              >
                Search Jobs
              </motion.button>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-purple-600">10K+</span>
              <span className="text-sm text-gray-500">Jobs Available</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-purple-600">5K+</span>
              <span className="text-sm text-gray-500">Companies Hiring</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-purple-600">100K+</span>
              <span className="text-sm text-gray-500">Candidates Hired</span>
            </div>
          </motion.div>
        </motion.div>

         <motion.div
         variants={itemVariants} className="p-3! m-1!">

          <div>

            <h1 className='text-7xl! text-center text-purple-200!'
             style={{ fontFamily: '"Blaka", cursive' }}>ACHYUTA</h1>
          <p className='m-2! text-center! text-gray-400!'
              style={{ fontFamily: '"Eagle Lake", cursive' }}
            >Future of Hiring</p>
          </div>
         </motion.div>

        <motion.div
          className="flex-1 mr-15! lg:mt-0 flex justify-center lg:justify-end"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <LazyLoadImage
            src="src/assets/images/jagadeeshvanganooru@gmail.com.png"
            alt="Hero"
            className="w-full max-w-md rounded-xl shadow-lg"
            placeholderSrc="/default-placeholder.jpg"
            effect="blur"
            onError={(e) => (e.target.src = '/default-placeholder.jpg')}
          />
        </motion.div>
      </section>

      {/* Featured Jobs Section */}
      <section className="p-5! sm:px-8">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 text-center mb-4!">
          Featured Jobs
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-gray-600 text-center mb-8!">
          Browse through our most recent job postings
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto! m-3!">
          {[1, 2, 3, 4].map((job) => (
            <motion.div
              key={job}
              className="bg-white rounded-2xl shadow-md p-6! hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center ">
                <LazyLoadImage
                  src={`https://picsum.photos/80/80?random=${job}`}
                  alt="Company logo"
                  className="w-12 h-12 rounded-full object-cover mr-6!"
                  placeholderSrc="/default-placeholder.jpg"
                  effect="blur"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Senior Frontend Developer</h3>
                  <p className="text-sm text-gray-500">TechCorp Inc.</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2" /> San Francisco, CA
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <FiDollarSign className="mr-2" /> $120,000 - $150,000
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <FiClock className="mr-2" /> Full-time
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold p-1! rounded-full">Remote</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white p-2! rounded-lg font-semibold flex items-center text-sm hover:bg-blue-700 transition-all"
                  onClick={applyJob}
                >
                  Apply Now <FiArrowRight className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          variants={itemVariants}
          whileHover={hoverEffect}
          className="text-center mt-8"
        >
          <Link to="/jobs" className="text-blue-600 font-semibold text-lg hover:text-blue-800 transition-all flex items-center justify-center">
            View All Jobs <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Discover Posts Section (Carousel) */}
      <section className="p-6! flex flex-col justify-center sm:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 text-center mb-4!">
          Discover Community Posts
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-gray-600 text-center mb-8!">
          Connect with professionals and explore insights from our community
        </motion.p>
        {loading ? (
          <div className="flex justify-center">
            <FiCompass className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : discoverPosts.length === 0 ? (
          <div className="text-center py-12! bg-white rounded-2xl shadow-md max-w-4xl mx-auto">
            <FiCompass className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No posts to discover yet.</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center m-2!">
            <Slider {...sliderSettings}>
              {discoverPosts.map((post) => (
                <DiscoverPostCard key={post._id} post={post} onClick={() => handlePostClick(post._id)} />
              ))}
            </Slider>
          </div>
        )}
        <motion.div
          variants={itemVariants}
          whileHover={hoverEffect}
          className="text-center mt-8!"
        >
          <Link to="/feeds" className="text-purple-600 font-semibold text-lg hover:text-blue-800 transition-all flex items-center justify-center">
            View All Posts <FiArrowRight className="ml-2!" />
          </Link>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="p-6! sm:px-8 bg-gradient-to-br from-gray-100 to-gray-200">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 text-center mb-4!">
          How It Works
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg text-gray-600 text-center mb-8!">
          Get your dream job in just 3 simple steps
        </motion.p>
        <div className=" flex flex-row justify-center grid-12 grid-cols-1 sm:grid-cols-3 gap-6 ">
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6! text-center"
            variants={itemVariants}
            whileHover={hoverEffect}
          >
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4! font-bold">1</div>
            <FiSearch className="text-3xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Jobs</h3>
            <p className="text-sm text-gray-600">Find the perfect job that matches your skills and experience</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6! text-center"
            variants={itemVariants}
            whileHover={hoverEffect}
          >
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4! font-bold">2</div>
            <FiBriefcase className="text-3xl text-blue-600 mx-auto mb-4!" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2!">Apply</h3>
            <p className="text-sm text-gray-600">Submit your application with just one click</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6! text-center"
            variants={itemVariants}
            whileHover={hoverEffect}
          >
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4! font-bold">3</div>
            <FiDollarSign className="text-3xl text-blue-600 mx-auto mb-4!" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Hired</h3>
            <p className="text-sm text-gray-600">Start your new career journey with your dream company</p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="p-6! sm:px-8">
        <motion.div
          className="relative bg-purple-400 rounded-2xl p-8! text-center  shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            backgroundImage: "url('/assets/Images/Untitled design (2).png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <h2 className="text-3xl! text-white! sm:text-4xl font-bold mb-4!">Ready to find your dream job?</h2>
          <p className="text-lg! mb-6! text-center! text-dark-900!">
            Thousands of professionals have found their perfect match on our platform
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/jobs"
              className="bg-white text-purple-600 p-3! rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center"
            >
              Browse Jobs <FiArrowRight className="ml-2!" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;