import React, { useState } from 'react';
import '../styles/DocumentsPage.css';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Button,
  TextField,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import Header from '../components/Header';
import { styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function DocumentsPage() {
  // State variables
  const [currentFolder, setCurrentFolder] = useState('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [openNewFolderDialog, setOpenNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  
  // Mock folder structure
  const folders = {
    'root': [
      { id: 'folder1', name: 'Medical Records', type: 'folder', lastModified: '2023-10-15' },
      { id: 'folder2', name: 'Prescriptions', type: 'folder', lastModified: '2023-11-20' },
      { id: 'folder3', name: 'Insurance Documents', type: 'folder', lastModified: '2023-09-05' },
      { id: 'folder4', name: 'Dialysis Reports', type: 'folder', lastModified: '2024-01-10' },
      { id: 'doc1', name: 'Care Plan Summary.pdf', type: 'pdf', size: '2.4 MB', lastModified: '2023-12-25' },
      { id: 'doc2', name: 'Emergency Contacts.docx', type: 'doc', size: '156 KB', lastModified: '2023-08-30' },
      { id: 'doc3', name: 'Medication Schedule.xlsx', type: 'sheet', size: '320 KB', lastModified: '2024-02-05' },
    ],
    'folder1': [
      { id: 'doc4', name: 'Blood Test Results Jan 2024.pdf', type: 'pdf', size: '1.8 MB', lastModified: '2024-01-15' },
      { id: 'doc5', name: 'Nephrology Consultation.pdf', type: 'pdf', size: '3.2 MB', lastModified: '2023-11-08' },
      { id: 'doc6', name: 'Kidney Function Report.pdf', type: 'pdf', size: '2.1 MB', lastModified: '2023-12-12' },
      { id: 'doc7', name: 'X-Ray Results.jpg', type: 'image', size: '4.7 MB', lastModified: '2023-10-30' },
    ],
    'folder2': [
      { id: 'doc8', name: 'Blood Pressure Medication.pdf', type: 'pdf', size: '420 KB', lastModified: '2024-01-20' },
      { id: 'doc9', name: 'Phosphate Binder Prescription.pdf', type: 'pdf', size: '380 KB', lastModified: '2023-12-05' },
      { id: 'doc10', name: 'Vitamin D Supplement.pdf', type: 'pdf', size: '290 KB', lastModified: '2024-02-10' },
    ],
    'folder3': [
      { id: 'doc11', name: 'Medicare Card.jpg', type: 'image', size: '1.2 MB', lastModified: '2023-08-15' },
      { id: 'doc12', name: 'Insurance Policy.pdf', type: 'pdf', size: '5.6 MB', lastModified: '2023-07-22' },
      { id: 'doc13', name: 'Claims History 2023.pdf', type: 'pdf', size: '3.8 MB', lastModified: '2024-01-05' },
    ],
    'folder4': [
      { id: 'doc14', name: 'January Dialysis Summary.pdf', type: 'pdf', size: '2.3 MB', lastModified: '2024-02-01' },
      { id: 'doc15', name: 'December Dialysis Summary.pdf', type: 'pdf', size: '2.2 MB', lastModified: '2024-01-03' },
      { id: 'doc16', name: 'November Dialysis Summary.pdf', type: 'pdf', size: '2.1 MB', lastModified: '2023-12-02' },
      { id: 'doc17', name: 'Dialysis Center Guidelines.pdf', type: 'pdf', size: '1.5 MB', lastModified: '2023-09-12' },
    ]
  };

  // Breadcrumb navigation
  const getBreadcrumbs = () => {
    if (currentFolder === 'root') {
      return [{ id: 'root', name: 'All Documents' }];
    }
    
    // Find the folder name from the ID
    const folderName = Object.keys(folders).reduce((name, folderId) => {
      if (folderId === currentFolder) {
        name = folders.root.find(f => f.id === folderId)?.name || 'Unknown Folder';
      }
      return name;
    }, 'Unknown Folder');
    
    return [
      { id: 'root', name: 'All Documents' },
      { id: currentFolder, name: folderName }
    ];
  };

  // Filter documents based on search query
  const getFilteredDocuments = () => {
    if (!searchQuery.trim()) {
      return folders[currentFolder] || [];
    }
    
    const query = searchQuery.toLowerCase();
    
    // Search across all folders if the query is not empty
    return Object.values(folders).flat().filter(item => 
      item.name.toLowerCase().includes(query)
    );
  };

  // Get icon based on document type
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'folder':
        return <FolderIcon sx={{ fontSize: 40, color: '#ffd700' }} />;
      case 'pdf':
        return <PictureAsPdfIcon sx={{ fontSize: 40, color: '#f44336' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ fontSize: 40, color: '#2196f3' }} />;
      case 'image':
      case 'jpg':
      case 'png':
        return <ImageIcon sx={{ fontSize: 40, color: '#4caf50' }} />;
      case 'sheet':
      case 'xlsx':
        return <TextSnippetIcon sx={{ fontSize: 40, color: '#ff9800' }} />;
      default:
        return <DescriptionIcon sx={{ fontSize: 40, color: '#9e9e9e' }} />;
    }
  };

  // Handle document click
  const handleDocumentClick = (item) => {
    if (item.type === 'folder') {
      setCurrentFolder(item.id);
    } else {
      // For actual documents, we would typically open them
      showSnackbar(`Opening ${item.name}...`, 'info');
    }
  };

  // Menu handlers
  const handleMenuOpen = (event, document) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Dialog handlers
  const handleNewFolderOpen = () => {
    setOpenNewFolderDialog(true);
  };

  const handleNewFolderClose = () => {
    setOpenNewFolderDialog(false);
    setNewFolderName('');
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      showSnackbar(`Folder "${newFolderName}" created successfully!`, 'success');
      handleNewFolderClose();
    }
  };

  const handleRenameOpen = () => {
    if (selectedDocument) {
      setNewName(selectedDocument.name);
      setOpenRenameDialog(true);
      handleMenuClose();
    }
  };

  const handleRenameClose = () => {
    setOpenRenameDialog(false);
    setNewName('');
  };

  const handleRename = () => {
    if (newName.trim()) {
      showSnackbar(`"${selectedDocument.name}" renamed to "${newName}"`, 'success');
      handleRenameClose();
    }
  };

  const handleShareOpen = () => {
    if (selectedDocument) {
      setOpenShareDialog(true);
      handleMenuClose();
    }
  };

  const handleShareClose = () => {
    setOpenShareDialog(false);
    setShareEmail('');
    setSharePermission('view');
  };

  const handleShare = () => {
    if (shareEmail.trim()) {
      showSnackbar(`"${selectedDocument.name}" shared with ${shareEmail}`, 'success');
      handleShareClose();
    }
  };

  const handleDeleteOpen = () => {
    if (selectedDocument) {
      setOpenDeleteConfirmDialog(true);
      handleMenuClose();
    }
  };

  const handleDeleteClose = () => {
    setOpenDeleteConfirmDialog(false);
  };

  const handleDelete = () => {
    showSnackbar(`"${selectedDocument.name}" deleted`, 'success');
    handleDeleteClose();
  };

  const handleDownload = () => {
    if (selectedDocument) {
      showSnackbar(`Downloading "${selectedDocument.name}"...`, 'info');
      handleMenuClose();
    }
  };

  // Navigate back from folder
  const handleBackClick = () => {
    setCurrentFolder('root');
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

  // File upload handler
  const handleFileUpload = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileName = event.target.files[0].name;
      showSnackbar(`"${fileName}" uploaded successfully!`, 'success');
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Documents
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CreateNewFolderIcon />}
              onClick={handleNewFolderOpen}
            >
              New Folder
            </Button>
            <Button
              component="label"
              variant="contained"
              startIcon={<FileUploadIcon />}
            >
              Upload File
              <VisuallyHiddenInput 
                type="file"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        </Box>

        {/* Search and Breadcrumb Navigation */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {currentFolder !== 'root' && (
                  <IconButton color="primary" onClick={handleBackClick} sx={{ mr: 1 }}>
                    <KeyboardBackspaceIcon />
                  </IconButton>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getBreadcrumbs().map((crumb, index, array) => (
                    <React.Fragment key={crumb.id}>
                      <Typography 
                        variant="body1" 
                        color={index === array.length - 1 ? 'text.primary' : 'primary'}
                        sx={{ 
                          cursor: index === array.length - 1 ? 'default' : 'pointer',
                          fontWeight: index === array.length - 1 ? 'medium' : 'normal'
                        }}
                        onClick={() => index !== array.length - 1 && setCurrentFolder(crumb.id)}
                      >
                        {crumb.name}
                      </Typography>
                      {index < array.length - 1 && (
                        <Typography variant="body1" color="text.secondary" sx={{ mx: 1 }}>
                          /
                        </Typography>
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Category Quick Links */}
        {currentFolder === 'root' && !searchQuery && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categories
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <LocalHospitalIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    Medical Records
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <CalendarTodayIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    Appointments
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <AssignmentIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    Care Plans
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <BookIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    Insurance
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <FormatListBulletedIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    Forms
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <AddIcon color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="body2" align="center">
                    Add Category
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Document List */}
        <Grid container spacing={3}>
          {getFilteredDocuments().map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': { 
                    boxShadow: 3,
                    cursor: 'pointer' 
                  },
                  position: 'relative'
                }}
              >
                <IconButton 
                  size="small" 
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, item);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                
                <CardContent 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    pt: 4,
                    flexGrow: 1
                  }}
                  onClick={() => handleDocumentClick(item)}
                >
                  {getDocumentIcon(item.type)}
                  <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    {item.name}
                  </Typography>
                  
                  {item.type !== 'folder' && (
                    <Chip 
                      label={item.size} 
                      size="small" 
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  )}
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Last modified: {item.lastModified}
                  </Typography>
                </CardContent>
                
                {item.type !== 'folder' && (
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Tooltip title="Download">
                      <IconButton size="small" color="primary">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton size="small" color="primary">
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty state */}
        {getFilteredDocuments().length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No documents found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery 
                ? `No results matching "${searchQuery}"`
                : "This folder is empty. Upload documents or create a new folder."}
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<UploadFileIcon />}
            >
              Upload Document
              <VisuallyHiddenInput 
                type="file" 
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        )}

        {/* Document Action Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleRenameOpen}>
            <ListItemIcon>
              <DriveFileRenameOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rename</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleShareOpen}>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDownload}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteOpen} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* New Folder Dialog */}
        <Dialog open={openNewFolderDialog} onClose={handleNewFolderClose}>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Folder Name"
              fullWidth
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewFolderClose}>Cancel</Button>
            <Button onClick={handleCreateFolder} variant="contained" color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rename Dialog */}
        <Dialog open={openRenameDialog} onClose={handleRenameClose}>
          <DialogTitle>Rename</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Name"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRenameClose}>Cancel</Button>
            <Button onClick={handleRename} variant="contained" color="primary">
              Rename
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={openShareDialog} onClose={handleShareClose}>
          <DialogTitle>Share Document</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Permission</InputLabel>
              <Select
                value={sharePermission}
                label="Permission"
                onChange={(e) => setSharePermission(e.target.value)}
              >
                <MenuItem value="view">View Only</MenuItem>
                <MenuItem value="edit">Can Edit</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleShareClose}>Cancel</Button>
            <Button onClick={handleShare} variant="contained" color="primary">
              Share
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteClose}>
          <DialogTitle>Delete Document?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedDocument?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
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

export default DocumentsPage;