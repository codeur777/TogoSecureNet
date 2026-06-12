// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'alert_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AlertModel {

 String get id;@JsonKey(name: 'person_name') String get personName;@JsonKey(name: 'person_photo') String? get personPhoto; String? get age; String? get gender; String? get description; AlertSeverity get severity; AlertStatus get status; double get latitude; double get longitude;@JsonKey(name: 'detection_time') DateTime get detectionTime;@JsonKey(name: 'reported_date') DateTime? get reportedDate;@JsonKey(name: 'camera_id') String? get cameraId;@JsonKey(name: 'camera_name') String? get cameraName; double get distance;@JsonKey(name: 'assigned_agent_id') String? get assignedAgentId;
/// Create a copy of AlertModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AlertModelCopyWith<AlertModel> get copyWith => _$AlertModelCopyWithImpl<AlertModel>(this as AlertModel, _$identity);

  /// Serializes this AlertModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AlertModel&&(identical(other.id, id) || other.id == id)&&(identical(other.personName, personName) || other.personName == personName)&&(identical(other.personPhoto, personPhoto) || other.personPhoto == personPhoto)&&(identical(other.age, age) || other.age == age)&&(identical(other.gender, gender) || other.gender == gender)&&(identical(other.description, description) || other.description == description)&&(identical(other.severity, severity) || other.severity == severity)&&(identical(other.status, status) || other.status == status)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.detectionTime, detectionTime) || other.detectionTime == detectionTime)&&(identical(other.reportedDate, reportedDate) || other.reportedDate == reportedDate)&&(identical(other.cameraId, cameraId) || other.cameraId == cameraId)&&(identical(other.cameraName, cameraName) || other.cameraName == cameraName)&&(identical(other.distance, distance) || other.distance == distance)&&(identical(other.assignedAgentId, assignedAgentId) || other.assignedAgentId == assignedAgentId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,personName,personPhoto,age,gender,description,severity,status,latitude,longitude,detectionTime,reportedDate,cameraId,cameraName,distance,assignedAgentId);

@override
String toString() {
  return 'AlertModel(id: $id, personName: $personName, personPhoto: $personPhoto, age: $age, gender: $gender, description: $description, severity: $severity, status: $status, latitude: $latitude, longitude: $longitude, detectionTime: $detectionTime, reportedDate: $reportedDate, cameraId: $cameraId, cameraName: $cameraName, distance: $distance, assignedAgentId: $assignedAgentId)';
}


}

