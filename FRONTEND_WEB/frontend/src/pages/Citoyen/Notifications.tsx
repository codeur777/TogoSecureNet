import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../services/api";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: 'validation' | 'rejet' | 'retrouve' | 'information' | 'systeme';
  titre: string;
  message: string;
  created_at: string;
  lu: boolean;
  signalement_id?: string;
}

const CitoyenNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'tous' | 'non-lu'>('tous');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/v1/notifications/");
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        console.error(e);
        toast.error("Erreur lors du chargement des notifications.");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(n =>
    filter === 'tous' ? true : !n.lu
  );

  const marquerCommeLu = async (id: string) => {
    try {
      await api.put(`/api/v1/notifications/${id}/mark-read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, lu: true } : n
      ));
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const marquerToutCommeLu = async () => {
    try {
      await api.put("/api/v1/notifications/mark-all-read");
      setNotifications(notifications.map(n => ({ ...n, lu: true })));
      toast.success("Toutes les notifications sont marquées comme lues");
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'validation':
        return (
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'rejet':
        return (
          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'retrouve':
        return (
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'information':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const nonLues = notifications.filter(n => !n.lu).length;

  return (
    <>
      <PageMeta
        title="Notifications | TOGO-SecureNet"
        description="Consultez vos notifications"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Notifications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Suivez toutes les mises à jour concernant vos signalements
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('tous')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'tous'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('non-lu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition relative ${
              filter === 'non-lu'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Non lues ({nonLues})
            {nonLues > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {nonLues}
              </span>
            )}
          </button>
        </div>
        
        {nonLues > 0 && (
          <button
            onClick={marquerToutCommeLu}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
              !notification.lu 
                ? 'border-brand-200 dark:border-brand-900/20 bg-brand-50/30 dark:bg-brand-900/5' 
                : 'border-gray-200 dark:border-gray-700'
            } p-6 hover:shadow-md transition cursor-pointer`}
            onClick={() => marquerCommeLu(notification.id)}
          >
            <div className="flex gap-4">
              {getTypeIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {notification.titre}
                    {!notification.lu && (
                      <span className="ml-2 inline-block w-2 h-2 bg-brand-500 rounded-full"></span>
                    )}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {notification.message}
                </p>
                {notification.signalement_id && (
                  <a
                    href={`/citoyen/mes-signalements`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    Voir le signalement
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune notification</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vous n'avez aucune notification pour le moment.
          </p>
        </div>
      )}
    </>
  );
};

export default CitoyenNotifications;
