// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'alert_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AlertModel _$AlertModelFromJson(Map<String, dynamic> json) => _AlertModel(
  id: json['id'] as String,
  personName: json['person_name'] as String,
  personPhoto: json['person_photo'] as String?,
  age: json['age'] as String?,
  gender: json['gender'] as String?,
  description: json['description'] as String?,
  severity: $enumDecode(_$AlertSeverityEnumMap, json['severity']),
  status: $enumDecode(_$AlertStatusEnumMap, json['status']),
  latitude: (json['latitude'] as num).toDouble(),
  longitude: (json['longitude'] as num).toDouble(),
  detectionTime: DateTime.parse(json['detection_time'] as String),
  reportedDate: json['reported_date'] == null
      ? null
      : DateTime.parse(json['reported_date'] as String),
  cameraId: json['camera_id'] as String?,
  cameraName: json['camera_name'] as String?,
  distance: (json['distance'] as num?)?.toDouble() ?? 0.0,
  assignedAgentId: json['assigned_agent_id'] as String?,
);

Map<String, dynamic> _$AlertModelToJson(_AlertModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'person_name': instance.personName,
      'person_photo': instance.personPhoto,
      'age': instance.age,
      'gender': instance.gender,
      'description': instance.description,
      'severity': _$AlertSeverityEnumMap[instance.severity]!,
      'status': _$AlertStatusEnumMap[instance.status]!,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'detection_time': instance.detectionTime.toIso8601String(),
      'reported_date': instance.reportedDate?.toIso8601String(),
      'camera_id': instance.cameraId,
      'camera_name': instance.cameraName,
      'distance': instance.distance,
      'assigned_agent_id': instance.assignedAgentId,
    };

const _$AlertSeverityEnumMap = {
  AlertSeverity.notSerious: 'not_serious',
  AlertSeverity.serious: 'serious',
  AlertSeverity.verySerious: 'very_serious',
};

const _$AlertStatusEnumMap = {
  AlertStatus.pending: 'pending',
  AlertStatus.accepted: 'accepted',
  AlertStatus.ongoing: 'ongoing',
  AlertStatus.completed: 'completed',
  AlertStatus.falseAlert: 'false_alert',
};
