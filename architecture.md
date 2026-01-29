# Architecture technique – Facturoo MVP

> Document de reference pour l'implementation du MVP Facturoo.
> Base sur le PRD : generateur de devis & factures pour artisans.

---

## 1. Structure du projet

```
facturoo/
├── prisma/
│   └── schema.prisma
├── public/
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                  # Landing page
│   │   │   ├── pricing/page.tsx          # Page tarifs
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                # Sidebar + header + auth guard
│   │   │   ├── dashboard/page.tsx        # Vue d'ensemble
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx              # Liste clients
│   │   │   │   ├── new/page.tsx          # Creer client
│   │   │   │   └── [id]/edit/page.tsx    # Modifier client
│   │   │   ├── devis/
│   │   │   │   ├── page.tsx              # Liste devis
│   │   │   │   ├── new/page.tsx          # Creer devis
│   │   │   │   └── [id]/edit/page.tsx    # Modifier devis
│   │   │   ├── factures/
│   │   │   │   ├── page.tsx              # Liste factures
│   │   │   │   └── [id]/page.tsx         # Detail facture
│   │   │   └── settings/
│   │   │       └── page.tsx              # Profil + abonnement
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── pdf/[type]/[id]/route.ts  # GET → genere et retourne le PDF
│   │   │   ├── webhooks/stripe/route.ts  # POST → webhook Stripe
│   │   │   └── email/send/route.ts       # POST → envoi email avec PDF
│   │   ├── layout.tsx                    # Root layout (providers)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                           # Composants shadcn/ui
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── forms/
│   │   │   ├── ClientForm.tsx
│   │   │   ├── DevisForm.tsx
│   │   │   └── LineItemsEditor.tsx
│   │   └── pdf/
│   │       ├── DevisDocument.tsx         # Template PDF devis
│   │       └── FactureDocument.tsx       # Template PDF facture
│   ├── lib/
│   │   ├── prisma.ts                     # Singleton Prisma Client
│   │   ├── auth.ts                       # Config NextAuth
│   │   ├── stripe.ts                     # Instance Stripe + PLANS
│   │   ├── email.ts                      # Config Nodemailer
│   │   ├── utils.ts                      # Helpers (formatage, calculs, TVA_RATES)
│   │   ├── subscription.ts              # Gating abonnement (checkSubscription)
│   │   ├── rate-limit.ts                # Rate limiting (Upstash)
│   │   ├── action-utils.ts              # Types ActionResult, helpers
│   │   └── logger.ts                    # Logs structures pour actions metier
│   ├── actions/
│   │   ├── auth.ts                       # Inscription + reset password
│   │   ├── clients.ts                    # CRUD clients
│   │   ├── devis.ts                      # CRUD devis
│   │   ├── factures.ts                   # Creation facture depuis devis
│   │   └── subscription.ts              # Gestion abonnement Stripe
│   └── middleware.ts                     # Protection routes (dashboard)
├── tests/
│   ├── unit/
│   │   ├── utils.test.ts
│   │   └── subscription.test.ts
│   ├── integration/
│   │   ├── clients.test.ts
│   │   ├── devis.test.ts
│   │   └── factures.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── devis-flow.spec.ts
│       └── billing.spec.ts
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

### Route Groups

| Groupe         | Acces        | Description                          |
| -------------- | ------------ | ------------------------------------ |
| `(marketing)`  | Public       | Landing, pricing                     |
| `(auth)`       | Non connecte | Login, register, forgot-password, reset-password |
| `(dashboard)`  | Connecte     | App principale (clients, devis, etc) |

---

## 2. Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── NextAuth ────────────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Domaine ─────────────────────────────────────────

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String    @unique
  emailVerified  DateTime?
  hashedPassword String?
  image          String?
  company        String?   // Nom entreprise / artisan
  siret          String?
  address        String?
  phone          String?

  // Stripe
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?
  stripePriceId        String?
  stripeCurrentPeriodEnd DateTime?
  trialEndsAt          DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts Account[]
  clients  Client[]
  devis    Devis[]
  factures Facture[]
}

model Client {
  id      String  @id @default(cuid())
  name    String
  email   String
  address String? // Adresse client (requis sur documents professionnels FR)
  phone   String?

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  devis    Devis[]
  factures Facture[]
}

enum DevisStatus {
  DRAFT
  SENT
  INVOICED
}

model Devis {
  id     String      @id @default(cuid())
  number String      // DEV-2025-001
  status DevisStatus @default(DRAFT)
  date   DateTime    @default(now())

  tvaRate Decimal @default(20) @db.Decimal(5, 2) // Taux TVA en %

  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  clientId String
  client   Client @relation(fields: [clientId], references: [id])

  items DevisItem[]

  factureId String?  @unique
  facture   Facture? @relation

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, number])
  @@index([userId, createdAt])
}

model DevisItem {
  id          String  @id @default(cuid())
  designation String
  quantity    Decimal @db.Decimal(10, 2) // Quantite (ex: 2.5 heures)
  unitPrice   Int     // Prix unitaire HT en centimes

  devisId String
  devis   Devis  @relation(fields: [devisId], references: [id], onDelete: Cascade)

  order Int @default(0)
}

model Facture {
  id     String    @id @default(cuid())
  number String    // FAC-2025-001
  date   DateTime  @default(now())

  tvaRate Decimal @default(20) @db.Decimal(5, 2)

  userId   String
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  clientId String
  client   Client @relation(fields: [clientId], references: [id])

  items FactureItem[]

  devis Devis? // Devis source (optionnel)

  deletedAt DateTime? // Soft delete (conservation legale 10 ans)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, number])
  @@index([userId, createdAt])
}

model FactureItem {
  id          String  @id @default(cuid())
  designation String
  quantity    Decimal @db.Decimal(10, 2)
  unitPrice   Int     // Prix unitaire HT en centimes

  factureId String
  facture   Facture @relation(fields: [factureId], references: [id], onDelete: Cascade)

  order Int @default(0)
}
```

