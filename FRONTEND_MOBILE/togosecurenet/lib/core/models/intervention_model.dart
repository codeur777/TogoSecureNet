import 'package:freezed_annotation/freezed_annotation.dart';
import 'alert_model.dart';

part 'intervention_model.freezed.dart';
part 'intervention_model.g.dart';

enum InterventionStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('accepted')
  accepted,
  @JsonValue('on_the_way')
  onTheWay,
  @JsonValue('arrived')
  arrived,
  @JsonValue('completed')
  completed,
  @JsonValue('false_alarm')
  falseAlarm,
}

@freezed
class InterventionModel with _$InterventionModel {
  const factory InterventionModel({
    required String id,
    @JsonKey(name: 'alert_id') required String alertId,
    required AlertModel alert,
    @JsonKey(name: 'agent_id') required String agentId,
    required InterventionStatus status,
    @JsonKey(name: 'started_at') DateTime? startedAt,
    @JsonKey(name: 'arrived_at') DateTime? arrivedAt,
    @JsonKey(name: 'completed_at') DateTime? completedAt,
    @JsonKey(name: 'response_time') int? responseTime, // en secondes
    String? notes,
    @JsonKey(name: 'person_found') @Default(false) bool personFound,
    @JsonKey(name: 'false_alarm') @Default(false) bool falseAlarm,
  }) = _InterventionModel;

  factory InterventionModel.fromJson(Map<String, dynamic> json) =>
      _$InterventionModelFromJson(json);
}

extension InterventionStatusExtension on InterventionStatus {
  String get label {
    switch (this) {
      case InterventionStatus.pending:
        return 'En attente';
      case InterventionStatus.accepted:
        return 'Acceptée';
      case InterventionStatus.onTheWay:
        return 'En route';
      case InterventionStatus.arrived:
        return 'Sur place';
      case InterventionStatus.completed:
        return 'Terminée';
      case InterventionStatus.falseAlarm:
        return 'Fausse alerte';
    }
  }

  int get colorValue {
    switch (this) {
      case InterventionStatus.pending:
        return 0xFFF59E0B; // Orange
      case InterventionStatus.accepted:
        return 0xFF3B82F6; // Bleu
      case InterventionStatus.onTheWay:
        return 0xFF8B5CF6; // Violet
      case InterventionStatus.arrived:
        return 0xFF16A34A; // Vert
      case InterventionStatus.completed:
        return 0xFF10B981; // Vert foncé
      case InterventionStatus.falseAlarm:
        return 0xFFDC2626; // Rouge
    }
  }
}
