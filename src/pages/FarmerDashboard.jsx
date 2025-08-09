import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import UserProfileDropdown from '../components/UserProfileDropdown';
import ThemeDropdown from '../components/ThemeDropdown';
import '../styles/Dashboard.css';

const FarmerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [farmerData, setFarmerData] = useState(null);

  useEffect(() => {
    // Check if user needs to change password
    if (user?.forcePasswordChange) {
      navigate('/change-password');
      return;
    }

    // Load farmer data
    loadFarmerData();
  }, [user, navigate]);

  const loadFarmerData = async () => {
    try {
      setLoading(true);
      // TODO: Add API call to load farmer-specific data
      // For now, use mock data
      setFarmerData({
        name: user?.name || 'Farmer Name',
        email: user?.email || user?.userName || 'farmer@example.com',
        phoneNumber: user?.phoneNumber || 'Not provided',
        kycStatus: 'PENDING',
        registrationDate: new Date().toLocaleDateString(),
        totalCrops: 0,
        pendingDocuments: 0
      });
    } catch (error) {
      console.error('Error loading farmer data:', error);
      setError('Failed to load farmer data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  if (loading) {
    return (
      <div className="farmer-dashboard-container">
        <div className="farmer-dashboard-loading-container">
          <div className="farmer-dashboard-loading-spinner"></div>
          <p>Loading farmer dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="farmer-dashboard-container">
        <div className="farmer-dashboard-error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Top Bar shared */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="logo-container">
            <div className="logo-icon" aria-hidden="true">
              <svg width="88" height="48" viewBox="0 0 88 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sunflowers logo">
                <g stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round">
                  <path d="M18 38 C18 46 18 54 18 62"/>
                  <path d="M44 38 C44 46 44 54 44 62"/>
                  <path d="M70 38 C70 46 70 54 70 62"/>
                </g>
                <g>
                  <g transform="translate(18 26)"><ellipse cx="0" cy="0" rx="5" ry="10" fill="#FACC15" stroke="#D97706" strokeWidth="2"/><circle cx="0" cy="0" r="8" fill="#8B5E3C" stroke="#A16207" strokeWidth="2"/></g>
                  <g transform="translate(44 24)"><ellipse cx="0" cy="0" rx="5" ry="10" fill="#FACC15" stroke="#D97706" strokeWidth="2"/><circle cx="0" cy="0" r="8" fill="#8B5E3C" stroke="#A16207" strokeWidth="2"/></g>
                  <g transform="translate(70 26)"><ellipse cx="0" cy="0" rx="5" ry="10" fill="#FACC15" stroke="#D97706" strokeWidth="2"/><circle cx="0" cy="0" r="8" fill="#8B5E3C" stroke="#A16207" strokeWidth="2"/></g>
                </g>
              </svg>
            </div>
            <div className="logo-text">
              <h1 className="logo-title">DATE Digital</h1>
              <p className="logo-subtitle">Agristack Platform</p>
            </div>
          </div>
          <div className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div className="top-bar-right">
          <ThemeDropdown />
          <UserProfileDropdown />
        </div>
      </div>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="farmer-dashboard-sidebar-header">
          <div className="farmer-dashboard-logo">
            <span className="farmer-dashboard-logo-text">DATE</span>
            <span className="farmer-dashboard-logo-subtitle">Digital Agristack</span>
          </div>
        </div>
        
        <nav className="farmer-dashboard-sidebar-nav">
          <div className="farmer-dashboard-nav-section">
            <h3>Farmer Dashboard</h3>
            <ul>
              <li className="farmer-dashboard-active">
                <span className="farmer-dashboard-nav-icon">🏠</span>
                <span>Dashboard</span>
              </li>
              <li>
                <span className="farmer-dashboard-nav-icon">👤</span>
                <span>My Profile</span>
              </li>
              <li>
                <span className="farmer-dashboard-nav-icon">🌾</span>
                <span>My Crops</span>
              </li>
              <li>
                <span className="farmer-dashboard-nav-icon">📋</span>
                <span>KYC Status</span>
              </li>
              <li>
                <span className="farmer-dashboard-nav-icon">📄</span>
                <span>Documents</span>
              </li>
              <li>
                <span className="farmer-dashboard-nav-icon">💰</span>
                <span>Benefits</span>
              </li>
              <li>
                <span className="farmer-dashboard-nav-icon">📞</span>
                <span>Support</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-content">
          <header className="dashboard-header">
            <div className="header-center">
              <div className="welcome-message">
                <h2 className="greeting">{getGreeting()}, {user?.name || user?.email || 'Farmer'}! 🎋</h2>
                <p className="welcome-text">Manage your agricultural profile</p>
              </div>
            </div>
          </header>

        {/* Dashboard Content */}
        <div className="farmer-dashboard-content">
          {/* Stats Cards */}
          <div className="farmer-dashboard-stats-grid">
            <div className="farmer-dashboard-stat-card">
              <div className="farmer-dashboard-stat-icon">🌾</div>
              <div className="farmer-dashboard-stat-content">
                <h3>Total Crops</h3>
                <p className="farmer-dashboard-stat-number">{farmerData?.totalCrops || 0}</p>
                <p className="farmer-dashboard-stat-label">Registered crops</p>
              </div>
            </div>
            
            <div className="farmer-dashboard-stat-card">
              <div className="farmer-dashboard-stat-icon">📋</div>
              <div className="farmer-dashboard-stat-content">
                <h3>KYC Status</h3>
                <p className={`farmer-dashboard-stat-number farmer-dashboard-status-${farmerData?.kycStatus?.toLowerCase()}`}>
                  {farmerData?.kycStatus || 'PENDING'}
                </p>
                <p className="farmer-dashboard-stat-label">Verification status</p>
              </div>
            </div>
            
            <div className="farmer-dashboard-stat-card">
              <div className="farmer-dashboard-stat-icon">📄</div>
              <div className="farmer-dashboard-stat-content">
                <h3>Pending Documents</h3>
                <p className="farmer-dashboard-stat-number">{farmerData?.pendingDocuments || 0}</p>
                <p className="farmer-dashboard-stat-label">Documents to upload</p>
              </div>
            </div>
            
            <div className="farmer-dashboard-stat-card">
              <div className="farmer-dashboard-stat-icon">💰</div>
              <div className="farmer-dashboard-stat-content">
                <h3>Benefits Received</h3>
                <p className="farmer-dashboard-stat-number">₹0</p>
                <p className="farmer-dashboard-stat-label">This month</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="farmer-dashboard-quick-actions">
            <h2>Quick Actions</h2>
            <div className="farmer-dashboard-actions-grid">
              <button className="farmer-dashboard-action-btn">
                <span className="farmer-dashboard-action-icon">📝</span>
                <span>Update Profile</span>
              </button>
              <button className="farmer-dashboard-action-btn">
                <span className="farmer-dashboard-action-icon">🌾</span>
                <span>Add New Crop</span>
              </button>
              <button className="farmer-dashboard-action-btn">
                <span className="farmer-dashboard-action-icon">📄</span>
                <span>Upload Documents</span>
              </button>
              <button className="farmer-dashboard-action-btn">
                <span className="farmer-dashboard-action-icon">📞</span>
                <span>Contact Support</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="farmer-dashboard-recent-activity">
            <h2>Recent Activity</h2>
            <div className="farmer-dashboard-activity-list">
              <div className="farmer-dashboard-activity-item">
                <div className="farmer-dashboard-activity-icon">✅</div>
                <div className="farmer-dashboard-activity-content">
                  <h4>Profile Updated</h4>
                  <p>Your profile information was updated successfully</p>
                  <span className="farmer-dashboard-activity-time">2 hours ago</span>
                </div>
              </div>
              
              <div className="farmer-dashboard-activity-item">
                <div className="farmer-dashboard-activity-icon">📋</div>
                <div className="farmer-dashboard-activity-content">
                  <h4>KYC Verification</h4>
                  <p>Your KYC documents are under review</p>
                  <span className="farmer-dashboard-activity-time">1 day ago</span>
                </div>
              </div>
              
              <div className="farmer-dashboard-activity-item">
                <div className="farmer-dashboard-activity-icon">🌾</div>
                <div className="farmer-dashboard-activity-content">
                  <h4>Crop Registration</h4>
                  <p>Wheat crop registered successfully</p>
                  <span className="farmer-dashboard-activity-time">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 