---

## 3. Server Actions & API Routes

### Server Actions (`src/actions/`)

Toute la logique CRUD passe par des Server Actions (`"use server"`), validees avec Zod.

Chaque action suit ce pattern :

1. Verifier l'authentification via `auth()`
2. Verifier l'abonnement via `checkSubscription(userId)` (throw si inactif)
3. Valider les donnees avec un schema Zod
4. Executer la logique metier via Prisma
5. `revalidatePath()` pour rafraichir l'UI
6. Retourner un `ActionResult<T>` (success/error) pour `useActionState` cote client

#### `src/actions/auth.ts`

| Action | Signature | Description |
| --- | --- | --- |
| `register` | `(formData: FormData) → void` | Hash password (bcrypt, 12 rounds), cree User avec `trialEndsAt` = +14 jours, puis `signIn` auto |
| `requestPasswordReset` | `(formData: FormData) → void` | Genere token UUID, stocke dans `VerificationToken` (expire 1h), envoie email avec lien `/reset-password?token=xxx`. Ne revele pas si l'email existe. |
| `resetPassword` | `(token: string, formData: FormData) → void` | Verifie token non expire, hash nouveau mdp, supprime le token |

#### `src/actions/clients.ts`

| Action | Signature | Description |
| --- | --- | --- |
| `createClient` | `(formData: FormData) → void` | Validation Zod : name (requis), email (requis), address (optionnel), phone (optionnel) |
| `updateClient` | `(id: string, formData: FormData) → void` | Where : `{ id, userId }` pour s'assurer que le client appartient a l'utilisateur |
| `deleteClient` | `(id: string) → void` | Suppression physique (cascade vers devis/factures) |

#### `src/actions/devis.ts`

| Action | Signature | Description |
| --- | --- | --- |
| `createDevis` | `(data: DevisInput) → Devis` | Validation Zod : clientId, tvaRate (taux legal FR), items (min 1 ligne, unitPrice en centimes Int). Numerotation : compteur filtre par annee (`DEV-{ANNEE}-{NNN}`) |
| `updateDevis` | `(id: string, data: DevisInput) → void` | Guard : impossible si status = INVOICED |
| `deleteDevis` | `(id: string) → void` | Guard : impossible si status = INVOICED |

#### `src/actions/factures.ts`

| Action | Signature | Description |
| --- | --- | --- |
| `convertDevisToFacture` | `(devisId: string) → Facture` | Guards : devis doit etre SENT (pas DRAFT, pas INVOICED). Transaction Prisma : cree la facture + copie les items + update devis status → INVOICED. Numerotation filtree par annee. |

