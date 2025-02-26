import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Paper,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import Header from '../components/Header';
import '../styles/ProfilePage.css';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

function ProfilePage() {
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Caregiver user data
  const [caregiverData, setCaregiverData] = useState({
    name: 'Ari Berkowitz',
    email: 'ari.berkowitz@example.com',
    phone: '(555) 123-4567',
    role: 'admin',
    address: '123 Main St, New York, NY 10001',
    bio: 'Family coordinator and primary caregiver responsible for managing patient care and coordination.',
    dateJoined: 'January 2023',
    preferredContactMethod: 'email',
    photoUrl: 'https://randomuser.me/api/portraits/men/64.jpg'
  });
  
  // Patient data
  const [patientData, setPatientData] = useState({
    name: 'Rabbi Berkowitz',
    dob: '1948-11-09',
    age: 76,
    medicalID: 'P-2023-1121',
    primaryPhysician: 'Dr. Sarah Goldstein (Nephrologist)',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: 'Leah Berkowitz (Wife) • (555) 111-2222',
    preferredHospital: 'Mount Sinai Medical Center',
    medicalConditions: ['Kidney Disease', 'Hypertension', 'Type 2 Diabetes', 'Heart Condition'],
    allergies: ['Penicillin', 'Sulfa Drugs'],
    bloodType: 'A+',
    dialysisSchedule: 'Monday, Wednesday, Friday - 9:00 AM',
    dialysisCenter: 'Midtown Dialysis Center • (555) 888-9999',
    nextAppointment: 'March 10, 2025 - Nephrology Follow-up',
    photoUrl: '/images/rabbiB.png'
  });

  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(caregiverData);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setEditMode(false);
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaregiverData(formData);
    setEditMode(false);
    setOpenSnackbar(true);
  };

  const handleCancel = () => {
    setFormData(caregiverData);
    setEditMode(false);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            aria-label="profile tabs"
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="My Profile" />
            <Tab icon={<MedicalServicesIcon />} iconPosition="start" label="Patient Profile" />
          </Tabs>
        </Box>
        
        {/* Caregiver Profile */}
        {tabValue === 0 && (
          <>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
              My Profile
            </Typography>

            <Grid container spacing={4}>
              {/* Profile Card */}
              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={caregiverData.photoUrl}
                        alt={caregiverData.name}
                        sx={{ width: 160, height: 160, mb: 2, border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      />
                      <IconButton 
                        color="primary" 
                        sx={{ 
                          position: 'absolute',
                          bottom: 10,
                          right: 0,
                          bgcolor: 'white',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          '&:hover': {
                            bgcolor: 'white',
                          }
                        }}
                      >
                        <CameraAltIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      {caregiverData.name}
                    </Typography>
                    <Chip 
                      label={caregiverData.role === 'admin' ? 'Administrator' : 'Family Member'} 
                      color="primary" 
                      sx={{ mt: 1, mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {caregiverData.bio}
                    </Typography>
                    <Divider sx={{ width: '100%', my: 3 }} />
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {caregiverData.email}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <LocalPhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {caregiverData.phone}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <HomeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {caregiverData.address}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                        Member since {caregiverData.dateJoined}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Profile Edit Form */}
              <Grid item xs={12} md={8}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      {editMode ? 'Edit Profile' : 'Profile Information'}
                    </Typography>
                    {!editMode && (
                      <Button 
                        startIcon={<EditIcon />} 
                        variant="outlined" 
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: <LocalPhoneIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!editMode}>
                          <InputLabel id="role-label">Role</InputLabel>
                          <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            label="Role"
                            onChange={handleChange}
                            startAdornment={<BadgeIcon color="action" sx={{ mr: 1 }} />}
                          >
                            <MenuItem value="admin">Administrator</MenuItem>
                            <MenuItem value="caregiver">Primary Caregiver</MenuItem>
                            <MenuItem value="family">Family Member</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!editMode}
                          InputProps={{
                            startAdornment: <HomeIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          disabled={!editMode}
                          multiline
                          rows={4}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth disabled={!editMode}>
                          <InputLabel id="contact-method-label">Preferred Contact Method</InputLabel>
                          <Select
                            labelId="contact-method-label"
                            name="preferredContactMethod"
                            value={formData.preferredContactMethod}
                            label="Preferred Contact Method"
                            onChange={handleChange}
                          >
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone">Phone</MenuItem>
                            <MenuItem value="text">Text Message</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      {editMode && (
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                          <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            startIcon={<SaveIcon />}
                          >
                            Save Changes
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
        
        {/* Patient Profile */}
        {tabValue === 1 && (
          <>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
              Patient Profile
            </Typography>
            
            <Grid container spacing={4}>
              {/* Patient Profile Summary */}
              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                    <Avatar
                      src={patientData.photoUrl}
                      alt={patientData.name}
                      sx={{ width: 160, height: 160, mb: 2, border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                    />
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      {patientData.name}
                    </Typography>
                    <Chip 
                      label="Dialysis Patient" 
                      color="primary" 
                      icon={<WaterDropIcon />}
                      sx={{ mt: 1, mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                        Age:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {patientData.age}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                        DOB:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(patientData.dob).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                        Blood Type:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {patientData.bloodType}
                      </Typography>
                    </Box>
                    <Divider sx={{ width: '100%', my: 3 }} />
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Next Appointment
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {patientData.nextAppointment}
                        </Typography>
                      </Box>
                      
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Dialysis Schedule
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <AccessTimeIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                        <Typography variant="body2">
                          {patientData.dialysisSchedule}
                          <br />
                          <Typography variant="body2" color="text.secondary">
                            {patientData.dialysisCenter}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Patient Medical Information */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  {/* Medical Conditions */}
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Medical Conditions
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {patientData.medicalConditions.map((condition, index) => (
                          <Chip 
                            key={index} 
                            label={condition} 
                            color="error"
                            icon={<MonitorHeartIcon />}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* Allergies */}
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Allergies
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {patientData.allergies.map((allergy, index) => (
                          <Chip 
                            key={index} 
                            label={allergy} 
                            color="warning"
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* Primary Care Provider */}
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Primary Physician
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {patientData.primaryPhysician}
                      </Typography>
                      
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Preferred Hospital
                      </Typography>
                      <Typography variant="body1">
                        {patientData.preferredHospital}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  {/* Emergency Contact */}
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Emergency Contact
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {patientData.emergencyContact}
                      </Typography>
                      
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Medical ID
                      </Typography>
                      <Typography variant="body1">
                        {patientData.medicalID}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  {/* Address */}
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Home Address
                      </Typography>
                      <Typography variant="body1">
                        {patientData.address}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProfilePage;