import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ChangeUserIdModal.css';

const ChangeUserIdModal = ({ isOpen, onClose, onSuccess, isInDashboard = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentUserId: '',
    newUserId: '',
    confirmUserId: ''
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
    if (!formData.currentUserId || !formData.newUserId || !formData.confirmUserId) {
      setError('All fields are required');
      return false;
    }
    
    if (formData.newUserId.length < 3) {
      setError('New User ID must be at least 3 characters long');
      return false;
    }
    
    if (formData.newUserId !== formData.confirmUserId) {
      setError('New User IDs do not match');
      return false;
    }
    
    if (formData.currentUserId === formData.newUserId) {
      setError('New User ID must be different from current User ID');
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
      // Here you would typically make an API call to change user ID
      // For now, we'll simulate a successful user ID change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('User ID changed successfully!');
      setFormData({
        currentUserId: '',
        newUserId: '',
        confirmUserId: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 2000);
      
    } catch (error) {
      setError('Failed to change User ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        currentUserId: '',
        newUserId: '',
        confirmUserId: ''
      });
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!isOpen) return null;

  // If used in dashboard, render without overlay
  if (isInDashboard) {
    return (
      <div className="change-userid-form-container">
        <div className="form-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-user-edit"></i>
            </div>
            <div className="header-text">
              <h2>Change User ID</h2>
              <p>Update your account user ID securely</p>
            </div>
          </div>
          <button
            className="form-close-btn"
            onClick={handleClose}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="change-userid-form">
          <div className="form-group">
            <label htmlFor="currentUserId">
              <i className="fas fa-user"></i>
              Current User ID
            </label>
            <input
              type="text"
              id="currentUserId"
              name="currentUserId"
              value={formData.currentUserId}
              onChange={handleInputChange}
              placeholder="Enter your current user ID"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newUserId">
              <i className="fas fa-user-plus"></i>
              New User ID
            </label>
            <input
              type="text"
              id="newUserId"
              name="newUserId"
              value={formData.newUserId}
              onChange={handleInputChange}
              placeholder="Enter your new user ID"
              disabled={isLoading}
              required
            />
            <div className="userid-hint">
              User ID must be at least 3 characters long
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmUserId">
              <i className="fas fa-check-circle"></i>
              Confirm New User ID
            </label>
            <input
              type="text"
              id="confirmUserId"
              name="confirmUserId"
              value={formData.confirmUserId}
              onChange={handleInputChange}
              placeholder="Confirm your new user ID"
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
                  Changing User ID...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Change User ID
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Original modal overlay rendering
  return (
    <div className="change-userid-modal-overlay">
      <div className="change-userid-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-user-edit"></i>
            </div>
            <div className="header-text">
              <h2>Change User ID</h2>
              <p>Update your account user ID securely</p>
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

        <form onSubmit={handleSubmit} className="change-userid-form">
          <div className="form-group">
            <label htmlFor="currentUserId">
              <i className="fas fa-user"></i>
              Current User ID
            </label>
            <input
              type="text"
              id="currentUserId"
              name="currentUserId"
              value={formData.currentUserId}
              onChange={handleInputChange}
              placeholder="Enter your current user ID"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newUserId">
              <i className="fas fa-user-plus"></i>
              New User ID
            </label>
            <input
              type="text"
              id="newUserId"
              name="newUserId"
              value={formData.newUserId}
              onChange={handleInputChange}
              placeholder="Enter your new user ID"
              disabled={isLoading}
              required
            />
            <div className="userid-hint">
              User ID must be at least 3 characters long
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmUserId">
              <i className="fas fa-check-circle"></i>
              Confirm New User ID
            </label>
            <input
              type="text"
              id="confirmUserId"
              name="confirmUserId"
              value={formData.confirmUserId}
              onChange={handleInputChange}
              placeholder="Confirm your new user ID"
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
                  Changing User ID...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Change User ID
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeUserIdModal;
