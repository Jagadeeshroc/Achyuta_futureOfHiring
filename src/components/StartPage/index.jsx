import { Link } from 'react-router-dom';
import './index.css'; // Create this CSS file for styling

const Page = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Job with Jobby</h1>
          <p className="hero-subtitle">Connecting talented professionals with top companies worldwide</p>
          
          <div className="cta-buttons">
            <Link to="/login" className="cta-button login-btn">Login</Link>
            <Link to="/signup" className="cta-button signup-btn">Sign Up</Link>
          </div>
        </div>
        
        <div className="hero-image">
          <img src="https://media-hosting.imagekit.io/e6d5c60e96cf49ca/Untitled%20design%20(7).png?Expires=1838115632&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=UMVSMdHPmGHljrcmrIw0pfMybehS3anPp1hVDm64ZSTv1kOT3TLBAsOA8kGu4wRK8dhp7h1wKHc8gJtB0Ov5IRhlwK6oU9GoezWlghLrQKAXtbvBteSeJBgaGMRLPzxh~kwhhOCS1ThzmRX47sJ4tV40tJV7anjzntGWlzC74V2gr3~hhG54CJlW1iCN~ZxSnI9MvVph-tOXwtXbKSwoj9~3mp23aXhDTh1lGCM8bWKQgWnM7fVUcQglUcX~tT3sX6d09WzHnqBWd4hZQsBJyBgqLgDthI02hmyLtZFsq8Z9EM3vzHy7yJRw2wIIwvKgU2vBTQDxVYxirDoGxnQtjQ__" 
               alt="Happy professionals at work" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Jobby?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>1000+ Jobs</h3>
            <p>Access thousands of job listings from top companies in your field.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Find the perfect job with our advanced filtering and matching system.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Search and apply for jobs anytime, anywhere from your mobile device.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">Success Stories</h2>
        <div className="testimonial-card">
          <p className="testimonial-text">
            "Jobby helped me find my ideal position in just two weeks! The application process was so smooth."
          </p>
          <p className="testimonial-author">- Sarah M., Marketing Director</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Ready to take the next step in your career?</h2>
        <Link to="/signup" className="cta-button main-cta">Get Started Now</Link>
      </section>
    </div>
  );
};

export default Page;