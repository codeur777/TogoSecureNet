import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

interface Signalement {
  id: number;
  type: 'personne' | 'engin';
  titre: string;
  description: string;
  dateSignalement: string;
  statut: 'en_attente' | 'examine' | 'valide' | 'rejete' | 'clos';
  commentaireAdmin?: string;
}

const MesSignalements = () => {
  const [signalements] = useState<Signalement[]>([
    {
      id: 1,
      type: "personne",
      titre: "Disparition de mon fils Jean",
      description: "Mon fils de 15 ans a disparu depuis hier soir. Il porte un t-shirt bleu.",
      dateSignalement: "2024-01-20T14:30:00",
      statut: "valide",
      commentaireAdmin: "Signalement validé. Recherches en cours."
    },
    {
      id: 2,
      type: "engin",
      titre: "Vol de ma Toyota Corolla",
      description: "Ma voiture a été volée cette nuit devant mon domicile.",
      dateSignalement: "2024-01-19T08:00:00",
      statut: "examine",
      commentaireAdmin: "Dossier en cours d'examen par nos services."
    },
    {
      id: 3,
      type: "personne",
      titre: "Ma mère égarée",
      description: "Ma mère de 70 ans s'est égarée. Elle souffre d'Alzheimer.",
      dateSignalement: "2024-01-18T16:00:00",
      statut: "en_attente"
    },
  ]);

  const [filter, setFilter] = useState<'tous' | 'en_attente' | 'examine' | 'valide' | 'rejete' | 'clos'>('tous');

  const filteredSignalements = signalements.filter(s =>
    filter === 'tous' ? true : s.statut === filter
  );

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
      en_attente: "En attente d'examen",
      examine: "En cours d'examen",
      valide: "Validé",
      rejete: "Rejeté",
      clos: "Clôturé"
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'examine':
        return (
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'valide':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejete':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const canEdit = (statut: string) => {
    return statut === 'en_attente' || statut === 'rejete';
  };

  return (
    <>
      <PageMeta
        title="Mes Signalements | TOGO-SecureNet"
        description="Consultez et gérez vos signalements"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Mes Signalements
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Suivez l'état de vos déclarations et modifications
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Information importante</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Vous pouvez modifier vos signalements tant qu'ils n'ont pas été examinés ou validés par un administrateur.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('tous')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'tous'
              ? 'bg-brand-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          Tous ({signalements.length})
        </button>
        <button
          onClick={() => setFilter('en_attente')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'en_attente'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          En attente ({signalements.filter(s => s.statut === 'en_attente').length})
        </button>
        <button
          onClick={() => setFilter('examine')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'examine'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          En examen ({signalements.filter(s => s.statut === 'examine').length})
        </button>
        <button
          onClick={() => setFilter('valide')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'valide'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          Validés ({signalements.filter(s => s.statut === 'valide').length})
        </button>
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
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    signalement.type === 'personne' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                    {signalement.type === 'personne' ? 'Personne' : 'Engin'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Signalé le {new Date(signalement.dateSignalement).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(signalement.dateSignalement).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatutIcon(signalement.statut)}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatutBadge(signalement.statut)}`}>
                  {getStatutLabel(signalement.statut)}
                </span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {signalement.description}
            </p>

            {signalement.commentaireAdmin && (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      Commentaire de l'administrateur
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      {signalement.commentaireAdmin}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium">
                Voir détails
              </button>
              {canEdit(signalement.statut) && (
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium">
                  Modifier
                </button>
              )}
              {signalement.statut === 'valide' && (
                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Validé par les autorités
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSignalements.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun signalement</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vous n'avez pas encore effectué de signalement.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <a
              href="/report/person"
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium"
            >
              Signaler une personne
            </a>
            <a
              href="/report/vehicle"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
            >
              Signaler un engin
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default MesSignalements;
