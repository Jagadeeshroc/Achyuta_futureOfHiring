import { motion } from 'framer-motion';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { FiDollarSign, FiCalendar, FiUser, FiAward } from 'react-icons/fi';

const inputVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } })
};

export default function DetailsTab({
  formData,
  errors,
  handleChange,
  handleDateChange,
  handleSelectChange,
  jobTypes,
  experienceLevels
}) {
  return (
    <motion.div
      key="details"
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6 p-4"
    >
      <motion.div custom={0} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiDollarSign className="mr-2 text-indigo-600" />
          Salary Range
        </label>
        <input
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="e.g. $80,000 - $100,000 per year"
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
        />
      </motion.div>

      <motion.div custom={1} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiCalendar className="mr-2 text-indigo-600" />
          Application Deadline *
        </label>
        <DatePicker
          selected={formData.deadline}
          onChange={handleDateChange}
          minDate={new Date()}
          dateFormat="MMMM d, yyyy"
          className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-2 mb-3"
        />
        {errors.deadline && <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>}
      </motion.div>

      <motion.div custom={2} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiUser className="mr-2 text-indigo-600" />
          Experience Level
        </label>
       <Select
        options={experienceLevels}
        value={experienceLevels.find(opt => opt.value === formData.experienceRequired)}
        onChange={(selected) => handleSelectChange('experienceRequired', selected)}
        className="react-select-container mb-4"
        classNamePrefix="react-select"
        />

      </motion.div>

      <motion.div custom={3} variants={inputVariants}>
       <label className="block text-sm font-semibold text-gray-700 mb-1">
  {/* label text here */}
</label>
       <Select
        options={jobTypes}
        value={jobTypes.find(opt => opt.value === formData.type)}
        onChange={(selected) => handleSelectChange('type', selected)}
        className="react-select-container mb-4"
        classNamePrefix="react-select"
        />


      </motion.div>

      <motion.div custom={4} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiAward className="mr-2 text-indigo-600" />
          Job Requirements
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={4}
          placeholder="List the required qualifications, skills, and experience..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </motion.div>
    </motion.div>
  );
}


