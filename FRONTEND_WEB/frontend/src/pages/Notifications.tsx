import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface Notification {
  id: string;
  titre: string;
  message: string;
  lu: boolean;
  date_creation: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'tous' | 'non_lus'>('tous');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const marquerCommeLu = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/notifications/${id}/lire`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, lu: true } : n));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'tous' ? true : !n.lu
  );

  const nonLus = notifications.filter(n => !n.lu).length;

  return (
    <>
      <PageMeta title="Notifications | TOGO-SecureNet" description="Notifications système" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Notifications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{nonLus} notification(s) non lue(s)</p>
      </div>

      <div className="mb-6 flex gap-3">
        <button onClick={() => setFilter('tous')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'tous' ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Toutes</button>
        <button onClick={() => setFilter('non_lus')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'non_lus' ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>Non lues ({nonLus})</button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div></div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div key={notif.id} className={`bg-white dark:bg-gray-800 rounded-xl p-4 border ${notif.lu ? 'border-gray-200 dark:border-gray-700' : 'border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/10'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{notif.titre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notif.message}</p>
                  <p className="text-xs text-gray-500">{new Date(notif.date_creation).toLocaleString('fr-FR')}</p>
                </div>
                {!notif.lu && (
                  <button onClick={() => marquerCommeLu(notif.id)} className="px-3 py-1 bg-brand-500 text-white text-xs rounded hover:bg-brand-600">Marquer lu</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500">Aucune notification</p>
        </div>
      )}
    </>
  );
};

export default Notifications;
