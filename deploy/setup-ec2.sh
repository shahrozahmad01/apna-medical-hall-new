#!/bin/bash

# AWS EC2 Deployment Script for Apna Medical Hall Backend
# This script sets up the backend on an EC2 instance

set -e

echo "🚀 Starting AWS EC2 deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/apna-medical-hall
sudo chown -R ec2-user:ec2-user /var/www/apna-medical-hall

# Install nginx
echo "📦 Installing nginx..."
sudo amazon-linux-extras install nginx1 -y
sudo systemctl enable nginx
sudo systemctl start nginx

# Install certbot for SSL (optional)
echo "📦 Installing certbot..."
sudo yum install -y certbot python3-certbot-nginx

echo "✅ AWS EC2 setup completed!"
echo "📋 Next steps:"
echo "1. Upload your application code to /var/www/apna-medical-hall"
echo "2. Run the application deployment script"
echo "3. Configure nginx (see nginx.conf)"
echo "4. Set up SSL certificate if needed"