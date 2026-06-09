import { useEffect, useState } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";

type Camera = {
  id: number;
  name: string;
  address: string;
  location_lat: number;
  location_lng: number;
  status: "active" | "maintenance" | "inactive";
};

export default function Cameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("6.1319");
  const [lng, setLng] = useState("1.2227");
  const [status, setStatus] = useState<"active" | "maintenance" | "inactive">("active");
  const [saving, setSaving] = useState(false);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/cameras");
      setCameras(res.data);
    } catch (e) {
      console.error(e);
      // Mock Data if api fails
      setCameras([
        { id: 1, name: "LOM-MARCHE-01", address: "Grand Marché, Lomé", location_lat: 6.1319, location_lng: 1.2227, status: "active" },
        { id: 2, name: "LOM-AERO-04", address: "Aéroport Débarquement", location_lat: 6.1455, location_lng: 1.2105, status: "active" },
        { id: 3, name: "LOM-PORT-02", address: "Port Autonome Quai 3", location_lat: 6.1250, location_lng: 1.2350, status: "maintenance" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name,
        address,
        location_lat: parseFloat(lat),
        location_lng: parseFloat(lng),
        status,
      };
      const res = await api.post("/api/v1/cameras", payload);
      setCameras((prev) => [...prev, res.data]);
      setShowAddForm(false);
      setName("");
      setAddress("");
      setLat("6.1319");
      setLng("1.2227");
    } catch (err) {
      console.error(err);
      // Offline fallback
      const mockNew: Camera = {
        id: cameras.length + 1,
        name,
        address,
        location_lat: parseFloat(lat),
        location_lng: parseFloat(lng),
        status,
      };
      setCameras((prev) => [...prev, mockNew]);
      setShowAddForm(false);
      setName("");
      setAddress("");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") return "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400";
    if (status === "maintenance") return "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400";
    return "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400";
  };

  return (
    <>
      <PageMeta
        title="Gestion des Caméras | TOGO-SecureNet"
        description="Configuration et statut des caméras de surveillance"
      />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">📹 Réseau de Caméras</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enregistrez et contrôlez le statut des caméras IP déployées sur le territoire.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <span>➕</span> Ajouter une caméra
          </button>
        </div>

        {/* Modal d'ajout */}
        {showAddForm && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white/95">Ajouter une Caméra</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddCamera} className="mt-4 space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nom / Identifiant</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: LOM-MARCHE-04"
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Adresse physique / IP</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Grand Marché, Lomé"
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Statut Initial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active (En service)</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs border border-gray-200 dark:border-gray-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des caméras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <p className="text-sm text-gray-400 col-span-3 text-center py-12">Chargement des caméras...</p>
          ) : cameras.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-3 text-center py-12">Aucune caméra enregistrée.</p>
          ) : (
            cameras.map((camera) => (
              <div
                key={camera.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 font-mono">ID: {camera.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(camera.status)}`}>
                      {camera.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white/95 mt-2">{camera.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📍 {camera.address}</p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>Lat: {camera.location_lat.toFixed(4)}</span>
                  <span>Lng: {camera.location_lng.toFixed(4)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
