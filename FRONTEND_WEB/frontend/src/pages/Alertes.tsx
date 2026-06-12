import { useEffect, useState } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";

type Alert = {
  id: string;
  detection_id: string;
  niveau_gravite: string;
  type_detection: string;
  message: string;
  est_lue: boolean;
  date_emission: string;
  person_name?: string;
  camera_name?: string;
};

export default function Alertes() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/alertes/");
      setAlerts(Array.isArray(res.data) ? res.data : res.data.results ?? []);
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.status === 401
        ? "Session expirée, veuillez vous reconnecter."
        : "Impossible de charger les alertes. Vérifiez la connexion au serveur.";
      import("react-hot-toast").then(({ default: toast }) => toast.error(msg));
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpdateStatus = async (id: string) => {
    try {
      await api.patch(`/api/v1/alertes/${id}/lire`);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, est_lue: true } : a)));
      import("react-hot-toast").then(({ default: toast }) =>
        toast.success("Alerte marquée comme lue.")
      );
    } catch (e: any) {
      console.error(e);
      import("react-hot-toast").then(({ default: toast }) => toast.error("Erreur lors de la mise à jour."));
    }
  };

  const getGravityColor = (level: string) => {
    if (level === "tres_grave") return "text-error-600 bg-error-50 dark:bg-error-500/15 dark:text-error-400 border border-error-100 dark:border-error-500/20";
    if (level === "grave") return "text-orange-600 bg-orange-50 dark:bg-orange-500/15 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20";
    return "text-warning-600 bg-warning-50 dark:bg-warning-500/15 dark:text-warning-400 border border-warning-100 dark:border-warning-500/20";
  };

  const getStatusBadge = (est_lue: boolean) => {
    return est_lue 
      ? "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400"
      : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400";
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "critical") return a.niveau_gravite === "tres_grave";
    if (filter === "high") return a.niveau_gravite === "grave";
    if (filter === "resolved") return a.est_lue;
    return true;
  });

  return (
    <>
      <PageMeta
        title="Alertes de Sécurité | TOGO-SecureNet"
        description="Liste et filtrage des alertes de sécurité de TogoSecureNet"
      />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Historique des Alertes
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Visualisez et gérez les alertes générées par le système de reconnaissance faciale.
            </p>
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 dark:bg-white/[0.03] dark:border-gray-800 dark:text-gray-400"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter("critical")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "critical"
                  ? "bg-error-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 dark:bg-white/[0.03] dark:border-gray-800 dark:text-gray-400"
              }`}
            >
              Critiques
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "high"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 dark:bg-white/[0.03] dark:border-gray-800 dark:text-gray-400"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Élevées
            </button>
            <button
              onClick={() => setFilter("resolved")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === "resolved"
                  ? "bg-gray-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 dark:bg-white/[0.03] dark:border-gray-800 dark:text-gray-400"
              }`}
            >
              Résolues
            </button>
          </div>
        </div>

        {/* Tableau / Grid des alertes */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-white/[0.01]">
                  <th className="px-6 py-4">Gravité / Statut</th>
                  <th className="px-6 py-4">Personne</th>
                  <th className="px-6 py-4">Caméra & Lieu</th>
                  <th className="px-6 py-4">Confiance</th>
                  <th className="px-6 py-4">Date & Heure</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      Chargement des alertes...
                    </td>
                  </tr>
                ) : filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      Aucune alerte correspondante.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getGravityColor(alert.niveau_gravite)}`}>
                            {alert.niveau_gravite}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${getStatusBadge(alert.est_lue)}`}>
                            {alert.est_lue ? "Lue" : "Non lue"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white/90">
                        {alert.type_detection}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {alert.camera_name || "Caméra inconnue"}
                          </span>
                          <span className="text-xs text-gray-500">{alert.message}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        —
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Date(alert.date_emission).toLocaleDateString("fr-FR")} à{" "}
                        {new Date(alert.date_emission).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!alert.est_lue && (
                            <button
                              onClick={() => handleUpdateStatus(alert.id)}
                              className="px-2.5 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg font-medium transition-colors"
                            >
                              Marquer lue
                            </button>
                          )}
                          {alert.est_lue && (
                            <span className="text-xs text-gray-400 font-medium">Lue</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
