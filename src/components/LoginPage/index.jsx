import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import './index.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    });
    navigate('/Home', { replace: true });
  };

  const onSubmitFailure = (msg) => {
    setShowSubmitError(true);
    setErrorMsg(msg);
    setIsLoading(false);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const userDetails = { username, password };
    const url = 'http://localhost:5000/login';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        onSubmitSuccess(data.jwt_token);
      } else {
        onSubmitFailure(data.error_msg || 'Invalid username or password');
      }
    } catch (error) {
      onSubmitFailure('Network error. Please try again.');
    }
  };

  const renderPasswordField = () => (
    <div className="input-field password-field">
      <div className="input-icon">
        <FaLock />
      </div>
      <input
        type={showPassword ? 'text' : 'password'}
        id="password"
        placeholder="Enter your password"
        value={password}
        onChange={onChangePassword}
      />
      <div 
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </div>
    </div>
  );

  const renderUsernameField = () => (
    <div className="input-field">
      <div className="input-icon">
        <FaUser />
      </div>
      <input
        type="text"
        id="username"
        placeholder="Enter your username"
        value={username}
        onChange={onChangeUsername}
        className='userInput'
      />
    </div>
  );

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken) {
    return <Navigate to="/Home" />;
  }

  return (
    <div className="login-container">
      {/* Left side - Image */}
      <div className="login-image-container">
        <div className="image-wrapper">
          <img
            src="https://media-hosting.imagekit.io/c5e76a3044894d12/Monochrome%20Brutalist%20Music%20Event%20Poster%20(1).png?Expires=1838045435&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=CZELZkjN9OcbiNzLQvQc18o3OtbbAtNpbn2agVclFcWiYVJYEt2KV9PAYrMOCRvVZAFYFyShnZ80fAf2qQYUQLbJz3fF8qYiwDNGz6KPQi-9e~JtSKVZRTJ22zeRYP4TB7XkZ3r2GVkJkkxJQbpWvw0OPghSF7RLzTC4ds1qvtt2y0fyCuekd9-LbAX98TFMXOcjbLxm0H~Bjr546N4cNBQAYaIPz7maMs7MLNh1~G4XnUT4ajPgADCpk6eKbXmeiRm06DLy6ng0sg4yudpLngG2v-j3GjqnEFH5C03Fq~uasLWUZboLDWeyLsdqQI~AkXJhPsNhkY3ofT0o5uhZiQ__"
            alt="website login"
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="login-form-container">
        <div className="form-wrapper">
          <div className="form-header">
           <h1 className='name'>ACHYUTA</h1>
            <h2 className='name1'>Welcome Back</h2>
            <div >
            <p  >Sign in to your account</p>
            </div>
           
          </div>

          <form onSubmit={submitForm}>
            {renderUsernameField()}
            {renderPasswordField()}

            <div className="form-options">
              <div className="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In
                </span>
              ) : 'Sign in'}
            </button>

            <button
              type="button"
              className="create-account-button"
              onClick={() => navigate('/SignUp')}
            >
              Create an account
            </button>

            {showSubmitError && (
              <div className="error-message">
                {errorMsg}
              </div>
            )}
          </form>

          <div className="form-footer">
            <p>
              By signing in, you agree to our{' '}
              <a href="#">Terms of Service</a>{' '}
              and{' '}
              <a href="#">Privacy Policy</a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;