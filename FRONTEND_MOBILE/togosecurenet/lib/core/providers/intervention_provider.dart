import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/intervention_model.dart';
import '../models/alert_model.dart';

// État des interventions
class InterventionState {
  final InterventionModel? currentIntervention;
  final List<InterventionModel> interventions;
  final bool isLoading;
  final String? error;

  InterventionState({
    this.currentIntervention,
    this.interventions = const [],
    this.isLoading = false,
    this.error,
  });

  InterventionState copyWith({
    InterventionModel? currentIntervention,
    bool clearCurrentIntervention = false,
    List<InterventionModel>? interventions,
    bool? isLoading,
    String? error,
  }) {
    return InterventionState(
      currentIntervention: clearCurrentIntervention
          ? null
          : currentIntervention ?? this.currentIntervention,
      interventions: interventions ?? this.interventions,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Riverpod 3.x : Notifier<T> remplace StateNotifier<T>
class InterventionNotifier extends Notifier<InterventionState> {
  @override
  InterventionState build() {
    return InterventionState();
  }

  void acceptIntervention(AlertModel alert) {
    final intervention = InterventionModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      alertId: alert.id,
      agentId: 'current_agent_id',
      status: InterventionStatus.accepted,
      startTime: DateTime.now(),
      alert: alert,
    );

    final updatedInterventions = [...state.interventions, intervention];

    state = state.copyWith(
      currentIntervention: intervention,
      interventions: updatedInterventions,
    );
  }

  void startNavigation() {
    if (state.currentIntervention == null) return;

    final updated = state.currentIntervention!.copyWith(
      status: InterventionStatus.onTheWay,
    );

    _updateCurrentIntervention(updated);
  }

  void markArrived() {
    if (state.currentIntervention == null) return;

    final updated = state.currentIntervention!.copyWith(
      status: InterventionStatus.arrived,
    );

    _updateCurrentIntervention(updated);
  }

  void completeIntervention({String? notes}) {
    if (state.currentIntervention == null) return;

    final updated = state.currentIntervention!.copyWith(
      status: InterventionStatus.completed,
      endTime: DateTime.now(),
      notes: notes,
    );

    _updateInterventionInList(updated);
    state = state.copyWith(clearCurrentIntervention: true);
  }

  void markFalseAlarm({String? reason}) {
    if (state.currentIntervention == null) return;

    final updated = state.currentIntervention!.copyWith(
      status: InterventionStatus.falseAlarm,
      endTime: DateTime.now(),
      notes: reason,
    );

    _updateInterventionInList(updated);
    state = state.copyWith(clearCurrentIntervention: true);
  }

  void cancelIntervention({String? reason}) {
    if (state.currentIntervention == null) return;

    final updated = state.currentIntervention!.copyWith(
      status: InterventionStatus.cancelled,
      endTime: DateTime.now(),
      notes: reason,
    );

    _updateInterventionInList(updated);
    state = state.copyWith(clearCurrentIntervention: true);
  }

  void _updateCurrentIntervention(InterventionModel intervention) {
    _updateInterventionInList(intervention);
    state = state.copyWith(currentIntervention: intervention);
  }

  void _updateInterventionInList(InterventionModel intervention) {
    final updatedList = state.interventions.map((i) {
      return i.id == intervention.id ? intervention : i;
    }).toList();

    state = state.copyWith(interventions: updatedList);
  }

  // Getters de statistiques
  int get todayInterventionsCount {
    final today = DateTime.now();
    return state.interventions.where((i) {
      final date = i.startTime ?? i.startedAt;
      if (date == null) return false;
      return date.year == today.year &&
          date.month == today.month &&
          date.day == today.day;
    }).length;
  }

  int get todayCompletedCount {
    final today = DateTime.now();
    return state.interventions.where((i) {
      final date = i.startTime ?? i.startedAt;
      if (date == null) return false;
      return i.status == InterventionStatus.completed &&
          date.year == today.year &&
          date.month == today.month &&
          date.day == today.day;
    }).length;
  }

  int get inProgressCount {
    return state.interventions.where((i) {
      return i.status == InterventionStatus.accepted ||
          i.status == InterventionStatus.onTheWay ||
          i.status == InterventionStatus.arrived;
    }).length;
  }

  bool get hasActiveIntervention => state.currentIntervention != null;
}

// Riverpod 3.x : NotifierProvider remplace StateNotifierProvider
final interventionProvider =
    NotifierProvider<InterventionNotifier, InterventionState>(
  InterventionNotifier.new,
);

// Provider dérivé : indique si une intervention est active
final hasActiveInterventionProvider = Provider<bool>((ref) {
  return ref.watch(interventionProvider).currentIntervention != null;
});