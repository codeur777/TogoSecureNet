import 'package:dio/dio.dart';
import '../../../core/models/alert_model.dart';

class AlertsService {
  final Dio _dio;

  AlertsService(this._dio);

  // Récupérer toutes les alertes
  Future<List<AlertModel>> getAlerts({AlertStatus? status}) async {
    try {
      final response = await _dio.get(
        '/alertes',
        queryParameters: {
          if (status != null) 'status': status.name,
        },
      );
      final List<dynamic> data = response.data is List
          ? response.data
          : (response.data['results'] ?? []);
      return data.map((e) => AlertModel.fromJson(e)).toList();
    } catch (e) {
      rethrow;
    }
  }

  // Récupérer une alerte par ID
  Future<AlertModel> getAlertById(String alertId) async {
    try {
      final response = await _dio.get('/alertes/$alertId');
      return AlertModel.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  // Accepter une alerte (démarrer intervention)
  Future<Map<String, dynamic>> acceptAlert(String alertId) async {
    try {
      final response = await _dio.post('/alertes/$alertId/accept');
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Mettre à jour le statut d'une alerte
  Future<Map<String, dynamic>> updateAlertStatus(
    String alertId,
    String status,
  ) async {
    try {
      final response = await _dio.patch(
        '/alertes/$alertId',
        data: {'status': status},
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Marquer comme fausse alerte
  Future<Map<String, dynamic>> markAsFalseAlert(String alertId) async {
    try {
      final response = await _dio.post('/alertes/$alertId/false-alert');
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Marquer comme lu
  Future<void> markAsRead(String alertId) async {
    try {
      await _dio.patch('/alertes/$alertId', data: {'is_read': true});
    } catch (e) {
      // Ignore silently
    }
  }

  // Compter les alertes non lues (pending)
  Future<int> getUnreadCount() async {
    try {
      final response = await _dio.get(
        '/alertes',
        queryParameters: {'status': 'pending'},
      );
      final List<dynamic> data = response.data is List
          ? response.data
          : (response.data['results'] ?? []);
      return data.length;
    } catch (e) {
      return 0;
    }
  }

  // Marquer personne retrouvée
  Future<Map<String, dynamic>> markPersonFound(String alertId) async {
    try {
      final response = await _dio.post('/alertes/$alertId/person-found');
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
