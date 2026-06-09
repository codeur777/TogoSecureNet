import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

interface PersonneDisparue {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  photo: string;
  dateDeparition: string;
  lieuDeparition: string;
  description: string;
  caracteristiques: string;
  contact: string;
}

const CitoyenPersonnesDisparues = () => {
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
      caracteristiques: "Cheveux courts, cicatrice au front",
      contact: "+228 90 00 00 00"
    },
    {
      id: 2,
      nom: "AMOUZOU",
      prenom: "Akouvi",
      age: 8,
      photo: "/images/user/user-02.png",
      dateDeparition: "2024-01-18",
      lieuDeparition: "Lomé, Bè",
      description: "Petite fille portant une robe rose",
      caracteristiques: "Cheveux tressés, très timide",
      contact: "+228 91 11 11 11"
    },
    {
      id: 3,
      nom: "AGBODJI",
      prenom: "Kossi",
      age: 70,
      photo: "/images/user/user-03.png",
      dateDeparition: "2024-01-19",
      lieuDeparition: "Lomé, Hédzranawoé",
      description: "Personne âgée, chemise blanche et pantalon beige",
      caracteristiques: "Lunettes, canne, peut être désorienté (Alzheimer)",
      contact: "+228 92 22 22 22"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPersonnes = personnes.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lieuDeparition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageMeta
        title="Personnes Disparues | TOGO-SecureNet"
        description="Consultez la liste des personnes disparues"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personnes Disparues
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Aidez-nous à retrouver ces personnes
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">Vous avez des informations ?</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              Si vous reconnaissez l'une de ces personnes ou si vous avez des informations, contactez immédiatement le numéro indiqué ou les autorités locales.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonnes.map((personne) => (
          <div
            key={personne.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-red-200 dark:border-red-900/30 overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 font-bold text-sm">
                PERSONNE RECHERCHÉE
              </div>
              <img
                src={personne.photo}
                alt={`${personne.prenom} ${personne.nom}`}
                className="w-full h-72 object-cover mt-10"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {personne.prenom} {personne.nom}
              </h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span><strong>Âge:</strong> {personne.age} ans</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span><strong>Date:</strong> {new Date(personne.dateDeparition).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span><strong>Lieu:</strong> {personne.lieuDeparition}</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4 space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Description:</strong> {personne.description}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Signes particuliers:</strong> {personne.caracteristiques}
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-bold text-red-900 dark:text-red-300">Contact en cas d'information</span>
                </div>
                <p className="text-lg font-bold text-red-800 dark:text-red-400">{personne.contact}</p>
              </div>

              <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-bold flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                J'AI DES INFORMATIONS
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPersonnes.length === 0 && (
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

export default CitoyenPersonnesDisparues;
