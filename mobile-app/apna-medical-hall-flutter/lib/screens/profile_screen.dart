import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../utils/constants.dart';
import '../widgets/custom_button.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, auth, child) {
          final user = auth.user;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppConstants.paddingMedium),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Profile Header
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(40),
                        ),
                        child: const Icon(
                          Icons.person,
                          size: 40,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        user?.name ?? 'User',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '+91 ${user?.phone ?? ''}',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // Menu Items
                _buildMenuItem(
                  icon: Icons.receipt_long,
                  title: 'My Orders',
                  subtitle: 'View your order history',
                  onTap: () => context.go('/orders'),
                ),

                _buildMenuItem(
                  icon: Icons.shopping_cart,
                  title: 'My Cart',
                  subtitle: 'View items in your cart',
                  onTap: () => context.go('/cart'),
                ),

                _buildMenuItem(
                  icon: Icons.upload_file,
                  title: 'Upload Prescription',
                  subtitle: 'Upload medical prescriptions',
                  onTap: () {
                    // Navigate to prescription upload
                  },
                ),

                _buildMenuItem(
                  icon: Icons.location_on,
                  title: 'Delivery Address',
                  subtitle: 'Manage delivery addresses',
                  onTap: () {
                    // Navigate to address management
                  },
                ),

                _buildMenuItem(
                  icon: Icons.notifications,
                  title: 'Notifications',
                  subtitle: 'Manage notification preferences',
                  onTap: () {
                    // Navigate to notifications settings
                  },
                ),

                _buildMenuItem(
                  icon: Icons.help,
                  title: 'Help & Support',
                  subtitle: 'Get help and contact support',
                  onTap: () {
                    // Navigate to help
                  },
                ),

                _buildMenuItem(
                  icon: Icons.info,
                  title: 'About',
                  subtitle: 'App version and information',
                  onTap: () {
                    _showAboutDialog(context);
                  },
                ),

                const SizedBox(height: 32),

                // Logout Button
                CustomButton(
                  text: 'Logout',
                  onPressed: () => _showLogoutDialog(context, auth),
                  backgroundColor: AppColors.error,
                ),

                const SizedBox(height: 16),

                // App Version
                Center(
                  child: Text(
                    'Version 1.0.0',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: AppColors.primary,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: AppColors.textPrimary,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: AppColors.textSecondary,
        ),
        onTap: onTap,
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('About Apna Medical Hall'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Version: 1.0.0'),
            SizedBox(height: 8),
            Text('Your trusted pharmacy partner'),
            SizedBox(height: 8),
            Text('📍 Barharia Road, Fakhruddinpur'),
            Text('Near Mazar Shareef, Siwan, Bihar'),
            SizedBox(height: 8),
            Text('📞 +91 8540009086'),
            Text('📧 apnamedicalhall2026@gmail.com'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context, AuthProvider auth) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              await auth.logout();
              if (context.mounted) {
                context.go('/login');
              }
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}