import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { authAPI } from "../api/apiService";
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
 
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
    <div className="forgot-password-page-container">
      {/* Top Navigation Bar */}
      <nav className="forgot-password-page-navbar">
        <div className="forgot-password-page-logo">
          <span>DATE</span>
        </div>
        <div className="forgot-password-page-nav-links">
          <a href="#dashboard">Dashboard</a>
          <span className="forgot-password-page-nav-dot">•</span>
          <a href="#enrollment">Check Enrollment Status</a>
          <span className="forgot-password-page-nav-dot">•</span>
          <a href="#csc">Login with CSC</a>
        </div>
      </nav>

      <div className="forgot-password-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="forgot-password-page-info-panel">
          <div className="forgot-password-page-agri-stack-header">
            <h1 className="forgot-password-page-agri-stack-title">
              <span className="forgot-password-page-agri-text">Date</span>
              <span className="forgot-password-page-agri-text">Agri</span>
              <span className="forgot-password-page-leaf-icon">🌿</span>
              <span className="forgot-password-page-stack-text">Stack</span>
            </h1>
            <h2 className="forgot-password-page-registry-title">India Farmer Registry</h2>
          </div>
          <div className="forgot-password-page-registry-info">
            <h3>Digital Agristack Transaction Enterprises</h3>
            <p className="forgot-password-page-help-desk">
              Empowering Agricultural Excellence
            </p>
          </div>
          
          {/* Enhanced Agricultural Content */}
          <div className="forgot-password-page-agricultural-highlights">
            <div className="forgot-password-page-highlight-item">
              <span className="forgot-password-page-highlight-icon">🌾</span>
              <div className="forgot-password-page-highlight-content">
                <h4>Revolutionizing Indian Agriculture</h4>
                <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
              </div>
            </div>
            
            <div className="forgot-password-page-highlight-item">
              <span className="forgot-password-page-highlight-icon">📱</span>
              <div className="forgot-password-page-highlight-content">
                <h4>Smart Farming Technology</h4>
                <p>AI-powered crop monitoring and precision agriculture tools</p>
              </div>
            </div>
            
            <div className="forgot-password-page-highlight-item">
              <span className="forgot-password-page-highlight-icon">💰</span>
              <div className="forgot-password-page-highlight-content">
                <h4>Financial Inclusion</h4>
                <p>Direct benefit transfers and digital payment solutions</p>
              </div>
            </div>
            
            <div className="forgot-password-page-highlight-item">
              <span className="forgot-password-page-highlight-icon">🌱</span>
              <div className="forgot-password-page-highlight-content">
                <h4>Sustainable Practices</h4>
                <p>Promoting eco-friendly farming and climate-smart agriculture</p>
              </div>
            </div>
            
            <div className="forgot-password-page-highlight-item">
              <span className="forgot-password-page-highlight-icon">🏆</span>
              <div className="forgot-password-page-highlight-content">
                <h4>National Recognition</h4>
                <p>Government of India's flagship agricultural digitization initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Forgot Password Form */}
        <div className="forgot-password-page-form-section">
          <div className="forgot-password-page-card">
            {/* DATE Logo at Top */}
            <div className="forgot-password-page-date-logo-section">
              <div className="forgot-password-page-date-logo">DATE</div>
              <div className="forgot-password-page-date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            <div className="forgot-password-page-content">
              <h2>Forgot Password</h2>
              <p>Enter your email address, click "Reset password", and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="forgot-password-page-form-field">
                  <label>Email<span className="forgot-password-page-required">*</span></label>
                  <input
                    {...register("userInput")}
                    placeholder="Enter your Email"
                    className={errors.userInput ? 'forgot-password-page-error' : ''}
                  />
                  {errors.userInput && <div className="forgot-password-page-error">{errors.userInput.message}</div>}
                </div>
                <button type="submit" className="forgot-password-page-login-btn">Reset password</button>
              </form>
            </div>

            {/* Success Popup */}
            {showPopup && (
              <div className="forgot-password-page-popup">
                <div className="forgot-password-page-popup-content">
                  <h3>Success!</h3>
                  <h4>
                    A reset link has been sent to <strong>{target}</strong>
                  </h4>
                  <button onClick={handlePopupClose}>OK</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ForgotPassword; 