import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import '../constants/app_constants.dart';
import '../storage/secure_storage.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: AppConstants.connectTimeout,
      receiveTimeout: AppConstants.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  // Intercepteur pour ajouter le token
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final storage = ref.read(secureStorageProvider);
        final token = await storage.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token expiré, tenter de rafraîchir
          final storage = ref.read(secureStorageProvider);
          final refreshToken = await storage.getRefreshToken();
          
          if (refreshToken != null) {
            try {
              final response = await dio.post(
                '/auth/refresh',
                data: {'refresh_token': refreshToken},
              );
              
              final newAccessToken = response.data['access_token'];
              await storage.saveAccessToken(newAccessToken);
              
              // Réessayer la requête originale
              error.requestOptions.headers['Authorization'] = 'Bearer $newAccessToken';
              final opts = Options(
                method: error.requestOptions.method,
                headers: error.requestOptions.headers,
              );
              final cloneReq = await dio.request(
                error.requestOptions.path,
                options: opts,
                data: error.requestOptions.data,
                queryParameters: error.requestOptions.queryParameters,
              );
              return handler.resolve(cloneReq);
            } catch (e) {
              // Échec du refresh, déconnecter
              await storage.clearAll();
              handler.reject(error);
            }
          } else {
            await storage.clearAll();
            handler.reject(error);
          }
        } else {
          handler.next(error);
        }
      },
    ),
  );

  // Logger en mode debug
  dio.interceptors.add(
    PrettyDioLogger(
      requestHeader: true,
      requestBody: true,
      responseBody: true,
      responseHeader: false,
      error: true,
      compact: true,
    ),
  );

  return dio;
});
