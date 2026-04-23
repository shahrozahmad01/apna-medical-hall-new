# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new project called "apna-medical-hall"

## 2. Create Cluster
1. Click "Build a Database"
2. Choose "M0 Cluster" (Free tier)
3. Select your preferred cloud provider and region
4. Click "Create Cluster"

## 3. Set up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username: `admin`
5. Set password: `your_secure_password_here`
6. Select "Read and write to any database"
7. Click "Add User"

## 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## 5. Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<database>` with `apna-medical-hall`

## Example Connection String:
```
mongodb+srv://admin:your_password_here@cluster0.xxxxx.mongodb.net/apna-medical-hall?retryWrites=true&w=majority
```

## 6. Environment Variables
Add this to your `.env` file:
```
MONGODB_URI=mongodb+srv://admin:your_password_here@cluster0.xxxxx.mongodb.net/apna-medical-hall?retryWrites=true&w=majority
```

## Security Best Practices:
- Never commit the `.env` file to version control
- Use strong, unique passwords
- Regularly rotate database credentials
- Consider IP whitelisting for production
- Enable database auditing for compliance