import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authAPI } from '../api/apiService';
import { Link, useLocation } from 'react-router-dom';
import '../styles/RegistrationForm.css';

// Update Yup schema for password validation
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  dateOfBirth: yup
    .string()
    .required('Date of Birth is required')
    .test('age-range', 'Age must be between 18 and 90 years', function (value) {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      const ageDifMs = today - dob;
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      return age >= 18 && age <= 90;
    }),
  gender: yup.string().required('Gender is required'),
  email: yup.string()
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must include @ and be valid'),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit phone number')
    .required('Phone number is required'),
  role: yup.string().required('Role is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character'),
});

const RegistrationForm = () => {
  const location = useLocation();
  const initialRole = location.state?.role || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: initialRole },
  });

  const [emailValue, setEmailValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!resendTimer) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!emailValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Enter a valid email first');
      return;
    }
    try {
      await authAPI.sendOTP(emailValue);
      setOtpSent(true);
      setResendTimer(30);
      alert('OTP sent');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to send OTP');
      console.error(e);
    }
  };
   
  // ✅ Handle Verify OTP
  const handleVerifyOTP = async () => {
    try {
      await authAPI.verifyOTP({
        email: emailValue,
        otp: otp,
      });
      alert("Email verified successfully!");
      setEmailVerified(true);
    } catch (error) {
      alert("OTP verification error.");
      console.error(error);
    }
  };

  // ✅ Final Registration Submission to backend
  const onSubmit = async (data) => {
    if (!emailVerified) {
      alert('Please verify your email before submitting.');
      return;
    }

    try {
      console.log('Submitting registration data:', data);
      const response = await authAPI.register(data);
      console.log('Registration successful:', response);
      
      // Show success message with approval notice
      alert('Registration successful! Please wait for admin approval. You will receive an email with login credentials once approved.');
      
      // Reset form
      reset();
      setEmailVerified(false);
      setOtpSent(false);
      setEmailValue('');
      setOtp('');
      
      // Don't navigate to login - user needs to wait for approval
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      {/* Left Info Panel */}
      <div className="info-panel">
        <div className="brand-header">
          <div className="brand-logo">
            <span className="brand-text">Date</span>
            <span className="brand-accent">Agri</span>
            <span className="brand-icon">🌿</span>
            <span className="brand-text">Stack</span>
          </div>
          <h1 className="main-title">India Farmer Registry</h1>
        </div>

        <div className="platform-info">
          <h2>Digital Agristack Transaction Enterprises</h2>
          <p className="tagline">Empowering Agricultural Excellence</p>
        </div>

        {/* Feature Highlights */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <div className="feature-content">
              <h3>Revolutionizing Indian Agriculture</h3>
              <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <div className="feature-content">
              <h3>Smart Farming Technology</h3>
              <p>AI-powered crop monitoring and precision agriculture tools</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <div className="feature-content">
              <h3>Financial Inclusion</h3>
              <p>Direct benefit transfers and digital payment solutions</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <div className="feature-content">
              <h3>Sustainable Practices</h3>
              <p>Promoting eco-friendly farming and climate-smart agriculture</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <div className="feature-content">
              <h3>National Recognition</h3>
              <p>Government of India's flagship agricultural digitization initiative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="form-panel">
        <div className="form-card">
          {/* Form Header */}
          <div className="form-header">
            <div className="date-logo-section">
              <div className="date-logo">
                <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <g stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round">
                    <path d="M12 24 C12 32 12 40 12 48"/>
                    <path d="M32 24 C32 32 32 40 32 48"/>
                    <path d="M52 24 C52 32 52 40 52 48"/>
                  </g>
                  <g>
                    <g transform="translate(12 16)"><ellipse cx="0" cy="0" rx="4" ry="8" fill="#FACC15" stroke="#D97706" strokeWidth="2"/><circle cx="0" cy="0" r="6" fill="#8B5E3C" stroke="#A16207" strokeWidth="2"/></g>
                    <g transform="translate(32 14)"><ellipse cx="0" cy="0" rx="4" ry="8" fill="#FACC15" stroke="#D97706" strokeWidth="2"/><circle cx="0" cy="0" r="6" fill="#8B5E3C" stroke="#A16207" strokeWidth="2"/></g>
                    <g transform="translate(52 16)"><ellipse cx="0" cy="0" rx="4" ry="8" fill="#FACC15" stroke="#D97706" strokeWidth="2"/><circle cx="0" cy="0" r="6" fill="#8B5E3C" stroke="#A16207" strokeWidth="2"/></g>
                  </g>
                </svg>
              </div>
              <div className="date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            <div className="form-title-section">
              <h2 className="form-title">Registration Form</h2>
              <p className="form-subtitle">Enter your details to get started</p>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            {/* Role Field (Hidden) */}
            <input type="hidden" {...register('role')} value={initialRole} />
            
            {/* Role Display (if provided) */}
            {initialRole && (
              <div className="form-group">
                <label className="form-label">Role</label>
                <input 
                  type="text" 
                  value={initialRole} 
                  readOnly 
                  className="form-input role-field" 
                />
              </div>
            )}

            {/* Form Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  {...register('name')} 
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your first name"
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Gender <span className="required">*</span></label>
                <select 
                  {...register('gender')} 
                  className={`form-input ${errors.gender ? 'error' : ''}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth <span className="required">*</span></label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input 
                  type="text" 
                  {...register('phoneNumber')} 
                  className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                  placeholder="Enter 10-digit number"
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  {...register('email')}
                  value={emailValue}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                    setOtpSent(false);
                    setEmailVerified(false);
                  }}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <input
                  type="password"
                  {...register('password')}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter a strong password"
                  autoComplete="new-password"
                />
                {errors.password && <span className="error-message">{errors.password.message}</span>}
              </div>
            </div>

            {/* Email Verification Section */}
            <div className="email-verification">
              {(!otpSent && !emailVerified) && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="btn btn-primary"
                >
                  Send OTP
                </button>
              )}
              
              {(otpSent && !emailVerified) && (
                <div className="otp-section">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="otp-input"
                  />
                  <div className="otp-buttons">
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="btn btn-secondary"
                      disabled={resendTimer > 0}
                    >
                      {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      className="btn btn-primary"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
              
              {emailVerified && (
                <div className="verification-success">
                  <span className="success-icon">✓</span>
                  Email Verified
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button type="submit" className="btn btn-submit">
                Register Now ...
              </button>
            </div>

            {/* Login Link */}
            <div className="login-link">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm; 