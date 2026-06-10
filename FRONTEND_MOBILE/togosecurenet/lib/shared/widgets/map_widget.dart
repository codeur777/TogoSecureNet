import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import '../../core/services/location_service.dart';
import '../../core/constants/app_colors.dart';

class MapWidget extends StatefulWidget {
  final double? targetLatitude;
  final double? targetLongitude;
  final String? targetTitle;
  final bool showUserLocation;
  final double height;

  const MapWidget({
    super.key,
    this.targetLatitude,
    this.targetLongitude,
    this.targetTitle,
    this.showUserLocation = true,
    this.height = 300,
  });

  @override
  State<MapWidget> createState() => _MapWidgetState();
}

class _MapWidgetState extends State<MapWidget> {
  GoogleMapController? _mapController;
  final LocationService _locationService = LocationService();
  Position? _currentPosition;
  Set<Marker> _markers = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializeMap();
  }

  Future<void> _initializeMap() async {
    if (widget.showUserLocation) {
      final position = await _locationService.getCurrentPosition();
      if (position != null) {
        setState(() {
          _currentPosition = position;
        });
      }
    }

    _setupMarkers();
    setState(() {
      _isLoading = false;
    });
  }

  void _setupMarkers() {
    Set<Marker> markers = {};

    // Marker pour la position actuelle de l'agent
    if (_currentPosition != null && widget.showUserLocation) {
      markers.add(
        Marker(
          markerId: const MarkerId('current_location'),
          position: LatLng(_currentPosition!.latitude, _currentPosition!.longitude),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
          infoWindow: const InfoWindow(
            title: 'Ma position',
            snippet: 'Vous êtes ici',
          ),
        ),
      );
    }

    // Marker pour la cible (alerte)
    if (widget.targetLatitude != null && widget.targetLongitude != null) {
      markers.add(
        Marker(
          markerId: const MarkerId('target_location'),
          position: LatLng(widget.targetLatitude!, widget.targetLongitude!),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
          infoWindow: InfoWindow(
            title: widget.targetTitle ?? 'Localisation de l\'alerte',
            snippet: 'Point de détection',
          ),
        ),
      );
    }

    setState(() {
      _markers = markers;
    });
  }

  LatLng _getInitialPosition() {
    // Si on a une cible, centrer sur elle
    if (widget.targetLatitude != null && widget.targetLongitude != null) {
      return LatLng(widget.targetLatitude!, widget.targetLongitude!);
    }

    // Sinon, centrer sur la position actuelle
    if (_currentPosition != null) {
      return LatLng(_currentPosition!.latitude, _currentPosition!.longitude);
    }

    // Par défaut, centrer sur Lomé, Togo
    return const LatLng(6.1256, 1.2219);
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;

    // Si on a les deux positions, ajuster les bounds pour tout voir
    if (_currentPosition != null &&
        widget.targetLatitude != null &&
        widget.targetLongitude != null) {
      _fitBounds();
    }
  }

  void _fitBounds() {
    if (_mapController == null || _currentPosition == null) return;

    final bounds = LatLngBounds(
      southwest: LatLng(
        _currentPosition!.latitude < widget.targetLatitude!
            ? _currentPosition!.latitude
            : widget.targetLatitude!,
        _currentPosition!.longitude < widget.targetLongitude!
            ? _currentPosition!.longitude
            : widget.targetLongitude!,
      ),
      northeast: LatLng(
        _currentPosition!.latitude > widget.targetLatitude!
            ? _currentPosition!.latitude
            : widget.targetLatitude!,
        _currentPosition!.longitude > widget.targetLongitude!
            ? _currentPosition!.longitude
            : widget.targetLongitude!,
      ),
    );

    _mapController!.animateCamera(CameraUpdate.newLatLngBounds(bounds, 100));
  }

  String _calculateDistance() {
    if (_currentPosition == null ||
        widget.targetLatitude == null ||
        widget.targetLongitude == null) {
      return '';
    }

    final distance = _locationService.calculateDistance(
      _currentPosition!.latitude,
      _currentPosition!.longitude,
      widget.targetLatitude!,
      widget.targetLongitude!,
    );

    if (distance < 1000) {
      return '${distance.toStringAsFixed(0)} m';
    } else {
      return '${(distance / 1000).toStringAsFixed(1)} km';
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return SizedBox(
        height: widget.height,
        child: const Center(child: CircularProgressIndicator()),
      );
    }

    return Container(
      height: widget.height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          children: [
            GoogleMap(
              onMapCreated: _onMapCreated,
              initialCameraPosition: CameraPosition(
                target: _getInitialPosition(),
                zoom: 14.0,
              ),
              markers: _markers,
              myLocationEnabled: widget.showUserLocation,
              myLocationButtonEnabled: true,
              compassEnabled: true,
              mapToolbarEnabled: false,
              zoomControlsEnabled: false,
            ),
            
            // Badge de distance
            if (_currentPosition != null &&
                widget.targetLatitude != null &&
                widget.targetLongitude != null)
              Positioned(
                top: 16,
                left: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 10,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.location_on, color: Colors.white, size: 16),
                      const SizedBox(width: 6),
                      Text(
                        _calculateDistance(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _mapController?.dispose();
    super.dispose();
  }
}
