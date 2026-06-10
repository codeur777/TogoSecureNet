import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../storage/secure_storage.dart';
import '../../features/auth/data/auth_service.dart';

// Provider pour AuthService
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

// Provider pour SecureStorage
final secureStorageProvider = Provider<SecureStorage>((ref) {
  return SecureStorage();
});

// StateNotifier pour gérer l'état d'authentification
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
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;
  final SecureStorage _storage;

  AuthNotifier(this._authService, this._storage) : super(AuthState()) {
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final token = await _storage.getAccessToken();
    if (token != null) {
      try {
        final user = await _authService.getCurrentUser();
        state = state.copyWith(
          user: user,
          isAuthenticated: true,
        );
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
        state = state.copyWith(isLoading: false);
        return false; // Besoin OTP
      }

      await _storage.saveAccessToken(response['access_token']);
      await _storage.saveRefreshToken(response['refresh_token']);
      
      final user = await _authService.getCurrentUser();
      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
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
      
      final user = await _authService.getCurrentUser();
      state = state.copyWith(
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  Future<void> logout() async {
    final refreshToken = await _storage.getRefreshToken();
    if (refreshToken != null) {
      try {
        await _authService.logout(refreshToken);
      } catch (e) {
        // Ignore errors during logout
      }
    }
    
    await _storage.clearAll();
    state = AuthState();
  }

  Future<void> updateProfile(String firstName, String lastName, String phone) async {
    if (state.user == null) return;
    
    state = state.copyWith(isLoading: true);
    try {
      await _authService.updateProfile(firstName, lastName, phone);
      final updatedUser = await _authService.getCurrentUser();
      state = state.copyWith(
        user: updatedUser,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}

// Provider principal pour l'authentification
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthNotifier(authService, storage);
});
