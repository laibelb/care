import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Snackbar,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import CameraPlayer from './CameraPlayer';
import { startRtspStream, stopStream, connectToOnvifCamera } from '../services/onvif/camera-api';
import VideocamIcon from '@mui/icons-material/Videocam';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';

function CameraViewer({ patient }) {
  // State for camera management
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [motionDetection, setMotionDetection] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [littlefSmartConnected, setLittlefSmartConnected] = useState(false);
  
  // State for adding new cameras
  const [addCameraDialogOpen, setAddCameraDialogOpen] = useState(false);
  const [newCameraName, setNewCameraName] = useState('');
  const [newCameraId, setNewCameraId] = useState('');
  const [pairingMode, setPairingMode] = useState(false);
  const [pairingCode, setPairingCode] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Import from patientService for updating patient data
  const { patientService } = require('../services/api');
  
  // ONVIF camera state
  const [onvifDialogOpen, setOnvifDialogOpen] = useState(false);
  const [onvifIpAddress, setOnvifIpAddress] = useState('');
  const [onvifUsername, setOnvifUsername] = useState('');
  const [onvifPassword, setOnvifPassword] = useState('');
  const [onvifPort, setOnvifPort] = useState('8000');
  const [rtspPort, setRtspPort] = useState('554');
  const [onvifConnecting, setOnvifConnecting] = useState(false);
  
  // Sample LittlefSmart camera data
  const littlefSmartCameras = [
    { 
      id: 'lf-living-room', 
      name: 'Living Room', 
      type: 'LittlefSmart Pro', 
      status: 'online',
      connection: 'WiFi',
      lastSeen: 'Just now',
      motionDetection: true,
      nightVision: true
    },
    { 
      id: 'lf-bedroom', 
      name: 'Bedroom', 
      type: 'LittlefSmart Mini', 
      status: 'online',
      connection: 'WiFi',
      lastSeen: '5 minutes ago',
      motionDetection: true,
      nightVision: true
    }
  ];
  
  const cameras = patient?.cameras || [];
  
  useEffect(() => {
    if (cameras.length > 0 && !selectedCamera) {
      setSelectedCamera(cameras[0]);
    }
    
    // Check if LittlefSmart cameras are already connected
    const hasLittlefSmartCameras = cameras.some(cam => cam.id.startsWith('lf-'));
    setLittlefSmartConnected(hasLittlefSmartCameras);
  }, [cameras, selectedCamera]);
  
  const handleCameraChange = (event) => {
    const camId = event.target.value;
    const camera = cameras.find(cam => cam.id === camId);
    setSelectedCamera(camera);
  };
  
  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };
  
  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };
  
  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };
  
  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };
  
  const handleAddCameraDialogOpen = () => {
    setAddCameraDialogOpen(true);
  };
  
  const handleAddCameraDialogClose = () => {
    setAddCameraDialogOpen(false);
    setNewCameraName('');
    setNewCameraId('');
    setPairingMode(false);
    setPairingCode('');
  };
  
  const handleOnvifDialogOpen = () => {
    setOnvifDialogOpen(true);
    setAddCameraDialogOpen(false);
    // Set default values for Litokam cameras based on ONVIF documentation
    setOnvifIpAddress('192.168.1.1'); // Example IP from docs
    setOnvifUsername('admin'); // Default ONVIF username as per docs
    setOnvifPassword('123456'); // Example password from docs
    setOnvifPort('8000'); // ONVIF port as specified in documentation
    setRtspPort('5543'); // RTSP port as specified in documentation
  };
  
  const handleOnvifDialogClose = () => {
    setOnvifDialogOpen(false);
  };
  
  const handleConnectOnvifCamera = async () => {
    if (!onvifIpAddress || !onvifUsername || !onvifPassword) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }
    
    setOnvifConnecting(true);
    
    try {
      // First, connect to the ONVIF camera to get details
      const cameraConfig = {
        ipAddress: onvifIpAddress,
        username: onvifUsername,
        password: onvifPassword,
        onvifPort: onvifPort,
        name: newCameraName || 'Litokam Camera'
      };
      
      // For demo purposes, we'll just create a camera object without actual ONVIF connection
      // In production, uncomment this section to connect to real camera
      /*
      // Connect to the camera
      const cameraDetails = await connectToOnvifCamera(cameraConfig);
      
      // Start the RTSP stream
      const streamDetails = await startRtspStream({
        id: cameraDetails.id,
        name: cameraDetails.name,
        streamUrl: cameraDetails.streamUrl
      });
      */
      
      // Generate simulated camera details
      const cameraName = newCameraName || 'Litokam Camera';
      let model = 'LF-C1t'; // Default model
      
      // Try to extract model from name
      const modelMatch = cameraName.match(/LF-[CP]\d[t]?|Cam [OSLM]\d/i);
      if (modelMatch) {
        model = modelMatch[0];
      }
      
      // Set appropriate properties based on model from documentation
      const isPTZ = model.includes('P1') || model.includes('P3');
      const isIndoor = model.startsWith('LF-');
      const isOutdoor = model.includes('Cam');
      
      // Create camera object with Litokam-specific settings
      const cameraId = `onvif-${Date.now()}`;
      const newCamera = {
        id: cameraId,
        name: cameraName,
        type: 'ONVIF Camera',
        ipAddress: onvifIpAddress,
        username: onvifUsername,
        onvifPort: onvifPort,
        rtspPort: rtspPort,
        streamUrl: `rtsp://${onvifUsername}:${onvifPassword}@${onvifIpAddress}:${rtspPort}/stream1`,
        onvifUrl: `http://${onvifIpAddress}:${onvifPort}/onvif/device_service`,
        status: 'online',
        connection: 'Wired',
        lastSeen: 'Just now',
        enabled: true,
        motionDetection: true,
        model: model,
        resolution: model.includes('Pro') ? '5MP + 2.4/5.8G' : '2k+2.4G+BT',
        ptzSupported: isPTZ,
        cameraType: isIndoor ? 'Indoor' : 'Outdoor',
        wsPort: 9000 + Math.floor(Math.random() * 1000), // Random WebSocket port
        streamActive: true // Indicate this camera has an active stream
      };
      
      console.log('Connected ONVIF camera:', newCamera);
      
      // Update the patient's cameras list in storage
      const updatedCameras = [...(patient.cameras || []), newCamera];
      const updatedPatient = { ...patient, cameras: updatedCameras };
      
      await patientService.update(patient.id, updatedPatient);
      
      setOnvifConnecting(false);
      setOnvifDialogOpen(false);
      showSnackbar('ONVIF camera connected successfully!', 'success');
      
      // Force page refresh to see the new camera
      window.location.reload();
    } catch (error) {
      console.error('Error connecting to ONVIF camera:', error);
      setOnvifConnecting(false);
      showSnackbar(`Failed to connect to camera: ${error.message}`, 'error');
    }
  };
  
  const handleToggleCamera = (cameraId, enabled) => {
    // Update camera enabled state in the patient object
    if (patient && patient.cameras) {
      const updatedCameras = patient.cameras.map(camera => 
        camera.id === cameraId ? { ...camera, enabled } : camera
      );
      
      const updatedPatient = { ...patient, cameras: updatedCameras };
      
      patientService.update(patient.id, updatedPatient)
        .then(() => {
          console.log(`Camera ${cameraId} ${enabled ? 'enabled' : 'disabled'}`);
          showSnackbar(`Camera ${enabled ? 'enabled' : 'disabled'} successfully`, 'success');
        })
        .catch(err => {
          console.error('Error updating camera state:', err);
          showSnackbar('Failed to update camera. Please try again.', 'error');
        });
    }
  };
  
  const handleConnectLittlefSmart = () => {
    setPairingMode(true);
    setPairingCode(generatePairingCode());
    
    // Simulate pairing process
    setTimeout(() => {
      setLittlefSmartConnected(true);
      setPairingMode(false);
      setAddCameraDialogOpen(false);
      
      // Add sample LittlefSmart cameras to patient
      const newCameras = [
        { 
          id: `lf-living-room-${Date.now()}`, 
          name: 'Living Room',
          streamUrl: 'rtsp://example.com/livingroom',
          type: 'LittlefSmart Pro', 
          status: 'online',
          connection: 'WiFi',
          lastSeen: 'Just now',
          motionDetection: true,
          nightVision: true,
          enabled: true
        },
        { 
          id: `lf-bedroom-${Date.now()}`, 
          name: 'Bedroom',
          streamUrl: 'rtsp://example.com/bedroom',
          type: 'LittlefSmart Mini', 
          status: 'online',
          connection: 'WiFi',
          lastSeen: 'Just now',
          motionDetection: true,
          nightVision: true,
          enabled: true
        }
      ];
      
      // Update patient data with new cameras
      const updatedCameras = [...(patient.cameras || []), ...newCameras];
      const updatedPatient = { ...patient, cameras: updatedCameras };
      
      patientService.update(patient.id, updatedPatient)
        .then(() => {
          showSnackbar('LittlefSmart cameras connected successfully!', 'success');
          // Force page refresh to see the new cameras
          window.location.reload();
        })
        .catch(err => {
          console.error('Error adding cameras:', err);
          showSnackbar('Failed to add cameras. Please try again.', 'error');
        });
    }, 3000);
  };
  
  const generatePairingCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleAddCamera = () => {
    if (!newCameraName.trim()) {
      showSnackbar('Please enter a camera name', 'error');
      return;
    }
    
    // Create a generic camera
    const newCamera = {
      id: `camera-${Date.now()}`,
      name: newCameraName,
      streamUrl: `rtsp://example.com/${newCameraName.toLowerCase().replace(/\s+/g, '-')}`,
      enabled: true,
      status: 'online',
      connection: 'WiFi',
      lastSeen: 'Just now'
    };
    
    // Update patient data with new camera
    const updatedCameras = [...(patient.cameras || []), newCamera];
    const updatedPatient = { ...patient, cameras: updatedCameras };
    
    patientService.update(patient.id, updatedPatient)
      .then(() => {
        console.log(`Adding camera: ${newCameraName}`);
        showSnackbar(`Camera "${newCameraName}" added successfully!`, 'success');
        handleAddCameraDialogClose();
        // Force page refresh to see the new camera
        window.location.reload();
      })
      .catch(err => {
        console.error('Error adding camera:', err);
        showSnackbar('Failed to add camera. Please try again.', 'error');
      });
  };
  
  return (
    <Box>
      <Card>
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <VideocamIcon sx={{ mr: 1 }} /> Live Camera Feed
              {littlefSmartConnected && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 1, 
                    bgcolor: 'success.light', 
                    color: 'success.dark',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 'medium'
                  }}
                >
                  LittlefSmart Connected
                </Typography>
              )}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 120, mr: 1 }}>
                <InputLabel id="camera-select-label">Camera</InputLabel>
                <Select
                  labelId="camera-select-label"
                  value={selectedCamera?.id || ''}
                  onChange={handleCameraChange}
                  label="Camera"
                  size="small"
                  disabled={cameras.length === 0}
                >
                  {cameras.map(camera => (
                    <MenuItem key={camera.id} value={camera.id}>
                      {camera.name} 
                      {camera.id.startsWith('lf-') && ' (LittlefSmart)'}
                      {camera.id.startsWith('onvif-') && ' (ONVIF)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton onClick={handleSettingsOpen} size="small">
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {selectedCamera ? (
            <>
              <Box 
                sx={{ 
                  position: 'relative',
                  bgcolor: 'black', 
                  height: 240, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderRadius: 1
                }}
              >
                {/* Use camera stream or fallback to placeholder image */}
                {selectedCamera.id.startsWith('lf-') ? (
                  <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                    {selectedCamera.streamActive ? (
                      <CameraPlayer
                        stream={{
                          id: selectedCamera.id,
                          wsUrl: selectedCamera.wsUrl || `ws://${window.location.hostname}:${selectedCamera.wsPort || 9000}`
                        }}
                      />
                    ) : (
                      <Box 
                        component="img"
                        src="https://picsum.photos/800/600"
                        alt={`${selectedCamera.name} feed`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/800x600?text=Camera+Feed";
                        }}
                        sx={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 10,
                        left: 10,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Typography variant="caption">LittlefSmart • LIVE</Typography>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336', ml: 0.5 }} />
                    </Box>
                  </Box>
                ) : selectedCamera.id.startsWith('onvif-') ? (
                  <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                    {selectedCamera.streamActive ? (
                      <CameraPlayer
                        stream={{
                          id: selectedCamera.id,
                          wsUrl: selectedCamera.wsUrl || `ws://${window.location.hostname}:${selectedCamera.wsPort || 9000}`
                        }}
                      />
                    ) : (
                      <Box 
                        component="img"
                        src="https://picsum.photos/800/600?blur=2"
                        alt={`${selectedCamera.name} feed`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/800x600?text=ONVIF+Camera+Feed";
                        }}
                        sx={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 10,
                        left: 10,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Typography variant="caption">ONVIF • {selectedCamera.name} • LIVE</Typography>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336', ml: 0.5 }} />
                    </Box>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 10,
                        left: 10,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      IP: {selectedCamera.ipAddress} • RTSP: {selectedCamera.rtspPort} • ONVIF: {selectedCamera.onvifPort}
                      {selectedCamera.model && ` • ${selectedCamera.model}`}
                      {selectedCamera.resolution && ` • ${selectedCamera.resolution}`}
                    </Box>
                    {selectedCamera.ptzSupported && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 10,
                          right: 10,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="caption">PTZ Controls Available</Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {selectedCamera.name} Camera Feed
                  </Typography>
                )}
                <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<FullscreenIcon />}
                    onClick={handleFullscreenOpen}
                  >
                    Fullscreen
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last motion detected: {selectedCamera.id.startsWith('lf-') ? 'Just now' : '5 minutes ago'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      size="small" 
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <NotificationsActiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">Alerts</Typography>
                    </Box>
                  }
                />
              </Box>
            </>
          ) : (
            <Box sx={{ 
              height: 240, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'action.hover',
              borderRadius: 1
            }}>
              <VideocamIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="body1" color="text.secondary" align="center">
                {cameras.length === 0 
                  ? "No cameras configured for this patient" 
                  : "Select a camera to view live feed"}
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleAddCameraDialogOpen}
                sx={{ mt: 2 }}
              >
                Add Camera
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Fullscreen Dialog */}
      <Dialog
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedCamera?.name} - Live Feed
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
            }
            label="Motion Alerts"
          />
        </DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              bgcolor: 'black', 
              height: 480,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              overflow: 'hidden'
            }}
          >
            {selectedCamera?.id.startsWith('lf-') ? (
              <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                {selectedCamera.streamActive ? (
                  <CameraPlayer
                    stream={{
                      id: selectedCamera.id,
                      wsUrl: selectedCamera.wsUrl || `ws://${window.location.hostname}:${selectedCamera.wsPort || 9000}`
                    }}
                    height="480px"
                  />
                ) : (
                  <Box 
                    component="img"
                    src="https://picsum.photos/1024/768"
                    alt={`${selectedCamera.name} feed`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/1024x768?text=Camera+Feed+(Fullscreen)";
                    }}
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 10,
                    left: 10,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Typography variant="caption">LittlefSmart • LIVE</Typography>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336', ml: 0.5 }} />
                </Box>
              </Box>
            ) : selectedCamera?.id.startsWith('onvif-') ? (
              <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                {selectedCamera.streamActive ? (
                  <CameraPlayer
                    stream={{
                      id: selectedCamera.id,
                      wsUrl: selectedCamera.wsUrl || `ws://${window.location.hostname}:${selectedCamera.wsPort || 9000}`
                    }}
                    height="480px"
                  />
                ) : (
                  <Box 
                    component="img"
                    src="https://picsum.photos/1024/768?blur=2"
                    alt={`${selectedCamera.name} feed`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/1024x768?text=ONVIF+Camera+Feed+(Fullscreen)";
                    }}
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 10,
                    left: 10,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Typography variant="caption">ONVIF • {selectedCamera.name} • LIVE</Typography>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336', ml: 0.5 }} />
                </Box>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 10,
                    left: 10,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem'
                  }}
                >
                  IP: {selectedCamera.ipAddress} • Port: {selectedCamera.rtspPort}
                </Box>
              </Box>
            ) : (
              <Typography variant="h6" sx={{ color: 'white' }}>
                {selectedCamera?.name} Camera Feed (Fullscreen)
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Camera Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={handleSettingsClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Camera Settings
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddCameraDialogOpen}
            size="small"
          >
            Add Camera
          </Button>
        </DialogTitle>
        <DialogContent>
          {!littlefSmartConnected && (
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <QrCodeScannerIcon sx={{ fontSize: 40, mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Connect LittlefSmart Cameras</Typography>
                  <Typography variant="body2">
                    Easily pair your LittlefSmart security cameras for remote monitoring of your loved ones.
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleConnectLittlefSmart}
                >
                  Connect
                </Button>
              </Box>
            </Paper>
          )}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Motion Detection
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={motionDetection}
                  onChange={(e) => setMotionDetection(e.target.checked)}
                />
              }
              label="Enable motion detection alerts"
            />
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Available Cameras
          </Typography>
          {cameras.length > 0 ? (
            <>
              {littlefSmartConnected && (
                <Typography variant="subtitle2" color="primary" sx={{ mt: 2, mb: 1 }}>
                  LittlefSmart Cameras
                </Typography>
              )}
              
              {littlefSmartConnected && littlefSmartCameras.map(camera => (
                <Paper key={camera.id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CameraAltIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body1">{camera.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {camera.type} • {camera.status} • Last seen: {camera.lastSeen}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={camera.motionDetection}
                          onChange={(e) => console.log(`Motion detection ${e.target.checked ? 'enabled' : 'disabled'} for ${camera.id}`)}
                          size="small"
                        />
                      }
                      label="Motion"
                    />
                    <IconButton color="error" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
              
              {cameras.filter(c => c.id.startsWith('onvif-')).length > 0 && (
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  ONVIF Cameras
                </Typography>
              )}
              
              {cameras.filter(c => c.id.startsWith('onvif-')).map(camera => (
                <Paper key={camera.id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1">{camera.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      IP: {camera.ipAddress} • ONVIF Port: {camera.onvifPort} • RTSP Port: {camera.rtspPort}
                    </Typography>
                    {camera.model && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Model: {camera.model} {camera.resolution && `• ${camera.resolution}`}
                        {camera.ptzSupported && " • PTZ Enabled"}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={camera.enabled}
                          onChange={(e) => handleToggleCamera(camera.id, e.target.checked)}
                        />
                      }
                      label={camera.enabled ? "Enabled" : "Disabled"}
                    />
                  </Box>
                </Paper>
              ))}
              
              {cameras.filter(c => !c.id.startsWith('lf-') && !c.id.startsWith('onvif-')).length > 0 && (
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Other Cameras
                </Typography>
              )}
              
              {cameras.filter(c => !c.id.startsWith('lf-') && !c.id.startsWith('onvif-')).map(camera => (
                <Paper key={camera.id} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1">{camera.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {camera.streamUrl}
                    </Typography>
                  </Box>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={camera.enabled}
                          onChange={(e) => handleToggleCamera(camera.id, e.target.checked)}
                        />
                      }
                      label={camera.enabled ? "Enabled" : "Disabled"}
                    />
                  </Box>
                </Paper>
              ))}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No cameras configured. Please add cameras using the "Add Camera" button.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Camera Dialog */}
      <Dialog
        open={addCameraDialogOpen}
        onClose={handleAddCameraDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {pairingMode ? "Pairing LittlefSmart Camera" : "Add New Camera"}
        </DialogTitle>
        <DialogContent>
          {pairingMode ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress sx={{ mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {pairingCode}
              </Typography>
              <Typography variant="body1" paragraph>
                Enter this code in your LittlefSmart camera app to pair your devices.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This code will expire in 10 minutes.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <TextField
                  label="Camera Name"
                  fullWidth
                  value={newCameraName}
                  onChange={(e) => setNewCameraName(e.target.value)}
                  margin="normal"
                  placeholder="e.g. Living Room, Bedroom"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Camera Type
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      flex: 1, 
                      cursor: 'pointer',
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      textAlign: 'center',
                      borderColor: 'primary.main',
                      borderWidth: 2
                    }}
                    onClick={handleConnectLittlefSmart}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      LittlefSmart Camera
                    </Typography>
                    <CameraAltIcon sx={{ fontSize: 100, my: 1, color: 'primary.light' }} />
                    <Typography variant="body2">
                      Connect wirelessly to your LittlefSmart cameras for best quality and features.
                    </Typography>
                  </Paper>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      flex: 1, 
                      cursor: 'pointer', 
                      textAlign: 'center' 
                    }}
                    onClick={handleOnvifDialogOpen}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      ONVIF Camera
                    </Typography>
                    <CameraAltIcon sx={{ fontSize: 80, my: 1.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Connect to ONVIF-compatible IP cameras using device credentials
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ONVIF Camera Connection Dialog */}
      <Dialog
        open={onvifDialogOpen}
        onClose={handleOnvifDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Connect ONVIF Camera
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" paragraph>
              Enter your Litokam camera credentials to connect using ONVIF. Default username is "admin" and you need to set the ONVIF password in the Littlelf Smart app first.
            </Typography>
            <Typography variant="caption" color="text.secondary" paragraph sx={{ display: 'block', mb: 2 }}>
              Supported models: LF-C1t, LF-C3t, LF-P1t, LF-P3t, Indoor PTZ (P1/P3), Cam O1 Pro, Cam S1 Pro, Cam L1 Pro, Cam M1 Pro
            </Typography>
            
            <TextField
              label="Camera Name"
              fullWidth
              value={newCameraName}
              onChange={(e) => setNewCameraName(e.target.value)}
              margin="normal"
              placeholder="Living Room Camera"
            />
            
            <TextField
              label="IP Address"
              fullWidth
              value={onvifIpAddress}
              onChange={(e) => setOnvifIpAddress(e.target.value)}
              margin="normal"
              required
              placeholder="192.168.1.100"
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <TextField
                label="ONVIF Port"
                value={onvifPort}
                onChange={(e) => setOnvifPort(e.target.value)}
                margin="normal"
                required
                sx={{ flex: 1 }}
              />
              
              <TextField
                label="RTSP Port"
                value={rtspPort}
                onChange={(e) => setRtspPort(e.target.value)}
                margin="normal"
                required
                sx={{ flex: 1 }}
              />
            </Box>
            
            <TextField
              label="Username"
              fullWidth
              value={onvifUsername}
              onChange={(e) => setOnvifUsername(e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={onvifPassword}
              onChange={(e) => setOnvifPassword(e.target.value)}
              margin="normal"
              required
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                onClick={handleOnvifDialogClose} 
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleConnectOnvifCamera}
                disabled={onvifConnecting}
              >
                {onvifConnecting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Connecting...
                  </>
                ) : 'Connect Camera'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CameraViewer;