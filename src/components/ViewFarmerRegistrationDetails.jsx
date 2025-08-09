import React from 'react';
import '../styles/ViewFarmerDetails.css';

const ViewFarmerRegistrationDetails = ({ farmerData, onClose, isInDashboard = false, onFarmerSelect }) => {
  // Safety check to prevent rendering objects directly
  if (!farmerData || typeof farmerData !== 'object') {
    console.error('ViewFarmerRegistrationDetails: Invalid farmerData:', farmerData);
    return (
      <div className="modal-overlay">
        <div className="modal-content view-farmer-modal">
          <div className="modal-header">
            <h2>Farmer Details</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p>No farmer data available or invalid data format.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAddress = (address) => {
    if (!address) return 'Not provided';
    return `${address.village || ''} ${address.postOffice || ''} ${address.policeStation || ''} ${address.district || ''} ${address.state || ''} ${address.pincode || ''}`.trim();
  };

  // Helper function to safely render values
  const safeRender = (value) => {
    if (value === null || value === undefined) {
      return 'Not provided';
    }
    if (typeof value === 'object') {
      console.warn('ViewFarmerRegistrationDetails: Object found in value:', value);
      return 'Object (see console)';
    }
    return String(value);
  };

  // If in dashboard mode, render without modal overlay
  if (isInDashboard) {
    // Check if we're showing a single farmer's details or a list of farmers
    const isShowingSingleFarmer = !Array.isArray(farmerData);
    
    if (isShowingSingleFarmer) {
      // Show detailed view of a single farmer
      return (
        <div className="view-farmer-dashboard">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <h2 className="dashboard-title">Farmer Details</h2>
                <p className="dashboard-subtitle">Detailed information for {safeRender(farmerData.name)}</p>
              </div>
              <button
                className="back-button"
                onClick={onClose}
                type="button"
              >
                ← Back to List
              </button>
            </div>
          </div>
          
          <div className="dashboard-content">
            <div className="farmer-details-container">
              
              {/* Personal Information */}
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{safeRender(farmerData.name)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date of Birth:</label>
                    <span>{formatDate(farmerData.dateOfBirth)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Gender:</label>
                    <span>{safeRender(farmerData.gender)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Contact Number:</label>
                    <span>{safeRender(farmerData.contactNumber)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{safeRender(farmerData.email)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Father's Name:</label>
                    <span>{safeRender(farmerData.fatherName)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nationality:</label>
                    <span>{safeRender(farmerData.nationality)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Alternative Contact:</label>
                    <span>{safeRender(farmerData.alternativeContactNumber)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Alternative Relation:</label>
                    <span>{safeRender(farmerData.alternativeRelationType)}</span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="detail-section">
                <h3>Address Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>State:</label>
                    <span>{safeRender(farmerData.state)}</span>
                  </div>
                  <div className="detail-item">
                    <label>District:</label>
                    <span>{safeRender(farmerData.district)}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Complete Address:</label>
                    <span>{`${safeRender(farmerData.district)}, ${safeRender(farmerData.state)}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '')}</span>
                  </div>
                </div>
              </div>

              {/* Assignment Information */}
              <div className="detail-section">
                <h3>Assignment Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>KYC Status:</label>
                    <span className={`kyc-status-badge ${safeRender(farmerData.kycStatus)?.toLowerCase()}`}>
                      {safeRender(farmerData.kycStatus) || 'PENDING'}
                    </span>
                  </div>
                  {farmerData.assignedEmployee && (
                    <div className="detail-item">
                      <label>Assigned Employee:</label>
                      <span>{typeof farmerData.assignedEmployee === 'object' ? 
                        `${safeRender(farmerData.assignedEmployee.firstName)} ${safeRender(farmerData.assignedEmployee.lastName)}` : 
                        safeRender(farmerData.assignedEmployee)}</span>
                    </div>
                  )}
                  {farmerData.assignedEmployeeId && (
                    <div className="detail-item">
                      <label>Assigned Employee ID:</label>
                      <span>{safeRender(farmerData.assignedEmployeeId)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Show list of all farmers
      const farmerColumns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'contactNumber', label: 'Contact Number', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'state', label: 'State', sortable: true },
        { key: 'district', label: 'District', sortable: true },
        { key: 'kycStatus', label: 'KYC Status', sortable: true },
        { key: 'assignedEmployee', label: 'Assigned Employee', sortable: true }
      ];

      return (
        <div className="view-farmer-dashboard">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <h2 className="dashboard-title">All Farmers</h2>
                <p className="dashboard-subtitle">View and manage all farmer registrations</p>
              </div>
              <button
                className="back-button"
                onClick={onClose}
                type="button"
              >
                ← Back
              </button>
            </div>
          </div>
          
          <div className="dashboard-content">
            <div className="farmer-details-container">
              <div className="detail-section">
                <h3>Farmer List</h3>
                <p>Total Farmers: {Array.isArray(farmerData) ? farmerData.length : 0}</p>
                
                {/* Display farmers in a table format */}
                <div className="farmers-table-container">
                  {Array.isArray(farmerData) && farmerData.length > 0 ? (
                    <div className="farmers-table">
                      <div className="table-header">
                        {farmerColumns.map(column => (
                          <div key={column.key} className="table-cell header">
                            {column.label}
                          </div>
                        ))}
                      </div>
                      <div className="table-body">
                        {farmerData.map((farmer, index) => (
                          <div 
                            key={index} 
                            className="table-row clickable"
                            onClick={() => onFarmerSelect && onFarmerSelect(farmer)}
                          >
                            <div className="table-cell">{safeRender(farmer.name)}</div>
                            <div className="table-cell">{safeRender(farmer.contactNumber)}</div>
                            <div className="table-cell">{safeRender(farmer.email)}</div>
                            <div className="table-cell">{safeRender(farmer.state)}</div>
                            <div className="table-cell">{safeRender(farmer.district)}</div>
                            <div className="table-cell">
                              <span className={`kyc-status-badge ${safeRender(farmer.kycStatus)?.toLowerCase()}`}>
                                {safeRender(farmer.kycStatus) || 'PENDING'}
                              </span>
                            </div>
                            <div className="table-cell">
                              {farmer.assignedEmployee ? 
                                (typeof farmer.assignedEmployee === 'object' ? 
                                  `${safeRender(farmer.assignedEmployee.firstName)} ${safeRender(farmer.assignedEmployee.lastName)}` : 
                                  safeRender(farmer.assignedEmployee)
                                ) : 'Not Assigned'
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>No farmers found. Add some farmers using the "Add Farmer" button.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content view-farmer-modal">
        <div className="modal-header">
          <h2>Farmer Registration Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="farmer-details-container">
            
            {/* Personal Information */}
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                                 <div className="detail-item">
                   <label>Name:</label>
                   <span>{safeRender(farmerData.name)}</span>
                 </div>
                <div className="detail-item">
                  <label>Date of Birth:</label>
                  <span>{formatDate(farmerData.dateOfBirth)}</span>
                </div>
                <div className="detail-item">
                  <label>Gender:</label>
                  <span>{safeRender(farmerData.gender)}</span>
                </div>
                                 <div className="detail-item">
                   <label>Contact Number:</label>
                   <span>{safeRender(farmerData.contactNumber)}</span>
                 </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{safeRender(farmerData.email)}</span>
                </div>
                <div className="detail-item">
                  <label>Father's Name:</label>
                  <span>{safeRender(farmerData.fatherName)}</span>
                </div>
                <div className="detail-item">
                  <label>Nationality:</label>
                  <span>{safeRender(farmerData.nationality)}</span>
                </div>
                                 <div className="detail-item">
                   <label>Alternative Contact:</label>
                   <span>{safeRender(farmerData.alternativeContactNumber)}</span>
                 </div>
                 <div className="detail-item">
                   <label>Alternative Relation:</label>
                   <span>{safeRender(farmerData.alternativeRelationType)}</span>
                 </div>
              </div>
            </div>

                         {/* Address Information */}
             <div className="detail-section">
               <h3>Address Information</h3>
               <div className="detail-grid">
                 <div className="detail-item">
                   <label>State:</label>
                   <span>{safeRender(farmerData.state)}</span>
                 </div>
                 <div className="detail-item">
                   <label>District:</label>
                   <span>{safeRender(farmerData.district)}</span>
                 </div>
                 <div className="detail-item full-width">
                   <label>Complete Address:</label>
                   <span>{`${safeRender(farmerData.district)}, ${safeRender(farmerData.state)}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '')}</span>
                 </div>
               </div>
             </div>

                         {/* Assignment Information */}
             <div className="detail-section">
               <h3>Assignment Information</h3>
               <div className="detail-grid">
                 <div className="detail-item">
                   <label>KYC Status:</label>
                   <span className={`kyc-status-badge ${safeRender(farmerData.kycStatus)?.toLowerCase()}`}>
                     {safeRender(farmerData.kycStatus) || 'PENDING'}
                   </span>
                 </div>
                 {farmerData.assignedEmployee && (
                   <div className="detail-item">
                     <label>Assigned Employee:</label>
                     <span>{typeof farmerData.assignedEmployee === 'object' ? 
                       `${safeRender(farmerData.assignedEmployee.firstName)} ${safeRender(farmerData.assignedEmployee.lastName)}` : 
                       safeRender(farmerData.assignedEmployee)}</span>
                   </div>
                 )}
                 {farmerData.assignedEmployeeId && (
                   <div className="detail-item">
                     <label>Assigned Employee ID:</label>
                     <span>{safeRender(farmerData.assignedEmployeeId)}</span>
                   </div>
                 )}
               </div>
             </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFarmerRegistrationDetails; 