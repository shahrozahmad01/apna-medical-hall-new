# Apna Medical Hall

> A monorepo for the Apna Medical Hall pharmacy ecosystem with backend, web frontend, admin dashboard, and mobile app.

## 🚀 Repository Structure

- `backend/` - Node.js + Express API server
- `admin/` - React admin dashboard
- `frontend/` - React customer-facing web application
- `mobile-app/` - Flutter mobile application
- `deploy/` - Deployment scripts, nginx config, and production docs

## 📌 Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Admin Dashboard
```bash
cd admin
npm install
npm run dev
```

### 3. Customer Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Mobile App
```bash
cd mobile-app
flutter pub get
flutter run
```

## 🧩 Features

- JWT authentication and role-based access
- Product catalog and inventory management
- Order placement, status tracking, and payment flow
- Prescription upload and approval workflow
- Admin analytics and dashboard controls
- Flutter mobile app for customers

## 🛠️ Development Notes

- Each package is self-contained with its own `package.json` or `pubspec.yaml`.
- Use `.env.example` as a template for environment variables.
- Do not commit `.env` files or `node_modules` directories.
- The root repository now uses a clean monorepo layout; old `client/` and `server/` directories have been removed.

## 📦 Deployment Guidance

- Deploy `backend/` as a Node.js service (AWS EC2, Railway, Render, or similar).
- Deploy `frontend/` and `admin/` as static Vite apps (Vercel, Netlify, etc.).
- Build and publish `mobile-app/` using Flutter.
- Use files in `deploy/` for production setup, SSL, and nginx proxy configuration.

## 📄 Useful Commands

From each app folder:

- Install packages: `npm install` or `flutter pub get`
- Run dev server: `npm run dev` or `flutter run`
- Build production app: `npm run build`

## ✅ Recommended GitHub Setup

- Add a repository description and topics
- Add `README.md` to the root of the repository
- Use `.gitignore` to exclude `node_modules/`, `build/`, `.env`, and Flutter artifacts
- Push the reorganized folder structure to GitHub

## 📚 References

- `deploy/DEPLOYMENT_README.md` for full deployment instructions
- `DEPLOYMENT_CHECKLIST.md` for the production rollout checklist
- `backend/`, `frontend/`, `admin/`, and `mobile-app/` for app-specific setup
