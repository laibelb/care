# Care App Deployment Guide

This guide provides instructions for deploying the Care app with live camera streaming functionality.

## Deployment Options

### 1. Single-Server Deployment (Recommended)
Deploy both backend and frontend on a single DigitalOcean droplet.

### 2. Hybrid Deployment (Advanced)
Deploy backend to DigitalOcean for camera support and frontend to Netlify.

## Prerequisites

1. A DigitalOcean droplet with Ubuntu (20.04 LTS or later)
2. Root access to the droplet
3. SSH access to the droplet
4. sshpass installed on your local machine

## Deployment Steps

### Step 1: Set up SSH key authentication (Optional but recommended)

```bash
# Make the script executable
chmod +x setup_ssh_keys.sh

# Run the setup script
./setup_ssh_keys.sh
```

This will set up passwordless SSH access to your droplet.

### Step 2: Set environment variables (Optional)

For better security, you can set environment variables for sensitive information:

```bash
export DROPLET_IP="your-droplet-ip"
export DROPLET_USER="your-username"
export DROPLET_PASSWORD="your-password"  # Only needed if not using SSH keys
```

### Step 3: Deploy with camera support

```bash
# Make the deployment script executable
chmod +x enhanced_deploy.sh

# Run the enhanced deployment script
./enhanced_deploy.sh
```

## What the Deployment Script Does

1. Clones or updates the repository on the server
2. Configures firewall to allow camera streaming ports
3. Installs and configures Node.js and FFmpeg with required codecs
4. Sets up environment variables for camera support
5. Builds the frontend
6. Sets up PM2 for process management
7. Configures the system for camera access
8. Performs health checks on the camera system

## Accessing Your Deployed App

After successful deployment, you can access your app at:

- Frontend: `http://<droplet-ip>:3000`
- Backend API: `http://<droplet-ip>:5001`
- Camera streams will be available through WebSocket ports 9000-9999

## Adding Cameras

1. Login to the application
2. Navigate to the Patient Profile
3. Click "Add Camera" in the camera section
4. Enter your camera's:
   - IP address
   - ONVIF port (typically 8000)
   - Username
   - Password

## Troubleshooting

### Camera Stream Not Working

1. Check if the camera is accessible from the server:
   ```bash
   ping <camera-ip>
   ```

2. Verify FFmpeg is installed with proper codecs:
   ```bash
   ffmpeg -codecs | grep -E 'h264|libx264'
   ```

3. Check if the required ports are open:
   ```bash
   ufw status
   ```

4. Check backend logs:
   ```bash
   pm2 logs care-backend
   ```

### Other Issues

Restart the services:
```bash
pm2 restart all
```

Check system status:
```bash
pm2 status
```