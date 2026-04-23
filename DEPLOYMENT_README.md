# 🚀 Apna Medical Hall - Production Deployment Guide

## 📋 Overview

This guide covers the complete production deployment of the Apna Medical Hall pharmacy system including:

- **Frontend**: React app deployed to Vercel
- **Admin Panel**: React admin dashboard deployed to Vercel
- **Backend**: Node.js API deployed to AWS EC2
- **Database**: MongoDB Atlas
- **Security**: HTTPS, JWT authentication, environment variables

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Vercel        │
│   (Frontend)    │    │   (Admin)       │
│                 │    │                 │
│ - React SPA     │    │ - React Admin   │
│ - Mobile-first  │    │ - Dashboard     │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
          ┌─────────────────────┐
          │   AWS EC2           │
          │   (Backend API)     │
          │                     │
          │ - Node.js/Express   │
          │ - PM2 Process Mgmt  │
          │ - Nginx Reverse Proxy│
          └─────────┬───────────┘
                    │
          ┌─────────────────────┐
          │   MongoDB Atlas     │
          │   (Database)        │
          └─────────────────────┘
```

## 📋 Prerequisites

### Accounts Required:
- [Vercel Account](https://vercel.com) (Free)
- [AWS Account](https://aws.amazon.com) (Free tier available)
- [MongoDB Atlas Account](https://mongodb.com/atlas) (Free tier available)
- [Domain Name](https://namecheap.com) (Optional but recommended)

### Local Requirements:
- Node.js 18+
- Git
- AWS CLI (optional)
- Flutter SDK (for `mobile-app/`)

---

## 🗄️ Step 1: Set up MongoDB Atlas

1. Follow the detailed guide in `deploy/mongodb-atlas-setup.md`
2. Create a database cluster
3. Set up database user and network access
4. Get your connection string
5. Note down the connection string for later use

---

## ☁️ Step 2: Deploy Backend to AWS EC2

### Option A: Manual EC2 Setup

1. **Launch EC2 Instance**
   ```bash
   # Choose Amazon Linux 2 AMI
   # Instance type: t2.micro (free tier)
   # Security group: Allow SSH (22), HTTP (80), HTTPS (443), Custom TCP (5001)
   ```

2. **Connect to EC2**
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-public-ip
   ```

3. **Run Setup Script**
   ```bash
   # Upload and run the setup script
   chmod +x deploy/setup-ec2.sh
   ./deploy/setup-ec2.sh
   ```

4. **Upload Application Code**
   ```bash
   # From your local machine
   scp -i your-key.pem -r ./backend ec2-user@your-ec2-ip:/var/www/apna-medical-hall/backend
   scp -i your-key.pem -r ./deploy ec2-user@your-ec2-ip:/var/www/apna-medical-hall/deploy
   scp -i your-key.pem ./deploy/.env.production ec2-user@your-ec2-ip:/var/www/apna-medical-hall/backend/.env
   ```

5. **Deploy Application**
   ```bash
   # On EC2 instance
   cd /var/www/apna-medical-hall/backend
   chmod +x ../deploy/deploy-app.sh
   ../deploy/deploy-app.sh
   ```

6. **Configure Nginx**
   ```bash
   # Upload nginx config
   sudo cp /var/www/apna-medical-hall/deploy/nginx.conf /etc/nginx/conf.d/apna-medical-hall.conf
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Option B: Using AWS Elastic Beanstalk (Easier)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB Application**
   ```bash
   cd apna-medical-hall
   eb init
   # Choose: Node.js, application name, region
   ```

3. **Create Environment**
   ```bash
   eb create production-env
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

---

## 🌐 Step 3: Deploy Frontend to Vercel

### Deploy Customer Frontend

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   # Follow the prompts to set up the project
   ```

3. **Configure Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-ec2-domain.com
   ```

4. **Set up Custom Domain (Optional)**
   ```bash
   vercel domains add your-frontend-domain.com
   ```

---

## 👨‍💼 Step 4: Deploy Admin Panel to Vercel

1. **Deploy Admin Panel**
   ```bash
   cd admin
   vercel --prod
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-ec2-domain.com
   ```

