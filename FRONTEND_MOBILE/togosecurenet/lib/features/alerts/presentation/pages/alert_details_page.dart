import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/providers/alerts_provider.dart';
import '../../../../core/providers/intervention_provider.dart';
import '../../../../core/models/intervention_model.dart';
import '../../../../core/services/navigation_service.dart';
import '../../../../shared/widgets/map_widget.dart';

class AlertDetailsPage extends ConsumerStatefulWidget {
  final String alertId;

  const AlertDetailsPage({super.key, required this.alertId});

  @override
  ConsumerState<AlertDetailsPage> createState() => _AlertDetailsPageState();
}

class _AlertDetailsPageState extends ConsumerState<AlertDetailsPage> {
  final NavigationService _navigationService = NavigationService();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(alertsProvider.notifier).loadAlertDetails(widget.alertId);
      ref.read(alertsProvider.notifier).markAsRead(widget.alertId);
    });
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

  String _getGravityText(String gravity) {
    switch (gravity) {
      case 'tres_grave':
        return 'Très Grave';
      case 'grave':
        return 'Grave';
      default:
        return 'Modéré';
    }
  }

  @override
  Widget build(BuildContext context) {
    final alertsState = ref.watch(alertsProvider);
    final interventionState = ref.watch(interventionProvider);
    final alert = alertsState.selectedAlert;

    if (alertsState.isLoading || alert == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Détails de l\'alerte'),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final gravityColor = _getGravityColor(alert.niveauGravite);
    final hasActiveIntervention = interventionState.currentIntervention != null;
    final isThisAlertActive = interventionState.currentIntervention?.alertId == alert.id;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Détails de l\'alerte'),
        backgroundColor: gravityColor,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // En-tête
            Container(
              color: gravityColor,
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Icon(
                      alert.niveauGravite == 'tres_grave'
                          ? Icons.warning_rounded
                          : Icons.info_rounded,
                      color: gravityColor,
                      size: 48,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _getGravityText(alert.niveauGravite),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Contenu
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Type de détection
                  _InfoCard(
                    icon: Icons.category_rounded,
                    title: 'Type de détection',
                    content: alert.typeDetection ?? 'Non spécifié',
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Message
                  _InfoCard(
                    icon: Icons.message_rounded,
                    title: 'Message',
                    content: alert.message ?? 'Aucun message',
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Carte Google Maps
                  if (alert.localisation != null)
                    MapWidget(
                      targetLatitude: 6.1256, // TODO: Extraire lat/lng de alert.localisation
                      targetLongitude: 1.2219,
                      targetTitle: 'Point de détection',
                      height: 250,
                    ),
                  
                  const SizedBox(height: 16),
                  
                  // Localisation
                  _InfoCard(
                    icon: Icons.location_on_rounded,
                    title: 'Localisation',
                    content: alert.localisation ?? 'Position inconnue',
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Date d'émission
                  _InfoCard(
                    icon: Icons.access_time_rounded,
                    title: 'Date d\'émission',
                    content: _formatDateTime(alert.dateEmission),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Actions
                  if (isThisAlertActive) ...[
                    // Intervention déjà active
                    _buildActiveInterventionActions(),
                  ] else if (hasActiveIntervention) ...[
                    // Une autre intervention est active
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.orange[50],
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.orange[200]!),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.info_outline, color: Colors.orange[700]),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Une intervention est déjà en cours',
                              style: TextStyle(color: Colors.orange[900]),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ] else ...[
                    // Pas d'intervention active
                    _buildAcceptButton(alert),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAcceptButton(alert) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton.icon(
        onPressed: () {
          ref.read(interventionProvider.notifier).acceptIntervention(alert);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Intervention acceptée'),
              backgroundColor: Colors.green,
            ),
          );
          context.go('/');
        },
        icon: const Icon(Icons.check_circle, size: 24),
        label: const Text(
          'J\'accepte l\'intervention',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  Widget _buildActiveInterventionActions() {
    final intervention = ref.watch(interventionProvider).currentIntervention!;

    return Column(
      children: [
        // Démarrer navigation
        if (intervention.status == InterventionStatus.accepted) ...[
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: () {
                ref.read(interventionProvider.notifier).startNavigation();
                // Ouvrir Google Maps
                _navigationService.openGoogleMapsNavigation(
                  destinationLat: 6.1256, // TODO: Utiliser vraies coordonnées
                  destinationLng: 1.2219,
                );
              },
              icon: const Icon(Icons.navigation, size: 24),
              label: const Text(
                'Démarrer la navigation',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],

        // Marquer arrivé
        if (intervention.status == InterventionStatus.onTheWay) ...[
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: () {
                ref.read(interventionProvider.notifier).markArrived();
              },
              icon: const Icon(Icons.location_on, size: 24),
              label: const Text(
                'Je suis arrivé',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],

        if (intervention.status == InterventionStatus.arrived) ...[
          // Personne retrouvée
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: () {
                ref.read(interventionProvider.notifier).completeIntervention(
                  notes: 'Personne retrouvée',
                );
                context.go('/');
              },
              icon: const Icon(Icons.check_circle, size: 24),
              label: const Text(
                'Personne retrouvée',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          // Fausse alerte
          SizedBox(
            width: double.infinity,
            height: 56,
            child: OutlinedButton.icon(
              onPressed: () {
                ref.read(interventionProvider.notifier).markFalseAlarm(
                  reason: 'Fausse alerte signalée',
                );
                context.go('/');
              },
              icon: const Icon(Icons.cancel, size: 24),
              label: const Text(
                'Fausse alerte',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.orange,
                side: const BorderSide(color: Colors.orange, width: 2),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }

  String _formatDateTime(String? dateStr) {
    if (dateStr == null) return 'Non spécifié';
    
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day}/${date.month}/${date.year} à ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return dateStr;
    }
  }
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String content;

  const _InfoCard({
    required this.icon,
    required this.title,
    required this.content,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: AppColors.primary, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  content,
                  style: const TextStyle(
                    fontSize: 16,
                    color: AppColors.textDark,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