#### `src/actions/subscription.ts`

| Action | Signature | Description |
| --- | --- | --- |
| `createCheckoutSession` | `(plan: "monthly" \| "yearly") → redirect` | Cree ou recupere le Stripe Customer, cree une Checkout Session, redirige |
| `createPortalSession` | `() → redirect` | Cree une Billing Portal Session, redirige |

### Machine d'etats DevisStatus

```
DRAFT → SENT → INVOICED
```

- `DRAFT → SENT` : declenche par l'envoi email (`/api/email/send`)
- `SENT → INVOICED` : declenche par `convertDevisToFacture`
- Pas de retour en arriere possible
- Un devis INVOICED ne peut plus etre modifie ni supprime

### Route Handlers (`src/app/api/`)

Reservees aux cas qui necessitent un endpoint HTTP :

| Route | Methode | Usage | Validation |
| --- | --- | --- | --- |
| `/api/auth/[...nextauth]` | * | NextAuth endpoints | NextAuth interne |
| `/api/pdf/[type]/[id]` | GET | Genere et renvoie le PDF (stream) | Auth + ownership check |
| `/api/email/send` | POST | Envoie un email avec PDF attache | Auth + Zod (`type`, `id`) + guard status |
| `/api/webhooks/stripe` | POST | Webhook Stripe | Signature Stripe (`constructEvent`) |

Toutes les API routes valident les entrees avec Zod et verifient l'ownership (` userId: session.user.id`).

---

## 4. Authentification

### NextAuth v5 (Auth.js)

- **Adapter** : `PrismaAdapter`
- **Providers** : Google OAuth + Credentials (email/password avec bcrypt)
- **Session** : strategie JWT (pas de table Session)
- **Callbacks** : `jwt` injecte `user.id` dans le token, `session` l'expose dans `session.user.id`
- **Pages custom** : `signIn: "/login"`

### Middleware de protection (`src/middleware.ts`)

- Routes dashboard (`/dashboard`, `/clients`, `/devis`, `/factures`, `/settings`) → redirige vers `/login` si non connecte
- Routes auth (`/login`, `/register`) → redirige vers `/dashboard` si deja connecte
- Matcher : exclut `/api`, `_next/static`, `_next/image`, `favicon.ico`

---

## 5. Pages & ecrans

| Route | Description |
| --- | --- |
| `/` | Landing page : hero, features, pricing, CTA |
| `/pricing` | Plans et comparaison |
| `/login` | Connexion email/password + Google |
| `/register` | Inscription + lien Google |
| `/forgot-password` | Envoi email de reset |
| `/reset-password` | Saisie nouveau mot de passe via token |
| `/dashboard` | Resume : nb devis, factures, derniers documents |
| `/clients` | Liste clients avec recherche |
| `/clients/new` | Formulaire : nom, email, adresse, telephone |
| `/clients/[id]/edit` | Formulaire pre-rempli |
| `/devis` | Liste devis avec statut et recherche |
| `/devis/new` | Formulaire complet avec lignes dynamiques |
| `/devis/[id]/edit` | Formulaire pre-rempli (si pas INVOICED) |
| `/factures` | Liste factures avec recherche |
| `/factures/[id]` | Detail lecture seule + telechargement PDF |
| `/settings` | Profil utilisateur + gestion abonnement Stripe |

---

## 6. Generation PDF

- **Stack** : `@react-pdf/renderer` — composants React rendus cote serveur, pas de headless browser
- **Templates** : `DevisDocument.tsx` et `FactureDocument.tsx` dans `src/components/pdf/`
- **Route** : `GET /api/pdf/[type]/[id]` → verifie auth + ownership, charge le document avec items tries par `order`, appelle `renderToBuffer`, retourne avec `Content-Type: application/pdf`
- **Contenu PDF** : header (emetteur : company/name, SIRET, adresse, telephone + client : nom, email, adresse), numero + date, tableau des lignes (designation, qte, PU HT, total HT), totaux (HT, TVA, TTC)

---

## 7. Systeme email

- **Stack** : Nodemailer avec SMTP (Resend ou autre)
- **Fonction** : `sendDocumentEmail({ to, subject, text, pdfBuffer, pdfFilename })` dans `src/lib/email.ts`
- **Route** : `POST /api/email/send` — body Zod-valide (`{ type: "devis" | "facture", id: string }`), genere le PDF a la volee, envoie avec piece jointe, marque le devis comme SENT si applicable
- **Rate limit** : 10 emails/heure/utilisateur

