import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/splash/splash_screen.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/otp_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/alerts/presentation/pages/alerts_page.dart';
import '../../features/alerts/presentation/pages/alert_details_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/settings/presentation/pages/settings_page.dart';
import '../providers/auth_provider.dart';

// Routes principales
class AppRoutes {
  static const String splash = '/splash';
  static const String login = '/login';
  static const String otp = '/otp';
  static const String home = '/';
  static const String alerts = '/alerts';
  static const String alertDetails = '/alerts/:id';
  static const String profile = '/profile';
  static const String settings = '/settings';
}

// Provider pour le router
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: authState.isAuthenticated ? AppRoutes.home : AppRoutes.login,
    redirect: (context, state) {
      final isAuthenticated = authState.isAuthenticated;
      final isLoggingIn = state.matchedLocation == AppRoutes.login ||
          state.matchedLocation == AppRoutes.otp;

      if (!isAuthenticated && !isLoggingIn) {
        return AppRoutes.login;
      }

      if (isAuthenticated && isLoggingIn) {
        return AppRoutes.home;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: AppRoutes.otp,
        builder: (context, state) {
          final email = state.uri.queryParameters['email'] ?? '';
          return OtpPage(email: email);
        },
      ),
      GoRoute(
        path: AppRoutes.home,
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: AppRoutes.alerts,
        builder: (context, state) => const AlertsPage(),
      ),
      GoRoute(
        path: '/alerts/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return AlertDetailsPage(alertId: id);
        },
      ),
      GoRoute(
        path: AppRoutes.profile,
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: AppRoutes.settings,
        builder: (context, state) => const SettingsPage(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Text('Page non trouvée: ${state.matchedLocation}'),
      ),
    ),
  );
});
