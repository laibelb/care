#\!/bin/bash
# Deployment script for Care application to Digital Ocean

# Set variables
DROPLET_IP="${DROPLET_IP:-"104.131.189.151"}"  # Use env var or default
DROPLET_USER="${DROPLET_USER:-"root"}"        # Use env var or default
DROPLET_PASSWORD="${DROPLET_PASSWORD:-""}"    # Use env var or empty string
REPO_URL="https://github.com/laibelb/care.git"
APP_DIR="/opt/care"

# Create a function to run commands via SSH
run_remote_command() {
    COMMAND="$1"
    echo "Running: $COMMAND"
    
    # Check if password is provided
    if [ -z "$DROPLET_PASSWORD" ]; then
        ssh -o StrictHostKeyChecking=no $DROPLET_USER@$DROPLET_IP "$COMMAND"
    else
        sshpass -p "$DROPLET_PASSWORD" ssh -o StrictHostKeyChecking=no $DROPLET_USER@$DROPLET_IP "$COMMAND"
    fi
}

echo "Deploying Care application to Digital Ocean droplet ($DROPLET_IP)..."

# Check if sshpass is installed
if \! command -v sshpass &> /dev/null; then
    echo "sshpass is not installed. Installing..."
    brew install sshpass
fi

# 1. Install required packages on the server
echo "Installing required packages..."
run_remote_command "apt-get update && \
                   apt-get install -y nodejs npm git ffmpeg && \
                   npm install -g pm2"

# 2. Clone the repository
echo "Cloning repository..."
run_remote_command "mkdir -p $APP_DIR && \
                   cd $APP_DIR && \
                   git clone $REPO_URL . || (cd $APP_DIR && git pull)"

# 3. Install dependencies
echo "Installing dependencies..."
run_remote_command "cd $APP_DIR/backend && npm install"
run_remote_command "cd $APP_DIR/web && npm install"

# 4. Create environment files
echo "Creating environment files..."
run_remote_command "cat > $APP_DIR/backend/.env << 'ENVFILE'
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

run_remote_command "cat > $APP_DIR/web/.env << 'ENVFILE'
REACT_APP_API_URL=http://104.131.189.151:5001
REACT_APP_SOCKET_URL=http://104.131.189.151:5001
REACT_APP_USE_REAL_CAMERAS=true
ENVFILE"

# 5. Build frontend
echo "Building frontend..."
run_remote_command "cd $APP_DIR/web && npm run build"

# 6. Setup backend service with PM2
echo "Setting up backend service..."
run_remote_command "cd $APP_DIR/backend && \
                   pm2 start src/index.js --name care-backend"

# 7. Setup frontend service with PM2
echo "Setting up frontend service..."
run_remote_command "cd $APP_DIR && \
                   npm install -g serve && \
                   pm2 start serve --name care-frontend -- -s web/build -l 3000"

# 8. Save PM2 configuration
run_remote_command "pm2 save"

# 9. Setup PM2 to start on boot
run_remote_command "pm2 startup"

echo "Deployment completed successfully\!"
echo "Your application should be running at: http://$DROPLET_IP:3000"
