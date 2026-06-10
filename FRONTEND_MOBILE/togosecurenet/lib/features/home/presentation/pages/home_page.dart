import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/alerts_provider.dart';
import '../../../../core/providers/intervention_provider.dart';
import '../../../../shared/widgets/bottom_nav_bar.dart';
import '../../../alerts/presentation/pages/alerts_page.dart';
import '../../../profile/presentation/pages/profile_page.dart';
import '../../../settings/presentation/pages/settings_page.dart';
import '../widgets/stat_card.dart';
import '../widgets/active_intervention_card.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    // Charger les données au démarrage
    Future.microtask(() {
      ref.read(alertsProvider.notifier).loadAlerts();
    });
  }

  Widget _getCurrentPage() {
    switch (_currentIndex) {
      case 0:
        return _HomeContent();
      case 1:
        return const AlertsPage();
      case 2:
        return const ProfilePage();
      case 3:
        return const SettingsPage();
      default:
        return _HomeContent();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _getCurrentPage(),
      bottomNavigationBar: BottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}

class _HomeContent extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final alertsState = ref.watch(alertsProvider);
    final interventionState = ref.watch(interventionProvider);
    final user = authState.user;

    return RefreshIndicator(
      onRefresh: () async {
        await ref.read(alertsProvider.notifier).loadAlerts();
      },
      child: CustomScrollView(
        slivers: [
          // AppBar
          SliverAppBar(
            floating: true,
            backgroundColor: AppColors.primary,
            elevation: 0,
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Bonjour 👋',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white70,
                  ),
                ),
                Text(
                  '${user?.firstName ?? ''} ${user?.lastName ?? ''}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                icon: Stack(
                  children: [
                    const Icon(Icons.notifications_outlined, color: Colors.white),
                    if (alertsState.unreadCount > 0)
                      Positioned(
                        right: 0,
                        top: 0,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(
                            color: AppColors.alertDanger,
                            shape: BoxShape.circle,
                          ),
                          constraints: const BoxConstraints(
                            minWidth: 16,
                            minHeight: 16,
                          ),
                          child: Text(
                            '${alertsState.unreadCount}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                  ],
                ),
                onPressed: () {
                  context.push('/alerts');
                },
              ),
            ],
          ),

          // Contenu
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Statistiques
                  const Text(
                    'Aujourd\'hui',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  Row(
                    children: [
                      Expanded(
                        child: StatCard(
                          icon: Icons.notification_important_rounded,
                          label: 'Alertes reçues',
                          value: '${alertsState.unreadCount}',
                          color: AppColors.alertWarning,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: StatCard(
                          icon: Icons.pending_actions_rounded,
                          label: 'En cours',
                          value: '${interventionState.inProgressCount}',
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 12),
                  
                  Row(
                    children: [
                      Expanded(
                        child: StatCard(
                          icon: Icons.check_circle_rounded,
                          label: 'Terminées',
                          value: '${ref.read(interventionProvider.notifier).todayCompletedCount}',
                          color: Colors.green,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: StatCard(
                          icon: Icons.local_activity_rounded,
                          label: 'Total',
                          value: '${ref.read(interventionProvider.notifier).todayInterventionsCount}',
                          color: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Intervention active
                  if (interventionState.currentIntervention != null) ...[
                    const Text(
                      'Intervention en cours',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ActiveInterventionCard(
                      intervention: interventionState.currentIntervention!,
                    ),
                    const SizedBox(height: 24),
                  ],
                  
                  // Alertes récentes
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Alertes récentes',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textDark,
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          context.push('/alerts');
                        },
                        child: const Text('Voir tout'),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 12),
                  
                  if (alertsState.isLoading)
                    const Center(child: CircularProgressIndicator())
                  else if (alertsState.alerts.isEmpty)
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Column(
                          children: [
                            Icon(
                              Icons.notifications_off_outlined,
                              size: 64,
                              color: Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'Aucune alerte',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    ...alertsState.alerts.take(3).map((alert) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: alert.estLue
                                ? Colors.grey[300]!
                                : AppColors.primary,
                            width: alert.estLue ? 1 : 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: _getGravityColor(alert.niveauGravite).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                Icons.warning_rounded,
                                color: _getGravityColor(alert.niveauGravite),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    alert.typeDetection ?? 'Alerte',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w600,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    alert.message ?? 'Nouvelle détection',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[600],
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.arrow_forward_ios, size: 16),
                              onPressed: () {
                                context.push('/alerts/${alert.id}');
                              },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getGravityColor(String gravity) {
    switch (gravity) {
      case 'tres_grave':
        return AppColors.alertDanger;
      case 'grave':
        return AppColors.alertWarning;
      default:
        return AppColors.primary;
    }
  }
}
