import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authAPI } from '../api/apiService';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/rightlogo.png';
import '../styles/Login.css';

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
    <div className="login-page-container">
      <div className="login-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="login-page-info-panel">
          <div className="login-page-brand-header">
            <div className="login-page-brand-logo">
              <span className="login-page-brand-text">Date</span>
              <span className="login-page-brand-accent">Agri</span>
              <span className="login-page-brand-icon">🌿</span>
              <span className="login-page-brand-text">Stack</span>
            </div>
            <h1 className="login-page-main-title">India Farmer Registry</h1>
          </div>

          <div className="login-page-platform-info">
            <h2>Join Our Platform</h2>
            <p className="login-page-tagline">Become part of India's agricultural revolution</p>
          </div>

          {/* Feature Highlights */}
          <div className="login-page-features-grid">
            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🚀</div>
              <div className="login-page-feature-content">
                <h3>Quick Registration</h3>
                <p>Get started in minutes with our streamlined signup process</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🔒</div>
              <div className="login-page-feature-content">
                <h3>Secure Verification</h3>
                <p>Email verification ensures your account security</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">📋</div>
              <div className="login-page-feature-content">
                <h3>Easy Profile Setup</h3>
                <p>Simple form to create your personalized account</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">⚡</div>
              <div className="login-page-feature-content">
                <h3>Instant Access</h3>
                <p>Start using platform features immediately after approval</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🎯</div>
              <div className="login-page-feature-content">
                <h3>Tailored Experience</h3>
                <p>Customized dashboard based on your role and needs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="login-page-form-section">
          <div className="login-page-card">
            {/* DATE Logo at Top */}
            <div className="login-page-date-logo-section">
              <img src={logo} alt="DATE Logo" className="login-page-date-logo" />
              <div className="login-page-date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            {/* Form Title Section */}
            <div className="login-page-login-type-section">
              <h3>Registration Form</h3>
              <p>Enter your details to get started</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-page-form">
              {/* Role Field (Hidden) */}
              <input type="hidden" {...register('role')} value={initialRole} />
              
              {/* Role Display (if provided) */}
              {initialRole && (
                <div className="login-page-form-field">
                  <label>Role</label>
                  <input 
                    type="text" 
                    value={initialRole} 
                    readOnly 
                    className="login-page-form-input role-field" 
                  />
                </div>
              )}

              {/* Form Fields Grid Layout */}
              <div className="form-fields-grid">
                {/* Row 1: Name and Gender */}
                <div className="form-row">
                  <div className="login-page-form-field">
                    <label>Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      {...register('name')} 
                      className={`login-page-form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                  </div>

                  <div className="login-page-form-field">
                    <label>Gender <span className="required">*</span></label>
                    <select 
                      {...register('gender')} 
                      className={`login-page-form-input ${errors.gender ? 'error' : ''}`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                  </div>
                </div>

                {/* Row 2: Date of Birth and Phone Number */}
                <div className="form-row">
                  <div className="login-page-form-field">
                    <label>Date of Birth <span className="required">*</span></label>
                    <input
                      type="date"
                      {...register('dateOfBirth')}
                      className={`login-page-form-input ${errors.dateOfBirth ? 'error' : ''}`}
                    />
                    {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth.message}</span>}
                  </div>

                  <div className="login-page-form-field">
                    <label>Phone Number <span className="required">*</span></label>
                    <input 
                      type="text" 
                      {...register('phoneNumber')} 
                      className={`login-page-form-input ${errors.phoneNumber ? 'error' : ''}`}
                      placeholder="Enter 10-digit number"
                    />
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber.message}</span>}
                  </div>
                </div>

                {/* Row 3: Email and Password */}
                <div className="form-row">
                  <div className="login-page-form-field">
                    <label>Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      {...register('email')}
                      value={emailValue}
                      onChange={(e) => {
                        setEmailValue(e.target.value);
                        setOtpSent(false);
                        setEmailVerified(false);
                      }}
                      className={`login-page-form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>

                  <div className="login-page-form-field">
                    <label>Password <span className="required">*</span></label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`login-page-form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Enter a strong password"
                      autoComplete="new-password"
                    />
                    {errors.password && <span className="error-message">{errors.password.message}</span>}
                  </div>
                </div>
              </div>

              {/* Email Verification Section */}
              <div className="email-verification">
                {(!otpSent && !emailVerified) && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="login-page-login-btn"
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
                      className="login-page-form-input"
                    />
                    <div className="otp-buttons">
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="login-page-create-account-btn"
                        disabled={resendTimer > 0}
                      >
                        {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        className="login-page-login-btn"
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
              <div className="login-page-actions-row">
                <button type="submit" className="login-page-login-btn">
                  Register Now
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
    </div>
  );
};

export default RegistrationForm; 