#!/bin/bash

# Application Deployment Script
# Run this after uploading your code to the EC2 instance

set -e

APP_DIR="/var/www/apna-medical-hall/backend"
BACKUP_DIR="/var/www/backups"

echo "🚀 Deploying Apna Medical Hall Backend..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup current deployment if it exists
if [ -d "$APP_DIR" ]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    echo "📦 Creating backup..."
    tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $APP_DIR .
fi

# Navigate to backend directory
cd $APP_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create uploads directory
mkdir -p uploads/products

# Set proper permissions
chown -R ec2-user:ec2-user $APP_DIR
chmod -R 755 uploads/

# Create environment file
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create it with your configuration."
    echo "📋 Required environment variables:"
    echo "   - PORT=5001"
    echo "   - MONGODB_URI=your_mongodb_atlas_uri"
    echo "   - JWT_SECRET=your_jwt_secret"
    echo "   - CLIENT_URL=https://your-frontend-domain.com"
    echo "   - RAZORPAY_KEY_ID=your_razorpay_key"
    echo "   - RAZORPAY_KEY_SECRET=your_razorpay_secret"
    exit 1
fi

# Run database setup if available
echo "🗄️  Running database setup..."
npm run seed 2>/dev/null || echo "No seed script found, skipping..."

# Stop existing PM2 process
echo "🛑 Stopping existing application..."
pm2 stop apna-medical-hall-backend 2>/dev/null || true
pm2 delete apna-medical-hall-backend 2>/dev/null || true

# Start application with PM2
echo "▶️  Starting application..."
pm2 start server.js --name "apna-medical-hall-backend"
pm2 save
pm2 startup
pm2 save

# Setup log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

echo "✅ Deployment completed successfully!"
echo "📊 Application is running with PM2"
echo "📋 Useful commands:"
echo "   - pm2 status"
echo "   - pm2 logs apna-medical-hall-backend"
echo "   - pm2 restart apna-medical-hall-backend"
echo "🌐 Your API should be available at: http://your-ec2-public-ip:5001"