// FreelanceCreatePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FreelancingForm from "./FreelancingForm";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";

const FreelanceCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setError("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to create a post");
        return;
      }

      await axiosInstance.post("/api/freelance/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/freelance");
    } catch (err) {
      console.error("Error creating post:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to create post";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3!">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-3!"
      >
        <h2 className="text-3xl font-bold text-indigo-900 mb-4! text-center">
          Create a New Freelance Post
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <FreelancingForm onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
};

export default FreelanceCreatePage;