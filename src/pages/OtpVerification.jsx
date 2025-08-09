// src/pages/OtpVerification.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';
import '../styles/Login.css';
 
const OtpVerification = () => {
  /* ───────── STATE ───────── */
  const [otp,         setOtp]         = useState('');
  const [timer,       setTimer]       = useState(30);  // 30‑second cooldown
  const [canResend,   setCanResend]   = useState(false);
 
  const navigate  = useNavigate();
  const location  = useLocation();
  const { target, type } = location.state || {};        // { target, type: "userId" | "password" }
 
  /* ───────── GUARD ───────── */
  useEffect(() => {
    if (!target || !type) {
      alert('Invalid navigation – redirecting.');
      navigate('/forgot-password');
    }
  }, [target, type, navigate]);
 
  /* ───────── TIMER ───────── */
  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1_000);
    return () => clearInterval(id);
  }, [timer]);
 
  /* ───────── VERIFY ───────── */
  const handleVerify = async () => {
    if (otp.length !== 6) { alert('Enter a 6‑digit OTP'); return; }
    try {
      await authAPI.verifyOTP({ email: target, otp });
      alert('OTP verified ✔️');
      if (type === 'userId') {
        navigate('/change-userid', { state: { target } });
      } else {
        navigate('/change-password', { state: { target } });
      }
    } catch (err) {
      console.error(err);
      alert('Invalid or expired OTP.');
    }
  };
 
  /* ───────── RESEND ───────── */
  const handleResend = async () => {
    if (!canResend) return;
    try {
      await authAPI.resendOTP(target);
      alert('OTP resent!');
      setTimer(30);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      console.error(err);
      alert('Could not resend OTP.');
    }
  };
 
  /* ───────── UI ───────── */
  return (
    <div className="otp-verification-page-container">
      {/* Top Navigation Bar */}
      <nav className="otp-verification-page-navbar">
        <div className="otp-verification-page-logo">
          <span>DATE</span>
        </div>
        <div className="otp-verification-page-nav-links">
          <a href="#dashboard">Dashboard</a>
          <span className="otp-verification-page-nav-dot">•</span>
          <a href="#enrollment">Check Enrollment Status</a>
          <span className="otp-verification-page-nav-dot">•</span>
          <a href="#csc">Login with CSC</a>
        </div>
      </nav>

      <div className="otp-verification-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="otp-verification-page-info-panel">
          <div className="otp-verification-page-agri-stack-header">
            <h1 className="otp-verification-page-agri-stack-title">
              <span className="otp-verification-page-agri-text">Date</span>
              <span className="otp-verification-page-agri-text">Agri</span>
              <span className="otp-verification-page-leaf-icon">🌿</span>
              <span className="otp-verification-page-stack-text">Stack</span>
            </h1>
            <h2 className="otp-verification-page-registry-title">India Farmer Registry</h2>
          </div>
          <div className="otp-verification-page-registry-info">
            <h3>Digital Agristack Transaction Enterprises</h3>
            <p className="otp-verification-page-help-desk">
              Empowering Agricultural Excellence
            </p>
          </div>
          
          {/* Enhanced Agricultural Content */}
          <div className="otp-verification-page-agricultural-highlights">
            <div className="otp-verification-page-highlight-item">
              <span className="otp-verification-page-highlight-icon">🌾</span>
              <div className="otp-verification-page-highlight-content">
                <h4>Revolutionizing Indian Agriculture</h4>
                <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
              </div>
            </div>
            
            <div className="otp-verification-page-highlight-item">
              <span className="otp-verification-page-highlight-icon">📱</span>
              <div className="otp-verification-page-highlight-content">
                <h4>Smart Farming Technology</h4>
                <p>AI-powered crop monitoring and precision agriculture tools</p>
              </div>
            </div>
            
            <div className="otp-verification-page-highlight-item">
              <span className="otp-verification-page-highlight-icon">💰</span>
              <div className="otp-verification-page-highlight-content">
                <h4>Financial Inclusion</h4>
                <p>Direct benefit transfers and digital payment solutions</p>
              </div>
            </div>
            
            <div className="otp-verification-page-highlight-item">
              <span className="otp-verification-page-highlight-icon">🌱</span>
              <div className="otp-verification-page-highlight-content">
                <h4>Sustainable Practices</h4>
                <p>Promoting eco-friendly farming and climate-smart agriculture</p>
              </div>
            </div>
            
            <div className="otp-verification-page-highlight-item">
              <span className="otp-verification-page-highlight-icon">🏆</span>
              <div className="otp-verification-page-highlight-content">
                <h4>National Recognition</h4>
                <p>Government of India's flagship agricultural digitization initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - OTP Verification Form */}
        <div className="otp-verification-page-form-section">
          <div className="otp-verification-page-card">
            {/* DATE Logo at Top */}
            <div className="otp-verification-page-date-logo-section">
              <div className="otp-verification-page-date-logo">DATE</div>
              <div className="otp-verification-page-date-text">
                <h3>Digital Agristack Transaction Enterprises</h3>
                <p>Empowering Agricultural Excellence</p>
              </div>
            </div>

            <div className="otp-verification-page-content">
              <h2>Email Verification</h2>
              <p>We sent a 6-digit code to <strong>{target}</strong></p>
              <form>
                <div className="otp-verification-page-form-field">
                  <label htmlFor="otpInput">Enter OTP</label>
                  <input
                    id="otpInput"
                    className="otp-verification-page-otp-input"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="otp-verification-page-resend-otp">
                  {canResend ? (
                    <button onClick={handleResend} className="otp-verification-page-resend-btn">Resend OTP</button>
                  ) : (
                    <span className="otp-verification-page-resend-timer">Resend in {timer}s</span>
                  )}
                </div>
                <div className="otp-verification-page-buttons">
                  <button className="otp-verification-page-login-btn" onClick={handleVerify}>Verify</button>
                  <button className="otp-verification-page-create-account-btn" onClick={() => navigate(-1)}>Back</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default OtpVerification; 