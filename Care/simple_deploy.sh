#\!/bin/bash
# Simple deployment script for Care application

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

echo "==== Simple Deployment Script for Care ===="

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

# Check if Node.js and FFmpeg are installed
echo "Checking if Node.js and FFmpeg are installed..."
run_cmd "if \! command -v node &> /dev/null; then 
  echo 'Installing Node.js...'
  apt-get update && apt-get install -y nodejs npm
fi"

run_cmd "if \! command -v ffmpeg &> /dev/null; then
  echo 'Installing FFmpeg...'
  apt-get update && apt-get install -y ffmpeg
fi"

# Install PM2 if not already installed
echo "Installing PM2..."
run_cmd "npm install -g pm2 || echo 'PM2 already installed'"

# Install dependencies for backend and frontend
echo "Installing backend dependencies..."
run_cmd "cd $APP_DIR/backend && npm install"

echo "Installing frontend dependencies..."
run_cmd "cd $APP_DIR/web && npm install"

# Create environment files
echo "Creating environment files..."
run_cmd "cat > $APP_DIR/backend/.env << 'ENVFILE'
# Server configuration
PORT=5001
NODE_ENV=production

# Camera and streaming configuration 
ENABLE_CAMERA_FEATURES=true
CAMERA_TIMEOUT_SECONDS=30

# ONVIF configuration (defaults, will be overridden by user input)
DEFAULT_ONVIF_PORT=8000
DEFAULT_RTSP_PORT=554

# WebSocket server settings
WS_PORT_RANGE_START=9000 
WS_PORT_RANGE_END=9999
ENVFILE"

run_cmd "cat > $APP_DIR/web/.env << 'ENVFILE'
REACT_APP_API_URL=http://104.131.189.151:5001
REACT_APP_SOCKET_URL=http://104.131.189.151:5001
REACT_APP_USE_REAL_CAMERAS=true
ENVFILE"

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

echo "==== Deployment completed\! ===="
echo "Your application should be running at: http://$DROPLET_IP:3000"
echo "API running at: http://$DROPLET_IP:5001"
