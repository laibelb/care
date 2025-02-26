const onvif = require('node-onvif');
const Stream = require('node-rtsp-stream');
const { v4: uuidv4 } = require('uuid');

// In-memory storage for active camera streams
const activeStreams = new Map();

// Store ONVIF devices
const onvifDevices = new Map();

/**
 * Connect to an ONVIF camera and retrieve its stream URL
 * @param {Object} cameraConfig - Camera configuration
 * @returns {Promise<Object>} - Camera details including stream URLs
 */
async function connectToOnvifCamera(cameraConfig) {
  try {
    const { ipAddress, username, password, onvifPort, name } = cameraConfig;
    
    console.log(`Connecting to ONVIF camera at ${ipAddress}:${onvifPort}`);
    
    // Create ONVIF device
    const device = new onvif.OnvifDevice({
      xaddr: `http://${ipAddress}:${onvifPort}/onvif/device_service`,
      user: username,
      pass: password
    });
    
    // Initialize the device
    console.log('Initializing ONVIF device...');
    await device.init();
    
    // Get device information
    const info = await device.fetchDeviceInformation();
    console.log('Device information:', info);
    
    // Get stream URLs
    const profile = await device.getCurrentProfile();
    
    // Get a usable RTSP URL (format varies by manufacturer)
    let streamUrl = '';
    try {
      const { uri } = await device.getStreamUri({ protocol: 'RTSP' });
      streamUrl = uri;
    } catch (error) {
      console.error('Error getting RTSP URL:', error);
      streamUrl = `rtsp://${username}:${password}@${ipAddress}:5543/stream1`;
    }
    
    // Store the device
    const deviceId = uuidv4();
    onvifDevices.set(deviceId, {
      device,
      info,
      profile,
      streamUrl,
      config: cameraConfig
    });
    
    return {
      id: deviceId,
      name: name || info.manufacturer + ' ' + info.model,
      model: info.model,
      manufacturer: info.manufacturer,
      firmware: info.firmwareVersion,
      streamUrl,
      ipAddress,
      onvifPort,
      connected: true
    };
  } catch (error) {
    console.error('Error connecting to ONVIF camera:', error);
    throw new Error(`Failed to connect to camera at ${cameraConfig.ipAddress}: ${error.message}`);
  }
}

/**
 * Start streaming from an RTSP camera
 * @param {Object} cameraConfig - Camera configuration
 * @returns {Object} - Stream details
 */
function startRtspStream(cameraConfig) {
  const { id, streamUrl, name, wsPort = 0 } = cameraConfig;
  
  // Check if stream already exists
  if (activeStreams.has(id)) {
    return activeStreams.get(id);
  }
  
  try {
    console.log(`Starting RTSP stream for ${name} from ${streamUrl}`);
    
    // Create a random port between 9000-9999 if not specified
    const port = wsPort || Math.floor(Math.random() * 1000) + 9000;
    
    const stream = new Stream({
      name: id,
      streamUrl,
      wsPort: port,
      ffmpegOptions: {
        '-stats': '', // Show statistics
        '-r': 30, // Frame rate
        '-q:v': 3, // Video quality (lower is better)
      }
    });
    
    const streamDetails = {
      id,
      name,
      wsUrl: `ws://localhost:${port}`,
      port,
      streamUrl,
      active: true,
      started: new Date().toISOString(),
      stream
    };
    
    activeStreams.set(id, streamDetails);
    return streamDetails;
  } catch (error) {
    console.error('Error starting RTSP stream:', error);
    throw new Error(`Failed to start stream for ${name}: ${error.message}`);
  }
}

/**
 * Stop an active stream
 * @param {string} streamId - The ID of the stream to stop
 * @returns {boolean} - Success status
 */
function stopStream(streamId) {
  if (!activeStreams.has(streamId)) {
    return false;
  }
  
  try {
    const streamDetails = activeStreams.get(streamId);
    if (streamDetails.stream) {
      streamDetails.stream.stop();
    }
    activeStreams.delete(streamId);
    return true;
  } catch (error) {
    console.error(`Error stopping stream ${streamId}:`, error);
    return false;
  }
}

/**
 * Get all active streams
 * @returns {Array} - List of active streams
 */
function getActiveStreams() {
  return Array.from(activeStreams.values()).map(stream => ({
    id: stream.id,
    name: stream.name,
    wsUrl: stream.wsUrl,
    active: stream.active,
    started: stream.started
  }));
}

module.exports = {
  connectToOnvifCamera,
  startRtspStream,
  stopStream,
  getActiveStreams
};