---

## 8. Integration Stripe

### Strategie

- **Trial 14 jours** : gere cote applicatif (`trialEndsAt` sur User), pas via Stripe
- **Checkout Session** : redirige vers Stripe pour le paiement
- **Webhook** : met a jour l'abonnement en base
- **Customer Portal** : Stripe hosted pour gestion carte / annulation

### Plans

| Plan | Prix | Price ID |
| --- | --- | --- |
| Mensuel | 9,90 EUR/mois | `STRIPE_MONTHLY_PRICE_ID` |
| Annuel | 99 EUR/an | `STRIPE_YEARLY_PRICE_ID` |

### Webhook events geres

| Event | Action |
| --- | --- |
| `checkout.session.completed` | Stocke `subscriptionId`, `priceId`, `currentPeriodEnd` |
| `invoice.payment_succeeded` | Met a jour `currentPeriodEnd` |
| `customer.subscription.deleted` | Remet les champs Stripe a `null` |
| `default` | Log l'event non gere |

Le webhook verifie la signature Stripe via `constructEvent` avant tout traitement.

### Gating abonnement

- `hasActiveSubscription(userId)` : retourne `true` si trial actif OU abonnement actif
- `checkSubscription(userId)` : throw si inactif — appele dans **toutes** les Server Actions CRUD

---

## 9. Gestion d'erreurs

### Pattern Server Actions

Les Server Actions retournent un `ActionResult<T>` :

```ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### Pattern cote client

Les formulaires utilisent `useActionState` (React 19) pour consommer le `ActionResult` et afficher les erreurs dans l'UI.

### API Routes

Les API routes utilisent `try/catch` et retournent des reponses JSON structurees avec codes HTTP adequats (400, 401, 404, 500).

---

## 10. Rate limiting

Stack : `@upstash/ratelimit` + Redis Upstash.

| Endpoint | Limite | Fenetre |
| --- | --- | --- |
| `POST /api/email/send` | 10 requetes | par heure par utilisateur |
| `GET /api/pdf/[type]/[id]` | 30 requetes | par minute par utilisateur |
| `POST /api/auth` (login) | 5 tentatives | par minute par IP |
| Server Action `register` | 3 tentatives | par minute par IP |

---

## 11. Monitoring & logging

| Outil | Usage |
| --- | --- |
| **Sentry** | Error tracking client + serveur |
| **Vercel Analytics** | Web Vitals, performance pages |
| **Logs structures** | Actions metier critiques (creation facture, envoi email, webhook Stripe) via `logAction()` en JSON |

---

## 12. Strategie de tests

| Niveau | Outil | Couverture |
| --- | --- | --- |
| **Unitaire** | Vitest | `computeTotals`, `formatCurrency`, validation Zod, `checkSubscription` |
| **Integration** | Vitest + Prisma (DB de test) | Server Actions CRUD, conversion devis → facture, numerotation |
| **E2E** | Playwright | Inscription, creation devis, envoi email, conversion facture, checkout Stripe |

---

## 13. Decisions architecturales

| Decision | Choix | Justification |
| --- | --- | --- |
| CRUD | Server Actions (`"use server"`) | Formulaires natifs, pas de fetch manuel, revalidation automatique |
| API Routes | Uniquement webhooks + PDF + email | Cas qui necessitent un endpoint HTTP (webhook externe, streaming binaire) |
| Session | JWT (pas de table Session) | Plus simple, pas de lookup DB a chaque requete, compatible edge |
| Numerotation | `{PREFIX}-{ANNEE}-{NNN}` filtre par annee | Lisible, unique par utilisateur, incrementale, reset annuel. Contrainte `@@unique([userId, number])` en DB. |
| Stockage totaux | Calcules a la volee (`computeTotals`) | Evite les incoherences, source de verite = items. `Math.round()` pour eviter les erreurs d'arrondi. |
| Prix | Centimes (`Int`) | Evite les erreurs d'arrondi en virgule flottante |
| Quantites | `Decimal(10,2)` | Supporte les fractions (ex: 2.5 heures) sans erreurs Float |
| TVA | `Decimal(5,2)` + validation taux legaux FR | Contrainte aux taux legaux francais (20%, 10%, 5.5%, 2.1%) |
| Trial | Champ `trialEndsAt` en base | Pas besoin de Stripe pour le trial, logique simplifiee |
| Gating | `checkSubscription()` throw dans les Server Actions | Verification systematique dans toutes les actions CRUD |
| PDF | `@react-pdf/renderer` | Composants React, rendu serveur, pas de headless browser |
| CSS | Tailwind CSS v4 + shadcn/ui | Rapidite de developpement, composants accessibles |
| Soft delete | `deletedAt` sur Facture | Conservation legale 10 ans, pas de suppression physique des factures |
| Validation | Zod partout (Server Actions + API Routes) | Validation coherente sur tous les points d'entree |
| Erreurs | `ActionResult<T>` + `useActionState` | Pattern structure serveur/client, pas de throw non gere |
| Rate limiting | Upstash Redis | Protection des endpoints sensibles (email, PDF, auth) |
| Monitoring | Sentry + logs structures JSON | Error tracking + audit trail des actions metier |

---

## 14. Dependances cles

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "typescript": "^5",
    "@prisma/client": "^6",
    "prisma": "^6",
    "next-auth": "^5.0.0-beta",
    "@auth/prisma-adapter": "^2",
    "bcryptjs": "^2",
    "@react-pdf/renderer": "^4",
    "nodemailer": "^6",
    "stripe": "^17",
    "zod": "^3",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "lucide-react": "^0.460",
    "@radix-ui/react-dialog": "^1",
    "@radix-ui/react-dropdown-menu": "^2",
    "@radix-ui/react-label": "^2",
    "@radix-ui/react-select": "^2",
    "@radix-ui/react-slot": "^1",
    "@upstash/ratelimit": "^2",
    "@upstash/redis": "^1",
    "@sentry/nextjs": "^8"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/bcryptjs": "^2",
    "@types/nodemailer": "^6",
    "vitest": "^2",
    "@playwright/test": "^1"
  }
}
```

