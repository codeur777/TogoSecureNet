import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/providers/auth_provider.dart';

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Paramètres'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Compte
          const _SectionHeader(title: 'Compte'),
          
          _SettingsTile(
            icon: Icons.person_rounded,
            title: 'Modifier le profil',
            onTap: () {
              // TODO: Navigation vers édition profil
            },
          ),
          
          _SettingsTile(
            icon: Icons.lock_rounded,
            title: 'Changer le mot de passe',
            onTap: () {
              // TODO: Navigation vers changement mot de passe
            },
          ),

          const Divider(height: 32),

          // Sécurité
          const _SectionHeader(title: 'Sécurité'),
          
          _SettingsTile(
            icon: Icons.security_rounded,
            title: 'Double authentification (2FA)',
            subtitle: user?.twoFactorEnabled == true ? 'Activé' : 'Désactivé',
            trailing: Switch(
              value: user?.twoFactorEnabled ?? false,
              activeColor: AppColors.primary,
              onChanged: (value) {
                // TODO: Toggle 2FA
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(value ? '2FA activé' : '2FA désactivé'),
                  ),
                );
              },
            ),
          ),

          const Divider(height: 32),

          // Notifications
          const _SectionHeader(title: 'Notifications'),
          
          _SettingsTile(
            icon: Icons.notifications_rounded,
            title: 'Notifications push',
            subtitle: 'Recevoir les alertes en temps réel',
            trailing: Switch(
              value: true,
              activeColor: AppColors.primary,
              onChanged: (value) {
                // TODO: Toggle notifications
              },
            ),
          ),
          
          _SettingsTile(
            icon: Icons.volume_up_rounded,
            title: 'Son des alertes',
            subtitle: 'Activer le son pour les alertes critiques',
            trailing: Switch(
              value: true,
              activeColor: AppColors.primary,
              onChanged: (value) {
                // TODO: Toggle sound
              },
            ),
          ),
          
          _SettingsTile(
            icon: Icons.vibration_rounded,
            title: 'Vibration',
            subtitle: 'Vibrer lors des nouvelles alertes',
            trailing: Switch(
              value: true,
              activeColor: AppColors.primary,
              onChanged: (value) {
                // TODO: Toggle vibration
              },
            ),
          ),

          const Divider(height: 32),

          // Apparence
          const _SectionHeader(title: 'Apparence'),
          
          _SettingsTile(
            icon: Icons.dark_mode_rounded,
            title: 'Thème',
            subtitle: 'Clair / Sombre / Système',
            onTap: () {
              _showThemeDialog(context);
            },
          ),

          const Divider(height: 32),

          // À propos
          const _SectionHeader(title: 'À propos'),
          
          _SettingsTile(
            icon: Icons.info_rounded,
            title: 'Version',
            subtitle: '1.0.0',
          ),
          
          _SettingsTile(
            icon: Icons.description_rounded,
            title: 'Conditions d\'utilisation',
            onTap: () {
              // TODO: Afficher conditions
            },
          ),
          
          _SettingsTile(
            icon: Icons.privacy_tip_rounded,
            title: 'Politique de confidentialité',
            onTap: () {
              // TODO: Afficher politique
            },
          ),

          const SizedBox(height: 32),

          // Déconnexion
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SizedBox(
              height: 56,
              child: OutlinedButton.icon(
                onPressed: () async {
                  final confirmed = await _showLogoutDialog(context);
                  if (confirmed == true) {
                    await ref.read(authProvider.notifier).logout();
                    if (context.mounted) {
                      context.go('/login');
                    }
                  }
                },
                icon: const Icon(Icons.logout_rounded),
                label: const Text(
                  'Se déconnecter',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.red,
                  side: const BorderSide(color: Colors.red, width: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Future<bool?> _showLogoutDialog(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Déconnexion'),
        content: const Text('Êtes-vous sûr de vouloir vous déconnecter ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Déconnecter'),
          ),
        ],
      ),
    );
  }

  void _showThemeDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choisir le thème'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile(
              title: const Text('Clair'),
              value: 'light',
              groupValue: 'system',
              onChanged: (value) {
                // TODO: Changer thème
                Navigator.pop(context);
              },
            ),
            RadioListTile(
              title: const Text('Sombre'),
              value: 'dark',
              groupValue: 'system',
              onChanged: (value) {
                // TODO: Changer thème
                Navigator.pop(context);
              },
            ),
            RadioListTile(
              title: const Text('Système'),
              value: 'system',
              groupValue: 'system',
              onChanged: (value) {
                // TODO: Changer thème
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: AppColors.primary,
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final Widget? trailing;

  const _SettingsTile({
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: AppColors.primary, size: 24),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle!,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            )
          : null,
      trailing: trailing ?? (onTap != null ? const Icon(Icons.chevron_right) : null),
      onTap: onTap,
    );
  }
}
