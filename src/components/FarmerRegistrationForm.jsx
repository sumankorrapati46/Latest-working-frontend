import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/FarmerRegistration.css';

const FarmerRegistrationForm = ({ isInDashboard = false, editData = null, onClose, onSubmit: onSubmitProp }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [photoPreviewStep0, setPhotoPreviewStep0] = useState(null);
  const [photoPreviewStep3, setPhotoPreviewStep3] = useState(null);
  const [selectedPhotoName, setSelectedPhotoName] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [cropCategoryStep3, setCropCategoryStep3] = useState('');
  const [cropCategoryStep4, setCropCategoryStep4] = useState('');
  const [selectedIrrigationTab, setSelectedIrrigationTab] = useState('Current');
  const [farmerData] = useState(editData);
  const [photoPreview] = useState(editData?.photo || null);

  // Initialize photo name if editing
  useEffect(() => {
    if (editData?.photoFileName) {
      setSelectedPhotoName(editData.photoFileName);
    }
  }, [editData]);

  const totalSteps = 8;

  const methods = useForm({
    defaultValues: {
      // Step 0 - Personal Details
      salutation: editData?.salutation || '',
      firstName: editData?.firstName || '',
      middleName: editData?.middleName || '',
      lastName: editData?.lastName || '',
      gender: editData?.gender || '',
      nationality: editData?.nationality || '',
      dateOfBirth: editData?.dateOfBirth || '',
      contactNumber: editData?.contactNumber || '',
      fatherName: editData?.fatherName || '',
      alternativeType: editData?.alternativeType || '',
      alternativeNumber: editData?.alternativeNumber || '',
      photo: editData?.photo || null,

      // Step 1 - Address
      country: editData?.country || 'India',
      state: editData?.state || '',
      district: editData?.district || '',
      block: editData?.block || '',
      village: editData?.village || '',
      pincode: editData?.pincode || '',

      // Step 2 - Professional Details
      education: editData?.education || '',
      experience: editData?.experience || '',

      // Step 3 - Current Crop Details
      currentSurveyNumber: editData?.currentSurveyNumber || '',
      currentLandHolding: editData?.currentLandHolding || '',
      currentGeoTag: editData?.currentGeoTag || '',
      currentCrop: editData?.currentCrop || '',
      currentNetIncome: editData?.currentNetIncome || '',
      currentSoilTest: editData?.currentSoilTest || '',
      currentSoilTestCertificateFileName: editData?.currentSoilTestCertificateFileName || null,

      // Step 4 - Proposed Crop Details
      proposedSurveyNumber: editData?.proposedSurveyNumber || '',
      proposedLandHolding: editData?.proposedLandHolding || '',
      proposedGeoTag: editData?.proposedGeoTag || '',
      cropType: editData?.cropType || '',
      netIncome: editData?.netIncome || '',
      proposedSoilTest: editData?.proposedSoilTest || '',
      soilTestCertificate: editData?.soilTestCertificate || null,

      // Step 5 - Irrigation Details
      currentWaterSource: editData?.currentWaterSource || '',
      currentDischargeLPH: editData?.currentDischargeLPH || '',
      currentSummerDischarge: editData?.currentSummerDischarge || '',
      currentBorewellLocation: editData?.currentBorewellLocation || '',
      proposedWaterSource: editData?.proposedWaterSource || '',
      proposedDischargeLPH: editData?.proposedDischargeLPH || '',
      proposedSummerDischarge: editData?.proposedSummerDischarge || '',
      proposedBorewellLocation: editData?.proposedBorewellLocation || '',

      // Step 6 - Bank Details
      bankName: editData?.bankName || '',
      accountNumber: editData?.accountNumber || '',
      branchName: editData?.branchName || '',
      ifscCode: editData?.ifscCode || '',
      passbookFile: editData?.passbookFile || null,

      // Step 7 - Documents
      documentType: editData?.documentType || '',
      documentNumber: editData?.documentNumber || '',
      documentFileName: editData?.documentFileName || null,
    }
  });

  const { register, handleSubmit, watch, setValue, trigger, clearErrors, formState: { errors } } = methods;

  const cropOptions = {
    'Cereals': ['Rice', 'Wheat', 'Maize', 'Sorghum', 'Pearl Millet', 'Finger Millet'],
    'Pulses': ['Chickpea', 'Pigeon Pea', 'Lentil', 'Mung Bean', 'Urad Bean', 'Cowpea'],
    'Oilseeds': ['Groundnut', 'Soybean', 'Sunflower', 'Sesame', 'Mustard', 'Safflower'],
    'Vegetables': ['Tomato', 'Onion', 'Potato', 'Brinjal', 'Cabbage', 'Cauliflower'],
    'Fruits': ['Mango', 'Banana', 'Orange', 'Apple', 'Grape', 'Pomegranate'],
    'Cash Crops': ['Cotton', 'Sugarcane', 'Tobacco', 'Jute', 'Tea', 'Coffee']
  };

  const waterSourceOptions = [
    'Borewell',
    'Open Well',
    'Canal',
    'River',
    'Pond',
    'Rainfed',
    'Drip Irrigation',
    'Sprinkler Irrigation'
  ];

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

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted with data:', data);
      
      // Call the onSubmit prop which should handle API call and state update
      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        // Fallback for standalone mode
        if (isInDashboard) {
          onClose && onClose();
        } else {
          navigate('/admin/dashboard');
        }
        alert('Farmer registration completed successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className={`farmer-registration-container ${isInDashboard ? 'dashboard-mode' : ''}`}>
      <div className="farmer-registration-card">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <div className="header-left">
              <h2 className="form-title">
                {editData ? 'Edit Farmer Details' : 'Add New Farmer'}
              </h2>
              <p className="form-subtitle">
                Step {currentStep + 1} of {totalSteps}: {stepTitles[currentStep]}
              </p>
            </div>
            
            {/* Back Button */}
            {isInDashboard && (
              <button 
                className="back-button" 
                onClick={onClose}
                type="button"
              >
                ← Back
              </button>
            )}
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

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="farmer-registration-form">
            {/* Step 0 - Personal Details */}
            {currentStep === 0 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      {/* Photo Upload */}
                      <div className="form-group photo-upload">
                        <label className="form-label">
                          Photo <span className="optional">(Optional)</span>
                        </label>
                        <div className="photo-container">
                          <div className="photo-preview-box">
                            {photoPreviewStep0 ? (
                              <img src={photoPreviewStep0} alt="Preview" className="photo-preview" />
                            ) : photoPreview ? (
                              <img src={photoPreview} alt="Farmer" className="photo-preview" />
                            ) : (
                              <div className="photo-placeholder">
                                <span className="upload-icon">📷</span>
                                <span>Upload Photo</span>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="photo-input"
                            {...register("photo")}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setPhotoPreviewStep0(URL.createObjectURL(file));
                                setValue("photo", file, { shouldValidate: true });
                                setSelectedPhotoName(file.name);
                                clearErrors("photo");
                              }
                            }}
                          />
                          {selectedPhotoName && (
                            <div className="file-name">{selectedPhotoName}</div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Salutation <span className="required">*</span></label>
                        <select className="form-input" {...register("salutation", { required: "Salutation is required" })}>
                          <option value="">Select</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Miss.">Miss.</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                        {errors.salutation && <span className="error-message">{errors.salutation.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">First Name <span className="required">*</span></label>
                        <input
                          className="form-input"
                          placeholder="Enter first name"
                          {...register("firstName", { required: "First Name is required" })}
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Middle Name <span className="required">*</span></label>
                        <input
                          className="form-input"
                          placeholder="Enter middle name"
                          {...register("middleName", { required: "Middle Name is required" })}
                        />
                        {errors.middleName && <span className="error-message">{errors.middleName.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Last Name <span className="required">*</span></label>
                        <input
                          className="form-input"
                          placeholder="Enter last name"
                          {...register("lastName", { required: "Last Name is required" })}
                        />
                        {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Gender <span className="required">*</span></label>
                        <select className="form-input" {...register("gender", { required: "Gender is required" })}>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                        </select>
                        {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nationality <span className="required">*</span></label>
                        <select className="form-input" {...register("nationality", { required: "Nationality is required" })}>
                          <option value="">Select</option>
                          <option value="Indian">Indian</option>
                        </select>
                        {errors.nationality && <span className="error-message">{errors.nationality.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Date of Birth <span className="required">*</span></label>
                        <input
                          type="date"
                          className="form-input"
                          {...register("dateOfBirth", { required: "Date of Birth is required" })}
                        />
                        {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Contact Number <span className="optional">(Optional)</span></label>
                        <input
                          type="tel"
                          maxLength={10}
                          className="form-input"
                          placeholder="Enter 10-digit number"
                          {...register("contactNumber")}
                        />
                        {errors.contactNumber && <span className="error-message">{errors.contactNumber.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Father Name <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter father's name"
                          {...register("fatherName")}
                        />
                        {errors.fatherName && <span className="error-message">{errors.fatherName.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Alternative Type <span className="optional">(Optional)</span></label>
                        <select className="form-input" {...register("alternativeType")}>
                          <option value="">Select Relation</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.alternativeType && <span className="error-message">{errors.alternativeType.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Alternative Number <span className="optional">(Optional)</span></label>
                        <input
                          type="tel"
                          maxLength={10}
                          className="form-input"
                          placeholder="Enter 10-digit number"
                          {...register("alternativeNumber")}
                        />
                        {errors.alternativeNumber && <span className="error-message">{errors.alternativeNumber.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 - Address */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Country <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your country"
                          {...register("country", { required: "Country is required" })}
                        />
                        {errors.country && <span className="error-message">{errors.country.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">State <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your state"
                          {...register("state", { required: "State is required" })}
                        />
                        {errors.state && <span className="error-message">{errors.state.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">District <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your district"
                          {...register("district", { required: "District is required" })}
                        />
                        {errors.district && <span className="error-message">{errors.district.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Block/Mandal <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your block"
                          {...register("block", { required: "Block is required" })}
                        />
                        {errors.block && <span className="error-message">{errors.block.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Village <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter your village"
                          {...register("village", { required: "Village is required" })}
                        />
                        {errors.village && <span className="error-message">{errors.village.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pincode <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 500001"
                          {...register("pincode", { required: "Pincode is required" })}
                        />
                        {errors.pincode && <span className="error-message">{errors.pincode.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Professional Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Education <span className="optional">(Optional)</span></label>
                        <select className="form-input" {...register("education")}>
                          <option value="">Select</option>
                          <option value="Illiterate">Illiterate</option>
                          <option value="Primary Schooling">Primary Schooling</option>
                          <option value="High School">High School</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Degree">Degree</option>
                        </select>
                        {errors.education && <span className="error-message">{errors.education.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Experience <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 15 Years"
                          {...register("experience")}
                        />
                        {errors.experience && <span className="error-message">{errors.experience.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Current Crop Details */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Survey Numbers <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter survey numbers"
                          {...register("currentSurveyNumber")}
                        />
                        {errors.currentSurveyNumber && <span className="error-message">{errors.currentSurveyNumber.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Total Land Holding (Acres) <span className="optional">(Optional)</span></label>
                        <input
                          type="number"
                          step="any"
                          className="form-input"
                          placeholder="Enter land holding"
                          {...register("currentLandHolding", { valueAsNumber: true })}
                        />
                        {errors.currentLandHolding && <span className="error-message">{errors.currentLandHolding.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Geo-tag <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter geo coordinates"
                          {...register("currentGeoTag")}
                        />
                        {errors.currentGeoTag && <span className="error-message">{errors.currentGeoTag.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Crop Category <span className="optional">(Optional)</span></label>
                        <select
                          className="form-input"
                          value={cropCategoryStep3}
                          onChange={(e) => {
                            setCropCategoryStep3(e.target.value);
                            setValue("currentCrop", "");
                          }}
                        >
                          <option value="">Select</option>
                          {Object.keys(cropOptions).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {cropCategoryStep3 && (
                        <div className="form-group">
                          <label className="form-label">Crop Name <span className="optional">(Optional)</span></label>
                          <select className="form-input" {...register("currentCrop")} defaultValue="">
                            <option value="">Select</option>
                            {cropOptions[cropCategoryStep3].map((crop) => (
                              <option key={crop} value={crop}>{crop}</option>
                            ))}
                          </select>
                          {errors.currentCrop && <span className="error-message">{errors.currentCrop.message}</span>}
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label">Net Income (Current Crop/Year) <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter net income"
                          {...register("currentNetIncome")}
                        />
                        {errors.currentNetIncome && <span className="error-message">{errors.currentNetIncome.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Soil Test <span className="optional">(Optional)</span></label>
                        <select className="form-input" {...register("currentSoilTest")}>
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                        {errors.currentSoilTest && <span className="error-message">{errors.currentSoilTest.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Soil Test Certificate <span className="optional">(Optional)</span></label>
                        <input
                          type="file"
                          className="form-input file-input"
                          {...register("currentSoilTestCertificateFileName")}
                        />
                        {errors.currentSoilTestCertificateFileName && <span className="error-message">{errors.currentSoilTestCertificateFileName.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 - Proposed Crop Details */}
            {currentStep === 4 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Survey Numbers <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter survey numbers"
                          {...register("proposedSurveyNumber")}
                        />
                        {errors.proposedSurveyNumber && <span className="error-message">{errors.proposedSurveyNumber.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Geo-tag <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Latitude, Longitude"
                          {...register("proposedGeoTag", {
                            pattern: {
                              value: /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/,
                              message: "Enter valid Latitude, Longitude (e.g., 17.123, 78.456)"
                            }
                          })}
                        />
                        {errors.proposedGeoTag && <span className="error-message">{errors.proposedGeoTag.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Crop Category <span className="optional">(Optional)</span></label>
                        <select
                          className="form-input"
                          value={cropCategoryStep4}
                          onChange={(e) => {
                            setCropCategoryStep4(e.target.value);
                            setValue("cropType", "");
                          }}
                        >
                          <option value="">Select</option>
                          {Object.keys(cropOptions).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {cropCategoryStep4 && (
                        <div className="form-group">
                          <label className="form-label">Crop Name <span className="optional">(Optional)</span></label>
                          <select className="form-input" {...register("cropType")} defaultValue="">
                            <option value="">Select</option>
                            {cropOptions[cropCategoryStep4].map((crop) => (
                              <option key={crop} value={crop}>{crop}</option>
                            ))}
                          </select>
                          {errors.cropType && <span className="error-message">{errors.cropType.message}</span>}
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label">Soil Test <span className="optional">(Optional)</span></label>
                        <select className="form-input" {...register("proposedSoilTest")}>
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                        {errors.proposedSoilTest && <span className="error-message">{errors.proposedSoilTest.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Total Land Holding (Acres) <span className="optional">(Optional)</span></label>
                        <input
                          type="number"
                          step="any"
                          className="form-input"
                          placeholder="Enter land holding"
                          {...register("proposedLandHolding", { valueAsNumber: true })}
                        />
                        {errors.proposedLandHolding && <span className="error-message">{errors.proposedLandHolding.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Net Income (Per Crop/Year) <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter net income"
                          {...register("netIncome")}
                        />
                        {errors.netIncome && <span className="error-message">{errors.netIncome.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Soil Test Certificate <span className="optional">(Optional)</span></label>
                        <input
                          type="file"
                          className="form-input file-input"
                          {...register("soilTestCertificate")}
                        />
                        {errors.soilTestCertificate && <span className="error-message">{errors.soilTestCertificate.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 - Irrigation Details */}
            {currentStep === 5 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="tab-container">
                    <div className="tab-header">
                      <button
                        type="button"
                        className={`tab-button ${selectedIrrigationTab === "Current" ? "active" : ""}`}
                        onClick={() => setSelectedIrrigationTab("Current")}
                      >
                        Current Crop Addition
                      </button>
                      <button
                        type="button"
                        className={`tab-button ${selectedIrrigationTab === "Proposed" ? "active" : ""}`}
                        onClick={() => setSelectedIrrigationTab("Proposed")}
                      >
                        Proposed Crop Addition
                      </button>
                    </div>

                    <div className="tab-content">
                      {selectedIrrigationTab === "Current" && (
                        <div className="form-grid">
                          <div className="form-column">
                            <div className="form-group">
                              <label className="form-label">Water Source <span className="required">*</span></label>
                              <select className="form-input" {...register("currentWaterSource")} defaultValue="">
                                <option value="">Select</option>
                                {waterSourceOptions.map((source) => (
                                  <option key={source} value={source}>{source}</option>
                                ))}
                              </select>
                              {errors.currentWaterSource && <span className="error-message">{errors.currentWaterSource.message}</span>}
                            </div>

                            <div className="form-group">
                              <label className="form-label">Borewell Discharge (LPH) <span className="optional">(Optional)</span></label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Enter discharge"
                                {...register("currentDischargeLPH")}
                              />
                              {errors.currentDischargeLPH && <span className="error-message">{errors.currentDischargeLPH.message}</span>}
                            </div>
                          </div>

                          <div className="form-column">
                            <div className="form-group">
                              <label className="form-label">Summer Discharge <span className="optional">(Optional)</span></label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Enter summer discharge"
                                {...register("currentSummerDischarge")}
                              />
                              {errors.currentSummerDischarge && <span className="error-message">{errors.currentSummerDischarge.message}</span>}
                            </div>

                            <div className="form-group">
                              <label className="form-label">Borewell Location <span className="optional">(Optional)</span></label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Enter location"
                                {...register("currentBorewellLocation")}
                              />
                              {errors.currentBorewellLocation && <span className="error-message">{errors.currentBorewellLocation.message}</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedIrrigationTab === "Proposed" && (
                        <div className="form-grid">
                          <div className="form-column">
                            <div className="form-group">
                              <label className="form-label">Water Source <span className="required">*</span></label>
                              <select className="form-input" {...register("proposedWaterSource")} defaultValue="">
                                <option value="">Select</option>
                                {waterSourceOptions.map((source) => (
                                  <option key={source} value={source}>{source}</option>
                                ))}
                              </select>
                              {errors.proposedWaterSource && <span className="error-message">{errors.proposedWaterSource.message}</span>}
                            </div>

                            <div className="form-group">
                              <label className="form-label">Borewell Discharge (LPH) <span className="optional">(Optional)</span></label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Enter discharge"
                                {...register("proposedDischargeLPH")}
                              />
                              {errors.proposedDischargeLPH && <span className="error-message">{errors.proposedDischargeLPH.message}</span>}
                            </div>
                          </div>

                          <div className="form-column">
                            <div className="form-group">
                              <label className="form-label">Summer Discharge <span className="optional">(Optional)</span></label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Enter summer discharge"
                                {...register("proposedSummerDischarge")}
                              />
                              {errors.proposedSummerDischarge && <span className="error-message">{errors.proposedSummerDischarge.message}</span>}
                            </div>

                            <div className="form-group">
                              <label className="form-label">Borewell Location <span className="optional">(Optional)</span></label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Enter location"
                                {...register("proposedBorewellLocation")}
                              />
                              {errors.proposedBorewellLocation && <span className="error-message">{errors.proposedBorewellLocation.message}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6 - Bank Details */}
            {currentStep === 6 && (
              <div className="form-step">
                <div className="step-content">
                  <h3 className="section-title">Bank Details</h3>
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Bank Name <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter bank name"
                          {...register("bankName")}
                        />
                        {errors.bankName && <span className="error-message">{errors.bankName.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Account Number <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter account number"
                          {...register("accountNumber")}
                        />
                        {errors.accountNumber && <span className="error-message">{errors.accountNumber.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Branch Name <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter branch name"
                          {...register("branchName")}
                        />
                        {errors.branchName && <span className="error-message">{errors.branchName.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">IFSC Code <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter IFSC code"
                          {...register("ifscCode")}
                        />
                        {errors.ifscCode && <span className="error-message">{errors.ifscCode.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Passbook <span className="optional">(Optional)</span></label>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="form-input file-input"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setValue("passbookFile", file);
                            trigger("passbookFile");
                          }}
                        />
                        {errors.passbookFile && <span className="error-message">{errors.passbookFile.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7 - Documents */}
            {currentStep === 7 && (
              <div className="form-step">
                <div className="step-content">
                  <h3 className="section-title">Documents</h3>
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Document Type <span className="optional">(Optional)</span></label>
                        <select
                          className="form-input"
                          {...register("documentType")}
                          onChange={(e) => {
                            setSelectedDoc(e.target.value);
                            setValue("documentType", e.target.value);
                          }}
                        >
                          <option value="">Select</option>
                          <option value="voterId">ID/ Voter Card</option>
                          <option value="aadharNumber">Aadhar Number</option>
                          <option value="panNumber">Pan Number</option>
                          <option value="ppbNumber">PPB Number</option>
                        </select>
                        {errors.documentType && <span className="error-message">{errors.documentType.message}</span>}
                      </div>

                      {selectedDoc && (
                        <>
                          <div className="form-group">
                            <label className="form-label">
                              {selectedDoc === "voterId" ? "Voter ID" : 
                               selectedDoc === "aadharNumber" ? "Aadhar Number" : 
                               selectedDoc === "panNumber" ? "PAN Number" : "PPB Number"} 
                              <span className="optional">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder={`Enter ${selectedDoc === "voterId" ? "Voter ID" : 
                                          selectedDoc === "aadharNumber" ? "Aadhar Number" : 
                                          selectedDoc === "panNumber" ? "PAN Number" : "PPB Number"}`}
                              {...register("documentNumber")}
                            />
                            {errors.documentNumber && <span className="error-message">{errors.documentNumber.message}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              {selectedDoc === "voterId" ? "Voter ID" : 
                               selectedDoc === "aadharNumber" ? "Aadhar" : 
                               selectedDoc === "panNumber" ? "PAN" : "PPB"} File 
                              <span className="optional">(Optional)</span>
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="form-input file-input"
                              {...register("documentFileName")}
                            />
                            {errors.documentFileName && <span className="error-message">{errors.documentFileName.message}</span>}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  ← Previous
                </button>
              )}
              
              {currentStep < totalSteps - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    const isValid = await trigger();
                    if (isValid) setCurrentStep(currentStep + 1);
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Submit Registration
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default FarmerRegistrationForm; 