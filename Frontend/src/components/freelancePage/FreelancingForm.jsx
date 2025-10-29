import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

const FreelancingForm = ({ onSubmit, isSubmitting = false }) => {
  const [category, setCategory] = useState("job");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [attachments, setAttachments] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", category);
    formData.append("title", title);
    formData.append("description", description);
    
    if (budget) formData.append("budget", budget);
    if (price) formData.append("price", price);
    if (duration) formData.append("duration", duration);
    if (deliveryTime) formData.append("deliveryTime", deliveryTime);
    if (location) formData.append("location", location);
    
    // FIX: Send skills as JSON string instead of array
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim()).filter(s => s);
      formData.append("skills", JSON.stringify(skillsArray));
    }
    
    if (attachments) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
    }
    
    console.log("Form data prepared - Skills:", skills);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-3!">
      <div>
        <label className="block text-sm font-medium text-gray-700 m-1!">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2! focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="job">Job</option>
          <option value="service">Service</option>
          <option value="part-time">Part Time</option>
          <option value="private-work">Private Work</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 m-1!">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2! block w-full border border-gray-300 rounded-md p-2! focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="  e.g., Senior React Developer Needed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 m-1!">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="  Describe the job, service, or work in detail..."
          rows={2}  
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 m-1!">
          Skills (comma-separated)
          <span className="text-xs text-gray-500 ml-1">e.g., React, JavaScript, Node.js</span>
        </label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="p-2! block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="  React, JavaScript, CSS, Node.js"
        />
      </div>

      {/* Conditional Fields Based on Category */}
      {["job", "part-time"].includes(category) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 m-1!">Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="p-2! block w-full border border-gray-300 rounded-md  focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="  e.g., 5000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 m-1!">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className=" w-full border border-gray-300 rounded-md p-2! focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="  e.g., 3 months, 6 weeks"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 m-1!">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2! focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="  e.g., Remote, New York, Hybrid"
            />
          </div>
        </>
      )}

      {["service", "private-work"].includes(category) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 m-1!">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2! focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="  e.g., 500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 m-1!">Delivery Time</label>
            <input
              type="text"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2! focus:ring-indigo-500 focus:border-indigo-500"
              placeholder= "  e.g., 7 days, 2 weeks"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 m-1!">
          Attachments
          <span className="text-xs text-gray-500 ml-1">(images, PDF, DOC - max 5 files)</span>
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => setAttachments(e.target.files)}
          className="m-!1 block w-full border border-gray-300 rounded-md p-2! focus:ring-indigo-500 focus:border-indigo-500"
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
        />
        {attachments && (
          <p className="mt-1 text-sm text-gray-600">
            {attachments.length} file(s) selected
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full p-2! bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
        }`}
      >
        <FaUpload /> 
        {isSubmitting ? 'Creating Post...' : 'Submit Post'}
      </button>
    </form>
  );
};

export default FreelancingForm;