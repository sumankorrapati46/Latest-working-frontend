import React, { useState, useEffect } from 'react';
import '../styles/Forms.css';

const AssignmentModal = ({ farmers, employees, onClose, onAssign }) => {
  const [selectedFarmers, setSelectedFarmers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);

  // Debug logging on mount
  useEffect(() => {
    console.log('=== ASSIGNMENT MODAL MOUNTED ===');
    console.log('Employees on mount:', employees);
    console.log('Employees count on mount:', employees?.length || 0);
    if (employees && employees.length > 0) {
      console.log('First employee on mount:', employees[0]);
    }
  }, []);

  // Debug logging on every render
  console.log('=== ASSIGNMENT MODAL DEBUG ===');
  console.log('Employees received:', employees);
  console.log('Employees count:', employees?.length || 0);
  console.log('Employees type:', typeof employees);
  console.log('Employees is array:', Array.isArray(employees));
  if (employees && employees.length > 0) {
    console.log('First employee:', employees[0]);
    console.log('First employee name:', employees[0]?.name);
    console.log('First employee designation:', employees[0]?.designation);
    console.log('All employee names:', employees.map(emp => emp?.name));
  }

  const handleFarmerToggle = (farmerId) => {
    setSelectedFarmers(prev => 
      prev.includes(farmerId)
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFarmers.length === farmers.length) {
      setSelectedFarmers([]);
    } else {
      setSelectedFarmers(farmers.map(f => f.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedEmployee || selectedFarmers.length === 0) {
      alert('Please select an employee and at least one farmer');
      return;
    }

    setLoading(true);

    try {
      const selectedEmployeeData = employees.find(emp => emp.id === parseInt(selectedEmployee));
      const assignments = selectedFarmers.map(farmerId => {
        const farmer = farmers.find(f => f.id === farmerId);
        return {
          farmerId,
          employeeId: parseInt(selectedEmployee),
          employeeName: selectedEmployeeData.name,
          farmerName: farmer.name
        };
      });

      await onAssign(assignments);
    } catch (error) {
      console.error('Error assigning farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-modal-overlay">
      <div className="assignment-modal-content large">
        <div className="assignment-modal-header">
          <h2>Assign Farmers to Employee</h2>
          <button className="assignment-modal-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="assignment-modal-form">
          <div className="assignment-modal-section">
            <div className="assignment-modal-section-header">
              <h3>Select Employee</h3>
            </div>
            <div className="assignment-modal-form-group">
              <label htmlFor="employee">Employee *</label>
              <select
                id="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {(() => {
                  console.log('=== RENDERING EMPLOYEE OPTIONS ===');
                  console.log('Employees for rendering:', employees);
                  console.log('Employees length for rendering:', employees?.length || 0);
                  
                  if (employees && employees.length > 0) {
                    console.log('Rendering employee options:', employees.map(emp => ({
                      id: emp.id,
                      name: emp.name,
                      designation: emp.designation,
                      displayText: `${emp.name || 'Unknown'} - ${emp.designation || 'Employee'}`
                    })));
                  }
                  
                  return employees && employees.length > 0 ? employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || 'Unknown'} - {emp.designation || 'Employee'}
                    </option>
                  )) : (
                    <option value="" disabled>No employees available</option>
                  );
                })()}
              </select>
            </div>
          </div>

          <div className="assignment-modal-section">
            <div className="assignment-modal-section-header">
              <h3>Select Farmers</h3>
              <button 
                type="button" 
                className="assignment-modal-btn-link"
                onClick={handleSelectAll}
              >
                {selectedFarmers.length === farmers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="assignment-modal-farmers-list">
              {farmers.length === 0 ? (
                <p className="assignment-modal-no-data">No unassigned farmers available</p>
              ) : (
                farmers.map(farmer => (
                  <div key={farmer.id} className="assignment-modal-farmer-item">
                    <label className="assignment-modal-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFarmers.includes(farmer.id)}
                        onChange={() => handleFarmerToggle(farmer.id)}
                      />
                      <span className="assignment-modal-checkmark"></span>
                      <div className="assignment-modal-farmer-info">
                        <strong>{farmer.name}</strong>
                        <span>{farmer.phone}</span>
                        <span>{farmer.state}, {farmer.district}</span>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="assignment-modal-summary">
            <div className="assignment-modal-summary-item">
              <span>Selected Farmers:</span>
              <strong>{selectedFarmers.length}</strong>
            </div>
            <div className="assignment-modal-summary-item">
              <span>Selected Employee:</span>
              <strong>
                {selectedEmployee ? employees.find(emp => emp.id === parseInt(selectedEmployee))?.name : 'None'}
              </strong>
            </div>
          </div>

          <div className="assignment-modal-form-actions">
            <button 
              type="button" 
              className="assignment-modal-btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="assignment-modal-btn-primary"
              disabled={loading || selectedFarmers.length === 0 || !selectedEmployee}
            >
              {loading ? 'Assigning...' : `Assign ${selectedFarmers.length} Farmer${selectedFarmers.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal; 