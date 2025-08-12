import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import UserProfileDropdown from '../components/UserProfileDropdown';
import ThemeDropdown from '../components/ThemeDropdown';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeUserIdModal from '../components/ChangeUserIdModal';
import '../styles/Dashboard.css';

const FarmerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [farmerData, setFarmerData] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUserId, setShowChangeUserId] = useState(false);
  const [notification, setNotification] = useState(null);

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
      // For now, use mock data with all registration fields
      setFarmerData({
        // Personal Info
        salutation: 'Mr.',
        firstName: 'John',
        middleName: 'Kumar',
        lastName: 'Sharma',
        gender: 'Male',
        nationality: 'Indian',
        dateOfBirth: '1985-03-15',
        contactNumber: '+91 98765 43210',
        fatherName: 'Rajesh Sharma',
        alternativeType: 'Mobile',
        alternativeNumber: '+91 98765 43211',
        photo: null,
        
        // Address
        country: 'India',
        state: 'Maharashtra',
        district: 'Pune',
        block: 'Haveli',
        village: 'Wagholi',
        pincode: '412207',
        
        // Professional Details
        education: 'Graduate',
        experience: '15 years',
        
        // Current Crop Details
        currentSurveyNumber: 'SN001',
        currentLandHolding: '5.5 acres',
        currentGeoTag: '18.5204°N, 73.8567°E',
        currentCrop: 'Wheat',
        currentNetIncome: '₹75,000',
        currentSoilTest: 'Completed',
        currentSoilTestCertificateFileName: 'soil_test_current.pdf',
        
        // Proposed Crop Details
        proposedSurveyNumber: 'SN002',
        proposedLandHolding: '3.0 acres',
        proposedGeoTag: '18.5205°N, 73.8568°E',
        cropType: 'Sugarcane',
        netIncome: '₹1,20,000',
        proposedSoilTest: 'Pending',
        soilTestCertificate: null,
        
        // Irrigation Details
        currentWaterSource: 'Borewell',
        currentDischargeLPH: '500 LPH',
        currentSummerDischarge: '300 LPH',
        currentBorewellLocation: 'North-East corner',
        proposedWaterSource: 'Canal',
        proposedDischargeLPH: '800 LPH',
        proposedSummerDischarge: '600 LPH',
        proposedBorewellLocation: 'South-West corner',
        
        // Bank Details
        bankName: 'State Bank of India',
        accountNumber: '12345678901',
        branchName: 'Wagholi Branch',
        ifscCode: 'SBIN0001234',
        passbookFile: 'passbook.pdf',
        
        // Documents
        documentType: 'Aadhar Card',
        documentNumber: '1234-5678-9012',
        documentFileName: 'aadhar_card.pdf',
        
        // KYC Status
        kycStatus: 'PENDING',
        registrationDate: new Date().toLocaleDateString(),
        totalCrops: 2,
        pendingDocuments: 1,
        
        // KYC Assignment Details
        kycAssignment: {
          fieldOfficer: {
            name: 'Rajesh Kumar',
            designation: 'Field Officer',
            contactNumber: '+91 98765 43212',
            email: 'rajesh.kumar@dateagri.com',
            status: 'Assigned'
          },
          verificationOfficer: {
            name: 'Priya Sharma',
            designation: 'Verification Officer',
            contactNumber: '+91 98765 43213',
            email: 'priya.sharma@dateagri.com',
            status: 'Pending'
          }
        }
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

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'in progress':
        return 'status-pending';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading-container">
          <div className="dashboard-loading-spinner"></div>
          <p>Loading farmer dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error-container">
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
          <UserProfileDropdown 
            onLogout={logout}
            onShowChangePassword={() => setShowChangePassword(true)}
            onShowChangeUserId={() => setShowChangeUserId(true)}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">DATE</span>
            <span className="logo-subtitle">Digital Agristack</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>Farmer Dashboard</h3>
            <ul>
              <li className="nav-item active">
                <span className="nav-icon">🏠</span>
                <span>Home</span>
              </li>
              <li className="nav-item" onClick={() => navigate('/analytical-dashboard')}>
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">👤</span>
                <span>My Profile</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">🌾</span>
                <span>My Crops</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">📋</span>
                <span>KYC Status</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">📄</span>
                <span>Documents</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">💰</span>
                <span>Benefits</span>
              </li>
              <li className="nav-item">
                <span className="nav-icon">📞</span>
                <span>Support</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-content">
          {/* Modern Welcome Section */}
          <div className="modern-welcome-section">
            <div className="welcome-content">
              <div className="welcome-text">
                <h1 className="welcome-greeting">{getGreeting()}, {user?.name || user?.email || 'Farmer'}! 🎋</h1>
                <p className="welcome-subtitle">Welcome to your agricultural dashboard. Here's an overview of your profile and KYC status.</p>
              </div>
              <div className="welcome-actions">
                <button className="welcome-action-btn primary">
                  <span className="action-icon">📊</span>
                  View Reports
                </button>
                <button className="welcome-action-btn secondary">
                  <span className="action-icon">📞</span>
                  Get Support
                </button>
              </div>
            </div>
            <div className="welcome-visual">
              <div className="welcome-circle">
                <span className="welcome-emoji">🌾</span>
              </div>
            </div>
          </div>

          {/* Change Password Form - Priority Display */}
          {showChangePassword && user && (
            <div className="dashboard-form-container">
              <ChangePasswordModal
                user={user}
                isOpen={true}
                isInDashboard={true}
                onClose={() => setShowChangePassword(false)}
                onSuccess={() => {
                  setNotification('Password changed successfully!');
                  setShowChangePassword(false);
                  setTimeout(() => setNotification(null), 3000);
                }}
              />
            </div>
          )}

          {/* Change User ID Form - Priority Display */}
          {showChangeUserId && user && (
            <div className="dashboard-form-container">
              <ChangeUserIdModal
                user={user}
                isOpen={true}
                isInDashboard={true}
                onClose={() => setShowChangeUserId(false)}
                onSuccess={() => {
                  setNotification('User ID changed successfully!');
                  setShowChangeUserId(false);
                  setTimeout(() => setNotification(null), 3000);
                }}
              />
            </div>
          )}

          {/* Dashboard Content */}
          <div className="dashboard-sections">
            {/* Modern Stats Cards */}
            <div className="modern-stats-grid">
              <div className="modern-stat-card primary">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">🌾</span>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Total Crops</h3>
                  <p className="stat-number">{farmerData?.totalCrops || 0}</p>
                  <p className="stat-label">Registered crops</p>
                </div>
                <div className="stat-trend positive">
                  <span>↗</span>
                  <span>+2</span>
                </div>
              </div>
              
              <div className="modern-stat-card secondary">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">📋</span>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">KYC Status</h3>
                  <p className={`stat-number ${getStatusBadgeClass(farmerData?.kycStatus)}`}>
                    {farmerData?.kycStatus || 'PENDING'}
                  </p>
                  <p className="stat-label">Verification status</p>
                </div>
                <div className="stat-trend neutral">
                  <span>●</span>
                  <span>In Progress</span>
                </div>
              </div>
              
              <div className="modern-stat-card accent">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">📄</span>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Pending Documents</h3>
                  <p className="stat-number">{farmerData?.pendingDocuments || 0}</p>
                  <p className="stat-label">Documents to upload</p>
                </div>
                <div className="stat-trend warning">
                  <span>⚠</span>
                  <span>Action Required</span>
                </div>
              </div>
              
              <div className="modern-stat-card success">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">💰</span>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">Benefits Received</h3>
                  <p className="stat-number">₹0</p>
                  <p className="stat-label">This month</p>
                </div>
                <div className="stat-trend neutral">
                  <span>●</span>
                  <span>No Benefits</span>
                </div>
              </div>
            </div>

            {/* Profile Overview Section - Modern Design */}
            <div className="modern-section">
              <div className="section-header-modern">
                <div className="header-content">
                  <h2 className="section-title-modern">Profile Overview</h2>
                  <p className="section-subtitle-modern">Complete profile information from registration</p>
                </div>
                <div className="header-actions">
                  <button className="header-action-btn">
                    <span className="action-icon">📋</span>
                    Export PDF
                  </button>
                </div>
              </div>
              
              <div className="modern-profile-grid">
                {/* Personal Information */}
                <div className="modern-profile-card">
                  <div className="card-header">
                    <div className="card-icon personal">👤</div>
                    <h3 className="card-title">Personal Information</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <label>Full Name</label>
                      <span>{farmerData?.salutation} {farmerData?.firstName} {farmerData?.middleName} {farmerData?.lastName}</span>
                    </div>
                    <div className="info-row">
                      <label>Gender</label>
                      <span>{farmerData?.gender}</span>
                    </div>
                    <div className="info-row">
                      <label>Date of Birth</label>
                      <span>{farmerData?.dateOfBirth}</span>
                    </div>
                    <div className="info-row">
                      <label>Nationality</label>
                      <span>{farmerData?.nationality}</span>
                    </div>
                    <div className="info-row">
                      <label>Contact Number</label>
                      <span>{farmerData?.contactNumber}</span>
                    </div>
                    <div className="info-row">
                      <label>Father's Name</label>
                      <span>{farmerData?.fatherName}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="modern-profile-card">
                  <div className="card-header">
                    <div className="card-icon address">📍</div>
                    <h3 className="card-title">Address Information</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <label>Country</label>
                      <span>{farmerData?.country}</span>
                    </div>
                    <div className="info-row">
                      <label>State</label>
                      <span>{farmerData?.state}</span>
                    </div>
                    <div className="info-row">
                      <label>District</label>
                      <span>{farmerData?.district}</span>
                    </div>
                    <div className="info-row">
                      <label>Block</label>
                      <span>{farmerData?.block}</span>
                    </div>
                    <div className="info-row">
                      <label>Village</label>
                      <span>{farmerData?.village}</span>
                    </div>
                    <div className="info-row">
                      <label>Pincode</label>
                      <span>{farmerData?.pincode}</span>
                    </div>
                  </div>
                </div>

                {/* Current Crop Details */}
                <div className="modern-profile-card">
                  <div className="card-header">
                    <div className="card-icon crop">🌾</div>
                    <h3 className="card-title">Current Crop Details</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <label>Survey Number</label>
                      <span>{farmerData?.currentSurveyNumber}</span>
                    </div>
                    <div className="info-row">
                      <label>Land Holding</label>
                      <span>{farmerData?.currentLandHolding}</span>
                    </div>
                    <div className="info-row">
                      <label>Current Crop</label>
                      <span>{farmerData?.currentCrop}</span>
                    </div>
                    <div className="info-row">
                      <label>Net Income</label>
                      <span className="income-highlight">{farmerData?.currentNetIncome}</span>
                    </div>
                    <div className="info-row">
                      <label>Soil Test</label>
                      <span className={`status-badge ${farmerData?.currentSoilTest === 'Completed' ? 'completed' : 'pending'}`}>
                        {farmerData?.currentSoilTest}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Crop Details */}
                <div className="modern-profile-card">
                  <div className="card-header">
                    <div className="card-icon proposed">🌱</div>
                    <h3 className="card-title">Proposed Crop Details</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <label>Survey Number</label>
                      <span>{farmerData?.proposedSurveyNumber}</span>
                    </div>
                    <div className="info-row">
                      <label>Land Holding</label>
                      <span>{farmerData?.proposedLandHolding}</span>
                    </div>
                    <div className="info-row">
                      <label>Crop Type</label>
                      <span>{farmerData?.cropType}</span>
                    </div>
                    <div className="info-row">
                      <label>Expected Income</label>
                      <span className="income-highlight">{farmerData?.netIncome}</span>
                    </div>
                    <div className="info-row">
                      <label>Soil Test</label>
                      <span className={`status-badge ${farmerData?.proposedSoilTest === 'Completed' ? 'completed' : 'pending'}`}>
                        {farmerData?.proposedSoilTest}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KYC Process Assignment Section - Modern Design */}
            <div className="modern-section">
              <div className="section-header-modern">
                <div className="header-content">
                  <h2 className="section-title-modern">KYC Process Assignment</h2>
                  <p className="section-subtitle-modern">Staff assigned for your KYC verification process</p>
                </div>
                <div className="header-actions">
                  <button className="header-action-btn">
                    <span className="action-icon">📞</span>
                    Contact Support
                  </button>
                </div>
              </div>
              
              <div className="modern-kyc-grid">
                {/* Field Officer */}
                <div className="modern-kyc-card">
                  <div className="kyc-card-header">
                    <div className="kyc-avatar">
                      <span className="kyc-avatar-icon">👨‍💼</span>
                    </div>
                    <div className="kyc-info">
                      <h3 className="kyc-name">{farmerData?.kycAssignment?.fieldOfficer?.name}</h3>
                      <p className="kyc-designation">{farmerData?.kycAssignment?.fieldOfficer?.designation}</p>
                    </div>
                    <div className={`kyc-status ${getStatusBadgeClass(farmerData?.kycAssignment?.fieldOfficer?.status)}`}>
                      {farmerData?.kycAssignment?.fieldOfficer?.status}
                    </div>
                  </div>
                  <div className="kyc-card-content">
                    <div className="kyc-contact-item">
                      <span className="contact-icon">📱</span>
                      <span className="contact-label">Phone:</span>
                      <span className="contact-value">{farmerData?.kycAssignment?.fieldOfficer?.contactNumber}</span>
                    </div>
                    <div className="kyc-contact-item">
                      <span className="contact-icon">✉️</span>
                      <span className="contact-label">Email:</span>
                      <span className="contact-value">{farmerData?.kycAssignment?.fieldOfficer?.email}</span>
                    </div>
                  </div>
                  <div className="kyc-card-actions">
                    <button className="kyc-action-btn primary">Send Message</button>
                    <button className="kyc-action-btn secondary">View Details</button>
                  </div>
                </div>

                {/* Verification Officer */}
                <div className="modern-kyc-card">
                  <div className="kyc-card-header">
                    <div className="kyc-avatar">
                      <span className="kyc-avatar-icon">👩‍💼</span>
                    </div>
                    <div className="kyc-info">
                      <h3 className="kyc-name">{farmerData?.kycAssignment?.verificationOfficer?.name}</h3>
                      <p className="kyc-designation">{farmerData?.kycAssignment?.verificationOfficer?.designation}</p>
                    </div>
                    <div className={`kyc-status ${getStatusBadgeClass(farmerData?.kycAssignment?.verificationOfficer?.status)}`}>
                      {farmerData?.kycAssignment?.verificationOfficer?.status}
                    </div>
                  </div>
                  <div className="kyc-card-content">
                    <div className="kyc-contact-item">
                      <span className="contact-icon">📱</span>
                      <span className="contact-label">Phone:</span>
                      <span className="contact-value">{farmerData?.kycAssignment?.verificationOfficer?.contactNumber}</span>
                    </div>
                    <div className="kyc-contact-item">
                      <span className="contact-icon">✉️</span>
                      <span className="contact-label">Email:</span>
                      <span className="contact-value">{farmerData?.kycAssignment?.verificationOfficer?.email}</span>
                    </div>
                  </div>
                  <div className="kyc-card-actions">
                    <button className="kyc-action-btn primary">Send Message</button>
                    <button className="kyc-action-btn secondary">View Details</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Modern Design */}
            <div className="modern-section">
              <div className="section-header-modern">
                <div className="header-content">
                  <h2 className="section-title-modern">Quick Actions</h2>
                  <p className="section-subtitle-modern">Common actions for your account</p>
                </div>
              </div>
              
              <div className="modern-actions-grid">
                <button className="modern-action-card primary">
                  <div className="action-icon-wrapper">
                    <span className="action-icon">📝</span>
                  </div>
                  <h3>Update Profile</h3>
                  <p>Modify your personal and crop information</p>
                </button>
                
                <button className="modern-action-card secondary">
                  <div className="action-icon-wrapper">
                    <span className="action-icon">🌾</span>
                  </div>
                  <h3>Add New Crop</h3>
                  <p>Register additional crops to your profile</p>
                </button>
                
                <button className="modern-action-card accent">
                  <div className="action-icon-wrapper">
                    <span className="action-icon">📄</span>
                  </div>
                  <h3>Upload Documents</h3>
                  <p>Submit required documents for verification</p>
                </button>
                
                <button className="modern-action-card success">
                  <div className="action-icon-wrapper">
                    <span className="action-icon">📞</span>
                  </div>
                  <h3>Contact Support</h3>
                  <p>Get help from our support team</p>
                </button>
              </div>
            </div>

            {/* Recent Activity - Modern Design */}
            <div className="modern-section">
              <div className="section-header-modern">
                <div className="header-content">
                  <h2 className="section-title-modern">Recent Activity</h2>
                  <p className="section-subtitle-modern">Latest updates and activities</p>
                </div>
                <div className="header-actions">
                  <button className="header-action-btn">
                    <span className="action-icon">📊</span>
                    View All
                  </button>
                </div>
              </div>
              
              <div className="modern-activity-list">
                <div className="modern-activity-item">
                  <div className="activity-icon success">✅</div>
                  <div className="activity-content">
                    <h4 className="activity-title">Profile Updated</h4>
                    <p className="activity-text">Your profile information was updated successfully</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-status success">Completed</div>
                </div>
                
                <div className="modern-activity-item">
                  <div className="activity-icon pending">📋</div>
                  <div className="activity-content">
                    <h4 className="activity-title">KYC Verification</h4>
                    <p className="activity-text">Your KYC documents are under review</p>
                    <span className="activity-time">1 day ago</span>
                  </div>
                  <div className="activity-status pending">In Progress</div>
                </div>
                
                <div className="modern-activity-item">
                  <div className="activity-icon info">🌾</div>
                  <div className="activity-content">
                    <h4 className="activity-title">Crop Registration</h4>
                    <p className="activity-text">Wheat crop registered successfully</p>
                    <span className="activity-time">3 days ago</span>
                  </div>
                  <div className="activity-status success">Completed</div>
                </div>
              </div>
            </div>

            {/* Notification Toast */}
            {notification && (
              <div className="notification-toast success">
                <div className="notification-toast-content">
                  <i className="notification-icon">✅</i>
                  <span>{notification}</span>
                </div>
                <button 
                  className="notification-toast-close"
                  onClick={() => setNotification(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 