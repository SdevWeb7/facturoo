import Link from "next/link";

export default function CGVPage() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Conditions G&eacute;n&eacute;rales de Vente
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Conditions applicables &agrave; l&apos;utilisation du service
            Facturoo.
          </p>
        </div>

        <div className="mt-16 space-y-12 text-sm text-muted-foreground leading-relaxed">
          {/* Objet */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 1 — Objet
            </h2>
            <p className="mt-4">
              Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente
              (CGV) r&eacute;gissent l&apos;acc&egrave;s et l&apos;utilisation
              du service Facturoo, application en ligne de cr&eacute;ation et de
              gestion de devis et factures destin&eacute;e aux artisans
              fran&ccedil;ais.
            </p>
            <p className="mt-2">
              L&apos;inscription au service implique l&apos;acceptation
              int&eacute;grale et sans r&eacute;serve des pr&eacute;sentes CGV.
            </p>
          </section>

          {/* TODO: Décommenter et remplir quand l'entreprise sera créée
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 2 — Éditeur du service
            </h2>
            <div className="mt-4 space-y-1">
              <p>
                <strong className="text-foreground">Raison sociale :</strong>{" "}
                [À COMPLÉTER]
              </p>
              <p>
                <strong className="text-foreground">SIRET :</strong>{" "}
                [À COMPLÉTER]
              </p>
              <p>
                <strong className="text-foreground">Adresse :</strong>{" "}
                [À COMPLÉTER]
              </p>
              <p>
                <strong className="text-foreground">Email :</strong>{" "}
                support@facturoo.app
              </p>
            </div>
          </section>
          */}

          {/* Inscription */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 3 — Inscription et compte
            </h2>
            <p className="mt-4">
              L&apos;acc&egrave;s au service n&eacute;cessite la cr&eacute;ation
              d&apos;un compte utilisateur. L&apos;utilisateur s&apos;engage
              &agrave; fournir des informations exactes et &agrave; jour lors de
              son inscription.
            </p>
            <p className="mt-2">
              L&apos;utilisateur est responsable de la confidentialit&eacute; de
              ses identifiants de connexion et de toute activit&eacute;
              r&eacute;alis&eacute;e depuis son compte.
            </p>
          </section>

          {/* Plans et tarifs */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 4 — Plans et tarifs
            </h2>
            <p className="mt-4">
              Facturoo propose deux formules :
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Plan Gratuit :</strong>{" "}
                acc&egrave;s limit&eacute; &agrave; 5 clients, 5 devis et
                5 factures. Sans limite de dur&eacute;e, sans carte bancaire
                requise.
              </li>
              <li>
                <strong className="text-foreground">Plan Pro :</strong>{" "}
                acc&egrave;s illimit&eacute; &agrave; toutes les
                fonctionnalit&eacute;s (clients, devis, factures, export
                comptable). Facturation mensuelle ou annuelle.
              </li>
            </ul>
            <p className="mt-3">
              Les tarifs en vigueur sont affich&eacute;s sur la page{" "}
              <Link
                href="/pricing"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Tarifs
              </Link>
              . L&apos;&eacute;diteur se r&eacute;serve le droit de modifier les
              tarifs &agrave; tout moment, avec notification pr&eacute;alable de
              30 jours aux abonn&eacute;s.
            </p>
          </section>

          {/* Paiement */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 5 — Paiement
            </h2>
            <p className="mt-4">
              Les paiements sont trait&eacute;s de mani&egrave;re
              s&eacute;curis&eacute;e par Stripe. L&apos;&eacute;diteur ne
              stocke aucune donn&eacute;e de carte bancaire.
            </p>
            <p className="mt-2">
              L&apos;abonnement Pro est renouvel&eacute; automatiquement
              &agrave; chaque &eacute;ch&eacute;ance (mensuelle ou annuelle).
              Le pr&eacute;l&egrave;vement est effectu&eacute; au
              d&eacute;but de chaque p&eacute;riode de facturation.
            </p>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 6 — R&eacute;siliation
            </h2>
            <p className="mt-4">
              L&apos;utilisateur peut r&eacute;silier son abonnement Pro
              &agrave; tout moment depuis la page Param&egrave;tres de son
              compte. La r&eacute;siliation prend effet &agrave; la fin de la
              p&eacute;riode de facturation en cours.
            </p>
            <p className="mt-2">
              Apr&egrave;s r&eacute;siliation, le compte repasse en plan Gratuit.
              Les donn&eacute;es restent accessibles mais les
              fonctionnalit&eacute;s Pro ne sont plus disponibles.
            </p>
            <p className="mt-2">
              L&apos;utilisateur peut &agrave; tout moment supprimer son compte.
              Cette action entra&icirc;ne la suppression d&eacute;finitive de
              toutes ses donn&eacute;es (clients, devis, factures), sous
              r&eacute;serve des obligations l&eacute;gales de conservation.
            </p>
          </section>

          {/* Droit de rétractation */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 7 — Droit de r&eacute;tractation
            </h2>
            <p className="mt-4">
              Conform&eacute;ment &agrave; l&apos;article L221-28 du Code de la
              consommation, le droit de r&eacute;tractation ne s&apos;applique
              pas aux services pleinement ex&eacute;cut&eacute;s avant la fin du
              d&eacute;lai de r&eacute;tractation, dont l&apos;ex&eacute;cution
              a commenc&eacute; avec l&apos;accord du consommateur.
            </p>
            <p className="mt-2">
              L&apos;acc&egrave;s imm&eacute;diat au service apr&egrave;s
              souscription vaut accord pour l&apos;ex&eacute;cution
              imm&eacute;diate.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 8 — Responsabilit&eacute;
            </h2>
            <p className="mt-4">
              L&apos;&eacute;diteur s&apos;engage &agrave; fournir le service
              avec diligence. Toutefois, le service est fourni &laquo; en
              l&apos;&eacute;tat &raquo;. L&apos;&eacute;diteur ne garantit pas
              l&apos;absence d&apos;interruptions ou d&apos;erreurs.
            </p>
            <p className="mt-2">
              L&apos;utilisateur reste seul responsable du contenu de ses devis
              et factures, ainsi que de leur conformit&eacute; avec la
              r&eacute;glementation applicable.
            </p>
            <p className="mt-2">
              La responsabilit&eacute; de l&apos;&eacute;diteur est
              limit&eacute;e au montant des sommes vers&eacute;es par
              l&apos;utilisateur au cours des 12 derniers mois.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 9 — Donn&eacute;es personnelles
            </h2>
            <p className="mt-4">
              Le traitement des donn&eacute;es personnelles est d&eacute;crit
              dans notre{" "}
              <Link
                href="/confidentialite"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Politique de confidentialit&eacute;
              </Link>
              .
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 10 — Propri&eacute;t&eacute; intellectuelle
            </h2>
            <p className="mt-4">
              Le service Facturoo, incluant son code source, son design et ses
              contenus, est la propri&eacute;t&eacute; exclusive de
              l&apos;&eacute;diteur. L&apos;utilisateur dispose d&apos;un droit
              d&apos;utilisation personnel et non transf&eacute;rable dans le
              cadre de son abonnement.
            </p>
            <p className="mt-2">
              Les documents (devis, factures) cr&eacute;&eacute;s par
              l&apos;utilisateur restent sa propri&eacute;t&eacute;.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 11 — Droit applicable et litiges
            </h2>
            <p className="mt-4">
              Les pr&eacute;sentes CGV sont soumises au droit fran&ccedil;ais.
            </p>
            {/* TODO: Décommenter et remplir la ville du siège social quand l'entreprise sera créée
            <p className="mt-2">
              En cas de litige, les parties s&apos;engagent à rechercher
              une solution amiable. À défaut, le litige sera
              soumis aux tribunaux compétents de [À COMPLÉTER — ville du siège social].
            </p>
            */}
            <p className="mt-2">
              Conform&eacute;ment &agrave; l&apos;article L612-1 du Code de la
              consommation, le consommateur peut recourir gratuitement &agrave;
              un m&eacute;diateur de la consommation en vue de la
              r&eacute;solution amiable du litige.
            </p>
          </section>

          {/* Mise à jour */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Article 12 — Modification des CGV
            </h2>
            <p className="mt-4">
              L&apos;&eacute;diteur se r&eacute;serve le droit de modifier les
              pr&eacute;sentes CGV &agrave; tout moment. Les utilisateurs seront
              inform&eacute;s par email de toute modification substantielle. La
              poursuite de l&apos;utilisation du service apr&egrave;s
              notification vaut acceptation des nouvelles CGV.
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
