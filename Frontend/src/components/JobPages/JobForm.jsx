// JobForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BasicInfoTab from './BasicInfoTab';
import DetailsTab from './DetailsTab';
import RequirementsTab from './RequirementsTab';
import JobPreview from './JobPreview';
import TipsCard from './TipsCard';

export default function JobForm({ initialData = {}, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    company: initialData.company || '',
    location: initialData.location || '',
    description: initialData.description || '',
    requirements: initialData.requirements || '',
    salary: initialData.salary || '',
    type: initialData.type || 'Full-time',
    skillsRequired: initialData.skillsRequired || [],
    experienceRequired: initialData.experienceRequired || 'Entry-level',
    deadline: initialData.deadline ? new Date(initialData.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const tabOrder = ['basic', 'details', 'requirements','review'];
  const [popularSkills] = useState([
  { value: 'React', label: 'React' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'Express', label: 'Express' },
  { value: 'MongoDB', label: 'MongoDB' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'AWS', label: 'AWS' },
]);
const addSkill = () => {
  const skill = skillInput.trim();
  if (skill && !formData.skillsRequired.includes(skill)) {
    setFormData(prev => ({
      ...prev,
      skillsRequired: [...prev.skillsRequired, skill],
    }));
    setSkillInput('');
  }
};

const removeSkill = (skillToRemove) => {
  setFormData(prev => ({
    ...prev,
    skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove),
  }));
};

const handleMultiSelectChange = (field, selectedOptions) => {
  setFormData(prev => ({
    ...prev,
    [field]: selectedOptions.map(opt => opt.value),
  }));
};

const handleNext = () => {
  const currentIndex = tabOrder.indexOf(activeTab);
  if (currentIndex < tabOrder.length - 1) {
    setActiveTab(tabOrder[currentIndex + 1]);
  }
};

const handlePrevious = () => {
  const currentIndex = tabOrder.indexOf(activeTab);
  if (currentIndex > 0) {
    setActiveTab(tabOrder[currentIndex - 1]);
  }
};

  const validateForm = () => {
    let formErrors = {};
    if (!formData.title) formErrors.title = 'Job title is required';
    if (!formData.company) formErrors.company = 'Company name is required';
    if (!formData.description) formErrors.description = 'Description is required';
    if (!formData.deadline || formData.deadline < new Date()) {
      formErrors.deadline = 'Valid deadline is required';
    }
    return formErrors;
  };



  const jobTypes = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Freelance', label: 'Freelance' }
];

const experienceLevels = [
  { value: 'Entry-level', label: 'Entry-level' },
  { value: 'Mid-level', label: 'Mid-level' },
  { value: 'Senior-level', label: 'Senior-level' },
  { value: 'Director', label: 'Director' },
  { value: 'Executive', label: 'Executive' }
];

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleDateChange = (date) => {
  setFormData(prev => ({ ...prev, deadline: date }));
};

const handleSelectChange = (field, selectedOption) => {
  setFormData(prev => ({ ...prev, [field]: selectedOption.value }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("🚀 handleSubmit called");
    setIsSubmitting(true);
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('Please login to continue.');
      setIsSubmitting(false);
      navigate('/login');
      return;
    }

    const payload = {
      ...formData,
      posted_By: userId,
      deadline: formData.deadline.toISOString()
    };

    const config = {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };

   console.log("📦 Final Payload:", payload);
console.log("🔐 Config:", config);

try {
  if (initialData.id) {
    console.log("🛠 PUT request triggered");
    await axios.put(`http://localhost:5000/api/jobs/${initialData.id}`, payload, config);
  } else {
    console.log("🆕 POST request triggered");
    await axios.post('http://localhost:5000/api/jobs', payload, config);
  }

  console.log("✅ Job submitted successfully");

  if (onSuccess) onSuccess();
  navigate('/jobs');
} catch (error) {
  console.error("❌ Submission failed:", error);
  alert(error?.response?.data?.error || 'Submission failed.');
}
    setIsSubmitting(false);
  }
  console.log("🔄 FormData state:", formData)
  console.log("🔄 Active Tab:", activeTab
  );  



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">
            {initialData.id ? 'Update Job Posting' : 'Create a New Job Posting'}
          </h1>
          <p className="text-xl text-indigo-700 max-w-2xl mx-auto">
            {initialData.id
              ? 'Edit your job details to attract the best candidates'
              : 'Fill out the form below to post your job and reach qualified candidates'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <div className="max-w-2xl mx-auto m-3" >               
           <TipsCard />
          </div>
         
        </motion.div>


       

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                {tabOrder.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-all ${activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-indigo-500'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'basic' && (
                    <BasicInfoTab
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                  />
                  )}
                  {activeTab === 'details' && (
                    <DetailsTab
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    handleSelectChange={handleSelectChange}
                    jobTypes={jobTypes || []}
                    experienceLevels={experienceLevels || []}
                  />


                  )}
                  {activeTab === 'requirements' && (
                  <RequirementsTab
                    formData={formData}
                    handleChange={handleChange}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                    addSkill={addSkill}
                    removeSkill={removeSkill}
                    handleMultiSelectChange={handleMultiSelectChange}
                    popularSkills={popularSkills}
                  />
                  )}

                    {activeTab === 'review' && (
                    <JobPreview
                      formData={formData}
                      show3DPreview={show3DPreview}
                      setShow3DPreview={setShow3DPreview}
                      handleSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      initialData={initialData}
                    />
                  )}


                </AnimatePresence>
                <div className="flex justify-between mt-8">
                    {activeTab !== 'basic' ? (
                      <motion.button
                        type="button"
                        onClick={handlePrevious}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 m-2 bg-gray-400 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all text-black"
                      >
                        Previous
                      </motion.button>
                    ) : <div></div>}

                    {activeTab === 'review' ? (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="m-2 p-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Submitting...' : initialData.id ? 'Update Job' : 'Post Job'}
                          </motion.button>
                        ) : (
                          <motion.button
                            type="button"
                            onClick={handleNext}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 m-2 bg-indigo-500 text-white rounded-5xl! font-medium hover:bg-indigo-600 transition-all"
                          >
                            Next
                          </motion.button>
                        )}

                  </div>

              </div>
            </form>
          </div>
         
        </div>
      </div>
    </div>
  );
}
