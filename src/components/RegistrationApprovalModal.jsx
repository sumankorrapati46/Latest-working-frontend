import React, { useState } from 'react';
import '../styles/RegistrationApproval.css';

const RegistrationApprovalModal = ({ 
  isOpen, 
  onClose, 
  registration, 
  onApprove, 
  onReject 
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !registration) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(registration.id);
      onClose();
    } catch (error) {
      console.error('Error approving registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };



  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'status-pending',
      'APPROVED': 'status-approved',
      'REJECTED': 'status-rejected'
    };
    
    return (
      <span className={`status-badge ${statusColors[status] || 'status-pending'}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'FARMER': 'role-farmer',
      'EMPLOYEE': 'role-employee',
      'FPO': 'role-fpo'
    };
    
    return (
      <span className={`role-badge ${roleColors[role] || 'role-default'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="registration-approval-modal-component">
      <div className="registration-approval-modal-overlay" onClick={onClose}></div>
      <div className="registration-approval-modal-content">
        <div className="registration-approval-modal-header">
          <h2>Registration Approval</h2>
          <button className="registration-approval-modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="registration-approval-modal-body">
          <div className="registration-approval-modal-registration-info">
            <div className="registration-approval-modal-info-row">
              <label>Registration ID:</label>
              <span>{registration.id}</span>
            </div>
            <div className="registration-approval-modal-info-row">
              <label>User Type:</label>
              {getRoleBadge(registration.role)}
            </div>
            <div className="registration-approval-modal-info-row">
              <label>Status:</label>
              {getStatusBadge(registration.status)}
            </div>
            <div className="registration-approval-modal-info-row">
              <label>Registration Date:</label>
              <span>{new Date(registration.registrationDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="registration-approval-modal-user-details">
            <h3>User Details</h3>
            <div className="registration-approval-modal-details-grid">
              <div className="registration-approval-modal-detail-item">
                <label>Full Name:</label>
                <span>{registration.fullName}</span>
              </div>
              <div className="registration-approval-modal-detail-item">
                <label>Email:</label>
                <span>{registration.email}</span>
              </div>
              <div className="registration-approval-modal-detail-item">
                <label>Phone:</label>
                <span>{registration.phone}</span>
              </div>
              <div className="registration-approval-modal-detail-item">
                <label>State:</label>
                <span>{registration.state}</span>
              </div>
              <div className="registration-approval-modal-detail-item">
                <label>District:</label>
                <span>{registration.district}</span>
              </div>
              {registration.role === 'FARMER' && (
                <>
                  <div className="registration-approval-modal-detail-item">
                    <label>Land Area:</label>
                    <span>{registration.landArea} acres</span>
                  </div>
                  <div className="registration-approval-modal-detail-item">
                    <label>Crop Type:</label>
                    <span>{registration.cropType}</span>
                  </div>
                </>
              )}
              {registration.role === 'EMPLOYEE' && (
                <>
                  <div className="registration-approval-modal-detail-item">
                    <label>Department:</label>
                    <span>{registration.department}</span>
                  </div>
                  <div className="registration-approval-modal-detail-item">
                    <label>Designation:</label>
                    <span>{registration.designation}</span>
                  </div>
                </>
              )}
              {registration.role === 'FPO' && (
                <>
                  <div className="registration-approval-modal-detail-item">
                    <label>Organization Name:</label>
                    <span>{registration.organizationName}</span>
                  </div>
                  <div className="registration-approval-modal-detail-item">
                    <label>Registration Number:</label>
                    <span>{registration.registrationNumber}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {registration.status === 'PENDING' && (
            <div className="registration-approval-modal-approval-actions">
              <h3>Approval Actions</h3>
              <div className="registration-approval-modal-action-buttons">
                <button 
                  className="registration-approval-modal-approve-btn"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Approving...' : 'Approve Registration'}
                </button>
                <button 
                  className="registration-approval-modal-reject-btn"
                  onClick={() => document.getElementById('rejection-reason').focus()}
                  disabled={isSubmitting}
                >
                  Reject Registration
                </button>
              </div>
              
              <div className="registration-approval-modal-rejection-reason">
                <label htmlFor="rejection-reason">Rejection Reason (Required for rejection):</label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows="3"
                />
              </div>
            </div>
          )}

          {registration.status === 'REJECTED' && (
            <div className="registration-approval-modal-rejection-info">
              <h3>Rejection Information</h3>
              <div className="registration-approval-modal-info-row">
                <label>Rejected By:</label>
                <span>{registration.rejectedBy}</span>
              </div>
              <div className="registration-approval-modal-info-row">
                <label>Rejection Date:</label>
                <span>{new Date(registration.rejectionDate).toLocaleDateString()}</span>
              </div>
              <div className="registration-approval-modal-info-row">
                <label>Rejection Reason:</label>
                <span className="registration-approval-modal-rejection-reason-text">{registration.rejectionReason}</span>
              </div>
            </div>
          )}

          {registration.status === 'APPROVED' && (
            <div className="registration-approval-modal-approval-info">
              <h3>Approval Information</h3>
              <div className="registration-approval-modal-info-row">
                <label>Approved By:</label>
                <span>{registration.approvedBy}</span>
              </div>
              <div className="registration-approval-modal-info-row">
                <label>Approval Date:</label>
                <span>{new Date(registration.approvalDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="registration-approval-modal-footer">
          <button className="registration-approval-modal-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationApprovalModal; 