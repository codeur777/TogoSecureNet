import { useState } from "react";
import PageMeta from "../components/common/PageMeta";

interface Detection {
  id: number;
  type: 'personne_recherchee' | 'comportement_suspect' | 'intrusion' | 'engin_vole';
  titre: string;
  description: string;
  dateDetection: string;
  camera: string;
  lieu: string;
  image: string;
  confiance: number;
  statut: 'nouvelle' | 'en_cours' | 'confirmee' | 'fausse_alerte';
  actions: string[];
}

const Detections = () => {
  const [detections] = useState<Detection[]>([
    {
      id: 1,
      type: "personne_recherchee",
      titre: "Personne recherchée identifiée",
      description: "Le système a identifié Jean KOUAME, signalé disparu depuis 3 jours",
      dateDetection: "2024-01-20T14:30:00",
      camera: "CAM-005",
      lieu: "Lomé, Tokoin - Intersection principale",
      image: "/images/user/user-01.png",
      confiance: 95,
      statut: "nouvelle",
      actions: ["Alerter les autorités", "Envoyer une équipe"]
    },
    {
      id: 2,
      type: "comportement_suspect",
      titre: "Comportement suspect détecté",
      description: "Personne rôdant autour d'un véhicule garé depuis 10 minutes",
      dateDetection: "2024-01-20T13:15:00",
      camera: "CAM-012",
      lieu: "Lomé, Hédzranawoé - Parking",
      image: "/images/user/user-02.png",
      confiance: 78,
      statut: "en_cours",
      actions: ["Surveillance continue", "Alerte de proximité"]
    },
    {
      id: 3,
      type: "engin_vole",
      titre: "Véhicule volé repéré",
      description: "Toyota Corolla TG 1234 AB identifiée sur l'autoroute",
      dateDetection: "2024-01-20T11:45:00",
      camera: "CAM-020",
      lieu: "Autoroute Lomé-Kara",
      image: "/images/user/user-03.png",
      confiance: 88,
      statut: "confirmee",
      actions: ["Barrage routier", "Poursuite engagée"]
    },
  ]);

  const [filter, setFilter] = useState<'tous' | 'nouvelle' | 'en_cours' | 'confirmee' | 'fausse_alerte'>('tous');
  const [typeFilter, setTypeFilter] = useState<'tous' | string>('tous');

  const filteredDetections = detections.filter(d => {
    const statutMatch = filter === 'tous' ? true : d.statut === filter;
    const typeMatch = typeFilter === 'tous' ? true : d.type === typeFilter;
    return statutMatch && typeMatch;
  });

  const getStatutBadge = (statut: string) => {
    const badges = {
      nouvelle: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      en_cours: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      confirmee: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      fausse_alerte: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return badges[statut as keyof typeof badges] || badges.nouvelle;
  };

  const getStatutLabel = (statut: string) => {
    const labels = {
      nouvelle: "Nouvelle",
      en_cours: "En cours",
      confirmee: "Confirmée",
      fausse_alerte: "Fausse alerte"
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      personne_recherchee: "Personne recherchée",
      comportement_suspect: "Comportement suspect",
      intrusion: "Intrusion",
      engin_vole: "Engin volé"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      personne_recherchee: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      comportement_suspect: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      intrusion: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      engin_vole: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    };
    return badges[type as keyof typeof badges] || badges.comportement_suspect;
  };

  const nouvelles = detections.filter(d => d.statut === 'nouvelle').length;

  return (
    <>
      <PageMeta
        title="Détections IA | TOGO-SecureNet"
        description="Détections automatiques par intelligence artificielle"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Détections IA
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Détections automatiques effectuées par l'intelligence artificielle
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{nouvelles}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nouvelles détections</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {detections.filter(d => d.statut === 'en_cours').length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">En cours</p>
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
                  {detections.filter(d => d.statut === 'confirmee').length}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmées</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(detections.reduce((acc, d) => acc + d.confiance, 0) / detections.length)}%
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confiance moy.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('tous')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'tous'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('nouvelle')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'nouvelle'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Nouvelles
          </button>
          <button
            onClick={() => setFilter('en_cours')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'en_cours'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('confirmee')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'confirmee'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Confirmées
          </button>
          <button
            onClick={() => setFilter('fausse_alerte')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'fausse_alerte'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Fausses alertes
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {['tous', 'personne_recherchee', 'comportement_suspect', 'intrusion', 'engin_vole'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                typeFilter === type
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {type === 'tous' ? 'Tous les types' : getTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredDetections.map((detection) => (
          <div
            key={detection.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition"
          >
            <div className="md:flex">
              <div className="md:w-64 md:flex-shrink-0">
                <img
                  src={detection.image}
                  alt="Détection"
                  className="h-48 w-full object-cover md:h-full"
                />
              </div>
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {detection.titre}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(detection.statut)}`}>
                        {getStatutLabel(detection.statut)}
                      </span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getTypeBadge(detection.type)}`}>
                      {getTypeLabel(detection.type)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Confiance IA
                    </div>
                    <div className="text-2xl font-bold text-brand-500">
                      {detection.confiance}%
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {detection.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{detection.camera}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{detection.lieu}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(detection.dateDetection).toLocaleString('fr-FR')}</span>
                  </div>
                </div>

                {detection.actions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Actions suggérées:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detection.actions.map((action, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-lg text-xs font-medium"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium">
                    Voir détails
                  </button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium">
                    Confirmer
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium">
                    Fausse alerte
                  </button>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium">
                    Voir vidéo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDetections.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune détection trouvée</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aucun résultat pour ces filtres.
          </p>
        </div>
      )}
    </>
  );
};

export default Detections;
