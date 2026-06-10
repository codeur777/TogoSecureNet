import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    @JsonKey(name: 'first_name') required String firstName,
    @JsonKey(name: 'last_name') required String lastName,
    required String? phone,
    required String role,
    @JsonKey(name: 'badge_number') String? badgeNumber,
    String? rank,
    @JsonKey(name: 'assigned_zone') String? assignedZone,
    @JsonKey(name: 'is_active') @Default(true) bool isActive,
    @JsonKey(name: 'two_factor_enabled') @Default(false) bool twoFactorEnabled,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

// Statistics Model
@freezed
class UserStatsModel with _$UserStatsModel {
  const factory UserStatsModel({
    @JsonKey(name: 'completed_interventions') @Default(0) int completedInterventions,
    @JsonKey(name: 'treated_alerts') @Default(0) int treatedAlerts,
    @JsonKey(name: 'average_response_time') String? averageResponseTime,
    @JsonKey(name: 'total_distance') @Default(0.0) double totalDistance,
  }) = _UserStatsModel;

  factory UserStatsModel.fromJson(Map<String, dynamic> json) =>
      _$UserStatsModelFromJson(json);
}
