// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$UserModel {

 String get id; String get email;@JsonKey(name: 'first_name') String get firstName;@JsonKey(name: 'last_name') String get lastName; String? get phone; String get role;@JsonKey(name: 'badge_number') String? get badgeNumber; String? get rank;@JsonKey(name: 'assigned_zone') String? get assignedZone;@JsonKey(name: 'is_active') bool get isActive;@JsonKey(name: 'two_factor_enabled') bool get twoFactorEnabled;
/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserModelCopyWith<UserModel> get copyWith => _$UserModelCopyWithImpl<UserModel>(this as UserModel, _$identity);

  /// Serializes this UserModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserModel&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email)&&(identical(other.firstName, firstName) || other.firstName == firstName)&&(identical(other.lastName, lastName) || other.lastName == lastName)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.role, role) || other.role == role)&&(identical(other.badgeNumber, badgeNumber) || other.badgeNumber == badgeNumber)&&(identical(other.rank, rank) || other.rank == rank)&&(identical(other.assignedZone, assignedZone) || other.assignedZone == assignedZone)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.twoFactorEnabled, twoFactorEnabled) || other.twoFactorEnabled == twoFactorEnabled));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email,firstName,lastName,phone,role,badgeNumber,rank,assignedZone,isActive,twoFactorEnabled);

@override
String toString() {
  return 'UserModel(id: $id, email: $email, firstName: $firstName, lastName: $lastName, phone: $phone, role: $role, badgeNumber: $badgeNumber, rank: $rank, assignedZone: $assignedZone, isActive: $isActive, twoFactorEnabled: $twoFactorEnabled)';
}


}

/// @nodoc
abstract mixin class $UserModelCopyWith<$Res>  {
  factory $UserModelCopyWith(UserModel value, $Res Function(UserModel) _then) = _$UserModelCopyWithImpl;
@useResult
$Res call({
 String id, String email,@JsonKey(name: 'first_name') String firstName,@JsonKey(name: 'last_name') String lastName, String? phone, String role,@JsonKey(name: 'badge_number') String? badgeNumber, String? rank,@JsonKey(name: 'assigned_zone') String? assignedZone,@JsonKey(name: 'is_active') bool isActive,@JsonKey(name: 'two_factor_enabled') bool twoFactorEnabled
});




}
/// @nodoc
class _$UserModelCopyWithImpl<$Res>
    implements $UserModelCopyWith<$Res> {
  _$UserModelCopyWithImpl(this._self, this._then);

  final UserModel _self;
  final $Res Function(UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? email = null,Object? firstName = null,Object? lastName = null,Object? phone = freezed,Object? role = null,Object? badgeNumber = freezed,Object? rank = freezed,Object? assignedZone = freezed,Object? isActive = null,Object? twoFactorEnabled = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,firstName: null == firstName ? _self.firstName : firstName // ignore: cast_nullable_to_non_nullable
as String,lastName: null == lastName ? _self.lastName : lastName // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as String,badgeNumber: freezed == badgeNumber ? _self.badgeNumber : badgeNumber // ignore: cast_nullable_to_non_nullable
as String?,rank: freezed == rank ? _self.rank : rank // ignore: cast_nullable_to_non_nullable
as String?,assignedZone: freezed == assignedZone ? _self.assignedZone : assignedZone // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,twoFactorEnabled: null == twoFactorEnabled ? _self.twoFactorEnabled : twoFactorEnabled // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [UserModel].
extension UserModelPatterns on UserModel {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserModel value)  $default,){
final _that = this;
switch (_that) {
case _UserModel():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserModel value)?  $default,){
final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String email, @JsonKey(name: 'first_name')  String firstName, @JsonKey(name: 'last_name')  String lastName,  String? phone,  String role, @JsonKey(name: 'badge_number')  String? badgeNumber,  String? rank, @JsonKey(name: 'assigned_zone')  String? assignedZone, @JsonKey(name: 'is_active')  bool isActive, @JsonKey(name: 'two_factor_enabled')  bool twoFactorEnabled)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that.id,_that.email,_that.firstName,_that.lastName,_that.phone,_that.role,_that.badgeNumber,_that.rank,_that.assignedZone,_that.isActive,_that.twoFactorEnabled);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String email, @JsonKey(name: 'first_name')  String firstName, @JsonKey(name: 'last_name')  String lastName,  String? phone,  String role, @JsonKey(name: 'badge_number')  String? badgeNumber,  String? rank, @JsonKey(name: 'assigned_zone')  String? assignedZone, @JsonKey(name: 'is_active')  bool isActive, @JsonKey(name: 'two_factor_enabled')  bool twoFactorEnabled)  $default,) {final _that = this;
switch (_that) {
case _UserModel():
return $default(_that.id,_that.email,_that.firstName,_that.lastName,_that.phone,_that.role,_that.badgeNumber,_that.rank,_that.assignedZone,_that.isActive,_that.twoFactorEnabled);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String email, @JsonKey(name: 'first_name')  String firstName, @JsonKey(name: 'last_name')  String lastName,  String? phone,  String role, @JsonKey(name: 'badge_number')  String? badgeNumber,  String? rank, @JsonKey(name: 'assigned_zone')  String? assignedZone, @JsonKey(name: 'is_active')  bool isActive, @JsonKey(name: 'two_factor_enabled')  bool twoFactorEnabled)?  $default,) {final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that.id,_that.email,_that.firstName,_that.lastName,_that.phone,_that.role,_that.badgeNumber,_that.rank,_that.assignedZone,_that.isActive,_that.twoFactorEnabled);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserModel implements UserModel {
  const _UserModel({required this.id, required this.email, @JsonKey(name: 'first_name') required this.firstName, @JsonKey(name: 'last_name') required this.lastName, required this.phone, required this.role, @JsonKey(name: 'badge_number') this.badgeNumber, this.rank, @JsonKey(name: 'assigned_zone') this.assignedZone, @JsonKey(name: 'is_active') this.isActive = true, @JsonKey(name: 'two_factor_enabled') this.twoFactorEnabled = false});
  factory _UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);

