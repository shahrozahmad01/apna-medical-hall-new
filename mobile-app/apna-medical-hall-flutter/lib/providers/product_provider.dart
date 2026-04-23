import 'package:flutter/material.dart';

import '../models/product.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';

class ProductProvider with ChangeNotifier {
  List<Product> _products = [];
  List<Product> _filteredProducts = [];
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';
  String _selectedCategory = '';

  List<Product> get products => _products;
  List<Product> get filteredProducts => _filteredProducts;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;

  List<String> get categories {
    final categorySet = _products.map((product) => product.category).toSet();
    return categorySet.where((category) => category.isNotEmpty).toList();
  }

  Future<void> fetchProducts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.get(ApiEndpoints.getProducts);

      if (response.success && response.data != null) {
        _products = (response.data as List)
            .map((product) => Product.fromJson(product))
            .toList();
        _applyFilters();
      } else {
        _error = response.message ?? 'Failed to load products';
      }
    } catch (e) {
      _error = 'Network error. Please check your connection.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<Product?> fetchProduct(String productId) async {
    try {
      final response = await ApiService.get('${ApiEndpoints.getProduct}/$productId');

      if (response.success && response.data != null) {
        return Product.fromJson(response.data);
      }
    } catch (e) {
      // Handle error
    }
    return null;
  }

  void searchProducts(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void filterByCategory(String category) {
    _selectedCategory = category;
    _applyFilters();
    notifyListeners();
  }

  void clearFilters() {
    _searchQuery = '';
    _selectedCategory = '';
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    _filteredProducts = _products.where((product) {
      final matchesSearch = _searchQuery.isEmpty ||
          product.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          product.description.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchesCategory = _selectedCategory.isEmpty ||
          product.category == _selectedCategory;

      return matchesSearch && matchesCategory && product.isActive;
    }).toList();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}