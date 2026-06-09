import { useState } from "react";
import PageMeta from "../components/common/PageMeta";

interface EnginVole {
  id: number;
  type: 'voiture' | 'moto' | 'camion' | 'autre';
  marque: string;
  modele: string;
  immatriculation: string;
  couleur: string;
  dateVol: string;
  lieuVol: string;
  photo: string;
  statut: 'recherche' | 'retrouve' | 'clos';
  signalePar: string;
}

const EnginsVoles = () => {
  const [engins] = useState<EnginVole[]>([
    {
      id: 1,
      type: "voiture",
      marque: "Toyota",
      modele: "Corolla",
      immatriculation: "TG 1234 AB",
      couleur: "Blanc",
      dateVol: "2024-01-20",
      lieuVol: "Lomé, Kodjoviakopé",
      photo: "/images/user/user-01.png",
      statut: "recherche",
      signalePar: "ATAKPA Paul"
    },
  ]);

  const [filter, setFilter] = useState<'tous' | 'recherche' | 'retrouve' | 'clos'>('tous');
  const [typeFilter, setTypeFilter] = useState<'tous' | 'voiture' | 'moto' | 'camion' | 'autre'>('tous');

  const filteredEngins = engins.filter(e => {
    const statutMatch = filter === 'tous' ? true : e.statut === filter;
    const typeMatch = typeFilter === 'tous' ? true : e.type === typeFilter;
    return statutMatch && typeMatch;
  });

  const getStatutBadge = (statut: string) => {
    const badges = {
      recherche: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      retrouve: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      clos: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return badges[statut as keyof typeof badges] || badges.clos;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voiture':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'moto':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
    }
  };

  return (
    <>
      <PageMeta
        title="Engins Volés | TOGO-SecureNet"
        description="Liste des véhicules et engins volés signalés"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          Engins Volés
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gérez et consultez les signalements d'engins volés
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
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
            onClick={() => setFilter('recherche')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'recherche'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            En recherche
          </button>
          <button
            onClick={() => setFilter('retrouve')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'retrouve'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Retrouvés
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
            onClick={() => setTypeFilter('voiture')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              typeFilter === 'voiture'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Voitures
          </button>
          <button
            onClick={() => setTypeFilter('moto')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              typeFilter === 'moto'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Motos
          </button>
          <button
            onClick={() => setTypeFilter('camion')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              typeFilter === 'camion'
                ? 'bg-brand-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Camions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngins.map((engin) => (
          <div
            key={engin.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative">
              <img
                src={engin.photo}
                alt={`${engin.marque} ${engin.modele}`}
                className="w-full h-48 object-cover"
              />
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(engin.statut)}`}>
                {engin.statut === 'recherche' ? 'En recherche' : 
                 engin.statut === 'retrouve' ? 'Retrouvé' : 'Clos'}
              </span>
              <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 rounded-full p-2">
                {getTypeIcon(engin.type)}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {engin.marque} {engin.modele}
              </h3>
              <p className="text-2xl font-bold text-brand-500 mb-4">{engin.immatriculation}</p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-semibold">Couleur:</span> {engin.couleur}</p>
                <p><span className="font-semibold">Date vol:</span> {new Date(engin.dateVol).toLocaleDateString('fr-FR')}</p>
                <p><span className="font-semibold">Lieu:</span> {engin.lieuVol}</p>
                <p><span className="font-semibold">Signalé par:</span> {engin.signalePar}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition text-sm font-medium">
                  Détails
                </button>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEngins.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun engin trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aucun résultat pour ces filtres.
          </p>
        </div>
      )}
    </>
  );
};

export default EnginsVoles;
