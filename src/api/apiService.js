import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔐 API Request - Token from localStorage:', token ? 'Present' : 'Missing');
    console.log('🔐 API Request - URL:', config.url);
    console.log('🔐 API Request - Method:', config.method);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 API Request - Authorization header added');
    } else {
      console.log('⚠️ API Request - No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message
    });
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('🔐 Authentication failed - clearing tokens and redirecting to login');
      
      // Comprehensive token clearing
      const keysToRemove = [
        'token', 'user', 'authToken', 'jwtToken', 'accessToken', 
        'refreshToken', 'auth', 'session', 'login'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Send OTP
  sendOTP: async (email) => {
    const response = await api.post('/auth/send-otp', { emailOrPhone: email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post('/auth/verify-otp', { 
      emailOrPhone: otpData.email, 
      otp: otpData.otp 
    });
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { emailOrPhone: email });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (emailOrPhone) => {
    const response = await api.post('/auth/forgot-password', { emailOrPhone });
    return response.data;
  },

  // Forgot user ID
  forgotUserId: async (emailOrPhone) => {
    const response = await api.post('/auth/forgot-user-id', { emailOrPhone });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },

  // Reset password (for first-time password change)
  resetPasswordConfirm: async (resetData) => {
    const response = await api.post('/auth/reset-password/confirm', resetData);
    return response.data;
  },

  // Change user ID
  changeUserId: async (userIdData) => {
    const response = await api.post('/auth/change-user-id', userIdData);
    return response.data;
  },

  // Get countries
  getCountries: async () => {
    const response = await api.get('/auth/countries');
    return response.data;
  },

  // Get states
  getStates: async (countryId) => {
    const response = await api.post('/auth/states', { countryId });
    return response.data;
  }
};

// Super Admin API calls
export const superAdminAPI = {
  // Get all users (registrations)
  getAllUsers: async () => {
    const response = await api.get('/super-admin/registration-list');
    return response.data;
  },

  // Get registration list with filters
  getRegistrationList: async (filters = {}) => {
    const response = await api.get('/super-admin/registration-list', { params: filters });
    return response.data;
  },

  // Get registration list by status
  getRegistrationListByStatus: async (status) => {
    const response = await api.get('/super-admin/registration-list/filter', { params: { status } });
    return response.data;
  },

  // Search registrations
  searchRegistrations: async (query) => {
    const response = await api.get('/super-admin/registration-list/search', { params: { query } });
    return response.data;
  },

  // Get pending registrations
  getPendingRegistrations: async () => {
    const response = await api.get('/super-admin/pending-registrations');
    return response.data;
  },

  // Get approved users
  getApprovedUsers: async () => {
    const response = await api.get('/super-admin/approved-users');
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const response = await api.get(`/super-admin/users/by-role/${role}`);
    return response.data;
  },

  // Get pending users by role
  getPendingUsersByRole: async (role) => {
    const response = await api.get(`/super-admin/pending-users/by-role/${role}`);
    return response.data;
  },

  // Approve user
  approveUser: async (userId, role) => {
    const response = await api.put(`/auth/users/${userId}/approve`, { role });
    return response.data;
  },

  // Reject user (update status to REJECTED)
  rejectUser: async (userId, reason) => {
    const response = await api.put(`/auth/users/${userId}/status`, { status: 'REJECTED' });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/super-admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/super-admin/users/${userId}`, userData);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/auth/users/${userId}/status`, { status });
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/super-admin/dashboard/stats');
    return response.data;
  },

  // Bulk assign farmers to employee
  bulkAssignFarmers: async (farmerIds, employeeId) => {
    const response = await api.post('/super-admin/bulk-assign-farmers', { farmerIds, employeeId });
    return response.data;
  },

  // Single assign farmer to employee (fallback)
  assignFarmer: async (farmerId, employeeId) => {
    const response = await api.post('/super-admin/assign-farmer', null, { 
      params: { farmerId, employeeId } 
    });
    return response.data;
  }
};

// Farmers API calls
export const farmersAPI = {
  // Get all farmers
  getAllFarmers: async (filters = {}) => {
    const response = await api.get('/super-admin/farmers', { params: filters });
    return response.data;
  },

  // Get farmer by ID
  getFarmerById: async (id) => {
    const response = await api.get(`/super-admin/farmers/${id}`);
    return response.data;
  },

  // Create farmer
  createFarmer: async (farmerData) => {
    const response = await api.post('/super-admin/farmers', farmerData);
    return response.data;
  },

  // Update farmer
  updateFarmer: async (id, farmerData) => {
    const response = await api.put(`/super-admin/farmers/${id}`, farmerData);
    return response.data;
  },

  // Delete farmer
  deleteFarmer: async (id) => {
    const response = await api.delete(`/super-admin/farmers/${id}`);
    return response.data;
  },

  // Assign farmer to employee
  assignFarmer: async (farmerId, employeeId) => {
    const response = await api.post(`/super-admin/farmers/${farmerId}/assign`, { employeeId });
    return response.data;
  },

  // Get farmer statistics
  getFarmerStats: async () => {
    const response = await api.get('/super-admin/farmers/stats');
    return response.data;
  }
};

// Admin-specific API calls
export const adminAPI = {
  // Get all farmers for admin
  getAllFarmers: async (filters = {}) => {
    const response = await api.get('/admin/farmers', { params: filters });
    return response.data;
  },

  // Get all employees for admin
  getAllEmployees: async (filters = {}) => {
    const response = await api.get('/admin/employees', { params: filters });
    return response.data;
  },

  // Get farmers with KYC status
  getFarmersWithKyc: async () => {
    const response = await api.get('/admin/farmers-with-kyc');
    return response.data;
  },

  // Get employees with stats
  getEmployeesWithStats: async () => {
    const response = await api.get('/admin/employees-with-stats');
    return response.data;
  },

  // Get farmers by employee
  getFarmersByEmployee: async (employeeId) => {
    const response = await api.get(`/admin/employees/${employeeId}/assigned-farmers`);
    return response.data;
  },

  // Get todo list for admin
  getTodoList: async () => {
    const response = await api.get('/admin/todo-list');
    return response.data;
  },

  // Get enhanced todo list
  getEnhancedTodoList: async () => {
    const response = await api.get('/admin/enhanced-todo-list');
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  // Filter farmers
  filterFarmers: async (filters = {}) => {
    const response = await api.get('/admin/farmers/filter', { params: filters });
    return response.data;
  },

  // Get locations
  getLocations: async () => {
    const response = await api.get('/admin/locations');
    return response.data;
  },

  // Bulk assign farmers to employee
  bulkAssignFarmers: async (farmerIds, employeeId) => {
    const response = await api.post('/admin/bulk-assign-farmers', { farmerIds, employeeId });
    return response.data;
  },

  // Single assign farmer to employee (fallback)
  assignFarmer: async (farmerId, employeeId) => {
    const response = await api.post('/admin/assign-farmer', null, { 
      params: { farmerId, employeeId } 
    });
    return response.data;
  },

  // Get assignment history
  getAssignmentHistory: async (filters = {}) => {
    const response = await api.get('/admin/assignment-history', { params: filters });
    return response.data;
  },

  // Get farmers by assignment status
  getFarmersByAssignmentStatus: async (assignmentStatus) => {
    const response = await api.get('/admin/farmers/by-assignment-status', { 
      params: { assignmentStatus } 
    });
    return response.data;
  },

  // Get all registrations for admin
  getAllRegistrations: async (filters = {}) => {
    const response = await api.get('/admin/registration-list', { params: filters });
    return response.data;
  },

  // Get registration list by status for admin
  getRegistrationListByStatus: async (status) => {
    const response = await api.get('/admin/registration-list/filter', { params: { status } });
    return response.data;
  },

  // Approve registration for admin
  approveRegistration: async (registrationId, approvalData) => {
    const response = await api.post(`/admin/registrations/${registrationId}/approve`, approvalData);
    return response.data;
  },

  // Reject registration for admin
  rejectRegistration: async (registrationId, rejectionData) => {
    const response = await api.post(`/admin/registrations/${registrationId}/reject`, rejectionData);
    return response.data;
  }
};

// Employees API calls
export const employeesAPI = {
  // Get all employees
  getAllEmployees: async (filters = {}) => {
    const response = await api.get('/super-admin/employees', { params: filters });
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await api.get(`/super-admin/employees/${id}`);
    return response.data;
  },

  // Create employee
  createEmployee: async (employeeData) => {
    const response = await api.post('/super-admin/employees', employeeData);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/super-admin/employees/${id}`, employeeData);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const response = await api.delete(`/super-admin/employees/${id}`);
    return response.data;
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    const response = await api.get('/super-admin/employees/stats');
    return response.data;
  }
};

// Employee-specific API calls (for employee dashboard)
export const employeeAPI = {
  // Get assigned farmers for employee
  getAssignedFarmers: async () => {
    const response = await api.get('/employee/assigned-farmers');
    return response.data;
  },

  // Get farmer details by ID
  getFarmerById: async (farmerId) => {
    const response = await api.get(`/employee/farmers/${farmerId}`);
    return response.data;
  },

  // Update farmer information
  updateFarmer: async (farmerId, farmerData) => {
    const response = await api.put(`/employee/farmers/${farmerId}`, farmerData);
    return response.data;
  },

  // Get employee profile
  getProfile: async () => {
    const response = await api.get('/employee/profile');
    return response.data;
  },

  // Update employee profile
  updateProfile: async (profileData) => {
    const response = await api.put('/employee/profile', profileData);
    return response.data;
  }
};

// KYC API calls
export const kycAPI = {
  // Approve KYC
  approveKYC: async (farmerId, approvalData) => {
    const response = await api.post(`/kyc/${farmerId}/approve`, approvalData);
    return response.data;
  },

  // Reject KYC
  rejectKYC: async (farmerId, rejectionData) => {
    const response = await api.post(`/kyc/${farmerId}/reject`, rejectionData);
    return response.data;
  },

  // Refer back KYC
  referBackKYC: async (farmerId, referralData) => {
    const response = await api.post(`/kyc/${farmerId}/refer-back`, referralData);
    return response.data;
  },

  // Get KYC status
  getKYCStatus: async (farmerId) => {
    const response = await api.get(`/kyc/${farmerId}/status`);
    return response.data;
  },

  // Upload KYC documents
  uploadKYCDocuments: async (farmerId, documents) => {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add files to FormData
    Object.keys(documents).forEach(key => {
      if (documents[key]) {
        if (Array.isArray(documents[key])) {
          // Handle multiple files
          documents[key].forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        } else {
          // Handle single file
          formData.append(key, documents[key]);
        }
      }
    });

    // Use separate axios instance for file uploads (no Content-Type header)
    const uploadApi = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      timeout: 30000, // Longer timeout for file uploads
    });

    // Add auth token to upload requests
    uploadApi.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const response = await uploadApi.post(`/kyc/${farmerId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get KYC history
  getKYCHistory: async (farmerId) => {
    const response = await api.get(`/kyc/${farmerId}/history`);
    return response.data;
  },

  // Get KYC document download URL
  getKYCDocumentUrl: async (farmerId, documentType) => {
    const response = await api.get(`/kyc/${farmerId}/documents/${documentType}/download`);
    return response.data;
  },

  // Delete KYC document
  deleteKYCDocument: async (farmerId, documentType) => {
    const response = await api.delete(`/kyc/${farmerId}/documents/${documentType}`);
    return response.data;
  }
};

export default api;