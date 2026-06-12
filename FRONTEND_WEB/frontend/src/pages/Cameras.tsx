import { useEffect, useState } from "react";
import api from "../services/api";
import PageMeta from "../components/common/PageMeta";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

// Fix for default Leaflet marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Camera = {
  id: string;
  nom: string;
  localisation: string;
  location_lat: number;
  location_lng: number;
  est_active: boolean;
  type?: string;
  description?: string;
  url_flux?: string;
};

// Component to handle clicks on the map to pick location
function LocationPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function Cameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [nom, setNom] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [lat, setLat] = useState(6.1319);
  const [lng, setLng] = useState(1.2227);
  const [estActive, setEstActive] = useState(true);
  const [type, setType] = useState("ip");
  const [description, setDescription] = useState("");
  const [urlFlux, setUrlFlux] = useState("");

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/cameras/");
      setCameras(res.data);
    } catch (error) {
      console.error("Erreur de chargement des caméras:", error);
      toast.error("Impossible de charger la liste des caméras");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        nom,
        localisation,
        location_lat: lat,
        location_lng: lng,
        est_active: estActive,
        type,
        description,
        url_flux: urlFlux,
      };

      const res = await api.post("/api/v1/cameras/", payload);
      setCameras((prev) => [res.data, ...prev]);
      toast.success("Caméra enregistrée avec succès !");
      resetForm();
    } catch (error: any) {
      console.error("Erreur d'ajout de caméra:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'enregistrement de la caméra.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setNom("");
    setLocalisation("");
    setLat(6.1319);
    setLng(1.2227);
    setEstActive(true);
    setType("ip");
    setDescription("");
    setUrlFlux("");
    setShowAddForm(false);
  };

  const actives = cameras.filter((c) => c.est_active).length;

  return (
    <>
      <PageMeta title="Caméras | TOGO-SecureNet" description="Gestion des caméras" />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
               Caméras de Surveillance
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gérez les caméras IP déployées sur le réseau de sécurité.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>+ Ajouter une caméra</span>
          </button>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Caméras</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{cameras.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actives</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{actives}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inactives</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{cameras.length - actives}</p>
          </div>
        </div>

        {/* Modal d'ajout */}
        {showAddForm && (
          <div
            className="fixed inset-x-0 bottom-0 z-[999999] bg-black/60 backdrop-blur-sm overflow-y-auto"
            style={{ top: '64px' }}
          >
            <div className="flex min-h-full items-start justify-center px-4 py-8">
              <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex-shrink-0">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Ajouter une Nouvelle Caméra</h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-semibold cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddCamera} className="p-6 space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Left column — champs texte */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nom / Identifiant *</label>
                        <input
                          type="text"
                          required
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          placeholder="Ex: LOM-MARCHE-04"
                          className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Type de caméra *</label>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="ip">IP Standard (RTSP)</option>
                          <option value="esp32">ESP32-CAM (MQTT)</option>
                          <option value="mobile">Client Mobile (App)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Adresse Physique / Localisation *</label>
                        <input
                          type="text"
                          required
                          value={localisation}
                          onChange={(e) => setLocalisation(e.target.value)}
                          placeholder="Ex: Grand Marché, Lomé"
                          className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">URL Flux Vidéo (RTSP/HTTP)</label>
                        <input
                          type="text"
                          value={urlFlux}
                          onChange={(e) => setUrlFlux(e.target.value)}
                          placeholder="Ex: rtsp://192.168.1.100/stream1"
                          className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Description / Notes</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Notes d'installation, marque..."
                          rows={2}
                          className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                          <span className="block text-sm font-semibold text-gray-800 dark:text-white">Caméra en Service</span>
                          <span className="text-[11px] text-gray-400">Activer le flux vidéo et l'analyse intelligente</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEstActive(!estActive)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${estActive ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${estActive ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>
                    </div>

                    {/* Right column — carte Leaflet */}
                    <div className="flex flex-col">
                      <span className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                        Positionner sur la carte (cliquer pour placer)
                      </span>
                      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 relative" style={{ height: 260 }}>
                        <MapContainer center={[6.1319, 1.2227]} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <LocationPicker onPick={(pickedLat, pickedLng) => { setLat(pickedLat); setLng(pickedLng); }} />
                          <Marker position={[lat, lng]} />
                        </MapContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            required
                            value={lat}
                            onChange={(e) => setLat(parseFloat(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            required
                            value={lng}
                            onChange={(e) => setLng(parseFloat(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2 italic">
                        💡 Cliquez sur la carte pour positionner la caméra automatiquement
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2 text-sm border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-65 transition-colors cursor-pointer"
                    >
                      {saving ? "Enregistrement..." : "Enregistrer la caméra"}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}


        {/* Liste des caméras */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map((cam) => (
              <div
                key={cam.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">ID: {cam.id.slice(0, 8)}</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{cam.nom}</h3>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${cam.est_active ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                    >
                      {cam.est_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-left space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📍 <span className="font-medium">Localisation:</span> {cam.localisation}
                    </p>
                    {cam.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                        "{cam.description}"
                      </p>
                    )}
                    {cam.type && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Type: <span className="font-semibold uppercase font-mono">{cam.type}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>Lat: {cam.location_lat?.toFixed(4) ?? "N/A"}</span>
                  <span>Lng: {cam.location_lng?.toFixed(4) ?? "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && cameras.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500">Aucune caméra enregistrée pour le moment</p>
          </div>
        )}
      </div>
    </>
  );
}
