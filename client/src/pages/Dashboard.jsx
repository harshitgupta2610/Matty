// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';
import { FaSun, FaMoon, FaCloudSun } from 'react-icons/fa';

// Import role-based components
import ManagerComponent from '../components/ManagerDashboard';
import CustomerComponent from '../components/CustomerDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return (
      <>
        <FaSun style={{ color: '#fbbf24', marginRight: '8px' }} />
        Good Morning
      </>
    );
    if (hour < 17) return (
      <>
        <FaCloudSun style={{ color: '#f59e0b', marginRight: '8px' }} />
        Good Afternoon
      </>
    );
    return (
      <>
        <FaMoon style={{ color: '#6366f1', marginRight: '8px' }} />
        Good Evening
      </>
    );
  };

  const getRoleIcon = () => {
    return role === 'customer' ? '🎨' : '👨‍💼';
  };

  const getRoleDisplay = () => {
    return role === 'customer' ? 'Designer' : 'Admin';
  };

  const getBrandInfo = () => {
    return {
      icon: '✨',
      text: 'Matty AI'
    };
  };

  const getWelcomeMessage = () => {
    if (role === 'customer') {
      return 'Ready to create amazing designs with our AI-powered tools?';
    }
    return 'Monitor user activity and manage the design platform today.';
  };

  // Role-based component rendering
  const renderRoleBasedContent = () => {
    switch (role) {
      case 'customer':
        return <CustomerComponent />;
      case 'manager':
        return <ManagerComponent />;
      default:
        return (
          <div className="unauthorized-access">
            <motion.div
              className="unauthorized-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="unauthorized-icon">🚫</div>
              <h2>Unauthorized Access</h2>
              <p>You don't have permission to access this dashboard.</p>
              <button onClick={handleLogout} className="btn-primary">
                Back to Login
              </button>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-background"></div>
        
        {/* Navigation Bar */}
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <div className="brand-icon">{getBrandInfo().icon}</div>
            <span className="brand-text">{getBrandInfo().text}</span>
          </div>
          
          <div className="nav-actions">
            <div className="time-display">
              {currentTime.toLocaleTimeString()}
            </div>
            
            <div className="profile-section">
              <button 
                className="profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {getRoleIcon()}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{name}</span>
                  <span className="profile-role">{getRoleDisplay()}</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">{getRoleIcon()}</div>
                      <div>
                        <div className="dropdown-name">{name}</div>
                        <div className="dropdown-email">{email}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    
                    {/* Role-based menu items */}
                    {role === 'customer' && (
                      <>
                        <button className="dropdown-item">
                          <span className="item-icon">🎨</span>
                          My Designs
                        </button>
                        <button className="dropdown-item">
                          <span className="item-icon">📊</span>
                          Templates
                        </button>
                      </>
                    )}
                    
                    {role === 'admin' && (
                      <>
                        <button className="dropdown-item">
                          <span className="item-icon">👥</span>
                          User Management
                        </button>
                        <button className="dropdown-item">
                          <span className="item-icon">📊</span>
                          Analytics
                        </button>
                        <button className="dropdown-item">
                          <span className="item-icon">🎨</span>
                          Template Management
                        </button>
                      </>
                    )}
                    
                    <button className="dropdown-item">
                      <span className="item-icon">⚙️</span>
                      Settings
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <span className="item-icon">🚪</span>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* Welcome Section */}
        <div className="welcome-section">
          <motion.div 
            className="welcome-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="welcome-title">
              {getGreeting()}, {name}! 
            </h1>
            <p className="welcome-subtitle">
              {getWelcomeMessage()}
            </p>
            <div className="welcome-stats">
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span className="stat-text">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👤</span>
                <span className="stat-text">
                  {getRoleDisplay()} Dashboard
                </span>
              </div>
            </div>
          </motion.div>
          
          <div className="header-decoration">
            <div className="decoration-line line-1"></div>
            <div className="decoration-line line-2"></div>
            <div className="decoration-line line-3"></div>
          </div>
        </div>
      </header>

      {/* Role-Based Main Content */}
      <main className="dashboard-main">
        {renderRoleBasedContent()}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>&copy; 2025 Matty AI Design Tool. Built with ❤️ by Global Next Consulting India Pvt Ltd.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
