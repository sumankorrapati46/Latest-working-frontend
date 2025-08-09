import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import background from "../assets/green.png";
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
    <div className="forgot-userid-page-container">
      {/* Top Navigation Bar */}
      <nav className="forgot-userid-page-navbar">
        <div className="forgot-userid-page-logo">
          <span>DATE</span>
        </div>
        <div className="forgot-userid-page-nav-links">
          <a href="#dashboard">Dashboard</a>
          <span className="forgot-userid-page-nav-dot">•</span>
          <a href="#enrollment">Check Enrollment Status</a>
          <span className="forgot-userid-page-nav-dot">•</span>
          <a href="#csc">Login with CSC</a>
        </div>
      </nav>

      <div className="forgot-userid-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="forgot-userid-page-info-panel">
          <div className="forgot-userid-page-agri-stack-header">
            <h1 className="forgot-userid-page-agri-stack-title">
              <span className="forgot-userid-page-agri-text">Date</span>
              <span className="forgot-userid-page-agri-text">Agri</span>
              <span className="forgot-userid-page-leaf-icon">🌿</span>
              <span className="forgot-userid-page-stack-text">Stack</span>
            </h1>
            <h2 className="forgot-userid-page-registry-title">India Farmer Registry</h2>
          </div>
          <div className="forgot-userid-page-registry-info">
            <h3>Digital Agristack Transaction Enterprises</h3>
            <p className="forgot-userid-page-help-desk">
              Empowering Agricultural Excellence
            </p>
          </div>
          
          {/* Enhanced Agricultural Content */}
          <div className="forgot-userid-page-agricultural-highlights">
            <div className="forgot-userid-page-highlight-item">
              <span className="forgot-userid-page-highlight-icon">🌾</span>
              <div className="forgot-userid-page-highlight-content">
                <h4>Revolutionizing Indian Agriculture</h4>
                <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
              </div>
            </div>
            
            <div className="forgot-userid-page-highlight-item">
              <span className="forgot-userid-page-highlight-icon">📱</span>
              <div className="forgot-userid-page-highlight-content">
                <h4>Smart Farming Technology</h4>
                <p>AI-powered crop monitoring and precision agriculture tools</p>
              </div>
            </div>
            
            <div className="forgot-userid-page-highlight-item">
              <span className="forgot-userid-page-highlight-icon">💰</span>
              <div className="forgot-userid-page-highlight-content">
                <h4>Financial Inclusion</h4>
                <p>Direct benefit transfers and digital payment solutions</p>
              </div>
            </div>
            
            <div className="forgot-userid-page-highlight-item">
              <span className="forgot-userid-page-highlight-icon">🌱</span>
              <div className="forgot-userid-page-highlight-content">
                <h4>Sustainable Practices</h4>
                <p>Promoting eco-friendly farming and climate-smart agriculture</p>
              </div>
            </div>
            
            <div className="forgot-userid-page-highlight-item">
              <span className="forgot-userid-page-highlight-icon">🏆</span>
              <div className="forgot-userid-page-highlight-content">
                <h4>National Recognition</h4>
                <p>Government of India's flagship agricultural digitization initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Forgot User ID Form */}
        <div className="forgot-userid-page-form-section">
          <div className="forgot-userid-page-card">
            {/* DATE Logo at Top */}
            <div className="forgot-userid-page-date-logo-section">
              <img src={logo} alt="DATE Logo" className="forgot-userid-page-date-logo" />
              <div className="forgot-userid-page-date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            <div className="forgot-userid-page-content">
              <h2>Forgot User ID</h2>
              <p>Enter your Email / Phone / ID, click "Reset User ID", and we'll send your User ID if it exists.</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="forgot-userid-page-form-field">
                  <label>Email / Phone / ID <span className="forgot-userid-page-required">*</span></label>
                  <input
                    {...register("userInput")}
                    placeholder="Enter your Email or Phone or ID"
                    className={errors.userInput ? 'forgot-userid-page-error' : ''}
                  />
                  {errors.userInput && <div className="forgot-userid-page-error">{errors.userInput.message}</div>}
                </div>
                <button type="submit" className="forgot-userid-page-login-btn">Reset User ID</button>
              </form>
            </div>

            {/* Success Popup */}
            {showPopup && (
              <div className="forgot-userid-page-popup">
                <div className="forgot-userid-page-popup-content">
                  <h3>Success!</h3>
                  <h4>
                    Your User ID has been sent to <strong>{target}</strong>
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
 
export default ForgotUserId; 