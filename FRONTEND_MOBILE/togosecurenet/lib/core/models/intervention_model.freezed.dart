// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'intervention_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$InterventionModel {

 String get id;@JsonKey(name: 'alert_id') String get alertId; AlertModel? get alert;@JsonKey(name: 'agent_id') String get agentId; InterventionStatus get status;@JsonKey(name: 'start_time') DateTime? get startTime;@JsonKey(name: 'end_time') DateTime? get endTime;@JsonKey(name: 'started_at') DateTime? get startedAt;@JsonKey(name: 'arrived_at') DateTime? get arrivedAt;@JsonKey(name: 'completed_at') DateTime? get completedAt;@JsonKey(name: 'response_time') int? get responseTime;// en secondes
 String? get notes;@JsonKey(name: 'person_found') bool get personFound;@JsonKey(name: 'false_alarm') bool get isFalseAlarm;
/// Create a copy of InterventionModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$InterventionModelCopyWith<InterventionModel> get copyWith => _$InterventionModelCopyWithImpl<InterventionModel>(this as InterventionModel, _$identity);

  /// Serializes this InterventionModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is InterventionModel&&(identical(other.id, id) || other.id == id)&&(identical(other.alertId, alertId) || other.alertId == alertId)&&(identical(other.alert, alert) || other.alert == alert)&&(identical(other.agentId, agentId) || other.agentId == agentId)&&(identical(other.status, status) || other.status == status)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.startedAt, startedAt) || other.startedAt == startedAt)&&(identical(other.arrivedAt, arrivedAt) || other.arrivedAt == arrivedAt)&&(identical(other.completedAt, completedAt) || other.completedAt == completedAt)&&(identical(other.responseTime, responseTime) || other.responseTime == responseTime)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.personFound, personFound) || other.personFound == personFound)&&(identical(other.isFalseAlarm, isFalseAlarm) || other.isFalseAlarm == isFalseAlarm));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,alertId,alert,agentId,status,startTime,endTime,startedAt,arrivedAt,completedAt,responseTime,notes,personFound,isFalseAlarm);

@override
String toString() {
  return 'InterventionModel(id: $id, alertId: $alertId, alert: $alert, agentId: $agentId, status: $status, startTime: $startTime, endTime: $endTime, startedAt: $startedAt, arrivedAt: $arrivedAt, completedAt: $completedAt, responseTime: $responseTime, notes: $notes, personFound: $personFound, isFalseAlarm: $isFalseAlarm)';
}


}

/// @nodoc
abstract mixin class $InterventionModelCopyWith<$Res>  {
  factory $InterventionModelCopyWith(InterventionModel value, $Res Function(InterventionModel) _then) = _$InterventionModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'alert_id') String alertId, AlertModel? alert,@JsonKey(name: 'agent_id') String agentId, InterventionStatus status,@JsonKey(name: 'start_time') DateTime? startTime,@JsonKey(name: 'end_time') DateTime? endTime,@JsonKey(name: 'started_at') DateTime? startedAt,@JsonKey(name: 'arrived_at') DateTime? arrivedAt,@JsonKey(name: 'completed_at') DateTime? completedAt,@JsonKey(name: 'response_time') int? responseTime, String? notes,@JsonKey(name: 'person_found') bool personFound,@JsonKey(name: 'false_alarm') bool isFalseAlarm
});


$AlertModelCopyWith<$Res>? get alert;

}
/// @nodoc
class _$InterventionModelCopyWithImpl<$Res>
    implements $InterventionModelCopyWith<$Res> {
  _$InterventionModelCopyWithImpl(this._self, this._then);

  final InterventionModel _self;
  final $Res Function(InterventionModel) _then;

/// Create a copy of InterventionModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? alertId = null,Object? alert = freezed,Object? agentId = null,Object? status = null,Object? startTime = freezed,Object? endTime = freezed,Object? startedAt = freezed,Object? arrivedAt = freezed,Object? completedAt = freezed,Object? responseTime = freezed,Object? notes = freezed,Object? personFound = null,Object? isFalseAlarm = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,alertId: null == alertId ? _self.alertId : alertId // ignore: cast_nullable_to_non_nullable
as String,alert: freezed == alert ? _self.alert : alert // ignore: cast_nullable_to_non_nullable
as AlertModel?,agentId: null == agentId ? _self.agentId : agentId // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as InterventionStatus,startTime: freezed == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as DateTime?,endTime: freezed == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as DateTime?,startedAt: freezed == startedAt ? _self.startedAt : startedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,arrivedAt: freezed == arrivedAt ? _self.arrivedAt : arrivedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,completedAt: freezed == completedAt ? _self.completedAt : completedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,responseTime: freezed == responseTime ? _self.responseTime : responseTime // ignore: cast_nullable_to_non_nullable
as int?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,personFound: null == personFound ? _self.personFound : personFound // ignore: cast_nullable_to_non_nullable
as bool,isFalseAlarm: null == isFalseAlarm ? _self.isFalseAlarm : isFalseAlarm // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}
/// Create a copy of InterventionModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AlertModelCopyWith<$Res>? get alert {
    if (_self.alert == null) {
    return null;
  }

  return $AlertModelCopyWith<$Res>(_self.alert!, (value) {
    return _then(_self.copyWith(alert: value));
  });
}
}


