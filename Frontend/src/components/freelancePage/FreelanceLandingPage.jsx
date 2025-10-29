import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { motion } from "framer-motion";
import { FaLaptopCode, FaTools, FaBriefcase, FaClock, FaPlus } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import FreelancingCard from "./FreelancingCard"; // Assume updated below
import { getFullImageUrl } from "../../utils/imageUtils";

const FreelanceLandingPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const socket = useSocket();
  const navigate = useNavigate();

 
// In FreelanceLandingPage.jsx - update the fetchPosts function
const fetchPosts = async () => {
  try {
    const url = activeCategory === "all" ? "/api/freelance/posts" : `/api/freelance/posts?type=${activeCategory}`;
    const res = await axiosInstance.get(url);
    console.log('📦 Posts from backend:', res.data);
    
    // Log each post's attachments for debugging
    res.data.forEach((post, index) => {
      console.log(`📎 Post ${index} (${post._id}):`, {
        title: post.title,
        attachments: post.attachments,
        attachmentUrls: post.attachments?.map(att => getFullImageUrl(att))
      });
    });
    
    setPosts(res.data);
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
};

  // Fetch featured (assuming backend returns some)
  const fetchFeatured = async () => {
    try {
      const res = await axiosInstance.get("/api/freelance/posts/featured");
      setFeatured(res.data);
    } catch (err) {
      console.error("Error fetching featured posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFeatured();
  }, [activeCategory]);

  // Real-time updates
  useEffect(() => {
    socket?.on("newPost", (post) => {
      if (activeCategory === "all" || post.type === activeCategory) {
        setPosts((prev) => [post, ...prev]);
      }
    });
    return () => socket?.off("newPost");
  }, [socket, activeCategory]);

  const categoryItems = [
    { key: "all", label: "All", icon: <FaPlus /> },
    { key: "job", label: "Jobs", icon: <FaBriefcase /> },
    { key: "private-work", label: "Private Works", icon: <FaTools /> },
    { key: "service", label: "Services", icon: <FaLaptopCode /> },
    { key: "part-time", label: "Part Time", icon: <FaClock /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      {/* Hero Banner - More attractive with overlay and call-to-action */}
      <div
        className="relative bg-cover bg-center h-80 flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-indigo-900/60"></div>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-5xl font-extrabold z-10 tracking-wide mb-9!"
        >
          Freelance Marketplace
        </motion.h1>
        <p className="relative text-xl m-3! text-white z-10 max-w-2xl text-center">
          Connect with top talent, post jobs, offer services, and build your freelance career in one place.
        </p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => navigate("/freelance/create")}
          className="relative mt-6! p-2! bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all z-10"
        >
          <FaPlus className="inline " /> Post a Job or Service
        </motion.button>
      </div>

      {/* Introduction Section with Beautiful Cards */}
      <div className=" mt-16 p-4!">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-10">
          How Our Freelance Marketplace Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-3!">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-3! text-center hover:shadow-2xl transition-shadow  flex flex-col items-center"
          >
            <FaBriefcase className="text-5xl text-indigo-600  mb-4!" />
            <h3 className="text-xl font-semibold mb-2">Post Jobs & Find Talent</h3>
            <p className="text-gray-600">
              As a client, post job openings, browse services, and hire freelancers for full-time, part-time, or private works.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-3! text-center hover:shadow-2xl transition-shadow  flex flex-col items-center"
          >
            <FaLaptopCode className="text-5xl text-indigo-600  m-4!" />
            <h3 className="text-xl font-semibold mb-2!">Offer Your Services</h3>
            <p className="text-gray-600">
              As a freelancer, showcase your skills, post services, and apply to jobs or part-time opportunities.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-3! text-center hover:shadow-2xl transition-shadow  flex flex-col items-center"
          >
            <FaTools className="text-5xl text-indigo-600  mb-4" />
            <h3 className="text-xl font-semibold mb-2!">Collaborate & Grow</h3>
            <p className="text-gray-600">
              Use real-time updates, secure payments, and networking tools to build lasting professional relationships.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filters/Tabs */}
      <div className="flex justify-center m-3!">
        <div className="flex bg-white shadow-md rounded-lg!  overflow-hidden p-2!">
          {categoryItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 p-3! font-medium transition-all mr-5! ${
                activeCategory === key
                  ? "bg-indigo-600 text-white rounded-lg!"
                  : "text-purple-700 hover:bg-indigo-100"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

     
      {/* Posts Grid */}
      <div className=" mt-16 mb-20 p-4!">
        <h2 className="text-3xl font-bold mb-8 text-indigo-900 text-center m-3!">
          🧰 Latest Freelance Posts
        </h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <FreelancingCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No posts found in this category yet. Be the first to post!
          </p>
        )}
      </div>



       {/* Featured Section */}
      {featured.length > 0 && (
        <div className=" mt-6! p-2! ">
          <h2 className="text-3xl font-bold mb-8! text-indigo-900 text-center">
            🌟 Featured Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-3!">
            {featured.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <FreelancingCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default FreelanceLandingPage;