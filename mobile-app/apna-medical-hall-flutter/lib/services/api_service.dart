import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiResponse {
  final bool success;
  final dynamic data;
  final String? message;
  final int? statusCode;

  ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.statusCode,
  });
}

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api';
  static const Duration timeout = Duration(seconds: 30);

  static Future<ApiResponse> get(
    String endpoint, {
    Map<String, String>? headers,
  }) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          ...?headers,
        },
      ).timeout(timeout);

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  static Future<ApiResponse> post(
    String endpoint,
    dynamic body, {
    Map<String, String>? headers,
  }) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          ...?headers,
        },
        body: json.encode(body),
      ).timeout(timeout);

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  static Future<ApiResponse> put(
    String endpoint,
    dynamic body, {
    Map<String, String>? headers,
  }) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.put(
        url,
        headers: {
          'Content-Type': 'application/json',
          ...?headers,
        },
        body: json.encode(body),
      ).timeout(timeout);

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  static Future<ApiResponse> delete(
    String endpoint, {
    Map<String, String>? headers,
  }) async {
    try {
      final url = Uri.parse('$baseUrl$endpoint');
      final response = await http.delete(
        url,
        headers: {
          'Content-Type': 'application/json',
          ...?headers,
        },
      ).timeout(timeout);

      return _handleResponse(response);
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  static ApiResponse _handleResponse(http.Response response) {
    try {
      final data = json.decode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse(
          success: true,
          data: data,
          statusCode: response.statusCode,
        );
      } else {
        return ApiResponse(
          success: false,
          message: data['message'] ?? 'Request failed',
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Invalid response format',
        statusCode: response.statusCode,
      );
    }
  }
}