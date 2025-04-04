import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaCode, FaGraduationCap, FaBriefcase, FaTools } from "react-icons/fa";
import "./index.css"; 

const FullDetails = () => {
  return (
    <div className="full-profile-container">
      <div className="full-profile-header">
        <Link to="/myprofile" className="back-button">
          &larr; Back to Profile
        </Link>
        <h1>Full Profile Details</h1>
      </div>

      <div className="full-profile-content">
        <div className="profile-intro">
          <div className="intro-left">
            <img
              src="https://media-hosting.imagekit.io//b66601905e134787/AChyuta.png?Expires=1837053793&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=NUMYiJKUd6n5r0NFviaEYAEeSN2n5km7VB1~qQppAyi~zOJpDZDsOpLcdlBlaD6fskIsbn-rFdI3JPUJoR8lfggtUtum2bn~B2iwkU~YHmvCURnna34ZCRG8D7zv3LKIj7rzYvw4e7eo272AbZA198~k2qqgtxPE5HzGtiUibgKQSwqxm~-~DqHxLP1EcshWKnu0qUgPNh-1UPHKmm~whGoviFpBFRjjJLdKjYxNBTtdIrZmtHs-2J2KeM8Sffwy-JuDc6FUT7YW1Qo3wEja3gjzeb69GW89MeAt2ZNTRYYDeixb5kPgx~Hez-nPpSFKqDnquO6ebmQdbzMZ4xuzrA__"
              alt="Profile"
              className="full-profile-image"
            />
          </div>
          <div className="intro-right">
            <h1>ROCKY</h1>
            <p className="profile-title">Web Developer | React Enthusiast</p>
            <p className="profile-location">Ananthapur, India</p>
            
            <div className="contact-info">
              <p><FaEnvelope className="contact-icon" /> jagadeeshvanganooru@gmail.com</p>
              <p><FaPhone className="contact-icon" /> +91 9949565677</p>
              <div className="social-links">
                <a href="https://linkedin.com/in/jagadeesh-vanganooru-117872336" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="social-icon" />
                </a>
                <a href="https://github.com/Jagadeeshroc" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <section className="profile-section">
            <h2><FaCode className="section-icon" /> Professional Summary</h2>
            <p>
              Passionate web developer with 3+ years of experience in building responsive and 
              user-friendly web applications. Specialized in React.js, JavaScript, and modern 
              frontend technologies. Strong problem-solving skills and a commitment to writing 
              clean, maintainable code.
            </p>
          </section>

          <section className="profile-section">
            <h2><FaGraduationCap className="section-icon" /> Education</h2>
            <div className="timeline">
              <div className="timeline-item">
                <h3>Bachelor of Technology in Computer Science</h3>
                <p className="timeline-meta">JNTU University • 2015 - 2019</p>
                <p>Graduated with honors, specialized in Web Technologies</p>
              </div>
              <div className="timeline-item">
                <h3>Advanced Certification in Full Stack Development</h3>
                <p className="timeline-meta">ABC Institute • 2020</p>
                <p>Completed with distinction</p>
              </div>
              <div className="timeline-item">
                <h3>Advanced Certification in Full Stack Development</h3>
                <p className="timeline-meta">ABC Institute • 2020</p>
                <p>Completed with distinction</p>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2><FaBriefcase className="section-icon" /> Work Experience</h2>
            <div className="timeline">
              <div className="timeline-item">
                <h3>Senior Frontend Developer</h3>
                <p className="timeline-meta">Tech Solutions Inc. • 2021 - Present</p>
                <ul>
                  <li>Lead the development of customer-facing React applications</li>
                  <li>Improved application performance by 40% through code optimization</li>
                  <li>Mentored junior developers and conducted code reviews</li>
                </ul>
              </div>
              <div className="timeline-item">
                <h3>Web Developer</h3>
                <p className="timeline-meta">Digital Creations • 2019 - 2021</p>
                <ul>
                  <li>Developed and maintained company websites and web applications</li>
                  <li>Implemented responsive designs for mobile compatibility</li>
                  <li>Collaborated with designers to create intuitive user interfaces</li>
                </ul>
                <div className="timeline-item">
                <h3>Web Developer</h3>
                <p className="timeline-meta">Digital Creations • 2019 - 2021</p>
                <ul>
                  <li>Developed and maintained company websites and web applications</li>
                  <li>Implemented responsive designs for mobile compatibility</li>
                  <li>Collaborated with designers to create intuitive user interfaces</li>
                </ul>
              </div>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h2><FaTools className="section-icon" /> Skills & Expertise</h2>
            <div className="skills-container">
              <div className="skill-category">
                <h3>Frontend</h3>
                <div className="skill-tags">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">JavaScript (ES6+)</span>
                  <span className="skill-tag">HTML5</span>
                  <span className="skill-tag">CSS3</span>
                  <span className="skill-tag">Tailwindcss</span>
                  <span className="skill-tag">Redux</span>
                  <span className="skill-tag">TypeScript</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h3>Backend</h3>
                <div className="skill-tags">
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">Express</span>
                  <span className="skill-tag">REST APIs</span>
                  <span className="skill-tag">MongoDB</span>
                </div>
              </div>
              
              <div className="skill-category">
                <h3>Tools & Other</h3>
                <div className="skill-tags">
                  <span className="skill-tag">Git</span>
                  <span className="skill-tag">Webpack</span>
                  <span className="skill-tag">Jest</span>
                  <span className="skill-tag">Figma</span>
                  <span className="skill-tag">Agile Methodologies</span>
                </div>
              </div>
            </div>
          </section>

          <section className="profile-section">
          <h2>Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
            <h3>Achyuta</h3>
            
              <p> Future Of Hiring..Full-featured online JobbyApplication with React frontend and Node.js backend</p>
              <button 
                className="project-link"
                onClick={() => {}}
              >
                View Project
              </button>
            </div>
            <div className="project-card">
              <h3>Protfolio</h3>
              <p>Full-featured online store with React frontend and Node.js backend</p>
              <button 
                className="project-link"
                onClick={() => {}}
              >
                View Project
              </button>
            </div>
            <div className="project-card">
              <h3>E-commerce Platform</h3>
              <p>Full-featured online store with React frontend and Node.js backend</p>
              <button 
                className="project-link"
                onClick={() => {}}
              >
                View Project
              </button>
            </div>
            <div className="project-card">
              <h3>Social Media Platform</h3>
              <p>Full-featured online store with React frontend and Node.js backend</p>
              <button 
                className="project-link"
                onClick={() => {}}
              >
                View Project
              </button>
            </div>
            {/* Repeat for other project cards */}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
};

export default FullDetails;