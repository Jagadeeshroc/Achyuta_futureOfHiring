// src/components/MyProfile.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCommentAlt, FaBullseye, FaChartLine, FaCog, FaBell, FaTimes } from "react-icons/fa";
import axios from "axios";


const MyProfile = () => {
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) throw new Error("Authentication data missing");

        let userId = null;
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser._id || parsedUser.id;
        } catch {
          throw new Error("Invalid user data in localStorage");
        }

        if (!userId) throw new Error("User ID missing");

        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data) throw new Error("Invalid user data received");

        const currentUser = response.data;

        const normalizedUser = {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
          title: currentUser.headline || currentUser.title,
          location: currentUser.location,
          about: currentUser.about,
          phone: currentUser.phone,
          skills: currentUser.skills,
          socialLinks: currentUser.socialLinks || {},
          experience: currentUser.experience || [],
          education: currentUser.education || [],
        };

        localStorage.setItem("user", JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const openImagePopup = () => setIsImagePopupOpen(true);
  const closeImagePopup = () => setIsImagePopupOpen(false);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
        <h3 className="text-red-600 text-xl font-semibold">Error loading profile</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <p className="mt-2 text-sm">
          Or{" "}
          <Link to="/login" className="text-blue-500 underline">
            login again
          </Link>
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h3 className="text-gray-800 text-xl">No profile data available</h3>
        <Link to="/login" className="text-blue-500 underline mt-2">
          Please login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-3!">
    

      <div className="flex flex-col md:flex-row m-5!  p-4! bg-red-200 gap-6">
        <div className="md:w-1/4 bg-purple-200 rounded-lg shadow p-4!">
          <Link
            to="/feedback"
            className="flex items-center gap-2 p-2! m-2! text-2xl!  hover:bg-gray-100 rounded transition-colors"
          >
            <FaCommentAlt className="text-gray-900" />
            <span>Feedback</span>
          </Link>
          <Link
            to="/goals"
            className="flex items-center gap-2 p-2! m-2! text-2xl!  hover:bg-gray-100 rounded transition-colors"
          >
            <FaBullseye className="text-gray-900" />
            <span>Goals</span>
          </Link>
          <Link
            to="/grow"
            className="flex items-center gap-2 p-2! text-2xl! m-2! hover:bg-gray-100 rounded transition-colors"
          >
            <FaChartLine className="text-gray-900" />
            <span>Grow</span>
          </Link>
          <Link
            to="/reviews"
            className="flex items-center gap-2 p-2! text-2xl! m-2!  hover:bg-gray-100 rounded transition-colors"
          >
            <FaCommentAlt className="text-gray-900" />
            <span>Reviews</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 p-2! text-2xl! m-2! hover:bg-gray-100 rounded transition-colors"
          >
            <FaCog className="text-gray-900" />
            <span>Settings</span>
          </Link>
          <Link
            to="/updates"
            className="flex items-center gap-2 p-2! text-2xl! m-2!  hover:bg-gray-100 rounded transition-colors"
          >
            <FaBell className="text-gray-900" />
            <span>Updates</span>
          </Link>
        </div>

        <div className="md:w-3/4 bg-white rounded-lg shadow p-6!">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
              onClick={openImagePopup}
              onError={(e) => (e.target.src = "/src/assets/images/default-profile.png")}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.title}</p>
              <p className="text-gray-500">{user.location}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">About</h3>
              <p className="text-gray-600">{user.about}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.phone}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No skills listed</p>
                )}
              </div>
            </div>

            <Link
              to={`/FullDetails/${user._id}`}
              className="inline-block bg-blue-500 text-white p-2! m-5! rounded hover:bg-blue-600 transition-colors"
            >
              View Full Profile
            </Link>
          </div>
        </div>
      </div>

      {isImagePopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeImagePopup}
        >
          <div
            className="relative bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeImagePopup}
            >
              <FaTimes />
            </button>
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="Profile"
              className="max-w-full max-h-[80vh] rounded"
              onError={(e) => (e.target.src = "/src/assets/images/default-profile-large.png")}
            />
          </div>
        </div>
      )}

      
    </div>
  );
};

export default MyProfile;