@override final  String id;
@override final  String email;
@override@JsonKey(name: 'first_name') final  String firstName;
@override@JsonKey(name: 'last_name') final  String lastName;
@override final  String? phone;
@override final  String role;
@override@JsonKey(name: 'badge_number') final  String? badgeNumber;
@override final  String? rank;
@override@JsonKey(name: 'assigned_zone') final  String? assignedZone;
@override@JsonKey(name: 'is_active') final  bool isActive;
@override@JsonKey(name: 'two_factor_enabled') final  bool twoFactorEnabled;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserModelCopyWith<_UserModel> get copyWith => __$UserModelCopyWithImpl<_UserModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserModel&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email)&&(identical(other.firstName, firstName) || other.firstName == firstName)&&(identical(other.lastName, lastName) || other.lastName == lastName)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.role, role) || other.role == role)&&(identical(other.badgeNumber, badgeNumber) || other.badgeNumber == badgeNumber)&&(identical(other.rank, rank) || other.rank == rank)&&(identical(other.assignedZone, assignedZone) || other.assignedZone == assignedZone)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.twoFactorEnabled, twoFactorEnabled) || other.twoFactorEnabled == twoFactorEnabled));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email,firstName,lastName,phone,role,badgeNumber,rank,assignedZone,isActive,twoFactorEnabled);

@override
String toString() {
  return 'UserModel(id: $id, email: $email, firstName: $firstName, lastName: $lastName, phone: $phone, role: $role, badgeNumber: $badgeNumber, rank: $rank, assignedZone: $assignedZone, isActive: $isActive, twoFactorEnabled: $twoFactorEnabled)';
}


}

