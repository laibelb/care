import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// Material UI imports
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  TextField,
  IconButton,
  Paper,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';

// Icons
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WarningIcon from '@mui/icons-material/Warning';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function PatientsPage() {
  // State variables
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openAddPatientDialog, setOpenAddPatientDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openAccessManagementDialog, setOpenAccessManagementDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Patient form state
  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    medicalConditions: '',
    allergies: '',
    notes: ''
  });
  
  // Mock patients data
  const [patients, setPatients] = useState([
    { 
      id: '1', 
      name: 'Rabbi Berkowitz',
      preferredName: 'Rabbi B', 
      dob: '1948-11-09', 
      age: 76,
      medicalConditions: ['Kidney Disease', 'Hypertension', 'Type 2 Diabetes', 'Heart Condition'],
      allergies: ['Penicillin', 'Sulfa Drugs'],
      notes: 'Prefers kosher meals. Enjoys reading religious texts and teaching. Needs assistance with mobility.',
      primaryPhoto: '/images/rabbiB.png',
      access: [
        {
          userId: '1',
          userName: 'Ari Berkowitz',
          userPhoto: 'https://randomuser.me/api/portraits/men/64.jpg',
          accessLevel: 'admin',
          relationshipToPatient: 'Son',
          dateGranted: '2023-01-15T00:00:00Z',
          status: 'active'
        },
        {
          userId: '2',
          userName: 'Sarah Berkowitz',
          userPhoto: 'https://randomuser.me/api/portraits/women/32.jpg',
          accessLevel: 'caregiver',
          relationshipToPatient: 'Daughter',
          dateGranted: '2023-01-20T00:00:00Z',
          status: 'active'
        }
      ],
      profile: {
        medicalID: 'P-2023-1121',
        primaryPhysician: 'Dr. Sarah Goldstein (Nephrologist)',
        primaryPhysicianPhone: '555-222-3333',
        address: '123 Main St, New York, NY 10001',
        emergencyContacts: [
          { name: 'Leah Berkowitz', relation: 'Wife', phone: '555-111-2222' },
          { name: 'Mayor Berkowitz', relation: 'Son', phone: '555-333-4444' }
        ],
        preferredHospital: 'Mount Sinai Medical Center',
        dialysisSchedule: 'Monday, Wednesday, Friday - 9:00 AM',
        dialysisCenter: 'Midtown Dialysis Center • 555-888-9999',
        bloodType: 'A+'
      },
      nextAppointment: '2025-03-10 - Nephrology Follow-up',
      recentEvent: 'Blood pressure elevated (142/88) - Feb 24'
    },
    { 
      id: '2', 
      name: 'Leah Berkowitz',
      preferredName: 'Leah', 
      dob: '1952-03-15', 
      age: 72,
      medicalConditions: ['Arthritis', 'High Cholesterol'],
      allergies: ['Shellfish', 'Ibuprofen'],
      notes: 'Loves knitting and cooking. Prefers phone calls over text messages.',
      primaryPhoto: 'https://randomuser.me/api/portraits/women/68.jpg',
      access: [
        {
          userId: '1',
          userName: 'Ari Berkowitz',
          userPhoto: 'https://randomuser.me/api/portraits/men/64.jpg',
          accessLevel: 'admin',
          relationshipToPatient: 'Son',
          dateGranted: '2023-01-15T00:00:00Z',
          status: 'active'
        }
      ],
      profile: {
        medicalID: 'P-2023-1122',
        primaryPhysician: 'Dr. Michael Chen (Internal Medicine)',
        primaryPhysicianPhone: '555-444-5555',
        address: '123 Main St, New York, NY 10001',
        emergencyContacts: [
          { name: 'Rabbi Berkowitz', relation: 'Husband', phone: '555-222-3333' },
          { name: 'Sarah Berkowitz', relation: 'Daughter', phone: '555-444-5555' }
        ],
        preferredHospital: 'Mount Sinai Medical Center',
        bloodType: 'B-'
      },
      nextAppointment: '2025-03-05 - Rheumatology Check-up',
      recentEvent: 'New medication prescribed (Methotrexate) - Feb 20'
    },
    { 
      id: '3', 
      name: 'Samuel Goldman',
      preferredName: 'Sam', 
      dob: '1945-06-22', 
      age: 79,
      medicalConditions: ['Parkinson\'s Disease', 'Glaucoma'],
      allergies: ['Peanuts', 'Latex'],
      notes: 'Former accountant. Enjoys chess and classical music. Needs assistance with fine motor skills.',
      primaryPhoto: 'https://randomuser.me/api/portraits/men/79.jpg',
      access: [
        {
          userId: '1',
          userName: 'Ari Berkowitz',
          userPhoto: 'https://randomuser.me/api/portraits/men/64.jpg',
          accessLevel: 'caregiver',
          relationshipToPatient: 'Nephew',
          dateGranted: '2023-05-20T00:00:00Z',
          status: 'active'
        }
      ],
      profile: {
        medicalID: 'P-2023-1123',
        primaryPhysician: 'Dr. James Wilson (Neurologist)',
        primaryPhysicianPhone: '555-666-7777',
        address: '456 Oak Ave, New York, NY 10002',
        emergencyContacts: [
          { name: 'Rebecca Goldman', relation: 'Daughter', phone: '555-666-7777' },
          { name: 'David Goldman', relation: 'Son', phone: '555-777-8888' }
        ],
        preferredHospital: 'NYU Langone Medical Center',
        bloodType: 'O+'
      },
      nextAppointment: '2025-03-15 - Neurology Follow-up',
      recentEvent: 'Physical therapy session - Feb 22'
    }
  ]);
  
  // Mock caregivers/users data
  const [caregivers, setCaregivers] = useState([
    {
      id: '1',
      name: 'Ari Berkowitz',
      email: 'ari.berkowitz@example.com',
      phone: '(555) 123-4567',
      photo: 'https://randomuser.me/api/portraits/men/64.jpg'
    },
    {
      id: '2',
      name: 'Sarah Berkowitz',
      email: 'sarah.b@example.com',
      phone: '(555) 234-5678',
      photo: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      id: '3',
      name: 'David Berkowitz',
      email: 'david.b@example.com',
      phone: '(555) 345-6789',
      photo: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    {
      id: '4',
      name: 'Rachel Goldstein',
      email: 'rachel.g@example.com',
      phone: '(555) 456-7890',
      photo: 'https://randomuser.me/api/portraits/women/45.jpg'
    }
  ]);
  
  // Caregiver access form state
  const [accessForm, setAccessForm] = useState({
    caregiverId: '',
    accessLevel: 'caregiver',
    relationshipToPatient: ''
  });
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API loading delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);
  
  // Menu handlers
  const handleMenuOpen = (event, patient) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  // Dialog handlers
  const handleAddPatientOpen = () => {
    setPatientForm({
      firstName: '',
      lastName: '',
      dob: '',
      medicalConditions: '',
      allergies: '',
      notes: ''
    });
    setOpenAddPatientDialog(true);
  };
  
  const handleAddPatientClose = () => {
    setOpenAddPatientDialog(false);
  };
  
  const handleDeleteDialogOpen = () => {
    setOpenDeleteConfirmDialog(true);
    handleMenuClose();
  };
  
  const handleDeleteDialogClose = () => {
    setOpenDeleteConfirmDialog(false);
  };
  
  const handleAccessManagementOpen = () => {
    setAccessForm({
      caregiverId: '',
      accessLevel: 'caregiver',
      relationshipToPatient: ''
    });
    setOpenAccessManagementDialog(true);
    handleMenuClose();
  };
  
  const handleAccessManagementClose = () => {
    setOpenAccessManagementDialog(false);
  };
  
  // Form handlers
  const handlePatientFormChange = (e) => {
    const { name, value } = e.target;
    setPatientForm({
      ...patientForm,
      [name]: value
    });
  };
  
  const handleAccessFormChange = (e) => {
    const { name, value } = e.target;
    setAccessForm({
      ...accessForm,
      [name]: value
    });
  };
  
  // Action handlers
  const handleAddPatient = () => {
    // Parse form values
    const medicalConditions = patientForm.medicalConditions
      ? patientForm.medicalConditions.split(',').map(item => item.trim())
      : [];
      
    const allergies = patientForm.allergies
      ? patientForm.allergies.split(',').map(item => item.trim())
      : [];
    
    // Calculate age
    const today = new Date();
    const birthDate = new Date(patientForm.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Create new patient
    const newPatient = {
      id: (patients.length + 1).toString(),
      name: `${patientForm.firstName} ${patientForm.lastName}`,
      preferredName: patientForm.firstName,
      dob: patientForm.dob,
      age: age,
      medicalConditions: medicalConditions,
      allergies: allergies,
      notes: patientForm.notes,
      primaryPhoto: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png', // Default avatar
      access: [
        {
          userId: '1', // Current user
          userName: 'Ari Berkowitz',
          userPhoto: 'https://randomuser.me/api/portraits/men/64.jpg',
          accessLevel: 'admin',
          relationshipToPatient: 'Caregiver',
          dateGranted: new Date().toISOString(),
          status: 'active'
        }
      ],
      profile: {
        medicalID: `P-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        address: '',
        emergencyContacts: []
      }
    };
    
    setPatients([...patients, newPatient]);
    showSnackbar(`${newPatient.name} has been added as a patient.`, 'success');
    handleAddPatientClose();
  };
  
  const handleDeletePatient = () => {
    if (selectedPatient) {
      const updatedPatients = patients.filter(patient => patient.id !== selectedPatient.id);
      setPatients(updatedPatients);
      showSnackbar(`${selectedPatient.name} has been removed.`, 'success');
      handleDeleteDialogClose();
    }
  };
  
  const handleGrantAccess = () => {
    if (selectedPatient && accessForm.caregiverId) {
      const caregiver = caregivers.find(cg => cg.id === accessForm.caregiverId);
      
      if (!caregiver) return;
      
      // Check if access already exists
      const existingAccess = selectedPatient.access.find(a => a.userId === accessForm.caregiverId);
      
      if (existingAccess) {
        // Update existing access
        const updatedAccess = selectedPatient.access.map(a => 
          a.userId === accessForm.caregiverId
            ? {
                ...a,
                accessLevel: accessForm.accessLevel,
                relationshipToPatient: accessForm.relationshipToPatient,
                status: 'active'
              }
            : a
        );
        
        const updatedPatient = {
          ...selectedPatient,
          access: updatedAccess
        };
        
        const updatedPatients = patients.map(p => 
          p.id === selectedPatient.id ? updatedPatient : p
        );
        
        setPatients(updatedPatients);
        setSelectedPatient(updatedPatient);
        showSnackbar(`Access updated for ${caregiver.name}.`, 'success');
      } else {
        // Grant new access
        const newAccess = {
          userId: caregiver.id,
          userName: caregiver.name,
          userPhoto: caregiver.photo,
          accessLevel: accessForm.accessLevel,
          relationshipToPatient: accessForm.relationshipToPatient,
          dateGranted: new Date().toISOString(),
          status: 'active'
        };
        
        const updatedPatient = {
          ...selectedPatient,
          access: [...selectedPatient.access, newAccess]
        };
        
        const updatedPatients = patients.map(p => 
          p.id === selectedPatient.id ? updatedPatient : p
        );
        
        setPatients(updatedPatients);
        setSelectedPatient(updatedPatient);
        showSnackbar(`Access granted to ${caregiver.name}.`, 'success');
      }
      
      // Reset form
      setAccessForm({
        caregiverId: '',
        accessLevel: 'caregiver',
        relationshipToPatient: ''
      });
    }
  };
  
  const handleRevokeAccess = (userId) => {
    if (selectedPatient) {
      // Filter out the user or set status to revoked
      const updatedAccess = selectedPatient.access.map(a => 
        a.userId === userId
          ? { ...a, status: 'revoked' }
          : a
      );
      
      const updatedPatient = {
        ...selectedPatient,
        access: updatedAccess
      };
      
      const updatedPatients = patients.map(p => 
        p.id === selectedPatient.id ? updatedPatient : p
      );
      
      setPatients(updatedPatients);
      setSelectedPatient(updatedPatient);
      
      const caregiver = caregivers.find(cg => cg.id === userId);
      showSnackbar(`Access revoked for ${caregiver?.name || 'user'}.`, 'success');
    }
  };
  
  // Snackbar handler
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Filter functions
  const getFilteredPatients = () => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCondition = 
        filterCondition === 'all' || 
        (patient.medicalConditions && 
          patient.medicalConditions.some(condition => 
            condition.toLowerCase().includes(filterCondition.toLowerCase())
          ));
      
      return matchesSearch && matchesCondition;
    });
  };
  
  // Access level formatting
  const getAccessLevelLabel = (level) => {
    switch (level) {
      case 'admin':
        return { label: 'Administrator', color: 'error' };
      case 'caregiver':
        return { label: 'Caregiver', color: 'primary' };
      case 'readonly':
        return { label: 'Read Only', color: 'info' };
      default:
        return { label: level, color: 'default' };
    }
  };
  
  // Get available caregivers who don't already have access
  const getAvailableCaregivers = () => {
    if (!selectedPatient) return caregivers;
    
    const activeAccessUserIds = selectedPatient.access
      .filter(a => a.status === 'active')
      .map(a => a.userId);
    
    return caregivers.filter(cg => !activeAccessUserIds.includes(cg.id));
  };
  
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Patients
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleAddPatientOpen}
            >
              Add Patient
            </Button>
          </Box>
          
          {/* Search and filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FilterListIcon color="action" />
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="condition-filter-label">Filter by Condition</InputLabel>
                    <Select
                      labelId="condition-filter-label"
                      value={filterCondition}
                      label="Filter by Condition"
                      onChange={(e) => setFilterCondition(e.target.value)}
                    >
                      <MenuItem value="all">All Conditions</MenuItem>
                      <MenuItem value="kidney">Kidney Disease</MenuItem>
                      <MenuItem value="diabetes">Diabetes</MenuItem>
                      <MenuItem value="hypertension">Hypertension</MenuItem>
                      <MenuItem value="arthritis">Arthritis</MenuItem>
                      <MenuItem value="parkinson">Parkinson's Disease</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Tabs for different views */}
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              aria-label="patient management tabs"
            >
              <Tab icon={<HealthAndSafetyIcon />} iconPosition="start" label="All Patients" />
              <Tab icon={<PeopleIcon />} iconPosition="start" label="Access Management" />
            </Tabs>
          </Box>
        </Box>
        
        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* All Patients Tab */}
            {selectedTab === 0 && (
              <Grid container spacing={3}>
                {getFilteredPatients().length > 0 ? (
                  getFilteredPatients().map(patient => (
                    <Grid item xs={12} sm={6} md={4} key={patient.id}>
                      <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ position: 'relative', pt: 4, pb: 0, flexGrow: 1 }}>
                          <IconButton
                            aria-label="more options"
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                            onClick={(e) => handleMenuOpen(e, patient)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <Avatar
                              src={patient.primaryPhoto}
                              alt={patient.name}
                              sx={{ width: 80, height: 80, mb: 1 }}
                            />
                            <Typography variant="h6" fontWeight="medium" align="center">
                              {patient.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Age: {patient.age} • DOB: {new Date(patient.dob).toLocaleDateString()}
                            </Typography>
                          </Box>
                          
                          <Divider sx={{ mb: 2 }} />
                          
                          {/* Medical Conditions */}
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Medical Conditions
                          </Typography>
                          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {patient.medicalConditions && patient.medicalConditions.map((condition, idx) => (
                              <Chip
                                key={idx}
                                label={condition}
                                size="small"
                                sx={{ mb: 0.5, mr: 0.5 }}
                              />
                            ))}
                            {(!patient.medicalConditions || patient.medicalConditions.length === 0) && (
                              <Typography variant="body2" color="text.secondary">
                                No conditions listed
                              </Typography>
                            )}
                          </Box>
                          
                          {/* Allergies */}
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Allergies
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {patient.allergies && patient.allergies.map((allergy, idx) => (
                              <Chip
                                key={idx}
                                label={allergy}
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ mb: 0.5, mr: 0.5 }}
                              />
                            ))}
                            {(!patient.allergies || patient.allergies.length === 0) && (
                              <Typography variant="body2" color="text.secondary">
                                No allergies listed
                              </Typography>
                            )}
                          </Box>
                          
                          {/* Next Appointment */}
                          {patient.nextAppointment && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                              <EventIcon color="primary" fontSize="small" sx={{ mt: 0.25, mr: 1 }} />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Next Appointment
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.nextAppointment}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          
                          {/* Recent Event */}
                          {patient.recentEvent && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <MonitorHeartIcon color="error" fontSize="small" sx={{ mt: 0.25, mr: 1 }} />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  Recent Health Event
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.recentEvent}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          
                          {/* Access Information */}
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Caregivers
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {patient.access && patient.access
                              .filter(a => a.status === 'active')
                              .map((access, idx) => (
                                <Chip
                                  key={idx}
                                  avatar={<Avatar alt={access.userName} src={access.userPhoto} />}
                                  label={access.userName}
                                  size="small"
                                />
                              ))}
                            {(!patient.access || patient.access.filter(a => a.status === 'active').length === 0) && (
                              <Typography variant="body2" color="text.secondary">
                                No caregivers assigned
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            component={Link} 
                            to={`/profile?patientId=${patient.id}`}
                            startIcon={<VisibilityIcon />}
                          >
                            View Profile
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                      <MedicalServicesIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No patients found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchQuery || filterCondition !== 'all'
                          ? `No results matching your search criteria`
                          : "Add patients to start managing their care"}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleAddPatientOpen}
                      >
                        Add Patient
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
            
            {/* Access Management Tab */}
            {selectedTab === 1 && (
              <Grid container spacing={3}>
                {getFilteredPatients().length > 0 ? (
                  getFilteredPatients().map(patient => (
                    <Grid item xs={12} key={patient.id}>
                      <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={patient.primaryPhoto}
                            alt={patient.name}
                            sx={{ width: 64, height: 64, mr: 2 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{patient.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {patient.medicalConditions && patient.medicalConditions.length > 0 
                                ? patient.medicalConditions.join(', ') 
                                : 'No conditions listed'}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSelectedPatient(patient);
                              handleAccessManagementOpen();
                            }}
                            startIcon={<PersonAddIcon />}
                          >
                            Manage Access
                          </Button>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle1" gutterBottom>
                          People with Access
                        </Typography>
                        
                        <List>
                          {patient.access && patient.access
                            .filter(a => a.status === 'active')
                            .map((access, idx) => (
                              <ListItem
                                key={idx}
                                secondaryAction={
                                  <Box>
                                    <Chip
                                      label={getAccessLevelLabel(access.accessLevel).label}
                                      color={getAccessLevelLabel(access.accessLevel).color}
                                      size="small"
                                      sx={{ mr: 1 }}
                                    />
                                    <IconButton
                                      edge="end"
                                      aria-label="revoke access"
                                      onClick={() => handleRevokeAccess(access.userId)}
                                      color="error"
                                    >
                                      <BlockIcon />
                                    </IconButton>
                                  </Box>
                                }
                              >
                                <ListItemAvatar>
                                  <Avatar src={access.userPhoto} alt={access.userName} />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={access.userName}
                                  secondary={
                                    <>
                                      <Typography variant="body2" component="span">
                                        {access.relationshipToPatient || 'Caregiver'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" component="div">
                                        Since {new Date(access.dateGranted).toLocaleDateString()}
                                      </Typography>
                                    </>
                                  }
                                />
                              </ListItem>
                            ))}
                            
                          {(!patient.access || patient.access.filter(a => a.status === 'active').length === 0) && (
                            <ListItem>
                              <ListItemText
                                primary="No additional caregivers"
                                secondary="Only you have access to this patient"
                              />
                            </ListItem>
                          )}
                        </List>
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No patients found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchQuery || filterCondition !== 'all'
                          ? `No results matching your search criteria`
                          : "Add patients to manage access"}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleAddPatientOpen}
                      >
                        Add Patient
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}
          </>
        )}
      </Container>
      
      {/* Patient Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} to={`/profile?patientId=${selectedPatient?.id}`} onClick={handleMenuClose}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAccessManagementOpen}>
          <ListItemIcon>
            <PeopleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Manage Access</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteDialogOpen} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Remove Patient</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Add Patient Dialog */}
      <Dialog open={openAddPatientDialog} onClose={handleAddPatientClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={patientForm.firstName}
                onChange={handlePatientFormChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={patientForm.lastName}
                onChange={handlePatientFormChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={patientForm.dob}
                onChange={handlePatientFormChange}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Medical Conditions"
                name="medicalConditions"
                value={patientForm.medicalConditions}
                onChange={handlePatientFormChange}
                fullWidth
                margin="normal"
                placeholder="E.g. Diabetes, Hypertension, Heart Disease (separate with commas)"
                helperText="Enter conditions separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Allergies"
                name="allergies"
                value={patientForm.allergies}
                onChange={handlePatientFormChange}
                fullWidth
                margin="normal"
                placeholder="E.g. Penicillin, Peanuts, Shellfish (separate with commas)"
                helperText="Enter allergies separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={patientForm.notes}
                onChange={handlePatientFormChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                placeholder="Additional information about the patient"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddPatientClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddPatient}
            disabled={!patientForm.firstName || !patientForm.lastName || !patientForm.dob}
          >
            Add Patient
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Remove Patient?</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WarningIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Are you sure you want to remove {selectedPatient?.name} from your patients?
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            This will remove all data and access associated with this patient. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeletePatient}>
            Remove Patient
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Access Management Dialog */}
      <Dialog open={openAccessManagementDialog} onClose={handleAccessManagementClose} maxWidth="md" fullWidth>
        <DialogTitle>Manage Access for {selectedPatient?.name}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Current Access
          </Typography>
          
          <List sx={{ mb: 3 }}>
            {selectedPatient?.access
              .filter(a => a.status === 'active')
              .map((access, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <Box>
                      <Chip
                        label={getAccessLevelLabel(access.accessLevel).label}
                        color={getAccessLevelLabel(access.accessLevel).color}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        edge="end"
                        aria-label="revoke access"
                        onClick={() => handleRevokeAccess(access.userId)}
                        color="error"
                      >
                        <BlockIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={access.userPhoto} alt={access.userName} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={access.userName}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {access.relationshipToPatient || 'Caregiver'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="div">
                          Since {new Date(access.dateGranted).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
              
            {(!selectedPatient?.access || selectedPatient?.access.filter(a => a.status === 'active').length === 0) && (
              <ListItem>
                <ListItemText
                  primary="No additional caregivers"
                  secondary="Only you have access to this patient"
                />
              </ListItem>
            )}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Grant New Access
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="caregiver-select-label">Caregiver</InputLabel>
                <Select
                  labelId="caregiver-select-label"
                  name="caregiverId"
                  value={accessForm.caregiverId}
                  onChange={handleAccessFormChange}
                  label="Caregiver"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Select a caregiver</em>
                  </MenuItem>
                  {getAvailableCaregivers().map(caregiver => (
                    <MenuItem value={caregiver.id} key={caregiver.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={caregiver.photo} alt={caregiver.name} sx={{ width: 24, height: 24, mr: 1 }} />
                        <Typography>{caregiver.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="access-level-label">Access Level</InputLabel>
                <Select
                  labelId="access-level-label"
                  name="accessLevel"
                  value={accessForm.accessLevel}
                  onChange={handleAccessFormChange}
                  label="Access Level"
                >
                  <MenuItem value="admin">Administrator (Full Access)</MenuItem>
                  <MenuItem value="caregiver">Caregiver (Can Edit)</MenuItem>
                  <MenuItem value="readonly">Read Only (View Only)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Relationship to Patient"
                name="relationshipToPatient"
                value={accessForm.relationshipToPatient}
                onChange={handleAccessFormChange}
                fullWidth
                placeholder="E.g. Son, Daughter, Nurse, etc."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccessManagementClose}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGrantAccess}
            disabled={!accessForm.caregiverId}
          >
            Grant Access
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PatientsPage;