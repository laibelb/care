import axios from 'axios';
import io from 'socket.io-client';

// Create socket connection
let socket;

// Base API URL
const API_URL = '/api/cameras';

/**
 * Initialize socket connection
 */
export const initializeSocketConnection = () => {
  if (!socket) {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin
      : 'http://localhost:5001'; // Use the same port as your backend
    
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    socket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error);
    });
  }
  
  return socket;
};

/**
 * Connect to an ONVIF camera
 * @param {Object} cameraConfig - Camera configuration options
 * @returns {Promise<Object>} - Camera details
 */
export const connectToOnvifCamera = async (cameraConfig) => {
  try {
    const response = await axios.post(`${API_URL}/onvif/connect`, cameraConfig);
    return response.data.camera;
  } catch (error) {
    console.error('Error connecting to ONVIF camera:', error);
    throw error;
  }
};

/**
 * Start streaming from an RTSP camera
 * @param {Object} streamConfig - Stream configuration
 * @returns {Promise<Object>} - Stream details
 */
export const startRtspStream = async (streamConfig) => {
  try {
    const response = await axios.post(`${API_URL}/stream/start`, streamConfig);
    return response.data.stream;
  } catch (error) {
    console.error('Error starting RTSP stream:', error);
    throw error;
  }
};

/**
 * Stop a camera stream
 * @param {string} streamId - The ID of the stream to stop
 * @returns {Promise<boolean>} - Success status
 */
export const stopStream = async (streamId) => {
  try {
    const response = await axios.post(`${API_URL}/stream/stop`, { id: streamId });
    return response.data.success;
  } catch (error) {
    console.error('Error stopping stream:', error);
    throw error;
  }
};

/**
 * Get all active camera streams
 * @returns {Promise<Array>} - List of active streams
 */
export const getActiveStreams = async () => {
  try {
    const response = await axios.get(`${API_URL}/streams`);
    return response.data.streams;
  } catch (error) {
    console.error('Error fetching streams:', error);
    throw error;
  }
};

/**
 * Join a camera stream socket room
 * @param {string} streamId - The ID of the stream to join
 */
export const joinCameraStream = (streamId) => {
  if (!socket) {
    initializeSocketConnection();
  }
  
  socket.emit('join-camera-stream', streamId);
};

/**
 * Leave a camera stream socket room
 * @param {string} streamId - The ID of the stream to leave
 */
export const leaveCameraStream = (streamId) => {
  if (socket) {
    socket.emit('leave-camera-stream', streamId);
  }
};

export default {
  connectToOnvifCamera,
  startRtspStream,
  stopStream,
  getActiveStreams,
  initializeSocketConnection,
  joinCameraStream,
  leaveCameraStream
};