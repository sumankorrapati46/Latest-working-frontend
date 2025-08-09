import React, { useState } from 'react';
import '../styles/Forms.css';

const DeleteModal = ({ item, type, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      await onConfirm({ ...item, reason });
      onClose();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemName = () => {
    if (type === 'farmer') {
      return item?.name || 'Farmer';
    } else if (type === 'employee') {
      return item?.name || 'Employee';
    }
    return 'Item';
  };

  const getItemDetails = () => {
    if (type === 'farmer') {
      return {
        name: item?.name,
        phone: item?.phone,
        state: item?.state,
        district: item?.district
      };
    } else if (type === 'employee') {
      return {
        name: item?.name,
        email: item?.email,
        phone: item?.phone,
        designation: item?.designation
      };
    }
    return {};
  };

  const details = getItemDetails();

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <div className="delete-modal-header">
          <h2>Confirm Delete</h2>
          <button className="delete-modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="delete-modal-warning">
          <div className="delete-modal-warning-icon">⚠️</div>
          <h3>Are you sure you want to delete this {type}?</h3>
          <p>This action cannot be undone.</p>
        </div>

        <div className="delete-modal-item-details">
          <h4>{getItemName()} Details:</h4>
          <div className="delete-modal-details-grid">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="delete-modal-detail-item">
                <span className="delete-modal-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span className="delete-modal-value">{value || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="delete-modal-form">
          <div className="delete-modal-form-group">
            <label htmlFor="reason">Reason for Deletion (Optional)</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for deletion..."
              rows="3"
            />
          </div>

          <div className="delete-modal-form-actions">
            <button 
              type="button" 
              className="delete-modal-btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="delete-modal-btn-danger"
              disabled={loading}
            >
              {loading ? 'Deleting...' : `Delete ${getItemName()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal; 