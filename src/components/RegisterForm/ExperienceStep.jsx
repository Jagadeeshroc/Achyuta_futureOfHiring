import { useState } from 'react';
import { motion } from 'framer-motion';
import ExperienceItem from './ExperienceItem';
import EducationItem from './EducationItem';
import { FiArrowRight, FiArrowLeft, FiPlus } from 'react-icons/fi';
import { MdWork, MdSchool } from 'react-icons/md';

const ExperienceStep = ({ formData, setFormData, prevStep, nextStep }) => {
  const [currentExperience, setCurrentExperience] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const [currentEducation, setCurrentEducation] = useState({
    school: '',
    degree: '',
    field: '',
    from: '',
    to: '',
    description: ''
  });

  const handleExperienceAdd = () => {
    if (currentExperience.title && currentExperience.company) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, currentExperience]
      }));
      setCurrentExperience({
        title: '',
        company: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: ''
      });
    }
  };

  const handleEducationAdd = () => {
    if (currentEducation.school && currentEducation.degree) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, currentEducation]
      }));
      setCurrentEducation({
        school: '',
        degree: '',
        field: '',
        from: '',
        to: '',
        description: ''
      });
    }
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setCurrentEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div className="space-y-6 p-2!">
      <h2 className="text-2xl font-bold text-gray-800 mb-3! ">Experience & Education</h2>
      
      {/* Experience Section */}
      <div>
        
        <div className="space-y-4 border-l-2 border-blue-200 p-3!">
          {formData.experience.map((exp, index) => (
            <ExperienceItem
              key={index}
              experience={exp}
              onRemove={() => handleRemoveExperience(index)}
            />
          ))}

          <div className="bg-white p-4! rounded-lg border border-dashed border-gray-300">
            <h4 className="font-medium mb-3!">Add New Experience</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={currentExperience.title}
                  onChange={handleExperienceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="  Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={currentExperience.company}
                  onChange={handleExperienceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="  Tech Corp Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={currentExperience.location}
                  onChange={handleExperienceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="  New York, NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    name="from"
                    value={currentExperience.from}
                    onChange={handleExperienceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {!currentExperience.current && (
                    <input
                      type="date"
                      name="to"
                      value={currentExperience.to}
                      onChange={handleExperienceChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="currentJob"
                    name="current"
                    checked={currentExperience.current}
                    onChange={handleExperienceChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="currentJob" className="m-2! block text-sm text-gray-700">
                    I currently work here
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1!">Description</label>
                <textarea
                  name="description"
                  value={currentExperience.description}
                  onChange={handleExperienceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="   Describe your responsibilities and achievements..."
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleExperienceAdd}
                className="p-2! bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FiPlus className="mr-1" />
                Add Experience
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3!">
          Education
        </h3>
        <div className="space-y-4 border-l-2 border-blue-200 p-3!">
          {formData.education.map((edu, index) => (
            <EducationItem
              key={index}
              education={edu}
              onRemove={() => handleRemoveEducation(index)}
            />
          ))}

          <div className="bg-white p-3! rounded-lg border border-dashed border-gray-300">
            <h4 className="font-medium m!-3">Add Education</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3!">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input
                  type="text"
                  name="school"
                  value={currentEducation.school}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="  University Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={currentEducation.degree}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="  Bachelor's Degree"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <input
                  type="text"
                  name="field"
                  value={currentEducation.field}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="  Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    name="from"
                    value={currentEducation.from}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="date"
                    name="to"
                    value={currentEducation.to}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentEducation.description}
                  onChange={handleEducationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="  Notable achievements, courses, etc..."
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleEducationAdd}
                className="p-2! bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FiPlus className="mr-1" />
                Add Education
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-3!">
        <button 
          onClick={prevStep} 
          className="m-3 p-2! bg-gray-200 text-gray-700 rounded-md! hover:bg-gray-300 transition-colors"
        >
          
          Back
        </button>
        <button 
          onClick={nextStep} 
          className="m-3 p-2! bg-blue-600 text-white rounded-md! hover:bg-blue-700 transition-colors flex items-center"
        >
          Next
          <FiArrowRight className="ml-1" />
        </button>
      </div>
    </motion.div>
  );
};

export default ExperienceStep;