3. **Set up Custom Domain (Optional)**
   ```bash
   vercel domains add admin.your-domain.com
   ```

---

## 🔐 Step 5: Security Configuration

### SSL Certificate Setup

1. **Install Certbot on EC2**
   ```bash
   sudo yum install -y certbot python3-certbot-nginx
   ```

2. **Get SSL Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Environment Variables

Ensure your `.env` file contains:
```env
NODE_ENV=production
JWT_SECRET=your_super_secure_secret
MONGODB_URI=your_mongodb_atlas_uri
CLIENT_URL=https://your-frontend-domain.com
ADMIN_URL=https://admin.your-domain.com
```

---

## 📊 Step 6: Database Seeding

1. **Connect to MongoDB Atlas**
   - Use MongoDB Compass or mongosh
   - Connect using your connection string

2. **Run Seed Script**
   ```bash
   # On your EC2 instance
   cd /var/www/apna-medical-hall
   node server/seed.js
   ```

3. **Create Admin User**
   ```javascript
   // In MongoDB Atlas console or via API
   db.users.insertOne({
     name: "Admin User",
     email: "admin@apnamedicalhall.com",
     password: "$2a$12$encrypted_password_hash", // Use bcrypt to hash
     role: "Admin"
   })
   ```

---

## 🔍 Step 7: Testing & Monitoring

### Health Checks

1. **API Health Check**
   ```bash
   curl https://your-ec2-domain.com/api/health
   ```

2. **Frontend Check**
   ```bash
   curl -I https://your-frontend-domain.com
   ```

3. **Admin Panel Check**
   ```bash
   curl -I https://admin.your-domain.com
   ```

### Monitoring Setup

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   ```

2. **Logs**
   ```bash
   pm2 logs apna-medical-hall
   ```

3. **Nginx Logs**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   ```

---

## 🚀 Step 8: Go Live

1. **Update DNS Records**
   - Point your domain to Vercel (frontend/admin)
   - Point API subdomain to EC2 elastic IP

2. **Final Testing**
   - Test user registration and login
   - Test product browsing and ordering
   - Test admin panel functionality
   - Test payment integration

3. **Backup Strategy**
   ```bash
   # Set up automated backups
   mongodump --uri="your_mongodb_uri" --out=/var/backups/$(date +%Y%m%d)
   ```

---

## 🛠️ Maintenance Commands

### Backend Management
```bash
# Check status
pm2 status

# View logs
pm2 logs apna-medical-hall

# Restart application
pm2 restart apna-medical-hall

# Update application
cd /var/www/apna-medical-hall
git pull origin main
npm install --production
pm2 restart apna-medical-hall
```

### Database Management
```bash
# Connect to MongoDB
mongosh "your_mongodb_uri"

# Backup database
mongodump --uri="your_mongodb_uri" --out=backup_$(date +%Y%m%d)

# Restore database
mongorestore --uri="your_mongodb_uri" backup_20231201
```

---

## 📞 Support & Troubleshooting

### Common Issues:

1. **502 Bad Gateway**
   - Check if backend is running: `pm2 status`
   - Check nginx config: `sudo nginx -t`

2. **Database Connection Failed**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string in `.env`

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify multer configuration

### Logs Locations:
- **Application**: `~/.pm2/logs/`
- **Nginx**: `/var/log/nginx/`
- **System**: `/var/log/messages`

---

## 💰 Cost Estimation (Monthly)

- **AWS EC2 (t2.micro)**: $8-10
- **MongoDB Atlas (M0)**: Free
- **Vercel**: Free (hobby plan)
- **Domain**: $10-15
- **SSL**: Free (Let's Encrypt)

**Total: ~$20-25/month**

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] AWS EC2 instance running with Node.js and nginx
- [ ] Backend API deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] Admin panel deployed to Vercel
- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Database seeded with initial data
- [ ] Admin user created
- [ ] All endpoints tested and working
- [ ] Domain configured and pointing correctly
- [ ] Backup strategy implemented

**Congratulations! Your Apna Medical Hall system is now live! 🎊**