import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const BasicInfoStep = ({ formData, handleChange, nextStep }) => {
  return (
    <motion.div className="space-y-6 p-4!">
      <h2 className="text-2xl font-bold  text-gray-800 mb-6!">Basic Information</h2>
      
      <div className="space-y-6">
        <FormInput 
          placeholder="  jagadeesh"
          label=" Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
            className="block w-full p-1!  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
          
        />
        
        <FormInput 
        
          type="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jagadeesh@example.com"
           className="block w-full p-1!  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
        <FormInput 
          placeholder="+919949565677"
          label="Mobile No"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
           className="block w-full p-1!  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
          
        />
        <FormInput 
          placeholder="headline"
          label="Headline"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
            className="block w-full p-1!  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
          
        />
        <FormInput 
          placeholder="Portfolio link"
          label="Portfolio"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleChange}
            className="block w-full p-1!  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
          
        />
        
        <FormInput 
  
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
            className="block w-full p-1!  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
          minLength={6}
        />
        
        {/* Other basic fields */}
      </div>

      <div className="flex justify-end mt-3!">
        <motion.button
          type="button"
          onClick={nextStep}
          className=" bg-blue-600 rounded-md! text-white  flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors p-2! "
        >
          <span>Next</span>
          <FiArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Reusable FormInput component
const FormInput = ({ icon, label, ...props }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        {...props}
      />
    </div>
  </div>
);

export default BasicInfoStep;