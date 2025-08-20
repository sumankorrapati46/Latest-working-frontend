import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api/apiService';
import logo from '../assets/rightlogo.png';
import '../styles/Login.css';

const generateCaptcha = () => {
  // Random captcha generation
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('official'); // 'official', 'fpo', 'employee', 'farmer'
  const [captcha, setCaptcha] = useState('');
  const [captchaValue, setCaptchaValue] = useState(generateCaptcha());
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate captcha on component mount
  useEffect(() => {
    setCaptchaValue(generateCaptcha());
    
    // Clear all tokens on login page load to ensure fresh start
    clearAllTokens();
  }, []);

  // Comprehensive token clearing function
  const clearAllTokens = () => {
    console.log('🧹 Clearing all authentication data...');
    
    // Clear all possible localStorage keys
    const keysToRemove = [
      'token', 'user', 'authToken', 'jwtToken', 'accessToken', 
      'refreshToken', 'auth', 'session', 'login'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Clear all localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear any other possible storage
    if (window.indexedDB) {
      indexedDB.deleteDatabase('firebaseLocalStorage');
    }
    
    console.log('✅ All authentication data cleared');
  };

  // Get current date
  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  const handleLoginType = (type) => {
    setLoginType(type);
    setError('');
    setCaptcha('');
    setCaptchaValue(generateCaptcha());
  };

  const handleRefreshCaptcha = () => {
    setCaptchaValue(generateCaptcha());
    setCaptcha('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate captcha
    if (captcha.trim().toLowerCase() !== captchaValue.toLowerCase()) {
      setError('Captcha does not match.');
      setLoading(false);
      setCaptchaValue(generateCaptcha());
      setCaptcha('');
      return;
    }
    
    try {
      // ALWAYS clear tokens before login
      localStorage.clear();
      sessionStorage.clear();
      
      // Use correct field names
      const credentials = {
        userName: userName,
        password: password
      };
      
      console.log('🔍 Attempting login with:', credentials);
      
      const response = await authAPI.login(credentials);
      const { token, user, message } = response;
      
      console.log('✅ Login successful:', message);
      
      // Store new token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      const role = user.role;
      switch (role) {
        case 'SUPER_ADMIN':
          window.location.href = '/super-admin/dashboard';
          break;
        case 'ADMIN':
          window.location.href = '/admin/dashboard';
          break;
        case 'EMPLOYEE':
          window.location.href = '/employee/dashboard';
          break;
        case 'FARMER':
          window.location.href = '/farmer/dashboard';
          break;
        default:
          window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
      setLoading(false);
      setCaptchaValue(generateCaptcha());
      setCaptcha('');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    if (loginType === 'employee') {
      navigate('/register-employee', { state: { role: 'EMPLOYEE' } });
    } else if (loginType === 'farmer') {
      navigate('/register-farmer', { state: { role: 'FARMER' } });
    } else if (loginType === 'fpo') {
      navigate('/register-fpo', { state: { role: 'FPO' } });
    }
  };

  return (
    <div className="login-page-container">
      {/* Fixed Top Header */}
      <header className="login-page-header">
        <div className="login-page-header-content">
          {/* Left Side - Logo and Calendar */}
          <div className="login-page-header-left">
            <div className="login-page-header-logo">
              <img src={logo} alt="DATE Logo" className="header-logo" />
            </div>
            <div className="login-page-header-date">
              <span className="date-icon"></span>
              <span className="date-text">{getCurrentDate()}</span>
            </div>
          </div>
          
          {/* Right Side - Menu Items */}
          <nav className="login-page-header-nav">
            <ul className="login-page-header-menu">
              <li><button onClick={() => navigate('/menu')} className="header-menu-link">Menu</button></li>
              <li><button onClick={() => navigate('/analytical-dashboard')} className="header-menu-link">Dashboard</button></li>
              <li><button onClick={() => navigate('/about')} className="header-menu-link">About</button></li>
            </ul>
          </nav>
        </div>
      </header>

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
            <h2>Digital Agristack Transaction Enterprises</h2>
            <p className="login-page-tagline">Empowering Agricultural Excellence</p>
          </div>

          {/* Feature Highlights */}
          <div className="login-page-features-grid">
            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🌾</div>
              <div className="login-page-feature-content">
                <h3>Revolutionizing Indian Agriculture</h3>
                <p>Connecting 140+ million farmers with cutting-edge digital solutions</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">📱</div>
              <div className="login-page-feature-content">
                <h3>Smart Farming Technology</h3>
                <p>AI-powered crop monitoring and precision agriculture tools</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">💰</div>
              <div className="login-page-feature-content">
                <h3>Financial Inclusion</h3>
                <p>Direct benefit transfers and digital payment solutions</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🌱</div>
              <div className="login-page-feature-content">
                <h3>Sustainable Practices</h3>
                <p>Promoting eco-friendly farming and climate-smart agriculture</p>
              </div>
            </div>

            <div className="login-page-feature-card">
              <div className="login-page-feature-icon">🏆</div>
              <div className="login-page-feature-content">
                <h3>National Recognition</h3>
                <p>Government of India's flagship agricultural digitization initiative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
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
            {/* Login Type Section */}
            <div className="login-page-login-type-section">
              <h3>Log In as</h3>
              <div className="login-page-login-type-toggle">
                <button 
                  type="button"
                  className={`login-page-toggle-btn ${loginType === 'official' ? 'login-page-active' : ''}`}
                  onClick={() => handleLoginType('official')}
                >
                  Official
                </button>
                <button 
                  type="button"
                  className={`login-page-toggle-btn ${loginType === 'fpo' ? 'login-page-active' : ''}`}
                  onClick={() => handleLoginType('fpo')}
                >
                  FPO
                </button>
                <button 
                  type="button"
                  className={`login-page-toggle-btn ${loginType === 'employee' ? 'login-page-active' : ''}`}
                  onClick={() => handleLoginType('employee')}
                >
                  Employee
                </button>
                <button 
                  type="button"
                  className={`login-page-toggle-btn ${loginType === 'farmer' ? 'login-page-active' : ''}`}
                  onClick={() => handleLoginType('farmer')}
                >
                  Farmer
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-page-form">
              {/* Username Field */}
              <div className="login-page-form-field">
                <label>Insert Registered Mobile Number as Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter username"
                />
              </div>

              {/* Password Field */}
              <div className="login-page-form-field">
                <label>Enter password</label>
                <div className="login-page-password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="login-page-eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁️
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="login-page-forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
                <span className="login-page-separator">|</span>
                <a href="/forgot-userid">Forgot User ID?</a>
              </div>

              {/* Captcha Section */}
              <div className="login-page-captcha-section">
                <label>Captcha</label>
                <div className="login-page-captcha-container">
                  <div className="login-page-captcha-image">
                    <span>{captchaValue}</span>
                  </div>
                  <button type="button" className="login-page-refresh-captcha" onClick={handleRefreshCaptcha}>
                    🔄
                  </button>
                  <input
                    type="text"
                    value={captcha}
                    onChange={e => setCaptcha(e.target.value)}
                    placeholder="Enter Captcha"
                    className="login-page-captcha-input"
                  />
                </div>
              </div>

              {error && <div className="login-page-error-message">{error}</div>}
              
              <div className="login-page-actions-row">
                <button type="submit" className="login-page-login-btn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
                {(loginType === 'employee' || loginType === 'farmer' || loginType === 'fpo') && (
                  <button
                    type="button"
                    className="login-page-create-account-btn"
                    onClick={handleCreateAccount}
                  >
                    Create New user Acount
                  </button>
                )}
              </div>
              

              

              

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 