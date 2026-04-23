import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';
import '../utils/constants.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _token != null && _user != null;

  AuthProvider() {
    _loadStoredAuth();
  }

  Future<void> _loadStoredAuth() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(StorageKeys.token);
    final userData = prefs.getString(StorageKeys.user);

    if (_token != null && userData != null) {
      try {
        final userJson = json.decode(userData);
        _user = User.fromJson(userJson);
        notifyListeners();
      } catch (e) {
        // Invalid stored data, clear it
        await logout();
      }
    }
  }

  Future<void> _saveAuth() async {
    final prefs = await SharedPreferences.getInstance();
    if (_token != null) {
      await prefs.setString(StorageKeys.token, _token!);
    }
    if (_user != null) {
      await prefs.setString(StorageKeys.user, json.encode(_user!.toJson()));
    }
  }

  Future<void> _clearAuth() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(StorageKeys.token);
    await prefs.remove(StorageKeys.user);
    _token = null;
    _user = null;
  }

  Future<bool> sendOtp(String phoneNumber) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.post(
        ApiEndpoints.sendOtp,
        {'phone': phoneNumber},
      );

      _isLoading = false;
      if (response.success) {
        notifyListeners();
        return true;
      } else {
        _error = response.message ?? 'Failed to send OTP';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _isLoading = false;
      _error = 'Network error. Please try again.';
      notifyListeners();
      return false;
    }
  }

  Future<bool> verifyOtp(String phoneNumber, String otp) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.post(
        ApiEndpoints.verifyOtp,
        {
          'phone': phoneNumber,
          'otp': otp,
        },
      );

      _isLoading = false;
      if (response.success && response.data != null) {
        _token = response.data['token'];
        _user = User.fromJson(response.data['user']);
        await _saveAuth();
        notifyListeners();
        return true;
      } else {
        _error = response.message ?? 'Invalid OTP';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _isLoading = false;
      _error = 'Network error. Please try again.';
      notifyListeners();
      return false;
    }
  }

  Future<bool> getCurrentUser() async {
    if (_token == null) return false;

    try {
      final response = await ApiService.get(
        ApiEndpoints.getMe,
        headers: {'Authorization': 'Bearer $_token'},
      );

      if (response.success && response.data != null) {
        _user = User.fromJson(response.data);
        await _saveAuth();
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    try {
      if (_token != null) {
        await ApiService.post(
          ApiEndpoints.logout,
          {},
          headers: {'Authorization': 'Bearer $_token'},
        );
      }
    } catch (e) {
      // Ignore logout API errors
    }

    await _clearAuth();
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}