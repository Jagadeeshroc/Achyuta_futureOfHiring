// src/components/UpdateProfileForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProfileForm = ({ user, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    headline: user?.title || "",
    location: user?.location || "",
    about: user?.about || "",
    skills: user?.skills?.join(", ") || "",
    socialLinks: user?.socialLinks || {},
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const updateData = {
        ...formData,
        skills: skillsArray,
      };

      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      // Update parent component
      onClose(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-3! rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
          onClick={() => onClose()}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Links</label>
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={formData.socialLinks.linkedin || ""}
              onChange={handleSocialLinkChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <input
              type="text"
              name="twitter"
              placeholder="Twitter URL"
              value={formData.socialLinks.twitter || ""}
              onChange={handleSocialLinkChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <input
              type="text"
              name="github"
              placeholder="GitHub URL"
              value={formData.socialLinks.github || ""}
              onChange={handleSocialLinkChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;