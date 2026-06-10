import 'package:url_launcher/url_launcher.dart';

class NavigationService {
  // Ouvrir Google Maps avec itinéraire
  Future<void> openGoogleMapsNavigation({
    required double destinationLat,
    required double destinationLng,
    String? label,
  }) async {
    final googleMapsUrl = Uri.parse(
      'google.navigation:q=$destinationLat,$destinationLng&mode=d',
    );

    // Fallback vers URL web si l'app n'est pas installée
    final webUrl = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=$destinationLat,$destinationLng&travelmode=driving',
    );

    try {
      if (await canLaunchUrl(googleMapsUrl)) {
        await launchUrl(googleMapsUrl);
      } else if (await canLaunchUrl(webUrl)) {
        await launchUrl(webUrl, mode: LaunchMode.externalApplication);
      } else {
        throw 'Impossible d\'ouvrir Google Maps';
      }
    } catch (e) {
      print('Erreur lors de l\'ouverture de Google Maps: $e');
      rethrow;
    }
  }

  // Ouvrir Waze
  Future<void> openWazeNavigation({
    required double destinationLat,
    required double destinationLng,
  }) async {
    final wazeUrl = Uri.parse(
      'waze://?ll=$destinationLat,$destinationLng&navigate=yes',
    );

    try {
      if (await canLaunchUrl(wazeUrl)) {
        await launchUrl(wazeUrl);
      } else {
        throw 'Waze n\'est pas installé';
      }
    } catch (e) {
      print('Erreur lors de l\'ouverture de Waze: $e');
      rethrow;
    }
  }

  // Afficher les options de navigation
  Future<void> showNavigationOptions({
    required double destinationLat,
    required double destinationLng,
    required Function(String) onError,
  }) async {
    // Par défaut, essayer Google Maps
    try {
      await openGoogleMapsNavigation(
        destinationLat: destinationLat,
        destinationLng: destinationLng,
      );
    } catch (e) {
      onError('Impossible d\'ouvrir la navigation: $e');
    }
  }
}
