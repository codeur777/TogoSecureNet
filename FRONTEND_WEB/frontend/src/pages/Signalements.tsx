import { useState } from "react";
import PageMeta from "../components/common/PageMeta";

interface Signalement {
  id: number;
  type: 'personne' | 'engin';
  titre: string;
  description: string;
  dateSignalement: string;
  lieu: string;
  statut: 'en_attente' | 'examine' | 'valide' | 'rejete' | 'clos';
  signalePar: string;
  contactSignaleur: string;
  priorite: 'haute' | 'moyenne' | 'basse';
}

const Signalements = () => {
  const [signalements] = useState<Signalement[]>([
    {
      id: 1,
      type: "personne",
      titre: "Disparition de Jean KOUAME",
      description: "Mon fils de 15 ans a disparu depuis hier soir. Il porte un t-shirt bleu.",
      dateSignalement: "2024-01-20T14:30:00",
      lieu: "Lomé, Tokoin",
      statut: "en_attente",
      signalePar: "Marie KOUAME",
      contactSignaleur: "+228 90 00 00 00",
      priorite: "haute"
    },
    {
      id: 2,
      type: "engin",
      titre: "Vol de Toyota Corolla",
      description: "Ma voiture a été volée cette nuit devant mon domicile. Immatriculation TG 1234 AB",
      dateSignalement: "2024-01-20T08:00:00",
      lieu: "Lomé, Kodjoviakopé",
      statut: "examine",
      signalePar: "ATAKPA Paul",
      contactSignaleur: "+228 91 11 11 11",
      priorite: "haute"
    },
    {
      id: 3,
      type: "personne",
      titre: "Personne âgée égarée",
      description: "Ma mère de 70 ans s'est égarée. Elle souffre d'Alzheimer.",
      dateSignalement: "2024-01-19T16:00:00",
      lieu: "Lomé, Bè",
      statut: "valide",
      signalePar: "GBADOE Kofi",
      contactSignaleur: "+228 92 22 22 22",
      priorite: "haute"
    },
  ]);

  const [filter, setFilter] = useState<'tous' | 'en_attente' | 'examine' | 'valide' | 'rejete' | 'clos'>('tous');
  const [typeFilter, setTypeFilter] = useState<'tous' | 'personne' | 'engin'>('tous');

  const filteredSignalements = signalements.filter(s => {
    const statutMatch = filter === 'tous' ? true : s.statut === filter;
    const typeMatch = typeFilter === 'tous' ? true : s.type === typeFilter;
    return statutMatch && typeMatch;
  });

  const getStatutBadge = (statut: string) => {
    const badges = {
      en_attente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      examine: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      valide: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejete: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      clos: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return badges[statut as keyof typeof badges] || badges.en_attente;
  };

  const getStatutLabel = (statut: string) => {
    const labels = {
      en_attente: "En attente",
      examine: "En examen",
      valide: "Validé",
      rejete: "Rejeté",
      clos: "Clos"
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const getPrioriteBadge = (priorite: string) => {
    const badges = {
      haute: "text-red-600 dark:text-red-400",
      moyenne: "text-yellow-600 dark:text-yellow-400",
      basse: "text-green-600 dark:text-green-400"
    };
    return badges[priorite as keyof typeof badges] || badges.basse;
  };

  const enAttente = signalements.filter(s => s.statut === 'en_attente').length;

  return (
    <>
      <PageMeta
        title="Signalements | TOGO-SecureNet"
        description="Gestion des signalements citoyens"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Signalements
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Examinez et validez les signalements des citoyens
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{enAttente}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Signalements en attente d'examen</p>
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
            Tous
          </button>
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'en_attente'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('examine')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'examine'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            En examen
          </button>
          <button
            onClick={() => setFilter('valide')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'valide'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Validés
          </button>
          <button
            onClick={() => setFilter('rejete')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'rejete'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Rejetés
          </button>
          <button
            onClick={() => setFilter('clos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'clos'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Clos
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setTypeFilter('tous')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              typeFilter === 'tous'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Tous les types
          </button>
          <button
            onClick={() => setTypeFilter('personne')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              typeFilter === 'personne'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Personnes
          </button>
          <button
            onClick={() => setTypeFilter('engin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              typeFilter === 'engin'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Engins
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSignalements.map((signalement) => (
          <div
            key={signalement.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {signalement.titre}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(signalement.statut)}`}>
                    {getStatutLabel(signalement.statut)}
                  </span>
                  <span className={`text-xs font-semibold uppercase ${getPrioriteBadge(signalement.priorite)}`}>
                    {signalement.priorite}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {signalement.signalePar}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(signalement.dateSignalement).toLocaleString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {signalement.lieu}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                signalement.type === 'personne' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
              }`}>
                {signalement.type === 'personne' ? 'Personne' : 'Engin'}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {signalement.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{signalement.contactSignaleur}</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium">
                Examiner
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium">
                Valider
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium">
                Rejeter
              </button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium">
                Détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSignalements.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun signalement trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aucun résultat pour ces filtres.
          </p>
        </div>
      )}
    </>
  );
};

export default Signalements;
