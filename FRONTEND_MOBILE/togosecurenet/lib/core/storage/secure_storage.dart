import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

final secureStorageProvider = Provider<SecureStorage>((ref) {
  return SecureStorage();
});

class SecureStorage {
  final _secureStorage = const FlutterSecureStorage();
  SharedPreferences? _prefs;

  Future<void> _initPrefs() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  // Access Token
  Future<void> saveAccessToken(String token) async {
    await _secureStorage.write(
      key: AppConstants.keyAccessToken,
      value: token,
    );
  }

  Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: AppConstants.keyAccessToken);
  }

  // Refresh Token
  Future<void> saveRefreshToken(String token) async {
    await _secureStorage.write(
      key: AppConstants.keyRefreshToken,
      value: token,
    );
  }

  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: AppConstants.keyRefreshToken);
  }

  // User ID
  Future<void> saveUserId(String userId) async {
    await _secureStorage.write(
      key: AppConstants.keyUserId,
      value: userId,
    );
  }

  Future<String?> getUserId() async {
    return await _secureStorage.read(key: AppConstants.keyUserId);
  }

  // User Email
  Future<void> saveUserEmail(String email) async {
    await _initPrefs();
    await _prefs!.setString(AppConstants.keyUserEmail, email);
  }

  Future<String?> getUserEmail() async {
    await _initPrefs();
    return _prefs!.getString(AppConstants.keyUserEmail);
  }

  // Theme Mode
  Future<void> saveThemeMode(String mode) async {
    await _initPrefs();
    await _prefs!.setString(AppConstants.keyThemeMode, mode);
  }

  Future<String?> getThemeMode() async {
    await _initPrefs();
    return _prefs!.getString(AppConstants.keyThemeMode);
  }

  // Notifications Enabled
  Future<void> saveNotificationsEnabled(bool enabled) async {
    await _initPrefs();
    await _prefs!.setBool(AppConstants.keyNotificationsEnabled, enabled);
  }

  Future<bool> getNotificationsEnabled() async {
    await _initPrefs();
    return _prefs!.getBool(AppConstants.keyNotificationsEnabled) ?? true;
  }

  // Alert Sound Enabled
  Future<void> saveAlertSoundEnabled(bool enabled) async {
    await _initPrefs();
    await _prefs!.setBool(AppConstants.keyAlertSoundEnabled, enabled);
  }

  Future<bool> getAlertSoundEnabled() async {
    await _initPrefs();
    return _prefs!.getBool(AppConstants.keyAlertSoundEnabled) ?? true;
  }

  // Vibration Enabled
  Future<void> saveVibrationEnabled(bool enabled) async {
    await _initPrefs();
    await _prefs!.setBool(AppConstants.keyVibrationEnabled, enabled);
  }

  Future<bool> getVibrationEnabled() async {
    await _initPrefs();
    return _prefs!.getBool(AppConstants.keyVibrationEnabled) ?? true;
  }

  // Clear All
  Future<void> clearAll() async {
    await _secureStorage.deleteAll();
    await _initPrefs();
    await _prefs!.clear();
  }

  // Check if logged in
  Future<bool> isLoggedIn() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }
}
