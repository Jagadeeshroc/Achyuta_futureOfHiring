// Frontend Component: src/components/PostList.js
import React from 'react';

const FreelancingtList = ({ posts, onPostClick, onApply }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => onPostClick(post)}>
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">{post.title}</h3>
          <p className="text-gray-600 mb-4">{post.description.substring(0, 100)}...</p>
          {post.price && <p className="text-green-600 font-bold">Price: ${post.price}</p>}
          {post.isPremium && <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm">Premium</span>}
          <button onClick={(e) => { e.stopPropagation(); onApply(post._id); }} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Apply
          </button>
        </div>
      ))}
    </div>
  );
};

export default FreelancingtList;