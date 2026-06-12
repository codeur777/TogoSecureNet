// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_UserModel _$UserModelFromJson(Map<String, dynamic> json) => _UserModel(
  id: json['id'] as String,
  email: json['email'] as String,
  firstName: json['first_name'] as String,
  lastName: json['last_name'] as String,
  phone: json['phone'] as String?,
  role: json['role'] as String,
  badgeNumber: json['badge_number'] as String?,
  rank: json['rank'] as String?,
  assignedZone: json['assigned_zone'] as String?,
  isActive: json['is_active'] as bool? ?? true,
  twoFactorEnabled: json['two_factor_enabled'] as bool? ?? false,
);

Map<String, dynamic> _$UserModelToJson(_UserModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'first_name': instance.firstName,
      'last_name': instance.lastName,
      'phone': instance.phone,
      'role': instance.role,
      'badge_number': instance.badgeNumber,
      'rank': instance.rank,
      'assigned_zone': instance.assignedZone,
      'is_active': instance.isActive,
      'two_factor_enabled': instance.twoFactorEnabled,
    };

_UserStatsModel _$UserStatsModelFromJson(Map<String, dynamic> json) =>
    _UserStatsModel(
      completedInterventions:
          (json['completed_interventions'] as num?)?.toInt() ?? 0,
      treatedAlerts: (json['treated_alerts'] as num?)?.toInt() ?? 0,
      averageResponseTime: json['average_response_time'] as String?,
      totalDistance: (json['total_distance'] as num?)?.toDouble() ?? 0.0,
    );

Map<String, dynamic> _$UserStatsModelToJson(_UserStatsModel instance) =>
    <String, dynamic>{
      'completed_interventions': instance.completedInterventions,
      'treated_alerts': instance.treatedAlerts,
      'average_response_time': instance.averageResponseTime,
      'total_distance': instance.totalDistance,
    };
