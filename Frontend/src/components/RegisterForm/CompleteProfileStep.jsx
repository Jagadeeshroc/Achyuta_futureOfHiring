import { motion } from 'framer-motion';
import { FiUser, FiCheck, FiX, FiFileText, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';

const CompleteProfileStep = ({ formData, setFormData, prevStep, isLoading, setError }) => {
  const [avatarPreview, setAvatarPreview] = useState('');
  const [localError, setLocalError] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setLocalError('Avatar must be less than 5MB');
      setError('Avatar must be less than 5MB');
      e.target.value = '';
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLocalError('Only JPG, PNG, GIF, or WebP images are allowed');
      setError('Only JPG, PNG, GIF, or WebP images are allowed');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      setLocalError('Processing avatar...');
    };
    reader.onloadend = () => {
      if (reader.error) {
        setLocalError('Failed to process image');
        setError('Failed to process image');
        console.error('FileReader error:', reader.error);
        e.target.value = '';
        return;
      }
      setAvatarPreview(reader.result); // Base64 for preview only
      setFormData(prev => ({ ...prev, avatar: file })); // Store raw File
      console.log('Selected avatar:', file.name, file.size, file.type);
      setLocalError('');
      setError('');
    };
    reader.onerror = () => {
      setLocalError('Error reading file');
      setError('Error reading file');
      e.target.value = '';
    };
    reader.readAsDataURL(file); // For preview only
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(file.type)) {
      setLocalError('Only PDF, DOC, or DOCX files are allowed');
      setError('Only PDF, DOC, or DOCX files are allowed');
      e.target.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setLocalError('Resume must be less than 5MB');
      setError('Resume must be less than 5MB');
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, resume: file }));
    setLocalError('');
    setError('');
  };

  const calculateProfileStrength = () => {
    return Math.min(100, 
      10 + 
      (formData.name ? 5 : 0) +
      (formData.email ? 5 : 0) +
      ((formData.skills?.length || 0) * 3) + 
      (Object.keys(formData.socialLinks || {}).length * 5) +
      ((formData.experience?.length || 0) * 8) +
      ((formData.education?.length || 0) * 8) +
      (formData.about ? 10 : 0) +
      (formData.location ? 5 : 0) +
      (formData.resume ? 10 : 0) +
      (formData.avatar ? 5 : 0)
    );
  };

  return (
    <motion.div className="space-y-6 p-3!">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>
      {localError && <p className="text-red-500 text-sm mb-4">{localError}</p>}
      <div className="space-y-6 p-3!">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <div className="flex items-center space-x-6 p-2!">
            <div className="shrink-0">
              {avatarPreview ? (
                <img className="h-16 w-16 object-cover rounded-full" src={avatarPreview} alt="Profile" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <FiUser size={24} />
                </div>
              )}
            </div>
            <label className="block">
              <span className="sr-only ">Choose profile photo</span>
              <input 
                type="file" 
                onChange={handleAvatarChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mx-3"
              />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
          <textarea
            value={formData.about || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
            className="w-full p-2! border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-32"
            placeholder="Tell us about yourself..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-!">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              
            </div>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-2! border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="City, Country"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mt-2!">Upload Resume</label>
          <div className="flex items-center space-x-4 m-2!">
            {formData.resume ? (
              <div className="flex items-center bg-gray-100 p-2! rounded-lg">
                <FiFileText className="text-gray-600 mr-2" />
                <span className="text-gray-700">{formData.resume.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <label className="block">
                <input 
                  type="file" 
                  onChange={handleResumeChange}
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
            )}
          </div>
        </div>
        {formData.role === 'user' && (
          <div className="border border-gray-200 rounded-lg p-3! bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-2">Profile Strength</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${calculateProfileStrength()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {formData.about && formData.location && formData.resume && formData.skills?.length > 0 
                ? "Great job! Your profile is strong and will attract more opportunities."
                : "Complete more fields to increase your profile strength and visibility to employers."}
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-between pt-6">
        <motion.button
          type="button"
          onClick={prevStep}
          className="p-2! m-2! bg-gray-200 text-gray-700 rounded-md! hover:bg-gray-300 transition-colors"
        >
          Back
        </motion.button>
        <motion.button
          type="submit"
          disabled={isLoading}
          className="p-1! m-2! bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md! flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Creating Account...' : (
            <>
              <span cla>Complete Registration</span>
              <FiCheck className="mx-1" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CompleteProfileStep;