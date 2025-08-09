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
            'admin@hinfinity.in'
          ];
          
          const employeeUsernames = [
            'employee@hinfinity.in',
            'emp@hinfinity.in',
            'testemployee@hinfinity.in',
            'hari2912@gmail.com',
            'harish134@gmail.com',
            'employee2@hinfinity.in',
            'test@employee.com'
          ];
          
          console.log('Login - Checking against employee usernames:', employeeUsernames);
          console.log('Login - Username in employee list?', employeeUsernames.includes(userName));
          
          if (superAdminUsernames.includes(userName)) {
            role = 'SUPER_ADMIN';
            console.log('Login - Determined role as SUPER_ADMIN from specific username mapping');
          } else if (adminUsernames.includes(userName)) {
            role = 'ADMIN';
            console.log('Login - Determined role as ADMIN from specific username mapping');
          } else if (employeeUsernames.includes(userName)) {
            role = 'EMPLOYEE';
            console.log('Login - Determined role as EMPLOYEE from specific username mapping');
            console.log('Login - Employee username detected:', userName);
          } else {
            // Fall back to chosen login type mapping
            role = roleFromLoginType() || 'FARMER';
            console.log('Login - Falling back to loginType role:', role);
          }
        }
        
        const user = {
          userName: userName,
          name: response.data?.name || userName,
          email: response.data?.email || userName,
          role: role,
          forcePasswordChange: forcePasswordChange,
          status: response.data?.status || 'ACTIVE'
        };
        
        console.log('Login - Fallback user data:', user);
        login(user, token);
        
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
      {/* Top Navigation Bar */}
      <nav className="login-page-navbar">
        <div className="login-page-logo">
          <span>एनआईसी</span>
          <div className="login-page-logo-text">National Informatics Centre</div>
        </div>
        <div className="login-page-nav-links">
          <a href="#dashboard">Dashboard</a>
          <span className="login-page-nav-dot">•</span>
          <a href="#enrollment">Check Enrollment Status</a>
        </div>
      </nav>

      <div className="login-page-main-content">
        {/* Left Section - Information Panel */}
        <div className="login-page-info-panel">
          <div className="login-page-agri-stack-header">
            <h1 className="login-page-agri-stack-title">
              <span className="login-page-agri-text">Digital</span>
              <span className="login-page-stack-text">Agristack</span>
              <span className="login-page-leaf-icon">🌿</span>
            </h1>
            <h2 className="login-page-registry-title">India Farmer Registry</h2>
          </div>
          <div className="login-page-registry-info">
            <p className="login-page-registry-description">
              Farmer Registry in India enables farmers to receive a unique Farmer ID to access government benefits. 
              Register now to ensure seamless access to agricultural schemes and services!
            </p>
          </div>
          
          <div className="login-page-help-desk">
            <p>Help Desk : 1800-425-1661</p>
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
                    required
                    disabled={loading}
                    placeholder="Enter password"
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