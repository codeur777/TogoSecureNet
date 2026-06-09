import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/img_cathédrale.jpg",
      title: "Système National de Surveillance Intelligente",
      subtitle: "Protégeons ensemble notre nation avec la technologie"
    },
    {
      image: "/images/img_munIdep.jpeg",
      title: "Signalement Rapide et Efficace",
      subtitle: "Déclarez les personnes ou véhicules volés en quelques clics"
    },
    {
      image: "/images/img_bceao.jpg",
      title: "Reconnaissance Faciale Avancée",
      subtitle: "Technologie de pointe au service de la sécurité publique"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <PageMeta
        title="TogoSecureNet - Système National de Surveillance Intelligente"
        description="Plateforme officielle de signalement et de surveillance pour la sécurité au Togo"
      />

      <div className="relative">
        {/* Header Transparent fixé au-dessus */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
          <div className="container mx-auto px-4">
            {/* Navigation */}
            <nav className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src="/images/logo_emble-removebg.png" 
                    alt="TogoSecureNet Logo" 
                    className="h-15 w-12 drop-shadow-lg"
                  />
                  <div>
                    <h2 className="font-bold text-white text-xl drop-shadow-lg">TogoSecureNet</h2>
                    <p className="text-xs text-gray-200 drop-shadow">Système National de Surveillance</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Link
                    to="/signin"
                    className="px-6 py-2.5 text-sm font-medium text-white border-2 border-white/80 rounded-lg hover:bg-white/20 transition backdrop-blur-sm shadow-lg"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-green-600/90 rounded-lg hover:bg-green-600 transition backdrop-blur-sm shadow-lg"
                  >
                    Inscription
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Slider Plein écran */}
        <section className="relative h-screen w-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 106, 78, 0.65), rgba(0, 106, 78, 0.65)), url(${slide.image})`
                }}
              />
              <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md">{slide.subtitle}</p>
              </div>
            </div>
          ))}
          
          {/* Indicateurs de slide */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? "bg-yellow-400 w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Image répétée en bas du slider */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-24 z-20 bg-repeat-x bg-bottom"
            style={{
              backgroundImage: "url('/images/img_basSec.jpg')",
              backgroundSize: "auto 100%"
            }}
          />
        </section>
      </div>

      {/* Section Signalement Rapide */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Déclarez un Signalement
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Participez à la sécurité nationale en signalant rapidement les personnes ou véhicules volés
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Carte Personnes Disparues/Volées */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-1 border-t-4 border-green-600">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Personne Disparue</h3>
                <p className="text-gray-600">Signalez une personne recherchée ou disparue</p>
              </div>
              <Link
                to="/report/person"
                className="block w-full py-4 px-6 text-center text-white bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg"
              >
                Faire un signalement
              </Link>
            </div>

            {/* Carte Véhicules Volés */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-1 border-t-4 border-yellow-500">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Véhicule Volé</h3>
                <p className="text-gray-600">Signalez un véhicule ou engin volé</p>
              </div>
              <Link
                to="/report/vehicle"
                className="block w-full py-4 px-6 text-center text-white bg-yellow-600 rounded-lg font-semibold hover:bg-yellow-700 transition shadow-md hover:shadow-lg"
              >
                Faire un signalement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section À Propos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-green-800 mb-8 text-center">
              À Propos de TogoSecureNet
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Surveillance Intelligente</h3>
                <p className="text-gray-600 text-sm">Technologie de reconnaissance faciale avancée</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Alertes en Temps Réel</h3>
                <p className="text-gray-600 text-sm">Notifications instantanées pour les forces de sécurité</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Sécurité Renforcée</h3>
                <p className="text-gray-600 text-sm">Protection des données et confidentialité garantie</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-8 border-l-4 border-green-600">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-green-800">TogoSecureNet</strong> est le système national de surveillance intelligente 
                développé pour renforcer la sécurité publique au Togo. Grâce à une technologie de reconnaissance faciale avancée 
                et un réseau de caméras de surveillance, nous aidons les forces de l'ordre à identifier rapidement les personnes 
                recherchées et à retrouver les biens volés. Notre plateforme permet également aux citoyens de participer activement 
                à la sécurité nationale en signalant les incidents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">24/7</div>
              <p className="text-green-100">Surveillance Continue</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">100+</div>
              <p className="text-green-100">Caméras Actives</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">500+</div>
              <p className="text-green-100">Alertes Traitées</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">95%</div>
              <p className="text-green-100">Taux de Réussite</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Officiel */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* À propos */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-400">TogoSecureNet</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Système national de surveillance intelligente pour renforcer la sécurité publique au Togo.
              </p>
            </div>

            {/* Liens Rapides */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-400">Liens Rapides</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/report/person" className="text-gray-400 hover:text-white transition">
                    Signaler une personne
                  </Link>
                </li>
                <li>
                  <Link to="/report/vehicle" className="text-gray-400 hover:text-white transition">
                    Signaler un véhicule
                  </Link>
                </li>
                <li>
                  <Link to="/signin" className="text-gray-400 hover:text-white transition">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-400">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Lomé, Togo</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contact@togosecurenet.tg</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>117</span>
                </li>
              </ul>
            </div>

            {/* Horaires */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-400">Horaires de Service</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Lundi - Vendredi : 8h - 18h</li>
                <li>Samedi : 9h - 13h</li>
                <li className="font-semibold text-yellow-400">Urgences : 24/7</li>
              </ul>
            </div>
          </div>

          {/* Barre de séparation */}
          <div className="border-t border-gray-800 pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/images/togo/armoiries.png" 
                  alt="Armoiries du Togo" 
                  className="h-12 w-12"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect fill='%23006A4E' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23FFD700' font-size='24' font-weight='bold'%3ETG%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-400">RÉPUBLIQUE TOGOLAISE</p>
                  <p className="text-xs text-gray-500">Travail - Liberté - Patrie</p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} TogoSecureNet - Tous droits réservés
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Ministère de la Sécurité et de la Protection Civile
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
