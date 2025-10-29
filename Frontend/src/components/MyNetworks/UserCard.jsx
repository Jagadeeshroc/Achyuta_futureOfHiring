// src/components/MyNetwork/UserCard.jsx
import React from "react";
import { 
  FaCheck, 
  FaClock, 
  FaUserPlus, 
  FaSpinner, 
  FaTimes, 
  FaBuilding, 
  FaMapMarkerAlt 
} from "react-icons/fa";

const UserCard = ({ user, type, onAction, onCancel, getAvatarUrl, loadingRequests }) => (
  <div className="bg-gray rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-2!">
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4!">
        <img
          src={getAvatarUrl(user.avatar)}
          alt={user.name}
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-50 hover:ring-blue-100 transition-all duration-300"
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
        {type === "connected" && (
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
            <FaCheck size={12} />
          </div>
        )}
        {type === "sent" && (
          <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
            <FaClock size={12} />
          </div>
        )}
        {type === "request" && (
          <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-1 rounded-full shadow-lg">
            <FaUserPlus size={12} />
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-gray-900 text-lg mb-1">{user.name}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{user.title}</p>
      
      {(user.company || user.location) && (
        <div className="flex flex-col gap-1 text-xs text-gray-500 mb-3">
          {user.company && (
            <span className="flex items-center gap-1 justify-center">
              <FaBuilding size={10} />
              {user.company}
            </span>
          )}
          {user.location && (
            <span className="flex items-center gap-1 justify-center">
              <FaMapMarkerAlt size={10} />
              {user.location}
            </span>
          )}
        </div>
      )}
      
      {user.mutualConnections && (
        <p className="text-blue-600 text-xs font-medium mb-4">
          {user.mutualConnections} mutual connections
        </p>
      )}

      <div className="w-full space-y-2">
        {type === "recommended" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction(user._id);
            }}
            disabled={loadingRequests?.[user._id]}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {loadingRequests?.[user._id] ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaUserPlus />
            )}
            {loadingRequests?.[user._id] ? "Sending..." : "Connect"}
          </button>
        )}
        
        {type === "connected" && (
          <button className="w-full bg-green-50 text-green-700 py-2.5 rounded-xl font-semibold border border-green-200 flex items-center justify-center gap-2 hover:bg-green-100 transition-colors duration-300">
            <FaCheck />
            Connected
          </button>
        )}
        
        {type === "request" && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(user._id, "accept");
              }}
              disabled={loadingRequests?.[user._id]}
              className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingRequests?.[user._id] ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              Accept
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction(user._id, "reject");
              }}
              disabled={loadingRequests?.[user._id]}
              className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-semibold hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaTimes />
              Decline
            </button>
          </div>
        )}
        
        {type === "sent" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel(user._id);
            }}
            disabled={loadingRequests?.[user._id]}
            className="w-full bg-orange-50 text-orange-600 py-2.5 rounded-xl font-semibold border border-orange-200 hover:bg-orange-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loadingRequests?.[user._id] ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaTimes />
            )}
            {loadingRequests?.[user._id] ? "Canceling..." : "Cancel Request"}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default UserCard;