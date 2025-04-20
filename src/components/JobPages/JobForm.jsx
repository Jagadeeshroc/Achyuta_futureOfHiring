import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import 'tailwindcss'

export default function JobForm({ initialData = {}, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    company: initialData.company || '',
    location: initialData.location || '',
    description: initialData.description || '',
    requirements: initialData.requirements || '',
    salary: initialData.salary || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('You must be logged in to post jobs');
      }

      const payload = {
        ...formData,
        posted_by: userId
      };

      if (initialData.id) {
        await axios.put(`https://backend-achyutanew.onrender.com/jobs/${initialData.id}`, payload);
      } else {
        await axios.post('http://localhost:5000/jobs', payload);
      }
      
      onSuccess();
    navigate('/jobs');

    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md p-2">
      {/* Form fields remain exactly the same as in your original code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 p-1">Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 p-1">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 p-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 p-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 p-1">Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 p-1">Salary</label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-5"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 mb-5 "
        >
          {isSubmitting ? 'Submitting...' : initialData.id ? 'Update Job' : 'Post Job'}
        </button>
      </div>
    </form>
  );
}