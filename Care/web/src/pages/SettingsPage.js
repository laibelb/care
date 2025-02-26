import React, { useState } from 'react';
import '../styles/SettingsPage.css';
import EmailIcon from '@mui/icons-material/Email';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Switch,
  FormControlLabel,
  FormGroup,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Header from '../components/Header';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import DevicesIcon from '@mui/icons-material/Devices';
import HelpIcon from '@mui/icons-material/Help';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import KeyIcon from '@mui/icons-material/Key';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    medicationReminders: true,
    appointmentReminders: true,
    weeklyReports: true,
    dailySummary: false
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    passwordExpiry: 90,
    dataSharing: 'caregivers'
  });

  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    language: 'en',
    timezone: 'America/New_York',
    clockFormat: '12h'
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleSecurityChange = (event) => {
    const { name, value, checked } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    setSecuritySettings({
      ...securitySettings,
      [name]: newValue
    });
  };

  const handleDisplayChange = (event) => {
    const { name, value } = event.target;
    setDisplaySettings({
      ...displaySettings,
      [name]: value
    });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    
    // Password validation check
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbarMessage('Passwords do not match');
      setOpenSnackbar(true);
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setSnackbarMessage('Password must be at least 8 characters long');
      setOpenSnackbar(true);
      return;
    }
    
    // Mock successful password change
    setSnackbarMessage('Password updated successfully');
    setOpenSnackbar(true);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSettingsSave = (section) => {
    // Mock API call to save settings
    setSnackbarMessage(`${section} settings saved successfully`);
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const settingsTabs = [
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'security', label: 'Security & Privacy', icon: <SecurityIcon /> },
    { id: 'display', label: 'Display & Accessibility', icon: <VisibilityIcon /> },
    { id: 'devices', label: 'Connected Devices', icon: <DevicesIcon /> },
    { id: 'help', label: 'Help & Support', icon: <HelpIcon /> }
  ];

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
          Settings
        </Typography>

        <Grid container spacing={4}>
          {/* Settings Navigation */}
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ height: '100%' }}>
              <List>
                {settingsTabs.map((tab) => (
                  <ListItem key={tab.id} disablePadding>
                    <ListItemButton
                      selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      sx={{
                        borderLeft: activeTab === tab.id ? '4px solid' : '4px solid transparent',
                        borderColor: 'primary.main',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(0, 116, 217, 0.08)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: activeTab === tab.id ? 'primary.main' : 'inherit' }}>
                        {tab.icon}
                      </ListItemIcon>
                      <ListItemText primary={tab.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Settings Content */}
          <Grid item xs={12} md={9}>
            <Paper elevation={2} sx={{ p: 3 }}>
              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <>
                  <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                    Notification Settings
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Notification Methods
                  </Typography>
                  <FormGroup sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          name="emailNotifications"
                          color="primary"
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onChange={handleNotificationChange}
                          name="pushNotifications"
                          color="primary"
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.smsNotifications}
                          onChange={handleNotificationChange}
                          name="smsNotifications"
                          color="primary"
                        />
                      }
                      label="SMS Notifications"
                    />
                  </FormGroup>
                  
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Notification Types
                  </Typography>
                  <FormGroup sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.medicationReminders}
                          onChange={handleNotificationChange}
                          name="medicationReminders"
                          color="primary"
                        />
                      }
                      label="Medication Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.appointmentReminders}
                          onChange={handleNotificationChange}
                          name="appointmentReminders"
                          color="primary"
                        />
                      }
                      label="Appointment Reminders"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.weeklyReports}
                          onChange={handleNotificationChange}
                          name="weeklyReports"
                          color="primary"
                        />
                      }
                      label="Weekly Health Reports"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.dailySummary}
                          onChange={handleNotificationChange}
                          name="dailySummary"
                          color="primary"
                        />
                      }
                      label="Daily Care Summary"
                    />
                  </FormGroup>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SaveIcon />}
                      onClick={() => handleSettingsSave('Notification')}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </>
              )}

              {/* Security & Privacy Settings */}
              {activeTab === 'security' && (
                <>
                  <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                    Security & Privacy
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Account Security
                  </Typography>
                  <FormGroup sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securitySettings.twoFactorAuth}
                          onChange={handleSecurityChange}
                          name="twoFactorAuth"
                          color="primary"
                        />
                      }
                      label="Two-Factor Authentication"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={securitySettings.loginNotifications}
                          onChange={handleSecurityChange}
                          name="loginNotifications"
                          color="primary"
                        />
                      }
                      label="Login Notifications"
                    />
                  </FormGroup>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                      Password Management
                    </Typography>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="password-change-content"
                        id="password-change-header"
                      >
                        <LockIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        <Typography>Change Password</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <form onSubmit={handlePasswordSubmit}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                InputProps={{
                                  startAdornment: <KeyIcon color="action" sx={{ mr: 1 }} />,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                                helperText="Password must be at least 8 characters long"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                              />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                              >
                                Update Password
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Box sx={{ mt: 3 }}>
                      <FormControl fullWidth>
                        <InputLabel id="password-expiry-label">Password Expiration</InputLabel>
                        <Select
                          labelId="password-expiry-label"
                          name="passwordExpiry"
                          value={securitySettings.passwordExpiry}
                          label="Password Expiration"
                          onChange={handleSecurityChange}
                        >
                          <MenuItem value={30}>30 days</MenuItem>
                          <MenuItem value={60}>60 days</MenuItem>
                          <MenuItem value={90}>90 days</MenuItem>
                          <MenuItem value={180}>180 days</MenuItem>
                          <MenuItem value={0}>Never</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Privacy Settings
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="data-sharing-label">Data Sharing</InputLabel>
                    <Select
                      labelId="data-sharing-label"
                      name="dataSharing"
                      value={securitySettings.dataSharing}
                      label="Data Sharing"
                      onChange={handleSecurityChange}
                    >
                      <MenuItem value="caregivers">Caregivers Only</MenuItem>
                      <MenuItem value="family">Family Members</MenuItem>
                      <MenuItem value="medical">Medical Professionals Only</MenuItem>
                      <MenuItem value="all">All Authorized Users</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SaveIcon />}
                      onClick={() => handleSettingsSave('Security')}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </>
              )}

              {/* Display & Accessibility Settings */}
              {activeTab === 'display' && (
                <>
                  <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                    Display & Accessibility
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="theme-label">Theme</InputLabel>
                        <Select
                          labelId="theme-label"
                          name="theme"
                          value={displaySettings.theme}
                          label="Theme"
                          onChange={handleDisplayChange}
                        >
                          <MenuItem value="light">Light Mode</MenuItem>
                          <MenuItem value="dark">Dark Mode</MenuItem>
                          <MenuItem value="system">System Default</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="fontsize-label">Font Size</InputLabel>
                        <Select
                          labelId="fontsize-label"
                          name="fontSize"
                          value={displaySettings.fontSize}
                          label="Font Size"
                          onChange={handleDisplayChange}
                        >
                          <MenuItem value="small">Small</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="large">Large</MenuItem>
                          <MenuItem value="xlarge">Extra Large</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="language-label">Language</InputLabel>
                        <Select
                          labelId="language-label"
                          name="language"
                          value={displaySettings.language}
                          label="Language"
                          onChange={handleDisplayChange}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Español</MenuItem>
                          <MenuItem value="fr">Français</MenuItem>
                          <MenuItem value="de">Deutsch</MenuItem>
                          <MenuItem value="zh">中文</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="timezone-label">Time Zone</InputLabel>
                        <Select
                          labelId="timezone-label"
                          name="timezone"
                          value={displaySettings.timezone}
                          label="Time Zone"
                          onChange={handleDisplayChange}
                        >
                          <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                          <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                          <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                          <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                          <MenuItem value="Europe/London">London (GMT)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                        Time Format
                      </Typography>
                      <RadioGroup
                        row
                        name="clockFormat"
                        value={displaySettings.clockFormat}
                        onChange={handleDisplayChange}
                      >
                        <FormControlLabel value="12h" control={<Radio />} label="12-hour (1:30 PM)" />
                        <FormControlLabel value="24h" control={<Radio />} label="24-hour (13:30)" />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SaveIcon />}
                      onClick={() => handleSettingsSave('Display')}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </>
              )}

              {/* Connected Devices */}
              {activeTab === 'devices' && (
                <>
                  <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                    Connected Devices
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    No connected devices found. You can connect health monitoring devices to automatically sync data.
                  </Alert>
                  
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Add Compatible Devices
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Connect health monitoring devices like blood pressure monitors, glucose meters, 
                    weight scales and other compatible devices to automatically sync health data.
                  </Typography>
                  
                  <Button variant="outlined" color="primary">
                    Connect New Device
                  </Button>
                </>
              )}

              {/* Help & Support */}
              {activeTab === 'help' && (
                <>
                  <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                    Help & Support
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Support Resources
                  </Typography>
                  
                  <List>
                    <ListItem button component="a" href="#" sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <HelpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Help Center & FAQ" />
                    </ListItem>
                    
                    <ListItem button component="a" href="#" sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <LanguageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Video Tutorials" />
                    </ListItem>
                    
                    <ListItem button component="a" href="mailto:support@careapp.com" sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Contact Support" 
                        secondary="support@careapp.com"
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 4, mb: 2 }}>
                    App Information
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Version: 1.0.0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: February 2025
                    </Typography>
                  </Box>
                  
                  <Button variant="outlined" color="primary">
                    Check for Updates
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SettingsPage;