/// @nodoc
abstract mixin class $AlertModelCopyWith<$Res>  {
  factory $AlertModelCopyWith(AlertModel value, $Res Function(AlertModel) _then) = _$AlertModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'person_name') String personName,@JsonKey(name: 'person_photo') String? personPhoto, String? age, String? gender, String? description, AlertSeverity severity, AlertStatus status, double latitude, double longitude,@JsonKey(name: 'detection_time') DateTime detectionTime,@JsonKey(name: 'reported_date') DateTime? reportedDate,@JsonKey(name: 'camera_id') String? cameraId,@JsonKey(name: 'camera_name') String? cameraName, double distance,@JsonKey(name: 'assigned_agent_id') String? assignedAgentId
});




}
/// @nodoc
class _$AlertModelCopyWithImpl<$Res>
    implements $AlertModelCopyWith<$Res> {
  _$AlertModelCopyWithImpl(this._self, this._then);

  final AlertModel _self;
  final $Res Function(AlertModel) _then;

/// Create a copy of AlertModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? personName = null,Object? personPhoto = freezed,Object? age = freezed,Object? gender = freezed,Object? description = freezed,Object? severity = null,Object? status = null,Object? latitude = null,Object? longitude = null,Object? detectionTime = null,Object? reportedDate = freezed,Object? cameraId = freezed,Object? cameraName = freezed,Object? distance = null,Object? assignedAgentId = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,personName: null == personName ? _self.personName : personName // ignore: cast_nullable_to_non_nullable
as String,personPhoto: freezed == personPhoto ? _self.personPhoto : personPhoto // ignore: cast_nullable_to_non_nullable
as String?,age: freezed == age ? _self.age : age // ignore: cast_nullable_to_non_nullable
as String?,gender: freezed == gender ? _self.gender : gender // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,severity: null == severity ? _self.severity : severity // ignore: cast_nullable_to_non_nullable
as AlertSeverity,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as AlertStatus,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,detectionTime: null == detectionTime ? _self.detectionTime : detectionTime // ignore: cast_nullable_to_non_nullable
as DateTime,reportedDate: freezed == reportedDate ? _self.reportedDate : reportedDate // ignore: cast_nullable_to_non_nullable
as DateTime?,cameraId: freezed == cameraId ? _self.cameraId : cameraId // ignore: cast_nullable_to_non_nullable
as String?,cameraName: freezed == cameraName ? _self.cameraName : cameraName // ignore: cast_nullable_to_non_nullable
as String?,distance: null == distance ? _self.distance : distance // ignore: cast_nullable_to_non_nullable
as double,assignedAgentId: freezed == assignedAgentId ? _self.assignedAgentId : assignedAgentId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [AlertModel].
extension AlertModelPatterns on AlertModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AlertModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AlertModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AlertModel value)  $default,){
final _that = this;
switch (_that) {
case _AlertModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AlertModel value)?  $default,){
final _that = this;
switch (_that) {
case _AlertModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'person_name')  String personName, @JsonKey(name: 'person_photo')  String? personPhoto,  String? age,  String? gender,  String? description,  AlertSeverity severity,  AlertStatus status,  double latitude,  double longitude, @JsonKey(name: 'detection_time')  DateTime detectionTime, @JsonKey(name: 'reported_date')  DateTime? reportedDate, @JsonKey(name: 'camera_id')  String? cameraId, @JsonKey(name: 'camera_name')  String? cameraName,  double distance, @JsonKey(name: 'assigned_agent_id')  String? assignedAgentId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AlertModel() when $default != null:
return $default(_that.id,_that.personName,_that.personPhoto,_that.age,_that.gender,_that.description,_that.severity,_that.status,_that.latitude,_that.longitude,_that.detectionTime,_that.reportedDate,_that.cameraId,_that.cameraName,_that.distance,_that.assignedAgentId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'person_name')  String personName, @JsonKey(name: 'person_photo')  String? personPhoto,  String? age,  String? gender,  String? description,  AlertSeverity severity,  AlertStatus status,  double latitude,  double longitude, @JsonKey(name: 'detection_time')  DateTime detectionTime, @JsonKey(name: 'reported_date')  DateTime? reportedDate, @JsonKey(name: 'camera_id')  String? cameraId, @JsonKey(name: 'camera_name')  String? cameraName,  double distance, @JsonKey(name: 'assigned_agent_id')  String? assignedAgentId)  $default,) {final _that = this;
switch (_that) {
case _AlertModel():
return $default(_that.id,_that.personName,_that.personPhoto,_that.age,_that.gender,_that.description,_that.severity,_that.status,_that.latitude,_that.longitude,_that.detectionTime,_that.reportedDate,_that.cameraId,_that.cameraName,_that.distance,_that.assignedAgentId);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'person_name')  String personName, @JsonKey(name: 'person_photo')  String? personPhoto,  String? age,  String? gender,  String? description,  AlertSeverity severity,  AlertStatus status,  double latitude,  double longitude, @JsonKey(name: 'detection_time')  DateTime detectionTime, @JsonKey(name: 'reported_date')  DateTime? reportedDate, @JsonKey(name: 'camera_id')  String? cameraId, @JsonKey(name: 'camera_name')  String? cameraName,  double distance, @JsonKey(name: 'assigned_agent_id')  String? assignedAgentId)?  $default,) {final _that = this;
switch (_that) {
case _AlertModel() when $default != null:
return $default(_that.id,_that.personName,_that.personPhoto,_that.age,_that.gender,_that.description,_that.severity,_that.status,_that.latitude,_that.longitude,_that.detectionTime,_that.reportedDate,_that.cameraId,_that.cameraName,_that.distance,_that.assignedAgentId);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AlertModel implements AlertModel {
  const _AlertModel({required this.id, @JsonKey(name: 'person_name') required this.personName, @JsonKey(name: 'person_photo') this.personPhoto, required this.age, required this.gender, required this.description, required this.severity, required this.status, required this.latitude, required this.longitude, @JsonKey(name: 'detection_time') required this.detectionTime, @JsonKey(name: 'reported_date') this.reportedDate, @JsonKey(name: 'camera_id') this.cameraId, @JsonKey(name: 'camera_name') this.cameraName, this.distance = 0.0, @JsonKey(name: 'assigned_agent_id') this.assignedAgentId});
  factory _AlertModel.fromJson(Map<String, dynamic> json) => _$AlertModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'person_name') final  String personName;
@override@JsonKey(name: 'person_photo') final  String? personPhoto;
@override final  String? age;
@override final  String? gender;
@override final  String? description;
@override final  AlertSeverity severity;
@override final  AlertStatus status;
@override final  double latitude;
@override final  double longitude;
@override@JsonKey(name: 'detection_time') final  DateTime detectionTime;
@override@JsonKey(name: 'reported_date') final  DateTime? reportedDate;
@override@JsonKey(name: 'camera_id') final  String? cameraId;
@override@JsonKey(name: 'camera_name') final  String? cameraName;
@override@JsonKey() final  double distance;
@override@JsonKey(name: 'assigned_agent_id') final  String? assignedAgentId;

/// Create a copy of AlertModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AlertModelCopyWith<_AlertModel> get copyWith => __$AlertModelCopyWithImpl<_AlertModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AlertModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AlertModel&&(identical(other.id, id) || other.id == id)&&(identical(other.personName, personName) || other.personName == personName)&&(identical(other.personPhoto, personPhoto) || other.personPhoto == personPhoto)&&(identical(other.age, age) || other.age == age)&&(identical(other.gender, gender) || other.gender == gender)&&(identical(other.description, description) || other.description == description)&&(identical(other.severity, severity) || other.severity == severity)&&(identical(other.status, status) || other.status == status)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.detectionTime, detectionTime) || other.detectionTime == detectionTime)&&(identical(other.reportedDate, reportedDate) || other.reportedDate == reportedDate)&&(identical(other.cameraId, cameraId) || other.cameraId == cameraId)&&(identical(other.cameraName, cameraName) || other.cameraName == cameraName)&&(identical(other.distance, distance) || other.distance == distance)&&(identical(other.assignedAgentId, assignedAgentId) || other.assignedAgentId == assignedAgentId));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,personName,personPhoto,age,gender,description,severity,status,latitude,longitude,detectionTime,reportedDate,cameraId,cameraName,distance,assignedAgentId);

@override
String toString() {
  return 'AlertModel(id: $id, personName: $personName, personPhoto: $personPhoto, age: $age, gender: $gender, description: $description, severity: $severity, status: $status, latitude: $latitude, longitude: $longitude, detectionTime: $detectionTime, reportedDate: $reportedDate, cameraId: $cameraId, cameraName: $cameraName, distance: $distance, assignedAgentId: $assignedAgentId)';
}


}

/// @nodoc
abstract mixin class _$AlertModelCopyWith<$Res> implements $AlertModelCopyWith<$Res> {
  factory _$AlertModelCopyWith(_AlertModel value, $Res Function(_AlertModel) _then) = __$AlertModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'person_name') String personName,@JsonKey(name: 'person_photo') String? personPhoto, String? age, String? gender, String? description, AlertSeverity severity, AlertStatus status, double latitude, double longitude,@JsonKey(name: 'detection_time') DateTime detectionTime,@JsonKey(name: 'reported_date') DateTime? reportedDate,@JsonKey(name: 'camera_id') String? cameraId,@JsonKey(name: 'camera_name') String? cameraName, double distance,@JsonKey(name: 'assigned_agent_id') String? assignedAgentId
});




}
/// @nodoc
class __$AlertModelCopyWithImpl<$Res>
    implements _$AlertModelCopyWith<$Res> {
  __$AlertModelCopyWithImpl(this._self, this._then);

  final _AlertModel _self;
  final $Res Function(_AlertModel) _then;

/// Create a copy of AlertModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? personName = null,Object? personPhoto = freezed,Object? age = freezed,Object? gender = freezed,Object? description = freezed,Object? severity = null,Object? status = null,Object? latitude = null,Object? longitude = null,Object? detectionTime = null,Object? reportedDate = freezed,Object? cameraId = freezed,Object? cameraName = freezed,Object? distance = null,Object? assignedAgentId = freezed,}) {
  return _then(_AlertModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,personName: null == personName ? _self.personName : personName // ignore: cast_nullable_to_non_nullable
as String,personPhoto: freezed == personPhoto ? _self.personPhoto : personPhoto // ignore: cast_nullable_to_non_nullable
as String?,age: freezed == age ? _self.age : age // ignore: cast_nullable_to_non_nullable
as String?,gender: freezed == gender ? _self.gender : gender // ignore: cast_nullable_to_non_nullable
as String?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,severity: null == severity ? _self.severity : severity // ignore: cast_nullable_to_non_nullable
as AlertSeverity,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as AlertStatus,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,detectionTime: null == detectionTime ? _self.detectionTime : detectionTime // ignore: cast_nullable_to_non_nullable
as DateTime,reportedDate: freezed == reportedDate ? _self.reportedDate : reportedDate // ignore: cast_nullable_to_non_nullable
as DateTime?,cameraId: freezed == cameraId ? _self.cameraId : cameraId // ignore: cast_nullable_to_non_nullable
as String?,cameraName: freezed == cameraName ? _self.cameraName : cameraName // ignore: cast_nullable_to_non_nullable
as String?,distance: null == distance ? _self.distance : distance // ignore: cast_nullable_to_non_nullable
as double,assignedAgentId: freezed == assignedAgentId ? _self.assignedAgentId : assignedAgentId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
