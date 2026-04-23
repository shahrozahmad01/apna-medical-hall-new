# Apna Medical Hall Backend

A production-ready backend system for Apna Medical Hall pharmacy business built with Node.js, Express, and MongoDB.

## 🚀 Features

- **OTP-based Authentication** - Phone number verification for secure login
- **Role-based Access Control** - Admin, Staff, and User roles
- **Product Management** - CRUD operations for pharmacy products
- **Order Management** - Complete order lifecycle with prescription validation
- **Prescription Upload & Approval** - Digital prescription handling
- **Inventory Management** - Stock tracking with low stock alerts
- **Expiry Management** - Automatic expiry alerts via cron jobs
- **Security** - JWT authentication, rate limiting, input validation
- **Scalable Architecture** - Clean separation of concerns

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based permissions
- **File Upload**: Multer for prescription uploads
- **Security**: Helmet, CORS, rate limiting
- **Scheduling**: Node-cron for automated alerts
- **SMS**: Twilio integration for OTP

## 📁 Project Structure

```
apna-medical-hall-backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── productController.js  # Product CRUD operations
│   ├── orderController.js    # Order management
│   └── prescriptionController.js # Prescription handling
├── middleware/
│   ├── authMiddleware.js     # JWT authentication & authorization
│   └── errorMiddleware.js    # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Order.js             # Order schema
│   └── Prescription.js      # Prescription schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── productRoutes.js     # Product routes
│   ├── orderRoutes.js       # Order routes
│   └── prescriptionRoutes.js # Prescription routes
├── utils/
│   └── alerts.js            # Alert utilities (SMS, email)
├── uploads/                 # File upload directory
├── .env                     # Environment variables
├── package.json
├── server.js                # Main application file
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apna-medical-hall-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```
   - Update the following variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong secret key for JWT
     - `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: For SMS OTP
     - `CLIENT_URL`: Your frontend URL

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the connection string for cloud MongoDB.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/stats/overview` - Product statistics (Admin)

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/stats/overview` - Order statistics (Admin)

### Prescriptions
- `POST /api/prescriptions/upload` - Upload prescription
- `GET /api/prescriptions` - Get prescriptions
- `GET /api/prescriptions/:id` - Get single prescription
- `PUT /api/prescriptions/:id/status` - Update prescription status (Admin)
- `DELETE /api/prescriptions/:id` - Delete prescription

## 🔐 Authentication & Authorization

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles
- **User**: Can view products, place orders, upload prescriptions
- **Staff**: Additional permissions for order management
- **Admin**: Full access including product management and prescription approval

## 📊 Business Logic

### Prescription Validation
- Products marked as `prescriptionRequired: true` need prescription approval
- Orders containing prescription medicines are blocked until prescription is approved
- Recent prescription approval (within 30 days) is required

### Inventory Management
- Stock is automatically reduced when orders are placed
- Stock is restored when orders are cancelled
- Low stock alerts are sent daily at 9 AM
- Configurable low stock threshold per product

### Expiry Management
- Products expiring within 30 days trigger alerts
- Daily cron job checks for expiring products
- Alerts are logged to console (integrate with email/SMS in production)

## 🧪 Testing

```bash
npm test
```

## 📝 API Documentation

For detailed API documentation, you can use tools like Postman or Swagger. Import the collection from `docs/` directory.

## 🚀 Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production MongoDB URI
- Set up Twilio credentials for SMS
- Configure email settings for alerts

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, contact:
- Email: apnamedicalhall2026@gmail.com
- Phone: +91 8540009086
- Address: Barharia Road, Fakhruddinpur (Near Mazar Shareef), Siwan, Bihar, India