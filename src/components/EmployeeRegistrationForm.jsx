import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/EmployeeRegistration.css';

const EmployeeRegistrationForm = ({ isInDashboard = false, editData = null, onClose, onSubmit: onSubmitProp }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState('');

  const totalSteps = 8;

  const stepTitles = [
    'Personal Details',
    'Contact Information',
    'Relation Details',
    'Address Information',
    'Professional Details',
    'Bank Details',
    'Documents',
    'Review & Submit'
  ];

  // Mock data for dropdowns
  const states = [
    { id: 1, name: 'Andhra Pradesh' },
    { id: 2, name: 'Telangana' },
    { id: 3, name: 'Karnataka' },
    { id: 4, name: 'Tamil Nadu' },
    { id: 5, name: 'Kerala' }
  ];

  const districts = [
    { id: 1, name: 'Hyderabad' },
    { id: 2, name: 'Rangareddy' },
    { id: 3, name: 'Medak' },
    { id: 4, name: 'Nizamabad' },
    { id: 5, name: 'Adilabad' }
  ];

  const blocks = [
    { id: 1, name: 'Madhapur' },
    { id: 2, name: 'Gachibowli' },
    { id: 3, name: 'Kondapur' },
    { id: 4, name: 'Hitech City' },
    { id: 5, name: 'Jubilee Hills' }
  ];

  const villages = [
    { id: 1, name: 'Village 1' },
    { id: 2, name: 'Village 2' },
    { id: 3, name: 'Village 3' },
    { id: 4, name: 'Village 4' },
    { id: 5, name: 'Village 5' }
  ];

  const methods = useForm({
    defaultValues: {
      // Step 0 - Personal Details
      salutation: editData?.salutation || '',
      firstName: editData?.firstName || '',
      middleName: editData?.middleName || '',
      lastName: editData?.lastName || '',
      gender: editData?.gender || '',
      nationality: editData?.nationality || '',
      dob: editData?.dob || '',
      photo: editData?.photo || null,

      // Step 1 - Contact Details
      contactNumber: editData?.contactNumber || '',
      email: editData?.email || '',

      // Step 2 - Relation Details
      relationType: editData?.relationType || '',
      relationName: editData?.relationName || '',
      altNumber: editData?.altNumber || '',
      altNumberType: editData?.altNumberType || '',

      // Step 3 - Address Details
      country: editData?.country || '',
      state: editData?.state || '',
      district: editData?.district || '',
      block: editData?.block || '',
      village: editData?.village || '',
      zipcode: editData?.zipcode || '',

      // Step 4 - Professional Details
      professional: {
        education: editData?.professional?.education || '',
        experience: editData?.professional?.experience || ''
      },

      // Step 5 - Bank Details
      bank: {
        bankName: editData?.bank?.bankName || '',
        accountNumber: editData?.bank?.accountNumber || '',
        branchName: editData?.bank?.branchName || '',
        ifscCode: editData?.bank?.ifscCode || '',
        passbook: editData?.bank?.passbook || null
      },

      // Step 6 - Documents
      documentType: editData?.documentType || '',
      voterId: editData?.voterId || '',
      voterFile: editData?.voterFile || null,
      aadharNumber: editData?.aadharNumber || '',
      aadharFile: editData?.aadharFile || null,
      panNumber: editData?.panNumber || '',
      panFile: editData?.panFile || null,
      ppbNumber: editData?.ppbNumber || '',
      ppbFile: editData?.ppbFile || null,
    }
  });

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = methods;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setValue("photo", file);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Form submitted with data:', data);
      
      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        if (isInDashboard) {
          onClose && onClose();
        } else {
          navigate('/admin/dashboard');
        }
        alert('Employee registration completed successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className={`employee-registration-container ${isInDashboard ? 'dashboard-mode' : ''}`}>
      <div className="employee-registration-card">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <div className="header-left">
              <h2 className="form-title">
                {editData ? 'Edit Employee Details' : 'Add New Employee'}
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
          <form onSubmit={methods.handleSubmit(onSubmit)} className="employee-registration-form">
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
                            {photoPreview ? (
                              <img src={photoPreview} alt="Preview" className="photo-preview" />
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
                            onChange={handlePhotoChange}
                          />
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
                        <label className="form-label">Middle Name <span className="optional">(Optional)</span></label>
                        <input
                          className="form-input"
                          placeholder="Enter middle name"
                          {...register("middleName")}
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
                          {...register("dob", { required: "Date of Birth is required" })}
                        />
                        {errors.dob && <span className="error-message">{errors.dob.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 - Contact Details */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Contact Number <span className="required">*</span></label>
                        <input
                          type="tel"
                          maxLength={10}
                          className="form-input"
                          placeholder="Enter 10-digit number"
                          {...register("contactNumber", { 
                            required: "Contact Number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Please enter a valid 10-digit number"
                            }
                          })}
                        />
                        {errors.contactNumber && <span className="error-message">{errors.contactNumber.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Email Address <span className="optional">(Optional)</span></label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="Enter email address"
                          {...register("email", {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Please enter a valid email address"
                            }
                          })}
                        />
                        {errors.email && <span className="error-message">{errors.email.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Relation Details */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Relation Type <span className="optional">(Optional)</span></label>
                        <select className="form-input" {...register("relationType")}>
                          <option value="">Select</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.relationType && <span className="error-message">{errors.relationType.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Relation Name <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter relation name"
                          {...register("relationName")}
                        />
                        {errors.relationName && <span className="error-message">{errors.relationName.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Alternative Number <span className="optional">(Optional)</span></label>
                        <input
                          type="tel"
                          maxLength={10}
                          className="form-input"
                          placeholder="Enter 10-digit number"
                          {...register("altNumber")}
                        />
                        {errors.altNumber && <span className="error-message">{errors.altNumber.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Alternative Number Type <span className="optional">(Optional)</span></label>
                        <select className="form-input" {...register("altNumberType")}>
                          <option value="">Select</option>
                          <option value="Mobile">Mobile</option>
                          <option value="Landline">Landline</option>
                          <option value="Office">Office</option>
                        </select>
                        {errors.altNumberType && <span className="error-message">{errors.altNumberType.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Address Details */}
            {currentStep === 3 && (
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
                        <select className="form-input" {...register("state", { required: "State is required" })}>
                          <option value="">Select State</option>
                          {states.map(state => (
                            <option key={state.id} value={state.name}>{state.name}</option>
                          ))}
                        </select>
                        {errors.state && <span className="error-message">{errors.state.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">District <span className="required">*</span></label>
                        <select className="form-input" {...register("district", { required: "District is required" })}>
                          <option value="">Select District</option>
                          {districts.map(district => (
                            <option key={district.id} value={district.name}>{district.name}</option>
                          ))}
                        </select>
                        {errors.district && <span className="error-message">{errors.district.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Block/Mandal <span className="required">*</span></label>
                        <select className="form-input" {...register("block", { required: "Block is required" })}>
                          <option value="">Select Block</option>
                          {blocks.map(block => (
                            <option key={block.id} value={block.name}>{block.name}</option>
                          ))}
                        </select>
                        {errors.block && <span className="error-message">{errors.block.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Village <span className="required">*</span></label>
                        <select className="form-input" {...register("village", { required: "Village is required" })}>
                          <option value="">Select Village</option>
                          {villages.map(village => (
                            <option key={village.id} value={village.name}>{village.name}</option>
                          ))}
                        </select>
                        {errors.village && <span className="error-message">{errors.village.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pincode <span className="required">*</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 500001"
                          {...register("zipcode", { 
                            required: "Pincode is required",
                            pattern: {
                              value: /^[0-9]{6}$/,
                              message: "Please enter a valid 6-digit pincode"
                            }
                          })}
                        />
                        {errors.zipcode && <span className="error-message">{errors.zipcode.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 - Professional Details */}
            {currentStep === 4 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-grid">
                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Education <span className="optional">(Optional)</span></label>
                        <select className="form-input" {...register("professional.education")}>
                          <option value="">Select</option>
                          <option value="High School">High School</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="PhD">PhD</option>
                        </select>
                        {errors.professional?.education && <span className="error-message">{errors.professional.education.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Experience <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 5 Years"
                          {...register("professional.experience")}
                        />
                        {errors.professional?.experience && <span className="error-message">{errors.professional.experience.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 - Bank Details */}
            {currentStep === 5 && (
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
                          {...register("bank.bankName")}
                        />
                        {errors.bank?.bankName && <span className="error-message">{errors.bank.bankName.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Account Number <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter account number"
                          {...register("bank.accountNumber")}
                        />
                        {errors.bank?.accountNumber && <span className="error-message">{errors.bank.accountNumber.message}</span>}
                      </div>
                    </div>

                    <div className="form-column">
                      <div className="form-group">
                        <label className="form-label">Branch Name <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter branch name"
                          {...register("bank.branchName")}
                        />
                        {errors.bank?.branchName && <span className="error-message">{errors.bank.branchName.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">IFSC Code <span className="optional">(Optional)</span></label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Enter IFSC code"
                          {...register("bank.ifscCode")}
                        />
                        {errors.bank?.ifscCode && <span className="error-message">{errors.bank.ifscCode.message}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Passbook <span className="optional">(Optional)</span></label>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="form-input file-input"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setValue("bank.passbook", file);
                          }}
                        />
                        {errors.bank?.passbook && <span className="error-message">{errors.bank.passbook.message}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6 - Documents */}
            {currentStep === 6 && (
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
                          onChange={(e) => setSelectedDoc(e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="voterId">Voter ID</option>
                          <option value="aadharNumber">Aadhar Number</option>
                          <option value="panNumber">PAN Number</option>
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
                              {...register(selectedDoc)}
                            />
                            {errors[selectedDoc] && <span className="error-message">{errors[selectedDoc].message}</span>}
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
                              {...register(`${selectedDoc}File`)}
                            />
                            {errors[`${selectedDoc}File`] && <span className="error-message">{errors[`${selectedDoc}File`].message}</span>}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7 - Review & Submit */}
            {currentStep === 7 && (
              <div className="form-step">
                <div className="step-content">
                  <h3 className="section-title">Review & Submit</h3>
                  <div className="review-section">
                    <p className="review-text">
                      Please review all the information you have entered. Once you submit, the employee registration will be processed.
                    </p>
                    <div className="review-summary">
                      <h4>Registration Summary</h4>
                      <ul>
                        <li>Personal details have been entered</li>
                        <li>Contact information is complete</li>
                        <li>Address details are provided</li>
                        <li>Professional information is included</li>
                        <li>Bank details are optional</li>
                        <li>Documents can be uploaded later</li>
                      </ul>
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

export default EmployeeRegistrationForm; 