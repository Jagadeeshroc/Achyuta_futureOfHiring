// src/pages/FreelancePage.jsx
import React, { useState, useEffect } from "react";

import FreelancingForm from "./FreelancingForm";

import { useSocket } from "../context/SocketContext";
import { motion } from "framer-motion";
import { FaLaptopCode, FaTools, FaBriefcase } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import FreelancingCard from "./FreelancingCard";

const FreelancePage = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const socket = useSocket();

  // ✅ Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get(`/api/posts?type=${activeTab}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // ✅ Fetch Featured
  const fetchFeatured = async () => {
    try {
      const res = await axiosInstance.get("/api/posts/featured");
      setFeatured(res.data);
    } catch (err) {
      console.error("Error fetching featured posts:", err);
    }
  };

  // ✅ Create Post
  const handlePost = async (formData) => {
    try {
      const res = await axiosInstance.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFeatured();
  }, [activeTab]);

  // ✅ Real-time updates
  useEffect(() => {
    socket?.on("newPost", (post) => {
      if (post.type === activeTab) setPosts((prev) => [post, ...prev]);
    });
    return () => socket?.off("newPost");
  }, [socket, activeTab]);

  const tabItems = [
    { key: "jobs", label: "Jobs", icon: <FaBriefcase /> },
    { key: "private-works", label: "Private Works", icon: <FaTools /> },
    { key: "services", label: "Services", icon: <FaLaptopCode /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Hero Banner */}
      <div
        className="relative bg-cover bg-center h-64 flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1531497865144-0464ef8fb9a6?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-4xl font-bold z-10"
        >
          Freelance Marketplace
        </motion.h1>
        <p className="relative text-lg mt-2 text-gray-200 z-10">
          Find jobs, post your work, and grow your network
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8">
        <div className="flex bg-white shadow-md rounded-full overflow-hidden">
          {tabItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === key
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6"
      >
        <FreelancingForm onSubmit={handlePost} section={activeTab} />
      </motion.div>

      {/* Featured Freelancers */}
      {featured.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            🌟 Featured Freelancers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* <FreelancingCard post={post} /> */}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto mt-16 mb-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          🧰 Latest {activeTab.replace("-", " ")} Posts
        </h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* <FreelancingCard post={post} /> */}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No posts found in this category yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FreelancePage;
