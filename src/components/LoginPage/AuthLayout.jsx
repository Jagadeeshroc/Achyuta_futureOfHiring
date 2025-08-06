import { motion } from "framer-motion";
import { Outlet, useLocation, Link } from "react-router-dom";
import 'tailwindcss'; // Make sure to import Tailwind CSS correctly

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname.includes("login");

  // Blob animation variants
  const blobVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 0.2, scale: 1 },
  };

  // Card animation variants
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  // Logo animation variants
  const logoVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.5 }}
        className="fixed inset-0 overflow-hidden pointer-events-none"
      >
        {/* ... (keep your existing blob animations) ... */}
      </motion.div>

      {/* Main card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 p-5">
          <div className="p-8">
            {/* Logo/Branding - Updated with proper font handling */}
            <motion.div 
              className="flex justify-center mb-8"
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/" className="flex items-center space-x-2 cursor-pointer">
                <motion.div
                  variants={logoVariants}
                  className="w-10 h-10  flex items-center justify-center"
                >
                  <span className="text-purple-600 font-bold text-xl ">⚡</span>
                </motion.div>
                <h1 className="text-white text-2xl font=[Bungee_Tint] m-3" >
                  ACHYUTA
                </h1>
              </Link>
            </motion.div>

            {/* Content */}
            {children || <Outlet />}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-white/5 text-center border-t border-white/10">
            <p className="text-white/70 text-sm">
              {isLoginPage ? "Don't have an account? " : "Already have an account? "}
              <Link
                to={isLoginPage ? "/signup" : "/login"}
                className="text-white font-medium hover:underline transition-colors"
              >
                {isLoginPage ? "Sign up" : "Log in"}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;