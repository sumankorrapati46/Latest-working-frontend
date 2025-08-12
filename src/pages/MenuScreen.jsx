import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/MenuScreen.css';

const MenuScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('main');

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const menuItems = [
    {
      id: 'home',
      title: 'Home',
      icon: '🏠',
      description: 'Return to main dashboard',
      path: '/',
      color: '#4ade80',
      bgColor: 'rgba(34, 197, 94, 0.3)'
    },
    {
      id: 'farmer-registry',
      title: 'Farmer Registry',
      icon: '👨‍🌾',
      description: 'Manage farmer registrations and profiles',
      path: '/farmer-registry',
      color: '#60a5fa',
      bgColor: 'rgba(59, 130, 246, 0.3)'
    },
    {
      id: 'crop-monitoring',
      title: 'Crop Monitoring',
      icon: '🌱',
      description: 'Track crop health and growth patterns',
      path: '/crop-monitoring',
      color: '#a78bfa',
      bgColor: 'rgba(168, 85, 247, 0.3)'
    },
    {
      id: 'reports-analytics',
      title: 'Reports & Analytics',
      icon: '📊',
      description: 'View detailed reports and insights',
      path: '/analytical-dashboard',
      color: '#fbbf24',
      bgColor: 'rgba(251, 191, 36, 0.3)'
    },
    {
      id: 'payments-subsidies',
      title: 'Payments & Subsidies',
      icon: '💰',
      description: 'Manage financial transactions and subsidies',
      path: '/payments',
      color: '#94a3b8',
      bgColor: 'rgba(148, 163, 184, 0.3)'
    },
    {
      id: 'support-help',
      title: 'Support & Help',
      icon: '🆘',
      description: 'Get assistance and documentation',
      path: '/support',
      color: '#f472b6',
      bgColor: 'rgba(244, 114, 182, 0.3)'
    }
  ];

  const quickActions = [
    {
      id: 'add-farmer',
      title: 'Add New Farmer',
      icon: '➕',
      action: () => navigate('/farmer-registration'),
      color: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.3)'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      icon: '📋',
      action: () => navigate('/reports'),
      color: '#818cf8',
      bgColor: 'rgba(129, 140, 248, 0.3)'
    }
  ];

  return (
    <div className={`menu-screen ${isVisible ? 'visible' : ''}`}>
      {/* Background with animated leaves */}
      <div className="menu-background">
        <div className="animated-leaves">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="leaf" style={{ '--delay': `${i * 0.2}s` }}>🍃</div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="menu-header">
        <div className="menu-header-content">
          <div className="menu-logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">DATE Agri Stack</span>
          </div>
          <div className="menu-header-calendar">
            <span className="calendar-icon"></span>
            <span className="calendar-date">{getCurrentDate()}</span>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="user-profile-card">
        <div className="profile-avatar">
          <span className="avatar-icon">👤</span>
          <div className="avatar-ring"></div>
        </div>
        <div className="profile-info">
          <h3 className="profile-name">
            {user?.name || 'User Name'}
          </h3>
          <p className="profile-role">
            {user?.role || 'Super Admin'}
          </p>
          <div className="profile-status">
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="menu-navigation">
        <h2 className="section-title">Main Navigation</h2>
        <div className="menu-grid">
                     {menuItems.map((item, index) => (
             <div
               key={item.id}
               className="menu-item"
               style={{ 
                 '--delay': `${index * 0.1}s`,
                 background: item.bgColor,
                 borderColor: item.bgColor.replace('0.3', '0.4')
               }}
               onClick={() => navigate(item.path)}
             >
               <div className="menu-item-icon" style={{ backgroundColor: item.color }}>
                 <span>{item.icon}</span>
               </div>
               <div className="menu-item-content">
                 <h3>{item.title}</h3>
                 <p>{item.description}</p>
               </div>
               <div className="menu-item-arrow">→</div>
             </div>
           ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
                     {quickActions.map((action, index) => (
             <button
               key={action.id}
               className="quick-action-btn"
               style={{ 
                 '--delay': `${index * 0.1}s`,
                 '--color': action.color,
                 background: action.bgColor,
                 borderColor: action.bgColor.replace('0.3', '0.4')
               }}
               onClick={action.action}
             >
               <span className="action-icon">{action.icon}</span>
               <span className="action-text">{action.title}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="logout-section">
        <button 
          className="logout-btn"
          onClick={handleLogout}
        >
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Already have an account? Sign In</span>
        </button>
      </div>

      {/* Footer */}
      <div className="menu-footer">
        <p className="footer-text">
          © 2024 DATE Agri Stack - Empowering Indian Agriculture
        </p>
      </div>
    </div>
  );
};

export default MenuScreen;
