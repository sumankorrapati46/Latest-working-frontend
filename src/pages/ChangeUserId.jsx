import React, { useState } from 'react';
import { authAPI } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import logo from "../assets/rightlogo.png";

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
    <div className="login-page-container">
      <div className="login-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="login-page-info-panel">
          <div className="login-page-brand-header">
            <div className="login-page-brand-logo">
              <span className="login-page-brand-text">Date</span>
              <span className="login-page-brand-accent">Agri</span>
              <span className="login-page-brand-icon">🌿</span>
              <span className="login-page-brand-text">Stack</span>
            </div>
            <h1 className="login-page-main-title">India Farmer Registry</h1>
          </div>

          <div className="login-page-platform-info">
            <h2>User ID Management</h2>
            <p className="login-page-tagline">Update your User ID to keep your account secure and personalized</p>
          </div>

          {/* Feature Highlights */}
          <div className="login-page-features-grid">
            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🔐</div>
              <div className="login-page-feature-content">
                <h3>Secure Update</h3>
                <p>Change your User ID with enhanced security measures</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">⚡</div>
              <div className="login-page-feature-content">
                <h3>Quick Process</h3>
                <p>Update your User ID in just a few simple steps</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🛡️</div>
              <div className="login-page-feature-content">
                <h3>Account Protection</h3>
                <p>Your account remains secure during the update process</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">📱</div>
              <div className="login-page-feature-content">
                <h3>Multi-Device Access</h3>
                <p>Use your new User ID from any device</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">✅</div>
              <div className="login-page-feature-content">
                <h3>Instant Access</h3>
                <p>Access your account immediately after the update</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Change User ID Form */}
        <div className="login-page-form-section">
          <div className="login-page-card">
            {/* DATE Logo at Top */}
            <div className="login-page-date-logo-section">
              <img src={logo} alt="DATE Logo" className="login-page-date-logo" />
              <div className="login-page-date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            {/* Form Title Section */}
            <div className="login-page-login-type-section">
              <h3>Change User ID</h3>
              <p>Set a strong User ID to prevent unauthorized access to your account</p>
            </div>

            {/* Change User ID Form */}
            <form className="login-page-form">
              <div className="login-page-form-field">
                <label>
                  New User ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  placeholder="Enter new User ID"
                  className="login-page-form-input"
                />
              </div>

              <div className="login-page-form-field">
                <label>
                  Confirm User ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={confirmUserId}
                  onChange={(e) => setConfirmUserId(e.target.value)}
                  placeholder="Confirm new User ID"
                  className="login-page-form-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="login-page-actions-row">
                <button 
                  type="button" 
                  className="login-page-login-btn" 
                  onClick={handleChangeUserId}
                >
                  Change User ID
                </button>
              </div>
            </form>

            {/* Back to Login Link */}
            <div className="login-link">
              <p>Want to go back? <a href="/login">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserId; 