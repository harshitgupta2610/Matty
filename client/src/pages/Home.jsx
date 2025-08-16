import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: "🎨",
      title: "Drag & Drop Editor",
      description: "Create stunning designs with our intuitive drag-and-drop canvas editor"
    },
    {
      icon: "📱",
      title: "Multi-Format Export",
      description: "Export your designs in PNG, PDF, and multiple formats for any platform"
    },
    {
      icon: "☁️",
      title: "Cloud Storage",
      description: "Save and access your designs from anywhere with secure cloud storage"
    },
    {
      icon: "🚀",
      title: "Real-time Collaboration",
      description: "Work together with your team on designs in real-time"
    },
    {
      icon: "🎯",
      title: "Smart Templates",
      description: "Choose from hundreds of professional templates for any project"
    },
    {
      icon: "🔧",
      title: "Advanced Tools",
      description: "Access professional design tools including layers, effects, and typography"
    }
  ];

  return (
    <div className="home-container">
      {/* Navigation Header */}
      <nav className="home-nav">
        <div className="nav-brand">
          <div className="brand-icon">✨</div>
          <span className="brand-text">Matty AI</span>
        </div>
        
        <div className="nav-actions">
          <div className="time-display">
            {currentTime.toLocaleTimeString()}
          </div>
          {isLoggedIn ? (
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-link-primary">Register</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>

        <div className="hero-content">
          <br />
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🎨 The Future of Graphic Design is Here
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Matty AI
            <span className="title-gradient"> Design Tool</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            One powerful tool for all your graphic design needs. Create stunning posters, 
            banners, social media graphics, and more with our AI-powered design platform.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button onClick={handleGetStarted} className="btn-primary">
              <span className="btn-icon">🚀</span>
              Start Creating
            </button>
            <Link to="/login" className="btn-secondary">
              <span className="btn-icon">👤</span>
              Sign In
            </Link>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Designs Created</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Users</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Templates</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why Choose Matty AI?</h2>
            <p className="section-subtitle">
              Everything you need to create professional designs in one powerful platform
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="tools-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Professional Design Tools</h2>
            <p className="section-subtitle">
              Built with the latest web technologies for the best performance
            </p>
          </motion.div>

          <motion.div
            className="tools-grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="tool-item">
              <span className="tool-icon">⚛️</span>
              <span className="tool-name">React.js</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">🎨</span>
              <span className="tool-name">Exaclidraw</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">🍃</span>
              <span className="tool-name">MongoDB</span>
            </div>
            <div className="tool-item">
              <span className="tool-icon">☁️</span>
              <span className="tool-name">Cloudinary</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to Create Amazing Designs?</h2>
            <p className="cta-subtitle">
              Join thousands of designers who trust Matty AI for their creative projects
            </p>
            <motion.button
              onClick={handleGetStarted}
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">🎨</span>
              Start Designing Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon">✨</div>
            <span className="brand-text">Matty AI</span>
          </div>
          <p className="footer-text">
            &copy; 2025 Matty AI Design Tool. Built with ❤️ by Global Next Consulting India Pvt Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
