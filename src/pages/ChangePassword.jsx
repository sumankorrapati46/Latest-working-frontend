// This page is used for force password change on first login
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/apiService';
import logo from '../assets/rightlogo.png';

import '../styles/Login.css';

const ChangePassword = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    
    // Check password requirements
    const hasUpperCase = /[A-Z]/.test(form.newPassword);
    const hasNumber = /\d/.test(form.newPassword);
    const hasAtSymbol = /@/.test(form.newPassword);
    
    if (!hasUpperCase || !hasNumber || !hasAtSymbol) {
      setError('Password must include an uppercase letter, a number, and an @ symbol.');
      return;
    }
    try {
      console.log('Attempting to change password for user:', user?.email || user?.userName);
      
      // Use reset-password/confirm endpoint for first-time password change
      // This endpoint doesn't require current password
      const response = await api.post('/auth/reset-password/confirm', {
        emailOrPhone: user?.email || user?.userName,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword
      });
      console.log('Password change response:', response.data);
      
      setSuccess('Password changed successfully! Redirecting to dashboard...');
      
      // Update user data to remove forcePasswordChange flag
      const updatedUser = {
        ...user,
        forcePasswordChange: false
      };
      
      // Update localStorage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser, localStorage.getItem('token'));
      
      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        if (user.role === 'SUPER_ADMIN') {
          navigate('/super-admin/dashboard');
        } else if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'EMPLOYEE') {
          navigate('/employee/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      console.error('Password change error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Provide more specific error messages
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid password format. Please check the requirements.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('User not found. Please contact administrator.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to change password. Please try again.');
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
            <h2>Password Management</h2>
            <p className="login-page-tagline">Update your password to keep your account secure and protected</p>
          </div>

          {/* Feature Highlights */}
          <div className="login-page-features-grid">
            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🔐</div>
              <div className="login-page-feature-content">
                <h3>Secure Update</h3>
                <p>Change your password with enhanced security measures</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">⚡</div>
              <div className="login-page-feature-content">
                <h3>Quick Process</h3>
                <p>Update your password in just a few simple steps</p>
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
                <p>Use your new password from any device</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">✅</div>
              <div className="login-page-feature-content">
                <h3>Instant Access</h3>
                <p>Access your account immediately after update</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Change Password Form */}
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
              <h3>Change Password</h3>
              <p>Enter your new password to continue</p>
            </div>

            {/* Change Password Form */}
            <form onSubmit={handleSubmit} className="login-page-form">
              <div className="login-page-form-field">
                <label>New Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter your new password"
                  disabled={!!success}
                  className="login-page-form-input"
                />
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                  Password must be at least 6 characters, include an uppercase letter, a number, and an @ symbol.
                </div>
              </div>
              
              <div className="login-page-form-field">
                <label>Confirm New Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your new password"
                  disabled={!!success}
                  className="login-page-form-input"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="verification-success">{success}</div>}
              
              <div className="login-page-actions-row">
                <button type="submit" className="login-page-login-btn" disabled={!!success}>
                  Change Password
                </button>
              </div>
            </form>

            {/* Navigation Link */}
            <div className="login-link">
              <p>Want to go back? <a href="/dashboard">Back to Dashboard</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Success popup/modal */}
      {success && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
            <h2 style={{ color: '#22c55e', marginBottom: 12 }}>Password Changed!</h2>
            <p style={{ color: '#333', marginBottom: 18 }}>Your password has been updated successfully.<br/>Redirecting to your dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword; 