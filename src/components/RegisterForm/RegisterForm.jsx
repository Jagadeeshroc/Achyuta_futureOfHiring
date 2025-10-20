// RegisterForm.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiAlertCircle } from 'react-icons/fi';
import ProgressSidebar from './ProgressSidebar';
import BasicInfoStep from './BasicInfoStep';
import ProfessionalStep from './ProfessionalStep';
import ExperienceStep from './ExperienceStep';
import CompleteProfileStep from './CompleteProfileStep';

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name?.trim()) errors.push('Full name is required');
    if (!formData.email?.trim()) errors.push('Email is required');
    if (!formData.password?.trim()) errors.push('Password is required');
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.push('Enter a valid email address');
    }
    if (formData.password && formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.push('Enter a valid phone number');
    }
    if (formData.experience?.some(exp => !exp.from)) {
      errors.push('All experience entries must have a start date');
    }
    if (formData.education?.some(edu => !edu.from)) {
      errors.push('All education entries must have a start date');
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name?.trim() || '');
      formDataToSend.append('email', formData.email?.trim() || '');
      formDataToSend.append('password', formData.password?.trim() || '');
      if (formData.phone?.trim()) formDataToSend.append('phone', formData.phone.trim());
      if (formData.avatar instanceof File) {
        formDataToSend.append('avatar', formData.avatar);
        console.log('Avatar file:', formData.avatar.name, formData.avatar.size, formData.avatar.type);
      } else {
        console.log('No valid avatar file selected');
      }
      if (formData.resume instanceof File) formDataToSend.append('resume', formData.resume);
      if (formData.headline?.trim()) formDataToSend.append('headline', formData.headline.trim());
      if (formData.about?.trim()) formDataToSend.append('about', formData.about.trim());
      if (formData.portfolio?.trim()) formDataToSend.append('portfolio', formData.portfolio.trim());
      if (formData.location?.trim()) formDataToSend.append('location', formData.location.trim());
      if (formData.skills?.length > 0) formDataToSend.append('skills', JSON.stringify(formData.skills));
      if (formData.socialLinks && Object.keys(formData.socialLinks).length > 0) {
        formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
      }
      if (formData.experience?.length > 0) {
        formDataToSend.append('experience', JSON.stringify(
          formData.experience.map(exp => ({
            ...exp,
            from: exp.from ? new Date(exp.from).toISOString() : null,
            to: exp.current ? null : (exp.to ? new Date(exp.to).toISOString() : null),
          }))
        ));
      }
      if (formData.education?.length > 0) {
        formDataToSend.append('education', JSON.stringify(
          formData.education.map(edu => ({
            ...edu,
            from: edu.from ? new Date(edu.from).toISOString() : null,
            to: edu.to ? new Date(edu.to).toISOString() : null,
          }))
        ));
      }
      formDataToSend.append('role', formData.role?.trim() || 'user');

      console.log('FormData entries:', Object.fromEntries(formDataToSend));

      const response = await axios.post('http://localhost:5000/api/auth/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3!">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <ProgressSidebar step={step} />
          <div className="p-8 md:w-2/3 overflow-y-auto max-h-screen">
            <ErrorDisplay error={error} />
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <BasicInfoStep 
                  formData={formData} 
                  handleChange={handleChange} 
                  nextStep={nextStep} 
                />
              )}
              {step === 2 && (
                <ProfessionalStep
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )}
              {step === 3 && (
                <ExperienceStep
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )}
              {step === 4 && (
                <CompleteProfileStep
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  isLoading={isLoading}
                  setError={setError}
                />
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function ErrorDisplay({ error }) {
  if (!error) return null;
  return (
    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
      <div className="flex items-center font-medium">
        <FiAlertCircle className="mr-2" />
        Please fix these issues:
      </div>
      <div className="mt-2 space-y-1">
        {error.split('\n').map((err, i) => (
          <p key={i} className="text-sm">• {err}</p>
        ))}
      </div>
    </div>
  );
}

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  headline: '',
  about: '',
  avatar: '',
  resume: null,
  portfolio: '',
  socialLinks: {},
  location: '',
  skills: [],
  experience: [],
  education: [],
  role: 'user',
};

export default RegisterForm;