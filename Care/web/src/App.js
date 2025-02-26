import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { initializeSocketConnection } from './services/onvif/camera-api';

// Import pages
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SchedulePage from './pages/SchedulePage';
import MedicationPage from './pages/MedicationPage';
import HealthTrackingPage from './pages/HealthTrackingPage';
import FamilyMembersPage from './pages/FamilyMembersPage';
import DocumentsPage from './pages/DocumentsPage';
import SettingsPage from './pages/SettingsPage';
import MedicalContactsPage from './pages/MedicalContactsPage';

function App() {
  // Initialize socket connection when the app starts
  useEffect(() => {
    try {
      // Initialize socket connection
      initializeSocketConnection();
      console.log('Socket.IO connection initialized');
    } catch (error) {
      console.error('Failed to initialize Socket.IO connection:', error);
    }
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/medications" element={<MedicationPage />} />
          <Route path="/health" element={<HealthTrackingPage />} />
          <Route path="/family" element={<FamilyMembersPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contacts" element={<MedicalContactsPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;