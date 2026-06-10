import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';

final alertsServiceProvider = Provider<AlertsService>((ref) {
  return AlertsService(ref.read(dioProvider));
});

class AlertsService {
  final Dio _dio;

  AlertsService(this._dio);

  // Get all alerts (pour l'agent)
  Future<List<Map<String, dynamic>>> getAlerts({
    int? limit,
    int? offset,
    String? status,
  }) async {
    try {
      final response = await _dio.get(
        '/alertes',
        queryParameters: {
          if (limit != null) 'limit': limit,
          if (offset != null) 'offset': offset,
          if (status != null) 'status': status,
        },
      );
      return List<Map<String, dynamic>>.from(response.data);
    } catch (e) {
      rethrow;
    }
  }

  // Get alert by ID
  Future<Map<String, dynamic>> getAlertById(String alertId) async {
    try {
      final response = await _dio.get('/alertes/$alertId');
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Get detections (alertes générées par les caméras)
  Future<List<Map<String, dynamic>>> getDetections({
    int? limit,
    int? offset,
  }) async {
    try {
      final response = await _dio.get(
        '/detections',
        queryParameters: {
          if (limit != null) 'limit': limit,
          if (offset != null) 'offset': offset,
        },
      );
      return List<Map<String, dynamic>>.from(response.data);
    } catch (e) {
      rethrow;
    }
  }

  // Accept alert (démarrer une intervention)
  Future<Map<String, dynamic>> acceptAlert(String alertId) async {
    try {
      final response = await _dio.post(
        '/alertes/$alertId/accept',
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Update alert status
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

  // Mark as false alert
  Future<Map<String, dynamic>> markAsFalseAlert(String alertId) async {
    try {
      final response = await _dio.post(
        '/alertes/$alertId/false-alert',
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Mark person found
  Future<Map<String, dynamic>> markPersonFound(String alertId) async {
    try {
      final response = await _dio.post(
        '/alertes/$alertId/person-found',
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
