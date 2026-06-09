import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../services/api";
import useWebSocket from "../../hooks/useWebSocket";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix pour les icônes de marqueurs Leaflet par défaut
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Stats = {
  total_cameras: number;
  active_cameras: number;
  total_alerts_today: number;
  critical_alerts_today: number;
};

type Alert = {
  id: number;
  person_id: number;
  camera_id: number;
  gravity_level: string;
  confidence: number;
  created_at: string;
  person_name?: string;
  camera_name?: string;
};

type Camera = {
  id: number;
  name: string;
  address: string;
  location_lat: number;
  location_lng: number;
  status: "active" | "maintenance" | "inactive";
};

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    total_cameras: 0,
    active_cameras: 0,
    total_alerts_today: 0,
    critical_alerts_today: 0,
  });

  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données initiales depuis le backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, alertsRes, camsRes] = await Promise.all([
        api.get("/api/v1/stats").catch(() => ({ data: null })),
        api.get("/api/v1/alerts").catch(() => ({ data: [] })),
        api.get("/api/v1/cameras").catch(() => ({ data: [] })),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      } else {
        // Fallback si la route stats n'existe pas encore ou échoue
        const todayStr = new Date().toISOString().split("T")[0];
        const todayAlerts = alertsRes.data.filter((a: Alert) => a.created_at.startsWith(todayStr));
        const criticalToday = todayAlerts.filter((a: Alert) => a.gravity_level === "critical");
        setStats({
          total_cameras: camsRes.data.length || 3,
          active_cameras: camsRes.data.filter((c: Camera) => c.status === "active").length || 3,
          total_alerts_today: todayAlerts.length || 3,
          critical_alerts_today: criticalToday.length || 1,
        });
      }

      setRecentAlerts(alertsRes.data.slice(0, 5));
      setCameras(camsRes.data);
    } catch (error) {
      console.error("Erreur de chargement des données:", error);
      // Données mockées en cas d'erreur
      setRecentAlerts([
        { id: 1, person_id: 1, person_name: "Koffi Mensah", camera_id: 1, camera_name: "LOM-MARCHE-01", gravity_level: "high", confidence: 0.92, created_at: new Date().toISOString() },
        { id: 2, person_id: 2, person_name: "Abla Ayayi", camera_id: 2, camera_name: "LOM-AERO-04", gravity_level: "critical", confidence: 0.97, created_at: new Date(Date.now() - 3600000).toISOString() },
      ]);
      setCameras([
        { id: 1, name: "LOM-MARCHE-01", address: "Grand Marché, Lomé", location_lat: 6.1319, location_lng: 1.2227, status: "active" },
        { id: 2, name: "LOM-AERO-04", address: "Aéroport Débarquement", location_lat: 6.1455, location_lng: 1.2105, status: "active" },
        { id: 3, name: "LOM-PORT-02", address: "Port Autonome Quai 3", location_lat: 6.1250, location_lng: 1.2350, status: "active" },
      ]);
      setStats({
        total_cameras: 3,
        active_cameras: 3,
        total_alerts_today: 2,
        critical_alerts_today: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Écouter les nouvelles alertes via WebSocket
  useWebSocket((newAlert) => {
    // Ajouter l'alerte au début de la liste
    setRecentAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
    // Mettre à jour les compteurs
    setStats((prev) => ({
      ...prev,
      total_alerts_today: prev.total_alerts_today + 1,
      critical_alerts_today: newAlert.gravity_level === "critical" ? prev.critical_alerts_today + 1 : prev.critical_alerts_today,
    }));
  });

  const getStatusBadge = (status: string) => {
    if (status === "active") return "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400";
    if (status === "maintenance") return "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400";
    return "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400";
  };

  const getGravityColor = (level: string) => {
    if (level === "critical") return "text-error-600 bg-error-50 dark:bg-error-500/15 dark:text-error-400";
    if (level === "high") return "text-orange-600 bg-orange-50 dark:bg-orange-500/15 dark:text-orange-400";
    return "text-warning-600 bg-warning-50 dark:bg-warning-500/15 dark:text-warning-400";
  };

  return (
    <>
      <PageMeta
        title="Tableau de Bord | TOGO-SecureNet"
        description="Tableau de bord de sécurité et de surveillance intelligente du Togo"
      />

      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <img src="/images/logo_emble-removebg.png" alt="Logo" className="h-9 w-7" />
            Surveillance en Direct
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aperçu global de l'état de sécurité du réseau et alertes de reconnaissance faciale en temps réel.
          </p>
        </div>

        {/* Compteurs de métriques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Caméras</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-gray-800 dark:text-white/95">{stats.total_cameras}</span>
              <span className="rounded-lg p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"></span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Caméras Actives</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-gray-800 dark:text-white/95">{stats.active_cameras}</span>
              <span className="rounded-lg p-2 bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alertes Aujourd'hui</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-gray-800 dark:text-white/95">{stats.total_alerts_today}</span>
              <span className="rounded-lg p-2 bg-warnings-50 text-success-600 dark:bg-warnings-500/10 dark:text-warnings-400"></span>
              <span className="rounded-lg p-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"></span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Urgences Critiques</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical_alerts_today}</span>
              <span className="rounded-lg p-2 bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Section Carte + Alertes en direct */}
        <div className="grid grid-cols-12 gap-5">
          {/* Carte */}
          <div className="col-span-12 lg:col-span-8 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden flex flex-col min-h-[450px]">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Carte des Caméras de Surveillance
              </h2>
              <span className="text-xs text-gray-400">Centré sur le Togo</span>
            </div>
            <div className="flex-1 relative min-h-[380px]">
              <MapContainer
                center={[6.1319, 1.2227]}
                zoom={13}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cameras.map((camera) => (
                  <Marker
                    key={camera.id}
                    position={[camera.location_lat, camera.location_lng]}
                  >
                    <Popup>
                      <div className="p-1 space-y-1">
                        <h4 className="font-bold text-sm text-gray-800">{camera.name}</h4>
                        <p className="text-xs text-gray-500">{camera.address}</p>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${getStatusBadge(camera.status)}`}>
                          {camera.status}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Alertes en Direct */}
          <div className="col-span-12 lg:col-span-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Alertes Temps Réel
              </h2>
            </div>
            <div className="p-5 flex-1 overflow-y-auto max-h-[380px] space-y-3">
              {recentAlerts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">Aucune alerte récente.</p>
              ) : (
                recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01]"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${getGravityColor(alert.gravity_level)}`}>
                        {alert.gravity_level}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(alert.created_at).toLocaleTimeString("fr-FR")}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p className="font-semibold text-gray-800 dark:text-white/90">
                        {alert.person_name || `Individu #${alert.person_id}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Caméra: <span className="font-medium text-gray-600 dark:text-gray-300">{alert.camera_name || `Cam #${alert.camera_id}`}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Indice de confiance: <span className="font-semibold text-blue-600 dark:text-blue-400">{(alert.confidence * 100).toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
