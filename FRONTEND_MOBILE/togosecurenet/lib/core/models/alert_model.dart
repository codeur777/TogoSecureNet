import 'package:freezed_annotation/freezed_annotation.dart';

part 'alert_model.freezed.dart';
part 'alert_model.g.dart';

enum AlertSeverity {
  @JsonValue('not_serious')
  notSerious,
  @JsonValue('serious')
  serious,
  @JsonValue('very_serious')
  verySerious,
}

enum AlertStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('accepted')
  accepted,
  @JsonValue('ongoing')
  ongoing,
  @JsonValue('completed')
  completed,
  @JsonValue('false_alert')
  falseAlert,
}

@freezed
class AlertModel with _$AlertModel {
  const factory AlertModel({
    required String id,
    @JsonKey(name: 'person_name') required String personName,
    @JsonKey(name: 'person_photo') String? personPhoto,
    required String? age,
    required String? gender,
    required String? description,
    required AlertSeverity severity,
    required AlertStatus status,
    required double latitude,
    required double longitude,
    @JsonKey(name: 'detection_time') required DateTime detectionTime,
    @JsonKey(name: 'reported_date') DateTime? reportedDate,
    @JsonKey(name: 'camera_id') String? cameraId,
    @JsonKey(name: 'camera_name') String? cameraName,
    @Default(0.0) double distance,
    @JsonKey(name: 'assigned_agent_id') String? assignedAgentId,
  }) = _AlertModel;

  factory AlertModel.fromJson(Map<String, dynamic> json) =>
      _$AlertModelFromJson(json);
}

extension AlertSeverityExtension on AlertSeverity {
  String get label {
    switch (this) {
      case AlertSeverity.notSerious:
        return 'Pas Grave';
      case AlertSeverity.serious:
        return 'Grave';
      case AlertSeverity.verySerious:
        return 'Très Grave';
    }
  }

  int get colorValue {
    switch (this) {
      case AlertSeverity.notSerious:
        return 0xFF16A34A; // Vert
      case AlertSeverity.serious:
        return 0xFFF59E0B; // Orange
      case AlertSeverity.verySerious:
        return 0xFFDC2626; // Rouge
    }
  }
}

extension AlertStatusExtension on AlertStatus {
  String get label {
    switch (this) {
      case AlertStatus.pending:
        return 'En attente';
      case AlertStatus.accepted:
        return 'Acceptée';
      case AlertStatus.ongoing:
        return 'En cours';
      case AlertStatus.completed:
        return 'Terminée';
      case AlertStatus.falseAlert:
        return 'Fausse alerte';
    }
  }
}
