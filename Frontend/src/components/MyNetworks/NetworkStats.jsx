// src/components/MyNetwork/NetworkStats.jsx
import React from "react";
import { FaUserFriends, FaUserCheck, FaClock, FaUserPlus } from "react-icons/fa";

const NetworkStats = ({ 
  connectionsCount, 
  recommendationsCount, 
  pendingCount, 
  sentCount 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 m-4! p-2!">
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-2! text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">Connections</p>
          <p className="text-3xl font-bold">{connectionsCount}</p>
        </div>
        <FaUserFriends className="text-3xl opacity-80" />
      </div>
    </div>
    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-2! text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm font-medium">Recommendations</p>
          <p className="text-3xl font-bold">{recommendationsCount}</p>
        </div>
        <FaUserCheck className="text-3xl opacity-80" />
      </div>
    </div>
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-2! text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-100 text-sm font-medium">Pending Requests</p>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>
        <FaClock className="text-3xl opacity-80" />
      </div>
    </div>
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-2! text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-sm font-medium">Sent Requests</p>
          <p className="text-3xl font-bold">{sentCount}</p>
        </div>
        <FaUserPlus className="text-3xl opacity-80" />
      </div>
    </div>
  </div>
);

export default NetworkStats;