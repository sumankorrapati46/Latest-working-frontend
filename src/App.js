import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Login'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const SuperAdminDashboard = React.lazy(() => import('./pages/SuperAdminDashboard'));
const EmployeeDashboard = React.lazy(() => import('./pages/EmployeeDashboard'));
const FarmerDashboard = React.lazy(() => import('./pages/FarmerDashboard'));
const FarmerRegistration = React.lazy(() => import('./pages/FarmerRegistration'));
const EmployeeRegistration = React.lazy(() => import('./pages/EmployeeRegistration'));
const RegistrationForm = React.lazy(() => import('./pages/RegistrationForm'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ForgotUserId = React.lazy(() => import('./pages/ForgotUserid'));
const ChangePassword = React.lazy(() => import('./pages/ChangePassword'));
const ChangeUserId = React.lazy(() => import('./pages/ChangeUserId'));
const OtpVerification = React.lazy(() => import('./pages/OtpVerification'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-container">
    <LoadingSpinner size="large" text="Loading..." />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/forgot-userid" element={<ForgotUserId />} />
                <Route path="/otp-verification" element={<OtpVerification />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/change-userid" element={<ChangeUserId />} />
                
                {/* Registration Routes */}
                <Route path="/farmer/registration" element={<FarmerRegistration />} />
                <Route path="/employee/registration" element={<EmployeeRegistration />} />
                <Route path="/register-employee" element={<RegistrationForm />} />
                <Route path="/register-farmer" element={<RegistrationForm />} />
                <Route path="/register-fpo" element={<RegistrationForm />} />
                
                {/* Protected Dashboard Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/superadmin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employee/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['FARMER']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Default Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
