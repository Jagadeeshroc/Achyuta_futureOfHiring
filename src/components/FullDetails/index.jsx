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
  FaTools,
  FaGlobe,
  FaStackOverflow,
  FaMapMarkerAlt,
  FaUserTie,
  FaSchool,
  FaBuilding,
  FaFilePdf
} from "react-icons/fa";
import axios from "axios";

const FullDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
          <Link 
            to="/myprofile" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        <div className="flex justify-between items-center p-3">
          <Link 
            to="/myprofile" 
            className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors no-underline! p-2 rounded-md!"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Profile
          </Link>
          
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-3">
          {/* Intro Section */}
          <div className="md:flex ">
            {/* Left Side - Avatar */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center ">
              <div className="relative m-6">
                <img
                  src={fullAvatarUrl}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg m-3"
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
                  className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full max-w-xs no-underline! m-2"
                >
                  <FaFilePdf className="mx-2 no-underline!" /> View Resume
                </a>
              )}

              {/* Contact Info */}
              <div className="mt-8 w-full max-w-xs">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Information</h3>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-700">
                    <FaEnvelope className="text-blue-500 mx-2" /> {user.email}
                  </p>
                  <p className="flex items-center text-gray-700">
                    <FaPhone className="text-blue-500 mx-2" /> {user.phone}
                  </p>
                  {user.portfolio && (
                    <p className="flex items-center text-gray-700">
                      <FaGlobe className="text-blue-500 mx-2" /> 
                      <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Portfolio
                      </a>
                    </p>
                  )}
                  <div className="flex space-x-4 pt-2">
                    {user.socialLinks?.linkedin && (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <FaLinkedin className="text-2xl mx-2" />
                      </a>
                    )}
                    {user.socialLinks?.github && (
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">
                        <FaGithub className="text-2xl mx-2" />
                      </a>
                    )}
                    {user.socialLinks?.stackoverflow && (
                      <a href={user.socialLinks.stackoverflow} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-700">
                        <FaStackOverflow className="text-2xl mx-2" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="md:w-2/3 p-8">
              <div className="m-3 p-3">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-xl  text-blue-600 font-medium my-1 ">{user.headline}</p>
                <p className="flex items-center text-gray-600 mt-2">
                  <FaMapMarkerAlt className="mr-1" /> {user.location}
                </p>
              </div>

              {/* About Section */}
              <div className="m-1 p-1">
                <div className="flex items-center mb-4">
                  <FaUserTie className="text-blue-500 mx-2 text-xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">About</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{user.about}</p>
              </div>

              {/* Skills Section */}
               <div className="m-1 p-1">
                <div className="flex items-center mb-4">
                  <FaCode className="text-blue-500 mx-2 text-3xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">Skills & Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(user.skills) ? (
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
                   <div className="m-1 p-1">
                  <div className="flex items-center mb-4">
                    <FaBriefcase className="text-blue-500 mx-2 text-3xl" />
                    <h2 className="text-2xl font-semibold text-gray-800">Work Experience</h2>
                  </div>
                  <div className="space-y-6 p-3">
                    {user.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-300 px-5 relative">
                        <div className="absolute -left-2.5 top-3 h-5 w-5 rounded-full bg-blue-500 border-4 border-white"></div>
                        <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
                        <div className="flex flex-wrap items-center text-gray-600 mt-1 gap-x-4 gap-y-1">
                          <span className="flex items-center">
                            <FaBuilding className="mr-1" /> {exp.company}
                          </span>
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mx-1" /> {exp.location}
                          </span>
                          <span>
                            {new Date(exp.from).toLocaleDateString()} - {exp.current ? "Present" : new Date(exp.to).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {user.education && user.education.length > 0 && (
                <div className="m-1 p-1">
                  <div className="flex items-center mb-4">
                    <FaGraduationCap className="text-blue-500 mx-2 text-3xl" />
                    <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
                  </div>
                  <div className="space-y-6 p-3">
                    {user.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-blue-300 px-5 relative">
                        <div className="absolute -left-2.5 top-3 h-5 w-5 rounded-full bg-blue-500 border-4 border-white"></div>
                        <h3 className="text-xl font-semibold text-gray-800">{edu.degree} in {edu.field}</h3>
                        <div className="flex flex-wrap items-center text-gray-600 mt-1 gap-x-4 gap-y-1">
                          <span className="flex items-center">
                            <FaSchool className="mx-1" /> {edu.school}
                          </span>
                          <span>
                            {new Date(edu.from).toLocaleDateString()} - {new Date(edu.to).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700 leading-relaxed">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullDetails;