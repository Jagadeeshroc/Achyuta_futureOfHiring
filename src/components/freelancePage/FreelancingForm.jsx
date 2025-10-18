// Frontend Component: src/components/PostForm.js
import React, { useState } from 'react';

const FreelancingForm = ({ onSubmit, section }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isPremium, setIsPremium] = useState(false); // For paid features

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, price, type: section, isPremium });
    setTitle('');
    setDescription('');
    setPrice('');
    setIsPremium(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-col items-center space-y-4 md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
      <input
        type="number"
        placeholder="Price (if applicable)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <label className="flex items-center">
        <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="mr-2" />
        Premium (Paid)
      </label>
      <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300">
        Post
      </button>
    </form>
  );
};

export default FreelancingForm;