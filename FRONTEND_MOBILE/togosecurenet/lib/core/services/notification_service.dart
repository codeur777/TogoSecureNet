import 'package:onesignal_flutter/onesignal_flutter.dart';
import 'package:flutter/material.dart';

class NotificationService {
  static const String ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID_HERE';

  // Initialiser OneSignal
  Future<void> initialize() async {
    // Configuration OneSignal
    OneSignal.initialize(ONESIGNAL_APP_ID);

    // Demander la permission pour les notifications
    await OneSignal.Notifications.requestPermission(true);

    // Écouter les événements de notification
    OneSignal.Notifications.addClickListener(_handleNotificationClick);
    OneSignal.Notifications.addForegroundWillDisplayListener(_handleNotificationReceived);
  }

  // Gérer le clic sur une notification
  void _handleNotificationClick(OSNotificationClickEvent event) {
    print('Notification cliquée: ${event.notification.additionalData}');
    
    // Extraire les données
    final data = event.notification.additionalData;
    
    // Navigation basée sur le type d'alerte
    if (data != null && data.containsKey('alert_id')) {
      final alertId = data['alert_id'];
      // TODO: Naviguer vers la page de détails de l'alerte
      print('Naviguer vers alerte: $alertId');
    }
  }

  // Gérer la réception d'une notification en premier plan
  void _handleNotificationReceived(OSNotificationWillDisplayEvent event) {
    print('Notification reçue: ${event.notification.title}');
    
    // Afficher la notification même en premier plan
    event.notification.display();
  }

  // Obtenir le Player ID (utilisateur unique)
  Future<String?> getPlayerId() async {
    final id = await OneSignal.User.getOnesignalId();
    return id;
  }

  // Associer un tag utilisateur (pour cibler les notifications)
  Future<void> setUserTags(Map<String, dynamic> tags) async {
    OneSignal.User.addTags(tags);
  }

  // Envoyer des tags pour le rôle de l'utilisateur
  Future<void> setUserRole(String userId, String role) async {
    await setUserTags({
      'user_id': userId,
      'role': role,
      'device': 'mobile',
    });
  }

  // Supprimer un tag
  Future<void> removeUserTag(String key) async {
    OneSignal.User.removeTag(key);
  }

  // Déconnexion (supprimer les tags)
  Future<void> logout() async {
    OneSignal.logout();
  }

  // Gérer l'affichage d'une notification critique (plein écran)
  Future<void> showCriticalAlert(BuildContext context, Map<String, dynamic> alertData) async {
    // Afficher une alerte rouge plein écran pour les alertes très graves
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.red,
        title: Row(
          children: [
            const Icon(Icons.warning_rounded, color: Colors.white, size: 32),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'ALERTE CRITIQUE',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              alertData['message'] ?? 'Nouvelle alerte très grave',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Localisation: ${alertData['location'] ?? 'Non spécifiée'}',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Ignorer',
              style: TextStyle(color: Colors.white70),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Naviguer vers détails de l'alerte
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.red,
            ),
            child: const Text('Voir immédiatement'),
          ),
        ],
      ),
    );
  }
}
