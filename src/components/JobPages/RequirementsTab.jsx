import { motion } from 'framer-motion';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FiAward, FiPlus, FiX } from 'react-icons/fi';

const animatedComponents = makeAnimated();

const inputVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } })
};

export default function RequirementsTab({
  formData,
  handleChange,
  skillInput,
  setSkillInput,
  addSkill,
  removeSkill,
  handleMultiSelectChange,
  popularSkills
}) {
  return (
    <motion.div
      key="requirements"
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6 p-4"
    >
      <motion.div custom={0} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiAward className="mr-2 text-indigo-600" />
          Requirements
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={4}
          placeholder="List the required qualifications, skills, and experience..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent "
        />
      </motion.div>

      <motion.div custom={1} variants={inputVariants}>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <FiAward className="mr-2 text-indigo-600" />
          Required Skills
        </label>

        <div className="flex mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill (e.g. React)"
            className="flex-1 p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addSkill}
            className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 transition-colors"
          >
            <FiPlus size={15} />
          </button>
        </div>

        

       <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 shadow-sm">
  {formData.skillsRequired.map((skill) => (
    <div
      key={skill}
      className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
    >
      {skill}
      <button
        type="button"
        onClick={() => removeSkill(skill)}
        className="ml-2 text-indigo-600 hover:text-indigo-900"
      >
        <FiX size={14} />
      </button>
    </div>
 

          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
