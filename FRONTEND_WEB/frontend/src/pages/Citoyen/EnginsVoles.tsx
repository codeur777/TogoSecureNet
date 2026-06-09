import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

interface EnginVole {
  id: number;
  type: 'voiture' | 'moto' | 'camion';
  marque: string;
  modele: string;
  immatriculation: string;
  couleur: string;
  dateVol: string;
  lieuVol: string;
  photo: string;
  description: string;
  contact: string;
}

const CitoyenEnginsVoles = () => {
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
      description: "Voiture en bon état, rayure sur le pare-choc avant",
      contact: "+228 90 00 00 00"
    },
    {
      id: 2,
      type: "moto",
      marque: "Yamaha",
      modele: "XTZ 125",
      immatriculation: "TG 5678 CD",
      couleur: "Rouge",
      dateVol: "2024-01-19",
      lieuVol: "Lomé, Bè",
      photo: "/images/user/user-02.png",
      description: "Moto avec top case noir",
      contact: "+228 91 11 11 11"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<'tous' | 'voiture' | 'moto' | 'camion'>('tous');

  const filteredEngins = engins.filter(e => {
    const typeMatch = typeFilter === 'tous' ? true : e.type === typeFilter;
    const searchMatch = 
      e.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.lieuVol.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <>
      <PageMeta
        title="Engins Volés | TOGO-SecureNet"
        description="Consultez la liste des véhicules volés"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
          Engins Volés
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Aidez-nous à retrouver ces véhicules
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">Vous avez vu ce véhicule ?</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              Si vous apercevez l'un de ces véhicules, contactez immédiatement les autorités. Ne tentez pas d'intervenir vous-même.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par marque, modèle, immatriculation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
            Tous
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEngins.map((engin) => (
          <div
            key={engin.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-orange-200 dark:border-orange-900/30 overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 bg-orange-600 text-white text-center py-2 font-bold text-sm">
                VÉHICULE VOLÉ
              </div>
              <img
                src={engin.photo}
                alt={`${engin.marque} ${engin.modele}`}
                className="w-full h-56 object-cover mt-10"
              />
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {engin.marque} {engin.modele}
                </h3>
                <div className="bg-orange-100 dark:bg-orange-900/20 border-2 border-orange-400 dark:border-orange-600 rounded-lg py-2 px-4 inline-block">
                  <p className="text-3xl font-black text-orange-900 dark:text-orange-300">
                    {engin.immatriculation}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span><strong>Type:</strong> {engin.type.charAt(0).toUpperCase() + engin.type.slice(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span><strong>Couleur:</strong> {engin.couleur}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span><strong>Date du vol:</strong> {new Date(engin.dateVol).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span><strong>Lieu du vol:</strong> {engin.lieuVol}</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Description:</strong> {engin.description}
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-bold text-orange-900 dark:text-orange-300">Contact en cas d'information</span>
                </div>
                <p className="text-lg font-bold text-orange-800 dark:text-orange-400">{engin.contact}</p>
              </div>

              <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-bold flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                J'AI VU CE VÉHICULE
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEngins.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun résultat trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Essayez une autre recherche.
          </p>
        </div>
      )}
    </>
  );
};

export default CitoyenEnginsVoles;
