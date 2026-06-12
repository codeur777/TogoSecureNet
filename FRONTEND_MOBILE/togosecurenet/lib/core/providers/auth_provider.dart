import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../storage/secure_storage.dart';
import '../network/dio_client.dart';
import '../../features/auth/data/auth_service.dart';

// Provider pour SecureStorage
final secureStorageProvider = Provider<SecureStorage>((ref) {
  return SecureStorage();
});

// Provider pour AuthService
final authServiceProvider = Provider<AuthService>((ref) {
  final dio = ref.watch(dioProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthService(dio, storage);
});

// État d'authentification
class AuthState {
  final UserModel? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    UserModel? user,
    bool clearUser = false,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: clearUser ? null : user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Riverpod 3.x : Notifier<T>
class AuthNotifier extends Notifier<AuthState> {
  late AuthService _authService;
  late SecureStorage _storage;

  @override
  AuthState build() {
    _authService = ref.watch(authServiceProvider);
    _storage = ref.watch(secureStorageProvider);
    _checkAuth();
    return AuthState();
  }

  Future<void> _checkAuth() async {
    final token = await _storage.getAccessToken();
    if (token != null) {
      try {
        final userMap = await _authService.getCurrentUser();
        final user = UserModel.fromJson(userMap);
        state = state.copyWith(user: user, isAuthenticated: true);
      } catch (e) {
        await logout();
      }
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _authService.login(email, password);

      if (response['requires_otp'] == true) {
        state = state.copyWith(isLoading: false, clearUser: true);
        return false;
      }

      await _storage.saveAccessToken(response['access_token']);
      await _storage.saveRefreshToken(response['refresh_token']);

      final userMap = await _authService.getCurrentUser();
      final user = UserModel.fromJson(userMap);
      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        clearUser: true,
        error: e.toString(),
      );
      return false;
    }
  }

  Future<bool> verifyOtp(String email, String otp) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _authService.verifyOtp(email, otp);

      await _storage.saveAccessToken(response['access_token']);
      await _storage.saveRefreshToken(response['refresh_token']);

      final userMap = await _authService.getCurrentUser();
      final user = UserModel.fromJson(userMap);
      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        clearUser: true,
        error: e.toString(),
      );
      return false;
    }
  }

  Future<void> logout() async {
    final refreshToken = await _storage.getRefreshToken();
    if (refreshToken != null) {
      try {
        await _authService.logout();
      } catch (e) {
        // Échec silencieux côté API
      }
    }
    await _storage.clearAll();
    state = AuthState();
  }

  Future<void> updateProfile(
      String firstName, String lastName, String phone) async {
    if (state.user == null) return;

    state = state.copyWith(isLoading: true);
    try {
      await _authService.updateProfile(firstName, lastName, phone);
      final updatedUserMap = await _authService.getCurrentUser();
      final updatedUser = UserModel.fromJson(updatedUserMap);
      state = state.copyWith(user: updatedUser, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

// Riverpod 3.x : NotifierProvider
final authProvider = NotifierProvider<AuthNotifier, AuthState>(
  AuthNotifier.new,
);