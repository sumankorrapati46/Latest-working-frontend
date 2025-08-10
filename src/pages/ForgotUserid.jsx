import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import logo from "../assets/rightlogo.png";
 
// ✅ Validation schema
const schema = Yup.object().shape({
  userInput: Yup.string()
    .required("Email / Phone / ID is required")
    .test(
      "is-valid",
      "Enter a valid Email (with '@' and '.'), 10-digit Phone number, or ID (min 6 characters)",
      (value = "") => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        return (
          emailRegex.test(value) ||
          phoneRegex.test(value) ||
          (value.length >= 6 && !emailRegex.test(value) && !phoneRegex.test(value))
        );
      }
    ),
});
 
const ForgotUserId = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
 
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState("");
  const navigate = useNavigate();
 
   const onSubmit = async (data) => {
    try {
       await axios.post("http://localhost:8080/api/auth/forgot-user-id", {
        emailOrPhone: data.userInput,
      }, {
        headers: { "Content-Type": "application/json" },
      });
 
      setTarget(data.userInput);
      setShowPopup(true); // Show success popup
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send User ID. Please try again later.");
    }
  };
 
  const handlePopupClose = () => {
  setShowPopup(false);
  navigate('/otp-verification', { state: { target, type: 'userId' } });
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
            <h2>User ID Recovery</h2>
            <p className="login-page-tagline">Get back your account access quickly and securely</p>
          </div>

          {/* Feature Highlights */}
          <div className="login-page-features-grid">
            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🔍</div>
              <div className="login-page-feature-content">
                <h3>Quick Recovery</h3>
                <p>Find your User ID in just a few steps</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">📧</div>
              <div className="login-page-feature-content">
                <h3>Email Delivery</h3>
                <p>User ID sent directly to your email</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🛡️</div>
              <div className="login-page-feature-content">
                <h3>Secure Process</h3>
                <p>Your account information is protected</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">⚡</div>
              <div className="login-page-feature-content">
                <h3>Instant Access</h3>
                <p>Get your User ID immediately</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">✅</div>
              <div className="login-page-feature-content">
                <h3>Easy Login</h3>
                <p>Use your recovered User ID to log in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Forgot User ID Form */}
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
              <h3>Forgot User ID</h3>
              <p>Enter your email address or phone number to recover your User ID</p>
            </div>

            {/* Forgot User ID Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-page-form">
              <div className="login-page-form-field">
                <label>Email / Phone / ID <span className="required">*</span></label>
                <input
                  {...register("userInput")}
                  placeholder="Enter your Email, Phone, or ID"
                  className={`login-page-form-input ${errors.userInput ? 'error' : ''}`}
                />
                {errors.userInput && <span className="error-message">{errors.userInput.message}</span>}
              </div>
              
              <div className="login-page-actions-row">
                <button type="submit" className="login-page-login-btn">
                  Recover User ID
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-popup-content">
              <h3>User ID Sent Successfully!</h3>
              <p>We've sent your User ID to: <strong>{target}</strong></p>
              <p>Please check your email or phone for the User ID.</p>
              <button onClick={handlePopupClose} className="login-page-login-btn">
                Continue to OTP Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ForgotUserId; 