import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors
  static const primary = Color(0xFF16A34A); // Vert Principal
  static const primaryLight = Color(0xFFDCFCE7); // Vert Clair
  static const primaryDark = Color(0xFF15803D);

  // Neutrals
  static const white = Color(0xFFFFFFFF);
  static const black = Color(0xFF111827);
  static const grey = Color(0xFFF3F4F6);
  static const greyDark = Color(0xFF6B7280);
  static const greyLight = Color(0xFFE5E7EB);

  // Alert Colors
  static const error = Color(0xFFDC2626); // Rouge Alerte
  static const warning = Color(0xFFF59E0B); // Orange Moyen
  static const success = Color(0xFF16A34A);
  static const info = Color(0xFF3B82F6);

  // Backgrounds
  static const background = Color(0xFFFAFAFA);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceDark = Color(0xFF1F2937);

  // Text
  static const textPrimary = Color(0xFF111827);
  static const textSecondary = Color(0xFF6B7280);
  static const textDisabled = Color(0xFF9CA3AF);

  // Shadows
  static const shadow = Color(0x1A000000);
  static const shadowLight = Color(0x0D000000);

  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, Color(0xFF22C55E)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient errorGradient = LinearGradient(
    colors: [error, Color(0xFFEF4444)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ==========================================
  // 🔄 ALIAS COMPATIBILITÉ (utilisables dans des contextes const)
  // ==========================================
  static const Color textDark = textPrimary;
  static const Color textLight = white;
  static const Color alertDanger = error;
  static const Color alertWarning = warning;
}