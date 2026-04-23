import 'package:flutter/material.dart';

import '../models/order.dart';
import '../models/cart_item.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';
import 'auth_provider.dart';

class OrderProvider with ChangeNotifier {
  List<Order> _orders = [];
  bool _isLoading = false;
  String? _error;

  List<Order> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.get(ApiEndpoints.getOrders);

      if (response.success && response.data != null) {
        _orders = (response.data as List)
            .map((order) => Order.fromJson(order))
            .toList();
      } else {
        _error = response.message ?? 'Failed to load orders';
      }
    } catch (e) {
      _error = 'Network error. Please check your connection.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<Order?> fetchOrder(String orderId) async {
    try {
      final response = await ApiService.get('${ApiEndpoints.getOrder}/$orderId');

      if (response.success && response.data != null) {
        return Order.fromJson(response.data);
      }
    } catch (e) {
      // Handle error
    }
    return null;
  }

  Future<bool> createOrder({
    required List<CartItem> items,
    required double subtotal,
    required double deliveryCharge,
    required double discount,
    String? prescriptionId,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final orderData = {
        'items': items.map((item) => {
          'product': item.product.id,
          'quantity': item.quantity,
          'price': item.product.price,
        }).toList(),
        'subtotal': subtotal,
        'deliveryCharge': deliveryCharge,
        'discount': discount,
        'prescriptionId': prescriptionId,
      };

      final response = await ApiService.post(
        ApiEndpoints.createOrder,
        orderData,
      );

      _isLoading = false;
      if (response.success && response.data != null) {
        final newOrder = Order.fromJson(response.data);
        _orders.insert(0, newOrder);
        notifyListeners();
        return true;
      } else {
        _error = response.message ?? 'Failed to create order';
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

  Future<bool> createPaymentIntent(String orderId, double amount) async {
    try {
      final response = await ApiService.post(
        ApiEndpoints.createPaymentIntent,
        {
          'orderId': orderId,
          'amount': amount,
        },
      );

      if (response.success && response.data != null) {
        return true;
      }
    } catch (e) {
      // Handle error
    }
    return false;
  }

  Future<bool> confirmPayment(String paymentIntentId, String orderId) async {
    try {
      final response = await ApiService.post(
        ApiEndpoints.confirmPayment,
        {
          'paymentIntentId': paymentIntentId,
          'orderId': orderId,
        },
      );

      if (response.success) {
        // Refresh orders to get updated status
        await fetchOrders();
        return true;
      }
    } catch (e) {
      // Handle error
    }
    return false;
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}