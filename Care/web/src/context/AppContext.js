import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService, patientService } from '../services/api';

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  // State
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load family members
        const familyMembersResponse = await userService.getAll();
        const allFamilyMembers = familyMembersResponse.data;
        
        // Find current user (Ari Berkowitz in this case)
        const currentUserData = allFamilyMembers.find(member => member.isCurrentUser);
        setCurrentUser(currentUserData);
        
        // Set all family members
        setFamilyMembers(allFamilyMembers);
        
        // Load patients
        const patientsResponse = await patientService.getAll();
        const allPatients = patientsResponse.data;
        setPatients(allPatients);
        
        // Set the first patient as selected by default
        if (allPatients.length > 0) {
          setSelectedPatient(allPatients[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load application data. Please try again later.');
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Add a new family member
  const addFamilyMember = async (memberData) => {
    try {
      const response = await userService.create(memberData);
      setFamilyMembers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add family member');
      throw err;
    }
  };

  // Update a family member
  const updateFamilyMember = async (id, memberData) => {
    try {
      const response = await userService.update(id, memberData);
      setFamilyMembers(prev => 
        prev.map(member => member.id === id ? response.data : member)
      );
      return response.data;
    } catch (err) {
      setError('Failed to update family member');
      throw err;
    }
  };

  // Delete a family member
  const deleteFamilyMember = async (id) => {
    try {
      await userService.delete(id);
      setFamilyMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      setError('Failed to delete family member');
      throw err;
    }
  };

  // Add a patient
  const addPatient = async (patientData) => {
    try {
      const response = await patientService.create(patientData);
      setPatients(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add patient');
      throw err;
    }
  };

  // Update a patient
  const updatePatient = async (id, patientData) => {
    try {
      const response = await patientService.update(id, patientData);
      setPatients(prev => 
        prev.map(patient => patient.id === id ? response.data : patient)
      );
      if (selectedPatient?.id === id) {
        setSelectedPatient(response.data);
      }
      return response.data;
    } catch (err) {
      setError('Failed to update patient');
      throw err;
    }
  };

  // Convert a family member to a patient
  const convertFamilyMemberToPatient = async (familyMemberId, patientData) => {
    try {
      const response = await patientService.convertFamilyMemberToPatient(familyMemberId, patientData);
      setPatients(prev => [...prev, response.data]);
      
      // Update family member data to show they're now a patient
      setFamilyMembers(prev => 
        prev.map(member => 
          member.id === familyMemberId 
            ? { ...member, isPatient: true, patientId: response.data.id }
            : member
        )
      );
      
      return response.data;
    } catch (err) {
      setError('Failed to convert family member to patient');
      throw err;
    }
  };

  // Select a patient for viewing
  const selectPatient = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient || null);
  };
  
  // Get patients that are not already family members
  const getPatientsNotFamilyMembers = () => {
    return patients.filter(patient => 
      !familyMembers.some(member => member.patientId === patient.id)
    );
  };
  
  // Get family members caring for a specific patient
  const getPatientCaregivers = async (patientId) => {
    try {
      const connectionsResponse = await patientService.getPatientFamilyConnections(patientId);
      const connections = connectionsResponse.data;
      
      const caregivers = connections.map(connection => {
        const familyMember = familyMembers.find(m => m.id === connection.familyMemberId);
        return {
          ...familyMember,
          relationship: connection.relationship,
          accessLevel: connection.accessLevel,
          isPrimaryCareGiver: connection.isPrimaryCareGiver
        };
      });
      
      return caregivers;
    } catch (err) {
      setError('Failed to get patient caregivers');
      throw err;
    }
  };

  // Context value
  const contextValue = {
    loading,
    error,
    currentUser,
    familyMembers,
    patients,
    selectedPatient,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addPatient,
    updatePatient,
    convertFamilyMemberToPatient,
    selectPatient,
    getPatientsNotFamilyMembers,
    getPatientCaregivers
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);

export default AppContext;