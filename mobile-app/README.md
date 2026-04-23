# Apna Medical Hall Flutter App

A modern, fast, and user-friendly mobile application for Apna Medical Hall pharmacy built with Flutter.

## 🚀 Features

### Core Features
- **OTP-based Authentication** - Secure phone number verification
- **Medicine Browse & Search** - Easy discovery of medicines with categories
- **Shopping Cart** - Add, remove, and manage cart items
- **Order Management** - Place orders and track delivery status
- **Prescription Upload** - Digital prescription submission
- **Profile Management** - User account and preferences

### UI/UX Features
- **Clean & Minimal Design** - Modern Material Design 3
- **Fast Performance** - Optimized for smooth user experience
- **Easy Navigation** - Max 2 taps to reach any feature
- **Mobile-First** - Responsive design for all screen sizes
- **Dark/Light Theme** - Automatic theme switching

## 🛠️ Tech Stack

- **Framework**: Flutter
- **State Management**: Provider
- **Navigation**: Go Router
- **HTTP Client**: Dart http package
- **Image Handling**: Cached Network Image
- **Local Storage**: Shared Preferences
- **UI Components**: Material Design

## 📱 Screenshots

*(Add screenshots here)*

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (3.0 or higher)
- Dart SDK
- Android Studio / VS Code
- Android/iOS device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apna-medical-hall-flutter
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure API endpoints**
   - Update `lib/utils/constants.dart` with your backend API URL
   - Ensure the backend server is running

4. **Run the app**
   ```bash
   flutter run
   ```

### Build for Production

**Android APK**
```bash
flutter build apk --release
```

**iOS (on macOS)**
```bash
flutter build ios --release
```

## 📁 Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── user.dart            # User model
│   ├── product.dart         # Product model
│   ├── order.dart           # Order model
│   └── cart_item.dart       # Cart item model
├── providers/               # State management
│   ├── auth_provider.dart   # Authentication state
│   ├── cart_provider.dart   # Shopping cart state
│   ├── product_provider.dart # Product data state
│   └── order_provider.dart  # Order management state
├── screens/                 # UI screens
│   ├── splash_screen.dart   # App splash screen
│   ├── login_screen.dart    # OTP login
│   ├── home_screen.dart     # Main screen with navigation
│   ├── search_screen.dart   # Medicine search
│   ├── orders_screen.dart   # Order history
│   ├── cart_screen.dart     # Shopping cart
│   └── profile_screen.dart  # User profile
├── services/                # API services
│   └── api_service.dart     # HTTP client
├── utils/                   # Utilities
│   └── constants.dart       # App constants
└── widgets/                 # Reusable widgets
    ├── custom_button.dart   # Custom button widget
    ├── custom_text_field.dart # Custom text field
    ├── product_card.dart    # Product display card
    └── category_chip.dart   # Category filter chip
```

## 🔧 Configuration

### API Configuration
Update the API base URL in `lib/utils/constants.dart`:

```dart
class ApiEndpoints {
  static const String baseUrl = 'http://your-backend-url:5000/api';
  // ... other endpoints
}
```

### App Colors & Themes
Customize colors in `lib/utils/constants.dart`:

```dart
class AppColors {
  static const Color primary = Color(0xFF2563EB);
  // ... other colors
}
```

## 📡 API Integration

The app integrates with the Apna Medical Hall backend API:

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Prescriptions
- `POST /api/prescriptions/upload` - Upload prescription

## 🧪 Testing

Run tests:
```bash
flutter test
```

## 📦 Dependencies

### Production Dependencies
- `provider: ^6.0.5` - State management
- `http: ^1.1.0` - HTTP client
- `shared_preferences: ^2.2.2` - Local storage
- `go_router: ^12.1.3` - Navigation
- `cached_network_image: ^3.2.3` - Image caching
- `image_picker: ^1.0.4` - Image selection
- `intl: ^0.19.0` - Internationalization

### Development Dependencies
- `flutter_lints: ^3.0.1` - Code linting

## 🚀 Deployment

### Android
1. Create a keystore:
   ```bash
   keytool -genkey -v -keystore key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key
   ```

2. Create `android/key.properties`:
   ```
   storePassword=your_store_password
   keyPassword=your_key_password
   keyAlias=key
   storeFile=key.jks
   ```

3. Build release APK:
   ```bash
   flutter build apk --release
   ```

### iOS
1. Configure signing in Xcode
2. Build release:
   ```bash
   flutter build ios --release
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, contact:
- Email: apnamedicalhall2026@gmail.com
- Phone: +91 8540009086
- Address: Barharia Road, Fakhruddinpur (Near Mazar Shareef), Siwan, Bihar, India

## 🔄 Version History

### v1.0.0
- Initial release
- OTP authentication
- Product browsing and search
- Shopping cart functionality
- Order management
- Prescription upload
- User profile management