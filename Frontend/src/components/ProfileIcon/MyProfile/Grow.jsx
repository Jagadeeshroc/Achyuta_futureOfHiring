import { useEffect } from 'react';
import './Grow.css'; // We'll create this CSS file
import {Link} from 'react-router-dom'

const Grow = () => {
  useEffect(() => {
    // Animation trigger when component mounts
    const elements = document.querySelectorAll('.grow-fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('grow-animated');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }, []);

  return (
    <div className="grow-container">
      <button className='bg-blue-50 p-2 m-2 ' ><Link to='/myProfile'><span className='text-2xl no-underline!'>back</span></Link></button>
      {/* Business Sectors */}
      <section className="grow-sectors">
        <h2 className="grow-section-title grow-fade-in">Explore Business Sectors</h2>
        <div className="grow-sector-grid">
          {[
            { id: 1, name: 'Technology', icon: '💻', desc: 'Innovative solutions for tech startups and enterprises' },
            { id: 2, name: 'Retail', icon: '🛍️', desc: 'Boost your retail business with modern strategies' },
            { id: 3, name: 'Manufacturing', icon: '🏭', desc: 'Streamline production and increase efficiency' },
            { id: 4, name: 'Healthcare', icon: '🏥', desc: 'Solutions for medical practices and health tech' },
            { id: 5, name: 'Finance', icon: '💰', desc: 'Financial services and fintech innovations' },
            { id: 6, name: 'Education', icon: '🎓', desc: 'Tools for educational institutions and edtech' },
          ].map((sector, index) => (
            <div 
              key={sector.id} 
              className={`grow-sector-card grow-fade-in grow-delay-${index}`}
            >
              <div className="grow-sector-icon">{sector.icon}</div>
              <h3 className="grow-sector-name">{sector.name}</h3>
              <p className="grow-sector-desc">{sector.desc}</p>
              <button className="grow-sector-btn">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Trading Solutions */}
      <section className="grow-trading">
        <h2 className="grow-section-title grow-fade-in">Trading Solutions</h2>
        <div className="grow-trading-grid">
          <div className="grow-trading-card grow-fade-in">
            <h3>Global Market Access</h3>
            <p>Expand your reach with our international trading platforms</p>
          </div>
          <div className="grow-trading-card grow-fade-in grow-delay-1">
            <h3>Risk Management</h3>
            <p>Advanced tools to protect your trading business</p>
          </div>
          <div className="grow-trading-card grow-fade-in grow-delay-2">
            <h3>Real-time Analytics</h3>
            <p>Make informed decisions with live market data</p>
          </div>
        </div>
      </section>

      {/* Business Starter */}
      <section className="grow-starter">
        <div className="grow-starter-content grow-fade-in">
          <h2 className="grow-starter-title">Ready to Start Your Business Journey?</h2>
          <p className="grow-starter-subtitle">We provide everything you need to launch and grow successfully</p>
          <div className="grow-starter-features">
            <div className="grow-feature">
              <div className="grow-feature-icon">🚀</div>
              <p>Business Planning</p>
            </div>
            <div className="grow-feature">
              <div className="grow-feature-icon">📊</div>
              <p>Market Research</p>
            </div>
            <div className="grow-feature">
              <div className="grow-feature-icon">🤝</div>
              <p>Networking</p>
            </div>
            <div className="grow-feature">
              <div className="grow-feature-icon">📈</div>
              <p>Growth Strategies</p>
            </div>
          </div>
          <div className="grow-starter-cta">
            <button className="grow-primary-btn">Get Started Now</button>
          </div>
        </div>
        <div className="grow-starter-image grow-fade-in grow-delay-1">
          <img src="https://example.com/business-image.jpg" alt="Business growth" />
          <div className="grow-image-decoration"></div>
        </div>
      </section>

      {/* Growth Message */}
      <section className="grow-message grow-fade-in">
        <h2 className="grow-message-title">Growth Is A Journey</h2>
        <p className="grow-message-text">
          Every successful business starts with a single step. Whether you're just beginning or looking to expand, 
          we're here to support your growth at every stage.
        </p>
        <div className="grow-stats">
          <div className="grow-stat">
            <div className="grow-stat-number" data-target="95">0</div>
            <div className="grow-stat-label">Success Rate</div>
          </div>
          <div className="grow-stat">
            <div className="grow-stat-number" data-target="500">0</div>
            <div className="grow-stat-label">Businesses Helped</div>
          </div>
          <div className="grow-stat">
            <div className="grow-stat-number" data-target="24">0</div>
            <div className="grow-stat-label">Support Hours</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Grow;