---

## 15. Variables d'environnement

```env
# Base de donnees
DATABASE_URL="postgresql://user:password@localhost:5432/facturoo"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_MONTHLY_PRICE_ID=""
STRIPE_YEARLY_PRICE_ID=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# SMTP (Emails)
SMTP_HOST="smtp.resend.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="resend"
SMTP_PASS=""
SMTP_FROM="noreply@facturoo.fr"

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Sentry
SENTRY_DSN=""
```

---

## 16. Ordre d'implementation

| Phase | Description | Fichiers cles |
| --- | --- | --- |
| 1 | Init projet Next.js 15, Tailwind, TypeScript, Prisma, Sentry | `package.json`, `prisma/schema.prisma`, `tailwind.config.ts` |
| 2 | Schema Prisma complet + migration | `prisma/schema.prisma` |
| 3 | NextAuth v5 (Credentials + Google) + inscription + reset password | `src/lib/auth.ts`, `src/actions/auth.ts`, `src/middleware.ts`, pages auth |
| 4 | Utils et libs (computeTotals, TVA_RATES, logger, rate-limit, action-utils) | `src/lib/` |
| 5 | Subscription gating | `src/lib/subscription.ts` |
| 6 | Layout dashboard (sidebar, header) | `src/app/(dashboard)/layout.tsx`, composants layout |
| 7 | CRUD Clients | `src/actions/clients.ts`, pages clients |
| 8 | CRUD Devis + guards status | `src/actions/devis.ts`, pages devis, `LineItemsEditor` |
| 9 | Templates PDF (devis + facture) | `src/components/pdf/`, `src/app/api/pdf/` |
| 10 | Conversion devis → facture | `src/actions/factures.ts`, pages factures |
| 11 | Envoi email avec PDF + rate limiting | `src/lib/email.ts`, `src/app/api/email/send/` |
| 12 | Integration Stripe (checkout, webhook, portal) | `src/lib/stripe.ts`, `src/actions/subscription.ts`, webhook |
| 13 | Landing page + page pricing | `src/app/(marketing)/` |
| 14 | Dashboard resume + polish UI | `src/app/(dashboard)/dashboard/page.tsx` |
| 15 | Tests (unitaires, integration, E2E) | `tests/` |
