import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import ThemeDropdown from '../components/ThemeDropdown';
import FarmerForm from '../components/FarmerForm';
import KYCModal from '../components/KYCModal';
import ViewFarmerRegistrationDetails from '../components/ViewFarmerRegistrationDetails';
import ViewEditEmployeeDetails from '../components/ViewEditEmployeeDetails';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import UserProfileDropdown from '../components/UserProfileDropdown';
import { kycAPI, employeeAPI } from '../api/apiService';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [assignedFarmers, setAssignedFarmers] = useState([]);
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [selectedFarmerData, setSelectedFarmerData] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [editingFarmer, setEditingFarmer] = useState(null);

  // Greeting function based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  const [filters, setFilters] = useState({
    kycStatus: '',
    assignedDate: ''
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Load data from API
  useEffect(() => {
    fetchAssignedFarmers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const fetchAssignedFarmers = async () => {
    try {
      console.log('🔄 Fetching assigned farmers for employee...');
      console.log('👤 Current user:', user);
      
      if (!user) {
        console.error('❌ No user available');
        setAssignedFarmers([]);
        return;
      }
      
      // Fetch from API using the correct endpoint
      const response = await employeeAPI.getAssignedFarmers();
      console.log('✅ API Response:', response);
      
      if (response && Array.isArray(response)) {
        // Transform the API response to match our frontend format
        const transformedData = response.map(farmer => ({
          id: farmer.id,
          name: farmer.name,
          phone: farmer.contactNumber,
          state: farmer.state,
          district: farmer.district,
          location: `${farmer.district}, ${farmer.state}`,
          kycStatus: farmer.kycStatus || 'PENDING',
          lastAction: farmer.kycReviewedDate || farmer.kycSubmittedDate || new Date().toISOString().split('T')[0],
          notes: `KYC Status: ${farmer.kycStatus || 'PENDING'}`,
          assignedEmployee: user.name || 'Employee'
        }));
        
        setAssignedFarmers(transformedData);
        console.log('✅ Assigned farmers loaded from API:', transformedData.length);
      } else {
        console.log('⚠️ No API data available');
        setAssignedFarmers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching assigned farmers:', error);
      setAssignedFarmers([]);
    }
  };



  const getFilteredFarmers = () => {
    return assignedFarmers.filter(farmer => {
      const matchesKycStatus = !filters.kycStatus || farmer.kycStatus === filters.kycStatus;
      const matchesAssignedDate = !filters.assignedDate || farmer.assignedDate === filters.assignedDate;
      
      return matchesKycStatus && matchesAssignedDate;
    });
  };

  const getStats = () => {
    const totalAssigned = assignedFarmers.length;
    const approved = assignedFarmers.filter(f => f.kycStatus === 'APPROVED').length;
    const pending = assignedFarmers.filter(f => f.kycStatus === 'PENDING').length;
    const referBack = assignedFarmers.filter(f => f.kycStatus === 'REFER_BACK').length;
    const rejected = assignedFarmers.filter(f => f.kycStatus === 'REJECTED').length;

    return {
      totalAssigned,
      approved,
      pending,
      referBack,
      rejected
    };
  };

  const getTodoList = () => {
    const newAssignments = assignedFarmers.filter(f => {
      // New assignments not yet viewed (assigned within last 3 days)
      const assignedDate = new Date(f.assignedDate);
      const today = new Date();
      const daysDiff = (today - assignedDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 3 && f.kycStatus === 'PENDING';
    });

    const pendingReviews = assignedFarmers.filter(f => f.kycStatus === 'PENDING');
    const referBackCases = assignedFarmers.filter(f => f.kycStatus === 'REFER_BACK');

        return {
      newAssignments,
      pendingReviews,
      referBackCases
    };
  };

  const handleKYCUpdate = async (farmerId, newStatus, reason = '', documents = null) => {
    try {
      console.log(`🔄 Updating KYC status for farmer ${farmerId} to ${newStatus}`);
      
      // Prepare approval data
      const approvalData = {
        reason: reason,
        updatedBy: user?.name || 'Employee',
        updatedAt: new Date().toISOString(),
        ...(documents && { aadharNumber: documents.aadharNumber, panNumber: documents.panNumber })
      };

      console.log('📋 Approval data:', approvalData);

      // Make API call
      let response;
      switch (newStatus) {
        case 'APPROVED':
          response = await kycAPI.approveKYC(farmerId, approvalData);
          break;
        case 'REJECTED':
          response = await kycAPI.rejectKYC(farmerId, approvalData);
          break;
        case 'REFER_BACK':
          response = await kycAPI.referBackKYC(farmerId, approvalData);
          break;
        default:
          response = await kycAPI.approveKYC(farmerId, approvalData);
      }
      
      console.log('✅ KYC API response:', response);
      
      // Update local state after successful API call
      setAssignedFarmers(prev => prev.map(farmer => 
        farmer.id === farmerId 
          ? { 
          ...farmer,
          kycStatus: newStatus,
          lastAction: new Date().toISOString().split('T')[0],
              notes: reason || `Status updated to ${newStatus} by ${user?.name || 'Employee'}`,
              ...(documents && { aadharNumber: documents.aadharNumber, panNumber: documents.panNumber })
            }
          : farmer
      ));
      
      // Show success message
      alert(`KYC status updated to ${newStatus} successfully!`);
      
      // Trigger a global event to notify other dashboards
      window.dispatchEvent(new CustomEvent('kycStatusUpdated', {
        detail: { farmerId, newStatus, reason, documents }
      }));
      
    } catch (error) {
      console.error('❌ Error updating KYC status:', error);
      alert(`Failed to update KYC status: ${error.response?.data || error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleChangePassword = () => {
    // Navigate to change password page
    window.location.href = '/change-password';
  };

  const handleViewFarmer = (farmer) => {
    setSelectedFarmerData(farmer);
    setShowFarmerDetails(true);
  };

  const handleCloseFarmerDetails = () => {
    setShowFarmerDetails(false);
    setSelectedFarmerData(null);
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(false);
    setSelectedEmployeeData(null);
  };

  const handleUpdateEmployee = (updatedData) => {
    // Update employee profile
    setShowEmployeeDetails(false);
    setSelectedEmployeeData(null);
  };

  const handleEditFarmer = (farmer) => {
    setEditingFarmer(farmer);
    setShowFarmerForm(true);
  };

  const renderOverview = () => {
    const stats = getStats();
    const todoList = getTodoList();

    return (
      <div className="overview-section">
        <div className="overview-header">
          <h2 className="overview-title">Employee Dashboard Overview</h2>
          <p className="overview-description">
            Manage your assigned farmers and KYC verification tasks efficiently.
          </p>
        </div>

        {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stats-card assigned">
          <h3 className="stats-title">Total Assigned</h3>
          <div className="stats-number">{stats.totalAssigned}</div>
        </div>
        <div className="stats-card approved">
          <h3 className="stats-title">Approved</h3>
          <div className="stats-number">{stats.approved}</div>
        </div>
        <div className="stats-card pending">
          <h3 className="stats-title">Pending</h3>
          <div className="stats-number">{stats.pending}</div>
        </div>
        <div className="stats-card refer">
          <h3 className="stats-title">Refer Back</h3>
          <div className="stats-number">{stats.referBack}</div>
        </div>
      </div>

        {/* KYC Progress Chart */}
        <div className="kyc-progress-section">
          <h3>KYC Progress Summary</h3>
          <div className="kyc-progress-grid">
            <div className="progress-card approved">
              <div className="progress-circle">
                <span className="progress-number">{stats.approved}</span>
                <span className="progress-label">Approved</span>
              </div>
            </div>
            <div className="progress-card pending">
              <div className="progress-circle">
                <span className="progress-number">{stats.pending}</span>
                <span className="progress-label">Pending</span>
              </div>
            </div>
            <div className="progress-card refer-back">
              <div className="progress-circle">
                <span className="progress-number">{stats.referBack}</span>
                <span className="progress-label">Refer Back</span>
              </div>
            </div>
            <div className="progress-card rejected">
              <div className="progress-circle">
                <span className="progress-number">{stats.rejected}</span>
                <span className="progress-label">Rejected</span>
              </div>
            </div>
          </div>
      </div>

        {/* Todo List */}
        <div className="todo-section">
        <h3>To-Do List</h3>
          <div className="todo-grid">
            <div className="todo-card high-priority">
              <h4>New Assignments</h4>
              <p>{todoList.newAssignments.length} new farmers assigned</p>
              <button 
                className="action-btn-small primary"
                onClick={() => setActiveTab('farmers')}
              >
                Review New
              </button>
            </div>
            <div className="todo-card medium-priority">
              <h4>Pending Reviews</h4>
              <p>{todoList.pendingReviews.length} cases pending</p>
              <button 
                className="action-btn-small warning"
                onClick={() => setActiveTab('farmers')}
              >
                Process Pending
              </button>
            </div>
            <div className="todo-card urgent-priority">
              <h4>Refer Back Cases</h4>
              <p>{todoList.referBackCases.length} need attention</p>
              <button 
                className="action-btn-small info"
                onClick={() => setActiveTab('farmers')}
              >
                Review Refer Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssignedFarmers = () => {
    const filteredFarmers = getFilteredFarmers();

    return (
      <div className="overview-section">
        <div className="overview-header">
          <h2 className="overview-title">Assigned Farmers</h2>
          <p className="overview-description">
            View and manage your assigned farmers with KYC verification tasks.
          </p>
          <div className="overview-actions">
            <button 
              className="action-btn primary"
              onClick={() => setShowFarmerForm(true)}
            >
              Add Farmer
            </button>
      </div>
    </div>

        {/* Filters */}
      <div className="filters-section">
          <select 
            value={filters.kycStatus} 
            onChange={(e) => setFilters(prev => ({ ...prev, kycStatus: e.target.value }))}
            className="filter-select"
          >
            <option value="">All KYC Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REFER_BACK">Refer Back</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select 
            value={filters.assignedDate} 
            onChange={(e) => setFilters(prev => ({ ...prev, assignedDate: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Assignment Dates</option>
            <option value="2024-01-15">Jan 15, 2024</option>
            <option value="2024-01-18">Jan 18, 2024</option>
            <option value="2024-01-20">Jan 20, 2024</option>
            <option value="2024-01-25">Jan 25, 2024</option>
          </select>
      </div>

        {/* KYC Status Tabs */}
        <div className="kyc-tabs-section">
          <div className="kyc-tabs">
            <button 
              className={`kyc-tab ${filters.kycStatus === '' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, kycStatus: '' }))}
            >
              <span className="tab-icon">📊</span>
              <span className="tab-label">All</span>
              <span className="tab-count">{filteredFarmers.length}</span>
            </button>
            <button 
              className={`kyc-tab approved ${filters.kycStatus === 'APPROVED' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, kycStatus: 'APPROVED' }))}
            >
              <span className="tab-icon">✅</span>
              <span className="tab-label">Approved</span>
              <span className="tab-count">{filteredFarmers.filter(f => f.kycStatus === 'APPROVED').length}</span>
            </button>
              <button 
              className={`kyc-tab pending ${filters.kycStatus === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, kycStatus: 'PENDING' }))}
            >
              <span className="tab-icon">⏳</span>
              <span className="tab-label">Pending</span>
              <span className="tab-count">{filteredFarmers.filter(f => f.kycStatus === 'PENDING').length}</span>
              </button>
              <button 
              className={`kyc-tab rejected ${filters.kycStatus === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, kycStatus: 'REJECTED' }))}
              >
              <span className="tab-icon">❌</span>
              <span className="tab-label">Rejected</span>
              <span className="tab-count">{filteredFarmers.filter(f => f.kycStatus === 'REJECTED').length}</span>
              </button>
            </div>
          </div>

        {/* Farmers Table */}
        <DataTable
          data={filteredFarmers}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'location', label: 'Location' },
            { key: 'assignedDate', label: 'Assigned Date' },
            { key: 'kycStatus', label: 'KYC Status' },
            { key: 'lastAction', label: 'Last Action' }
          ]}
          customActions={[
            {
              label: 'View',
              icon: '👁️',
              className: 'info',
              onClick: handleViewFarmer
            },
            {
              label: 'Edit',
              icon: '✏️',
              className: 'primary',
              onClick: handleEditFarmer
            },
            {
              label: 'KYC',
              icon: '📋',
              className: 'warning',
              onClick: (farmer) => {
                setSelectedFarmer(farmer);
                setShowKYCModal(true);
              }
            },
            {
              label: 'Approve',
              icon: '✅',
              className: 'success',
              onClick: (farmer) => handleKYCUpdate(farmer.id, 'APPROVED'),
              showCondition: (farmer) => farmer.kycStatus === 'PENDING' || farmer.kycStatus === 'REFER_BACK'
            },
            {
              label: 'Refer Back',
              icon: '🔄',
              className: 'warning',
              onClick: (farmer) => {
                const reason = prompt('Enter reason for refer back:');
                if (reason) {
                  handleKYCUpdate(farmer.id, 'REFER_BACK', reason);
                }
              },
              showCondition: (farmer) => farmer.kycStatus === 'PENDING'
            },
            {
              label: 'Reject',
              icon: '❌',
              className: 'danger',
              onClick: (farmer) => {
                const reason = prompt('Enter reason for rejection:');
                if (reason) {
                  handleKYCUpdate(farmer.id, 'REJECTED', reason);
                }
              },
              showCondition: (farmer) => farmer.kycStatus === 'PENDING' || farmer.kycStatus === 'REFER_BACK'
            }
          ]}
        />
      </div>
    );
  };

  const renderKYCProgress = () => {
    const stats = getStats();
    const total = stats.totalAssigned;
    const approvedPercentage = total > 0 ? Math.round((stats.approved / total) * 100) : 0;
    const pendingPercentage = total > 0 ? Math.round((stats.pending / total) * 100) : 0;
    const referBackPercentage = total > 0 ? Math.round((stats.referBack / total) * 100) : 0;
    const rejectedPercentage = total > 0 ? Math.round((stats.rejected / total) * 100) : 0;

    return (
      <div className="overview-section">
        <div className="overview-header">
          <h2 className="overview-title">KYC Progress Tracking</h2>
          <p className="overview-description">
            Monitor your KYC verification progress and performance metrics.
          </p>
    </div>

        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-stats">
            <div className="progress-stat">
              <h3>Overall Progress</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill approved" 
                  style={{ width: `${approvedPercentage}%` }}
                ></div>
                <div 
                  className="progress-fill pending" 
                  style={{ width: `${pendingPercentage}%` }}
                ></div>
                <div 
                  className="progress-fill refer-back" 
                  style={{ width: `${referBackPercentage}%` }}
                ></div>
                <div 
                  className="progress-fill rejected" 
                  style={{ width: `${rejectedPercentage}%` }}
            ></div>
              </div>
              <div className="progress-labels">
                <span>Approved: {approvedPercentage}%</span>
                <span>Pending: {pendingPercentage}%</span>
                <span>Refer Back: {referBackPercentage}%</span>
                <span>Rejected: {rejectedPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="detailed-stats">
          <div className="stat-card approved">
            <h4>Approved Cases</h4>
            <div className="stat-content">
              <span className="stat-number">{stats.approved}</span>
              <span className="stat-percentage">{approvedPercentage}%</span>
            </div>
          </div>
          <div className="stat-card pending">
            <h4>Pending Cases</h4>
            <div className="stat-content">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-percentage">{pendingPercentage}%</span>
            </div>
          </div>
          <div className="stat-card refer-back">
            <h4>Refer Back Cases</h4>
            <div className="stat-content">
              <span className="stat-number">{stats.referBack}</span>
              <span className="stat-percentage">{referBackPercentage}%</span>
        </div>
          </div>
          <div className="stat-card rejected">
            <h4>Rejected Cases</h4>
            <div className="stat-content">
              <span className="stat-number">{stats.rejected}</span>
              <span className="stat-percentage">{rejectedPercentage}%</span>
        </div>
        </div>
      </div>
    </div>
  );
  };

  const renderTodoList = () => {
    const todoList = getTodoList();
    
    return (
      <div className="overview-section">
        <div className="overview-header">
          <h2 className="overview-title">To-Do List</h2>
          <p className="overview-description">
            Manage your daily tasks and priorities for KYC verification.
          </p>
        </div>

        {/* Todo Grid */}
        <div className="todo-grid">
          <div className="todo-card high-priority">
            <div className="priority-badge high">High Priority</div>
            <h4>New KYC Reviews</h4>
            <p>{todoList.newAssignments.length} new farmers need KYC verification</p>
            <button 
              className="action-btn-small primary"
              onClick={() => setActiveTab('farmers')}
            >
              Review Now
            </button>
          </div>
          
          <div className="todo-card medium-priority">
            <div className="priority-badge medium">Medium Priority</div>
            <h4>Pending Reviews</h4>
            <p>{todoList.pendingReviews.length} cases awaiting your review</p>
            <button 
              className="action-btn-small warning"
              onClick={() => setActiveTab('farmers')}
            >
              Process Pending
            </button>
          </div>
          
          <div className="todo-card urgent-priority">
            <div className="priority-badge urgent">Urgent</div>
            <h4>Refer Back Cases</h4>
            <p>{todoList.referBackCases.length} cases need immediate attention</p>
            <button 
              className="action-btn-small danger"
              onClick={() => setActiveTab('farmers')}
            >
              Review Urgent
            </button>
          </div>
        </div>

        {/* Task Summary */}
        <div className="task-summary">
          <h3>Task Summary</h3>
          <div className="task-stats">
            <div className="task-stat assignments">
              <span className="task-number">{todoList.newAssignments.length}</span>
              <span className="task-label">New Assignments</span>
            </div>
            <div className="task-stat pending">
              <span className="task-number">{todoList.pendingReviews.length}</span>
              <span className="task-label">Pending Reviews</span>
            </div>
            <div className="task-stat referback">
              <span className="task-number">{todoList.referBackCases.length}</span>
              <span className="task-label">Refer Back</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKYCSummary = () => {
    const stats = getStats();
    
    return (
      <div className="overview-section">
        <div className="overview-header">
          <h2 className="overview-title">KYC Summary</h2>
          <p className="overview-description">
            Comprehensive overview of your KYC verification activities and performance.
          </p>
        </div>

        {/* KYC Stats Grid */}
        <div className="kyc-stats-grid">
          <div className="kyc-stat-card approved">
            <div className="kyc-stat-icon">✅</div>
            <div className="kyc-stat-content">
              <span className="kyc-stat-number">{stats.approved}</span>
              <span className="kyc-stat-label">Approved</span>
            </div>
          </div>
          
          <div className="kyc-stat-card pending">
            <div className="kyc-stat-icon">⏳</div>
            <div className="kyc-stat-content">
              <span className="kyc-stat-number">{stats.pending}</span>
              <span className="kyc-stat-label">Pending</span>
            </div>
          </div>
          
          <div className="kyc-stat-card refer-back">
            <div className="kyc-stat-icon">📝</div>
            <div className="kyc-stat-content">
              <span className="kyc-stat-number">{stats.referBack}</span>
              <span className="kyc-stat-label">Refer Back</span>
            </div>
          </div>
          
          <div className="kyc-stat-card rejected">
            <div className="kyc-stat-icon">❌</div>
            <div className="kyc-stat-content">
              <span className="kyc-stat-number">{stats.rejected}</span>
              <span className="kyc-stat-label">Rejected</span>
            </div>
          </div>
        </div>

        {/* KYC Performance Metrics */}
        <div className="kyc-performance">
          <h3>Performance Metrics</h3>
          <div className="performance-metrics">
            <div className="metric-card rate">
              <h4>Approval Rate</h4>
              <span className="metric-value">
                {stats.totalAssigned > 0 ? Math.round((stats.approved / stats.totalAssigned) * 100) : 0}%
              </span>
            </div>
            <div className="metric-card time">
              <h4>Processing Time</h4>
              <span className="metric-value">2.3 days</span>
            </div>
            <div className="metric-card success">
              <h4>Success Rate</h4>
              <span className="metric-value">
                {stats.totalAssigned > 0 ? Math.round(((stats.approved + stats.pending) / stats.totalAssigned) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Top Bar matching Super Admin layout */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="logo-container">
            <div className="logo-text">
              <h1 className="logo-title">DATE</h1>
              <p className="logo-subtitle">Digital Agristack Transaction Enterprises</p>
            </div>
          </div>
          <div className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div className="top-bar-right">
          <ThemeDropdown />
          <UserProfileDropdown />
        </div>
      </div>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-text">Welcome !!!</div>
            <div className="logo-subtitle">Employee</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button className={`nav-item ${activeTab === 'farmers' ? 'active' : ''}`} onClick={() => setActiveTab('farmers')}>👨‍🌾 Assigned Farmers</button>
          <button className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>📈 KYC Progress</button>
          <button className={`nav-item ${activeTab === 'todo' ? 'active' : ''}`} onClick={() => setActiveTab('todo')}>📋 To-Do List</button>
          <button className={`nav-item ${activeTab === 'kyc-summary' ? 'active' : ''}`} onClick={() => setActiveTab('kyc-summary')}>📝 KYC Summary</button>
        </nav>
      </aside>



      {/* Main Content using shared frame */}
      <div className="dashboard-main">
        <div className="dashboard-content">
          {activeTab === 'overview' && (
          <header className="dashboard-header">
            <div className="header-center">
              <div className="welcome-message">
                <h2 className="greeting">{getGreeting()}, {user?.name || user?.email || 'Employee'}! 🎋</h2>
                <p className="welcome-text">Manage your assigned farmers and KYC verification tasks efficiently.</p>
              </div>
            </div>
          </header>
          )}

          {/* Render forms with priority over tab content */}
          {showFarmerForm ? (
            <div className="dashboard-form-container">
              <FarmerForm 
                isInDashboard={true}
                editData={editingFarmer}
                onClose={() => {
                  setShowFarmerForm(false);
                  setEditingFarmer(null);
                }}
                onSubmit={async (farmerData) => {
                  try {
                    // API call to create/update farmer
                    setAssignedFarmers(prev => [...prev, { ...farmerData, id: Date.now() }]);
                    setShowFarmerForm(false);
                    setEditingFarmer(null);
                    alert('Farmer saved successfully!');
                  } catch (error) {
                    console.error('Error saving farmer:', error);
                    alert('Failed to save farmer. Please try again.');
                  }
                }}
              />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'farmers' && renderAssignedFarmers()}
              {activeTab === 'progress' && renderKYCProgress()}
              {activeTab === 'todo' && renderTodoList()}
              {activeTab === 'kyc-summary' && renderKYCSummary()}
            </>
          )}
        </div>
      </div>

      {/* Modals */}

      {showKYCModal && selectedFarmer && (
        <KYCModal
          farmer={selectedFarmer}
          onClose={() => {
            setShowKYCModal(false);
            setSelectedFarmer(null);
          }}
          onApprove={(farmerId, documents) => handleKYCUpdate(farmerId, 'APPROVED', '', documents)}
          onReject={(farmerId, reason) => handleKYCUpdate(farmerId, 'REJECTED', reason)}
          onReferBack={(farmerId, reason) => handleKYCUpdate(farmerId, 'REFER_BACK', reason)}
        />
      )}

      {showFarmerDetails && selectedFarmerData && (
        <ViewFarmerRegistrationDetails
          farmerData={selectedFarmerData}
          onClose={handleCloseFarmerDetails}
        />
      )}

      {showEmployeeDetails && selectedEmployeeData && (
        <ViewEditEmployeeDetails
          employee={selectedEmployeeData}
          onClose={handleCloseEmployeeDetails}
          onUpdate={handleUpdateEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard; 