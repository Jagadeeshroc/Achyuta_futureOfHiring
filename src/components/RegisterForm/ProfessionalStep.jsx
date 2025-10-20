import { useState } from 'react';
import { motion } from 'framer-motion';
import SkillInput from './SkillInput';
import SocialLinkInput from './SocialLinkInput';
import { FiUser, FiBriefcase, FiStar, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const ProfessionalStep = ({ formData, setFormData, prevStep, nextStep }) => {
  const roles = [
    { value: 'user', label: 'Job Seeker', icon: <FiUser className="mr-2" /> },
    { value: 'employer', label: 'Employer', icon: <FiBriefcase className="mr-2" /> },
    { value: 'admin', label: 'Admin', icon: <FiStar className="mr-2" /> }
  ];

  return (
    <motion.div className="space-y-6 p-3!">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2!">I am a</label>
          <div className="grid grid-cols-3 gap-4 p-2!">{roles.map((role) => (
              <motion.div key={role.value}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                  className={`w-full p-2! border rounded-lg flex items-center justify-center transition-all gap-2 ${formData.role === role.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-blue-300'}`}
                >
                  {role.icon} 

                  {role.label}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <SkillInput className="m-2! p-2!"
          skills={formData.skills} 
          setSkills={(skills) => setFormData(prev => ({ ...prev, skills }))} 
        />

        <SocialLinkInput className="m-2! p-2!"
          socialLinks={formData.socialLinks} 
          setSocialLinks={(socialLinks) => setFormData(prev => ({ ...prev, socialLinks }))} 
        />
      </div>

      <div className="flex justify-between pt-3!">
        <motion.button
          type="button"
          onClick={prevStep}
          className="p-2! m-2! bg-gray-200 text-gray-700 rounded-md! hover:bg-gray-300 transition-colors space-x-2"
        >
         <span>Back</span>
         
        </motion.button>
        <motion.button
          type="button"
          onClick={nextStep}
          className="m-2! p-2! bg-blue-600 text-white rounded-md! flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <span>Next</span>
          <FiArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfessionalStep;