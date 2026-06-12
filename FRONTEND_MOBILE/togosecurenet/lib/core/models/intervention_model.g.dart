// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'intervention_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_InterventionModel _$InterventionModelFromJson(Map<String, dynamic> json) =>
    _InterventionModel(
      id: json['id'] as String,
      alertId: json['alert_id'] as String,
      alert: json['alert'] == null
          ? null
          : AlertModel.fromJson(json['alert'] as Map<String, dynamic>),
      agentId: json['agent_id'] as String,
      status: $enumDecode(_$InterventionStatusEnumMap, json['status']),
      startTime: json['start_time'] == null
          ? null
          : DateTime.parse(json['start_time'] as String),
      endTime: json['end_time'] == null
          ? null
          : DateTime.parse(json['end_time'] as String),
      startedAt: json['started_at'] == null
          ? null
          : DateTime.parse(json['started_at'] as String),
      arrivedAt: json['arrived_at'] == null
          ? null
          : DateTime.parse(json['arrived_at'] as String),
      completedAt: json['completed_at'] == null
          ? null
          : DateTime.parse(json['completed_at'] as String),
      responseTime: (json['response_time'] as num?)?.toInt(),
      notes: json['notes'] as String?,
      personFound: json['person_found'] as bool? ?? false,
      isFalseAlarm: json['false_alarm'] as bool? ?? false,
    );

Map<String, dynamic> _$InterventionModelToJson(_InterventionModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'alert_id': instance.alertId,
      'alert': instance.alert,
      'agent_id': instance.agentId,
      'status': _$InterventionStatusEnumMap[instance.status]!,
      'start_time': instance.startTime?.toIso8601String(),
      'end_time': instance.endTime?.toIso8601String(),
      'started_at': instance.startedAt?.toIso8601String(),
      'arrived_at': instance.arrivedAt?.toIso8601String(),
      'completed_at': instance.completedAt?.toIso8601String(),
      'response_time': instance.responseTime,
      'notes': instance.notes,
      'person_found': instance.personFound,
      'false_alarm': instance.isFalseAlarm,
    };

const _$InterventionStatusEnumMap = {
  InterventionStatus.pending: 'pending',
  InterventionStatus.accepted: 'accepted',
  InterventionStatus.onTheWay: 'on_the_way',
  InterventionStatus.arrived: 'arrived',
  InterventionStatus.completed: 'completed',
  InterventionStatus.falseAlarm: 'false_alarm',
  InterventionStatus.cancelled: 'cancelled',
};
