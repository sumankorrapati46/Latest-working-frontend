// src/pages/OtpVerification.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';
import '../styles/Login.css';
import logo from '../assets/rightlogo.png';
 
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
            <h2>Email Verification</h2>
            <p className="login-page-tagline">Secure your account with one-time verification</p>
          </div>

          {/* Feature Highlights */}
          <div className="login-page-features-grid">
            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🔐</div>
              <div className="login-page-feature-content">
                <h3>Secure Verification</h3>
                <p>One-time password ensures your account security</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">⚡</div>
              <div className="login-page-feature-content">
                <h3>Instant Delivery</h3>
                <p>OTP sent to your email within seconds</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🛡️</div>
              <div className="login-page-feature-content">
                <h3>Account Protection</h3>
                <p>Prevents unauthorized access to your account</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🔄</div>
              <div className="login-page-feature-content">
                <h3>Easy Resend</h3>
                <p>Request new OTP if you don't receive it</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">✅</div>
              <div className="login-page-feature-content">
                <h3>Quick Process</h3>
                <p>Complete verification in under 2 minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - OTP Verification Form */}
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
              <h3>OTP Verification</h3>
              <p>Enter the 6-digit OTP sent to: <strong>{target}</strong></p>
            </div>

            {/* OTP Verification Form */}
            <div className="login-page-form">
              <div className="login-page-form-field">
                <label>Enter OTP <span className="required">*</span></label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="login-page-form-input"
                  maxLength={6}
                />
              </div>

              <div className="login-page-actions-row">
                <button 
                  onClick={handleVerify} 
                  className="login-page-login-btn"
                  disabled={otp.length !== 6}
                >
                  Verify OTP
                </button>
              </div>

              <div className="login-page-forgot-password">
                <p>Didn't receive the OTP?</p>
                <button 
                  onClick={handleResend} 
                  className="login-page-create-account-btn"
                  disabled={!canResend}
                >
                  {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default OtpVerification; 