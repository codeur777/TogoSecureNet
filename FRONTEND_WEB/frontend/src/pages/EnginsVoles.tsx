import { useEffect, useState, useCallback } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";
import toast from "react-hot-toast";

interface EnginVole {
  id: string;
  type_engin: string;
  marque: string;
  modele: string;
  plaque_immatriculation: string;
  couleur?: string;
  date_vol: string;
  lieu_vol?: string;
  statut: "recherche" | "retrouve" | "clos";
}

const EnginsVoles = () => {
  const [engins, setEngins] = useState<EnginVole[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"tous" | "recherche" | "retrouve" | "clos">("tous");
  const [typeFilter, setTypeFilter] = useState<"tous" | string>("tous");
  const [search, setSearch] = useState("");

  const fetchEngins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/engins-voles/");
      setEngins(Array.isArray(res.data) ? res.data : res.data.results ?? []);
    } catch (e: any) {
      console.error(e);
      toast.error("Impossible de charger les engins volés.");
      setEngins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEngins();
  }, [fetchEngins]);

  const handleUpdateStatut = async (id: string, statut: EnginVole["statut"]) => {
    try {
      await api.patch(`/api/v1/engins-voles/${id}`, { statut });
      setEngins((prev) => prev.map((e) => (e.id === id ? { ...e, statut } : e)));
      toast.success("Statut mis à jour.");
    } catch {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      recherche: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      retrouve: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
      clos: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    };
    return badges[statut as keyof typeof badges] || badges.clos;
  };

  const getTypeLabel = (t: string) => {
    const labels = { voiture: "🚗 Voiture", moto: "🏍️ Moto", camion: "🚛 Camion", autre: "🚌 Autre" };
    return labels[t?.toLowerCase() as keyof typeof labels] || t;
  };

  const getTypeBgColor = (t: string) => {
    const colors = { voiture: "bg-blue-50 dark:bg-blue-500/10", moto: "bg-purple-50 dark:bg-purple-500/10", camion: "bg-orange-50 dark:bg-orange-500/10", autre: "bg-gray-50 dark:bg-gray-500/10" };
    return colors[t?.toLowerCase() as keyof typeof colors] || colors.autre;
  };

  const filteredEngins = engins.filter((e) => {
    const matchFilter = filter === "tous" || e.statut === filter;
    const matchType = typeFilter === "tous" || e.type_engin?.toLowerCase() === typeFilter;
    const matchSearch = !search ||
      `${e.marque} ${e.modele}`.toLowerCase().includes(search.toLowerCase()) ||
      e.plaque_immatriculation?.toLowerCase().includes(search.toLowerCase()) ||
      e.lieu_vol?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchType && matchSearch;
  });

  const stats = {
    total: engins.length,
    recherche: engins.filter((e) => e.statut === "recherche").length,
    retrouve: engins.filter((e) => e.statut === "retrouve").length,
    clos: engins.filter((e) => e.statut === "clos").length,
  };

  return (
    <>
      <PageMeta title="Engins Volés | TOGO-SecureNet" description="Gestion des signalements de véhicules volés" />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl shrink-0">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Engins Volés</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {stats.recherche} en recherche · {stats.retrouve} retrouvé{stats.retrouve !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchEngins} title="Actualiser"
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-gray-800 dark:text-white" },
            { label: "En recherche", value: stats.recherche, color: "text-red-600 dark:text-red-400" },
            { label: "Retrouvés", value: stats.retrouve, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Clos", value: stats.clos, color: "text-gray-500 dark:text-gray-400" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{m.label}</p>
              <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Recherche + Filtres */}
        <div className="space-y-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Rechercher par marque, immatriculation ou lieu..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] rounded-xl dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase self-center mr-1">Statut:</span>
            {(["tous", "recherche", "retrouve", "clos"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f
                    ? f === "recherche" ? "bg-red-600 text-white" : f === "retrouve" ? "bg-emerald-600 text-white" : f === "clos" ? "bg-gray-500 text-white" : "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                    : "bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                {f === "tous" ? "Tous" : f === "recherche" ? "En recherche" : f === "retrouve" ? "Retrouvés" : "Clos"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase self-center mr-1">Type:</span>
            {(["tous", "voiture", "moto", "camion", "autre"] as const).map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  typeFilter === t
                    ? "bg-orange-600 text-white"
                    : "bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                {t === "tous" ? "Tous les types" : getTypeLabel(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des engins */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-5 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEngins.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <p className="text-sm text-gray-400 font-medium">
              {search || filter !== "tous" || typeFilter !== "tous" ? "Aucun engin ne correspond aux filtres." : "Aucun signalement enregistré."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngins.map((engin) => (
              <div key={engin.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={`https://via.placeholder.com/400x200/f97316/fff?text=${encodeURIComponent(engin.marque)}`}
                    alt={`${engin.marque} ${engin.modele}`}
                    className="w-full h-48 object-cover"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(engin.statut)}`}>
                    {engin.statut === "recherche" ? "En recherche" : engin.statut === "retrouve" ? "Retrouvé" : "Clos"}
                  </span>
                  <div className={`absolute top-4 left-4 px-2.5 py-1.5 rounded-xl text-xs font-bold ${getTypeBgColor(engin.type_engin)}`}>
                    {getTypeLabel(engin.type_engin)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{engin.marque} {engin.modele}</h3>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400 font-mono mb-3">{engin.plaque_immatriculation}</p>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {engin.couleur && <p><span className="font-semibold">Couleur:</span> {engin.couleur}</p>}
                    {engin.date_vol && <p><span className="font-semibold">Volé le:</span> {new Date(engin.date_vol).toLocaleDateString("fr-FR")}</p>}
                  </div>
                  {engin.statut === "recherche" && (
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => handleUpdateStatut(engin.id, "retrouve")}
                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors">
                        ✓ Retrouvé
                      </button>
                      <button onClick={() => handleUpdateStatut(engin.id, "clos")}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-semibold">
                        Clore
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EnginsVoles;
