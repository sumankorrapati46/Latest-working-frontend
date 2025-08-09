// This page is used for force password change on first login
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api/apiService';

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

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="change-password-page-container">
      {/* Top Navigation Bar */}
      <nav className="change-password-page-navbar">
        <div className="change-password-page-logo">
          <span>DATE</span>
        </div>
        <div className="change-password-page-nav-links">
          <a href="#dashboard">Dashboard</a>
          <span className="change-password-page-nav-dot">•</span>
          <a href="#enrollment">Check Enrollment Status</a>
          <span className="change-password-page-nav-dot">•</span>
          <a href="#csc">Login with CSC</a>
        </div>
      </nav>

      <div className="change-password-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="change-password-page-info-panel">
          <div className="change-password-page-agri-stack-header">
            <h1 className="change-password-page-agri-stack-title">
              <span className="change-password-page-agri-text">Date</span>
              <span className="change-password-page-agri-text">Agri</span>
              <span className="change-password-page-leaf-icon">🌿</span>
              <span className="change-password-page-stack-text">Stack</span>
            </h1>
            <h2 className="change-password-page-registry-title">India Farmer Registry</h2>
          </div>
          <div className="change-password-page-registry-info">
            <h3>Digital Agristack Transaction Enterprises</h3>
            <p className="change-password-page-help-desk">
              Empowering Agricultural Excellence
            </p>
          </div>
          
          {/* Enhanced Agricultural Content */}
          <div className="change-password-page-agricultural-highlights">
            <div className="change-password-page-highlight-item">
              <span className="change-password-page-highlight-icon">🌾</span>
              <div className="change-password-page-highlight-content">
                <h4>Revolutionizing Indian Agriculture</h4>
                <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
              </div>
            </div>
            
            <div className="change-password-page-highlight-item">
              <span className="change-password-page-highlight-icon">📱</span>
              <div className="change-password-page-highlight-content">
                <h4>Smart Farming Technology</h4>
                <p>AI-powered crop monitoring and precision agriculture tools</p>
              </div>
            </div>
            
            <div className="change-password-page-highlight-item">
              <span className="change-password-page-highlight-icon">💰</span>
              <div className="change-password-page-highlight-content">
                <h4>Financial Inclusion</h4>
                <p>Direct benefit transfers and digital payment solutions</p>
              </div>
            </div>
            
            <div className="change-password-page-highlight-item">
              <span className="change-password-page-highlight-icon">🌱</span>
              <div className="change-password-page-highlight-content">
                <h4>Sustainable Practices</h4>
                <p>Promoting eco-friendly farming and climate-smart agriculture</p>
              </div>
            </div>
            
            <div className="change-password-page-highlight-item">
              <span className="change-password-page-highlight-icon">🏆</span>
              <div className="change-password-page-highlight-content">
                <h4>National Recognition</h4>
                <p>Government of India's flagship agricultural digitization initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Change Password Form */}
        <div className="change-password-page-form-section">
          <div className="change-password-page-card">
            {/* DATE Logo at Top */}
            <div className="change-password-page-date-logo-section">
              <div className="change-password-page-date-logo">DATE</div>
              <div className="change-password-page-date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            <div className="change-password-page-content">
              <h2>Change Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="change-password-page-form-field">
                  <label>New Password:</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter your new password"
                    disabled={!!success}
                  />
                  <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>
                    Password must be at least 6 characters, include an uppercase letter, a number, and an @ symbol.
                  </div>
                </div>
                <div className="change-password-page-form-field">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your new password"
                    disabled={!!success}
                  />
                </div>
                {error && <div className="change-password-page-error-text">{error}</div>}
                {success && <div className="change-password-page-success-text">{success}</div>}
                <button type="submit" className="change-password-page-login-btn" disabled={!!success}>
                  Change Password
                </button>
              </form>
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
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 