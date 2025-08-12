import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { authAPI } from "../api/apiService";
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import logo from "../assets/rightlogo.png";

// ✅ Schema validation
const schema = Yup.object().shape({
  userInput: Yup.string()
    .required("Email / Phone / ID is required")
    .test(
      "valid-userInput",
      "Enter a valid Email (with '@' and '.'), 10-digit Phone number, or ID (min 6 characters)",
      function (value) {
        if (!value) return false;
 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
 
        const isEmail = emailRegex.test(value);
        const isPhone = phoneRegex.test(value);
        const isId = !isEmail && !isPhone && value.length >= 6;
 
        return isEmail || isPhone || isId;
      }
    ),
});
 
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
 
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState("");
 
   const navigate = useNavigate();
   const onSubmit = async (data) => {
    try {
      await authAPI.forgotPassword(data.userInput);
 
      setTarget(data.userInput);
      setShowPopup(true); // Show popup on success
    } catch (error) {
      console.error("Error sending reset request:", error);
      alert("Failed to send reset link. Please try again.");
    }
  };
 
     const handlePopupClose = () => {
  setShowPopup(false);
  navigate('/otp-verification', { state: { target, type: 'password' } });
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
            <h2>Password Recovery</h2>
            <p className="login-page-tagline">Don't worry! We'll help you get back to your account safely.</p>
          </div>

          {/* Feature Highlights */}
          <div className="login-page-features-grid">
            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🔐</div>
              <div className="login-page-feature-content">
                <h3>Secure Reset</h3>
                <p>Military-grade encryption protects your data</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">⚡</div>
              <div className="login-page-feature-content">
                <h3>Instant Link</h3>
                <p>Reset link delivered to your email instantly</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🛡️</div>
              <div className="login-page-feature-content">
                <h3>Account Protection</h3>
                <p>Your account remains secure during recovery</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">📱</div>
              <div className="login-page-feature-content">
                <h3>Multi-Device Access</h3>
                <p>Reset from any device, anywhere</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🎯</div>
              <div className="login-page-feature-content">
                <h3>One-Click Recovery</h3>
                <p>Simple process to regain account access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Forgot Password Form */}
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
              <h3>Forgot Password</h3>
              <p>Enter your email address, click "Reset password", and we'll send you a link to reset your password.</p>
            </div>

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-page-form">
              <div className="login-page-form-field">
                <label>Email <span className="required">*</span></label>
                <input
                  {...register("userInput")}
                  placeholder="Enter your Email"
                  className={`login-page-form-input ${errors.userInput ? 'error' : ''}`}
                />
                {errors.userInput && <span className="error-message">{errors.userInput.message}</span>}
              </div>
              
              <div className="login-page-actions-row">
                <button type="submit" className="login-page-login-btn">
                  Reset Password
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="login-link">
              <p>Remember your password? <a href="/login">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-popup-content">
              <h3>Success!</h3>
              <p>A reset link has been sent to <strong>{target}</strong></p>
              <button onClick={handlePopupClose} className="login-page-login-btn">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ForgotPassword; 