/// @nodoc
abstract mixin class _$UserModelCopyWith<$Res> implements $UserModelCopyWith<$Res> {
  factory _$UserModelCopyWith(_UserModel value, $Res Function(_UserModel) _then) = __$UserModelCopyWithImpl;
@override @useResult
$Res call({
 String id, String email,@JsonKey(name: 'first_name') String firstName,@JsonKey(name: 'last_name') String lastName, String? phone, String role,@JsonKey(name: 'badge_number') String? badgeNumber, String? rank,@JsonKey(name: 'assigned_zone') String? assignedZone,@JsonKey(name: 'is_active') bool isActive,@JsonKey(name: 'two_factor_enabled') bool twoFactorEnabled
});




}
/// @nodoc
class __$UserModelCopyWithImpl<$Res>
    implements _$UserModelCopyWith<$Res> {
  __$UserModelCopyWithImpl(this._self, this._then);

  final _UserModel _self;
  final $Res Function(_UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? email = null,Object? firstName = null,Object? lastName = null,Object? phone = freezed,Object? role = null,Object? badgeNumber = freezed,Object? rank = freezed,Object? assignedZone = freezed,Object? isActive = null,Object? twoFactorEnabled = null,}) {
  return _then(_UserModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,firstName: null == firstName ? _self.firstName : firstName // ignore: cast_nullable_to_non_nullable
as String,lastName: null == lastName ? _self.lastName : lastName // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as String,badgeNumber: freezed == badgeNumber ? _self.badgeNumber : badgeNumber // ignore: cast_nullable_to_non_nullable
as String?,rank: freezed == rank ? _self.rank : rank // ignore: cast_nullable_to_non_nullable
as String?,assignedZone: freezed == assignedZone ? _self.assignedZone : assignedZone // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,twoFactorEnabled: null == twoFactorEnabled ? _self.twoFactorEnabled : twoFactorEnabled // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$UserStatsModel {

@JsonKey(name: 'completed_interventions') int get completedInterventions;@JsonKey(name: 'treated_alerts') int get treatedAlerts;@JsonKey(name: 'average_response_time') String? get averageResponseTime;@JsonKey(name: 'total_distance') double get totalDistance;
/// Create a copy of UserStatsModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserStatsModelCopyWith<UserStatsModel> get copyWith => _$UserStatsModelCopyWithImpl<UserStatsModel>(this as UserStatsModel, _$identity);

  /// Serializes this UserStatsModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserStatsModel&&(identical(other.completedInterventions, completedInterventions) || other.completedInterventions == completedInterventions)&&(identical(other.treatedAlerts, treatedAlerts) || other.treatedAlerts == treatedAlerts)&&(identical(other.averageResponseTime, averageResponseTime) || other.averageResponseTime == averageResponseTime)&&(identical(other.totalDistance, totalDistance) || other.totalDistance == totalDistance));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,completedInterventions,treatedAlerts,averageResponseTime,totalDistance);

@override
String toString() {
  return 'UserStatsModel(completedInterventions: $completedInterventions, treatedAlerts: $treatedAlerts, averageResponseTime: $averageResponseTime, totalDistance: $totalDistance)';
}


}

/// @nodoc
abstract mixin class $UserStatsModelCopyWith<$Res>  {
  factory $UserStatsModelCopyWith(UserStatsModel value, $Res Function(UserStatsModel) _then) = _$UserStatsModelCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'completed_interventions') int completedInterventions,@JsonKey(name: 'treated_alerts') int treatedAlerts,@JsonKey(name: 'average_response_time') String? averageResponseTime,@JsonKey(name: 'total_distance') double totalDistance
});




}
/// @nodoc
class _$UserStatsModelCopyWithImpl<$Res>
    implements $UserStatsModelCopyWith<$Res> {
  _$UserStatsModelCopyWithImpl(this._self, this._then);

  final UserStatsModel _self;
  final $Res Function(UserStatsModel) _then;

/// Create a copy of UserStatsModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? completedInterventions = null,Object? treatedAlerts = null,Object? averageResponseTime = freezed,Object? totalDistance = null,}) {
  return _then(_self.copyWith(
completedInterventions: null == completedInterventions ? _self.completedInterventions : completedInterventions // ignore: cast_nullable_to_non_nullable
as int,treatedAlerts: null == treatedAlerts ? _self.treatedAlerts : treatedAlerts // ignore: cast_nullable_to_non_nullable
as int,averageResponseTime: freezed == averageResponseTime ? _self.averageResponseTime : averageResponseTime // ignore: cast_nullable_to_non_nullable
as String?,totalDistance: null == totalDistance ? _self.totalDistance : totalDistance // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [UserStatsModel].
extension UserStatsModelPatterns on UserStatsModel {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserStatsModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserStatsModel() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserStatsModel value)  $default,){
final _that = this;
switch (_that) {
case _UserStatsModel():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserStatsModel value)?  $default,){
final _that = this;
switch (_that) {
case _UserStatsModel() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'completed_interventions')  int completedInterventions, @JsonKey(name: 'treated_alerts')  int treatedAlerts, @JsonKey(name: 'average_response_time')  String? averageResponseTime, @JsonKey(name: 'total_distance')  double totalDistance)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserStatsModel() when $default != null:
return $default(_that.completedInterventions,_that.treatedAlerts,_that.averageResponseTime,_that.totalDistance);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'completed_interventions')  int completedInterventions, @JsonKey(name: 'treated_alerts')  int treatedAlerts, @JsonKey(name: 'average_response_time')  String? averageResponseTime, @JsonKey(name: 'total_distance')  double totalDistance)  $default,) {final _that = this;
switch (_that) {
case _UserStatsModel():
return $default(_that.completedInterventions,_that.treatedAlerts,_that.averageResponseTime,_that.totalDistance);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'completed_interventions')  int completedInterventions, @JsonKey(name: 'treated_alerts')  int treatedAlerts, @JsonKey(name: 'average_response_time')  String? averageResponseTime, @JsonKey(name: 'total_distance')  double totalDistance)?  $default,) {final _that = this;
switch (_that) {
case _UserStatsModel() when $default != null:
return $default(_that.completedInterventions,_that.treatedAlerts,_that.averageResponseTime,_that.totalDistance);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserStatsModel implements UserStatsModel {
  const _UserStatsModel({@JsonKey(name: 'completed_interventions') this.completedInterventions = 0, @JsonKey(name: 'treated_alerts') this.treatedAlerts = 0, @JsonKey(name: 'average_response_time') this.averageResponseTime, @JsonKey(name: 'total_distance') this.totalDistance = 0.0});
  factory _UserStatsModel.fromJson(Map<String, dynamic> json) => _$UserStatsModelFromJson(json);

@override@JsonKey(name: 'completed_interventions') final  int completedInterventions;
@override@JsonKey(name: 'treated_alerts') final  int treatedAlerts;
@override@JsonKey(name: 'average_response_time') final  String? averageResponseTime;
@override@JsonKey(name: 'total_distance') final  double totalDistance;

/// Create a copy of UserStatsModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserStatsModelCopyWith<_UserStatsModel> get copyWith => __$UserStatsModelCopyWithImpl<_UserStatsModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserStatsModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserStatsModel&&(identical(other.completedInterventions, completedInterventions) || other.completedInterventions == completedInterventions)&&(identical(other.treatedAlerts, treatedAlerts) || other.treatedAlerts == treatedAlerts)&&(identical(other.averageResponseTime, averageResponseTime) || other.averageResponseTime == averageResponseTime)&&(identical(other.totalDistance, totalDistance) || other.totalDistance == totalDistance));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,completedInterventions,treatedAlerts,averageResponseTime,totalDistance);

@override
String toString() {
  return 'UserStatsModel(completedInterventions: $completedInterventions, treatedAlerts: $treatedAlerts, averageResponseTime: $averageResponseTime, totalDistance: $totalDistance)';
}


}

/// @nodoc
abstract mixin class _$UserStatsModelCopyWith<$Res> implements $UserStatsModelCopyWith<$Res> {
  factory _$UserStatsModelCopyWith(_UserStatsModel value, $Res Function(_UserStatsModel) _then) = __$UserStatsModelCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'completed_interventions') int completedInterventions,@JsonKey(name: 'treated_alerts') int treatedAlerts,@JsonKey(name: 'average_response_time') String? averageResponseTime,@JsonKey(name: 'total_distance') double totalDistance
});




}
/// @nodoc
class __$UserStatsModelCopyWithImpl<$Res>
    implements _$UserStatsModelCopyWith<$Res> {
  __$UserStatsModelCopyWithImpl(this._self, this._then);

  final _UserStatsModel _self;
  final $Res Function(_UserStatsModel) _then;

/// Create a copy of UserStatsModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? completedInterventions = null,Object? treatedAlerts = null,Object? averageResponseTime = freezed,Object? totalDistance = null,}) {
  return _then(_UserStatsModel(
completedInterventions: null == completedInterventions ? _self.completedInterventions : completedInterventions // ignore: cast_nullable_to_non_nullable
as int,treatedAlerts: null == treatedAlerts ? _self.treatedAlerts : treatedAlerts // ignore: cast_nullable_to_non_nullable
as int,averageResponseTime: freezed == averageResponseTime ? _self.averageResponseTime : averageResponseTime // ignore: cast_nullable_to_non_nullable
as String?,totalDistance: null == totalDistance ? _self.totalDistance : totalDistance // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
