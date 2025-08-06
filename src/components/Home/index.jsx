import React from "react";
import './index.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiBriefcase, FiDollarSign, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { Navigate  } from 'react-router-dom';
import Cookies from 'js-cookie';


class Home extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    this.state = {
      shouldRedirect: !token
    };
  }
  
  // Simple function to show alert when applying for a job
  applyJob = () => {
    alert("Applied successfully")
  }

  render() {

    if (this.state.shouldRedirect) {
      return <Navigate  to="/login" />;
    }
    // ========== ANIMATION CONFIGURATIONS ==========
    // Container animation settings (for staggered children animations)
    const containerVariants = {
      hidden: { opacity: 0 }, // Initial hidden state
      visible: {
        opacity: 1, // Fade in
        transition: {
          staggerChildren: 0.2, // Delay between child animations
          when: "beforeChildren" // Animate parent first
        }
      }
    };

    // Animation settings for individual items
    const itemVariants = {
      hidden: { y: 20, opacity: 0 }, // Start slightly below and invisible
      visible: {
        y: 0, // Move to normal position
        opacity: 1, // Fade in
        transition: {
          duration: 0.5 // Animation duration
        }
      }
    };

    // Hover effect for interactive elements
    const hoverEffect = {
      scale: 1.05, // Slightly enlarge on hover
      transition: { duration: 0.3 } // Smooth transition
    };
   const handleSearch = () => {
      const keyword = this.keywordInput.value;
      const location = this.locationInput.value;
      // Example: filter jobs or log to console
      console.log('Searching for:', keyword, location);
    }

    return (
      // Main container with animation properties
      <motion.div 
        className="home-container"
        initial="hidden" // Start with hidden state
        animate="visible" // Animate to visible state
        variants={containerVariants} // Apply container animation
      >

        <div className="logout-container">
        
        </div>


        {/* ========== HERO SECTION ========== */}
        <section className="hero-section">
          <div className="hero-content">
            {/* Animated heading */}
            <motion.h1 variants={itemVariants}>
              Find Your <span className="highlight">Dream</span> Job Today
            </motion.h1>
            
            {/* Animated subtitle */}
            <motion.p variants={itemVariants}>
              Join thousands of companies hiring the best talent on our platform
            </motion.p>
            
            {/* Search box with animation */}
            <motion.div variants={itemVariants} className="search-container">
              <div className="search-box ">
                
                <input type="text" placeholder="Job title, or company" />
                <input type="text" placeholder="Location" />
                {/* Animated search button with hover effect */}
                <motion.button 
                onClick={handleSearch}
                  whileHover={hoverEffect}
                  className="search-button"
                >
                  Search Jobs
                </motion.button>
              </div>
            </motion.div>
            
            {/* Statistics with animation */}
            <motion.div variants={itemVariants} className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Jobs Available</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Companies Hiring</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100K+</span>
                <span className="stat-label">Candidates Hired</span>
              </div>
            </motion.div>
          </div>
          
          {/* Hero image with slide-in animation */}
          <motion.div 
            className="hero-image"
            initial={{ x: 100, opacity: 0 }} // Start from right and invisible
            animate={{ x: 0, opacity: 1 }} // Slide to center and fade in
            transition={{ duration: 0.8 }} // Animation duration
          >
            <img src="src/assets/images/jagadeeshvanganooru@gmail.com.png" />
          </motion.div>
        </section>

        {/* ========== FEATURED JOBS SECTION ========== */}
        <section className="featured-jobs">
          <motion.h2 variants={itemVariants}>Featured Jobs</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle">
            Browse through our most recent job postings
          </motion.p>
          
          {/* Job cards container */}
          <div className="job-cards">
            {/* Map through 4 job listings (demo data) */}
            {[1, 2, 3, 4].map((job) => (
              <motion.div 
                key={job}
                className="job-card"
                variants={itemVariants} // Individual animation
                whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} // Lift on hover
              >
                <div className="job-header">
                  <div className="company-logo">
                    {/* Random placeholder image for demo */}
                    <img src={`https://picsum.photos/80/80?random=${job}`} alt="Company logo" />
                  </div>
                  <div className="job-meta">
                    <h3>Senior Frontend Developer</h3>
                    <p>TechCorp Inc.</p>
                  </div>
                </div>
                <div className="job-details">
                  <p><FiMapPin /> San Francisco, CA</p>
                  <p><FiDollarSign /> $120,000 - $150,000</p>
                  <p><FiClock /> Full-time</p>
                </div>
                <div className="job-footer">
                  <span className="job-type remote">Remote</span>
                  {/* Apply button with hover and click animations */}
                  <motion.button
                    whileHover={{ scale: 1.05 }} // Grow on hover
                    whileTap={{ scale: 0.95 }} // Shrink when clicked
                    className="apply-now-btn" 
                    onClick={this.applyJob} // Click handler
                  >
                    Apply Now <FiArrowRight />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* View all jobs link with hover animation */}
          <motion.div 
            variants={itemVariants}
            whileHover={hoverEffect}
            className="view-all-jobs"
          >
            <Link to="/jobs" className="view-all-link">
              View All Jobs <FiArrowRight />
            </Link>
          </motion.div>
        </section>

        {/* ========== HOW IT WORKS SECTION ========== */}
        <section className="how-it-works">
          <motion.h2 variants={itemVariants}>How It Works</motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle">
            Get your dream job in just 3 simple steps
          </motion.p>
          
          <div className="steps-container">
            {/* Step 1 */}
            <motion.div 
              className="step"
              variants={itemVariants}
              whileHover={hoverEffect}
            >
              <div className="step-number">1</div>
              <FiSearch className="step-icon" />
              <h3>Search Jobs</h3>
              <p>Find the perfect job that matches your skills and experience</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              className="step"
              variants={itemVariants}
              whileHover={hoverEffect}
            >
              <div className="step-number">2</div>
              <FiBriefcase className="step-icon" />
              <h3>Apply</h3>
              <p>Submit your application with just one click</p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              className="step"
              variants={itemVariants}
              whileHover={hoverEffect}
            >
              <div className="step-number">3</div>
              <FiDollarSign className="step-icon" />
              <h3>Get Hired</h3>
              <p>Start your new career journey with your dream company</p>
            </motion.div>
          </div>
        </section>

        {/* ========== CALL TO ACTION SECTION ========== */}
        <section className="cta-section">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 50 }} // Start invisible and slightly below
            whileInView={{ opacity: 1, y: 0 }} // Fade in and slide up when in view
            transition={{ duration: 0.6 }} // Animation duration
            viewport={{ once: true }} // Only animate once
          >
            <h2>Ready to find your dream job?</h2>
            <p className="para">Thousands of professionals who found their perfect matched in our platform</p>
            {/* Animated button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/jobs" className="cta-button">
                Browse Jobs 
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </motion.div>
    );
  }
}
 
export default Home;