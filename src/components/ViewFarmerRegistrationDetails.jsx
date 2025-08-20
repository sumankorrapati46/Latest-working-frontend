import React, { useState } from 'react';
import '../styles/ViewFarmerDetails.css';

const ViewFarmerRegistrationDetails = ({ farmerData, onClose, isInDashboard = false, onFarmerSelect }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
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

  const totalSteps = 8;
  
  const stepTitles = [
    'Personal Details',
    'Address Information', 
    'Professional Details',
    'Current Crop Details',
    'Proposed Crop Details',
    'Irrigation Details',
    'Bank Details',
    'Documents'
  ];

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

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  // If in dashboard mode, render without modal overlay
  if (isInDashboard) {
    // Check if we're showing a single farmer's details or a list of farmers
    const isShowingSingleFarmer = !Array.isArray(farmerData);
    
    if (isShowingSingleFarmer) {
      // Show detailed view of a single farmer with step navigation
      return (
        <div className="view-farmer-dashboard">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <h2 className="dashboard-title">Farmer Registration Details</h2>
                <p className="dashboard-subtitle">Step {currentStep + 1} of {totalSteps}: {stepTitles[currentStep]} - {safeRender(farmerData.name)}</p>
              </div>
              <button
                className="back-button"
                onClick={onClose}
                type="button"
              >
                ← Back to List
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">{currentStep + 1} / {totalSteps}</span>
            </div>
          </div>
          
          <div className="dashboard-content">
            <div className="farmer-details-container">
              
              {/* Step Navigation */}
              <div className="step-navigation">
                {stepTitles.map((title, index) => (
                  <button
                    key={index}
                    className={`step-nav-btn ${currentStep === index ? 'active' : ''}`}
                    onClick={() => handleStepClick(index)}
                  >
                    <span className="step-number">{index + 1}</span>
                    <span className="step-title">{title}</span>
                  </button>
                ))}
              </div>

              {/* Step Content */}
              <div className="step-content">
                {/* Step 0 - Personal Details */}
                {currentStep === 0 && (
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                        <label>Salutation:</label>
                        <span>{safeRender(farmerData.salutation)}</span>
                      </div>
                      <div className="detail-item">
                        <label>First Name:</label>
                        <span>{safeRender(farmerData.firstName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Middle Name:</label>
                        <span>{safeRender(farmerData.middleName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Last Name:</label>
                        <span>{safeRender(farmerData.lastName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Full Name:</label>
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
                        <label>Alternative Contact Type:</label>
                        <span>{safeRender(farmerData.alternativeType)}</span>
                  </div>
                  <div className="detail-item">
                        <label>Alternative Contact Number:</label>
                        <span>{safeRender(farmerData.alternativeNumber)}</span>
                      </div>
                      {farmerData.photo && (
                        <div className="detail-item full-width">
                          <label>Photo:</label>
                          <div className="photo-display">
                            <img src={farmerData.photo} alt="Farmer" className="farmer-photo" />
                  </div>
                        </div>
                      )}
                </div>
              </div>
                )}

                {/* Step 1 - Address Information */}
                {currentStep === 1 && (
              <div className="detail-section">
                <h3>Address Information</h3>
                <div className="detail-grid">
                      <div className="detail-item">
                        <label>Country:</label>
                        <span>{safeRender(farmerData.country)}</span>
                      </div>
                  <div className="detail-item">
                    <label>State:</label>
                    <span>{safeRender(farmerData.state)}</span>
                  </div>
                  <div className="detail-item">
                    <label>District:</label>
                    <span>{safeRender(farmerData.district)}</span>
                  </div>
                      <div className="detail-item">
                        <label>Block:</label>
                        <span>{safeRender(farmerData.block)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Village:</label>
                        <span>{safeRender(farmerData.village)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Pincode:</label>
                        <span>{safeRender(farmerData.pincode)}</span>
                      </div>
                  <div className="detail-item full-width">
                    <label>Complete Address:</label>
                        <span>{`${safeRender(farmerData.village)}, ${safeRender(farmerData.block)}, ${safeRender(farmerData.district)}, ${safeRender(farmerData.state)} - ${safeRender(farmerData.pincode)}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 - Professional Details */}
                {currentStep === 2 && (
                  <div className="detail-section">
                    <h3>Professional Details</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Education:</label>
                        <span>{safeRender(farmerData.education)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Experience:</label>
                        <span>{safeRender(farmerData.experience)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 - Current Crop Details */}
                {currentStep === 3 && (
                  <div className="detail-section">
                    <h3>Current Crop Details</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Survey Number:</label>
                        <span>{safeRender(farmerData.currentSurveyNumber)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Land Holding:</label>
                        <span>{safeRender(farmerData.currentLandHolding)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Geo Tag:</label>
                        <span>{safeRender(farmerData.currentGeoTag)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Current Crop:</label>
                        <span>{safeRender(farmerData.currentCrop)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Net Income:</label>
                        <span>{safeRender(farmerData.currentNetIncome)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Soil Test:</label>
                        <span>{safeRender(farmerData.currentSoilTest)}</span>
                      </div>
                      {farmerData.currentSoilTestCertificateFileName && (
                        <div className="detail-item full-width">
                          <label>Soil Test Certificate:</label>
                          <span>{safeRender(farmerData.currentSoilTestCertificateFileName)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4 - Proposed Crop Details */}
                {currentStep === 4 && (
                  <div className="detail-section">
                    <h3>Proposed Crop Details</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Survey Number:</label>
                        <span>{safeRender(farmerData.proposedSurveyNumber)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Land Holding:</label>
                        <span>{safeRender(farmerData.proposedLandHolding)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Geo Tag:</label>
                        <span>{safeRender(farmerData.proposedGeoTag)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Crop Type:</label>
                        <span>{safeRender(farmerData.cropType)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Net Income:</label>
                        <span>{safeRender(farmerData.netIncome)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Soil Test:</label>
                        <span>{safeRender(farmerData.proposedSoilTest)}</span>
                      </div>
                      {farmerData.soilTestCertificate && (
                        <div className="detail-item full-width">
                          <label>Soil Test Certificate:</label>
                          <span>{safeRender(farmerData.soilTestCertificate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5 - Irrigation Details */}
                {currentStep === 5 && (
                  <div className="detail-section">
                    <h3>Irrigation Details</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Current Water Source:</label>
                        <span>{safeRender(farmerData.currentWaterSource)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Current Discharge (LPH):</label>
                        <span>{safeRender(farmerData.currentDischargeLPH)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Current Summer Discharge:</label>
                        <span>{safeRender(farmerData.currentSummerDischarge)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Current Borewell Location:</label>
                        <span>{safeRender(farmerData.currentBorewellLocation)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Proposed Water Source:</label>
                        <span>{safeRender(farmerData.proposedWaterSource)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Proposed Discharge (LPH):</label>
                        <span>{safeRender(farmerData.proposedDischargeLPH)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Proposed Summer Discharge:</label>
                        <span>{safeRender(farmerData.proposedSummerDischarge)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Proposed Borewell Location:</label>
                        <span>{safeRender(farmerData.proposedBorewellLocation)}</span>
                  </div>
                </div>
              </div>
                )}

                {/* Step 6 - Bank Details */}
                {currentStep === 6 && (
              <div className="detail-section">
                    <h3>Bank Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                        <label>Bank Name:</label>
                        <span>{safeRender(farmerData.bankName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Account Number:</label>
                        <span>{safeRender(farmerData.accountNumber)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Branch Name:</label>
                        <span>{safeRender(farmerData.branchName)}</span>
                  </div>
                    <div className="detail-item">
                        <label>IFSC Code:</label>
                        <span>{safeRender(farmerData.ifscCode)}</span>
                      </div>
                      {farmerData.passbookFile && (
                        <div className="detail-item full-width">
                          <label>Passbook File:</label>
                          <span>{safeRender(farmerData.passbookFile)}</span>
                        </div>
                      )}
                    </div>
                    </div>
                  )}

                {/* Step 7 - Documents */}
                {currentStep === 7 && (
                  <div className="detail-section">
                    <h3>Documents</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Document Type:</label>
                        <span>{safeRender(farmerData.documentType)}</span>
                      </div>
                    <div className="detail-item">
                        <label>Document Number:</label>
                        <span>{safeRender(farmerData.documentNumber)}</span>
                      </div>
                      {farmerData.documentFileName && (
                        <div className="detail-item full-width">
                          <label>Document File:</label>
                          <span>{safeRender(farmerData.documentFileName)}</span>
                    </div>
                  )}
                </div>
                  </div>
                )}
              </div>

              {/* Step Navigation Buttons */}
              <div className="step-navigation-buttons">
                <button
                  className="step-nav-btn prev"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  ← Previous
                </button>
                <button
                  className="step-nav-btn next"
                  onClick={handleNextStep}
                  disabled={currentStep === totalSteps - 1}
                >
                  Next →
                </button>
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
                      <div className="farmer-details-table-header">
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
                            className="farmer-details-table-row clickable"
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