import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const EducationItem = ({ education = {}, onRemove }) => {
  // Safely destructure with defaults
  const { 
    degree = '', 
    field = '', 
    school = '', 
    from = '', 
    to = '', 
    description = '' 
  } = education;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative bg-gray-50 p-4 rounded-lg"
    >
      <div className="absolute -left-6 top-4 w-4 h-4 rounded-full bg-blue-500"></div>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{degree} {field && `in ${field}`}</h4>
          <p className="text-gray-600">{school}</p>
          <p className="text-sm text-gray-500">
            {from && new Date(from).toLocaleDateString()} - {to && new Date(to).toLocaleDateString()}
          </p>
          {description && (
            <p className="mt-2 text-gray-700">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FiX />
        </button>
      </div>
    </motion.div>
  );
};

export default EducationItem;