/// Adds pattern-matching-related methods to [InterventionModel].
extension InterventionModelPatterns on InterventionModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _InterventionModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _InterventionModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _InterventionModel value)  $default,){
final _that = this;
switch (_that) {
case _InterventionModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _InterventionModel value)?  $default,){
final _that = this;
switch (_that) {
case _InterventionModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'alert_id')  String alertId,  AlertModel? alert, @JsonKey(name: 'agent_id')  String agentId,  InterventionStatus status, @JsonKey(name: 'start_time')  DateTime? startTime, @JsonKey(name: 'end_time')  DateTime? endTime, @JsonKey(name: 'started_at')  DateTime? startedAt, @JsonKey(name: 'arrived_at')  DateTime? arrivedAt, @JsonKey(name: 'completed_at')  DateTime? completedAt, @JsonKey(name: 'response_time')  int? responseTime,  String? notes, @JsonKey(name: 'person_found')  bool personFound, @JsonKey(name: 'false_alarm')  bool isFalseAlarm)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _InterventionModel() when $default != null:
return $default(_that.id,_that.alertId,_that.alert,_that.agentId,_that.status,_that.startTime,_that.endTime,_that.startedAt,_that.arrivedAt,_that.completedAt,_that.responseTime,_that.notes,_that.personFound,_that.isFalseAlarm);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'alert_id')  String alertId,  AlertModel? alert, @JsonKey(name: 'agent_id')  String agentId,  InterventionStatus status, @JsonKey(name: 'start_time')  DateTime? startTime, @JsonKey(name: 'end_time')  DateTime? endTime, @JsonKey(name: 'started_at')  DateTime? startedAt, @JsonKey(name: 'arrived_at')  DateTime? arrivedAt, @JsonKey(name: 'completed_at')  DateTime? completedAt, @JsonKey(name: 'response_time')  int? responseTime,  String? notes, @JsonKey(name: 'person_found')  bool personFound, @JsonKey(name: 'false_alarm')  bool isFalseAlarm)  $default,) {final _that = this;
switch (_that) {
case _InterventionModel():
return $default(_that.id,_that.alertId,_that.alert,_that.agentId,_that.status,_that.startTime,_that.endTime,_that.startedAt,_that.arrivedAt,_that.completedAt,_that.responseTime,_that.notes,_that.personFound,_that.isFalseAlarm);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'alert_id')  String alertId,  AlertModel? alert, @JsonKey(name: 'agent_id')  String agentId,  InterventionStatus status, @JsonKey(name: 'start_time')  DateTime? startTime, @JsonKey(name: 'end_time')  DateTime? endTime, @JsonKey(name: 'started_at')  DateTime? startedAt, @JsonKey(name: 'arrived_at')  DateTime? arrivedAt, @JsonKey(name: 'completed_at')  DateTime? completedAt, @JsonKey(name: 'response_time')  int? responseTime,  String? notes, @JsonKey(name: 'person_found')  bool personFound, @JsonKey(name: 'false_alarm')  bool isFalseAlarm)?  $default,) {final _that = this;
switch (_that) {
case _InterventionModel() when $default != null:
return $default(_that.id,_that.alertId,_that.alert,_that.agentId,_that.status,_that.startTime,_that.endTime,_that.startedAt,_that.arrivedAt,_that.completedAt,_that.responseTime,_that.notes,_that.personFound,_that.isFalseAlarm);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _InterventionModel implements InterventionModel {
  const _InterventionModel({required this.id, @JsonKey(name: 'alert_id') required this.alertId, required this.alert, @JsonKey(name: 'agent_id') required this.agentId, required this.status, @JsonKey(name: 'start_time') this.startTime, @JsonKey(name: 'end_time') this.endTime, @JsonKey(name: 'started_at') this.startedAt, @JsonKey(name: 'arrived_at') this.arrivedAt, @JsonKey(name: 'completed_at') this.completedAt, @JsonKey(name: 'response_time') this.responseTime, this.notes, @JsonKey(name: 'person_found') this.personFound = false, @JsonKey(name: 'false_alarm') this.isFalseAlarm = false});
  factory _InterventionModel.fromJson(Map<String, dynamic> json) => _$InterventionModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'alert_id') final  String alertId;
@override final  AlertModel? alert;
@override@JsonKey(name: 'agent_id') final  String agentId;
@override final  InterventionStatus status;
@override@JsonKey(name: 'start_time') final  DateTime? startTime;
@override@JsonKey(name: 'end_time') final  DateTime? endTime;
@override@JsonKey(name: 'started_at') final  DateTime? startedAt;
@override@JsonKey(name: 'arrived_at') final  DateTime? arrivedAt;
@override@JsonKey(name: 'completed_at') final  DateTime? completedAt;
@override@JsonKey(name: 'response_time') final  int? responseTime;
// en secondes
@override final  String? notes;
@override@JsonKey(name: 'person_found') final  bool personFound;
@override@JsonKey(name: 'false_alarm') final  bool isFalseAlarm;

/// Create a copy of InterventionModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$InterventionModelCopyWith<_InterventionModel> get copyWith => __$InterventionModelCopyWithImpl<_InterventionModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$InterventionModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _InterventionModel&&(identical(other.id, id) || other.id == id)&&(identical(other.alertId, alertId) || other.alertId == alertId)&&(identical(other.alert, alert) || other.alert == alert)&&(identical(other.agentId, agentId) || other.agentId == agentId)&&(identical(other.status, status) || other.status == status)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.startedAt, startedAt) || other.startedAt == startedAt)&&(identical(other.arrivedAt, arrivedAt) || other.arrivedAt == arrivedAt)&&(identical(other.completedAt, completedAt) || other.completedAt == completedAt)&&(identical(other.responseTime, responseTime) || other.responseTime == responseTime)&&(identical(other.notes, notes) || other.notes == notes)&&(identical(other.personFound, personFound) || other.personFound == personFound)&&(identical(other.isFalseAlarm, isFalseAlarm) || other.isFalseAlarm == isFalseAlarm));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,alertId,alert,agentId,status,startTime,endTime,startedAt,arrivedAt,completedAt,responseTime,notes,personFound,isFalseAlarm);

@override
String toString() {
  return 'InterventionModel(id: $id, alertId: $alertId, alert: $alert, agentId: $agentId, status: $status, startTime: $startTime, endTime: $endTime, startedAt: $startedAt, arrivedAt: $arrivedAt, completedAt: $completedAt, responseTime: $responseTime, notes: $notes, personFound: $personFound, isFalseAlarm: $isFalseAlarm)';
}


}

/// @nodoc
abstract mixin class _$InterventionModelCopyWith<$Res> implements $InterventionModelCopyWith<$Res> {
  factory _$InterventionModelCopyWith(_InterventionModel value, $Res Function(_InterventionModel) _then) = __$InterventionModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'alert_id') String alertId, AlertModel? alert,@JsonKey(name: 'agent_id') String agentId, InterventionStatus status,@JsonKey(name: 'start_time') DateTime? startTime,@JsonKey(name: 'end_time') DateTime? endTime,@JsonKey(name: 'started_at') DateTime? startedAt,@JsonKey(name: 'arrived_at') DateTime? arrivedAt,@JsonKey(name: 'completed_at') DateTime? completedAt,@JsonKey(name: 'response_time') int? responseTime, String? notes,@JsonKey(name: 'person_found') bool personFound,@JsonKey(name: 'false_alarm') bool isFalseAlarm
});


