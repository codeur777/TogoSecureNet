import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/intervention_model.dart';
import '../models/alert_model.dart';

// StateNotifier pour gérer les interventions
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
    List<InterventionModel>? interventions,
    bool? isLoading,
    String? error,
  }) {
    return InterventionState(
      currentIntervention: currentIntervention ?? this.currentIntervention,
      interventions: interventions ?? this.interventions,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class InterventionNotifier extends StateNotifier<InterventionState> {
  InterventionNotifier() : super(InterventionState());

  void acceptIntervention(AlertModel alert) {
    final intervention = InterventionModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      alertId: alert.id,
      agentId: 'current_agent_id', // À remplacer par ID réel
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
    
    state = state.copyWith(currentIntervention: null);
  }

  void markFalseAlarm({String? reason}) {
    if (state.currentIntervention == null) return;
    
    final updated = state.currentIntervention!.copyWith(
      status: InterventionStatus.falseAlarm,
      endTime: DateTime.now(),
      notes: reason,
    );
    
    _updateInterventionInList(updated);
    
    state = state.copyWith(currentIntervention: null);
  }

  void cancelIntervention({String? reason}) {
    if (state.currentIntervention == null) return;
    
    final updated = state.currentIntervention!.copyWith(
      status: InterventionStatus.cancelled,
      endTime: DateTime.now(),
      notes: reason,
    );
    
    _updateInterventionInList(updated);
    
    state = state.copyWith(currentIntervention: null);
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

  // Statistiques
  int get todayInterventionsCount {
    final today = DateTime.now();
    return state.interventions.where((i) {
      return i.startTime.year == today.year &&
          i.startTime.month == today.month &&
          i.startTime.day == today.day;
    }).length;
  }

  int get todayCompletedCount {
    final today = DateTime.now();
    return state.interventions.where((i) {
      return i.status == InterventionStatus.completed &&
          i.startTime.year == today.year &&
          i.startTime.month == today.month &&
          i.startTime.day == today.day;
    }).length;
  }

  int get inProgressCount {
    return state.interventions.where((i) {
      return i.status == InterventionStatus.accepted ||
          i.status == InterventionStatus.onTheWay ||
          i.status == InterventionStatus.arrived;
    }).length;
  }

  bool get hasActiveIntervention {
    return state.currentIntervention != null;
  }
}

// Provider principal pour les interventions
final interventionProvider = StateNotifierProvider<InterventionNotifier, InterventionState>((ref) {
  return InterventionNotifier();
});

// Provider pour savoir si une intervention est active
final hasActiveInterventionProvider = Provider<bool>((ref) {
  final interventionState = ref.watch(interventionProvider);
  return interventionState.currentIntervention != null;
});
