import { useEffect, useState, useCallback } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";
import { UserIcon, MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface PersonneDisparue {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  photo?: string;
  date_disparition: string;
  lieu_disparition: string;
  description: string;
  statut: "recherche" | "retrouve" | "clos";
  signale_par: string;
}

const PersonnesDisparues = () => {
  const [personnes, setPersonnes] = useState<PersonneDisparue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"tous" | "recherche" | "retrouve" | "clos">("tous");
  const [search, setSearch] = useState("");

  const fetchPersonnes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/personnes-disparues/");
      setPersonnes(Array.isArray(res.data) ? res.data : res.data.results ?? []);
    } catch (e: any) {
      console.error(e);
      toast.error("Impossible de charger les personnes disparues.");
      setPersonnes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonnes();
  }, [fetchPersonnes]);

  const handleUpdateStatut = async (id: number, statut: PersonneDisparue["statut"]) => {
    try {
      await api.patch(`/api/v1/missing-persons/${id}`, { statut });
      setPersonnes((prev) => prev.map((p) => (p.id === id ? { ...p, statut } : p)));
      toast.success("Statut mis à jour.");
    } catch {
      toast.error("Erreur lors de la mise à jour du statut.");
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

  const filteredPersonnes = personnes.filter((p) => {
    const matchFilter = filter === "tous" || p.statut === filter;
    const matchSearch =
      !search ||
      `${p.prenom} ${p.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      p.lieu_disparition.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: personnes.length,
    recherche: personnes.filter((p) => p.statut === "recherche").length,
    retrouve: personnes.filter((p) => p.statut === "retrouve").length,
    clos: personnes.filter((p) => p.statut === "clos").length,
  };

  return (
    <>
      <PageMeta title="Personnes Disparues | TOGO-SecureNet" description="Gestion des signalements de personnes disparues" />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl shrink-0">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Personnes Disparues</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {stats.recherche} en recherche · {stats.retrouve} retrouvée{stats.retrouve !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchPersonnes} title="Actualiser"
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Rechercher par nom ou lieu..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] rounded-xl dark:text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["tous", "recherche", "retrouve", "clos"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filter === f
                    ? f === "tous" ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                      : f === "recherche" ? "bg-red-600 text-white"
                      : f === "retrouve" ? "bg-emerald-600 text-white"
                      : "bg-gray-500 text-white"
                    : "bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                {f === "tous" ? "Tous" : f === "recherche" ? "En recherche" : f === "retrouve" ? "Retrouvés" : "Clos"}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des personnes */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="w-full h-56 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-5 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPersonnes.length === 0 ? (
          <div className="text-center py-16">
            <UserIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-400 font-medium">
              {search || filter !== "tous" ? "Aucune personne ne correspond aux filtres." : "Aucun signalement enregistré."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonnes.map((personne) => (
              <div key={personne.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={personne.photo || `https://ui-avatars.com/api/?name=${personne.prenom}+${personne.nom}&size=256&background=ef4444&color=fff&bold=true`}
                    alt={`${personne.prenom} ${personne.nom}`}
                    className="w-full h-56 object-cover"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(personne.statut)}`}>
                    {personne.statut === "recherche" ? "En recherche" : personne.statut === "retrouve" ? "Retrouvé(e)" : "Clos"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{personne.prenom} {personne.nom}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {personne.age && <p><span className="font-semibold">Âge:</span> {personne.age} ans</p>}
                    <p><span className="font-semibold">Disparu(e) le:</span> {new Date(personne.date_disparition).toLocaleDateString("fr-FR")}</p>
                    <p><span className="font-semibold">Lieu:</span> {personne.lieu_disparition}</p>
                    {personne.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{personne.description}</p>}
                    <p className="text-xs"><span className="font-semibold">Signalé par:</span> {personne.signale_par}</p>
                  </div>
                  {personne.statut === "recherche" && (
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => handleUpdateStatut(personne.id, "retrouve")}
                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors">
                        ✓ Retrouvé(e)
                      </button>
                      <button onClick={() => handleUpdateStatut(personne.id, "clos")}
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

export default PersonnesDisparues;
