import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiUser, FiDollarSign, FiClock } from 'react-icons/fi';
import JobTitle3D from './JobTittle3D.jsx';
import FloatingIcons from './FloatingIcons.jsx';

export default function JobPreview({ formData,
  show3DPreview,
  setShow3DPreview,
  handleSubmit,
  isSubmitting,
  initialData }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full m-1!"
    >
      <div className="p-3!">
        <h3 className="text-xl font-bold text-indigo-900 m-4!">Job Preview</h3>
{/* 
        <div className="mb-6">
          <button
            onClick={() => setShow3DPreview(!show3DPreview)}
            className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors mb-4"
          >
            {show3DPreview ? 'Hide 3D Preview' : '3D Preview'}
          </button>

          <AnimatePresence>
            {show3DPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="h-64 bg-gray-900 rounded-lg overflow-hidden">
                  <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <JobTitle3D title={formData.title} />
                    <FloatingIcons />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                  </Canvas>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}

        <div className="bg-white rounded-lg p-4 mb-6">
          <div>
            <h4 className="text-black">{formData.title || 'Job Title'}</h4>
            <p className="text-indigo-600">{formData.company || 'Company Name'}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {formData.location && (
              <span className="flex items-center text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <FiMapPin className="mr-1" /> {formData.location}
              </span>
            )}
            {formData.type && (
              <span className="flex items-center text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <FiBriefcase className="mr-1" /> {formData.type}
              </span>
            )}
            {formData.experienceRequired && (
              <span className="flex items-center text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <FiUser className="mr-1" /> {formData.experienceRequired}
              </span>
            )}
            {formData.salary && (
              <span className="flex items-center text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                <FiDollarSign className="mr-1" /> {formData.salary}
              </span>
            )}
          </div>

          {formData.deadline && (
            <div className="flex items-center text-sm text-gray-950 m-3">
              <FiClock className="mr-2" />
              Apply by:{' '}
              {formData.deadline.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}

          {formData.skillsRequired?.length > 0 && (
            <div className="pb-3">
              <h5 className="font-bold text-gray-700 mb-1">Required Skills:</h5>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.description && (
            <div className="pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">Job Description:</h5>
              <p className="text-sm text-gray-600 line-clamp-4">{formData.description}</p>
            </div>
          )}
        </div>
      </div>



      <div className="flex justify-end mt-4 px-4 pb-4">
  <motion.button
    onClick={handleSubmit}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Submitting...' : initialData?.id ? 'Update Job' : 'Post Job'}
  </motion.button>
</div>

    </motion.div>

    

  );
}
