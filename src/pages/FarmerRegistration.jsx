import React from 'react';
import FarmerRegistrationForm from '../components/FarmerRegistrationForm';
import { authAPI } from '../api/apiService';

const FarmerRegistration = () => {
  const handleSubmit = async (data) => {
    try {
      console.log('Farmer registration submitted:', data);
      
      // Extract basic registration data from the detailed form (flat structure)
      const basicRegistrationData = {
        name: `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim(),
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth || '',
        email: data.email || `${data.contactNumber}@farmer.temp`, // Use phone number as email if not provided
        phoneNumber: data.contactNumber || '',
        role: 'FARMER',
        password: 'TempPassword123!' // Generate a temporary password
      };
      
      // Validate that we have the required basic fields
      if (!basicRegistrationData.name || !basicRegistrationData.phoneNumber) {
        alert('Please fill in all required basic information (name, phone number)');
        return;
      }
      
      // Check if we have a proper email or need to use a temporary one
      if (!data.email) {
        const useTempEmail = window.confirm('Email is required for registration. Would you like to use a temporary email based on your phone number? You can update it later.');
        if (!useTempEmail) {
          alert('Please add an email address to continue with registration.');
          return;
        }
      }
      
      console.log('Submitting basic registration data:', basicRegistrationData);
      
      // Submit basic registration to backend using authAPI.register
      const response = await authAPI.register(basicRegistrationData);
      console.log('Farmer registration successful:', response);
      
      alert('Farmer registration completed successfully! Please wait for admin approval. You will receive login credentials once approved.');
      
      // Note: The detailed profile data can be saved later when the user is approved
      // and logs in for the first time, or through a separate API endpoint
      
    } catch (error) {
      console.error('Error submitting farmer registration:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <FarmerRegistrationForm
      isInDashboard={false}
      onSubmit={handleSubmit}
    />
  );
};

export default FarmerRegistration; 