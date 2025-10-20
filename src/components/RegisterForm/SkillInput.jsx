import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX } from 'react-icons/fi';

const skillSuggestions = [
  'JavaScript', 'React', 'Node.js', 'Python', 'UI/UX',
  'GraphQL', 'TypeScript', 'AWS', 'Docker', 'Machine Learning'
];

const SkillInput = ({ skills, setSkills }) => {
  const [currentSkill, setCurrentSkill] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSkillAdd = (skill) => {
    const skillToAdd = skill || currentSkill;
    if (skillToAdd && !skills.includes(skillToAdd)) {
      setSkills([...skills, skillToAdd]);
      setCurrentSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="relative m-2!">
      <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
      <div className="relative">
        <input
          type="text"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full m-2! p-2! border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Add your skills"
        />
        <button
          type="button"
          onClick={() => handleSkillAdd()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus />
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 absolute z-10 w-full"
          >
            <div className="grid grid-cols-2 gap-2">
              {skillSuggestions.map(skill => (
                <motion.button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillAdd(skill)}
                  className=" text-sm p-2! rounded-md! hover:bg-blue-50 transition-colors"
                ><span className='p-2!'>{skill}</span>
                </motion.button> 
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 min-h-12 m-2!">
        {skills.map(skill => (
          <motion.div
            key={skill}
            className="flex items-center bg-blue-100 px-2 py-1 rounded-md"
          >
            <span className="text-sm font-medium text-blue-900 p-1!">{skill}</span>
            <button
              type="button"
              onClick={() => handleSkillRemove(skill)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FiX size={14} className='m-2!' />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillInput;