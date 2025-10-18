// Frontend Component: src/components/PostDetailsModal.js
import React, { useState } from 'react';

const FreelancingDetailsModal = ({ post, onClose, onLike, onComment, onShare }) => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    onComment(post._id, comment);
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.description}</p>
        {post.price && <p className="text-green-600 font-bold mb-4">Price: ${post.price}</p>}
        <div className="flex space-x-4 mb-4">
          <button onClick={() => onLike(post._id)} className="flex items-center text-blue-500 hover:text-blue-700">
            Like ({post.likes?.length || 0})
          </button>
          <button onClick={() => onShare(post._id)} className="flex items-center text-green-500 hover:text-green-700">
            Share
          </button>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Comments:</h4>
          {post.comments?.map((c, i) => (
            <p key={i} className="text-gray-600">{c.text}</p>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
            Comment
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-red-500 hover:text-red-700">Close</button>
      </div>
    </div>
  );
};

export default FreelancingDetailsModal;