import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface Stats {
  total_signalements: number;
  en_attente: number;
  valides: number;
  notifications: number;
}

interface Notification {
  id: string;
  type: string;
  titre: string;
  message: string;
  created_at: string;
  lu: boolean;
}

const RecentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/v1/notifications/");
        const notifs = Array.isArray(res.data) ? res.data.slice(0, 3) : [];
        setNotifications(notifs);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'validation':
        return 'bg-blue-500';
      case 'retrouve':
        return 'bg-green-500';
      case 'information':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'validation':
        return 'bg-blue-50 dark:bg-blue-900/10';
      case 'retrouve':
        return 'bg-green-50 dark:bg-green-900/10';
      case 'information':
        return 'bg-yellow-50 dark:bg-yellow-900/10';
      default:
        return 'bg-gray-50 dark:bg-gray-900/10';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    return 'Il y a quelques minutes';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications récentes</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900/10 rounded-lg animate-pulse">
              <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications récentes</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune notification</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`flex gap-3 p-3 ${getTypeBg(notif.type)} rounded-lg`}>
              <div className={`${getTypeIcon(notif.type)} p-2 rounded-lg h-fit`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{notif.titre}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{notif.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{getTimeAgo(notif.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CitoyenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total_signalements: 0,
    en_attente: 0,
    valides: 0,
    notifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [signalements, notifications] = await Promise.all([
          api.get("/api/v1/signalements/"),
          api.get("/api/v1/notifications/")
        ]);
        
        const sigs = Array.isArray(signalements.data) ? signalements.data : [];
        const notifs = Array.isArray(notifications.data) ? notifications.data : [];
        
        setStats({
          total_signalements: sigs.length,
          en_attente: sigs.filter((s: any) => s.statut === 'en_attente').length,
          valides: sigs.filter((s: any) => s.statut === 'valide').length,
          notifications: notifs.length
        });
      } catch (e: any) {
        console.error(e);
        toast.error("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <PageMeta
        title="Espace Citoyen | TOGO-SecureNet"
        description="Plateforme citoyenne de signalement"
      />
      
      <div className="mb-8">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur TogoSecureNet</h1>
          <p className="text-brand-100">
            Plateforme citoyenne de signalement et de recherche de personnes disparues et d'engins volés
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {loading ? "..." : stats.total_signalements}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Mes signalements</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {loading ? "..." : stats.en_attente}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {loading ? "..." : stats.valides}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Validés</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {loading ? "..." : stats.notifications}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <a
              href="/report/person"
              className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/20 transition group"
            >
              <div className="bg-blue-500 p-3 rounded-lg group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Signaler une personne disparue</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Déclarez la disparition d'une personne</p>
              </div>
            </a>

            <a
              href="/report/vehicle"
              className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/20 transition group"
            >
              <div className="bg-orange-500 p-3 rounded-lg group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Signaler un engin volé</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Déclarez le vol d'un véhicule</p>
              </div>
            </a>

            <a
              href="/citoyen/mes-signalements"
              className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/20 transition group"
            >
              <div className="bg-green-500 p-3 rounded-lg group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Consulter mes signalements</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Suivez l'état de vos déclarations</p>
              </div>
            </a>
          </div>
        </div>

        <RecentNotifications />
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-xl">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Ensemble pour plus de sécurité</h2>
            <p className="text-green-100">
              Votre contribution aide les autorités à retrouver les personnes disparues et les biens volés plus rapidement.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitoyenDashboard;
