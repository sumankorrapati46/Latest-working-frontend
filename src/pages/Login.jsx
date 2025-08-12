import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
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
  const { login } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('official'); // 'official', 'fpo', 'employee', 'farmer'
  const [captcha, setCaptcha] = useState('');
  const [captchaValue, setCaptchaValue] = useState(generateCaptcha());
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    if (captcha.trim().toLowerCase() !== captchaValue.toLowerCase()) {
      setError('Captcha does not match.');
      setLoading(false);
      setCaptchaValue(generateCaptcha());
      setCaptcha('');
      return;
    }
    try {
      const loginData = { userName, password };
      const response = await authAPI.login(loginData);
      console.log('Login - Full login response:', response);
      console.log('Login - Login response data keys:', Object.keys(response || {}));
      const { token } = response;
      // Immediately persist token so profile call includes Authorization header
      if (token) {
        localStorage.setItem('token', token);
      }
      
      // Helpers to sanitize and map roles consistently
      const normalizeRawRole = (role) => (role || '').toString().toUpperCase().trim();
      const toKnownRole = (role) => {
        const r = normalizeRawRole(role)
          .replace(/^ROLE[ _-]*/, '')
          .replace(/-/g, '_')
          .replace(/\s+/g, '_');
        if (r.includes('SUPER') && r.includes('ADMIN')) return 'SUPER_ADMIN';
        if (r === 'SUPERADMIN') return 'SUPER_ADMIN';
        if (r.includes('ADMIN') && !r.includes('SUPER')) return 'ADMIN';
        if (r.includes('EMPLOYEE') || r.includes('STAFF')) return 'EMPLOYEE';
        if (r.includes('FARMER')) return 'FARMER';
        return '';
      };
      const roleFromLoginType = () => {
        switch (loginType) {
          case 'official':
            return 'ADMIN';
          case 'employee':
            return 'EMPLOYEE';
          case 'farmer':
            return 'FARMER';
          case 'fpo':
            return 'ADMIN';
          default:
            return '';
        }
      };
      try {
        // Get user profile with token
        const userData = await authAPI.getProfile();
        console.log('Login - Profile response data:', userData);
        console.log('Login - Profile response data keys:', Object.keys(userData || {}));
        const user = {
          userName: userData.userName || userName,
          name: userData.name,
          email: userData.email,
          role: toKnownRole(userData.role) || roleFromLoginType() || 'FARMER',
          forcePasswordChange: userData.forcePasswordChange || false,
          status: userData.status
        };
        
        // For users with temporary passwords, force password change
        if (password.includes('Temp@')) {
          user.forcePasswordChange = true;
          console.log('Login - Detected temporary password, forcing password change');
        }
        
        console.log('Login - User data from profile:', user);
        console.log('Login - User role from profile:', userData.role);
        login(user, token);
        
        // Check if user needs to change password (first time login with temp password)
        console.log('Login - Checking forcePasswordChange:', user.forcePasswordChange);
        console.log('Login - Password contains Temp@:', password.includes('Temp@'));
        
        if (user.forcePasswordChange) {
          console.log('Login - Redirecting to change password page');
          navigate('/change-password');
          return;
        }
        
        // Role-based navigation after password change or normal login
        console.log('Login - User role for navigation (known):', user.role);
        console.log('Login - User role type:', typeof user.role);
        console.log('Login - User role length:', user.role?.length);
        console.log('Login - User role includes spaces:', user.role?.includes(' '));
        
        const normalizedRole = toKnownRole(user.role) || roleFromLoginType() || '';
        console.log('Login - Known role:', normalizedRole);
        
        if (normalizedRole === 'SUPER_ADMIN') {
          console.log('Login - Redirecting SUPER_ADMIN to /super-admin/dashboard');
          navigate('/super-admin/dashboard');
        } else if (normalizedRole === 'ADMIN') {
          console.log('Login - Redirecting ADMIN to /admin/dashboard');
          navigate('/admin/dashboard');
        } else if (normalizedRole === 'EMPLOYEE') {
          console.log('Login - Redirecting EMPLOYEE to /employee/dashboard');
          navigate('/employee/dashboard');
        } else {
          console.log('Login - Redirecting FARMER to /dashboard');
          navigate('/dashboard');
        }
      } catch (profileErr) {
        console.log('Profile fetch failed, trying alternative methods');
        console.log('Profile error:', profileErr);
        
        // Try to get role from login response first
        let role = toKnownRole(response.data?.role);
        let forcePasswordChange = response.data?.forcePasswordChange || false;
        
        // For users with temporary passwords, force password change
        if (password.includes('Temp@')) {
          forcePasswordChange = true;
          console.log('Login - Detected temporary password, forcing password change');
        }
        
        // If role is not in login response, try to get it from the backend
        if (!role) {
          try {
            console.log('Login - Trying to get role from /auth/me endpoint');
            const meResponse = await authAPI.getProfile();
            console.log('Login - /auth/me response:', meResponse);
            role = toKnownRole(meResponse?.role);
            console.log('Login - Role from /auth/me:', role);
          } catch (meErr) {
            console.log('Login - /auth/me failed:', meErr);
            
            // Try another common endpoint
            try {
              console.log('Login - Trying to get role from /api/auth/users/profile endpoint');
              const altProfileResponse = await authAPI.getProfile();
              console.log('Login - /api/auth/users/profile response:', altProfileResponse);
              role = toKnownRole(altProfileResponse?.role);
              console.log('Login - Role from /api/auth/users/profile:', role);
            } catch (altErr) {
              console.log('Login - /api/auth/users/profile failed:', altErr);
            }
          }
        }
        
        // If still no role, try to determine from username or use a default
        if (!role) {
          console.log('Login - No role found, trying to determine from username');
          console.log('Login - Username being checked:', userName);
          // Check if username contains admin indicators
          const lowerUserName = userName.toLowerCase();
          
          // Specific username mapping for known accounts
          const superAdminUsernames = [
            'projecthinfintiy@12.in',
            'superadmin@hinfinity.in'
          ];
          
          const adminUsernames = [
            'karthik.m@hinfinity.in',
            'admin@hinfinity.in',
            'admin@date.in',
            'official@date.in'
          ];
          
          if (superAdminUsernames.includes(lowerUserName)) {
            role = 'SUPER_ADMIN';
            console.log('Login - Username matched super admin list');
          } else if (adminUsernames.includes(lowerUserName)) {
            role = 'ADMIN';
            console.log('Login - Username matched admin list');
          } else if (lowerUserName.includes('employee') || lowerUserName.includes('staff')) {
            role = 'EMPLOYEE';
            console.log('Login - Username contains employee/staff indicators');
          } else if (lowerUserName.includes('farmer') || lowerUserName.includes('kisan')) {
            role = 'FARMER';
            console.log('Login - Username contains farmer/kisan indicators');
          } else {
            // Default role based on login type
            role = roleFromLoginType();
            console.log('Login - Using default role from login type:', role);
          }
        }
        
        const user = {
          userName: userName,
          name: response.data?.name || userName,
          email: response.data?.email || '',
          role: role || 'FARMER',
          forcePasswordChange: forcePasswordChange,
          status: response.data?.status || 'ACTIVE'
        };
        
        console.log('Login - Fallback: User data from login response:', user);
        console.log('Login - Fallback: User role from login response:', user.role);
        login(user, token);
        
        // Check if user needs to change password (first time login with temp password)
        if (user.forcePasswordChange) {
          console.log('Login - Fallback: Redirecting to change password page');
          navigate('/change-password');
          return;
        }
        
        const normalizedRole = toKnownRole(role) || roleFromLoginType() || '';
        console.log('Login - Fallback: Known role:', normalizedRole);
        
        if (normalizedRole === 'SUPER_ADMIN') {
          console.log('Login - Fallback: Redirecting SUPER_ADMIN to /super-admin/dashboard');
          navigate('/super-admin/dashboard');
        } else if (normalizedRole === 'ADMIN') {
          console.log('Login - Fallback: Redirecting ADMIN to /admin/dashboard');
          navigate('/admin/dashboard');
        } else if (normalizedRole === 'EMPLOYEE') {
          console.log('Login - Fallback: Redirecting EMPLOYEE to /employee/dashboard');
          navigate('/employee/dashboard');
        } else {
          console.log('Login - Fallback: Redirecting FARMER to /dashboard');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Login error response:', err.response);
      console.error('Login error message:', err.message);
      setError(`Login failed: ${err.response?.data?.message || err.message || 'Invalid credentials or server error.'}`);
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