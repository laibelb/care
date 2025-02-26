const express = require('express');
const router = express.Router();
const cameraService = require('../services/camera-service');

// Get all active camera streams
router.get('/streams', async (req, res) => {
  try {
    const streams = cameraService.getActiveStreams();
    return res.json({ success: true, streams });
  } catch (error) {
    console.error('Error fetching streams:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Connect to an ONVIF camera
router.post('/onvif/connect', async (req, res) => {
  try {
    const { ipAddress, username, password, onvifPort, name } = req.body;
    
    if (!ipAddress || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required camera parameters' 
      });
    }
    
    const cameraConfig = {
      ipAddress,
      username,
      password,
      onvifPort: onvifPort || '8000',
      name: name || 'ONVIF Camera'
    };
    
    const cameraDetails = await cameraService.connectToOnvifCamera(cameraConfig);
    return res.json({ success: true, camera: cameraDetails });
  } catch (error) {
    console.error('Error connecting to ONVIF camera:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start streaming from an RTSP URL
router.post('/stream/start', async (req, res) => {
  try {
    const { id, streamUrl, name } = req.body;
    
    if (!id || !streamUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required streaming parameters' 
      });
    }
    
    const streamDetails = cameraService.startRtspStream({
      id,
      streamUrl,
      name: name || 'Camera Stream'
    });
    
    return res.json({ success: true, stream: streamDetails });
  } catch (error) {
    console.error('Error starting stream:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Stop a camera stream
router.post('/stream/stop', async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Stream ID is required' 
      });
    }
    
    const success = cameraService.stopStream(id);
    
    if (success) {
      return res.json({ success: true, message: 'Stream stopped successfully' });
    } else {
      return res.status(404).json({ 
        success: false, 
        error: 'Stream not found or already stopped' 
      });
    }
  } catch (error) {
    console.error('Error stopping stream:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;