# Apna Medical Hall Deployment Checklist

## ✅ Project Layout

- `backend/` - Node.js API server
- `admin/` - React admin dashboard
- `frontend/` - React customer web app
- `mobile-app/` - Flutter mobile application
- `deploy/` - deployment scripts and doc support

## 🚀 Deployment Steps

### 1) Database Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Configure a database user
- [ ] Add IP access or network rules
- [ ] Store the connection string in `backend/.env`

### 2) Backend Deployment
- [ ] Deploy `backend/` to your production host
- [ ] Set up `backend/.env`
- [ ] Run `npm install`
- [ ] Start the API via PM2 or your process manager
- [ ] Confirm `/api/health` returns `200`

### 3) Frontend Deployment
- [ ] Deploy `frontend/` to Vercel or another static host
- [ ] Set `VITE_API_URL` to the backend API URL
- [ ] Verify the customer site is live

### 4) Admin Panel Deployment
- [ ] Deploy `admin/` to Vercel or another static host
- [ ] Set `VITE_API_URL` to the backend API URL
- [ ] Verify the admin dashboard is live

### 5) Mobile App
- [ ] Build and publish the Flutter app from `mobile-app/`
- [ ] Confirm API URL configuration in the app

### 6) Production Checks
- [ ] Seed the database with initial data
- [ ] Create an admin user
- [ ] Test authentication flows
- [ ] Test product creation, orders, and prescriptions
- [ ] Confirm payment and webhook flows

## 🔧 Required Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secure_secret
CLIENT_URL=https://your-frontend-domain.com
ADMIN_URL=https://admin.your-domain.com
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
```

### Frontend / Admin
```env
VITE_API_URL=https://your-api-domain.com
```

## 📊 Validation

- [ ] Confirm backend health endpoint
- [ ] Sign in to admin dashboard
- [ ] Place a sample order
- [ ] Upload a prescription
- [ ] Verify product management
- [ ] Check analytics charts
- [ ] Confirm mobile app API connectivity

## 🛠️ Troubleshooting

- `502 Bad Gateway`: validate backend process and nginx config
- Database issues: verify MongoDB Atlas URI and IP whitelist
- CORS errors: confirm `CLIENT_URL`/`ADMIN_URL`
- Upload problems: ensure `backend/uploads/` is writable

## 📚 Reference
- Use `DEPLOYMENT_README.md` for full deployment instructions
- Use `deploy/nginx.conf` for nginx proxy setup
- Keep `.env` files out of source control
  - Structured data presence in page source

## 7) Post-deploy smoke tests

- Submit contact/order form.
- Upload a prescription file.
- Fetch products and test search/filter.
- Verify WhatsApp button opens with prefilled order text.
