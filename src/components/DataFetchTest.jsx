import React, { useState, useEffect } from 'react';
import { adminAPI, superAdminAPI } from '../api/apiService';

const DataFetchTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Admin API - Get Farmers
      console.log('🧪 Testing Admin API - Get Farmers...');
      try {
        const farmers = await adminAPI.getFarmersWithKyc();
        results.farmers = {
          success: true,
          count: farmers?.length || 0,
          data: farmers?.slice(0, 2) || [] // Show first 2 records
        };
        console.log('✅ Farmers API Success:', farmers?.length, 'records');
      } catch (error) {
        results.farmers = {
          success: false,
          error: error.message
        };
        console.log('❌ Farmers API Failed:', error.message);
      }

      // Test 2: Admin API - Get Employees
      console.log('🧪 Testing Admin API - Get Employees...');
      try {
        const employees = await adminAPI.getEmployeesWithStats();
        results.employees = {
          success: true,
          count: employees?.length || 0,
          data: employees?.slice(0, 2) || []
        };
        console.log('✅ Employees API Success:', employees?.length, 'records');
      } catch (error) {
        results.employees = {
          success: false,
          error: error.message
        };
        console.log('❌ Employees API Failed:', error.message);
      }

      // Test 3: Super Admin API - Get Registrations
      console.log('🧪 Testing Super Admin API - Get Registrations...');
      try {
        const registrations = await superAdminAPI.getRegistrationList();
        results.registrations = {
          success: true,
          count: registrations?.length || 0,
          data: registrations?.slice(0, 2) || []
        };
        console.log('✅ Registrations API Success:', registrations?.length, 'records');
      } catch (error) {
        results.registrations = {
          success: false,
          error: error.message
        };
        console.log('❌ Registrations API Failed:', error.message);
      }

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }

    setTestResults(results);
    setLoading(false);
  };

  const isUsingRealData = () => {
    return Object.values(testResults).some(result => 
      result.success && result.count > 0
    );
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>🔍 Data Fetch Test Component</h2>
      <p>This component helps verify if your app is fetching real data from the backend.</p>
      
      <button 
        onClick={runTests}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Test Results:</h3>
          
          <div style={{ 
            padding: '10px', 
            backgroundColor: isUsingRealData() ? '#d4edda' : '#f8d7da',
            border: `1px solid ${isUsingRealData() ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            <strong>Status: </strong>
            {isUsingRealData() ? '✅ Using Real Data' : '❌ Using Mock Data or API Failed'}
          </div>

          {Object.entries(testResults).map(([key, result]) => (
            <div key={key} style={{ 
              marginBottom: '10px',
              padding: '10px',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da'
            }}>
              <h4>{key.charAt(0).toUpperCase() + key.slice(1)} API:</h4>
              {result.success ? (
                <div>
                  <p>✅ Success: {result.count} records found</p>
                  {result.data.length > 0 && (
                    <details>
                      <summary>Sample Data (first 2 records)</summary>
                      <pre style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto'
                      }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <p>❌ Failed: {result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h4>How to interpret results:</h4>
        <ul>
          <li><strong>✅ Success with data:</strong> Real data is being fetched from backend</li>
          <li><strong>✅ Success with 0 records:</strong> API works but no data in database</li>
          <li><strong>❌ Failed:</strong> Backend not running or API endpoint doesn't exist</li>
        </ul>
        
        <h4>Next steps:</h4>
        <ul>
          <li>Make sure your backend server is running on port 8080</li>
          <li>Check browser console for detailed error messages</li>
          <li>Verify API endpoints in Network tab of Developer Tools</li>
        </ul>
      </div>
    </div>
  );
};

export default DataFetchTest;
