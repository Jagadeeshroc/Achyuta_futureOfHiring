import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaCode,
  FaGraduationCap,
  FaBriefcase,
  FaGlobe,
  FaStackOverflow,
  FaMapMarkerAlt,
  FaUserTie,
  FaSchool,
  FaBuilding,
  FaFilePdf,
} from "react-icons/fa";
import axios from "axios";
import UpdateProfileForm from "../ProfileIcon/MyProfile/UpdateProfileForm";

const FullDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) throw new Error("Authentication data missing");

        let currentUserId = null;
        try {
          const parsedUser = JSON.parse(storedUser);
          currentUserId = parsedUser._id || parsedUser.id;
        } catch {
          throw new Error("Invalid user data in localStorage");
        }

        // Check if the current user is viewing their own profile
        setIsCurrentUser(currentUserId === userId);

        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const openEditProfile = () => setIsEditProfileOpen(true);
  const closeEditProfile = (updatedUser) => {
    setIsEditProfileOpen(false);
    if (updatedUser) {
      setUser(updatedUser);
      // Update localStorage to reflect changes
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 m-3!">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
          <Link
            to="/myprofile"
            className="mt-4 inline-block  p-2! bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const fullAvatarUrl = user.avatar?.startsWith("http")
    ? user.avatar
    : `http://localhost:5000${user.avatar}`;

  const fullResumeUrl = user.resume?.startsWith("http")
    ? user.resume
    : `http://localhost:5000${user.resume}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/myprofile"
            className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md px-3 py-2 transition-colors no-underline"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Profile
          </Link>
          {isCurrentUser && (
            <button
              className="bg-blue-500 text-white p-2! m-2!  rounded-md hover:bg-blue-600 transition-colors"
              onClick={openEditProfile}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-3!">
          {/* Intro Section */}
          <div className="md:flex">
            {/* Left Side - Avatar */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center p-3!">
              <div className="relative">
                <img
                  src={fullAvatarUrl}
                  alt="Profile"
                  className="w-48 h-48 m-2! rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.png";
                  }}
                />
              </div>

              {fullResumeUrl && (
                <a
                  href={fullResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-2! bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full max-w-xs mt-4 no-underline"
                >
                  <FaFilePdf className="mr-2" /> View Resume
                </a>
              )}

              {/* Contact Info */}
              <div className="mt-8! w-full max-w-xs ">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h3>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-700">
                    <FaEnvelope className="text-blue-500 m-2!" /> {user.email}
                  </p>
                  <p className="flex items-center text-gray-700">
                    <FaPhone className="text-blue-500 m-2!" /> {user.phone || "Not provided"}
                  </p>
                  {user.portfolio && (
                    <p className="flex items-center text-gray-700">
                      <FaGlobe className="text-blue-500 m-2!" />
                      <a
                        href={user.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Portfolio
                      </a>
                    </p>
                  )}
                  <div className="flex space-x-4 p-2!">
                    {user.socialLinks?.linkedin && (
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaLinkedin className="text-2xl" />
                      </a>
                    )}
                    {user.socialLinks?.github && (
                      <a
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-black"
                      >
                        <FaGithub className="text-2xl" />
                      </a>
                    )}
                    {user.socialLinks?.stackoverflow && (
                      <a
                        href={user.socialLinks.stackoverflow}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-700"
                      >
                        <FaStackOverflow className="text-2xl" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="md:w-2/3 p-3!">
              <div className="mb-6!">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-xl text-blue-600 font-medium mt-1">{user.headline}</p>
                <p className="flex items-center text-gray-600 mt-2">
                  <FaMapMarkerAlt className="mr-2" /> {user.location || "Not provided"}
                </p>
              </div>

              {/* About Section */}
              <div className="mb-6 P-3!">
                <div className="flex items-center mb-4">
                  <FaUserTie className="text-blue-500 mr-2 text-xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">About</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{user.about || "No information provided"}</p>
              </div>

              {/* Skills Section */}
              <div className="mb-6 p-3!">
                <div className="flex items-center mb-4">
                  <FaCode className="text-blue-500 mr-2 text-xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Skills & Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-2 p-3!">
                  {Array.isArray(user.skills) && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              {user.experience && user.experience.length > 0 && (
                <div className="mb-6 p-3!">
                  <div className="flex items-center mb-4">
                    <FaBriefcase className="text-blue-500 m-2! text-xl" />
                    <h2 className="text-2xl font-semibold text-gray-800 p-3!">Work Experience</h2>
                  </div>
                  <div className="space-y-6 m-3!">
                    {user.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-300 pl-5 relative m-3!">
                        <div className="absolute -left-2.5 top-3 h-5 w-5 rounded-full bg-blue-500 border-4 border-white"></div>
                        <h3 className="text-xl font-semibold text-gray-800 m-2!">{exp.title}</h3>
                        <div className="flex flex-wrap items-center text-gray-600 mt-1 gap-x-4 gap-y-1">
                          <span className="flex items-center">
                            <FaBuilding className="m-2!" /> {exp.company}
                          </span>
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="m-2!" /> {exp.location || "Not provided"}
                          </span>
                          <span className="m-2!">
                            {new Date(exp.from).toLocaleDateString()} -{" "}
                            {exp.current ? "Present" : exp.to ? new Date(exp.to).toLocaleDateString() : "Not specified"}
                          </span>
                        </div>
                        <p className="m-2! text-gray-700 leading-relaxed">
                          {exp.description || "No description provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {user.education && user.education.length > 0 && (
                <div className="mb-6 p-3!">
                  <div className="flex items-center mb-4">
                    <FaGraduationCap className="text-blue-500 m-2! text-xl" />
                    <h2 className="text-2xl font-semibold text-gray-800 m-2!">Education</h2>
                  </div>
                  <div className="space-y-6 p-3!">
                    {user.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-blue-300 m-3! relative">
                        <div className="absolute -left-2.5 top-3 h-5 w-5 rounded-full bg-blue-500 border-4 border-white"></div>
                        <h3 className="text-xl font-semibold text-gray-800 m-2!">
                          {edu.degree} in {edu.field}
                        </h3>
                        <div className="flex flex-wrap items-center text-gray-600 mt-1 gap-x-4 gap-y-1">
                          <span className="flex items-center">
                            <FaSchool className="m-2!" /> {edu.school}
                          </span>
                          <span>
                            {new Date(edu.from).toLocaleDateString()} -{" "}
                            {edu.to ? new Date(edu.to).toLocaleDateString() : "Not specified"}
                          </span>
                        </div>
                        <p className="mt-2! text-gray-700 leading-relaxed">
                          {edu.description || "No description provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isEditProfileOpen && <UpdateProfileForm user={user} onClose={closeEditProfile} />}
    </div>
  );
};

export default FullDetails;