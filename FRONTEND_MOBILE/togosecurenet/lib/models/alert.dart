class Alert {
  final String id;
  final String cameraId;
  final String personName;
  final DateTime timestamp;
  final String location;
  final String status;

  Alert({
    required this.id,
    required this.cameraId,
    required this.personName,
    required this.timestamp,
    required this.location,
    required this.status,
  });

  factory Alert.fromJson(Map<String, dynamic> json) {
    return Alert(
      id: json['id'] ?? '',
      cameraId: json['camera_id'] ?? '',
      personName: json['person_name'] ?? 'Inconnu',
      timestamp: DateTime.parse(json['timestamp'] ?? DateTime.now().toIso8601String()),
      location: json['location'] ?? 'Localisation inconnue',
      status: json['status'] ?? 'CRITICAL',
    );
  }
}
