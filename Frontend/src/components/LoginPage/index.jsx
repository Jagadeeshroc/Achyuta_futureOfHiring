import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-purple-300 to-indigo-300 flex items-center justify-center p-4">
      
      <div className="max-w-md w-full ">
        <div className="text-center  ">
          <h1 
            className="text-white text-6xl! font-bold"
            style={{ fontFamily: '"Bungee Tint", cursive' }}
          >
            Achyuta
          </h1>
        </div>
        
        {/* Login Card */}
        <div className="bg-transparent rounded-2xl shadow-xl overflow-hidden p-3!">
          {/* Decorative Header */}
          <div className=" p-3! text-center">
            <h1 className="text-3xl! font-bold text-white!"
             style={{ fontFamily: '"Shadows Into Light", cursive' }}
            >Welcome Back</h1>
            <p className="text-gray-900  font-bold  mt-2
            " style={{ fontFamily: '"Alumni Sans Pinstripe", cursive' }}>
            Sign in to your account</p>
          </div>
          
          {/* Login Form */}
          <div className="p-3!">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2!">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0  flex items-center pointer-events-none">
                  
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full p-1! border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="   Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2!">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0  flex items-center pointer-events-none">
                  
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full p-1!  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="   Enter your password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded m-2!"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 m-2!">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/profile" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 m-3! p-2! to-indigo-700 text-white  rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin  h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-3!">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                
                </div>
                <div className="relative flex justify-center text-sm mt-2!">
                  <span className="px-2  text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="m-3! grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-200">
                  <svg className="w-5 h-5 m-2!" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="m-2!">Google</span>
                </button>

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-200">
                <svg className="w-5 h-5 m-2!" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="m-2!">GitHub</span>
              </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8!">
          <p className="text-sm text-gray-500">
            © 2025 Rocs Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;