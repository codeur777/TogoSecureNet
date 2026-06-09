import PageMeta from "../components/common/PageMeta";
import PageBreadCrumb from "../components/common/PageBreadCrumb";

export default function TermsOfService() {
  return (
    <>
      <PageMeta
        title="Conditions d'utilisation | TogoSecureNet"
        description="Conditions d'utilisation de TogoSecureNet"
      />
      <PageBreadCrumb pageTitle="Conditions d'utilisation" homeUrl="/settings" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Conditions d'utilisation
        </h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              1. Acceptation des conditions
            </h2>
            <p>
              En accédant et en utilisant la plateforme TogoSecureNet, vous acceptez d'être lié par les présentes 
              conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              2. Description du service
            </h2>
            <p>
              TogoSecureNet est une plateforme de sécurité publique qui utilise la reconnaissance faciale et 
              l'intelligence artificielle pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Aider à la recherche de personnes disparues</li>
              <li>Faciliter le signalement et la récupération d'engins volés</li>
              <li>Améliorer la sécurité publique au Togo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              3. Comptes utilisateurs
            </h2>
            <p>
              Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir des informations exactes et à jour</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
              <li>Être responsable de toutes les activités effectuées sous votre compte</li>
              <li>Nous informer immédiatement de toute utilisation non autorisée</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              4. Utilisation acceptable
            </h2>
            <p>
              Vous vous engagez à ne pas :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utiliser le service à des fins illégales</li>
              <li>Soumettre des informations fausses ou trompeuses</li>
              <li>Tenter d'accéder à des zones non autorisées du système</li>
              <li>Perturber ou interférer avec le service</li>
              <li>Utiliser le service pour harceler ou nuire à autrui</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              5. Signalements
            </h2>
            <p>
              Les citoyens peuvent effectuer des signalements via la plateforme. Tout signalement doit :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Être basé sur des faits réels et vérifiables</li>
              <li>Contenir des informations exactes</li>
              <li>Respecter la vie privée des personnes concernées</li>
            </ul>
            <p className="mt-4">
              Les signalements abusifs ou malveillants peuvent entraîner la suspension du compte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              6. Propriété intellectuelle
            </h2>
            <p>
              Tous les contenus, marques et données de la plateforme TogoSecureNet sont la propriété de 
              l'État togolais ou de ses partenaires autorisés. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              7. Limitation de responsabilité
            </h2>
            <p>
              TogoSecureNet s'efforce de fournir un service fiable, mais ne peut garantir :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>La disponibilité ininterrompue du service</li>
              <li>L'exactitude absolue des détections automatiques</li>
              <li>La résolution de tous les cas signalés</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              8. Modifications des conditions
            </h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront 
              informés des modifications importantes par email ou via la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              9. Droit applicable
            </h2>
            <p>
              Ces conditions sont régies par le droit togolais. Tout litige sera soumis aux tribunaux compétents du Togo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              10. Contact
            </h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, contactez-nous à : 
              <strong> legal@togosecurenet.tg</strong>
            </p>
          </section>

          <p className="text-sm text-gray-500 dark:text-gray-500 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            Dernière mise à jour : 8 juin 2026
          </p>
        </div>
      </div>
    </>
  );
}
