import PageMeta from "../components/common/PageMeta";
import PageBreadCrumb from "../components/common/PageBreadCrumb";

export default function PrivacyPolicy() {
  return (
    <>
      <PageMeta
        title="Politique de confidentialité | TogoSecureNet"
        description="Politique de confidentialité de TogoSecureNet"
      />
      <PageBreadCrumb pageTitle="Politique de confidentialité" homeUrl="/settings" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Politique de confidentialité
        </h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              1. Collecte des données
            </h2>
            <p>
              TogoSecureNet collecte et traite des données personnelles dans le cadre de sa mission de sécurité publique. 
              Les données collectées incluent :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Informations d'identification (nom, prénom, photo)</li>
              <li>Données de localisation issues des caméras de surveillance</li>
              <li>Images capturées par le système de reconnaissance faciale</li>
              <li>Informations de contact (email, téléphone)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              2. Utilisation des données
            </h2>
            <p>
              Les données collectées sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>La recherche de personnes disparues</li>
              <li>Le suivi des engins volés</li>
              <li>La prévention et la détection de la criminalité</li>
              <li>L'amélioration de la sécurité publique</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              3. Protection des données
            </h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chiffrement des données sensibles</li>
              <li>Accès restreint aux personnels autorisés uniquement</li>
              <li>Audit régulier des accès et des modifications</li>
              <li>Serveurs sécurisés hébergés au Togo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              4. Durée de conservation
            </h2>
            <p>
              Les données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités 
              pour lesquelles elles ont été collectées, conformément à la législation togolaise en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              5. Vos droits
            </h2>
            <p>
              Conformément à la réglementation, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement dans certaines conditions</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <strong>privacy@togosecurenet.tg</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              6. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique de confidentialité, contactez notre 
              Délégué à la Protection des Données à : <strong>dpo@togosecurenet.tg</strong>
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
