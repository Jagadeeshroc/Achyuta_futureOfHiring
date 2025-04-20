import React from 'react';
import { FaUser, FaEnvelope, FaLock, FaFingerprint, FaRocket, FaPalette, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GiSpiralShell, GiAbstract024 } from 'react-icons/gi';
import { IoMdColorWand } from 'react-icons/io';
import './index.css';
import { Link } from 'react-router-dom';

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false,
            isHovered: false,
            error: null,
            success: false,
            loading: false
        };
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            error: null // Clear error when user types
        });
    };

    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };

    toggleConfirmPasswordVisibility = () => {
        this.setState(prevState => ({
            showConfirmPassword: !prevState.showConfirmPassword
        }));
    };

    handleHover = () => {
        this.setState(prevState => ({
            isHovered: !prevState.isHovered
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ error: 'Passwords do not match' });
            return;
        }

        if (this.state.password.length < 4) {
            this.setState({ error: 'Password must be at least 8 characters' });
            return;
        }

        this.setState({ loading: true, error: null });

        try {
            const response = await fetch('https://backend-achyutanew.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    // Add other fields if needed
                    email: this.state.email
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            this.setState({ 
                success: true,
                loading: false,
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

            // Optionally redirect to login page
            // this.props.history.push('/login');

        } catch (error) {
            this.setState({ 
                error: error.message,
                loading: false
            });
        }
    };

    render() {
        const { 
            username, 
            email, 
            password, 
            confirmPassword, 
            showPassword, 
            showConfirmPassword, 
            isHovered, 
            error, 
            success,
            loading 
        } = this.state;

        return (
            <div className="registration-container">
                {/* Floating background elements */}
                <div className="floating-elements">
                    <GiSpiralShell className="floating-icon-1" />
                    <GiAbstract024 className="floating-icon-2" />
                    <div className="floating-circle-1"></div>
                    <div className="floating-circle-2"></div>
                    <div className="floating-circle-3"></div>
                </div>

                {/* Main card */}
                <div 
                    className={`registration-card ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={this.handleHover}
                    onMouseLeave={this.handleHover}
                >
                    {/* Header with animated icon */}
                    <div className="registration-header">
                        <div className="icon-container">
                            <FaRocket />
                        </div>
                        <h1 className="registration-title">ACHYUTA!</h1>
                        <p className="registration-subtitle">The Future of Hiring</p>
                    </div>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            Registration successful! Please login.
                        </div>
                    )}

                    <form className="registration-form" onSubmit={this.handleSubmit}>
                        {/* Username Field */}
                        <div className="input-group">
                            <div className="input-icon">
                                <FaUser />
                            </div>
                            <input 
                                type="text" 
                                name="username"
                                placeholder="Username" 
                                className="input-field"
                                value={username}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="input-group">
                            <div className="input-icon">
                                <FaEnvelope />
                            </div>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email Address" 
                                className="input-field"
                                value={email}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="input-group">
                            <div className="input-icon">
                                <FaLock />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="Password" 
                                className="input-field"
                                value={password}
                                onChange={this.handleInputChange}
                                required
                            />
                            <div 
                                className="password-toggle"
                                onClick={this.togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <div className="input-icon">
                                <FaFingerprint />
                            </div>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword"
                                placeholder="Confirm Password" 
                                className="input-field"
                                value={confirmPassword}
                                onChange={this.handleInputChange}
                                required
                            />
                            <div 
                                className="password-toggle"
                                onClick={this.toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </div>
                        </div>

                        {/* Register Button */}
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <span>Processing...</span>
                            ) : (
                                <>
                                    <IoMdColorWand className="button-icon" />
                                    <span>Create New Account</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <div className="divider-line"></div>
                            <div className="divider-text">OR CONTINUE WITH</div>
                        </div>
                        
                        {/* Social Login Buttons */}
                        <div className="social-buttons">
                            <button type="button" className="social-button facebook-button">
                             <a href="https://facebook.com" > <i className="fab fa-facebook-f social-icon"></i></a>  
                            </button>
                            <button type="button" className="social-button google-button">
                              <a href="https://myaccount.google.com/" > <i className="fab fa-google social-icon"></i></a>  
                            </button>
                            <button type="button" className="social-button github-button">
                            <a href="https://www.github.com">  
                            <i className="fab fa-github social-icon"></i>
                            </a>
                            
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <p className="login-link">
                        Already part of the crew?{' '}
                        <span>
                        <Link to='/login'> Sign in here </Link>
                        </span>
                    </p>
                </div>
            </div>
        );
    }
}

export default Registration;