import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Facturoo. Informations sur l'éditeur, l'hébergeur et la propriété intellectuelle.",
  alternates: {
    canonical: "https://facturoo.vercel.app/mentions-legales",
  },
};

export default function MentionsLegalesPage() {
  return (
    <main className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Mentions l&eacute;gales
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Informations l&eacute;gales relatives au site Facturoo.
          </p>
        </div>

        <div className="mt-16 space-y-12 text-sm text-muted-foreground leading-relaxed">
          {/* TODO: Décommenter et remplir quand l'entreprise sera créée
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Éditeur du site
            </h2>
            <div className="mt-4 space-y-1">
              <p>
                <strong className="text-foreground">Raison sociale :</strong>{" "}
                [À COMPLÉTER]
              </p>
              <p>
                <strong className="text-foreground">Forme juridique :</strong>{" "}
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
                <strong className="text-foreground">Téléphone :</strong>{" "}
                [À COMPLÉTER]
              </p>
              <p>
                <strong className="text-foreground">Email :</strong>{" "}
                support@facturoo.app
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">
              Directeur de la publication
            </h2>
            <p className="mt-4">[À COMPLÉTER — Nom et prénom]</p>
          </section>
          */}

          {/* Hébergeur */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              H&eacute;bergeur
            </h2>
            <div className="mt-4 space-y-1">
              <p>
                <strong className="text-foreground">Vercel Inc.</strong>
              </p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, &Eacute;tats-Unis</p>
              <p>Site web : vercel.com</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Propri&eacute;t&eacute; intellectuelle
            </h2>
            <p className="mt-4">
              L&apos;ensemble des contenus pr&eacute;sents sur le site Facturoo
              (textes, images, logos, ic&ocirc;nes, logiciels, base de
              donn&eacute;es) est prot&eacute;g&eacute; par les lois
              fran&ccedil;aises et internationales relatives &agrave; la
              propri&eacute;t&eacute; intellectuelle. Toute reproduction,
              repr&eacute;sentation, modification ou adaptation, totale ou
              partielle, sans autorisation &eacute;crite pr&eacute;alable est
              strictement interdite.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Limitation de responsabilit&eacute;
            </h2>
            <p className="mt-4">
              L&apos;&eacute;diteur s&apos;efforce de fournir des informations
              aussi pr&eacute;cises que possible. Toutefois, il ne pourra
              &ecirc;tre tenu responsable des omissions, inexactitudes ou
              carences dans la mise &agrave; jour. L&apos;utilisateur est seul
              responsable de l&apos;utilisation qu&apos;il fait des informations
              et documents disponibles sur le site.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-lg font-bold text-foreground">Cookies</h2>
            <p className="mt-4">
              Le site Facturoo utilise des cookies strictement n&eacute;cessaires
              au fonctionnement du service (authentification, session). Aucun
              cookie publicitaire ou de tra&ccedil;age n&apos;est
              utilis&eacute;.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-lg font-bold text-foreground">
              Droit applicable
            </h2>
            <p className="mt-4">
              Les pr&eacute;sentes mentions l&eacute;gales sont soumises au
              droit fran&ccedil;ais. En cas de litige, et apr&egrave;s tentative
              de r&eacute;solution amiable, comp&eacute;tence est
              attribu&eacute;e aux tribunaux fran&ccedil;ais
              comp&eacute;tents.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
