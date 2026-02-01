export default function ConfidentialitePage() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Politique de confidentialit&eacute;
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Comment Facturoo collecte, utilise et prot&egrave;ge vos
            donn&eacute;es personnelles.
          </p>
        </div>

        <div className="mt-16 space-y-12 text-sm text-muted-foreground leading-relaxed">
          {/* Responsable du traitement */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Responsable du traitement
            </h2>
            <div className="mt-4 space-y-1">
              <p>
                <strong className="text-foreground">Raison sociale :</strong>{" "}
                [&Agrave; COMPL&Eacute;TER]
              </p>
              <p>
                <strong className="text-foreground">Adresse :</strong>{" "}
                [&Agrave; COMPL&Eacute;TER]
              </p>
              <p>
                <strong className="text-foreground">Email DPO :</strong>{" "}
                support@facturoo.fr
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Donn&eacute;es collect&eacute;es
            </h2>
            <p className="mt-4">
              Dans le cadre de l&apos;utilisation de Facturoo, nous collectons
              les donn&eacute;es suivantes :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-foreground">Donn&eacute;es d&apos;identification :</strong>{" "}
                nom, pr&eacute;nom, adresse email
              </li>
              <li>
                <strong className="text-foreground">Donn&eacute;es professionnelles :</strong>{" "}
                nom d&apos;entreprise, SIRET, adresse, t&eacute;l&eacute;phone
              </li>
              <li>
                <strong className="text-foreground">Donn&eacute;es clients :</strong>{" "}
                nom, email, adresse, t&eacute;l&eacute;phone de vos clients
              </li>
              <li>
                <strong className="text-foreground">Donn&eacute;es de facturation :</strong>{" "}
                contenu des devis et factures, montants
              </li>
              <li>
                <strong className="text-foreground">Donn&eacute;es techniques :</strong>{" "}
                adresse IP, type de navigateur, pages visit&eacute;es
              </li>
            </ul>
          </section>

          {/* Finalités */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Finalit&eacute;s du traitement
            </h2>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              <li>
                Fourniture du service : cr&eacute;ation et gestion de devis et
                factures
              </li>
              <li>
                Gestion de votre compte utilisateur et authentification
              </li>
              <li>
                Envoi de documents par email &agrave; vos clients
              </li>
              <li>
                Gestion des abonnements et paiements
              </li>
              <li>
                Am&eacute;lioration du service et support technique
              </li>
            </ul>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Base l&eacute;gale
            </h2>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-foreground">Ex&eacute;cution du contrat :</strong>{" "}
                fourniture du service Facturoo
              </li>
              <li>
                <strong className="text-foreground">Int&eacute;r&ecirc;t l&eacute;gitime :</strong>{" "}
                am&eacute;lioration du service, s&eacute;curit&eacute;
              </li>
              <li>
                <strong className="text-foreground">Obligation l&eacute;gale :</strong>{" "}
                conservation des factures conform&eacute;ment au droit fiscal
              </li>
            </ul>
          </section>

          {/* Durée de conservation */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Dur&eacute;e de conservation
            </h2>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-foreground">Donn&eacute;es de compte :</strong>{" "}
                dur&eacute;e de vie du compte + 3 ans apr&egrave;s suppression
              </li>
              <li>
                <strong className="text-foreground">Factures :</strong>{" "}
                10 ans (obligation l&eacute;gale comptable)
              </li>
              <li>
                <strong className="text-foreground">Donn&eacute;es de paiement :</strong>{" "}
                conserv&eacute;es par Stripe conform&eacute;ment &agrave; leur
                politique
              </li>
              <li>
                <strong className="text-foreground">Logs techniques :</strong>{" "}
                12 mois
              </li>
            </ul>
          </section>

          {/* Droits des utilisateurs */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Vos droits
            </h2>
            <p className="mt-4">
              Conform&eacute;ment au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-foreground">Acc&egrave;s :</strong>{" "}
                obtenir une copie de vos donn&eacute;es personnelles
              </li>
              <li>
                <strong className="text-foreground">Rectification :</strong>{" "}
                corriger vos donn&eacute;es inexactes
              </li>
              <li>
                <strong className="text-foreground">Suppression :</strong>{" "}
                demander l&apos;effacement de vos donn&eacute;es (sous
                r&eacute;serve des obligations l&eacute;gales de conservation)
              </li>
              <li>
                <strong className="text-foreground">Portabilit&eacute; :</strong>{" "}
                recevoir vos donn&eacute;es dans un format structur&eacute;
              </li>
              <li>
                <strong className="text-foreground">Opposition :</strong>{" "}
                vous opposer au traitement de vos donn&eacute;es
              </li>
              <li>
                <strong className="text-foreground">Limitation :</strong>{" "}
                demander la limitation du traitement
              </li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous &agrave;{" "}
              <strong className="text-foreground">support@facturoo.fr</strong>.
              Vous pouvez &eacute;galement introduire une r&eacute;clamation
              aupr&egrave;s de la CNIL (cnil.fr).
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-lg font-bold text-foreground">Cookies</h2>
            <p className="mt-4">
              Facturoo utilise uniquement des cookies strictement
              n&eacute;cessaires au fonctionnement du service :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-foreground">Cookie de session :</strong>{" "}
                authentification et maintien de votre connexion
              </li>
            </ul>
            <p className="mt-3">
              Aucun cookie publicitaire, analytique ou de tra&ccedil;age tiers
              n&apos;est utilis&eacute;.
            </p>
          </section>

          {/* Sous-traitants */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Sous-traitants
            </h2>
            <p className="mt-4">
              Nous faisons appel aux sous-traitants suivants pour le
              fonctionnement du service :
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-foreground">
                    <th className="pb-2 pr-4 font-semibold">Prestataire</th>
                    <th className="pb-2 pr-4 font-semibold">Finalit&eacute;</th>
                    <th className="pb-2 font-semibold">Localisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 pr-4">Vercel Inc.</td>
                    <td className="py-2 pr-4">H&eacute;bergement de l&apos;application</td>
                    <td className="py-2">&Eacute;tats-Unis</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Neon Inc.</td>
                    <td className="py-2 pr-4">Base de donn&eacute;es PostgreSQL</td>
                    <td className="py-2">Europe (eu-west-2)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Stripe Inc.</td>
                    <td className="py-2 pr-4">Paiements et abonnements</td>
                    <td className="py-2">&Eacute;tats-Unis</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Resend Inc.</td>
                    <td className="py-2 pr-4">Envoi d&apos;emails transactionnels</td>
                    <td className="py-2">&Eacute;tats-Unis</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Upstash Inc.</td>
                    <td className="py-2 pr-4">Limitation de d&eacute;bit (rate limiting)</td>
                    <td className="py-2">&Eacute;tats-Unis</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Des clauses contractuelles types (CCT) encadrent les transferts
              hors UE conform&eacute;ment au RGPD.
            </p>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              S&eacute;curit&eacute;
            </h2>
            <p className="mt-4">
              Nous mettons en &oelig;uvre des mesures techniques et
              organisationnelles pour prot&eacute;ger vos donn&eacute;es :
              chiffrement HTTPS, hachage des mots de passe, contr&ocirc;le
              d&apos;acc&egrave;s, sauvegardes r&eacute;guli&egrave;res et
              limitation de d&eacute;bit (rate limiting).
            </p>
          </section>

          {/* Mise à jour */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Mise &agrave; jour
            </h2>
            <p className="mt-4">
              Cette politique peut &ecirc;tre mise &agrave; jour &agrave; tout
              moment. La date de derni&egrave;re modification est indiqu&eacute;e
              ci-dessous. Nous vous invitons &agrave; la consulter
              r&eacute;guli&egrave;rement.
            </p>
            <p className="mt-2">
              <strong className="text-foreground">
                Derni&egrave;re mise &agrave; jour :
              </strong>{" "}
              1er f&eacute;vrier 2026
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
