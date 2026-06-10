import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/alert_model.dart';
import '../../features/alerts/data/alerts_service.dart';

// Provider pour AlertsService
final alertsServiceProvider = Provider<AlertsService>((ref) {
  return AlertsService();
});

// StateNotifier pour gérer les alertes
class AlertsState {
  final List<AlertModel> alerts;
  final AlertModel? selectedAlert;
  final bool isLoading;
  final String? error;
  final int unreadCount;

  AlertsState({
    this.alerts = const [],
    this.selectedAlert,
    this.isLoading = false,
    this.error,
    this.unreadCount = 0,
  });

  AlertsState copyWith({
    List<AlertModel>? alerts,
    AlertModel? selectedAlert,
    bool? isLoading,
    String? error,
    int? unreadCount,
  }) {
    return AlertsState(
      alerts: alerts ?? this.alerts,
      selectedAlert: selectedAlert ?? this.selectedAlert,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      unreadCount: unreadCount ?? this.unreadCount,
    );
  }
}

class AlertsNotifier extends StateNotifier<AlertsState> {
  final AlertsService _alertsService;

  AlertsNotifier(this._alertsService) : super(AlertsState());

  Future<void> loadAlerts({bool? estLue}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final alerts = await _alertsService.getAlerts(estLue: estLue);
      final unreadCount = await _alertsService.getUnreadCount();
      
      state = state.copyWith(
        alerts: alerts,
        unreadCount: unreadCount,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> loadAlertDetails(String alertId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final alert = await _alertsService.getAlertById(alertId);
      state = state.copyWith(
        selectedAlert: alert,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> markAsRead(String alertId) async {
    try {
      await _alertsService.markAsRead(alertId);
      
      // Mettre à jour localement
      final updatedAlerts = state.alerts.map((alert) {
        if (alert.id == alertId) {
          return alert.copyWith(estLue: true);
        }
        return alert;
      }).toList();
      
      final newUnreadCount = state.unreadCount > 0 ? state.unreadCount - 1 : 0;
      
      state = state.copyWith(
        alerts: updatedAlerts,
        unreadCount: newUnreadCount,
      );
      
      if (state.selectedAlert?.id == alertId) {
        state = state.copyWith(
          selectedAlert: state.selectedAlert!.copyWith(estLue: true),
        );
      }
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> refreshUnreadCount() async {
    try {
      final count = await _alertsService.getUnreadCount();
      state = state.copyWith(unreadCount: count);
    } catch (e) {
      // Ignore silently
    }
  }

  List<AlertModel> get unreadAlerts {
    return state.alerts.where((alert) => !alert.estLue).toList();
  }

  List<AlertModel> get readAlerts {
    return state.alerts.where((alert) => alert.estLue).toList();
  }

  List<AlertModel> get criticalAlerts {
    return state.alerts
        .where((alert) => alert.niveauGravite == 'tres_grave' && !alert.estLue)
        .toList();
  }
}

// Provider principal pour les alertes
final alertsProvider = StateNotifierProvider<AlertsNotifier, AlertsState>((ref) {
  final alertsService = ref.watch(alertsServiceProvider);
  return AlertsNotifier(alertsService);
});

// Providers utilitaires
final unreadAlertsProvider = Provider<List<AlertModel>>((ref) {
  final alertsState = ref.watch(alertsProvider);
  return alertsState.alerts.where((alert) => !alert.estLue).toList();
});

final criticalAlertsProvider = Provider<List<AlertModel>>((ref) {
  final alertsState = ref.watch(alertsProvider);
  return alertsState.alerts
      .where((alert) => alert.niveauGravite == 'tres_grave' && !alert.estLue)
      .toList();
});