@override $AlertModelCopyWith<$Res>? get alert;

}
/// @nodoc
class __$InterventionModelCopyWithImpl<$Res>
    implements _$InterventionModelCopyWith<$Res> {
  __$InterventionModelCopyWithImpl(this._self, this._then);

  final _InterventionModel _self;
  final $Res Function(_InterventionModel) _then;

/// Create a copy of InterventionModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? alertId = null,Object? alert = freezed,Object? agentId = null,Object? status = null,Object? startTime = freezed,Object? endTime = freezed,Object? startedAt = freezed,Object? arrivedAt = freezed,Object? completedAt = freezed,Object? responseTime = freezed,Object? notes = freezed,Object? personFound = null,Object? isFalseAlarm = null,}) {
  return _then(_InterventionModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,alertId: null == alertId ? _self.alertId : alertId // ignore: cast_nullable_to_non_nullable
as String,alert: freezed == alert ? _self.alert : alert // ignore: cast_nullable_to_non_nullable
as AlertModel?,agentId: null == agentId ? _self.agentId : agentId // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as InterventionStatus,startTime: freezed == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as DateTime?,endTime: freezed == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as DateTime?,startedAt: freezed == startedAt ? _self.startedAt : startedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,arrivedAt: freezed == arrivedAt ? _self.arrivedAt : arrivedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,completedAt: freezed == completedAt ? _self.completedAt : completedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,responseTime: freezed == responseTime ? _self.responseTime : responseTime // ignore: cast_nullable_to_non_nullable
as int?,notes: freezed == notes ? _self.notes : notes // ignore: cast_nullable_to_non_nullable
as String?,personFound: null == personFound ? _self.personFound : personFound // ignore: cast_nullable_to_non_nullable
as bool,isFalseAlarm: null == isFalseAlarm ? _self.isFalseAlarm : isFalseAlarm // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

/// Create a copy of InterventionModel
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$AlertModelCopyWith<$Res>? get alert {
    if (_self.alert == null) {
    return null;
  }

  return $AlertModelCopyWith<$Res>(_self.alert!, (value) {
    return _then(_self.copyWith(alert: value));
  });
}
}

// dart format on
