import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthLayout from '../LoginPage/AuthLayout';
import GlassCard from '../LoginPage/GlassCard';
import FormInput from '../LoginPage/FormInput';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );
      const { token, user } = response.data;
      const normalizedUser = { ...user, _id: user._id || user.id };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      window.dispatchEvent(new Event('storage'));
      navigate('/home', { state: { user: normalizedUser } });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="max-w-md w-full p-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl md:text-4xl font-bold text-white mb-6 tracking-wide"
        >
          Welcome Back
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 text-red-100 text-center rounded-lg py-2 mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormInput
            icon={<EnvelopeIcon className="h-5 w-5 text-white/80" />}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white/20 text-white placeholder-white/70 focus:bg-white/30"
          />
          <FormInput
            icon={<LockClosedIcon className="h-5 w-5 text-white/80" />}
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white/20 text-white placeholder-white/70 focus:bg-white/30"
          />

          <div className="text-right">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/forgot-password')}
              className="text-white/80 text-sm cursor-pointer hover:text-white transition"
            >
              Forgot Password?
            </motion.span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white font-semibold shadow-lg shadow-amber-400/40 hover:scale-105 transition-all disabled:opacity-70"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-amber-300 cursor-pointer hover:text-amber-400 transition"
          >
            Sign Up
          </span>
        </p>
      </GlassCard>
    </AuthLayout>
  );
};

export default Login;
