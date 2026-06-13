import { useEffect, useState, useCallback } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";
import toast from "react-hot-toast";

const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const COLORS = ["bg-purple-500", "bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500"];

interface DailyAlert {
  date: string;
  total: number;
  critical: number;
}

interface TopCamera {
  camera_id: string;
  camera_name: string;
  alert_count: number;
}

interface Stats {
  total_cameras: number;
  active_cameras: number;
  total_alerts: number;
  total_alerts_today: number;
  critical_alerts_today: number;
  avg_confidence: number;
  most_active_camera: string;
  daily_alerts: DailyAlert[];
  top_cameras: TopCamera[];
}

export default function Statistiques() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month">("week");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/dashboard/summary");
      setStats(res.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Calcul du max pour le graphique en barres
  const maxAlerts = stats ? Math.max(...(stats.daily_alerts?.map((d) => d.total) || [1]), 1) : 1;
  const maxTopCam = stats?.top_cameras?.length ? Math.max(...stats.top_cameras.map((c) => c.alert_count), 1) : 1;

  return (
    <>
      <PageMeta
        title="Statistiques | TOGO-SecureNet"
        description="Analyses des détections et rapports de sécurité TogoSecureNet"
      />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Statistiques Analytiques</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Indicateurs clés de performance et rapports sur l'activité du système.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              {(["week", "month"] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-xs font-semibold transition-colors ${
                    period === p ? "bg-purple-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}>
                  {p === "week" ? "7 jours" : "30 jours"}
                </button>
              ))}
            </div>
            <button onClick={fetchStats} title="Actualiser"
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              label: "Total Alertes",
              value: loading ? "—" : stats?.total_alerts ?? 0,
              sub: "depuis le début",
              color: "text-gray-800 dark:text-white",
              bg: "bg-white dark:bg-white/[0.03]",
            },
            {
              label: "Alertes Aujourd'hui",
              value: loading ? "—" : stats?.total_alerts_today ?? 0,
              sub: `dont ${stats?.critical_alerts_today ?? 0} critiques`,
              color: "text-orange-600 dark:text-orange-400",
              bg: "bg-white dark:bg-white/[0.03]",
            },
            {
              label: "Taux de Confiance",
              value: loading ? "—" : `${((stats?.avg_confidence ?? 0) * 100).toFixed(1)}%`,
              sub: "confiance moyenne",
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-white dark:bg-white/[0.03]",
            },
            {
              label: "Caméras Actives",
              value: loading ? "—" : `${stats?.active_cameras ?? 0} / ${stats?.total_cameras ?? 0}`,
              sub: "en service",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-white dark:bg-white/[0.03]",
            },
            {
              label: "Caméra la + Active",
              value: loading ? "—" : stats?.most_active_camera ?? "—",
              sub: "plus de détections",
              color: "text-purple-600 dark:text-purple-400",
              bg: "bg-white dark:bg-white/[0.03]",
              small: true,
            },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-2xl border border-gray-200 ${kpi.bg} p-4 dark:border-gray-800`}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{kpi.label}</p>
              <p className={`${kpi.small ? "text-sm" : "text-2xl"} font-bold mt-2 ${kpi.color} leading-tight`}>{kpi.value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Graphique en barres — Alertes par jour */}
          <div className="col-span-12 lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Alertes par Jour</h3>
                <p className="text-xs text-gray-400 mt-0.5">Détections générales vs cas critiques</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-sm inline-block"></span> Total</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-sm inline-block"></span> Critiques</span>
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : stats?.daily_alerts?.length ? (
              <div className="h-64 flex items-end gap-2 sm:gap-4 border-b border-l border-gray-100 dark:border-gray-800 px-2 pb-0 pt-4">
                {stats.daily_alerts.map((day) => {
                  const d = new Date(day.date);
                  const label = DAYS_FR[d.getDay()];
                  const totalH = maxAlerts > 0 ? (day.total / maxAlerts) * 100 : 0;
                  const critH = maxAlerts > 0 ? (day.critical / maxAlerts) * 100 : 0;
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] text-gray-400 font-medium">{day.total}</span>
                      <div className="w-full flex gap-0.5 items-end justify-center h-48">
                        <div
                          className="flex-1 bg-blue-500 rounded-t transition-all duration-500"
                          style={{ height: `${totalH}%` }}
                          title={`${day.total} alertes`}
                        />
                        <div
                          className="flex-1 bg-red-500 rounded-t transition-all duration-500"
                          style={{ height: `${critH}%` }}
                          title={`${day.critical} critiques`}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">{label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-gray-400">
                Aucune donnée disponible.
              </div>
            )}
          </div>

          {/* Top Caméras */}
          <div className="col-span-12 lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-1"> Top Caméras</h3>
            <p className="text-xs text-gray-400 mb-5">Nombre d'alertes générées par caméra</p>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1 animate-pulse">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : stats?.top_cameras?.length ? (
              <div className="space-y-4">
                {stats.top_cameras.map((cam, i) => {
                  const pct = maxTopCam > 0 ? (cam.alert_count / maxTopCam) * 100 : 0;
                  return (
                    <div key={cam.camera_id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                        <span className="truncate max-w-[150px]">{cam.camera_name}</span>
                        <span className="ml-2 text-gray-400 shrink-0">{cam.alert_count} alerte{cam.alert_count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${COLORS[i % COLORS.length]} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Aucune donnée disponible.</p>
            )}
          </div>
        </div>

        {/* Tableau récapitulatif des alertes par jour */}
        {!loading && stats?.daily_alerts?.length ? (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">Détail quotidien</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-right">Alertes totales</th>
                    <th className="px-5 py-3 text-right">Critiques</th>
                    <th className="px-5 py-3 text-right">Taux critique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[...stats.daily_alerts].reverse().map((day) => {
                    const rate = day.total > 0 ? ((day.critical / day.total) * 100).toFixed(0) : "0";
                    return (
                      <tr key={day.date} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300">
                          {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" })}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-gray-800 dark:text-white">{day.total}</td>
                        <td className="px-5 py-3 text-right">
                          {day.critical > 0 ? (
                            <span className="text-red-600 dark:text-red-400 font-semibold">{day.critical}</span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right text-gray-500">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

