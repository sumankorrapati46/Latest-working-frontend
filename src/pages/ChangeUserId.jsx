import React, { useState } from 'react';
import { authAPI } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

 
const ChangeUserId = () => {
  const [newUserId, setNewUserId] = useState('');
  const [confirmUserId, setConfirmUserId] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

const handleChangeUserId = async () => {
  if (!newUserId || !confirmUserId) {
    setError('Both fields are required.'); 
    return;
  } else if (newUserId !== confirmUserId) {
    setError('User IDs do not match.');
    return;
  }

  setError('');

  try {
    await authAPI.changeUserId({ newUserName: newUserId, password: '' });

    alert(`User ID changed successfully to: ${newUserId}`);
    navigate('/login');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError('Failed to change User ID. Please try again.');
    }
  }
};

  return (
    <div className="change-userid-page-container">
      {/* Top Navigation Bar */}
      <nav className="change-userid-page-navbar">
        <div className="change-userid-page-logo">
          <span>DATE</span>
        </div>
        <div className="change-userid-page-nav-links">
          <a href="#dashboard">Dashboard</a>
          <span className="change-userid-page-nav-dot">•</span>
          <a href="#enrollment">Check Enrollment Status</a>
          <span className="change-userid-page-nav-dot">•</span>
          <a href="#csc">Login with CSC</a>
        </div>
      </nav>

      <div className="change-userid-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="change-userid-page-info-panel">
          <div className="change-userid-page-agri-stack-header">
            <h1 className="change-userid-page-agri-stack-title">
              <span className="change-userid-page-agri-text">Date</span>
              <span className="change-userid-page-agri-text">Agri</span>
              <span className="change-userid-page-leaf-icon">🌿</span>
              <span className="change-userid-page-stack-text">Stack</span>
            </h1>
            <h2 className="change-userid-page-registry-title">India Farmer Registry</h2>
          </div>
          <div className="change-userid-page-registry-info">
            <h3>Digital Agristack Transaction Enterprises</h3>
            <p className="change-userid-page-help-desk">
              Empowering Agricultural Excellence
            </p>
          </div>
          
          {/* Enhanced Agricultural Content */}
          <div className="change-userid-page-agricultural-highlights">
            <div className="change-userid-page-highlight-item">
              <span className="change-userid-page-highlight-icon">🌾</span>
              <div className="change-userid-page-highlight-content">
                <h4>Revolutionizing Indian Agriculture</h4>
                <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
              </div>
            </div>
            
            <div className="change-userid-page-highlight-item">
              <span className="change-userid-page-highlight-icon">📱</span>
              <div className="change-userid-page-highlight-content">
                <h4>Smart Farming Technology</h4>
                <p>AI-powered crop monitoring and precision agriculture tools</p>
              </div>
            </div>
            
            <div className="change-userid-page-highlight-item">
              <span className="change-userid-page-highlight-icon">💰</span>
              <div className="change-userid-page-highlight-content">
                <h4>Financial Inclusion</h4>
                <p>Direct benefit transfers and digital payment solutions</p>
              </div>
            </div>
            
            <div className="change-userid-page-highlight-item">
              <span className="change-userid-page-highlight-icon">🌱</span>
              <div className="change-userid-page-highlight-content">
                <h4>Sustainable Practices</h4>
                <p>Promoting eco-friendly farming and climate-smart agriculture</p>
              </div>
            </div>
            
            <div className="change-userid-page-highlight-item">
              <span className="change-userid-page-highlight-icon">🏆</span>
              <div className="change-userid-page-highlight-content">
                <h4>National Recognition</h4>
                <p>Government of India's flagship agricultural digitization initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Change User ID Form */}
        <div className="change-userid-page-form-section">
          <div className="change-userid-page-card">
            {/* DATE Logo at Top */}
            <div className="change-userid-page-date-logo-section">
              <div className="change-userid-page-date-logo">DATE</div>
              <div className="change-userid-page-date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            <div className="change-userid-page-content">
              <h2>User ID</h2>
              <h4 style={{textAlign: 'center', color: '#666', marginBottom: '1.5rem'}}>Set a strong User id to prevent unauthorized access to your account.</h4>
              <form>
                <div className="change-userid-page-form-field">
                  <label htmlFor="newUserId">New User ID</label>
                  <input
                    id="newUserId"
                    type="text"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                  />
                </div>
                <div className="change-userid-page-form-field">
                  <label htmlFor="confirmUserId">Confirm User ID</label>
                  <input
                    id="confirmUserId"
                    type="text"
                    value={confirmUserId}
                    onChange={(e) => setConfirmUserId(e.target.value)}
                  />
                </div>
                {error && <p className="change-userid-page-error-text">{error}</p>}
                <button className="change-userid-page-login-btn" onClick={handleChangeUserId}>
                  Change User ID
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserId; 