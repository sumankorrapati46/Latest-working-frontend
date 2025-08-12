import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationToast from '../components/NotificationToast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../styles/Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticalDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Mock data structure - replace with actual API calls
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API response
      const mockData = {
        generalCounts: {
          totalBeneficiaries: 15420,
          totalEnrollments: 12850,
          enrollmentPercentage: 83.4,
          approvedIds: 11230,
          pendingApprovals: 1620,
          yesterdayEnrollments: 45
        },
        districtPerformance: {
          top5: [
            { name: 'Mumbai', rate: 94.2, count: 1250 },
            { name: 'Delhi', rate: 91.8, count: 980 },
            { name: 'Bangalore', rate: 89.5, count: 1120 },
            { name: 'Chennai', rate: 87.3, count: 890 },
            { name: 'Hyderabad', rate: 85.1, count: 760 }
          ],
          bottom5: [
            { name: 'Patna', rate: 45.2, count: 320 },
            { name: 'Lucknow', rate: 52.8, count: 450 },
            { name: 'Kolkata', rate: 58.1, count: 680 },
            { name: 'Ahmedabad', rate: 62.4, count: 540 },
            { name: 'Pune', rate: 65.7, count: 720 }
          ]
        },
        enrollmentModes: {
          online: 65.2,
          offline: 23.8,
          mobile: 11.0
        }
      };
      
      setDashboardData(mockData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchDashboardData();
    
    intervalRef.current = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchDashboardData();
    setNotification('Dashboard data refreshed successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Professional login redirect handler
  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        from: '/analytical-dashboard',
        message: 'Please log in to access additional dashboard features.' 
      } 
    });
  };

  // Chart data for Top 5 Districts
  const top5ChartData = {
    labels: dashboardData?.districtPerformance?.top5?.map(d => d.name) || [],
    datasets: [
      {
        label: 'Approval Rate (%)',
        data: dashboardData?.districtPerformance?.top5?.map(d => d.rate) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 3,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        hoverBorderColor: 'rgba(34, 197, 94, 1)',
      },
      {
        label: 'Enrollment Count',
        data: dashboardData?.districtPerformance?.top5?.map(d => d.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        hoverBorderColor: 'rgba(59, 130, 246, 1)',
      }
    ]
  };

  // Chart data for Bottom 5 Districts
  const bottom5ChartData = {
    labels: dashboardData?.districtPerformance?.bottom5?.map(d => d.name) || [],
    datasets: [
      {
        label: 'Approval Rate (%)',
        data: dashboardData?.districtPerformance?.bottom5?.map(d => d.rate) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 3,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(239, 68, 68, 1)',
        hoverBorderColor: 'rgba(239, 68, 68, 1)',
      },
      {
        label: 'Enrollment Count',
        data: dashboardData?.districtPerformance?.bottom5?.map(d => d.count) || [],
        backgroundColor: 'rgba(245, 158, 11, 0.9)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 3,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(245, 158, 11, 1)',
        hoverBorderColor: 'rgba(245, 158, 11, 1)',
      }
    ]
  };

  // Chart data for Enrollment Modes
  const enrollmentModesData = {
    labels: ['Online', 'Offline', 'Mobile'],
    datasets: [
      {
        data: [
          dashboardData?.enrollmentModes?.online || 0,
          dashboardData?.enrollmentModes?.offline || 0,
          dashboardData?.enrollmentModes?.mobile || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(245, 158, 11, 0.9)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 4,
        hoverOffset: 8,
        hoverBorderWidth: 6,
      }
    ]
  };

  // Enhanced Chart options with premium styling
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text-primary, #1e293b)',
          font: {
            size: 13,
            weight: '700',
            family: 'Inter, sans-serif'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: 'var(--text-primary, #1e293b)',
        bodyColor: 'var(--text-secondary, #475569)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: '700'
        },
        bodyFont: {
          size: 13,
          weight: '600'
        },
        padding: 16,
        boxPadding: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          color: 'var(--text-secondary, #64748b)',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 8,
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--text-secondary, #64748b)',
          font: {
            size: 12,
            weight: '600'
          },
          padding: 8,
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 8,
        hoverBorderWidth: 3,
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-primary, #1e293b)',
          font: {
            size: 13,
            weight: '700',
            family: 'Inter, sans-serif'
          },
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: 'var(--text-primary, #1e293b)',
        bodyColor: 'var(--text-secondary, #475569)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        },
        titleFont: {
          size: 14,
          weight: '700'
        },
        bodyFont: {
          size: 13,
          weight: '600'
        },
        padding: 16,
        boxPadding: 8,
      }
    },
    cutout: '65%',
    radius: '90%'
  };

  if (loading && !dashboardData) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-loading-container">
          <LoadingSpinner size="large" text="Loading analytical dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard">
        <div className="analytics-error-container">
          <div className="error-content">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={fetchDashboardData}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Professional Authentication Banner */}
      {!isAuthenticated && !authLoading && (
        <div className="auth-banner">
          <div className="auth-banner-content">
            <div className="auth-banner-left">
              <span className="auth-icon">🔐</span>
              <div className="auth-text">
                <h3>Welcome to PM Kisan Analytics</h3>
                <p>You're viewing public dashboard data. Log in to access additional features and personalized insights.</p>
              </div>
            </div>
            <div className="auth-banner-right">
              <button 
                className="auth-login-btn"
                onClick={handleLoginRedirect}
              >
                <span className="login-icon">👤</span>
                <span>Log In</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Header Section */}
      <div className="analytics-hero">
        <div className="hero-background">
          <div className="hero-gradient-overlay"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-icon">📊</span>
              <span className="badge-text">Live Analytics</span>
            </div>
            <h1 className="hero-title">Analytical Dashboard</h1>
            <p className="hero-subtitle">
              Real-time insights and performance metrics for PM Kisan Beneficiaries
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">{dashboardData?.generalCounts?.totalBeneficiaries?.toLocaleString() || 0}</span>
                <span className="stat-label">Total Beneficiaries</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{dashboardData?.generalCounts?.enrollmentPercentage || 0}%</span>
                <span className="stat-label">Enrollment Rate</span>
              </div>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-actions">
              <button 
                className="hero-refresh-btn"
                onClick={handleManualRefresh}
                title="Refresh data"
              >
                <span className="refresh-icon">🔄</span>
                <span className="refresh-text">Refresh</span>
              </button>
              {lastUpdated && (
                <div className="hero-last-updated">
                  <span className="update-label">Last updated</span>
                  <span className="update-time">
                    {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-main">
        <div className="analytics-content">
          {/* General Counts Section */}
          <div className="analytics-section premium">
            <div className="section-header premium">
              <div className="header-content">
                <div className="header-left">
                  <h2 className="section-title">General Counts</h2>
                  <p className="section-subtitle">Key metrics and performance indicators</p>
                </div>
                <div className="header-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
              </div>
            </div>
            
            <div className="counts-grid premium">
              <div className="count-card premium primary">
                <div className="card-glow"></div>
                <div className="count-icon-wrapper">
                  <div className="count-icon">👥</div>
                  <div className="icon-glow"></div>
                </div>
                <div className="count-content">
                  <h3>Total Beneficiaries</h3>
                  <div className="count-number">
                    {dashboardData?.generalCounts?.totalBeneficiaries?.toLocaleString() || 0}
                  </div>
                  <p className="count-label">PM Kisan Beneficiaries</p>
                </div>
                <div className="card-pattern"></div>
              </div>

              <div className="count-card premium success">
                <div className="card-glow"></div>
                <div className="count-icon-wrapper">
                  <div className="count-icon">✅</div>
                  <div className="icon-glow"></div>
                </div>
                <div className="count-content">
                  <h3>Total Enrollments</h3>
                  <div className="count-number">
                    {dashboardData?.generalCounts?.totalEnrollments?.toLocaleString() || 0}
                  </div>
                  <p className="count-label">
                    {dashboardData?.generalCounts?.enrollmentPercentage || 0}% of total
                  </p>
                </div>
                <div className="card-pattern"></div>
              </div>

              <div className="count-card premium info">
                <div className="card-glow"></div>
                <div className="count-icon-wrapper">
                  <div className="count-icon">📊</div>
                  <div className="icon-glow"></div>
                </div>
                <div className="count-content">
                  <h3>Enrollment Rate</h3>
                  <div className="count-number">
                    {dashboardData?.generalCounts?.enrollmentPercentage || 0}%
                  </div>
                  <p className="count-label">Overall success rate</p>
                </div>
                <div className="card-pattern"></div>
              </div>

              <div className="count-card premium warning">
                <div className="card-glow"></div>
                <div className="count-icon-wrapper">
                  <div className="count-icon">⏳</div>
                  <div className="icon-glow"></div>
                </div>
                <div className="count-content">
                  <h3>Pending Approvals</h3>
                  <div className="count-number">
                    {dashboardData?.generalCounts?.pendingApprovals?.toLocaleString() || 0}
                  </div>
                  <p className="count-label">Awaiting verification</p>
                </div>
                <div className="card-pattern"></div>
              </div>

              <div className="count-card premium secondary">
                <div className="card-glow"></div>
                <div className="count-icon-wrapper">
                  <div className="count-icon">🎯</div>
                  <div className="icon-glow"></div>
                </div>
                <div className="count-content">
                  <h3>Approved IDs</h3>
                  <div className="count-number">
                    {dashboardData?.generalCounts?.approvedIds?.toLocaleString() || 0}
                  </div>
                  <p className="count-label">Successfully verified</p>
                </div>
                <div className="card-pattern"></div>
              </div>

              <div className="count-card premium accent">
                <div className="card-glow"></div>
                <div className="count-icon-wrapper">
                  <div className="count-icon">📈</div>
                  <div className="icon-glow"></div>
                </div>
                <div className="count-content">
                  <h3>Yesterday's Enrollments</h3>
                  <div className="count-number">
                    {dashboardData?.generalCounts?.yesterdayEnrollments || 0}
                  </div>
                  <p className="count-label">Daily progress</p>
                </div>
                <div className="card-pattern"></div>
              </div>
            </div>
          </div>

          {/* Data Visualization Section */}
          <div className="analytics-section premium">
            <div className="section-header premium">
              <div className="header-content">
                <div className="header-left">
                  <h2 className="section-title">Data Visualization</h2>
                  <p className="section-subtitle">Performance analysis and enrollment distribution</p>
                </div>
                <div className="header-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                </div>
              </div>
            </div>
            
            <div className="charts-grid premium">
              {/* Top 5 Districts Chart */}
              <div className="chart-card premium">
                <div className="chart-glow"></div>
                <div className="chart-header premium">
                  <h3>Top 5 Districts - Performance</h3>
                  <p>Highest approval rates and enrollment counts</p>
                </div>
                <div className="chart-container premium">
                  <Bar data={top5ChartData} options={barChartOptions} />
                </div>
                <div className="card-pattern"></div>
              </div>

              {/* Bottom 5 Districts Chart */}
              <div className="chart-card premium">
                <div className="chart-glow"></div>
                <div className="chart-header premium">
                  <h3>Bottom 5 Districts - Performance</h3>
                  <p>Areas needing improvement and support</p>
                </div>
                <div className="chart-container premium">
                  <Bar data={bottom5ChartData} options={barChartOptions} />
                </div>
                <div className="card-pattern"></div>
              </div>

              {/* Enrollment Modes Chart */}
              <div className="chart-card premium">
                <div className="chart-glow"></div>
                <div className="chart-header premium">
                  <h3>Enrollment Mode Distribution</h3>
                  <p>How beneficiaries are registering in the system</p>
                </div>
                <div className="chart-container premium">
                  <Doughnut data={enrollmentModesData} options={doughnutChartOptions} />
                </div>
                <div className="card-pattern"></div>
              </div>
            </div>
          </div>

          {/* Auto-refresh Info */}
          <div className="auto-refresh-info premium">
            <div className="info-content">
              <span className="info-icon">ℹ️</span>
              <span className="info-text">
                Data automatically refreshes every 5 minutes. Last refresh: {lastUpdated?.toLocaleTimeString() || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <NotificationToast
          message={notification}
          type="success"
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default AnalyticalDashboard;
