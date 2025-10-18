// src/components/FreelancingCard.jsx
import React from 'react';
import { FaThumbsUp, FaComment, FaDownload } from 'react-icons/fa';
// Assuming you already have Avatar component
import Avatar from '../ui/Avatar';

const FreelancingCard = ({ post, onLike, onCommentClick, onDownloadImage }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
      {/* Post Header */}
      <div className="flex items-center p-4 space-x-4 border-b border-gray-100">
        <Avatar user={post.user} size={48} />
        <div>
          <h3 className="font-semibold text-gray-900">
            {post.user?.name || post.user?.email || 'Unknown User'}
          </h3>
          <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="relative">
            <img
              src={post.image.startsWith('http') ? post.image : `/Uploads/${post.image}`}
              alt="Post"
              className="w-full h-60 object-cover rounded-lg mb-3"
            />
            <button
              onClick={() => onDownloadImage?.(post.image)}
              className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            >
              <FaDownload />
            </button>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex justify-around p-3 border-t border-gray-100 bg-gray-50">
        <button
          onClick={() => onLike?.(post._id)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <FaThumbsUp size={16} />
          <span>{post.likes.length} Likes</span>
        </button>

        <button
          onClick={() => onCommentClick?.(post._id)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <FaComment size={16} />
          <span>{post.comments.length} Comments</span>
        </button>
      </div>
    </div>
  );
};

export default FreelancingCard;
