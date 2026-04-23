import 'product.dart';

class OrderItem {
  final String productId;
  final String productName;
  final double price;
  final int quantity;
  final double total;

  OrderItem({
    required this.productId,
    required this.productName,
    required this.price,
    required this.quantity,
    required this.total,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      productId: json['product']['_id'] ?? json['product']['id'] ?? '',
      productName: json['product']['name'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      quantity: json['quantity'] ?? 0,
      total: (json['total'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'product': productId,
      'productName': productName,
      'price': price,
      'quantity': quantity,
      'total': total,
    };
  }
}

class Order {
  final String id;
  final List<OrderItem> items;
  final double subtotal;
  final double deliveryCharge;
  final double discount;
  final double totalAmount;
  final String status;
  final String paymentStatus;
  final String? prescriptionId;
  final DateTime createdAt;
  final DateTime? deliveredAt;

  Order({
    required this.id,
    required this.items,
    required this.subtotal,
    required this.deliveryCharge,
    required this.discount,
    required this.totalAmount,
    required this.status,
    required this.paymentStatus,
    this.prescriptionId,
    required this.createdAt,
    this.deliveredAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['_id'] ?? json['id'] ?? '',
      items: (json['items'] as List<dynamic>?)
          ?.map((item) => OrderItem.fromJson(item))
          .toList() ?? [],
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      deliveryCharge: (json['deliveryCharge'] ?? 0).toDouble(),
      discount: (json['discount'] ?? 0).toDouble(),
      totalAmount: (json['totalAmount'] ?? 0).toDouble(),
      status: json['status'] ?? 'Pending',
      paymentStatus: json['paymentStatus'] ?? 'Pending',
      prescriptionId: json['prescriptionId'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      deliveredAt: json['deliveredAt'] != null
          ? DateTime.parse(json['deliveredAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'items': items.map((item) => item.toJson()).toList(),
      'subtotal': subtotal,
      'deliveryCharge': deliveryCharge,
      'discount': discount,
      'totalAmount': totalAmount,
      'status': status,
      'paymentStatus': paymentStatus,
      'prescriptionId': prescriptionId,
      'createdAt': createdAt.toIso8601String(),
      'deliveredAt': deliveredAt?.toIso8601String(),
    };
  }

  bool get isDelivered => status == 'Delivered';
  bool get isPaid => paymentStatus == 'Paid';
  bool get requiresPrescription => prescriptionId != null;

  Order copyWith({
    String? id,
    List<OrderItem>? items,
    double? subtotal,
    double? deliveryCharge,
    double? discount,
    double? totalAmount,
    String? status,
    String? paymentStatus,
    String? prescriptionId,
    DateTime? createdAt,
    DateTime? deliveredAt,
  }) {
    return Order(
      id: id ?? this.id,
      items: items ?? this.items,
      subtotal: subtotal ?? this.subtotal,
      deliveryCharge: deliveryCharge ?? this.deliveryCharge,
      discount: discount ?? this.discount,
      totalAmount: totalAmount ?? this.totalAmount,
      status: status ?? this.status,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      prescriptionId: prescriptionId ?? this.prescriptionId,
      createdAt: createdAt ?? this.createdAt,
      deliveredAt: deliveredAt ?? this.deliveredAt,
    );
  }
}