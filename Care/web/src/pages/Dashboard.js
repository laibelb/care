import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Dashboard.css';

// Material UI imports
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// Icons
import EventIcon from '@mui/icons-material/Event';
import MedicationIcon from '@mui/icons-material/Medication';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScaleIcon from '@mui/icons-material/Scale';
import OpacityIcon from '@mui/icons-material/Opacity';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// Charts
// Commenting out recharts imports until we resolve the dependency
// import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden',
}));

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'rgba(0, 0, 0, 0.01)',
  padding: '16px 24px',
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.8rem',
}));

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [careRecipient, setCareRecipient] = useState(null);
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [recentHealthEvents, setRecentHealthEvents] = useState([]);
  const [medications, setMedications] = useState([]);
  const [vitalTrends, setVitalTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Simulated API calls
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API loading delay
      setTimeout(async () => {
        try {
          // In a real app, these would be actual API calls
          
          // Fetch care recipient data
          setCareRecipient({
            id: '1',
            name: 'Rabbi Berkowitz',
            dob: '1948-11-09',
            age: 76,
            photoUrl: '/images/rabbiB.png',
            medicalConditions: ['Kidney Disease', 'Hypertension', 'Type 2 Diabetes', 'Heart Condition'],
            allergies: ['Penicillin', 'Sulfa Drugs'],
            dialysisSchedule: 'Monday, Wednesday, Friday - 9:00 AM',
            nextAppointment: {
              type: 'Nephrology Follow-up',
              date: '2025-03-10T13:30:00',
              doctor: 'Dr. Sarah Goldstein',
              location: 'Mount Sinai Nephrology Clinic'
            },
            emergencyContact: {
              name: 'Leah Berkowitz',
              relation: 'Wife',
              phone: '555-111-2222'
            }
          });
          
          // Fetch upcoming visits
          setUpcomingVisits([
            { 
              id: '1', 
              caregiverId: '11', 
              caregiverName: 'Leoman Gonzales', 
              caregiverPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
              date: '2025-02-27T08:00:00', 
              endTime: '2025-02-27T16:00:00',
              type: 'Aide Visit',
              location: 'Home',
              status: 'confirmed',
              color: '#4CAF50',
              notes: 'Regular weekday care'
            },
            { 
              id: '2', 
              caregiverId: '12',
              caregiverName: 'Dr. Sarah Goldstein',
              caregiverPhoto: 'https://randomuser.me/api/portraits/women/52.jpg',
              date: '2025-02-28T13:30:00',
              endTime: '2025-02-28T14:30:00',
              type: 'Doctor Appointment',
              location: 'Mount Sinai Nephrology, Room 305',
              status: 'confirmed',
              color: '#FF5722',
              notes: 'Monthly nephrology checkup'
            },
            { 
              id: '3', 
              caregiverId: '9',
              caregiverName: 'Ari Berkowitz',
              caregiverPhoto: '/images/ariB.png',
              date: '2025-02-27T18:00:00',
              endTime: '2025-02-27T20:00:00',
              type: 'Family Visit',
              location: 'Home',
              status: 'confirmed',
              color: '#2196F3',
              notes: 'Evening visit with dinner'
            },
            {
              id: '6',
              caregiverId: '0',
              caregiverName: 'Kosher Meals on Wheels',
              date: '2025-02-29T11:00:00',
              endTime: '2025-02-29T11:15:00',
              type: 'Meal Delivery',
              location: 'Home',
              status: 'confirmed',
              color: '#FFC107',
              notes: 'Friday delivery of Shabbat meals'
            }
          ]);
          
          // Fetch recent health events
          setRecentHealthEvents([
            { 
              id: '1', 
              date: '2025-02-24T09:30:00', 
              type: 'Vital Signs', 
              notes: 'Pre-dialysis check. Patient reported slight fatigue.',
              vitals: {
                bloodPressure: '142/88',
                heartRate: '76',
                temperature: '98.4',
                bloodSugar: '132',
                weight: '168.5',
                oxygenLevel: '96'
              },
              severity: 'normal',
              caregiverName: 'Leoman Gonzales',
              location: 'Home'
            },
            { 
              id: '2', 
              date: '2025-02-20T14:00:00', 
              type: 'Nephrology Appointment', 
              notes: 'Monthly nephrology appointment with Dr. Goldstein. Dialysis prescription adjusted.',
              vitals: {
                bloodPressure: '138/84',
                heartRate: '78',
                temperature: '98.6',
                bloodSugar: '128',
                weight: '167.2'
              },
              severity: 'normal',
              caregiverName: 'Leah Berkowitz',
              location: 'Mount Sinai Nephrology Clinic'
            },
            { 
              id: '3', 
              date: '2025-02-18T10:15:00', 
              type: 'Symptom', 
              notes: 'Reported dizziness and slight shortness of breath after morning prayers.',
              vitals: {
                bloodPressure: '146/90',
                heartRate: '88',
                oxygenLevel: '94'
              },
              severity: 'mild concern',
              caregiverName: 'Leoman Gonzales',
              location: 'Home'
            }
          ]);
          
          // Fetch medications
          setMedications([
            { 
              id: '1', 
              name: 'Epoetin Alfa (Epogen)', 
              dosage: '4,000 units', 
              frequency: 'Three times weekly (dialysis days)', 
              nextDose: '2025-02-26T09:00:00',
              remaining: 12,
              refillDate: '2025-03-12',
              purpose: 'Treats anemia in kidney disease',
              pillColor: 'red',
              category: 'Dialysis Medication'
            },
            { 
              id: '2', 
              name: 'Sevelamer (Renvela)', 
              dosage: '800mg', 
              frequency: 'Three times daily with meals', 
              nextDose: '2025-02-26T12:00:00',
              remaining: 45,
              refillDate: '2025-03-10',
              purpose: 'Controls phosphorus levels',
              pillColor: 'white',
              category: 'Phosphate Binder'
            },
            { 
              id: '3', 
              name: 'Metoprolol', 
              dosage: '25mg', 
              frequency: 'Twice daily', 
              nextDose: '2025-02-25T20:00:00',
              remaining: 36,
              refillDate: '2025-03-15',
              purpose: 'Treats high blood pressure and heart conditions',
              pillColor: 'blue',
              category: 'Beta-blocker'
            },
            { 
              id: '4', 
              name: 'Insulin Glargine (Lantus)', 
              dosage: '20 units', 
              frequency: 'Once daily at bedtime', 
              nextDose: '2025-02-25T21:00:00',
              remaining: 14,
              refillDate: '2025-03-01',
              purpose: 'Controls blood sugar',
              medicationType: 'Injection',
              category: 'Insulin',
              lowSupply: true
            }
          ]);
          
          // Blood pressure trends data
          setVitalTrends([
            { date: '2/15', systolic: 122, diastolic: 78, weight: 165.2 },
            { date: '2/17', systolic: 126, diastolic: 80, weight: 166.0 },
            { date: '2/18', systolic: 146, diastolic: 90, weight: 166.0 },
            { date: '2/20', systolic: 138, diastolic: 84, weight: 167.2 },
            { date: '2/22', systolic: 140, diastolic: 86, weight: 167.8 },
            { date: '2/24', systolic: 142, diastolic: 88, weight: 168.5 },
          ]);
          
          // Alerts
          setAlerts([
            {
              id: 1,
              type: 'medication',
              severity: 'warning',
              message: 'Insulin Glargine (Lantus) supply is low - 14 doses remaining',
              date: '2025-02-25T08:00:00'
            },
            {
              id: 2,
              type: 'vital',
              severity: 'warning',
              message: 'Blood pressure elevated at 142/88 - above target range',
              date: '2025-02-24T09:30:00'
            },
            {
              id: 3,
              type: 'weight',
              severity: 'warning',
              message: 'Weight has increased by 3.3 lbs in the past week',
              date: '2025-02-24T09:30:00'
            },
            {
              id: 4,
              type: 'appointment',
              severity: 'info',
              message: 'Dialysis scheduled for tomorrow (Wed) at 9:00 AM',
              date: '2025-02-25T09:00:00'
            }
          ]);
          
          setLoading(false);
          
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }, 1000); // Simulate 1 second loading time
    };
    
    fetchData();
  }, []);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Format date for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Format date only
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time only
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Get alert icon based on type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'medication':
        return <MedicationIcon />;
      case 'vital':
        return <MonitorHeartIcon />;
      case 'weight':
        return <ScaleIcon />;
      case 'appointment':
        return <EventIcon />;
      default:
        return <WarningIcon />;
    }
  };
  
  // Get alert color based on severity
  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };
  
  // Calculate medication adherence percentage
  const medicationAdherence = 92; // In a real app, this would be calculated

  // BP status color
  const getBPStatusColor = (systolic, diastolic) => {
    if (systolic >= 140 || diastolic >= 90) return '#E74C3C'; // High - red
    if (systolic >= 130 || diastolic >= 85) return '#F7B731'; // Elevated - yellow
    return '#44BD32'; // Normal - green
  };
  
  // Glucose status color
  const getGlucoseStatusColor = (value) => {
    if (value > 140) return '#E74C3C'; // High
    if (value < 70) return '#F7B731'; // Low
    return '#44BD32'; // Normal
  };
  
  // Weight change indicator
  const weightChange = careRecipient ? vitalTrends[vitalTrends.length - 1]?.weight - vitalTrends[0]?.weight : 0;
  
  // Blood pressure data for the chart
  const bpChartData = vitalTrends.map(item => ({
    date: item.date,
    Systolic: item.systolic,
    Diastolic: item.diastolic,
  }));
  
  // Medication adherence chart data
  const adherenceData = [
    { name: 'Taken', value: medicationAdherence },
    { name: 'Missed', value: 100 - medicationAdherence }
  ];
  
  const COLORS = ['#44BD32', '#E74C3C'];

  return (
    <Box className="dashboard-container">
      <Header />
      
      <Box sx={{ flexGrow: 1, padding: 3, pt: 1 }}>
        {/* Page heading */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" fontWeight="medium">
            Patient Dashboard
          </Typography>
          <Chip 
            label="Last updated: Just now" 
            size="small" 
            color="primary" 
            variant="outlined"
            icon={<AccessTimeIcon fontSize="small" />}
          />
        </Box>
        
        <Grid container spacing={3}>
          {/* Patient summary card */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardHeaderStyled
                title={
                  <Typography variant="h6" fontWeight="medium">
                    Patient Summary
                  </Typography>
                }
              />
              
              {careRecipient && (
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      alt={careRecipient.name}
                      src={careRecipient.photoUrl}
                      sx={{ width: 80, height: 80, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="medium">{careRecipient.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {calculateAge(careRecipient.dob)} years old • DOB: {new Date(careRecipient.dob).toLocaleDateString()}
                      </Typography>
                      <Chip 
                        label="Dialysis Patient" 
                        size="small" 
                        color="primary" 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
                    Medical Conditions
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {careRecipient.medicalConditions.map((condition, index) => (
                      <Chip 
                        key={index} 
                        label={condition} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
                    Allergies
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {careRecipient.allergies.map((allergy, index) => (
                      <Chip 
                        key={index} 
                        label={allergy} 
                        size="small" 
                        variant="outlined"
                        color="error"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
                    Dialysis Schedule
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {careRecipient.dialysisSchedule}
                  </Typography>
                  
                  <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
                    Emergency Contact
                  </Typography>
                  <Typography variant="body2">
                    {careRecipient.emergencyContact.name} ({careRecipient.emergencyContact.relation})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {careRecipient.emergencyContact.phone}
                  </Typography>
                </CardContent>
              )}
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button size="small" variant="outlined" component={Link} to="/profile">
                  View Full Profile
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
          
          {/* Alerts card */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardHeaderStyled
                title={
                  <Typography variant="h6" fontWeight="medium">
                    Alerts & Notifications
                  </Typography>
                }
              />
              
              <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <List sx={{ width: '100%', p: 0 }}>
                  {alerts.map((alert) => (
                    <React.Fragment key={alert.id}>
                      <ListItem alignItems="flex-start" sx={{ py: 2, px: 3 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `${getAlertColor(alert.severity)}.light`, color: `${getAlertColor(alert.severity)}.main` }}>
                            {getAlertIcon(alert.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="body1" 
                              fontWeight="medium"
                              sx={{ mb: 0.5 }}
                            >
                              {alert.message}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {formatDateTime(alert.date)}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="address alert">
                            <ArrowForwardIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
              
              <CardActions sx={{ p: 2 }}>
                <ViewAllButton 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  component={Link} 
                  to="/alerts"
                >
                  View All Alerts
                </ViewAllButton>
              </CardActions>
            </StyledCard>
          </Grid>
          
          {/* Vital Signs Summary */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardHeaderStyled
                title={
                  <Typography variant="h6" fontWeight="medium">
                    Health Vitals
                  </Typography>
                }
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                  {/* Latest vitals */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      LATEST MEASUREMENTS
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      {/* Blood Pressure */}
                      <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: 'rgba(233, 30, 99, 0.1)', 
                                color: 'error.main',
                                width: 40, 
                                height: 40,
                                mr: 2
                              }}
                            >
                              <FavoriteIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Blood Pressure
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                <Typography variant="h6" fontWeight="medium">
                                  {recentHealthEvents[0]?.vitals?.bloodPressure || '120/80'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  mmHg
                                </Typography>
                                {recentHealthEvents[0]?.vitals?.bloodPressure && (
                                  <Chip 
                                    label={(parseInt(recentHealthEvents[0].vitals.bloodPressure.split('/')[0]) > 140) ? "Elevated" : "Normal"} 
                                    size="small" 
                                    color={(parseInt(recentHealthEvents[0].vitals.bloodPressure.split('/')[0]) > 140) ? "warning" : "success"}
                                    sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      {/* Weight */}
                      <Grid item xs={6}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: 'rgba(33, 150, 243, 0.1)', 
                                color: 'primary.main',
                                width: 36, 
                                height: 36,
                                mr: 1.5
                              }}
                            >
                              <ScaleIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Weight
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                <Typography variant="h6" fontWeight="medium">
                                  {recentHealthEvents[0]?.vitals?.weight || '165.0'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  lbs
                                </Typography>
                                {weightChange !== 0 && (
                                  <Typography 
                                    variant="caption" 
                                    color={weightChange > 2 ? "error" : "inherit"} 
                                    sx={{ ml: 1 }}
                                  >
                                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      {/* Blood Glucose */}
                      <Grid item xs={6}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: 'rgba(76, 175, 80, 0.1)', 
                                color: 'success.main',
                                width: 36, 
                                height: 36,
                                mr: 1.5
                              }}
                            >
                              <OpacityIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Blood Glucose
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                <Typography variant="h6" fontWeight="medium">
                                  {recentHealthEvents[0]?.vitals?.bloodSugar || '110'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  mg/dL
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      {/* Heart Rate and O2 */}
                      <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: 'rgba(156, 39, 176, 0.1)', 
                                    color: 'secondary.main',
                                    width: 36, 
                                    height: 36,
                                    mr: 1.5
                                  }}
                                >
                                  <MonitorHeartIcon />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Heart Rate
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                    <Typography variant="h6" fontWeight="medium">
                                      {recentHealthEvents[0]?.vitals?.heartRate || '72'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                      bpm
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: 'rgba(255, 193, 7, 0.1)', 
                                    color: 'warning.main',
                                    width: 36, 
                                    height: 36,
                                    mr: 1.5
                                  }}
                                >
                                  <DeviceThermostatIcon />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Temperature
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                    <Typography variant="h6" fontWeight="medium">
                                      {recentHealthEvents[0]?.vitals?.temperature || '98.6'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                      °F
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {/* Vital sign trend chart */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      BLOOD PRESSURE TREND
                    </Typography>
                    
                    {vitalTrends.length > 0 && (
                      <Box sx={{ height: 280, pt: 1 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Typography variant="body1" color="text.secondary">
                            Blood Pressure Chart (Recharts library not available)
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
              
              <CardActions sx={{ p: 2 }}>
                <ViewAllButton 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  component={Link} 
                  to="/health"
                >
                  View Health Tracking
                </ViewAllButton>
              </CardActions>
            </StyledCard>
          </Grid>
          
          {/* Medication Adherence */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardHeaderStyled
                title={
                  <Typography variant="h6" fontWeight="medium">
                    Medication Adherence
                  </Typography>
                }
              />
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  LAST 30 DAYS
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" fontWeight="medium" color={medicationAdherence >= 90 ? 'success.main' : medicationAdherence >= 80 ? 'warning.main' : 'error.main'}>
                    {medicationAdherence}%
                  </Typography>
                  
                  <Box sx={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Avatar sx={{ width: 60, height: 60, bgcolor: 'success.light', color: 'success.dark' }}>
                      {medicationAdherence}%
                    </Avatar>
                  </Box>
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  UPCOMING DOSES
                </Typography>
                
                <List sx={{ width: '100%', p: 0 }}>
                  {medications.slice(0, 3).map((med) => (
                    <ListItem key={med.id} disablePadding sx={{ mb: 1 }}>
                      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: med.pillColor ? `${med.pillColor}.light` : 'primary.light', 
                              color: med.pillColor ? `${med.pillColor}.main` : 'primary.main',
                              width: 36, 
                              height: 36,
                              mr: 1.5
                            }}
                          >
                            <MedicationIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {med.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">
                                {med.dosage} • {formatTime(med.nextDose)}
                              </Typography>
                              
                              {med.lowSupply && (
                                <Chip 
                                  label="Low Supply" 
                                  size="small" 
                                  color="warning"
                                  sx={{ height: 20, fontSize: '0.6rem' }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              
              <CardActions sx={{ p: 2 }}>
                <ViewAllButton 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  component={Link} 
                  to="/medications"
                >
                  View All Medications
                </ViewAllButton>
              </CardActions>
            </StyledCard>
          </Grid>
          
          {/* Upcoming Visits */}
          <Grid item xs={12}>
            <StyledCard>
              <CardHeaderStyled
                title={
                  <Typography variant="h6" fontWeight="medium">
                    Upcoming Schedule
                  </Typography>
                }
              />
              
              <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="upcoming visits table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Caregiver</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {upcomingVisits.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%', 
                                  bgcolor: visit.color,
                                  mr: 1.5
                                }} 
                              />
                              {visit.type}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{formatDate(visit.date)}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatTime(visit.date)} - {formatTime(visit.endTime)}
                            </Typography>
                          </TableCell>
                          <TableCell>{visit.location}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {visit.caregiverPhoto ? (
                                <Avatar 
                                  src={visit.caregiverPhoto} 
                                  alt={visit.caregiverName}
                                  sx={{ width: 24, height: 24, mr: 1 }}
                                />
                              ) : (
                                <Avatar 
                                  sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }} 
                                >
                                  {visit.caregiverName.charAt(0)}
                                </Avatar>
                              )}
                              {visit.caregiverName}
                            </Box>
                          </TableCell>
                          <TableCell>{visit.notes}</TableCell>
                          <TableCell>
                            <Chip 
                              label={visit.status.charAt(0).toUpperCase() + visit.status.slice(1)} 
                              size="small" 
                              color={visit.status === 'confirmed' ? 'success' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
              
              <CardActions sx={{ p: 2 }}>
                <ViewAllButton 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  component={Link} 
                  to="/schedule"
                >
                  View Full Schedule
                </ViewAllButton>
              </CardActions>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;