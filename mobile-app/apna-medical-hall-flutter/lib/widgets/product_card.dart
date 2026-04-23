import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';

import '../models/product.dart';
import '../providers/cart_provider.dart';
import '../utils/constants.dart';

class ProductCard extends StatelessWidget {
  final Product? product;
  final VoidCallback? onTap;

  const ProductCard({
    super.key,
    this.product,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    if (product == null) {
      return _buildPlaceholderCard();
    }

    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppConstants.borderRadius),
                  ),
                  color: AppColors.background,
                ),
                child: product!.imageUrl.isNotEmpty
                    ? CachedNetworkImage(
                        imageUrl: product!.imageUrl,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => const Center(
                          child: CircularProgressIndicator(),
                        ),
                        errorWidget: (context, url, error) => const Icon(
                          Icons.image_not_supported,
                          size: 40,
                          color: AppColors.textSecondary,
                        ),
                      )
                    : const Icon(
                        Icons.medical_services,
                        size: 40,
                        color: AppColors.textSecondary,
                      ),
              ),
            ),

            // Product Info
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.paddingSmall),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Product Name
                    Text(
                      product!.name,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),

                    const SizedBox(height: 4),

                    // Price
                    Text(
                      '${AppConstants.currency}${product!.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),

                    const Spacer(),

                    // Stock Status
                    Row(
                      children: [
                        Icon(
                          product!.isInStock ? Icons.check_circle : Icons.cancel,
                          size: 16,
                          color: product!.isInStock ? AppColors.success : AppColors.error,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          product!.isInStock ? 'In Stock' : 'Out of Stock',
                          style: TextStyle(
                            fontSize: 12,
                            color: product!.isInStock ? AppColors.success : AppColors.error,
                          ),
                        ),
                      ],
                    ),

                    // Prescription Required
                    if (product!.prescriptionRequired) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.warning,
                            size: 16,
                            color: AppColors.warning,
                          ),
                          const SizedBox(width: 4),
                          const Text(
                            'Prescription Required',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.warning,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),

            // Add to Cart Button
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.paddingSmall,
                vertical: AppConstants.paddingSmall,
              ),
              child: Consumer<CartProvider>(
                builder: (context, cart, child) {
                  final isInCart = cart.isInCart(product!.id);
                  final quantity = cart.getQuantity(product!.id);

                  return ElevatedButton(
                    onPressed: product!.isInStock
                        ? () {
                            if (isInCart) {
                              cart.removeItem(product!.id);
                            } else {
                              cart.addItem(product!);
                            }
                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isInCart ? AppColors.error : AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    child: Text(
                      isInCart ? 'Remove (${quantity})' : 'Add to Cart',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholderCard() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
      ),
      child: Column(
        children: [
          Expanded(
            flex: 3,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppConstants.borderRadius),
                ),
                color: AppColors.background,
              ),
              child: const Center(
                child: Icon(
                  Icons.medical_services,
                  size: 40,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.paddingSmall),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 14,
                    width: double.infinity,
                    color: AppColors.border,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    height: 16,
                    width: 80,
                    color: AppColors.border,
                  ),
                  const Spacer(),
                  Container(
                    height: 12,
                    width: 60,
                    color: AppColors.border,
                  ),
                ],
              ),
            ),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.paddingSmall,
              vertical: AppConstants.paddingSmall,
            ),
            child: ElevatedButton(
              onPressed: null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.border,
                padding: const EdgeInsets.symmetric(vertical: 8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6),
                ),
              ),
              child: const Text(
                'Loading...',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}