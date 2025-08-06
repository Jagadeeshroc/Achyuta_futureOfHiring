import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiType } from 'react-icons/fi';
import Select from 'react-select';

const inputVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

const jobTypes = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Remote', label: 'Remote' },
];

export default function BasicInfoTab({ formData, errors, handleChange, handleSelectChange }) {
  return (
    <div className="space-y-6 p-4">
      <motion.div custom={0} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiBriefcase className="mr-2 text-indigo-600" />
          Job Title *
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Senior React Developer"
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </motion.div>

      <motion.div custom={1} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiBriefcase className="mr-2 text-indigo-600" />
          Company Name *
        </label>
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          placeholder="Your company name"
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
      </motion.div>

      <motion.div custom={2} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiMapPin className="mr-2 text-indigo-600" />
          Location
        </label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. New York, NY or Remote"
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      <motion.div custom={3} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
          <FiType className="mr-2 text-indigo-600" />
          Job Type
        </label>
        <Select
          options={jobTypes}
          value={jobTypes.find(opt => opt.value === formData.type)}
          onChange={(selected) => handleSelectChange('type', selected)}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </motion.div>

      <motion.div custom={4} variants={inputVariants}>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
    Job Description
  </label>
  <textarea
    id="description"
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows={4}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    placeholder="Describe the responsibilities, tech stack, and more..."
  />
  {errors.description && (
    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
  )}
      </motion.div>
    </div>
  );
}
