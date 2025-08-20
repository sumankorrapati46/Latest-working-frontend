import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import '../styles/ViewEditEmployeeDetails.css';

const ViewEditEmployeeDetails = ({ employeeData, onClose, onUpdate, isInDashboard = false, onEmployeeSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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

  // Helper function to safely render values
  const safeRender = (value) => {
    if (value === null || value === undefined) {
      return 'Not provided';
    }
    if (typeof value === 'object') {
      console.warn('ViewEditEmployeeDetails: Object found in value:', value);
      return 'Object (see console)';
    }
    return String(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const methods = useForm({
    defaultValues: {
      // Personal Information
      firstName: employeeData?.firstName || '',
      lastName: employeeData?.lastName || '',
      email: employeeData?.email || '',
      phone: employeeData?.phone || '',
      dateOfBirth: employeeData?.dateOfBirth || '',
      gender: employeeData?.gender || '',
      address: employeeData?.address || '',
      city: employeeData?.city || '',
      state: employeeData?.state || '',
      pincode: employeeData?.pincode || '',
      
      // Employment Information
      employeeId: employeeData?.employeeId || '',
      department: employeeData?.department || '',
      designation: employeeData?.designation || '',
      joiningDate: employeeData?.joiningDate || '',
      salary: employeeData?.salary || '',
      supervisor: employeeData?.supervisor || '',
      
      // Educational Information
      highestQualification: employeeData?.highestQualification || '',
      institution: employeeData?.institution || '',
      graduationYear: employeeData?.graduationYear || '',
      specialization: employeeData?.specialization || '',
      
      // Emergency Contact
      emergencyName: employeeData?.emergencyName || '',
      emergencyPhone: employeeData?.emergencyPhone || '',
      emergencyRelation: employeeData?.emergencyRelation || '',
      
      // Documents
      photo: employeeData?.photo || null,
      idProof: employeeData?.idProof || null,
      addressProof: employeeData?.addressProof || null,
      educationalCertificates: employeeData?.educationalCertificates || null,
      
      // Additional Information
      skills: employeeData?.skills || '',
      languages: employeeData?.languages || '',
      certifications: employeeData?.certifications || '',
      workExperience: employeeData?.workExperience || '',
      references: employeeData?.references || ''
    }
  });

  const { register, handleSubmit, watch, setValue, trigger, clearErrors, formState: { errors } } = methods;

  const steps = [
    { title: stepTitles[0], fields: ['firstName', 'lastName', 'dateOfBirth', 'gender'] },
    { title: stepTitles[1], fields: ['email', 'phone'] },
    { title: stepTitles[2], fields: ['relationType', 'relationName', 'altNumber', 'altNumberType'] },
    { title: stepTitles[3], fields: ['address', 'city', 'state', 'pincode'] },
    { title: stepTitles[4], fields: ['employeeId', 'department', 'designation', 'joiningDate', 'salary', 'supervisor'] },
    { title: stepTitles[5], fields: ['bankName', 'accountNumber', 'branchName', 'ifscCode', 'passbookFile'] },
    { title: stepTitles[6], fields: ['photo', 'idProof', 'addressProof', 'educationalCertificates'] },
    { title: stepTitles[7], fields: [] }
  ];

  const handleNext = async () => {
    const currentFields = steps[currentStep].fields;
    const isValid = await trigger(currentFields);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async (data) => {
    if (onUpdate) {
      await onUpdate(data);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentStep(0);
    methods.reset();
  };

  const renderPersonalInfo = () => (
    <div className="form-section">
      <h3>Personal Details</h3>
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            {...register('firstName', { required: 'First name is required' })}
            disabled={!isEditing}
          />
          {errors.firstName && <span className="error">{errors.firstName.message}</span>}
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            {...register('lastName', { required: 'Last name is required' })}
            disabled={!isEditing}
          />
          {errors.lastName && <span className="error">{errors.lastName.message}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            disabled={!isEditing}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            {...register('phone', { 
              required: 'Phone is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Phone number must be 10 digits'
              }
            })}
            disabled={!isEditing}
          />
          {errors.phone && <span className="error">{errors.phone.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            {...register('dateOfBirth', { required: 'Date of birth is required' })}
            disabled={!isEditing}
          />
          {errors.dateOfBirth && <span className="error">{errors.dateOfBirth.message}</span>}
        </div>
        <div className="form-group">
          <label>Gender *</label>
          <select {...register('gender', { required: 'Gender is required' })} disabled={!isEditing}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Address *</label>
        <textarea
          {...register('address', { required: 'Address is required' })}
          disabled={!isEditing}
        />
        {errors.address && <span className="error">{errors.address.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            {...register('city', { required: 'City is required' })}
            disabled={!isEditing}
          />
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>
        <div className="form-group">
          <label>State *</label>
          <input
            type="text"
            {...register('state', { required: 'State is required' })}
            disabled={!isEditing}
          />
          {errors.state && <span className="error">{errors.state.message}</span>}
        </div>
        <div className="form-group">
          <label>Pincode *</label>
          <input
            type="text"
            {...register('pincode', { 
              required: 'Pincode is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Pincode must be 6 digits'
              }
            })}
            disabled={!isEditing}
          />
          {errors.pincode && <span className="error">{errors.pincode.message}</span>}
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="form-section">
      <h3>Contact Information</h3>
      <div className="form-row">
        <div className="form-group"><label>Email</label><span>{safeRender(employeeData.email)}</span></div>
        <div className="form-group"><label>Phone</label><span>{safeRender(employeeData.phone)}</span></div>
      </div>
    </div>
  );

  const renderRelationDetails = () => (
    <div className="form-section">
      <h3>Relation Details</h3>
      <div className="form-row">
        <div className="form-group"><label>Relation Type</label><span>{safeRender(employeeData.relationType)}</span></div>
        <div className="form-group"><label>Relation Name</label><span>{safeRender(employeeData.relationName)}</span></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Alternative Number</label><span>{safeRender(employeeData.altNumber)}</span></div>
        <div className="form-group"><label>Alternative Number Type</label><span>{safeRender(employeeData.altNumberType)}</span></div>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="form-section">
      <h3>Address Information</h3>
      <div className="form-row"><div className="form-group"><label>Address</label><span>{safeRender(employeeData.address)}</span></div></div>
      <div className="form-row">
        <div className="form-group"><label>City</label><span>{safeRender(employeeData.city)}</span></div>
        <div className="form-group"><label>State</label><span>{safeRender(employeeData.state)}</span></div>
        <div className="form-group"><label>Pincode</label><span>{safeRender(employeeData.pincode)}</span></div>
      </div>
    </div>
  );

  const renderEmploymentInfo = () => (
    <div className="form-section">
      <h3>Professional Details</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Employee ID *</label>
          <input
            type="text"
            {...register('employeeId', { required: 'Employee ID is required' })}
            disabled={!isEditing}
          />
          {errors.employeeId && <span className="error">{errors.employeeId.message}</span>}
        </div>
        <div className="form-group">
          <label>Department *</label>
          <select {...register('department', { required: 'Department is required' })} disabled={!isEditing}>
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
          {errors.department && <span className="error">{errors.department.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Designation *</label>
          <input
            type="text"
            {...register('designation', { required: 'Designation is required' })}
            disabled={!isEditing}
          />
          {errors.designation && <span className="error">{errors.designation.message}</span>}
        </div>
        <div className="form-group">
          <label>Joining Date *</label>
          <input
            type="date"
            {...register('joiningDate', { required: 'Joining date is required' })}
            disabled={!isEditing}
          />
          {errors.joiningDate && <span className="error">{errors.joiningDate.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Salary *</label>
          <input
            type="number"
            {...register('salary', { required: 'Salary is required' })}
            disabled={!isEditing}
          />
          {errors.salary && <span className="error">{errors.salary.message}</span>}
        </div>
        <div className="form-group">
          <label>Supervisor</label>
          <input
            type="text"
            {...register('supervisor')}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderBankDetails = () => (
    <div className="form-section">
      <h3>Bank Details</h3>
      <div className="form-row">
        <div className="form-group"><label>Bank Name</label><span>{safeRender(employeeData.bankName)}</span></div>
        <div className="form-group"><label>Account Number</label><span>{safeRender(employeeData.accountNumber)}</span></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Branch Name</label><span>{safeRender(employeeData.branchName)}</span></div>
        <div className="form-group"><label>IFSC Code</label><span>{safeRender(employeeData.ifscCode)}</span></div>
      </div>
    </div>
  );

  const renderEducationalInfo = () => (
    <div className="form-section">
      <h3>Educational Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Highest Qualification *</label>
          <select {...register('highestQualification', { required: 'Highest qualification is required' })} disabled={!isEditing}>
            <option value="">Select Qualification</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          {errors.highestQualification && <span className="error">{errors.highestQualification.message}</span>}
        </div>
        <div className="form-group">
          <label>Institution *</label>
          <input
            type="text"
            {...register('institution', { required: 'Institution is required' })}
            disabled={!isEditing}
          />
          {errors.institution && <span className="error">{errors.institution.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Graduation Year *</label>
          <input
            type="number"
            {...register('graduationYear', { 
              required: 'Graduation year is required',
              min: { value: 1950, message: 'Invalid year' },
              max: { value: new Date().getFullYear(), message: 'Year cannot be in future' }
            })}
            disabled={!isEditing}
          />
          {errors.graduationYear && <span className="error">{errors.graduationYear.message}</span>}
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            {...register('specialization')}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderEmergencyContact = () => (
    <div className="form-section">
      <h3>Emergency Contact</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Emergency Contact Name *</label>
          <input
            type="text"
            {...register('emergencyName', { required: 'Emergency contact name is required' })}
            disabled={!isEditing}
          />
          {errors.emergencyName && <span className="error">{errors.emergencyName.message}</span>}
        </div>
        <div className="form-group">
          <label>Emergency Contact Phone *</label>
          <input
            type="tel"
            {...register('emergencyPhone', { 
              required: 'Emergency contact phone is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Phone number must be 10 digits'
              }
            })}
            disabled={!isEditing}
          />
          {errors.emergencyPhone && <span className="error">{errors.emergencyPhone.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Relationship *</label>
        <select {...register('emergencyRelation', { required: 'Relationship is required' })} disabled={!isEditing}>
          <option value="">Select Relationship</option>
          <option value="Spouse">Spouse</option>
          <option value="Parent">Parent</option>
          <option value="Sibling">Sibling</option>
          <option value="Friend">Friend</option>
          <option value="Other">Other</option>
        </select>
        {errors.emergencyRelation && <span className="error">{errors.emergencyRelation.message}</span>}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="form-section">
      <h3>Documents</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Photo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                setValue('photo', e.target.files[0]);
                clearErrors('photo');
              }
            }}
            disabled={!isEditing}
          />
          {watch('photo') && (
            <div className="file-preview">
              <img src={URL.createObjectURL(watch('photo'))} className="file-preview" alt="" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>ID Proof (Optional)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                setValue('idProof', e.target.files[0]);
                clearErrors('idProof');
              }
            }}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Address Proof (Optional)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                setValue('addressProof', e.target.files[0]);
                clearErrors('addressProof');
              }
            }}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label>Educational Certificates (Optional)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            multiple
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setValue('educationalCertificates', Array.from(e.target.files));
                clearErrors('educationalCertificates');
              }
            }}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="form-section">
      <h3>Additional Information</h3>
      <div className="form-group">
        <label>Skills</label>
        <textarea
          {...register('skills')}
          placeholder="Enter your skills (comma separated)"
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label>Languages Known</label>
        <input
          type="text"
          {...register('languages')}
          placeholder="e.g., English, Hindi, Spanish"
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label>Certifications</label>
        <textarea
          {...register('certifications')}
          placeholder="Enter your certifications"
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label>Work Experience</label>
        <textarea
          {...register('workExperience')}
          placeholder="Describe your previous work experience"
          disabled={!isEditing}
        />
      </div>

      <div className="form-group">
        <label>References</label>
        <textarea
          {...register('references')}
          placeholder="Enter references with contact details"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderContactInfo();
      case 2:
        return renderRelationDetails();
      case 3:
        return renderAddressInfo();
      case 4:
        return renderEmploymentInfo();
      case 5:
        return renderBankDetails();
      case 6:
        return renderDocuments();
      case 7:
        return (<div className="form-section"><h3>Review & Submit</h3><p>Review details across all steps.</p></div>);
      default:
        return null;
    }
  };

  // If in dashboard mode, render without modal overlay
  if (isInDashboard) {
    // Check if we're showing a single employee's details or a list of employees
    const isShowingSingleEmployee = !Array.isArray(employeeData);
    
    if (isShowingSingleEmployee) {
      // Multi-step view (8 steps)

      return (
        <div className="view-edit-employee-dashboard">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <h2 className="dashboard-title">Employee Details</h2>
                <p className="dashboard-subtitle">Step {currentStep + 1} of {stepTitles.length}: {stepTitles[currentStep]} - {safeRender(employeeData.firstName)} {safeRender(employeeData.lastName)}</p>
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
            <div className="employee-details-container">
              {/* Step Navigation */}
              <div className="step-navigation">
                {stepTitles.map((title, index) => (
                  <button
                    key={index}
                    className={`step-nav-btn ${currentStep === index ? 'active' : ''}`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <span className="step-number">{index + 1}</span>
                    <span className="step-title">{title}</span>
                  </button>
                ))}
              </div>

              {/* Step Content */}
              <div className="step-content">
                {currentStep === 0 && (
                  <div className="detail-section">
                    <h3>Personal Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>First Name:</label>
                        <span>{safeRender(employeeData.firstName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Last Name:</label>
                        <span>{safeRender(employeeData.lastName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Email:</label>
                        <span>{safeRender(employeeData.email)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Phone:</label>
                        <span>{safeRender(employeeData.phone)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Date of Birth:</label>
                        <span>{formatDate(employeeData.dateOfBirth)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Gender:</label>
                        <span>{safeRender(employeeData.gender)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Address:</label>
                        <span>{safeRender(employeeData.address)}</span>
                      </div>
                      <div className="detail-item">
                        <label>City:</label>
                        <span>{safeRender(employeeData.city)}</span>
                      </div>
                      <div className="detail-item">
                        <label>State:</label>
                        <span>{safeRender(employeeData.state)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Pincode:</label>
                        <span>{safeRender(employeeData.pincode)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="detail-section">
                    <h3>Employment Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Employee ID:</label>
                        <span>{safeRender(employeeData.employeeId)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Department:</label>
                        <span>{safeRender(employeeData.department)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Designation:</label>
                        <span>{safeRender(employeeData.designation)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Joining Date:</label>
                        <span>{formatDate(employeeData.joiningDate)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Salary:</label>
                        <span>{safeRender(employeeData.salary)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Supervisor:</label>
                        <span>{safeRender(employeeData.supervisor)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="detail-section">
                    <h3>Educational Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Highest Qualification:</label>
                        <span>{safeRender(employeeData.highestQualification)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Institution:</label>
                        <span>{safeRender(employeeData.institution)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Graduation Year:</label>
                        <span>{safeRender(employeeData.graduationYear)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Specialization:</label>
                        <span>{safeRender(employeeData.specialization)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="detail-section">
                    <h3>Emergency Contact</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Emergency Contact Name:</label>
                        <span>{safeRender(employeeData.emergencyName)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Emergency Phone:</label>
                        <span>{safeRender(employeeData.emergencyPhone)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Emergency Relation:</label>
                        <span>{safeRender(employeeData.emergencyRelation)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="detail-section">
                    <h3>Additional Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Skills:</label>
                        <span>{safeRender(employeeData.skills)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Languages:</label>
                        <span>{safeRender(employeeData.languages)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Certifications:</label>
                        <span>{safeRender(employeeData.certifications)}</span>
                      </div>
                      <div className="detail-item">
                        <label>Work Experience:</label>
                        <span>{safeRender(employeeData.workExperience)}</span>
                      </div>
                      <div className="detail-item">
                        <label>References:</label>
                        <span>{safeRender(employeeData.references)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation Buttons */}
              <div className="step-navigation-buttons">
                <button
                  className="step-nav-btn prev"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  ← Previous
                </button>
                <button
                  className="step-nav-btn next"
                  onClick={handleNext}
                  disabled={currentStep === stepTitles.length - 1}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Show list of all employees
      const employeeColumns = [
        { key: 'firstName', label: 'First Name', sortable: true },
        { key: 'lastName', label: 'Last Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phone', label: 'Phone', sortable: true },
        { key: 'department', label: 'Department', sortable: true },
        { key: 'designation', label: 'Designation', sortable: true },
        { key: 'joiningDate', label: 'Joining Date', sortable: true }
      ];

      return (
        <div className="view-edit-employee-dashboard">
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <h2 className="dashboard-title">All Employees</h2>
                <p className="dashboard-subtitle">View and manage all employee registrations</p>
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
            <div className="employee-details-container">
              <div className="detail-section">
                <h3>Employee List</h3>
                <p>Total Employees: {Array.isArray(employeeData) ? employeeData.length : 0}</p>
                
                {/* Display employees in a table format */}
                <div className="employees-table-container">
                  {Array.isArray(employeeData) && employeeData.length > 0 ? (
                    <div className="employees-table">
                      <div className="employee-details-table-header">
                        {employeeColumns.map(column => (
                          <div key={column.key} className="table-cell header">
                            {column.label}
                          </div>
                        ))}
                      </div>
                      <div className="table-body">
                        {employeeData.map((employee, index) => (
                          <div 
                            key={index} 
                            className="employee-details-table-row clickable"
                            onClick={() => onEmployeeSelect && onEmployeeSelect(employee)}
                          >
                            <div className="table-cell">{safeRender(employee.firstName)}</div>
                            <div className="table-cell">{safeRender(employee.lastName)}</div>
                            <div className="table-cell">{safeRender(employee.email)}</div>
                            <div className="table-cell">{safeRender(employee.phone)}</div>
                            <div className="table-cell">{safeRender(employee.department)}</div>
                            <div className="table-cell">{safeRender(employee.designation)}</div>
                            <div className="table-cell">{formatDate(employee.joiningDate)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <p>No employees found. Add some employees using the "Add Employee" button.</p>
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
    <div className="view-edit-employee-details-modal">
      <div className="view-edit-employee-details-modal-content">
        <div className="view-edit-employee-details-modal-header">
          <h2>{isEditing ? 'Edit Employee Details' : 'Employee Details'}</h2>
          <button className="view-edit-employee-details-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="view-edit-employee-details-modal-body">
          <div className="view-edit-employee-details-step-indicator">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`view-edit-employee-details-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              >
                <span className="view-edit-employee-details-step-number">{index + 1}</span>
                <span className="view-edit-employee-details-step-title">{step.title}</span>
              </div>
            ))}
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              {renderStepContent()}

              <div className="view-edit-employee-details-form-actions">
                {isEditing ? (
                  <>
                    {currentStep > 0 && (
                      <button type="button" className="view-edit-employee-details-btn view-edit-employee-details-btn-secondary" onClick={handlePrevious}>
                        Previous
                      </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <button type="button" className="view-edit-employee-details-btn view-edit-employee-details-btn-primary" onClick={handleNext}>
                        Next
                      </button>
                    ) : (
                      <button type="submit" className="view-edit-employee-details-btn view-edit-employee-details-btn-success">
                        Save Changes
                      </button>
                    )}
                    <button type="button" className="view-edit-employee-details-btn view-edit-employee-details-btn-danger" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" className="view-edit-employee-details-btn view-edit-employee-details-btn-primary" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default ViewEditEmployeeDetails; 