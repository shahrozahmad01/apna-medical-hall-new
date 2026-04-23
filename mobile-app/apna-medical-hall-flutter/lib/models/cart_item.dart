import 'product.dart';

class CartItem {
  final Product product;
  final int quantity;

  CartItem({
    required this.product,
    required this.quantity,
  });

  double get total => product.price * quantity;

  CartItem copyWith({
    Product? product,
    int? quantity,
  }) {
    return CartItem(
      product: product ?? this.product,
      quantity: quantity ?? this.quantity,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'productId': product.id,
      'quantity': quantity,
      'price': product.price,
      'total': total,
    };
  }

  factory CartItem.fromJson(Map<String, dynamic> json, Product product) {
    return CartItem(
      product: product,
      quantity: json['quantity'] ?? 1,
    );
  }
}