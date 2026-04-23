import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/cart_item.dart';
import '../models/product.dart';
import '../utils/constants.dart';

class CartProvider with ChangeNotifier {
  List<CartItem> _items = [];
  bool _isLoading = false;

  List<CartItem> get items => _items;
  bool get isLoading => _isLoading;
  int get itemCount => _items.length;
  double get totalAmount => _items.fold(0, (sum, item) => sum + item.total);

  bool get hasPrescriptionRequiredItems =>
      _items.any((item) => item.product.prescriptionRequired);

  CartProvider() {
    _loadCartFromStorage();
  }

  Future<void> _loadCartFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final cartData = prefs.getString(StorageKeys.cart);

    if (cartData != null) {
      try {
        final List<dynamic> cartJson = json.decode(cartData);
        // Note: In a real app, you'd need to fetch product details from API
        // For now, we'll store minimal data and fetch when needed
        _items = cartJson.map((item) => CartItem.fromJson(item, Product(
          id: item['productId'],
          name: item['productName'] ?? '',
          description: '',
          price: item['price'] ?? 0,
          category: '',
          imageUrl: '',
          stock: 0,
          prescriptionRequired: false,
          isActive: true,
          createdAt: DateTime.now(),
        ))).toList();
        notifyListeners();
      } catch (e) {
        // Clear corrupted cart data
        await _clearCartStorage();
      }
    }
  }

  Future<void> _saveCartToStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final cartData = json.encode(_items.map((item) => item.toJson()).toList());
    await prefs.setString(StorageKeys.cart, cartData);
  }

  Future<void> _clearCartStorage() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(StorageKeys.cart);
  }

  void addItem(Product product, {int quantity = 1}) {
    final existingIndex = _items.indexWhere(
      (item) => item.product.id == product.id,
    );

    if (existingIndex >= 0) {
      _items[existingIndex] = _items[existingIndex].copyWith(
        quantity: _items[existingIndex].quantity + quantity,
      );
    } else {
      _items.add(CartItem(product: product, quantity: quantity));
    }

    _saveCartToStorage();
    notifyListeners();
  }

  void removeItem(String productId) {
    _items.removeWhere((item) => item.product.id == productId);
    _saveCartToStorage();
    notifyListeners();
  }

  void updateQuantity(String productId, int quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      _items[index] = _items[index].copyWith(quantity: quantity);
      _saveCartToStorage();
      notifyListeners();
    }
  }

  void incrementQuantity(String productId) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      final newQuantity = _items[index].quantity + 1;
      updateQuantity(productId, newQuantity);
    }
  }

  void decrementQuantity(String productId) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      final newQuantity = _items[index].quantity - 1;
      updateQuantity(productId, newQuantity);
    }
  }

  int getQuantity(String productId) {
    final item = _items.firstWhere(
      (item) => item.product.id == productId,
      orElse: () => CartItem(product: Product(
        id: '',
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        stock: 0,
        prescriptionRequired: false,
        isActive: true,
        createdAt: DateTime.now(),
      ), quantity: 0),
    );
    return item.quantity;
  }

  bool isInCart(String productId) {
    return _items.any((item) => item.product.id == productId);
  }

  void clearCart() {
    _items.clear();
    _clearCartStorage();
    notifyListeners();
  }

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}