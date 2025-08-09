import React, { useState } from 'react';
import FarmerRegistrationForm from './FarmerRegistrationForm';
import '../styles/Forms.css';

const FarmerForm = ({ onClose, onSubmit, editData = null, isInDashboard = false }) => {
  const [showForm, setShowForm] = useState(true);

  const handleClose = () => {
    setShowForm(false);
    onClose && onClose();
  };

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      console.error('Error submitting farmer data:', error);
    }
  };

  if (!showForm) return null;

  // If in dashboard mode, render without modal overlay
  if (isInDashboard) {
    return (
      <FarmerRegistrationForm
        isInDashboard={true}
        editData={editData}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );
  }

  // Modal overlay for standalone use
  return (
    <div className="farmer-form-overlay">
      <div className="farmer-form-content farmer-modal">
        <div className="farmer-form-header">
          <h2>{editData ? 'Edit Farmer' : 'Add New Farmer'}</h2>
          <button className="farmer-form-close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="farmer-form-body">
          <FarmerRegistrationForm
            isInDashboard={true}
            editData={editData}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FarmerForm; 