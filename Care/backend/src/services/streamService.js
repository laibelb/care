const ffmpeg = require('fluent-ffmpeg');
const WebSocket = require('ws');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Store active streams
const activeStreams = new Map();

/**
 * Start streaming from an RTSP camera to WebSocket clients
 * @param {string} streamId - Unique identifier for the stream
 * @param {string} rtspUrl - RTSP URL of the camera
 * @param {object} options - Additional options
 * @returns {object} Stream information
 */
const startStream = (streamId, rtspUrl, options = {}) => {
  if (activeStreams.has(streamId)) {
    console.log(`Stream ${streamId} already active, returning existing stream`);
    return activeStreams.get(streamId);
  }

  const wsPort = options.wsPort || (9000 + Math.floor(Math.random() * 1000));
  
  // Create WebSocket server for this stream
  const wss = new WebSocket.Server({ port: wsPort });
  console.log(`WebSocket server for stream ${streamId} started on port ${wsPort}`);
  
  // Track connected clients
  let connectedClients = 0;
  
  wss.on('connection', (ws) => {
    console.log(`New client connected to stream ${streamId}`);
    connectedClients++;
    
    ws.on('close', () => {
      console.log(`Client disconnected from stream ${streamId}`);
      connectedClients--;
      
      // If no clients are connected, consider stopping the stream to save resources
      if (connectedClients === 0 && options.stopWhenNoClients) {
        console.log(`No clients connected to stream ${streamId}, stopping...`);
        stopStream(streamId);
      }
    });
  });
  
  // Start the ffmpeg process to convert RTSP to fragmented MP4
  const ffmpegProcess = startFFmpeg(streamId, rtspUrl, wss);
  
  // Store stream information
  const streamInfo = {
    id: streamId,
    rtspUrl,
    wsPort,
    wsUrl: `ws://localhost:${wsPort}`,
    wss,
    ffmpegProcess,
    startedAt: new Date(),
    options
  };
  
  activeStreams.set(streamId, streamInfo);
  console.log(`Stream ${streamId} started`);
  
  return streamInfo;
};

/**
 * Start ffmpeg process to convert RTSP to a format suitable for JSMpeg
 * @param {string} streamId - Stream identifier
 * @param {string} rtspUrl - RTSP URL of the camera
 * @param {WebSocket.Server} wss - WebSocket server to stream to
 * @returns {ChildProcess} The ffmpeg process
 */
const startFFmpeg = (streamId, rtspUrl, wss) => {
  // Create a proxy to broadcast to all connected WebSocket clients
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };
  
  // FFmpeg command to convert RTSP to MPEG-TS format for JSMpeg
  const ffmpegArgs = [
    '-i', rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-s', '640x480',
    '-b:v', '800k',
    '-r', '25',
    '-bf', '0',
    '-q', '10',
    '-codec:a', 'mp2',
    '-ar', '44100',
    '-ac', '1',
    '-b:a', '128k',
    '-muxdelay', '0.001',
    'pipe:1'
  ];
  
  // Add RTSP options for better connection handling
  if (rtspUrl.startsWith('rtsp://')) {
    ffmpegArgs.unshift('-rtsp_transport', 'tcp');
    ffmpegArgs.unshift('-re');
  }
  
  // Start FFmpeg process
  console.log(`Starting FFmpeg with RTSP URL: ${rtspUrl}`);
  const ffmpegProcess = spawn('ffmpeg', ffmpegArgs, {
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Handle FFmpeg output (MPEG-TS stream) and broadcast to WebSocket clients
  ffmpegProcess.stdout.on('data', (data) => {
    broadcast(data);
  });
  
  // Log FFmpeg errors
  ffmpegProcess.stderr.on('data', (data) => {
    console.log(`FFmpeg (${streamId}) log: ${data.toString()}`);
  });
  
  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process for stream ${streamId} exited with code ${code}`);
    if (activeStreams.has(streamId)) {
      const streamInfo = activeStreams.get(streamId);
      streamInfo.wss.close();
      activeStreams.delete(streamId);
    }
  });
  
  return ffmpegProcess;
};

/**
 * Stop a stream
 * @param {string} streamId - ID of the stream to stop
 * @returns {boolean} Success status
 */
const stopStream = (streamId) => {
  if (!activeStreams.has(streamId)) {
    console.log(`Stream ${streamId} not found`);
    return false;
  }
  
  const streamInfo = activeStreams.get(streamId);
  
  // Kill FFmpeg process
  if (streamInfo.ffmpegProcess) {
    streamInfo.ffmpegProcess.kill('SIGKILL');
  }
  
  // Close WebSocket server
  if (streamInfo.wss) {
    streamInfo.wss.close();
  }
  
  // Remove from active streams
  activeStreams.delete(streamId);
  console.log(`Stream ${streamId} stopped`);
  
  return true;
};

/**
 * Get all active streams
 * @returns {Array} List of active streams
 */
const getActiveStreams = () => {
  return Array.from(activeStreams.entries()).map(([id, stream]) => ({
    id: stream.id,
    rtspUrl: stream.rtspUrl,
    wsUrl: stream.wsUrl,
    wsPort: stream.wsPort,
    startedAt: stream.startedAt
  }));
};

module.exports = {
  startStream,
  stopStream,
  getActiveStreams
};