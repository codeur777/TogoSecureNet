import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";
import toast from "react-hot-toast";

interface AuditLog {
  id: number;
  utilisateur: string;
  action: string;
  module: 'utilisateurs' | 'signalements' | 'detections' | 'cameras' | 'systeme';
  description: string;
  dateHeure: string;
  ipAddress: string;
  statut: 'succes' | 'echec' | 'avertissement';
  details?: string;
}

const Audit = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState<'tous' | string>('tous');
  const [filterStatut, setFilterStatut] = useState<'tous' | 'succes' | 'echec' | 'avertissement'>('tous');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/audit/logs");
      setLogs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des logs:", error);
      toast.error("Impossible de charger les logs d'audit");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const moduleMatch = filterModule === 'tous' ? true : log.module === filterModule;
    const statutMatch = filterStatut === 'tous' ? true : log.statut === filterStatut;
    return moduleMatch && statutMatch;
  });

  const getStatutBadge = (statut: string) => {
    const badges = {
      succes: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      echec: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      avertissement: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    };
    return badges[statut as keyof typeof badges] || badges.succes;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'succes':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'echec':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  const getModuleBadge = (module: string) => {
    const badges = {
      utilisateurs: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      signalements: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      detections: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      cameras: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400",
      systeme: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return badges[module as keyof typeof badges] || badges.systeme;
  };

  return (
    <>
      <PageMeta
        title="Audit | TOGO-SecureNet"
        description="Journal d'audit et traçabilité système"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Journal d'audit
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Consultez l'historique complet des actions système
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total événements</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {logs.filter(l => l.statut === 'succes').length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Succès</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {logs.filter(l => l.statut === 'echec').length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Échecs</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {logs.filter(l => l.statut === 'avertissement').length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avertissements</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterModule('tous')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterModule === 'tous'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Tous les modules
          </button>
          {['utilisateurs', 'signalements', 'detections', 'cameras', 'systeme'].map(module => (
            <button
              key={module}
              onClick={() => setFilterModule(module)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterModule === module
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {module.charAt(0).toUpperCase() + module.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterStatut('tous')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatut === 'tous'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Tous les statuts
          </button>
          <button
            onClick={() => setFilterStatut('succes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatut === 'succes'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Succès
          </button>
          <button
            onClick={() => setFilterStatut('echec')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatut === 'echec'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Échecs
          </button>
          <button
            onClick={() => setFilterStatut('avertissement')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatut === 'avertissement'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Avertissements
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(log.dateHeure).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.utilisateur}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getModuleBadge(log.module || 'systeme')}`}>
                        {log.module ? log.module.charAt(0).toUpperCase() + log.module.slice(1) : 'Système'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900 dark:text-white">{log.action}</p>
                        <p className="text-gray-600 dark:text-gray-400">{log.description}</p>
                        {log.details && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{log.details}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatutIcon(log.statut)}
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(log.statut || 'succes')}`}>
                          {log.statut ? log.statut.charAt(0).toUpperCase() + log.statut.slice(1) : 'Succès'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl mt-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun événement trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aucun résultat pour ces filtres.
          </p>
        </div>
      )}
    </>
  );
};

export default Audit;
