import React from 'react';
import EmployeeRegistrationForm from '../components/EmployeeRegistrationForm';
import { authAPI } from '../api/apiService';

const EmployeeRegistration = () => {
  const handleSubmit = async (data) => {
    try {
      console.log('Employee registration submitted:', data);
      
      // Extract basic registration data from the detailed form (flat structure)
      const basicRegistrationData = {
        name: `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim(),
        gender: data.gender || '',
        dateOfBirth: data.dob || '',
        email: data.email || '',
        phoneNumber: data.contactNumber || '',
        role: 'EMPLOYEE',
        password: 'TempPassword123!' // Generate a temporary password
      };
      
      // Validate that we have the required basic fields
      if (!basicRegistrationData.name || !basicRegistrationData.email || !basicRegistrationData.phoneNumber) {
        alert('Please fill in all required basic information (name, email, phone number)');
        return;
      }
      
      console.log('Submitting basic registration data:', basicRegistrationData);
      
      // Submit basic registration to backend using authAPI.register
      const response = await authAPI.register(basicRegistrationData);
      console.log('Employee registration successful:', response);
      
      alert('Employee registration completed successfully! Please wait for admin approval. You will receive login credentials once approved.');
      
      // Note: The detailed profile data can be saved later when the user is approved
      // and logs in for the first time, or through a separate API endpoint
      
    } catch (error) {
      console.error('Error submitting employee registration:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <EmployeeRegistrationForm
      isInDashboard={false}
      onSubmit={handleSubmit}
    />
  );
};

export default EmployeeRegistration; 