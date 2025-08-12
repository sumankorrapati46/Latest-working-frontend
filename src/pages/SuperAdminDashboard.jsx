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

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const [farmersData, employeesData, registrationsData] = await Promise.all([
        executeApiCall(() => adminAPI.getFarmersWithKyc(), { cacheKey: 'farmers' }),
        executeApiCall(() => employeesAPI.getAllEmployees(), { cacheKey: 'employees' }),
        executeApiCall(() => superAdminAPI.getRegistrationList(), { cacheKey: 'registrations' })
      ]);

      setFarmers(farmersData || []);
      setEmployees(employeesData || []);
      setRegistrations(registrationsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
  const handleAssignFarmers = useCallback(async (farmerIds, employeeId) => {
    try {
      await executeApiCall(() => superAdminAPI.bulkAssignFarmers(farmerIds, employeeId));
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
    { key: 'name', label: 'Name' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'kycStatus', label: 'KYC Status', type: 'status' },
    { key: 'assignedEmployee', label: 'Assigned To' },
    { key: 'registrationDate', label: 'Registration Date' }
  ], []);

  const employeeColumns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'designation', label: 'Designation' },
    { key: 'assignedFarmers', label: 'Assigned Farmers' },
    { key: 'status', label: 'Status', type: 'status' }
  ], []);

  const registrationColumns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'registrationDate', label: 'Registration Date' }
  ], []);

  // Filter options
  const filterOptions = useMemo(() => [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' }
      ]
    },
    {
      key: 'kycStatus',
      label: 'KYC Status',
      type: 'select',
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' }
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
          {/* Show greeting only on Overview tab */}
          {activeTab === 'overview' && (
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
              {activeTab === 'overview' && (
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
                        Refresh
                      </button>
                      <button className="action-btn today">Today</button>
                      <button className="action-btn this-month">This Month</button>
                      <button className="action-btn this-year">This Year</button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="stats-grid">
                    <div className="stats-card card-emerald">
                      <h3>Total Farmers</h3>
                      <div className="stats-number">0</div>
                      <div className="stats-change">+25% from last month</div>
                    </div>
                    
                    <div className="stats-card card-gold">
                      <h3>Total Employees</h3>
                      <div className="stats-number">0</div>
                      <div className="stats-change">+5% from last month</div>
                    </div>
                    
                    <div className="stats-card card-orange">
                      <h3>Pending Registrations</h3>
                      <div className="stats-number">0</div>
                      <div className="stats-change">No change</div>
                    </div>
                    
                    <div className="stats-card card-red">
                      <h3>KYC Pending</h3>
                      <div className="stats-number">0</div>
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
                    <h2>Farmers Management</h2>
                    <button 
                      className="action-btn primary"
                      onClick={() => setShowFarmerForm(true)}
                    >
                      ➕ Add Farmer
                    </button>
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
                      setSelectedEmployeeData(employee);
                      setShowEmployeeDetails(true);
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
          onCancel={() => {
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