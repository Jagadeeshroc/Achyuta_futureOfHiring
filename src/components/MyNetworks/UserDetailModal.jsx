// src/components/MyNetwork/UserDetailModal.jsx
import React from "react";
import { FaTimesCircle, FaBuilding, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const UserDetailModal = ({ isOpen, user, onClose, getAvatarUrl }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2!">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-3!">
        <div className="relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white rounded-full p-2! shadow-lg z-10 transition-all duration-300 hover:scale-110"
            onClick={onClose}
          >
            <FaTimesCircle size={24} />
          </button>
          
          <div className="p-3!">
            <div className="text-center mb-6 p-2!">
              <img
                src={getAvatarUrl(user.avatar)}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-blue-100"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
              <h2 className="text-2xl font-bold text-gray-900 ">
                {user.name}
              </h2>
              <p className="text-gray-600 ">{user.title}</p>
              
              {(user.company || user.location) && (
                <div className="flex flex-col gap-2 text-sm text-gray-500 ">
                  {user.company && (
                    <span className="flex items-center gap-2 justify-center m-1!">
                      <FaBuilding size={14} />
                      {user.company}
                    </span>
                  )}
                  {user.location && (
                    <span className="flex items-center gap-2 justify-center m-1!">
                      <FaMapMarkerAlt size={14} />
                      {user.location}
                    </span>
                  )}
                </div>
              )}
            </div>

            {user.bio && (
              <div className="mb-3! p-2!">
                <h3 className="font-semibold text-gray-900 m-2!">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {user.skills?.length > 0 && (
              <div className="mb-6 p-2!">
                <h3 className="font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 p-2! rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(user.email || user.phone) && (
              <div className="border-t p-2!">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-3 text-sm  p-2!">
                  {user.email && (
                    <p className="text-gray-600 flex items-center gap-2 m-1!">
                      <FaEnvelope className="text-blue-500" />
                      {user.email}
                    </p>
                  )}
                  {user.phone && (
                    <p className="text-gray-600 flex items-center gap-2 m-1!">
                      <FaPhone className="text-green-500" />
                      {user.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-row p-2! "> 
                  <button className="mt-4 w-full bg-blue-600 p-2! rounded-lg! hover:bg-blue-700 transition-all duration-300 m-2!  ">
                   <Link to='/messages ' className='text-white no-underline! '>Message </Link>
                    </button>
                    <button className="mt-4 w-full bg-red-400  py-1 px-3 rounded-lg! hover:bg-red-500 transition-all duration-300 m-2! ">
                   <Link to='/connection'className='text-white no-underline! '> UnFriend </Link>
                   </button>
                  </div>

                
                  
                 
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;