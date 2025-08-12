import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import logo from '../assets/rightlogo.png';

const ChangeUserIdPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentUserId: '',
    newUserId: '',
    confirmUserId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.newUserId !== formData.confirmUserId) {
      setError('New User IDs do not match');
      setLoading(false);
      return;
    }

    if (formData.newUserId.length < 3) {
      setError('New User ID must be at least 3 characters long');
      setLoading(false);
      return;
    }

    if (formData.newUserId === formData.currentUserId) {
      setError('New User ID must be different from current User ID');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('User ID changed successfully!');
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000);
    } catch (err) {
      setError('Failed to change User ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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
              <p>Update your account User ID</p>
            </div>

            {/* Change User ID Form */}
            <form onSubmit={handleSubmit} className="login-page-form">
              <div className="login-page-form-field">
                <label>Current User ID <span className="required">*</span></label>
                <input
                  type="text"
                  name="currentUserId"
                  value={formData.currentUserId}
                  onChange={handleChange}
                  required
                  placeholder="Enter your current User ID"
                  className="login-page-form-input"
                />
              </div>

              <div className="login-page-form-field">
                <label>New User ID <span className="required">*</span></label>
                <input
                  type="text"
                  name="newUserId"
                  value={formData.newUserId}
                  onChange={handleChange}
                  required
                  placeholder="Enter your new User ID"
                  className="login-page-form-input"
                />
                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
                  Must be at least 3 characters long
                </small>
              </div>

              <div className="login-page-form-field">
                <label>Confirm New User ID <span className="required">*</span></label>
                <input
                  type="text"
                  name="confirmUserId"
                  value={formData.confirmUserId}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your new User ID"
                  className="login-page-form-input"
                />
              </div>

              <div className="login-page-form-field">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password to confirm changes"
                  className="login-page-form-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="verification-success">{success}</div>}

              <div className="login-page-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleBack}
                  disabled={loading}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginRight: '15px',
                    minWidth: '120px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="login-page-login-btn"
                  disabled={loading}
                  style={{ minWidth: '120px' }}
                >
                  {loading ? 'Changing User ID...' : 'Change User ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserIdPage;

