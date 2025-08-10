import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Here you would typically make an API call to change password
      // For now, we'll simulate a successful password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 2000);
      
    } catch (error) {
      setError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-modal-overlay">
      <div className="change-password-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-key"></i>
            </div>
            <div className="header-text">
              <h2>Change Password</h2>
              <p>Update your account password securely</p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">
              <i className="fas fa-lock"></i>
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              <i className="fas fa-key"></i>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              disabled={isLoading}
              required
            />
            <div className="password-hint">
              Password must be at least 6 characters long
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-check-circle"></i>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              {success}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Changing Password...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
