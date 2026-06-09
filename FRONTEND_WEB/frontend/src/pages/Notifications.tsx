import { useState } from "react";
import PageMeta from "../components/common/PageMeta";

interface Notification {
  id: number;
  type: 'alerte' | 'detection' | 'systeme' | 'signalement';
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  priorite: 'haute' | 'moyenne' | 'basse';
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "alerte",
      titre: "Alerte intrusion détectée",
      message: "Une personne non autorisée a été détectée par la caméra CAM-001 à Lomé Centre",
      date: "2024-01-20T14:30:00",
      lu: false,
      priorite: "haute"
    },
    {
      id: 2,
      type: "detection",
      titre: "Personne recherchée identifiée",
      message: "Le système a identifié Jean KOUAME sur la caméra CAM-005 à Tokoin",
      date: "2024-01-20T12:15:00",
      lu: false,
      priorite: "haute"
    },
    {
      id: 3,
      type: "signalement",
      titre: "Nouveau signalement reçu",
      message: "Un nouveau signalement de personne disparue a été enregistré",
      date: "2024-01-20T10:00:00",
      lu: true,
      priorite: "moyenne"
    },
    {
      id: 4,
      type: "systeme",
      titre: "Maintenance caméra",
      message: "La caméra CAM-003 nécessite une maintenance",
      date: "2024-01-19T16:45:00",
      lu: true,
      priorite: "basse"
    },
  ]);

  const [filter, setFilter] = useState<'tous' | 'non-lu' | 'lu'>('tous');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'non-lu') return !n.lu;
    if (filter === 'lu') return n.lu;
    return true;
  });

  const marquerCommeLu = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, lu: true } : n
    ));
  };

  const marquerToutCommeLu = () => {
    setNotifications(notifications.map(n => ({ ...n, lu: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alerte':
        return (
          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'detection':
        return (
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        );
      case 'signalement':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-full">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

  const getPrioriteBadge = (priorite: string) => {
    const badges = {
      haute: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      moyenne: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      basse: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    };
    return badges[priorite as keyof typeof badges] || badges.basse;
  };

  const nonLues = notifications.filter(n => !n.lu).length;

  return (
    <>
      <PageMeta
        title="Notifications | TOGO-SecureNet"
        description="Centre de notifications du système"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Notifications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Consultez toutes vos notifications système
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'non-lu'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Non lues ({nonLues})
          </button>
          <button
            onClick={() => setFilter('lu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'lu'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Lues ({notifications.length - nonLues})
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
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {notification.titre}
                      {!notification.lu && (
                        <span className="ml-2 inline-block w-2 h-2 bg-brand-500 rounded-full"></span>
                      )}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPrioriteBadge(notification.priorite)}`}>
                      {notification.priorite === 'haute' ? 'Priorité haute' : 
                       notification.priorite === 'moyenne' ? 'Priorité moyenne' : 'Priorité basse'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(notification.date).toLocaleString('fr-FR')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default Notifications;
