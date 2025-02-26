import React, { useState } from 'react';
import '../styles/FamilyMembersPage.css';
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
  Paper,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Tooltip,
  Badge
} from '@mui/material';
import Header from '../components/Header';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';

// Styled Badge component for verified members
const VerifiedBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      content: '""',
    },
  },
}));

function FamilyMembersPage() {
  // State variables
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [openEditMemberDialog, setOpenEditMemberDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openViewTasksDialog, setOpenViewTasksDialog] = useState(false);
  const [memberForm, setMemberForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    relationship: '',
    notes: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Mock family member data
  const [familyMembers, setFamilyMembers] = useState([
    { 
      id: 1, 
      firstName: 'Sarah', 
      lastName: 'Berkowitz', 
      relationship: 'Daughter',
      email: 'sarah.b@example.com', 
      phone: '(555) 234-5678', 
      address: '456 Oak St, Chicago, IL 60601',
      role: 'caregiver',
      tasks: [
        { id: 1, title: 'Schedule doctor appointment', dueDate: '2025-03-05', status: 'pending' },
        { id: 2, title: 'Pick up medication', dueDate: '2025-02-28', status: 'completed' },
      ],
      notifications: true,
      lastActive: '1 hour ago',
      verified: true,
      img: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    { 
      id: 2, 
      firstName: 'David', 
      lastName: 'Berkowitz', 
      relationship: 'Son',
      email: 'david.b@example.com', 
      phone: '(555) 345-6789', 
      address: '789 Pine St, New York, NY 10001',
      role: 'family',
      tasks: [
        { id: 3, title: 'Weekly visit', dueDate: '2025-03-01', status: 'pending' },
      ],
      notifications: true,
      lastActive: '2 days ago',
      verified: true,
      img: 'https://randomuser.me/api/portraits/men/42.jpg'
    },
    { 
      id: 3, 
      firstName: 'Rachel', 
      lastName: 'Goldstein', 
      relationship: 'Niece',
      email: 'rachel.g@example.com', 
      phone: '(555) 456-7890', 
      address: '321 Maple Ave, Boston, MA 02115',
      role: 'emergency',
      tasks: [],
      notifications: false,
      lastActive: '3 days ago',
      verified: false,
      img: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    { 
      id: 4, 
      firstName: 'Michael', 
      lastName: 'Berkowitz', 
      relationship: 'Grandson',
      email: 'michael.b@example.com', 
      phone: '(555) 567-8901', 
      address: '654 Cedar Rd, Chicago, IL 60601',
      role: 'family',
      tasks: [],
      notifications: true,
      lastActive: '1 week ago',
      verified: true,
      img: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    { 
      id: 5, 
      firstName: 'Rebecca', 
      lastName: 'Cohen', 
      relationship: 'Sister-in-law',
      email: 'rebecca.c@example.com', 
      phone: '(555) 678-9012', 
      address: '987 Birch Blvd, Miami, FL 33101',
      role: 'family',
      tasks: [],
      notifications: false,
      lastActive: '2 weeks ago',
      verified: false,
      img: 'https://randomuser.me/api/portraits/women/63.jpg'
    },
  ]);

  // Mock care tasks
  const [careTasks, setCareTasks] = useState([
    { 
      id: 1, 
      title: 'Schedule doctor appointment', 
      dueDate: '2025-03-05', 
      status: 'pending',
      assignedTo: 1,
      notes: 'Nephrology follow-up appointment needed' 
    },
    { 
      id: 2, 
      title: 'Pick up medication', 
      dueDate: '2025-02-28', 
      status: 'completed',
      assignedTo: 1,
      notes: 'From CVS Pharmacy on Main St' 
    },
    { 
      id: 3, 
      title: 'Weekly visit', 
      dueDate: '2025-03-01', 
      status: 'pending',
      assignedTo: 2,
      notes: 'Bring groceries for the week' 
    },
    { 
      id: 4, 
      title: 'Drive to dialysis center', 
      dueDate: '2025-03-03', 
      status: 'pending',
      assignedTo: null,
      notes: 'Appointment is at 10:00 AM' 
    },
    { 
      id: 5, 
      title: 'Clean house', 
      dueDate: '2025-03-02', 
      status: 'pending',
      assignedTo: null,
      notes: 'Focus on bathroom and kitchen' 
    },
  ]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Menu handlers
  const handleMenuOpen = (event, member) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm({
      ...memberForm,
      [name]: value
    });
  };

  // Dialog handlers
  const handleAddMemberOpen = () => {
    setMemberForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      role: 'family',
      relationship: '',
      notes: ''
    });
    setOpenAddMemberDialog(true);
  };

  const handleAddMemberClose = () => {
    setOpenAddMemberDialog(false);
  };

  const handleEditMemberOpen = () => {
    if (selectedMember) {
      setMemberForm({
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        email: selectedMember.email,
        phone: selectedMember.phone,
        address: selectedMember.address,
        role: selectedMember.role,
        relationship: selectedMember.relationship,
        notes: ''
      });
      setOpenEditMemberDialog(true);
      handleMenuClose();
    }
  };

  const handleEditMemberClose = () => {
    setOpenEditMemberDialog(false);
  };

  const handleDeleteOpen = () => {
    if (selectedMember) {
      setOpenDeleteConfirmDialog(true);
      handleMenuClose();
    }
  };

  const handleDeleteClose = () => {
    setOpenDeleteConfirmDialog(false);
  };

  const handleViewTasksOpen = () => {
    if (selectedMember) {
      setOpenViewTasksDialog(true);
      handleMenuClose();
    }
  };

  const handleViewTasksClose = () => {
    setOpenViewTasksDialog(false);
  };

  // Member Action handlers
  const handleAddMember = () => {
    const newMember = {
      id: familyMembers.length + 1,
      firstName: memberForm.firstName,
      lastName: memberForm.lastName,
      relationship: memberForm.relationship,
      email: memberForm.email,
      phone: memberForm.phone,
      address: memberForm.address,
      role: memberForm.role,
      tasks: [],
      notifications: true,
      lastActive: 'Just added',
      verified: false,
      img: 'https://randomuser.me/api/portraits/lego/1.jpg' // Default image
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    showSnackbar(`${newMember.firstName} ${newMember.lastName} has been added to family members.`, 'success');
    handleAddMemberClose();
  };

  const handleEditMember = () => {
    if (selectedMember) {
      const updatedMembers = familyMembers.map(member => 
        member.id === selectedMember.id
          ? { 
              ...member, 
              firstName: memberForm.firstName,
              lastName: memberForm.lastName,
              relationship: memberForm.relationship,
              email: memberForm.email,
              phone: memberForm.phone,
              address: memberForm.address,
              role: memberForm.role,
            }
          : member
      );
      
      setFamilyMembers(updatedMembers);
      showSnackbar(`${memberForm.firstName} ${memberForm.lastName}'s information has been updated.`, 'success');
      handleEditMemberClose();
    }
  };

  const handleDeleteMember = () => {
    if (selectedMember) {
      const updatedMembers = familyMembers.filter(member => member.id !== selectedMember.id);
      setFamilyMembers(updatedMembers);
      showSnackbar(`${selectedMember.firstName} ${selectedMember.lastName} has been removed from family members.`, 'success');
      handleDeleteClose();
    }
  };

  // Task handlers
  const handleAssignTask = (taskId, memberId) => {
    const updatedTasks = careTasks.map(task => 
      task.id === taskId ? { ...task, assignedTo: memberId } : task
    );
    
    setCareTasks(updatedTasks);
    
    const memberName = familyMembers.find(member => member.id === memberId)?.firstName || 'Unknown';
    showSnackbar(`Task assigned to ${memberName}.`, 'success');
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    const updatedTasks = careTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    setCareTasks(updatedTasks);
    showSnackbar(`Task status updated to ${newStatus}.`, 'success');
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
  const getFilteredMembers = () => {
    return familyMembers.filter(member => {
      const matchesSearch = 
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery) ||
        member.relationship.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesFilter = filterRole === 'all' || member.role === filterRole;
      
      return matchesSearch && matchesFilter;
    });
  };

  const getFilteredTasks = () => {
    return careTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  // Role text and color mapping
  const getRoleData = (role) => {
    switch (role) {
      case 'caregiver':
        return { text: 'Primary Caregiver', color: 'error' };
      case 'emergency':
        return { text: 'Emergency Contact', color: 'warning' };
      case 'family':
        return { text: 'Family Member', color: 'primary' };
      default:
        return { text: 'Unknown', color: 'default' };
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Family & Caregivers
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddMemberOpen}
          >
            Add Member
          </Button>
        </Box>
        
        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search members or tasks..."
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
                  <InputLabel id="role-filter-label">Filter by Role</InputLabel>
                  <Select
                    labelId="role-filter-label"
                    id="role-filter"
                    value={filterRole}
                    label="Filter by Role"
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="caregiver">Primary Caregivers</MenuItem>
                    <MenuItem value="emergency">Emergency Contacts</MenuItem>
                    <MenuItem value="family">Family Members</MenuItem>
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
            aria-label="family management tabs"
          >
            <Tab icon={<GroupIcon />} label="Family Members" />
            <Tab icon={<AssignmentIcon />} label="Care Tasks" />
          </Tabs>
        </Box>
        
        {/* Family Members Tab */}
        {tabValue === 0 && (
          <>
            {getFilteredMembers().length > 0 ? (
              <Grid container spacing={3}>
                {getFilteredMembers().map(member => (
                  <Grid item xs={12} sm={6} md={4} key={member.id}>
                    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flex: '1 0 auto', position: 'relative' }}>
                        <IconButton
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                          onClick={(e) => handleMenuOpen(e, member)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                          {member.verified ? (
                            <VerifiedBadge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              variant="dot"
                            >
                              <Avatar
                                src={member.img}
                                alt={`${member.firstName} ${member.lastName}`}
                                sx={{ width: 80, height: 80, mb: 1 }}
                              />
                            </VerifiedBadge>
                          ) : (
                            <Avatar
                              src={member.img}
                              alt={`${member.firstName} ${member.lastName}`}
                              sx={{ width: 80, height: 80, mb: 1 }}
                            />
                          )}
                          
                          <Typography variant="h6" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                            {member.firstName} {member.lastName}
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {member.relationship}
                          </Typography>
                          
                          <Chip
                            label={getRoleData(member.role).text}
                            color={getRoleData(member.role).color}
                            size="small"
                          />
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            {member.email}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            {member.phone}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.25, color: 'text.secondary' }} />
                            <span>{member.address}</span>
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <NotificationsIcon fontSize="small" sx={{ mr: 1, color: member.notifications ? 'success.main' : 'text.disabled' }} />
                            <Typography variant="body2" color={member.notifications ? 'text.primary' : 'text.disabled'}>
                              {member.notifications ? 'Receives notifications' : 'Notifications disabled'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              Last active: {member.lastActive}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1, bgcolor: 'action.hover' }}>
                        <Button 
                          size="small" 
                          startIcon={<PhoneIcon />}
                          onClick={() => showSnackbar(`Calling ${member.firstName}...`, 'info')}
                        >
                          Call
                        </Button>
                        
                        <Button 
                          size="small" 
                          startIcon={<EmailIcon />}
                          onClick={() => showSnackbar(`Email to ${member.firstName} opened`, 'info')}
                        >
                          Email
                        </Button>
                        
                        <Button 
                          size="small" 
                          startIcon={<AssignmentIcon />}
                          onClick={() => {
                            setSelectedMember(member);
                            handleViewTasksOpen();
                          }}
                        >
                          Tasks {member.tasks.length > 0 && `(${member.tasks.length})`}
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
                  No family members found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchQuery 
                    ? `No results matching "${searchQuery}"`
                    : "Add family members to help coordinate care."}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddMemberOpen}
                >
                  Add Family Member
                </Button>
              </Paper>
            )}
          </>
        )}
        
        {/* Care Tasks Tab */}
        {tabValue === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Upcoming Care Tasks
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => showSnackbar('Task creation feature coming soon!', 'info')}
              >
                New Task
              </Button>
            </Box>
            
            {getFilteredTasks().length > 0 ? (
              <Paper elevation={0} variant="outlined">
                <List sx={{ width: '100%' }}>
                  {getFilteredTasks().map((task, index) => (
                    <React.Fragment key={task.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        secondaryAction={
                          <Box>
                            <FormControl size="small" sx={{ minWidth: 150, mr: 1 }}>
                              <InputLabel id={`task-status-label-${task.id}`}>Status</InputLabel>
                              <Select
                                labelId={`task-status-label-${task.id}`}
                                value={task.status}
                                label="Status"
                                onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                                size="small"
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                              </Select>
                            </FormControl>
                            
                            <IconButton edge="end" onClick={() => showSnackbar('Edit task feature coming soon!', 'info')}>
                              <EditIcon />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemIcon>
                          <AssignmentIcon color={task.status === 'completed' ? 'success' : 'primary'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                  color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                                }}
                              >
                                {task.title}
                              </Typography>
                              {task.status === 'completed' && (
                                <Chip size="small" label="Completed" color="success" sx={{ ml: 1 }} />
                              )}
                            </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem', color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary" component="span">
                                  Due: {task.dueDate}
                                </Typography>
                                
                                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16, alignSelf: 'center' }} />
                                
                                <Typography variant="body2" color="text.secondary" component="span">
                                  Assigned to: {task.assignedTo ? 
                                    familyMembers.find(m => m.id === task.assignedTo)?.firstName || 'Unknown'
                                    : 
                                    <span style={{ fontStyle: 'italic' }}>Unassigned</span>
                                  }
                                </Typography>
                              </Box>
                              
                              {task.notes && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {task.notes}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {task.assignedTo === null && (
                        <Box sx={{ pl: 9, pr: 2, pb: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Assign this task to:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {familyMembers.map(member => (
                              <Chip
                                key={member.id}
                                avatar={<Avatar src={member.img} alt={member.firstName} />}
                                label={member.firstName}
                                onClick={() => handleAssignTask(task.id, member.id)}
                                variant="outlined"
                                size="small"
                                clickable
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchQuery 
                    ? `No results matching "${searchQuery}"`
                    : "Create tasks to coordinate care responsibilities."}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => showSnackbar('Task creation feature coming soon!', 'info')}
                >
                  Create Task
                </Button>
              </Paper>
            )}
          </>
        )}
        
        {/* Family Member Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditMemberOpen}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Member</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleViewTasksOpen}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Tasks</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteOpen} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Remove Member</ListItemText>
          </MenuItem>
        </Menu>
        
        {/* Add Member Dialog */}
        <Dialog open={openAddMemberDialog} onClose={handleAddMemberClose} maxWidth="md" fullWidth>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={memberForm.firstName}
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
                  value={memberForm.lastName}
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
                  value={memberForm.email}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={memberForm.phone}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={memberForm.address}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Relationship"
                  name="relationship"
                  value={memberForm.relationship}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                  placeholder="e.g. Son, Daughter, Niece"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={memberForm.role}
                    label="Role"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="caregiver">Primary Caregiver</MenuItem>
                    <MenuItem value="emergency">Emergency Contact</MenuItem>
                    <MenuItem value="family">Family Member</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={memberForm.notes}
                  onChange={handleFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddMemberClose}>Cancel</Button>
            <Button 
              onClick={handleAddMember} 
              variant="contained" 
              color="primary"
              disabled={!memberForm.firstName || !memberForm.lastName || !memberForm.email || !memberForm.phone}
            >
              Add Member
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit Member Dialog */}
        <Dialog open={openEditMemberDialog} onClose={handleEditMemberClose} maxWidth="md" fullWidth>
          <DialogTitle>Edit Family Member</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={memberForm.firstName}
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
                  value={memberForm.lastName}
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
                  value={memberForm.email}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={memberForm.phone}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={memberForm.address}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Relationship"
                  name="relationship"
                  value={memberForm.relationship}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  margin="normal"
                  placeholder="e.g. Son, Daughter, Niece"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="edit-role-label">Role</InputLabel>
                  <Select
                    labelId="edit-role-label"
                    name="role"
                    value={memberForm.role}
                    label="Role"
                    onChange={handleFormChange}
                  >
                    <MenuItem value="caregiver">Primary Caregiver</MenuItem>
                    <MenuItem value="emergency">Emergency Contact</MenuItem>
                    <MenuItem value="family">Family Member</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={memberForm.notes}
                  onChange={handleFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  placeholder="Add any additional notes about this family member"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditMemberClose}>Cancel</Button>
            <Button 
              onClick={handleEditMember} 
              variant="contained" 
              color="primary"
              disabled={!memberForm.firstName || !memberForm.lastName || !memberForm.email || !memberForm.phone}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteClose}>
          <DialogTitle>Remove Family Member?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove {selectedMember?.firstName} {selectedMember?.lastName} from family members? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={handleDeleteMember} variant="contained" color="error">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* View Tasks Dialog */}
        <Dialog open={openViewTasksDialog} onClose={handleViewTasksClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedMember?.firstName}'s Tasks
          </DialogTitle>
          <DialogContent dividers>
            {selectedMember && (
              <>
                {careTasks.filter(task => task.assignedTo === selectedMember.id).length > 0 ? (
                  <List>
                    {careTasks
                      .filter(task => task.assignedTo === selectedMember.id)
                      .map((task) => (
                        <ListItem key={task.id} alignItems="flex-start">
                          <ListItemIcon>
                            <AssignmentIcon color={task.status === 'completed' ? 'success' : 'primary'} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                  }}
                                >
                                  {task.title}
                                </Typography>
                                {task.status === 'completed' && (
                                  <Chip size="small" label="Completed" color="success" sx={{ ml: 1 }} />
                                )}
                              </Box>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography variant="body2" color="text.secondary">
                                  Due: {task.dueDate}
                                </Typography>
                                {task.notes && (
                                  <Typography variant="body2" color="text.secondary">
                                    {task.notes}
                                  </Typography>
                                )}
                              </React.Fragment>
                            }
                          />
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id={`member-task-status-label-${task.id}`}>Status</InputLabel>
                            <Select
                              labelId={`member-task-status-label-${task.id}`}
                              value={task.status}
                              label="Status"
                              onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                              size="small"
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="in_progress">In Progress</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                          </FormControl>
                        </ListItem>
                      ))
                    }
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No tasks assigned to {selectedMember.firstName} yet.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => showSnackbar('Task assignment feature coming soon!', 'info')}
                      sx={{ mt: 2 }}
                    >
                      Assign a Task
                    </Button>
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleViewTasksClose}>Close</Button>
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

export default FamilyMembersPage;