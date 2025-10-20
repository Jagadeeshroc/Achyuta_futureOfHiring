import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const ProgressSidebar = ({ step }) => {
  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Professional Details' },
    { number: 3, title: 'Experience & Education' },
    { number: 4, title: 'Complete Profile' },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-600 to-purple-600 p-6 text-white md:w-1/3 flex flex-col justify-between p-3!">
      <div className="mb-8">
        <h1 className="text-3xl text-white!  mb-2!"
          style={{ fontFamily: '"Climate Crisis", cursive' }}
        >Join Our Community</h1>
        <p className="opacity-90">Create your complete profile in just a few steps</p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-8">
          {steps.map((stepItem) => (
            <motion.div 
              key={stepItem.number}
              className={`flex items-center ${step === stepItem.number ? 'opacity-100' : 'opacity-60'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${step === stepItem.number ? 'bg-white text-blue-600' : 'bg-white/20'}`}>
                {stepItem.number}
              </div>
              <div>
                <h3 className="font-medium m-2">{stepItem.title}</h3>
                <div className={`h-1 mt-1 rounded-full ${step > stepItem.number ? 'bg-white' : 'bg-white/30'} w-24`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
            <FiStar className="text-yellow-300 text-xl" />
          </div>
          <div>
            <h4 className="font-medium m-2!">Complete Profile Benefits</h4>
            <p className="text-sm opacity-80">Get 5x more visibility to employers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSidebar;