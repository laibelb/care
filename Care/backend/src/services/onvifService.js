const onvif = require('node-onvif');
const crypto = require('crypto');

// Store discovered and connected cameras
const cameras = new Map();

/**
 * Discover ONVIF cameras on the network
 * @returns {Promise<Array>} List of discovered devices
 */
const discoverCameras = async () => {
  console.log('Starting ONVIF camera discovery...');
  
  try {
    const devices = await onvif.startProbe();
    console.log(`${devices.length} ONVIF camera(s) found`);
    
    // Process discovered devices
    const discoveredCameras = [];
    for (const device of devices) {
      const info = {
        xaddrs: device.xaddrs,
        manufacturer: device.manufacturer || 'Unknown',
        model: device.model || 'Unknown',
        serialNumber: device.serialNumber || 'Unknown',
        id: crypto.randomUUID(),
        discoverTime: new Date()
      };
      
      discoveredCameras.push(info);
    }
    
    return discoveredCameras;
  } catch (error) {
    console.error('Error discovering ONVIF cameras:', error);
    throw error;
  }
};

/**
 * Connect to an ONVIF camera
 * @param {object} cameraConfig - Camera configuration object
 * @returns {Promise<object>} Camera details
 */
const connectToCamera = async (cameraConfig) => {
  // Generate a unique camera ID if not provided
  const cameraId = cameraConfig.id || `camera-${Date.now()}`;
  
  if (cameras.has(cameraId)) {
    console.log(`Camera ${cameraId} already connected`);
    return cameras.get(cameraId);
  }
  
  try {
    console.log(`Connecting to ONVIF camera at ${cameraConfig.ipAddress}:${cameraConfig.onvifPort || 80}...`);
    
    // Create ONVIF device
    const device = new onvif.OnvifDevice({
      xaddr: `http://${cameraConfig.ipAddress}:${cameraConfig.onvifPort || 80}/onvif/device_service`,
      user: cameraConfig.username,
      pass: cameraConfig.password
    });
    
    // Initialize the camera connection
    await device.init();
    
    // Get camera details
    const info = await device.fetchSystemDateAndTime();
    const deviceInfo = await device.core.getDeviceInformation();
    const profilesResponse = await device.media.getProfiles();
    const profiles = profilesResponse.data.GetProfilesResponse.Profiles;
    
    // Get first profile for stream URL
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    const profileToken = profile.$.token;
    
    // Get stream URI
    const streamResponse = await device.media.getStreamUri({
      ProfileToken: profileToken,
      Protocol: 'RTSP'
    });
    
    const streamUri = streamResponse.data.GetStreamUriResponse.MediaUri.Uri;
    
    // Construct authenticated RTSP URL
    // Some cameras need the credentials in the URL, others don't
    let rtspUrl = streamUri;
    if (cameraConfig.username && cameraConfig.password) {
      // Try to add credentials if not already present
      if (!rtspUrl.includes('@')) {
        const rtspUrlObj = new URL(rtspUrl);
        rtspUrlObj.username = cameraConfig.username;
        rtspUrlObj.password = cameraConfig.password;
        rtspUrl = rtspUrlObj.toString();
      }
    }
    
    // Create camera object
    const camera = {
      id: cameraId,
      name: cameraConfig.name || deviceInfo.data.GetDeviceInformationResponse.Model,
      ipAddress: cameraConfig.ipAddress,
      onvifPort: cameraConfig.onvifPort || 80,
      rtspPort: cameraConfig.rtspPort || 554,
      username: cameraConfig.username,
      //password: cameraConfig.password, // Don't store password in response object
      manufacturer: deviceInfo.data.GetDeviceInformationResponse.Manufacturer,
      model: deviceInfo.data.GetDeviceInformationResponse.Model,
      firmwareVersion: deviceInfo.data.GetDeviceInformationResponse.FirmwareVersion,
      serialNumber: deviceInfo.data.GetDeviceInformationResponse.SerialNumber,
      profiles: profiles,
      streamUrl: rtspUrl,
      onvifDevice: device,
      connectedAt: new Date()
    };
    
    cameras.set(cameraId, camera);
    console.log(`Successfully connected to camera ${cameraId}`);
    
    return {
      ...camera,
      onvifDevice: undefined // Don't return the device instance in API responses
    };
  } catch (error) {
    console.error(`Error connecting to ONVIF camera ${cameraId}:`, error);
    throw error;
  }
};

/**
 * Get camera PTZ capabilities
 * @param {string} cameraId - Camera ID
 * @returns {Promise<object>} Camera PTZ capabilities
 */
const getPtzCapabilities = async (cameraId) => {
  if (!cameras.has(cameraId)) {
    throw new Error(`Camera ${cameraId} not found`);
  }
  
  const camera = cameras.get(cameraId);
  
  try {
    // Get PTZ capabilities
    const ptzStatus = await camera.onvifDevice.ptz.getStatus({
      ProfileToken: camera.profiles[0].$.token
    });
    
    // Check for PTZ capabilities
    const hasPtz = !!ptzStatus;
    
    return {
      hasPtz,
      ptzStatus: ptzStatus.data
    };
  } catch (error) {
    console.log(`Camera ${cameraId} does not support PTZ or PTZ not configured`);
    return { hasPtz: false };
  }
};

/**
 * Disconnect from a camera
 * @param {string} cameraId - Camera ID
 * @returns {boolean} Success status
 */
const disconnectCamera = (cameraId) => {
  if (!cameras.has(cameraId)) {
    console.log(`Camera ${cameraId} not found or already disconnected`);
    return false;
  }
  
  // Remote camera from store
  cameras.delete(cameraId);
  console.log(`Camera ${cameraId} disconnected`);
  
  return true;
};

/**
 * Get all connected cameras
 * @returns {Array} List of connected cameras
 */
const getConnectedCameras = () => {
  return Array.from(cameras.entries()).map(([id, camera]) => ({
    id: camera.id,
    name: camera.name,
    ipAddress: camera.ipAddress,
    manufacturer: camera.manufacturer,
    model: camera.model,
    streamUrl: camera.streamUrl,
    connectedAt: camera.connectedAt
  }));
};

module.exports = {
  discoverCameras,
  connectToCamera,
  getPtzCapabilities,
  disconnectCamera,
  getConnectedCameras
};