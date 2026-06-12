import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/storage/secure_storage.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.read(dioProvider), ref.read(secureStorageProvider));
});

class AuthService {
  final Dio _dio;
  final SecureStorage _storage;

  AuthService(this._dio, this._storage);

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Verify OTP
  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    try {
      final response = await _dio.post(
        '/auth/verify-otp',
        data: {
          'email': email,
          'otp': otp,
        },
      );
      
      // Sauvegarder les tokens
      await _storage.saveAccessToken(response.data['access_token']);
      await _storage.saveRefreshToken(response.data['refresh_token']);
      
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Get current user
  Future<Map<String, dynamic>> getCurrentUser() async {
    try {
      final response = await _dio.get('/auth/me');
      await _storage.saveUserId(response.data['id']);
      await _storage.saveUserEmail(response.data['email']);
      return response.data;
    } catch (e) {
      rethrow;
    }
  }

  // Logout
  Future<void> logout() async {
    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken != null) {
        await _dio.post(
          '/auth/logout',
          data: {'refresh_token': refreshToken},
        );
      }
    } finally {
      await _storage.clearAll();
    }
  }

  // Refresh Token
  Future<void> refreshToken() async {
    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken == null) throw Exception('No refresh token');

      final response = await _dio.post(
        '/auth/refresh',
        data: {'refresh_token': refreshToken},
      );

      await _storage.saveAccessToken(response.data['access_token']);
    } catch (e) {
      await _storage.clearAll();
      rethrow;
    }
  }

  // Check if logged in
  Future<bool> isLoggedIn() async {
    return await _storage.isLoggedIn();
  }

  // Update Profile
  Future<Map<String, dynamic>> updateProfile(
      String firstName, String lastName, String phone) async {
    try {
      final response = await _dio.patch(
        '/auth/profile',
        data: {
          'first_name': firstName,
          'last_name': lastName,
          'phone': phone,
        },
      );
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
