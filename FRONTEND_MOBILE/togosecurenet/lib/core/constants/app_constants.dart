class AppConstants {
  // API
  static const baseUrl = 'http://192.168.1.73:8000/api/v1';
  static const connectTimeout = Duration(seconds: 30);
  static const receiveTimeout = Duration(seconds: 30);
  
  // Storage Keys
  static const keyAccessToken = 'access_token';
  static const keyRefreshToken = 'refresh_token';
  static const keyUserId = 'user_id';
  static const keyUserEmail = 'user_email';
  static const keyThemeMode = 'theme_mode';
  static const keyNotificationsEnabled = 'notifications_enabled';
  static const keyAlertSoundEnabled = 'alert_sound_enabled';
  static const keyVibrationEnabled = 'vibration_enabled';
  
  // OneSignal
  static const oneSignalAppId = 'YOUR_ONESIGNAL_APP_ID'; // À remplacer
  
  // Google Maps
  static const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // À remplacer
  static const defaultLatitude = 6.1375;
  static const defaultLongitude = 1.2123; // Lomé, Togo
  static const mapZoom = 14.0;
  
  // Pagination
  static const defaultPageSize = 20;
  static const maxPageSize = 100;
  
  // Intervals
  static const alertCheckInterval = Duration(seconds: 30);
  static const locationUpdateInterval = Duration(seconds: 10);
  
  // Distance
  static const maxAlertDistance = 50.0; // km
  
  // Animation
  static const animationDuration = Duration(milliseconds: 300);
  static const fastAnimationDuration = Duration(milliseconds: 150);
  static const slowAnimationDuration = Duration(milliseconds: 500);
}
