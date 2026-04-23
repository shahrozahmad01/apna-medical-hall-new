import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF2563EB);
  static const Color secondary = Color(0xFF64748B);
  static const Color accent = Color(0xFF10B981);

  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Colors.white;
  static const Color cardBackground = Colors.white;

  static const Color textPrimary = Color(0xFF1E293B);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);

  static const Color border = Color(0xFFE2E8F0);
  static const Color divider = Color(0xFFF1F5F9);

  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  static const Color shadow = Color(0x1A000000);
}

class AppStrings {
  static const String appName = 'Apna Medical Hall';
  static const String tagline = 'Your Health, Our Priority';

  static const String login = 'Login';
  static const String logout = 'Logout';
  static const String register = 'Register';

  static const String home = 'Home';
  static const String search = 'Search';
  static const String orders = 'Orders';
  static const String cart = 'Cart';
  static const String profile = 'Profile';

  static const String addToCart = 'Add to Cart';
  static const String buyNow = 'Buy Now';
  static const String placeOrder = 'Place Order';
  static const String trackOrder = 'Track Order';

  static const String uploadPrescription = 'Upload Prescription';
  static const String browseMedicines = 'Browse Medicines';

  static const String phoneNumber = 'Phone Number';
  static const String otp = 'OTP';
  static const String enterOtp = 'Enter 6-digit OTP';
  static const String sendOtp = 'Send OTP';
  static const String verifyOtp = 'Verify OTP';
  static const String resendOtp = 'Resend OTP';

  static const String searchMedicines = 'Search medicines...';
  static const String noResults = 'No results found';
  static const String loading = 'Loading...';
  static const String error = 'Something went wrong';
  static const String retry = 'Retry';

  static const String total = 'Total';
  static const String subtotal = 'Subtotal';
  static const String delivery = 'Delivery';
  static const String discount = 'Discount';

  static const String orderPlaced = 'Order Placed Successfully!';
  static const String orderFailed = 'Order Failed';
  static const String paymentPending = 'Payment Pending';
  static const String paymentCompleted = 'Payment Completed';
}

class ApiEndpoints {
  static const String baseUrl = 'http://localhost:5000/api';

  // Auth endpoints
  static const String sendOtp = '$baseUrl/auth/send-otp';
  static const String verifyOtp = '$baseUrl/auth/verify-otp';
  static const String getMe = '$baseUrl/auth/me';
  static const String logout = '$baseUrl/auth/logout';

  // Product endpoints
  static const String getProducts = '$baseUrl/products';
  static const String getProduct = '$baseUrl/products';

  // Order endpoints
  static const String createOrder = '$baseUrl/orders';
  static const String getOrders = '$baseUrl/orders';
  static const String getOrder = '$baseUrl/orders';

  // Prescription endpoints
  static const String uploadPrescription = '$baseUrl/prescriptions/upload';
  static const String getPrescriptions = '$baseUrl/prescriptions';

  // Payment endpoints
  static const String createPaymentIntent = '$baseUrl/payments/create-intent';
  static const String confirmPayment = '$baseUrl/payments/confirm';
}

class AppConstants {
  static const double borderRadius = 8.0;
  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;

  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration snackbarDuration = Duration(seconds: 3);

  static const int otpLength = 6;
  static const int maxRetries = 3;

  static const String currency = '₹';
  static const String currencyCode = 'INR';
}

class StorageKeys {
  static const String token = 'auth_token';
  static const String user = 'user_data';
  static const String cart = 'cart_items';
  static const String theme = 'app_theme';
}