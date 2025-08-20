import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useApi } from '../hooks/useApi';
import { farmersAPI, employeesAPI, superAdminAPI, adminAPI } from '../api/apiService';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationToast from '../components/NotificationToast';
import SearchFilter from '../components/SearchFilter';
import ThemeDropdown from '../components/ThemeDropdown';

import RegistrationApprovalModal from '../components/RegistrationApprovalModal';
import RegistrationDetailModal from '../components/RegistrationDetailModal';
import ViewFarmerRegistrationDetails from '../components/ViewFarmerRegistrationDetails';
import AssignmentModal from '../components/AssignmentModal';
import FarmerForm from '../components/FarmerForm';
import ViewEditEmployeeDetails from '../components/ViewEditEmployeeDetails';
import EmployeeRegistrationForm from '../components/EmployeeRegistrationForm';
import KYCDocumentUpload from '../components/KYCDocumentUpload';
import DeleteModal from '../components/DeleteModal';
import UserProfileDropdown from '../components/UserProfileDropdown';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeUserIdModal from '../components/ChangeUserIdModal';

import '../styles/SuperAdminDashboard.css';
import '../styles/Themes.css';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentTheme, getThemeLabel } = useTheme();
  const { loading, error, executeApiCall } = useApi();
  
  // State management
  const [farmers, setFarmers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Modal states
  const [showRegistrationApprovalModal, setShowRegistrationApprovalModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showRegistrationDetailModal, setShowRegistrationDetailModal] = useState(false);
  const [selectedRegistrationForDetail, setSelectedRegistrationForDetail] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [selectedFarmerForKYC, setSelectedFarmerForKYC] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // View component states
  const [showViewFarmer, setShowViewFarmer] = useState(false);
  const [showViewEmployee, setShowViewEmployee] = useState(false);
  const [selectedFarmerForView, setSelectedFarmerForView] = useState(null);
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [selectedFarmerData, setSelectedFarmerData] = useState(null);

  // Change Password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUserId, setShowChangeUserId] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Memoized greeting function
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  }, []);

  // Memoized stats calculation
  const stats = useMemo(() => {
    const totalFarmers = farmers.length;
    const totalEmployees = employees.length;
    const totalRegistrations = registrations.length;
    
    const pendingRegistrations = registrations.filter(r => r.status === 'PENDING').length;
    const approvedRegistrations = registrations.filter(r => r.status === 'APPROVED').length;
    const rejectedRegistrations = registrations.filter(r => r.status === 'REJECTED').length;
    
    const farmersWithKYC = farmers.filter(f => f.kycStatus === 'APPROVED').length;
    const farmersPendingKYC = farmers.filter(f => f.kycStatus === 'PENDING').length;
    
    return {
      totalFarmers,
      totalEmployees,
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
      rejectedRegistrations,
      farmersWithKYC,
      farmersPendingKYC
    };
  }, [farmers, employees, registrations]);

  // Debug function to check authentication state
  const debugAuthState = useCallback(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔍 Debug Auth State:');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    console.log('Token length:', token?.length || 0);
    console.log('User data:', user ? JSON.parse(user) : null);
    console.log('AuthContext user:', user);
    console.log('AuthContext isAuthenticated:', user?.isAuthenticated);
    
    if (token) {
      try {
        // Try to decode JWT token (without verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload);
        console.log('JWT Expiration:', new Date(payload.exp * 1000));
        console.log('JWT Issued at:', new Date(payload.iat * 1000));
      } catch (e) {
        console.log('JWT decode failed:', e.message);
      }
    }
  }, [user]);

  // Debug function to clear all tokens
  const clearAllTokens = useCallback(() => {
    console.log('🧹 Clearing all tokens and user data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    alert('All tokens cleared! Please log in again.');
    window.location.href = '/login';
  }, []);

  // Test backend connectivity
  const testBackendConnectivity = useCallback(async () => {
    console.log('🧪 Testing Backend Connectivity...');
    
    try {
      // Test 1: Simple ping to backend
      console.log('🌐 Testing basic connectivity to http://localhost:8080...');
      const pingResponse = await fetch('http://localhost:8080', { 
        method: 'GET',
        mode: 'cors'
      });
      console.log('✅ Backend ping response:', pingResponse.status, pingResponse.statusText);
      
      // Test 2: Simple health check
      console.log('🏥 Testing health endpoint...');
      const healthResponse = await fetch('http://localhost:8080/api/health', {
        method: 'GET',
        mode: 'cors'
      });
      console.log('✅ Health check response:', healthResponse.status, healthResponse.statusText);
      
      // Test 3: Test without token
      console.log('🔍 Testing registration endpoint without token...');
      const noTokenResponse = await fetch('http://localhost:8080/api/super-admin/registration-list', {
        method: 'GET',
        mode: 'cors'
      });
      console.log('🔍 No token response:', noTokenResponse.status, noTokenResponse.statusText);
      
      // Test 4: Test with token
      const token = localStorage.getItem('token');
      if (token) {
        console.log('🔐 Testing registration endpoint with token...');
        const withTokenResponse = await fetch('http://localhost:8080/api/super-admin/registration-list', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('🔐 With token response:', withTokenResponse.status, withTokenResponse.statusText);
        
        if (withTokenResponse.ok) {
          const data = await withTokenResponse.json();
          console.log('📊 Registration data:', data);
        } else {
          const errorText = await withTokenResponse.text();
          console.log('❌ Error response:', errorText);
        }
      } else {
        console.log('⚠️ No token found in localStorage');
      }
      
    } catch (error) {
      console.error('❌ Backend connectivity test failed:', error);
      console.error('❌ Error details:', error.message);
      
      // Check if it's a CORS error
      if (error.message.includes('CORS')) {
        console.error('🚫 CORS error detected - backend might not be configured for CORS');
      }
      
      // Check if it's a network error
      if (error.message.includes('Failed to fetch')) {
        console.error('🌐 Network error - backend might not be running or accessible');
      }
    }
  }, []);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      console.log('🔄 Fetching dashboard data from backend...');
      const [farmersData, employeesData, registrationsData] = await Promise.all([
        executeApiCall(() => adminAPI.getFarmersWithKyc(), { cacheKey: 'farmers' }),
        executeApiCall(() => employeesAPI.getAllEmployees(), { cacheKey: 'employees' }),
        executeApiCall(() => superAdminAPI.getRegistrationList(), { cacheKey: 'registrations' })
      ]);

      // Debug: Log the actual farmer data structure
      if (farmersData && farmersData.length > 0) {
        console.log('🔍 Farmer data structure sample:', {
          firstFarmer: farmersData[0],
          availableFields: Object.keys(farmersData[0]),
          totalFarmers: farmersData.length
        });
      }

      setFarmers(farmersData || []);
      setEmployees(employeesData || []);
      setRegistrations(registrationsData || []);
      
      console.log('✅ Dashboard data loaded successfully:', {
        farmers: farmersData?.length || 0,
        employees: employeesData?.length || 0,
        registrations: registrationsData?.length || 0
      });
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load dashboard data. Please try again.'
      });
    }
  }, [executeApiCall]);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for KYC status updates
  useEffect(() => {
    const handleKYCUpdate = () => {
      setTimeout(() => {
        fetchData();
        setNotification({
          type: 'success',
          message: 'Data refreshed after KYC update'
        });
      }, 2000);
    };
    
    window.addEventListener('kycStatusUpdated', handleKYCUpdate);
    return () => window.removeEventListener('kycStatusUpdated', handleKYCUpdate);
  }, [fetchData]);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle filters
  const handleFilters = useCallback((filters) => {
    setActiveFilters(filters);
  }, []);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let filtered = {
      farmers: [...farmers],
      employees: [...employees],
      registrations: [...registrations]
    };

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered.farmers = filtered.farmers.filter(f => 
        f.name?.toLowerCase().includes(searchLower) ||
        f.email?.toLowerCase().includes(searchLower) ||
        f.phoneNumber?.includes(searchTerm)
      );
      filtered.employees = filtered.employees.filter(e => 
        e.name?.toLowerCase().includes(searchLower) ||
        e.email?.toLowerCase().includes(searchLower)
      );
      filtered.registrations = filtered.registrations.filter(r => 
        r.name?.toLowerCase().includes(searchLower) ||
        r.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filtered.farmers = filtered.farmers.filter(f => f[key] === value);
        filtered.employees = filtered.employees.filter(e => e[key] === value);
        filtered.registrations = filtered.registrations.filter(r => r[key] === value);
      }
    });

    return filtered;
  }, [farmers, employees, registrations, searchTerm, activeFilters]);

  // Handle actions
  const handleAssignFarmers = useCallback(async (assignmentsOrFarmerIds, maybeEmployeeId) => {
    try {
      // Support both legacy signature (farmerIds, employeeId) and new payload from AssignmentModal
      if (Array.isArray(assignmentsOrFarmerIds) && typeof assignmentsOrFarmerIds[0] === 'object') {
        // assignments array from modal; map to API payload if needed
        const farmerIds = assignmentsOrFarmerIds.map(a => a.farmerId);
        const employeeId = assignmentsOrFarmerIds[0]?.employeeId || maybeEmployeeId;
        await executeApiCall(() => superAdminAPI.bulkAssignFarmers(farmerIds, employeeId));
      } else {
        await executeApiCall(() => superAdminAPI.bulkAssignFarmers(assignmentsOrFarmerIds, maybeEmployeeId));
      }
      setNotification({
        type: 'success',
        message: 'Farmers assigned successfully'
      });
      fetchData();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to assign farmers'
      });
    }
  }, [executeApiCall, fetchData]);

  const handleDeleteItem = useCallback(async () => {
    try {
      const { item, type } = itemToDelete;
      if (type === 'farmer') {
        await executeApiCall(() => farmersAPI.deleteFarmer(item.id));
        setFarmers(prev => prev.filter(f => f.id !== item.id));
      } else if (type === 'employee') {
        await executeApiCall(() => employeesAPI.deleteEmployee(item.id));
        setEmployees(prev => prev.filter(e => e.id !== item.id));
      }
      
      setNotification({
        type: 'success',
        message: `${type} deleted successfully`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to delete item'
      });
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, executeApiCall]);

  // Table columns configuration
  const farmerColumns = useMemo(() => [
    { 
      key: 'name', 
      label: 'NAME', 
      className: 'col-name',
      render: (value, row) => {
        const name = value || row.fullName || row.userName || row.firstName || row.lastName || row.farmerName;
        if (name) return name;
        if (row.firstName || row.lastName) {
          return `${row.firstName || ''} ${row.lastName || ''}`.trim();
        }
        return 'N/A';
      }
    },
    { 
      key: 'phoneNumber', 
      label: 'PHONE', 
      className: 'col-phone',
      render: (value, row) => {
        const phone = value || row.phone || row.mobile || row.contactNumber || row.mobileNumber;
        return phone || 'N/A';
      }
    },
    { 
      key: 'state', 
      label: 'STATE', 
      className: 'col-state',
      render: (value, row) => {
        const state = value || row.stateName || row.state_name || row.farmerState;
        return state || 'N/A';
      }
    },
    { 
      key: 'district', 
      label: 'DISTRICT', 
      className: 'col-district',
      render: (value, row) => {
        const district = value || row.districtName || row.district_name || row.farmerDistrict;
        return district || 'N/A';
      }
    },
    { 
      key: 'kycStatus', 
      label: 'KYC STATUS', 
      type: 'status', 
      className: 'col-kyc-status',
      render: (value, row) => {
        const status = value || row.kyc_status || row.kycStatus || row.status;
        return status || 'N/A';
      }
    },
    { 
      key: 'assignedEmployee', 
      label: 'ASSIGNED EMPLOYEE', 
      className: 'col-assigned-employee',
      render: (value, row) => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object') {
          return value.name || value.employeeName || value.assignedEmployeeName || 'Assigned';
        }
        const employee = row.assignedEmployeeName || row.employeeName || row.assignedTo || row.assignedEmployee;
        if (employee && typeof employee === 'object') {
          return employee.name || employee.employeeName || 'Assigned';
        }
        return employee || 'Unassigned';
      }
    }
  ], []);

  const employeeColumns = useMemo(() => [
    { 
      key: 'name', 
      label: 'Name', 
      className: 'col-name',
      render: (value, row) => {
        const name = value || row.fullName || row.userName || row.firstName || row.lastName || row.employeeName;
        if (name) return name;
        
        if (row.firstName || row.lastName) {
          return `${row.firstName || ''} ${row.lastName || ''}`.trim();
        }
        
        return 'N/A';
      }
    },
    { 
      key: 'email', 
      label: 'Email', 
      className: 'col-email',
      render: (value, row) => {
        const email = value || row.emailAddress || row.userEmail || row.employeeEmail;
        return email || 'N/A';
      }
    },
    { 
      key: 'designation', 
      label: 'Designation', 
      className: 'col-role',
      render: (value, row) => {
        const designation = value || row.role || row.userRole || row.employeeRole || row.designation;
        return designation || 'N/A';
      }
    },
    { 
      key: 'assignedFarmers', 
      label: 'Assigned Farmers', 
      className: 'col-status',
      render: (value, row) => {
        if (typeof value === 'number') return value.toString();
        if (Array.isArray(value)) return value.length.toString();
        return value || '0';
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'status', 
      className: 'col-status',
      render: (value, row) => {
        const status = value || row.employeeStatus || row.status || row.userStatus;
        return status || 'N/A';
      }
    }
  ], []);

  const registrationColumns = useMemo(() => [
    { 
      key: 'name', 
      label: 'Name', 
      className: 'col-name',
      render: (value, row) => value || row.fullName || row.userName || row.firstName || 'N/A'
    },
    { 
      key: 'email', 
      label: 'Email', 
      className: 'col-email',
      render: (value, row) => value || row.emailAddress || row.userEmail || 'N/A'
    },
    { 
      key: 'role', 
      label: 'Role', 
      className: 'col-role',
      render: (value, row) => (value || row.userRole || row.type || row.userType || 'N/A')
    },
    { 
      key: 'status', 
      label: 'Status', 
      className: 'col-status',
      type: 'status',
      render: (value, row) => value || row.registrationStatus || row.approvalStatus || row.kycStatus || 'N/A'
    },
    { 
      key: 'registrationDate', 
      label: 'Registration Date', 
      className: 'col-date',
      render: (value, row) => {
        const v = value || row.createdAt || row.created_on || row.createdDate;
        if (!v) return 'N/A';
        try {
          // handle ISO with time
          const d = new Date(v);
          if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
          // already a date-like string
          return String(v).slice(0, 10);
        } catch {
          return String(v);
        }
      }
    }
  ], []);

  // Filter options
  const filterOptions = useMemo(() => [
    {
      key: 'state',
      label: 'STATE',
      type: 'select',
      options: [
        { value: 'all', label: 'All States' },
        { value: 'Telangana', label: 'Telangana' },
        { value: 'Andhrapradesh', label: 'Andhrapradesh' }
      ]
    },
    {
      key: 'district',
      label: 'DISTRICT',
      type: 'select',
      options: [
        { value: 'all', label: 'All Districts' },
        { value: 'Karimnagar', label: 'Karimnagar' },
        { value: 'rangareddy', label: 'Rangareddy' },
        { value: 'kadapa', label: 'Kadapa' },
        { value: 'Kadapa', label: 'Kadapa' },
        { value: 'kadpaa', label: 'Kadpaa' }
      ]
    },
    {
      key: 'kycStatus',
      label: 'KYC STATUS',
      type: 'select',
      options: [
        { value: 'all', label: 'All KYC Status' },
        { value: 'NOT_STARTED', label: 'Not Started' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' }
      ]
    },
    {
      key: 'assignmentStatus',
      label: 'ASSIGNMENT STATUS',
      type: 'select',
      options: [
        { value: 'all', label: 'All Assignment Status' },
        { value: 'ASSIGNED', label: 'Assigned' },
        { value: 'UNASSIGNED', label: 'Unassigned' }
      ]
    },
    {
      key: 'assignedEmployee',
      label: 'ASSIGNED EMPLOYEE',
      type: 'select',
      options: [
        { value: 'all', label: 'All Employees' },
        { value: 'dinakar lankipalli', label: 'dinakar lankipalli' },
        { value: 'harish reddy', label: 'harish reddy' },
        { value: 'karthik kumar', label: 'karthik kumar' }
      ]
    }
  ], []);

  if (loading && !farmers.length && !employees.length && !registrations.length) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      {/* Top Bar with Date and Theme */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="logo-container">
            <div className="logo-text">
              <h1 className="logo-title"> DATE </h1>
              <p className="logo-subtitle">Digital Agristack Transaction Enterprises</p>
            </div>
          </div>
          <div className="date-display">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        <div className="top-bar-right">
          <ThemeDropdown />
          <UserProfileDropdown 
            onShowChangePassword={() => setShowChangePassword(true)}
            onShowChangeUserId={() => setShowChangeUserId(true)}
          />
        </div>
      </div>
      
      {/* Main Content */}

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-text">Welcome !!!</div>
            <div className="logo-subtitle">Super Admin</div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'farmers' ? 'active' : ''}`}
            onClick={() => setActiveTab('farmers')}
          >
            👨‍🌾 Farmers
          </button>
          <button 
            className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            👥 Employees
          </button>
          <button 
            className={`nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            📝 Registrations
          </button>
          <button 
            className="nav-item"
            onClick={() => navigate('/analytical-dashboard')}
          >
            📈 Dashboard
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Show greeting only on Overview tab and when not showing farmer details */}
          {activeTab === 'overview' && !(
            showFarmerDetails ||
            showViewFarmer ||
            showViewEmployee ||
            showEmployeeDetails ||
            showFarmerForm ||
            showEmployeeForm ||
            showRegistrationDetailModal ||
            showAssignmentModal ||
            showKYCModal ||
            showDeleteModal
          ) && (
            <header className="dashboard-header">
              <div className="header-center">
                <div className="welcome-message">
                  <h2 className="greeting">
                    {getGreeting()}, {user?.name || user?.email || 'Super Admin'}! 🎋
                  </h2>
                  <p className="welcome-text">
                    Welcome to DATE Digital Agristack - Empowering your agricultural journey with data-driven insights.
                  </p>
                </div>
              </div>
            </header>
          )}
          {/* Render forms and views with priority over tab content */}
          {showFarmerForm ? (
            <div className="dashboard-form-container">
              <FarmerForm
                isInDashboard={true}
                farmer={editingFarmer}
                onClose={() => {
                  setShowFarmerForm(false);
                  setEditingFarmer(null);
                }}
                onSave={(farmer) => {
                  setNotification({
                    type: 'success',
                    message: editingFarmer ? 'Farmer updated successfully' : 'Farmer added successfully'
                  });
                  fetchData();
                  setShowFarmerForm(false);
                  setEditingFarmer(null);
                }}
              />
            </div>
          ) : showEmployeeForm ? (
            <div className="dashboard-form-container">
              <EmployeeRegistrationForm
                isInDashboard={true}
                employee={editingEmployee}
                onClose={() => {
                  setShowEmployeeForm(false);
                  setEditingEmployee(null);
                }}
                onSave={(employee) => {
                  setNotification({
                    type: 'success',
                    message: editingEmployee ? 'Employee updated successfully' : 'Employee added successfully'
                  });
                  fetchData();
                  setShowEmployeeForm(false);
                  setEditingEmployee(null);
                }}
              />
            </div>
          ) : showFarmerDetails ? (
            <div className="dashboard-form-container">
              {console.log('🔍 Rendering farmer details section, selectedFarmerData:', selectedFarmerData)}
              <ViewFarmerRegistrationDetails
                farmerData={selectedFarmerData}
                onClose={() => {
                  setShowFarmerDetails(false);
                  setSelectedFarmerData(null);
                }}
                isInDashboard={true}
                onFarmerSelect={(farmer) => setSelectedFarmerData(farmer)}
              />
            </div>
          ) : showViewFarmer ? (
            <div className="dashboard-form-container">
              <ViewFarmerRegistrationDetails
                farmerData={selectedFarmerForView || farmers}
                onClose={() => {
                  if (selectedFarmerForView) {
                    setSelectedFarmerForView(null);
                  } else {
                    setShowViewFarmer(false);
                  }
                }}
                isInDashboard={true}
                onFarmerSelect={(farmer) => setSelectedFarmerForView(farmer)}
              />
            </div>
          ) : showViewEmployee ? (
            <div className="dashboard-form-container">
              <ViewEditEmployeeDetails
                employeeData={selectedEmployeeForView || employees}
                onClose={() => {
                  if (selectedEmployeeForView) {
                    setSelectedEmployeeForView(null);
                  } else {
                    setShowViewEmployee(false);
                  }
                }}
                onUpdate={(employee) => {
                  setNotification({
                    type: 'success',
                    message: 'Employee updated successfully'
                  });
                  fetchData();
                }}
                isInDashboard={true}
                onEmployeeSelect={(employee) => setSelectedEmployeeForView(employee)}
              />
            </div>
          ) : showChangePassword ? (
            <div className="dashboard-form-container">
              <ChangePasswordModal
                isOpen={true}
                onClose={() => setShowChangePassword(false)}
                onSuccess={() => {
                  setNotification({
                    type: 'success',
                    message: 'Password changed successfully!'
                  });
                  setShowChangePassword(false);
                }}
                isInDashboard={true}
              />
            </div>
          ) : showChangeUserId ? (
            <div className="dashboard-form-container">
              <ChangeUserIdModal
                isOpen={true}
                onClose={() => setShowChangeUserId(false)}
                onSuccess={() => {
                  setNotification({
                    type: 'success',
                    message: 'User ID changed successfully!'
                  });
                  setShowChangeUserId(false);
                }}
                isInDashboard={true}
              />
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && !(
                showFarmerDetails ||
                showViewFarmer ||
                showViewEmployee ||
                showEmployeeDetails ||
                showFarmerForm ||
                showEmployeeForm ||
                showRegistrationDetailModal ||
                showAssignmentModal ||
                showKYCModal ||
                showDeleteModal
              ) && (
                <div className="overview-section">
                  <div className="overview-header">
                    <div>
                      <h2 className="overview-title">Super Admin Dashboard Overview</h2>
                      <p className="overview-description">Welcome back! Here's what's happening with your agricultural data.</p>
                    </div>
                    <div className="overview-actions">
                      <button 
                        className="action-btn refresh"
                        onClick={fetchData}
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Refresh'}
                      </button>
                      
                                             <button 
                         className="action-btn debug"
                         onClick={debugAuthState}
                         style={{ backgroundColor: '#6c757d', color: 'white' }}
                       >
                         Debug Auth
                       </button>
                       
                       <button 
                         className="action-btn test"
                         onClick={testBackendConnectivity}
                         style={{ backgroundColor: '#17a2b8', color: 'white' }}
                       >
                         Test Backend
                       </button>
                       
                       <button 
                         className="action-btn danger"
                         onClick={clearAllTokens}
                         style={{ backgroundColor: '#dc3545', color: 'white' }}
                       >
                         Clear Tokens
                       </button>
                      
                      <button className="action-btn this-month">This Month</button>
                      <button className="action-btn this-year">This Year</button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="stats-grid">
                    <div className="stats-card card-emerald">
                      <h3>Total Farmers</h3>
                      <div className="stats-number">{stats.totalFarmers}</div>
                      <div className="stats-change">+25% from last month</div>
                    </div>
                    
                    <div className="stats-card card-gold">
                      <h3>Total Employees</h3>
                      <div className="stats-number">{stats.totalEmployees}</div>
                      <div className="stats-change">+5% from last month</div>
                    </div>
                    
                    <div className="stats-card card-orange">
                      <h3>Pending Registrations</h3>
                      <div className="stats-number">{stats.pendingRegistrations}</div>
                      <div className="stats-change">No change</div>
                    </div>
                    
                    <div className="stats-card card-red">
                      <h3>KYC Pending</h3>
                      <div className="stats-number">{stats.farmersPendingKYC}</div>
                      <div className="stats-change red">All Required Cleared</div>
                    </div>
                  </div>

                  {/* Additional sections */}
                  <div className="dashboard-sections">
                    <div className="section recent-activities">
                      <div className="section-header">
                        <h3>Recent Activities</h3>
                        <button className="view-all-btn">View All</button>
                      </div>
                      <div className="activities-list">
                        <div className="activity-item">
                          <div className="activity-content">
                            <div className="activity-title">New farmer registration approved</div>
                            <div className="activity-time">2 hours ago</div>
                          </div>
                          <span className="activity-status approved">APPROVED</span>
                        </div>
                        <div className="activity-item">
                          <div className="activity-content">
                            <div className="activity-title">KYC verification completed</div>
                            <div className="activity-time">4 hours ago</div>
                          </div>
                          <span className="activity-status completed">COMPLETED</span>
                        </div>
                        <div className="activity-item">
                          <div className="activity-content">
                            <div className="activity-title">Employee assigned to new farmers</div>
                            <div className="activity-time">6 hours ago</div>
                          </div>
                          <span className="activity-status pending">PENDING</span>
                        </div>
                      </div>
                    </div>

                    <div className="section quick-actions">
                      <div className="section-header">
                        <h3>Quick Actions</h3>
                      </div>
                      <div className="quick-actions-grid">
                        <button 
                          className="quick-action-btn qa-add"
                          onClick={() => setShowFarmerForm(true)}
                        >
                          Add Farmer
                        </button>
                        <button 
                          className="quick-action-btn qa-view-farmer"
                          onClick={() => setShowViewFarmer(true)}
                        >
                          View Farmer
                        </button>
                        <button 
                          className="quick-action-btn qa-add-employee"
                          onClick={() => setShowEmployeeForm(true)}
                        >
                          Add Employee
                        </button>
                        <button 
                          className="quick-action-btn qa-view-employee"
                          onClick={() => setShowViewEmployee(true)}
                        >
                          View Employee
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  
                </div>
              )}

              {/* Search and Filters - Show for other tabs */}
              {activeTab !== 'overview' && (
                <SearchFilter
                  onSearch={handleSearch}
                  onFilter={handleFilters}
                  filters={filterOptions}
                  placeholder="Search farmers, employees, or registrations..."
                />
              )}

              {/* Farmers Tab */}
              {activeTab === 'farmers' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <div className="header-info">
                      <h2 className="section-title">Farmer Management</h2>
                      <p className="section-description">Manage farmer registrations and assignments.</p>
                    </div>
                    <div className="header-actions">
                      <button 
                        className="action-btn primary"
                        onClick={() => setShowFarmerForm(true)}
                      >
                        ➕ Add Farmer
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => setShowAssignmentModal(true)}
                      >
                        📋 Assign Farmers
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={fetchData}
                      >
                        🔄 Refresh Data
                      </button>
                    </div>
                  </div>
                  
                  <DataTable
                    data={filteredData.farmers}
                    columns={farmerColumns}
                    onEdit={(farmer) => {
                      setEditingFarmer(farmer);
                      setShowFarmerForm(true);
                    }}
                    onDelete={(farmer) => {
                      setItemToDelete({ item: farmer, type: 'farmer' });
                      setShowDeleteModal(true);
                    }}
                    onView={(farmer) => {
                      console.log('🔍 View button clicked for farmer:', farmer);
                      setSelectedFarmerData(farmer);
                      setShowFarmerDetails(true);
                    }}
                    onKycUpdate={(farmer) => {
                      setSelectedFarmerForKYC(farmer);
                      setShowKYCModal(true);
                    }}
                    showDelete={true}
                    loading={loading}
                    emptyMessage="No farmers found"
                  />
                </div>
              )}

              {/* Employees Tab */}
              {activeTab === 'employees' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>Employees Management</h2>
                    <button 
                      className="action-btn primary"
                      onClick={() => setShowEmployeeForm(true)}
                    >
                      ➕ Add Employee
                    </button>
                  </div>
                  
                  <DataTable
                    data={filteredData.employees}
                    columns={employeeColumns}
                    onEdit={(employee) => {
                      setEditingEmployee(employee);
                      setShowEmployeeForm(true);
                    }}
                    onDelete={(employee) => {
                      setItemToDelete({ item: employee, type: 'employee' });
                      setShowDeleteModal(true);
                    }}
                    onView={(employee) => {
                      setSelectedEmployeeForView(employee);
                      setShowViewEmployee(true);
                    }}
                    showDelete={true}
                    loading={loading}
                    emptyMessage="No employees found"
                  />
                </div>
              )}

              {/* Registrations Tab */}
              {activeTab === 'registrations' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h2>Registration Management</h2>
                  </div>
                  
                  <DataTable
                    data={filteredData.registrations}
                    columns={registrationColumns}
                    onView={(registration) => {
                      setSelectedRegistrationForDetail(registration);
                      setShowRegistrationDetailModal(true);
                    }}
                    loading={loading}
                    emptyMessage="No registrations found"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}

      {showAssignmentModal && (
        <AssignmentModal
          farmers={farmers}
          employees={employees}
          onClose={() => setShowAssignmentModal(false)}
          onAssign={async (assignments) => {
            await handleAssignFarmers(assignments);
            setShowAssignmentModal(false);
          }}
        />
      )}

      {showKYCModal && selectedFarmerForKYC && (
        <KYCDocumentUpload
          farmer={selectedFarmerForKYC}
          onClose={() => {
            setShowKYCModal(false);
            setSelectedFarmerForKYC(null);
          }}
          onSave={() => {
            setNotification({
              type: 'success',
              message: 'KYC documents uploaded successfully'
            });
            fetchData();
            setShowKYCModal(false);
            setSelectedFarmerForKYC(null);
          }}
        />
      )}

      {showEmployeeDetails && selectedEmployeeData && (
        <ViewEditEmployeeDetails
          employee={selectedEmployeeData}
          onClose={() => {
            setShowEmployeeDetails(false);
            setSelectedEmployeeData(null);
          }}
          onEdit={(employee) => {
            setEditingEmployee(employee);
            setShowEmployeeForm(true);
            setShowEmployeeDetails(false);
            setSelectedEmployeeData(null);
          }}
        />
      )}

      {showRegistrationDetailModal && selectedRegistrationForDetail && (
        <RegistrationDetailModal
          registration={selectedRegistrationForDetail}
          onClose={() => {
            setShowRegistrationDetailModal(false);
            setSelectedRegistrationForDetail(null);
          }}
        />
      )}

      {showDeleteModal && itemToDelete && (
        <DeleteModal
          item={itemToDelete.item}
          type={itemToDelete.type}
          onConfirm={handleDeleteItem}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
        />
      )}

      {/* Notifications */}
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard; 