#\!/bin/bash

# Set the Digital Ocean droplet public IP
DROPLET_IP="${DROPLET_IP:-"104.131.189.151"}"  # Use env var or default
DROPLET_USER="${DROPLET_USER:-"root"}"        # Use env var or default

echo "Setting up SSH key authentication for $DROPLET_USER@$DROPLET_IP"

# Check if SSH key already exists
if [ \! -f ~/.ssh/id_rsa ]; then
    echo "Generating new SSH key pair..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
    echo "SSH key pair generated."
else
    echo "Using existing SSH key pair."
fi

# Display the public key
echo "Your public SSH key:"
cat ~/.ssh/id_rsa.pub

# Copy the SSH key to the remote server
echo -e "\nCopying your public key to the Digital Ocean droplet..."
echo "You'll be prompted for the root password of your droplet."

ssh-copy-id -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa.pub $DROPLET_USER@$DROPLET_IP

# Test the SSH connection
echo -e "\nTesting SSH connection..."
ssh -o BatchMode=yes -o ConnectTimeout=5 $DROPLET_USER@$DROPLET_IP echo "SSH connection successful\!" || echo "SSH connection failed."

echo -e "\nSSH setup complete\!"
echo "You can now run the deployment script without password prompts."
