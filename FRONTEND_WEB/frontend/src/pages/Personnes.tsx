import { useEffect, useState } from "react";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";

type Person = {
  id: number;
  first_name: string;
  last_name: string;
  age?: number;
  gender: string;
  last_location: string;
  gravity_level: "critical" | "high" | "warning";
  status: "missing" | "found";
};

export default function Personnes() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("M");
  const [lastLocation, setLastLocation] = useState("");
  const [gravityLevel, setGravityLevel] = useState<"critical" | "high" | "warning">("high");
  const [saving, setSaving] = useState(false);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/persons");
      setPersons(res.data);
    } catch (e) {
      console.error(e);
      // Mock data if api fails
      setPersons([
        { id: 1, first_name: "Koffi", last_name: "Mensah", age: 24, gender: "M", last_location: "Lomé, Baguida", gravity_level: "high", status: "missing" },
        { id: 2, first_name: "Abla", last_name: "Ayayi", age: 12, gender: "F", last_location: "Atakpamé", gravity_level: "critical", status: "missing" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        first_name: firstName,
        last_name: lastName,
        age: age ? parseInt(age) : undefined,
        gender,
        last_location: lastLocation,
        gravity_level: gravityLevel,
        status: "missing",
      };
      const res = await api.post("/api/v1/persons", payload);
      setPersons((prev) => [...prev, res.data]);
      setShowAddForm(false);
      setFirstName("");
      setLastName("");
      setAge("");
      setLastLocation("");
    } catch (err) {
      console.error(err);
      // Offline fallback
      const mockNew: Person = {
        id: persons.length + 1,
        first_name: firstName,
        last_name: lastName,
        age: age ? parseInt(age) : undefined,
        gender,
        last_location: lastLocation,
        gravity_level: gravityLevel,
        status: "missing",
      };
      setPersons((prev) => [...prev, mockNew]);
      setShowAddForm(false);
      setFirstName("");
      setLastName("");
      setAge("");
      setLastLocation("");
    } finally {
      setSaving(false);
    }
  };

  const getGravityColor = (level: string) => {
    if (level === "critical") return "text-error-600 bg-error-50 dark:bg-error-500/15 dark:text-error-400";
    if (level === "high") return "text-orange-600 bg-orange-50 dark:bg-orange-500/15 dark:text-orange-400";
    return "text-warning-600 bg-warning-50 dark:bg-warning-500/15 dark:text-warning-400";
  };

  return (
    <>
      <PageMeta
        title="Personnes Recherchées | TOGO-SecureNet"
        description="Fiches de signalement et de recherche de personnes"
      />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Personnes Signalées / Recherchées
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enregistrez et consultez les profils de recherche pour la reconnaissance faciale.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
          >
            <span>➕</span> Signaler une personne
          </button>
        </div>

        {/* Modal d'ajout */}
        {showAddForm && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white/95">Signaler une Personne</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddPerson} className="mt-4 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Prénom</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Koffi"
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Nom</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Mensah"
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Âge</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Ex: 24"
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Sexe</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Dernier lieu connu</label>
                  <input
                    type="text"
                    required
                    value={lastLocation}
                    onChange={(e) => setLastLocation(e.target.value)}
                    placeholder="Ex: Lomé, quartier Baguida"
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-transparent rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Niveau d'urgence</label>
                  <select
                    value={gravityLevel}
                    onChange={(e) => setGravityLevel(e.target.value as any)}
                    className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="warning">Modéré</option>
                    <option value="high">Élevé</option>
                    <option value="critical">Critique (Urgence absolue)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs border border-gray-200 dark:border-gray-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    {saving ? "Signalement..." : "Signaler"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fiches des personnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <p className="text-sm text-gray-400 col-span-3 text-center py-12">Chargement des signalements...</p>
          ) : persons.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-3 text-center py-12">Aucune fiche de recherche.</p>
          ) : (
            persons.map((person) => (
              <div
                key={person.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 font-mono">SIGNALEMENT #{person.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getGravityColor(person.gravity_level)}`}>
                      {person.gravity_level === "critical" ? "Critique" : person.gravity_level === "high" ? "Élevé" : "Modéré"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white/95 mt-3">
                    {person.first_name} {person.last_name}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <p>🧑‍🤝‍🧑 <span className="font-semibold">Genre:</span> {person.gender === "M" ? "Masculin" : "Féminin"} {person.age ? `(${person.age} ans)` : ""}</p>
                    <p>📍 <span className="font-semibold">Dernière localisation:</span> {person.last_location}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Statut de recherche :</span>
                  <span className={`font-semibold ${person.status === "missing" ? "text-red-500" : "text-success-500"}`}>
                    {person.status === "missing" ? "RECHERCHE ACTIVE" : "RETROUVÉ(E)"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
