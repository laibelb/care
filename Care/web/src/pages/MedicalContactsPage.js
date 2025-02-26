import React, { useState } from 'react';
import '../styles/MedicalContactsPage.css';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Alert,
  Snackbar
} from '@mui/material';
import Header from '../components/Header';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

function MedicalContactsPage() {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openAddContactDialog, setOpenAddContactDialog] = useState(false);
  const [openEditContactDialog, setOpenEditContactDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openViewAppointmentsDialog, setOpenViewAppointmentsDialog] = useState(false);
  const [openViewNotesDialog, setOpenViewNotesDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    organization: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Mock medical contacts data
  const [medicalContacts, setMedicalContacts] = useState([
    {
      id: 1,
      firstName: 'Dr. Daniel',
      lastName: 'Goldstein',
      specialty: 'nephrology',
      organization: 'City Kidney Center',
      phone: '(555) 123-4567',
      email: 'daniel.goldstein@citykidney.com',
      address: '123 Medical Plaza, Suite 400, New York, NY 10001',
      isFavorite: true,
      lastVisit: '2025-01-15',
      nextAppointment: '2025-03-10',
      appointments: [
        { id: 1, date: '2025-03-10', time: '10:00 AM', purpose: 'Quarterly check-up', notes: 'Bring latest lab results' },
        { id: 2, date: '2025-01-15', time: '9:30 AM', purpose: 'Follow-up', notes: 'Discussed medication adjustments' },
        { id: 3, date: '2024-10-22', time: '11:00 AM', purpose: 'Consultation', notes: 'Initial dialysis assessment' }
      ],
      notes: [
        { id: 1, date: '2025-01-15', content: 'Patient showing good response to current treatment plan. Adjusted phosphate binder dosage.' },
        { id: 2, date: '2024-10-22', content: 'Initial consultation. Recommended starting dialysis treatment 3 times weekly.' }
      ],
      img: 'https://randomuser.me/api/portraits/men/31.jpg'
    },
    {
      id: 2,
      firstName: 'Dr. Rebecca',
      lastName: 'Chen',
      specialty: 'cardiology',
      organization: 'Heart & Vascular Institute',
      phone: '(555) 234-5678',
      email: 'rebecca.chen@heartinstitute.org',
      address: '456 Health Boulevard, New York, NY 10016',
      isFavorite: true,
      lastVisit: '2024-12-05',
      nextAppointment: '2025-03-15',
      appointments: [
        { id: 4, date: '2025-03-15', time: '2:00 PM', purpose: 'Regular check-up', notes: '' },
        { id: 5, date: '2024-12-05', time: '3:30 PM', purpose: 'Follow-up', notes: 'Reviewed EKG results' }
      ],
      notes: [
        { id: 3, date: '2024-12-05', content: 'EKG shows normal rhythm. Blood pressure within acceptable range for dialysis patient. Continue current medication.' }
      ],
      img: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    {
      id: 3,
      firstName: 'Dr. Michael',
      lastName: 'Johnson',
      specialty: 'primary',
      organization: 'Community Family Practice',
      phone: '(555) 345-6789',
      email: 'mjohnson@communityfp.com',
      address: '789 Main Street, Suite 200, New York, NY 10025',
      isFavorite: false,
      lastVisit: '2024-11-10',
      nextAppointment: '2025-05-12',
      appointments: [
        { id: 6, date: '2025-05-12', time: '9:00 AM', purpose: 'Annual physical', notes: 'Fasting required for blood work' },
        { id: 7, date: '2024-11-10', time: '10:30 AM', purpose: 'Follow-up', notes: 'Discussed specialist referrals' }
      ],
      notes: [
        { id: 4, date: '2024-11-10', content: 'Patient reports fatigue after dialysis sessions. Recommended coordination with nephrology for possible adjustment to treatment plan.' }
      ],
      img: 'https://randomuser.me/api/portraits/men/52.jpg'
    },
    {
      id: 4,
      firstName: 'Dr. Sarah',
      lastName: 'Klein',
      specialty: 'endocrinology',
      organization: 'Diabetes & Endocrine Center',
      phone: '(555) 456-7890',
      email: 'sklein@endocrine.org',
      address: '321 Specialist Way, New York, NY 10019',
      isFavorite: false,
      lastVisit: '2024-09-20',
      nextAppointment: null,
      appointments: [
        { id: 8, date: '2024-09-20', time: '1:15 PM', purpose: 'Consultation', notes: 'Discussed diabetes management during dialysis' }
      ],
      notes: [
        { id: 5, date: '2024-09-20', content: 'Patient\'s blood glucose levels are stable. Adjusted insulin schedule to coordinate with dialysis sessions.' }
      ],
      img: 'https://randomuser.me/api/portraits/women/41.jpg'
    },
    {
      id: 5,
      firstName: 'Rachel',
      lastName: 'Brown',
      specialty: 'dialysis',
      organization: 'New York Dialysis Center',
      phone: '(555) 567-8901',
      email: 'rachel.brown@nydialysis.com',
      address: '555 Treatment Drive, New York, NY 10001',
      isFavorite: true,
      lastVisit: '2025-02-19',
      nextAppointment: '2025-02-26',
      appointments: [
        { id: 9, date: '2025-02-26', time: '1:00 PM', purpose: 'Dialysis session', notes: '' },
        { id: 10, date: '2025-02-19', time: '1:00 PM', purpose: 'Dialysis session', notes: '' },
        { id: 11, date: '2025-02-12', time: '1:00 PM', purpose: 'Dialysis session', notes: '' }
      ],
      notes: [
        { id: 6, date: '2025-02-19', content: 'Patient tolerated treatment well. No complications reported.' }
      ],
      img: 'https://randomuser.me/api/portraits/women/25.jpg'
    }
  ]);

  // Mock facilities data
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: 'New York Dialysis Center',
      type: 'dialysis',
      address: '555 Treatment Drive, New York, NY 10001',
      phone: '(555) 901-2345',
      email: 'info@nydialysis.com',
      website: 'www.nydialysis.com',
      notes: 'Primary dialysis treatment center. Open Monday-Saturday 7AM-7PM.',
      lastVisit: '2025-02-19',
      nextAppointment: '2025-02-26'
    },
    {
      id: 2,
      name: 'City Kidney Center',
      type: 'specialty',
      address: '123 Medical Plaza, New York, NY 10001',
      phone: '(555) 123-9876',
      email: 'contact@citykidney.com',
      website: 'www.citykidney.com',
      notes: 'Nephrology specialist practice. Dr. Goldstein\'s office is on the 4th floor.',
      lastVisit: '2025-01-15',
      nextAppointment: '2025-03-10'
    },
    {
      id: 3,
      name: 'Heart & Vascular Institute',
      type: 'specialty',
      address: '456 Health Boulevard, New York, NY 10016',
      phone: '(555) 234-8765',
      email: 'appointments@heartinstitute.org',
      website: 'www.heartinstitute.org',
      notes: 'Cardiology practice. Parking available in the structure across the street.',
      lastVisit: '2024-12-05',
      nextAppointment: '2025-03-15'
    },
    {
      id: 4,
      name: 'Community Family Practice',
      type: 'primary',
      address: '789 Main Street, Suite 200, New York, NY 10025',
      phone: '(555) 345-7654',
      email: 'info@communityfp.com',
      website: 'www.communityfp.com',
      notes: 'Primary care practice. Request prescription refills at least 3 days in advance.',
      lastVisit: '2024-11-10',
      nextAppointment: '2025-05-12'
    },
    {
      id: 5,
      name: 'Metropolitan Hospital',
      type: 'hospital',
      address: '100 Hospital Circle, New York, NY 10029',
      phone: '(555) 777-8000',
      email: 'info@metrohosp.org',
      website: 'www.metrohosp.org',
      notes: 'Emergency care and inpatient services. Nephrology department is on the 5th floor.',
      lastVisit: '2024-08-03',
      nextAppointment: null
    }
  ]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Menu handlers
  const handleMenuOpen = (event, contact) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  // Dialog handlers
  const handleAddContactOpen = () => {
    setContactForm({
      firstName: '',
      lastName: '',
      specialty: 'primary',
      organization: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    });
    setOpenAddContactDialog(true);
  };

  const handleAddContactClose = () => {
    setOpenAddContactDialog(false);
  };

  const handleEditContactOpen = () => {
    if (selectedContact) {
      setContactForm({
        firstName: selectedContact.firstName,
        lastName: selectedContact.lastName,
        specialty: selectedContact.specialty,
        organization: selectedContact.organization,
        phone: selectedContact.phone,
        email: selectedContact.email,
        address: selectedContact.address,
        notes: ''
      });
      setOpenEditContactDialog(true);
      handleMenuClose();
    }
  };

  const handleEditContactClose = () => {
    setOpenEditContactDialog(false);
  };

  const handleDeleteOpen = () => {
    if (selectedContact) {
      setOpenDeleteConfirmDialog(true);
      handleMenuClose();
    }
  };

  const handleDeleteClose = () => {
    setOpenDeleteConfirmDialog(false);
  };

  const handleViewAppointmentsOpen = () => {
    if (selectedContact) {
      setOpenViewAppointmentsDialog(true);
      handleMenuClose();
    }
  };

  const handleViewAppointmentsClose = () => {
    setOpenViewAppointmentsDialog(false);
  };

  const handleViewNotesOpen = () => {
    if (selectedContact) {
      setOpenViewNotesDialog(true);
      handleMenuClose();
    }
  };

  const handleViewNotesClose = () => {
    setOpenViewNotesDialog(false);
  };

  // Contact Action handlers
  const handleAddContact = () => {
    const newContact = {
      id: medicalContacts.length + 1,
      firstName: contactForm.firstName,
      lastName: contactForm.lastName,
      specialty: contactForm.specialty,
      organization: contactForm.organization,
      phone: contactForm.phone,
      email: contactForm.email,
      address: contactForm.address,
      isFavorite: false,
      lastVisit: null,
      nextAppointment: null,
      appointments: [],
      notes: contactForm.notes ? [
        { id: 1, date: new Date().toISOString().split('T')[0], content: contactForm.notes }
      ] : [],
      img: 'https://randomuser.me/api/portraits/lego/1.jpg' // Default image
    };
    
    setMedicalContacts([...medicalContacts, newContact]);
    showSnackbar(`${newContact.firstName} ${newContact.lastName} has been added to your contacts.`, 'success');
    handleAddContactClose();
  };

  const handleEditContact = () => {
    if (selectedContact) {
      const updatedContacts = medicalContacts.map(contact => 
        contact.id === selectedContact.id
          ? { 
              ...contact, 
              firstName: contactForm.firstName,
              lastName: contactForm.lastName,
              specialty: contactForm.specialty,
              organization: contactForm.organization,
              phone: contactForm.phone,
              email: contactForm.email,
              address: contactForm.address,
            }
          : contact
      );
      
      setMedicalContacts(updatedContacts);
      showSnackbar(`${contactForm.firstName} ${contactForm.lastName}\'s information has been updated.`, 'success');
      handleEditContactClose();
    }
  };

  const handleDeleteContact = () => {
    if (selectedContact) {
      const updatedContacts = medicalContacts.filter(contact => contact.id !== selectedContact.id);
      setMedicalContacts(updatedContacts);
      showSnackbar(`${selectedContact.firstName} ${selectedContact.lastName} has been removed from your contacts.`, 'success');
      handleDeleteClose();
    }
  };

  const handleToggleFavorite = (contactId) => {
    const updatedContacts = medicalContacts.map(contact =>
      contact.id === contactId ? { ...contact, isFavorite: !contact.isFavorite } : contact
    );
    
    setMedicalContacts(updatedContacts);
    const contact = updatedContacts.find(c => c.id === contactId);
    
    if (contact) {
      showSnackbar(
        contact.isFavorite 
          ? `${contact.firstName} ${contact.lastName} added to favorites.`
          : `${contact.firstName} ${contact.lastName} removed from favorites.`,
        'success'
      );
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

  // Filter and search handlers
  const getFilteredContacts = () => {
    return medicalContacts.filter(contact => {
      const matchesSearch = 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery);
        
      const matchesFilter = filterSpecialty === 'all' || contact.specialty === filterSpecialty;
      
      return matchesSearch && matchesFilter;
    });
  };

  const getFilteredFacilities = () => {
    return facilities.filter(facility => {
      const matchesSearch = 
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.phone.includes(searchQuery);
        
      return matchesSearch;
    });
  };

  // Specialty text and icon mapping
  const getSpecialtyData = (specialty) => {
    switch (specialty) {
      case 'nephrology':
        return { 
          text: 'Nephrology', 
          color: 'primary',
          icon: <LocalHospitalIcon sx={{ color: '#2196f3' }} />
        };
      case 'cardiology':
        return { 
          text: 'Cardiology', 
          color: 'error',
          icon: <LocalHospitalIcon sx={{ color: '#f44336' }} />
        };
      case 'primary':
        return { 
          text: 'Primary Care', 
          color: 'success',
          icon: <MedicalServicesIcon sx={{ color: '#4caf50' }} />
        };
      case 'dialysis':
        return { 
          text: 'Dialysis Specialist', 
          color: 'warning',
          icon: <LocalHospitalIcon sx={{ color: '#ff9800' }} />
        };
      case 'endocrinology':
        return { 
          text: 'Endocrinology', 
          color: 'info',
          icon: <LocalHospitalIcon sx={{ color: '#03a9f4' }} />
        };
      default:
        return { 
          text: 'Other Specialist', 
          color: 'default',
          icon: <LocalHospitalIcon sx={{ color: '#9e9e9e' }} />
        };
    }
  };

  // Facility type text and icon mapping
  const getFacilityTypeData = (type) => {
    switch (type) {
      case 'hospital':
        return { 
          text: 'Hospital', 
          color: 'error',
          icon: <LocalHospitalIcon sx={{ color: '#f44336' }} />
        };
      case 'dialysis':
        return { 
          text: 'Dialysis Center', 
          color: 'warning',
          icon: <MedicalServicesIcon sx={{ color: '#ff9800' }} />
        };
      case 'primary':
        return { 
          text: 'Primary Care', 
          color: 'success',
          icon: <HomeIcon sx={{ color: '#4caf50' }} />
        };
      case 'specialty':
        return { 
          text: 'Specialty Clinic', 
          color: 'primary',
          icon: <WorkIcon sx={{ color: '#2196f3' }} />
        };
      default:
        return { 
          text: 'Medical Facility', 
          color: 'default',
          icon: <LocationOnIcon sx={{ color: '#9e9e9e' }} />
        };
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Medical Contacts
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddContactOpen}
          >
            Add Contact
          </Button>
        </Box>
        
        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search contacts or facilities..."
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
                  <InputLabel id="specialty-filter-label">Filter by Specialty</InputLabel>
                  <Select
                    labelId="specialty-filter-label"
                    id="specialty-filter"
                    value={filterSpecialty}
                    label="Filter by Specialty"
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                  >
                    <MenuItem value="all">All Specialties</MenuItem>
                    <MenuItem value="nephrology">Nephrology</MenuItem>
                    <MenuItem value="cardiology">Cardiology</MenuItem>
                    <MenuItem value="primary">Primary Care</MenuItem>
                    <MenuItem value="dialysis">Dialysis Specialist</MenuItem>
                    <MenuItem value="endocrinology">Endocrinology</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tab Navigation */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="medical contacts tabs"
          >
            <Tab icon={<PersonIcon />} label="Medical Providers" />
            <Tab icon={<LocationOnIcon />} label="Facilities & Locations" />
          </Tabs>
        </Box>
        
        {/* Medical Providers Tab */}
        {tabValue === 0 && (
          <>
            {getFilteredContacts().length > 0 ? (
              <Grid container spacing={3}>
                {getFilteredContacts().map(contact => (
                  <Grid item xs={12} sm={6} md={4} key={contact.id}>
                    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flex: '1 0 auto', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleToggleFavorite(contact.id)}
                            color={contact.isFavorite ? 'warning' : 'default'}
                            sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                          >
                            {contact.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleMenuOpen(e, contact)}
                            sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={contact.img}
                            alt={`${contact.firstName} ${contact.lastName}`}
                            sx={{ width: 80, height: 80, mb: 1 }}
                          />
                          
                          <Typography variant="h6" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                            {contact.firstName} {contact.lastName}
                          </Typography>
                          
                          <Chip
                            icon={getSpecialtyData(contact.specialty).icon}
                            label={getSpecialtyData(contact.specialty).text}
                            color={getSpecialtyData(contact.specialty).color}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                            {contact.organization}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            {contact.phone}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            {contact.email}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.25, color: 'text.secondary' }} />
                            <span>{contact.address}</span>
                          </Typography>
                        </Box>
                        
                        {(contact.lastVisit || contact.nextAppointment) && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            
                            <Box>
                              {contact.lastVisit && (
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  Last visit: {contact.lastVisit}
                                </Typography>
                              )}
                              
                              {contact.nextAppointment && (
                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                  Next appointment: {contact.nextAppointment}
                                </Typography>
                              )}
                            </Box>
                          </>
                        )}
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1, bgcolor: 'action.hover' }}>
                        <Button 
                          size="small" 
                          startIcon={<PhoneIcon />}
                          onClick={() => showSnackbar(`Calling ${contact.firstName}...`, 'info')}
                        >
                          Call
                        </Button>
                        
                        <Button 
                          size="small" 
                          startIcon={<EmailIcon />}
                          onClick={() => showSnackbar(`Email to ${contact.firstName} opened`, 'info')}
                        >
                          Email
                        </Button>
                        
                        <Button 
                          size="small" 
                          startIcon={<EventNoteIcon />}
                          onClick={() => {
                            setSelectedContact(contact);
                            handleViewAppointmentsOpen();
                          }}
                          disabled={contact.appointments.length === 0}
                        >
                          History
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No medical contacts found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchQuery 
                    ? `No results matching "${searchQuery}"`
                    : "Add your doctors and healthcare providers to keep important contact information in one place."}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddContactOpen}
                >
                  Add Medical Contact
                </Button>
              </Paper>
            )}
          </>
        )}
        
        {/* Facilities Tab */}
        {tabValue === 1 && (
          <>
            {getFilteredFacilities().length > 0 ? (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {getFilteredFacilities().map((facility, index) => (
                  <React.Fragment key={facility.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemIcon>
                        {getFacilityTypeData(facility.type).icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="h6" component="span">
                              {facility.name}
                            </Typography>
                            <Chip 
                              label={getFacilityTypeData(facility.type).text} 
                              color={getFacilityTypeData(facility.type).color} 
                              size="small" 
                            />
                          </Box>
                        }
                        secondary={
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                {facility.address}
                              </Typography>
                              
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                {facility.phone}
                              </Typography>
                              
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                {facility.email}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              {facility.notes && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    mb: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    p: 1
                                  }}
                                >
                                  <ImportContactsIcon fontSize="small" sx={{ mr: 1, mt: 0.25, color: 'text.secondary' }} />
                                  {facility.notes}
                                </Typography>
                              )}
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                {facility.lastVisit && (
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    Last visit: {facility.lastVisit}
                                  </Typography>
                                )}
                                
                                {facility.nextAppointment && (
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                    Next: {facility.nextAppointment}
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        }
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<PhoneIcon />}
                          onClick={() => showSnackbar(`Calling ${facility.name}...`, 'info')}
                        >
                          Call
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<DescriptionIcon />}
                          onClick={() => showSnackbar(`Viewing documents for ${facility.name}...`, 'info')}
                        >
                          Docs
                        </Button>
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <LocationOnIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No facilities found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchQuery 
                    ? `No results matching "${searchQuery}"`
                    : "Add medical facilities like hospitals, clinics, and dialysis centers."}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => showSnackbar('Facility management coming soon!', 'info')}
                >
                  Add Facility
                </Button>
              </Paper>
            )}
          </>
        )}
        
        {/* Contact Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditContactOpen}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Contact</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={handleViewNotesOpen}
            disabled={!selectedContact || selectedContact.notes.length === 0}
          >
            <ListItemIcon>
              <DescriptionIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Notes</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={handleViewAppointmentsOpen}
            disabled={!selectedContact || selectedContact.appointments.length === 0}
          >
            <ListItemIcon>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Appointment History</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedContact) {
              handleToggleFavorite(selectedContact.id);
              handleMenuClose();
            }
          }}>
            <ListItemIcon>
              {selectedContact?.isFavorite ? 
                <StarBorderIcon fontSize="small" /> : 
                <StarIcon fontSize="small" color="warning" />
              }
            </ListItemIcon>
            <ListItemText>
              {selectedContact?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedContact) {
              window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedContact.address)}`);
              handleMenuClose();
            }
          }}>
            <ListItemIcon>
              <LocationOnIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Show on Map</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteOpen} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Remove Contact</ListItemText>
          </MenuItem>
        </Menu>
        
        {/* Add Contact Dialog */}
        <Dialog open={openAddContactDialog} onClose={handleAddContactClose} maxWidth="md" fullWidth>
          <DialogTitle>Add Medical Contact</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={contactForm.firstName}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={contactForm.lastName}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="specialty-label">Specialty</InputLabel>
                  <Select
                    labelId="specialty-label"
                    name="specialty"
                    value={contactForm.specialty}
                    label="Specialty"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="nephrology">Nephrology</MenuItem>
                    <MenuItem value="cardiology">Cardiology</MenuItem>
                    <MenuItem value="primary">Primary Care</MenuItem>
                    <MenuItem value="dialysis">Dialysis Specialist</MenuItem>
                    <MenuItem value="endocrinology">Endocrinology</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Organization/Practice"
                  name="organization"
                  value={contactForm.organization}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={contactForm.address}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={contactForm.notes}
                  onChange={handleFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  placeholder="Add any important information about this provider"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddContactClose}>Cancel</Button>
            <Button 
              onClick={handleAddContact} 
              variant="contained" 
              color="primary"
              disabled={!contactForm.firstName || !contactForm.lastName || !contactForm.phone}
            >
              Add Contact
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit Contact Dialog */}
        <Dialog open={openEditContactDialog} onClose={handleEditContactClose} maxWidth="md" fullWidth>
          <DialogTitle>Edit Medical Contact</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={contactForm.firstName}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={contactForm.lastName}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="edit-specialty-label">Specialty</InputLabel>
                  <Select
                    labelId="edit-specialty-label"
                    name="specialty"
                    value={contactForm.specialty}
                    label="Specialty"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="nephrology">Nephrology</MenuItem>
                    <MenuItem value="cardiology">Cardiology</MenuItem>
                    <MenuItem value="primary">Primary Care</MenuItem>
                    <MenuItem value="dialysis">Dialysis Specialist</MenuItem>
                    <MenuItem value="endocrinology">Endocrinology</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Organization/Practice"
                  name="organization"
                  value={contactForm.organization}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={contactForm.address}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="New Note"
                  name="notes"
                  value={contactForm.notes}
                  onChange={handleFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  placeholder="Add a new note about this provider (previous notes will be preserved)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditContactClose}>Cancel</Button>
            <Button 
              onClick={handleEditContact} 
              variant="contained" 
              color="primary"
              disabled={!contactForm.firstName || !contactForm.lastName || !contactForm.phone}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteClose}>
          <DialogTitle>Remove Medical Contact?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove {selectedContact?.firstName} {selectedContact?.lastName} from your contacts? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={handleDeleteContact} variant="contained" color="error">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* View Appointments Dialog */}
        <Dialog open={openViewAppointmentsDialog} onClose={handleViewAppointmentsClose} maxWidth="md" fullWidth>
          <DialogTitle>
            Appointment History with {selectedContact?.firstName} {selectedContact?.lastName}
          </DialogTitle>
          <DialogContent dividers>
            {selectedContact && selectedContact.appointments.length > 0 ? (
              <List>
                {selectedContact.appointments
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((appointment) => (
                    <ListItem key={appointment.id} alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemIcon>
                        <CalendarTodayIcon color={new Date(appointment.date) > new Date() ? 'primary' : 'action'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="body1" component="span" fontWeight="medium">
                              {appointment.date}
                            </Typography>
                            <Typography variant="body1" component="span">
                              {appointment.time}
                            </Typography>
                            {new Date(appointment.date) > new Date() && (
                              <Chip label="Upcoming" color="primary" size="small" />
                            )}
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <strong>Purpose:</strong> {appointment.purpose}
                            </Typography>
                            {appointment.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                <strong>Notes:</strong> {appointment.notes}
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))
                }
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CalendarTodayIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No appointment history available.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewAppointmentsClose}>Close</Button>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                handleViewAppointmentsClose();
                showSnackbar('Appointment scheduling coming soon!', 'info');
              }}
            >
              Schedule Appointment
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* View Notes Dialog */}
        <Dialog open={openViewNotesDialog} onClose={handleViewNotesClose} maxWidth="md" fullWidth>
          <DialogTitle>
            Notes for {selectedContact?.firstName} {selectedContact?.lastName}
          </DialogTitle>
          <DialogContent dividers>
            {selectedContact && selectedContact.notes.length > 0 ? (
              <List>
                {selectedContact.notes
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((note) => (
                    <ListItem key={note.id} alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemIcon>
                        <DescriptionIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            {note.date}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body1" 
                            component="div" 
                            sx={{ 
                              mt: 1,
                              p: 2,
                              bgcolor: 'background.default',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            {note.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                }
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No notes available.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewNotesClose}>Close</Button>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                handleViewNotesClose();
                showSnackbar('Note creation coming soon!', 'info');
              }}
            >
              Add Note
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Notification Snackbar */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default MedicalContactsPage;