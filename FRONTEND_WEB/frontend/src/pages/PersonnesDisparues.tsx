import { useState } from "react";
import PageMeta from "../components/common/PageMeta";

interface PersonneDisparue {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  photo: string;
  dateDeparition: string;
  lieuDeparition: string;
  description: string;
  statut: 'recherche' | 'retrouve' | 'clos';
  signalePar: string;
}

const PersonnesDisparues = () => {
  const [personnes] = useState<PersonneDisparue[]>([
    {
      id: 1,
      nom: "KOUAME",
      prenom: "Jean",
      age: 15,
      photo: "/images/user/user-01.png",
      dateDeparition: "2024-01-15",
      lieuDeparition: "Lomé, Tokoin",
      description: "Porte un t-shirt bleu et un jean noir",
      statut: "recherche",
      signalePar: "Marie KOUAME"
    },
  ]);

  const [filter, setFilter] = useState<'tous' | 'recherche' | 'retrouve' | 'clos'>('tous');

  const filteredPersonnes = personnes.filter(p => 
    filter === 'tous' ? true : p.statut === filter
  );

  const getStatutBadge = (statut: string) => {
    const badges = {
      recherche: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      retrouve: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      clos: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    };
    return badges[statut as keyof typeof badges] || badges.clos;
  };

  return (
    <>
      <PageMeta
        title="Personnes Disparues | TOGO-SecureNet"
        description="Liste des personnes disparues signalées"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personnes Disparues
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gérez et consultez les signalements de personnes disparues
        </p>
      </div>
      
      <div className="mb-6">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonnes.map((personne) => (
          <div
            key={personne.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative">
              <img
                src={personne.photo}
                alt={`${personne.prenom} ${personne.nom}`}
                className="w-full h-64 object-cover"
              />
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(personne.statut)}`}>
                {personne.statut === 'recherche' ? 'En recherche' : 
                 personne.statut === 'retrouve' ? 'Retrouvé' : 'Clos'}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {personne.prenom} {personne.nom}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><span className="font-semibold">Âge:</span> {personne.age} ans</p>
                <p><span className="font-semibold">Date:</span> {new Date(personne.dateDeparition).toLocaleDateString('fr-FR')}</p>
                <p><span className="font-semibold">Lieu:</span> {personne.lieuDeparition}</p>
                <p><span className="font-semibold">Description:</span> {personne.description}</p>
                <p><span className="font-semibold">Signalé par:</span> {personne.signalePar}</p>
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

      {filteredPersonnes.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune personne trouvée</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aucun résultat pour ce filtre.
          </p>
        </div>
      )}
    </>
  );
};

export default PersonnesDisparues;
