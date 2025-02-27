#!/bin/bash
# Enhanced deployment script for Care application with improved camera support

# Set variables
DROPLET_IP="${DROPLET_IP:-"104.131.189.151"}"  # Use env var or default
DROPLET_USER="${DROPLET_USER:-"root"}"        # Use env var or default
DROPLET_PASSWORD="${DROPLET_PASSWORD:-""}"    # Use env var or empty string
REPO_URL="https://github.com/laibelb/care.git"
APP_DIR="/opt/care"

# Check if password is provided
if [ -z "$DROPLET_PASSWORD" ]; then
  echo "DROPLET_PASSWORD environment variable is not set. Using SSH key authentication."
  SSH_CMD="ssh -o StrictHostKeyChecking=no $DROPLET_USER@$DROPLET_IP"
else
  echo "Using password authentication. Consider using SSH keys instead for better security."
  SSH_CMD="sshpass -p \"$DROPLET_PASSWORD\" ssh -o StrictHostKeyChecking=no $DROPLET_USER@$DROPLET_IP"
fi

echo "==== Enhanced Deployment Script for Care with Camera Support ===="

# Function to run a command on the remote server
run_cmd() {
  echo "Running: $1"
  eval "$SSH_CMD \"$1\""
}

# Check if the app directory exists
echo "Checking if app directory exists..."
run_cmd "if [ \! -d $APP_DIR ]; then mkdir -p $APP_DIR; fi"

# Clone or update the repository
echo "Cloning or updating the repository..."
run_cmd "cd $APP_DIR && (git clone $REPO_URL . || git pull)"

# Configure firewall for camera streaming
echo "Configuring firewall for camera streaming..."
run_cmd "apt-get update && apt-get install -y ufw"
run_cmd "ufw allow 22/tcp" # SSH
run_cmd "ufw allow 5001/tcp" # Backend API
run_cmd "ufw allow 3000/tcp" # Frontend
run_cmd "ufw allow 9000:9999/tcp" # WebSocket range for camera streams
run_cmd "ufw --force enable"
run_cmd "ufw status"

# Check if Node.js and FFmpeg are installed with proper codecs
echo "Checking if Node.js and FFmpeg are installed..."
run_cmd "if \! command -v node &> /dev/null; then 
  echo 'Installing Node.js...'
  apt-get update && apt-get install -y nodejs npm
fi"

run_cmd "if \! command -v ffmpeg &> /dev/null; then
  echo 'Installing FFmpeg with necessary codecs...'
  apt-get update
  apt-get install -y ffmpeg libavcodec-extra libavdevice-dev libavformat-dev libswscale-dev
else
  echo 'Upgrading FFmpeg with necessary codecs...'
  apt-get install -y ffmpeg libavcodec-extra libavdevice-dev libavformat-dev libswscale-dev
fi"

# Verify FFmpeg has necessary codecs
echo "Verifying FFmpeg codec support..."
run_cmd "ffmpeg -codecs | grep -E 'h264|h265|libx264|hevc|mjpeg' || echo 'WARNING: Some camera codecs may be missing'"

# Install PM2 if not already installed
echo "Installing PM2..."
run_cmd "npm install -g pm2 || echo 'PM2 already installed'"

# Install dependencies for backend and frontend
echo "Installing backend dependencies..."
run_cmd "cd $APP_DIR/backend && npm install"

echo "Installing frontend dependencies..."
run_cmd "cd $APP_DIR/web && npm install"

# Create enhanced environment files with camera support
echo "Creating environment files with camera configuration..."
run_cmd "cat > $APP_DIR/backend/.env << 'ENVFILE'
# Server configuration
PORT=5001
NODE_ENV=production

# Camera and streaming configuration 
ENABLE_CAMERA_FEATURES=true
CAMERA_TIMEOUT_SECONDS=30
CAMERA_RECONNECT_ATTEMPTS=3
CAMERA_RECONNECT_DELAY=5000
ENABLE_CAMERA_LOGGING=true
ENABLE_CAMERA_AUTHENTICATION=true

# ONVIF configuration (defaults, will be overridden by user input)
DEFAULT_ONVIF_PORT=8000
DEFAULT_RTSP_PORT=554
ONVIF_DISCOVERY_ENABLED=true
ONVIF_DISCOVERY_INTERVAL=60000

# FFmpeg configuration
FFMPEG_PATH=/usr/bin/ffmpeg
FFMPEG_INPUT_OPTIONS='-rtsp_transport tcp -re'
FFMPEG_OUTPUT_OPTIONS='-c:v libx264 -preset ultrafast -tune zerolatency -f flv'
FFMPEG_LOG_LEVEL=warning

# WebSocket server settings
WS_PORT_RANGE_START=9000 
WS_PORT_RANGE_END=9999
WS_MAX_PAYLOAD=10485760
ENVFILE"

run_cmd "cat > $APP_DIR/web/.env << 'ENVFILE'
REACT_APP_API_URL=http://$DROPLET_IP:5001
REACT_APP_SOCKET_URL=http://$DROPLET_IP:5001
REACT_APP_USE_REAL_CAMERAS=true
REACT_APP_CAMERA_RECONNECT_ATTEMPTS=3
REACT_APP_CAMERA_LATENCY_THRESHOLD=500
REACT_APP_CAMERA_BUFFER_SIZE=3
REACT_APP_CAMERA_RENDER_METHOD=canvas
ENVFILE"

# Check system permissions for camera access
echo "Checking and configuring system permissions for camera access..."
run_cmd "apt-get install -y v4l-utils || echo 'v4l-utils installation failed but may not be needed for network cameras'"
run_cmd "if [ -d /dev/video* ]; then 
  echo 'Local camera devices detected.'
  chmod a+rw /dev/video* 2>/dev/null || echo 'No local camera devices needed to be configured'
else
  echo 'No local camera devices detected. Using network cameras only.'
fi"

# Build frontend
echo "Building frontend..."
run_cmd "cd $APP_DIR/web && npm run build"

# Set up and start backend with PM2
echo "Setting up backend service..."
run_cmd "cd $APP_DIR/backend && pm2 stop care-backend || echo 'Not running' && pm2 start src/index.js --name care-backend"

# Set up and start frontend with PM2
echo "Setting up frontend service..."
run_cmd "cd $APP_DIR && npm install -g serve && pm2 stop care-frontend || echo 'Not running' && pm2 start serve --name care-frontend -- -s web/build -l 3000"

# Save PM2 configuration
run_cmd "pm2 save"

# Set up PM2 to start on boot
run_cmd "pm2 startup"

# Check camera connectivity and stream status
echo "Checking camera connectivity and stream status..."
run_cmd "cd $APP_DIR/backend && node -e 'console.log(\"Camera system health check starting...\"); try { require(\"./src/utils/camera-diagnostics.js\").runDiagnostics(); } catch(e) { console.log(\"Camera diagnostics not available: \" + e.message); }' || echo 'Camera health check failed or not implemented'"

echo "==== Deployment completed with enhanced camera support! ===="
echo "Camera firewall configuration:"
run_cmd "ufw status | grep -E '3000|5001|9000:9999'"
echo "FFmpeg codec support:"
run_cmd "ffmpeg -codecs | grep -E 'h264|libx264|hevc|mjpeg'"
echo "Current camera streaming status:"
run_cmd "netstat -tulpn | grep -E '5001|9000|9001|9002|9003|9004'"
echo "Your application should be running at: http://$DROPLET_IP:3000"
echo "API running at: http://$DROPLET_IP:5001"
echo "Camera streams will be available through WebSocket ports 9000-9999"