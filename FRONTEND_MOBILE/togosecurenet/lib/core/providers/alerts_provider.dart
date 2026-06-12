import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/alert_model.dart';
import '../network/dio_client.dart';
import '../../features/alerts/data/alerts_service.dart';

// Provider pour AlertsService
final alertsServiceProvider = Provider<AlertsService>((ref) {
  final dio = ref.watch(dioProvider);
  return AlertsService(dio);
});

// État des alertes
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

// Riverpod 3.x : Notifier<T>
class AlertsNotifier extends Notifier<AlertsState> {
  late AlertsService _alertsService;

  @override
  AlertsState build() {
    _alertsService = ref.watch(alertsServiceProvider);
    return AlertsState();
  }

  Future<void> loadAlerts({AlertStatus? status}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final alerts = await _alertsService.getAlerts(status: status);
      final unreadCount = await _alertsService.getUnreadCount();

      state = state.copyWith(
        alerts: alerts,
        unreadCount: unreadCount,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> loadAlertDetails(String alertId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final alert = await _alertsService.getAlertById(alertId);
      state = state.copyWith(selectedAlert: alert, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> markAsRead(String alertId) async {
    try {
      await _alertsService.markAsRead(alertId);

      final updatedAlerts = state.alerts.map((alert) {
        if (alert.id == alertId) {
          return alert.copyWith(status: AlertStatus.accepted);
        }
        return alert;
      }).toList();

      final newUnreadCount = state.unreadCount > 0 ? state.unreadCount - 1 : 0;
      state = state.copyWith(alerts: updatedAlerts, unreadCount: newUnreadCount);
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

  List<AlertModel> get pendingAlerts {
    return state.alerts.where((a) => a.status == AlertStatus.pending).toList();
  }

  List<AlertModel> get criticalAlerts {
    return state.alerts
        .where((a) =>
            a.severity == AlertSeverity.verySerious &&
            a.status == AlertStatus.pending)
        .toList();
  }
}

// Riverpod 3.x : NotifierProvider
final alertsProvider = NotifierProvider<AlertsNotifier, AlertsState>(
  AlertsNotifier.new,
);

// Providers dérivés
final pendingAlertsProvider = Provider<List<AlertModel>>((ref) {
  final alertsState = ref.watch(alertsProvider);
  return alertsState.alerts
      .where((alert) => alert.status == AlertStatus.pending)
      .toList();
});

final criticalAlertsProvider = Provider<List<AlertModel>>((ref) {
  final alertsState = ref.watch(alertsProvider);
  return alertsState.alerts
      .where((alert) =>
          alert.severity == AlertSeverity.verySerious &&
          alert.status == AlertStatus.pending)
      .toList();
});
