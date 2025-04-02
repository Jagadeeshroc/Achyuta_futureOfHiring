import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons for visibility toggle
import './index.css';
import 'tailwindcss'

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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
    navigate('/Home', { replace: true }); // Use this instead of navigate
  };

  const onSubmitFailure = (msg) => {
    setShowSubmitError(true);
    setErrorMsg(msg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    const url = 'https://apis.ccbp.in/login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure(data.error_msg);
    }
  };

  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <br />
      <div className="password-input-container">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          className="password-input-field"
          value={password}
          onChange={onChangePassword}
        />
        <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      </div>
    </>
  );

  const renderUsernameField = () => (
    <>
      <label className="input-label" htmlFor="username">
        USERNAME
      </label>
      <br />
      <input
        type="text"
        id="username"
        className="username-input-field"
        value={username}
        onChange={onChangeUsername}
      />
    </>
  );

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken) {
    return <Navigate to="/Home" />; // Redirect to Home if already logged in
  }

  return (
    <div className="login-form-container">
      <div className="nxtTrend">
        <img
          src="https://media-hosting.imagekit.io/c5e76a3044894d12/Monochrome%20Brutalist%20Music%20Event%20Poster%20(1).png?Expires=1838045435&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=CZELZkjN9OcbiNzLQvQc18o3OtbbAtNpbn2agVclFcWiYVJYEt2KV9PAYrMOCRvVZAFYFyShnZ80fAf2qQYUQLbJz3fF8qYiwDNGz6KPQi-9e~JtSKVZRTJ22zeRYP4TB7XkZ3r2GVkJkkxJQbpWvw0OPghSF7RLzTC4ds1qvtt2y0fyCuekd9-LbAX98TFMXOcjbLxm0H~Bjr546N4cNBQAYaIPz7maMs7MLNh1~G4XnUT4ajPgADCpk6eKbXmeiRm06DLy6ng0sg4yudpLngG2v-j3GjqnEFH5C03Fq~uasLWUZboLDWeyLsdqQI~AkXJhPsNhkY3ofT0o5uhZiQ__"
          className="login-image"
          alt="website login"
        />
      </div>

      <div className="login-container">
        <form className="form-container" onSubmit={submitForm}>
          <div className="placeImg">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              className="login-website-logo-desktop-img"
              alt="website logo"
            />
          </div>
          <div className="conUser">
            <div className="input-container">{renderUsernameField()}</div>
            <div className="input-container">{renderPasswordField()}</div>
            <button type="submit" className="login-button">Login</button>
<button type="button" className="login-button" onClick={() => navigate('/SignUp')}>Register</button>

            {showSubmitError && <p className="error-message ">*{errorMsg}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
