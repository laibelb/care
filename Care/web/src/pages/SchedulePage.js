import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/SchedulePage.css';

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
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemIcon from '@mui/material/ListItemIcon';

// Icons
import EventIcon from '@mui/icons-material/Event';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';
import RepeatIcon from '@mui/icons-material/Repeat';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

const TabContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 50,
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
}));

function SchedulePage() {
  const [visits, setVisits] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [viewMode, setViewMode] = useState('week'); // 'month', 'week', 'day', 'list'
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null);
  const [activeVisit, setActiveVisit] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [formError, setFormError] = useState({});
  
  const [newVisit, setNewVisit] = useState({
    caregiverId: '',
    caregiverName: '',
    caregiverPhoto: '',
    caregiverRole: '',
    startDateTime: new Date(),
    endDateTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    duration: 60,
    type: 'Regular Visit',
    location: 'Home',
    status: 'scheduled',
    recurrence: 'none',
    notes: '',
    color: '#4CAF50'
  });
  
  const calendarRef = useRef(null);
  
  // Mock visit types with colors
  const visitTypes = [
    { value: 'Regular Visit', label: 'Regular Visit', color: '#4CAF50' }, // Green
    { value: 'Doctor Appointment', label: 'Doctor Appointment', color: '#FF5722' }, // Orange
    { value: 'Family Visit', label: 'Family Visit', color: '#2196F3' }, // Blue
    { value: 'Therapy Session', label: 'Therapy Session', color: '#9C27B0' }, // Purple
    { value: 'Dialysis Treatment', label: 'Dialysis Treatment', color: '#9C27B0' }, // Purple
    { value: 'Meal Delivery', label: 'Meal Delivery', color: '#FFC107' }, // Yellow
    { value: 'Medication Delivery', label: 'Medication Delivery', color: '#E91E63' }, // Pink
    { value: 'Specialist Consult', label: 'Specialist Consult', color: '#FF5722' }, // Orange
    { value: 'Lab Work', label: 'Lab Work', color: '#795548' }, // Brown
    { value: 'Shabbat Visit', label: 'Shabbat Visit', color: '#673AB7' }, // Deep Purple
    { value: 'Other', label: 'Other', color: '#607D8B' } // Gray
  ];
  
  // Simulated API call to load data
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Simulated API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch visits
        const fetchedVisits = [
          { 
            id: '1', 
            careRecipientId: '1', 
            caregiverId: '11', 
            caregiverName: 'Leoman Gonzales', 
            caregiverPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
            caregiverRole: 'Professional Aide',
            startDateTime: new Date('2025-02-27T08:00:00'), 
            endDateTime: new Date('2025-02-27T16:00:00'), 
            duration: 480,
            type: 'Regular Visit',
            location: 'Home',
            status: 'scheduled', 
            recurrence: 'weekly',
            color: '#4CAF50',
            notes: 'Regular weekday care. Assist with morning routine and medications. Prepare kosher lunch.',
            tasks: [
              { id: '1', description: 'Morning prayers assistance', completed: false },
              { id: '2', description: 'Administer morning medications', completed: false },
              { id: '3', description: 'Prepare breakfast', completed: false }
            ]
          },
          { 
            id: '2', 
            careRecipientId: '1', 
            caregiverId: '12', 
            caregiverName: 'Dr. Sarah Goldstein', 
            caregiverPhoto: 'https://randomuser.me/api/portraits/women/52.jpg',
            caregiverRole: 'Primary Physician',
            startDateTime: new Date('2025-02-28T13:30:00'), 
            endDateTime: new Date('2025-02-28T14:30:00'), 
            duration: 60,
            type: 'Doctor Appointment',
            location: 'Mount Sinai Nephrology, Room 305',
            status: 'scheduled', 
            recurrence: 'monthly',
            color: '#FF5722',
            notes: 'Monthly nephrology checkup. Review dialysis efficacy and lab results.',
            tasks: [
              { id: '7', description: 'Bring medical history folder', completed: false },
              { id: '8', description: 'Bring list of current medications', completed: false }
            ]
          },
          { 
            id: '3', 
            careRecipientId: '1', 
            caregiverId: '9', 
            caregiverName: 'Ari Berkowitz', 
            caregiverPhoto: 'https://randomuser.me/api/portraits/men/64.jpg',
            caregiverRole: 'Son',
            startDateTime: new Date('2025-02-27T18:00:00'), 
            endDateTime: new Date('2025-02-27T20:00:00'), 
            duration: 120,
            type: 'Family Visit',
            location: 'Home',
            status: 'scheduled', 
            recurrence: 'none',
            color: '#2196F3',
            notes: 'Evening visit. Bringing dinner from Kosher Kitchen restaurant.',
            tasks: [
              { id: '11', description: 'Pick up dinner', completed: false },
              { id: '12', description: 'Evening medication reminder', completed: false }
            ]
          },
          { 
            id: '4', 
            careRecipientId: '1', 
            caregiverId: '11', 
            caregiverName: 'Leoman Gonzales', 
            caregiverPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
            caregiverRole: 'Professional Aide',
            startDateTime: new Date('2025-02-26T08:00:00'), 
            endDateTime: new Date('2025-02-26T09:30:00'), 
            duration: 90,
            type: 'Dialysis Treatment',
            location: 'Mount Sinai Dialysis Center',
            status: 'completed', 
            recurrence: 'MWF',
            color: '#9C27B0',
            notes: 'Transportation to dialysis center. Ensure all dialysis supplies are packed.',
            tasks: [
              { id: '14', description: 'Morning medications', completed: true },
              { id: '15', description: 'Pack dialysis bag', completed: true }
            ]
          },
          {
            id: '5',
            careRecipientId: '1',
            caregiverId: '3',
            caregiverName: 'Chaya Berkowitz',
            caregiverPhoto: 'https://randomuser.me/api/portraits/women/45.jpg',
            caregiverRole: 'Daughter',
            startDateTime: new Date('2025-02-26T16:00:00'),
            endDateTime: new Date('2025-02-26T18:00:00'),
            duration: 120,
            type: 'Family Visit',
            location: 'Home',
            status: 'completed',
            recurrence: 'none',
            color: '#2196F3',
            notes: 'Afternoon visit. Bringing special kosher meal and grandchildren.',
            tasks: [
              { id: '18', description: 'Bring kosher dinner', completed: true },
              { id: '19', description: 'Help with medication', completed: true }
            ]
          },
          {
            id: '6',
            careRecipientId: '1',
            caregiverId: '0',
            caregiverName: 'Kosher Meals on Wheels',
            caregiverRole: 'Service Provider',
            startDateTime: new Date('2025-03-01T11:00:00'),
            endDateTime: new Date('2025-03-01T11:15:00'),
            duration: 15,
            type: 'Meal Delivery',
            location: 'Home',
            status: 'scheduled',
            recurrence: 'weekly',
            color: '#FFC107',
            notes: 'Friday delivery of Shabbat meals for the weekend.',
            tasks: [
              { id: '21', description: 'Receive delivery', completed: false },
              { id: '22', description: 'Store meals properly', completed: false }
            ]
          },
          {
            id: '7',
            careRecipientId: '1',
            caregiverId: '7',
            caregiverName: 'Rena Berkowitz',
            caregiverPhoto: 'https://randomuser.me/api/portraits/women/26.jpg',
            caregiverRole: 'Daughter',
            startDateTime: new Date('2025-03-01T14:00:00'),
            endDateTime: new Date('2025-03-01T18:00:00'),
            duration: 240,
            type: 'Shabbat Visit',
            location: 'Home',
            status: 'scheduled',
            recurrence: 'weekly',
            color: '#673AB7',
            notes: 'Shabbat afternoon visit. Will read and spend time together.',
            tasks: [
              { id: '23', description: 'Help with Shabbat observance', completed: false },
              { id: '24', description: 'Afternoon reading', completed: false }
            ]
          },
          {
            id: '8',
            careRecipientId: '1',
            caregiverId: '13',
            caregiverName: 'Pharmacy Delivery',
            caregiverRole: 'Service Provider',
            startDateTime: new Date('2025-03-02T10:00:00'),
            endDateTime: new Date('2025-03-02T10:15:00'),
            duration: 15,
            type: 'Medication Delivery',
            location: 'Home',
            status: 'scheduled',
            recurrence: 'monthly',
            color: '#E91E63',
            notes: 'Monthly medication refill delivery from Boro Park Pharmacy.',
            tasks: [
              { id: '25', description: 'Receive delivery', completed: false },
              { id: '26', description: 'Check medications against list', completed: false }
            ]
          }
        ];
        
        // Add same-day dialysis appointments
        const today = new Date();
        const dialysisAppointments = [];
        for (let i = 0; i < 3; i++) {
          const appointmentDate = new Date(today);
          appointmentDate.setDate(today.getDate() + (i * 2)); // Every other day
          appointmentDate.setHours(9, 0, 0, 0);
          
          const endDate = new Date(appointmentDate);
          endDate.setHours(13, 0, 0, 0);
          
          dialysisAppointments.push({
            id: `dialysis-${i}`,
            careRecipientId: '1',
            caregiverId: '11',
            caregiverName: 'Leoman Gonzales',
            caregiverPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
            caregiverRole: 'Professional Aide',
            startDateTime: appointmentDate,
            endDateTime: endDate,
            duration: 240,
            type: 'Dialysis Treatment',
            location: 'Mount Sinai Dialysis Center',
            status: 'scheduled',
            recurrence: 'MWF',
            color: '#9C27B0',
            notes: 'Regular dialysis session. Duration: 4 hours.'
          });
        }
        
        setVisits([...fetchedVisits, ...dialysisAppointments]);
        
        // Fetch caregivers
        setCaregivers([
          { 
            id: '1', 
            name: 'Leah Berkowitz', 
            role: 'Wife', 
            photo: 'https://randomuser.me/api/portraits/women/67.jpg',
            email: 'leah@example.com',
            phone: '555-111-2222'
          },
          { 
            id: '2', 
            name: 'Mayor Berkowitz', 
            role: 'Son', 
            photo: 'https://randomuser.me/api/portraits/men/32.jpg',
            email: 'mayor@example.com',
            phone: '555-333-4444'
          },
          { 
            id: '3', 
            name: 'Chaya Berkowitz', 
            role: 'Daughter', 
            photo: 'https://randomuser.me/api/portraits/women/45.jpg',
            email: 'chaya@example.com',
            phone: '555-444-5555'
          },
          { 
            id: '7', 
            name: 'Rena Berkowitz', 
            role: 'Daughter', 
            photo: 'https://randomuser.me/api/portraits/women/26.jpg',
            email: 'rena@example.com',
            phone: '555-123-1234'
          },
          { 
            id: '9', 
            name: 'Ari Berkowitz', 
            role: 'Son', 
            photo: 'https://randomuser.me/api/portraits/men/64.jpg',
            email: 'ari@example.com',
            phone: '555-555-6666'
          },
          { 
            id: '11', 
            name: 'Leoman Gonzales', 
            role: 'Professional Aide', 
            photo: 'https://randomuser.me/api/portraits/men/12.jpg',
            email: 'leoman@example.com',
            phone: '555-987-9876'
          },
          { 
            id: '12', 
            name: 'Dr. Sarah Goldstein', 
            role: 'Primary Physician', 
            photo: 'https://randomuser.me/api/portraits/women/52.jpg',
            email: 'dr.goldstein@example.com',
            phone: '555-222-3333'
          },
          {
            id: '0',
            name: 'Kosher Meals on Wheels',
            role: 'Service Provider',
            photo: '',
            email: 'meals@example.com',
            phone: '555-111-5555'
          },
          {
            id: '13',
            name: 'Pharmacy Delivery',
            role: 'Service Provider',
            photo: '',
            email: 'pharmacy@example.com',
            phone: '555-333-7777'
          }
        ]);
        
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Convert visits to FullCalendar events format
  const calendarEvents = visits.map(visit => ({
    id: visit.id,
    title: visit.type,
    start: visit.startDateTime,
    end: visit.endDateTime,
    backgroundColor: visit.color,
    borderColor: visit.color,
    textColor: '#ffffff',
    extendedProps: {
      ...visit
    }
  }));
  
  // Handle input change for form
  const handleInputChange = (name, value) => {
    setNewVisit({
      ...newVisit,
      [name]: value
    });
    
    // Update form validation
    validateForm({
      ...newVisit,
      [name]: value
    });
  };
  
  // Form validation
  const validateForm = (formData) => {
    const errors = {};
    let isValid = true;
    
    if (!formData.caregiverId) {
      errors.caregiverId = 'Please select a caregiver';
      isValid = false;
    }
    
    if (!formData.type) {
      errors.type = 'Please select a visit type';
      isValid = false;
    }
    
    if (!formData.startDateTime) {
      errors.startDateTime = 'Please select a start date and time';
      isValid = false;
    }
    
    if (!formData.endDateTime) {
      errors.endDateTime = 'Please select an end date and time';
      isValid = false;
    } else if (formData.endDateTime <= formData.startDateTime) {
      errors.endDateTime = 'End time must be after start time';
      isValid = false;
    }
    
    if (!formData.location) {
      errors.location = 'Please enter a location';
      isValid = false;
    }
    
    setFormError(errors);
    setFormValid(isValid);
    
    return isValid;
  };
  
  // Handle caregiver select
  const handleCaregiverSelect = (caregiverId) => {
    const caregiver = caregivers.find(cg => cg.id === caregiverId);
    
    if (caregiver) {
      setNewVisit({
        ...newVisit,
        caregiverId,
        caregiverName: caregiver.name,
        caregiverPhoto: caregiver.photo || '',
        caregiverRole: caregiver.role
      });
      
      // Update form validation
      validateForm({
        ...newVisit,
        caregiverId,
        caregiverName: caregiver.name
      });
    }
  };
  
  // Handle visit type select
  const handleVisitTypeSelect = (type) => {
    const visitType = visitTypes.find(vt => vt.value === type);
    
    if (visitType) {
      setNewVisit({
        ...newVisit,
        type,
        color: visitType.color
      });
      
      // Update form validation
      validateForm({
        ...newVisit,
        type,
        color: visitType.color
      });
    }
  };
  
  // Calculate duration between start and end dates
  const calculateDuration = (start, end) => {
    const diffMs = end - start;
    return Math.round(diffMs / (1000 * 60));
  };
  
  // Handle start date change
  const handleStartDateChange = (date) => {
    const endDate = new Date(date);
    endDate.setMinutes(endDate.getMinutes() + newVisit.duration);
    
    setNewVisit({
      ...newVisit,
      startDateTime: date,
      endDateTime: endDate
    });
    
    // Update form validation
    validateForm({
      ...newVisit,
      startDateTime: date,
      endDateTime: endDate
    });
  };
  
  // Handle end date change
  const handleEndDateChange = (date) => {
    // Calculate new duration
    const durationMins = calculateDuration(newVisit.startDateTime, date);
    
    setNewVisit({
      ...newVisit,
      endDateTime: date,
      duration: durationMins
    });
    
    // Update form validation
    validateForm({
      ...newVisit,
      endDateTime: date,
      duration: durationMins
    });
  };
  
  // Handle dialog open
  const handleOpenDialog = (mode = 'add', visit = null) => {
    if (mode === 'edit' && visit) {
      setNewVisit({
        ...visit,
        startDateTime: new Date(visit.startDateTime),
        endDateTime: new Date(visit.endDateTime)
      });
      setEditingVisit(visit.id);
    } else {
      // Reset form for new visit
      setNewVisit({
        caregiverId: '',
        caregiverName: '',
        caregiverPhoto: '',
        caregiverRole: '',
        startDateTime: new Date(),
        endDateTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        duration: 60,
        type: 'Regular Visit',
        location: 'Home',
        status: 'scheduled',
        recurrence: 'none',
        notes: '',
        color: '#4CAF50'
      });
      setEditingVisit(null);
    }
    
    setDialogMode(mode);
    setOpenDialog(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewVisit({
      caregiverId: '',
      caregiverName: '',
      caregiverPhoto: '',
      caregiverRole: '',
      startDateTime: new Date(),
      endDateTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      duration: 60,
      type: 'Regular Visit',
      location: 'Home',
      status: 'scheduled',
      recurrence: 'none',
      notes: '',
      color: '#4CAF50'
    });
    setEditingVisit(null);
    setFormError({});
  };
  
  // Handle add visit
  const handleAddVisit = () => {
    if (!validateForm(newVisit)) return;
    
    if (dialogMode === 'edit') {
      // Update existing visit
      const updatedVisits = visits.map(visit => 
        visit.id === editingVisit ? {...newVisit, id: editingVisit} : visit
      );
      setVisits(updatedVisits);
    } else {
      // Add new visit
      const visit = {
        id: Date.now().toString(),
        ...newVisit
      };
      setVisits([...visits, visit]);
    }
    
    handleCloseDialog();
  };
  
  // Handle delete visit
  const handleDeleteVisit = (id) => {
    setVisits(visits.filter(visit => visit.id !== id));
    setDeleteConfirmOpen(false);
    setActionsMenuAnchor(null);
    setActiveVisit(null);
  };
  
  // Handle calendar date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  };
  
  // Handle calendar view change
  const handleViewChange = (event, newView) => {
    setViewMode(newView);
  };
  
  // Handle actions menu open
  const handleActionsMenuOpen = (event, visit) => {
    event.stopPropagation();
    setActionsMenuAnchor(event.currentTarget);
    setActiveVisit(visit);
  };
  
  // Handle actions menu close
  const handleActionsMenuClose = () => {
    setActionsMenuAnchor(null);
    setActiveVisit(null);
  };
  
  // Handle calendar event click
  const handleEventClick = (info) => {
    const visit = info.event.extendedProps;
    setActiveVisit(visit);
    handleOpenDialog('edit', visit);
  };
  
  // Handle calendar date select
  const handleDateSelect = (info) => {
    const startDate = new Date(info.start);
    const endDate = new Date(info.end || info.start);
    
    if (!info.end) {
      // If no end date is selected, set it to 1 hour after start
      endDate.setHours(startDate.getHours() + 1);
    }
    
    setNewVisit({
      ...newVisit,
      startDateTime: startDate,
      endDateTime: endDate,
      duration: calculateDuration(startDate, endDate)
    });
    
    handleOpenDialog('add');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Format date and time for display
  const formatDateTime = (dateString) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        {/* Page heading */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" fontWeight="medium">
            Schedule & Appointments
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            New Visit
          </Button>
        </Box>
        
        {/* Tabs and Calendar Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TabContainer>
            <Tabs
              value={viewMode}
              onChange={handleViewChange}
              aria-label="calendar view mode"
              sx={{
                minHeight: 40,
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab 
                icon={<CalendarViewMonthIcon sx={{ fontSize: 20 }} />} 
                label="Month" 
                value="month" 
                sx={{ 
                  minHeight: 40,
                  borderRadius: 50,
                  minWidth: 'auto',
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  }
                }}
              />
              <Tab 
                icon={<CalendarViewWeekIcon sx={{ fontSize: 20 }} />} 
                label="Week" 
                value="week"
                sx={{ 
                  minHeight: 40,
                  borderRadius: 50,
                  minWidth: 'auto',
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  }
                }}
              />
              <Tab 
                icon={<CalendarViewDayIcon sx={{ fontSize: 20 }} />} 
                label="Day" 
                value="day" 
                sx={{ 
                  minHeight: 40,
                  borderRadius: 50,
                  minWidth: 'auto',
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  }
                }}
              />
              <Tab 
                icon={<ListAltIcon sx={{ fontSize: 20 }} />} 
                label="List" 
                value="list" 
                sx={{ 
                  minHeight: 40,
                  borderRadius: 50,
                  minWidth: 'auto',
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  }
                }}
              />
            </Tabs>
          </TabContainer>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              label="Go to Date"
              type="date"
              size="small"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </Box>
        
        {/* Calendar or List View */}
        <StyledCard>
          <CardContent sx={{ p: 0, flexGrow: 1 }}>
            {loading ? (
              <Box sx={{ p: 4 }}>
                <LinearProgress />
                <Typography sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">
                  Loading schedule...
                </Typography>
              </Box>
            ) : viewMode === 'list' ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="visits table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Caregiver</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visits
                      .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
                      .map(visit => (
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
                            <Typography variant="body2">{formatDate(visit.startDateTime)}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatTime(visit.startDateTime)} - {formatTime(visit.endDateTime)}
                            </Typography>
                            {visit.recurrence !== 'none' && (
                              <Chip 
                                icon={<RepeatIcon />} 
                                label={visit.recurrence}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5, height: 20, fontSize: '0.6rem' }}
                              />
                            )}
                          </TableCell>
                          <TableCell>{visit.duration} min</TableCell>
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
                              <Box>
                                <Typography variant="body2">{visit.caregiverName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {visit.caregiverRole}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {visit.notes}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={visit.status.charAt(0).toUpperCase() + visit.status.slice(1)} 
                              size="small" 
                              color={visit.status === 'completed' ? 'success' : 'primary'}
                              variant={visit.status === 'completed' ? 'filled' : 'outlined'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleActionsMenuOpen(e, visit)}
                              aria-label="actions"
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ height: 700, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ p: 4, borderRadius: 2, textAlign: 'center', width: '100%', maxWidth: 600 }}
                >
                  <CalendarViewMonthIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Calendar View Temporarily Unavailable
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Please use the List view to see all scheduled visits and appointments.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => setViewMode('list')}
                    startIcon={<ListAltIcon />}
                  >
                    Switch to List View
                  </Button>
                </Paper>
              </Box>
            )}
          </CardContent>
        </StyledCard>
      </Box>
      
      {/* Add/Edit Visit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pb: 1 }}>
          {dialogMode === 'add' ? 'Schedule New Visit' : 'Edit Visit'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formError.caregiverId}>
                <InputLabel id="caregiver-label">Caregiver / Service Provider</InputLabel>
                <Select
                  labelId="caregiver-label"
                  id="caregiver"
                  value={newVisit.caregiverId}
                  label="Caregiver / Service Provider"
                  onChange={(e) => handleCaregiverSelect(e.target.value)}
                  required
                >
                  {caregivers.map(cg => (
                    <MenuItem key={cg.id} value={cg.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {cg.photo ? (
                          <Avatar 
                            src={cg.photo} 
                            alt={cg.name}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                        ) : (
                          <Avatar 
                            sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }} 
                          >
                            {cg.name.charAt(0)}
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="body2">{cg.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cg.role}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formError.type}>
                <InputLabel id="visit-type-label">Visit Type</InputLabel>
                <Select
                  labelId="visit-type-label"
                  id="visit-type"
                  value={newVisit.type}
                  label="Visit Type"
                  onChange={(e) => handleVisitTypeSelect(e.target.value)}
                  required
                  renderValue={(selected) => {
                    const visitType = visitTypes.find(vt => vt.value === selected);
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: visitType ? visitType.color : '#ccc',
                            mr: 1.5
                          }} 
                        />
                        {selected}
                      </Box>
                    );
                  }}
                >
                  {visitTypes.map(vt => (
                    <MenuItem key={vt.value} value={vt.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: vt.color,
                            mr: 1.5
                          }} 
                        />
                        {vt.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                required
                error={!!formError.startDateTime}
                helperText={formError.startDateTime}
                value={newVisit.startDateTime.toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const currentTime = newVisit.startDateTime;
                  date.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
                  handleStartDateChange(date);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                required
                sx={{ mt: 2 }}
                value={`${String(newVisit.startDateTime.getHours()).padStart(2, '0')}:${String(newVisit.startDateTime.getMinutes()).padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const date = new Date(newVisit.startDateTime);
                  date.setHours(hours, minutes, 0, 0);
                  handleStartDateChange(date);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                required
                error={!!formError.endDateTime}
                helperText={formError.endDateTime}
                value={newVisit.endDateTime.toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const currentTime = newVisit.endDateTime;
                  date.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
                  handleEndDateChange(date);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Time"
                type="time"
                fullWidth
                required
                sx={{ mt: 2 }}
                value={`${String(newVisit.endDateTime.getHours()).padStart(2, '0')}:${String(newVisit.endDateTime.getMinutes()).padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const date = new Date(newVisit.endDateTime);
                  date.setHours(hours, minutes, 0, 0);
                  handleEndDateChange(date);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                id="location"
                label="Location"
                fullWidth
                value={newVisit.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                error={!!formError.location}
                helperText={formError.location}
                InputProps={{
                  startAdornment: (
                    <LocationOnIcon 
                      color="action" 
                      sx={{ mr: 1, fontSize: 20 }} 
                    />
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="recurrence-label">Recurrence</InputLabel>
                <Select
                  labelId="recurrence-label"
                  id="recurrence"
                  value={newVisit.recurrence}
                  label="Recurrence"
                  onChange={(e) => handleInputChange('recurrence', e.target.value)}
                  startAdornment={
                    <RepeatIcon color="action" sx={{ ml: 0.5, mr: 1, fontSize: 20 }} />
                  }
                >
                  <MenuItem value="none">None (one-time)</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Bi-weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="MWF">Monday, Wednesday, Friday</MenuItem>
                  <MenuItem value="TTh">Tuesday, Thursday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                id="notes"
                label="Notes"
                fullWidth
                multiline
                rows={3}
                value={newVisit.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <NotesIcon 
                      color="action" 
                      sx={{ mr: 1, mt: 1, fontSize: 20 }} 
                    />
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddVisit}
            disabled={!formValid}
          >
            {dialogMode === 'add' ? 'Schedule Visit' : 'Update Visit'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Visit?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this visit? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteVisit(activeVisit?.id)} 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Actions Menu */}
      <Menu
        id="actions-menu"
        anchorEl={actionsMenuAnchor}
        open={Boolean(actionsMenuAnchor)}
        onClose={handleActionsMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          handleOpenDialog('edit', activeVisit);
          handleActionsMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Edit Visit</Typography>
        </MenuItem>
        {activeVisit?.status !== 'completed' && (
          <MenuItem onClick={() => {
            // Mark as completed
            const updatedVisits = visits.map(visit => 
              visit.id === activeVisit.id ? {...visit, status: 'completed'} : visit
            );
            setVisits(updatedVisits);
            handleActionsMenuClose();
          }}>
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Mark as Completed</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          setDeleteConfirmOpen(true);
          handleActionsMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" color="error">Delete Visit</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default SchedulePage;