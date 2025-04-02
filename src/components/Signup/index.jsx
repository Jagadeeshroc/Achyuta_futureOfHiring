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
            showPassword: false,
            showConfirmPassword: false,
            isHovered: false
        };
    }

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

    render() {
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
                    className={`registration-card ${this.state.isHovered ? 'hovered' : ''}`}
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
                    
                    <form className="registration-form">
                      

                        {/* Email Field */}
                        <div className="input-group">
                            <div className="input-icon">
                                <FaEnvelope />
                            </div>
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="input-field"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="input-group">
                            <div className="input-icon">
                                <FaLock />
                            </div>
                            <input 
                                type={this.state.showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                className="input-field"
                            />
                            <div 
                                className="password-toggle"
                                onClick={this.togglePasswordVisibility}
                            >
                                {this.state.showPassword ? (
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
                                type={this.state.showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm Password" 
                                className="input-field"
                            />
                            <div 
                                className="password-toggle"
                                onClick={this.toggleConfirmPasswordVisibility}
                            >
                                {this.state.showConfirmPassword ? (
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
                        >
                            <IoMdColorWand className="button-icon" />
                            <span>Create New Account</span>
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <div className="divider-line"></div>
                            <div className="divider-text">OR CONTINUE WITH</div>
                        </div>
                        
                        {/* Social Login Buttons */}
                        <div className="social-buttons">
                            <button className="social-button facebook-button">
                                <i className="fab fa-facebook-f social-icon"></i>
                            </button>
                            <button className="social-button google-button">
                                <i className="fab fa-google social-icon"></i>
                            </button>
                            <button className="social-button github-button">
                                <i className="fab fa-github social-icon"></i>
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