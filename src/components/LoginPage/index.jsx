import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthLayout from '../LoginPage/AuthLayout';
import GlassCard from '../LoginPage/GlassCard';
import FormInput from '../LoginPage/FormInput';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', formData);

    console.log('Full login response:', response.data);

    const { token, user } = response.data;
     const normalizedUser = {
      ...user,
      _id: user._id || user.id, 
      id: user.id || user._id,
    };

    console.log('Normalized user:', normalizedUser);
    console.log('Normalized user._id:', normalizedUser._id);

    localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
localStorage.setItem('userId', normalizedUser._id || normalizedUser.id); // Optional chaining for safety
// Trigger an event to notify other components of the user change
    window.dispatchEvent(new Event('storage')); // Force localStorage update detection

    // Redirect to home or the intended page
    navigate('/home' , { state: { user: normalizedUser } });
  } catch (err) {
    setError(err.response?.data?.error || 'Login failed');
    // Clear any existing tokens on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  } finally {
    setLoading(false);
  }
};


  return (
    <AuthLayout>
      <GlassCard>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-8 text-white text-2xl font-medium m-4"
        >
          Welcome Back
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 mb-4 text-center text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 m-4">
          <FormInput
            icon={<EnvelopeIcon className="h-5 w-5" />}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            icon={<LockClosedIcon className="h-5 w-5" />}
            type="password"
            name="password"
             autoComplete="current-password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="text-right mb-2">
            <motion.span
              className="text-primary-400 cursor-pointer text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </motion.span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full py-3 px-6 text-white font-semibold shadow-lg shadow-primary-400/40 hover:from-primary-500 hover:to-secondary-500 transition-all disabled:opacity-70"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

      </GlassCard>
    </AuthLayout>
  );
};

export default Login;