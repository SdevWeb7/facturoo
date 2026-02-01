# Facturoo - Project Context

SaaS de devis et factures pour artisans français.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **React**: 19 (`useActionState` for forms)
- **TypeScript**: 5, strict mode
- **CSS**: Tailwind CSS v4 (oklch color tokens, `@theme inline`)
- **Fonts**: Plus Jakarta Sans (body), DM Serif Display (headings) — via `next/font/google`
- **ORM**: Prisma 6 with PostgreSQL (Neon cloud)
- **Auth**: NextAuth v5 beta (`next-auth@5.0.0-beta.30`), JWT strategy
- **Validation**: Zod v4 (JSON error.message parsing via `zodErrorMessage`)
- **PDF**: `@react-pdf/renderer` v4 (`renderToBuffer`, `createElement`)
- **Payments**: Stripe v20 (API `2026-01-28.clover`)
- **Email**: Nodemailer via SMTP (Resend)
- **Rate Limiting**: `@upstash/ratelimit` + `@upstash/redis` — applied on auth (5/min) and PDF (30/min)
- **Tests**: Vitest (unit), Playwright (E2E)
- **Icons**: lucide-react
- **UI Primitives**: Radix UI (Sheet, DropdownMenu, Select, Dialog, Label, Switch)

## Architecture

```
src/
├── app/
│   ├── (dashboard)/       # Authenticated routes (dashboard, clients, devis, factures, settings)
│   ├── (marketing)/       # Public routes (landing, pricing)
│   ├── (auth)/            # Login, register, forgot/reset password
│   └── api/               # PDF generation, email send, Stripe webhook
├── actions/               # Server Actions (auth, clients, devis, factures, subscription)
├── components/
│   ├── forms/             # ClientForm, DevisForm, LineItemsEditor, ProfileForm
│   ├── layout/            # Sidebar (mobile Sheet), Header (glass, dropdowns)
│   ├── pdf/               # DevisDocument, FactureDocument, styles
│   ├── providers/         # SessionProvider
│   └── ui/                # Button, Card, Input, Table, Badge, Alert, Avatar, Skeleton, Toast, EmptyState, etc.
└── lib/                   # auth, prisma, stripe, email, utils, logger, rate-limit, action-utils, subscription
```

## Key Conventions

- **Server Actions** return `ActionResult<T>` (`{ success, data/error }`) via `actionError()` / `actionSuccess()`
- **Proxy** (not middleware): `src/proxy.ts` exports `proxy()` function — Next.js 16 convention. Uses `getToken()` from `next-auth/jwt` (not `auth()`) to avoid Edge Function size limits.
- **Stripe**: Lazy singleton via `getStripe()` — never instantiate at module top level (build-time crash without env vars)
- **Amounts**: Stored in **cents** (integer). Display with `formatCurrency()`.
- **Numbering**: `DEV-YYYY-NNN` for devis, `FAC-YYYY-NNN` for factures, year-filtered sequential
- **Devis status machine**: `DRAFT` → `SENT` → `INVOICED`. Guards on update/delete (block INVOICED).
- **PDF types**: Use `ReactElement<any>` cast and `new Uint8Array(buffer)` for NextResponse compatibility
- **Rate Limiting**: `authRateLimit` (5 req/min) on register, login, magic link. `pdfRateLimit` (30 req/min) on PDF generation. Defined in `src/lib/rate-limit.ts`, gracefully disabled if Upstash env vars are missing.
- **Magic link email**: Custom French template in Nodemailer provider (`sendVerificationRequest` in `src/lib/auth.ts`)
- **Design System**: Warm & premium style — see `charteUI.md` for full design tokens, component specs, and UI rules
- **Toast**: Context-based (`ToastProvider` + `useToast`), wrapped at dashboard layout level
- **Loading states**: Each dashboard route has a `loading.tsx` with Skeleton components (React Suspense)
- **Button loading**: `loading` prop shows spinner + disables interaction
- **Layout**: Sidebar with user info + plan badge, Header with glass effect + quick actions + user dropdown
- **Account deletion**: `deleteAccount()` server action cancels Stripe subscription + cascade deletes user. Confirmation dialog requires typing "SUPPRIMER". Located in settings danger zone.

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run test         # Vitest unit tests (25 tests)
npm run test:e2e     # Playwright E2E tests (8 tests)
npm run lint         # ESLint
npx prisma db push   # Push schema to database
npx prisma studio    # Database GUI
```

## Environment Variables

Required in `.env` (not committed):
- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `NEXTAUTH_SECRET` — Random secret for JWT
- `NEXTAUTH_URL` — App URL (http://localhost:3000 local). Not needed on Vercel thanks to `trustHost: true`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_MONTHLY_PRICE_ID`, `STRIPE_YEARLY_PRICE_ID`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `NEXT_PUBLIC_APP_URL` — Public app URL for Stripe redirect URLs

## Deployment

- **Hosting**: Vercel
- **Database**: Neon PostgreSQL (eu-west-2)
- **Repo**: https://github.com/SdevWeb7/facturoo
- **URL**: https://facturoo.vercel.app

## Known Gotchas

- Stripe 2026 API: `current_period_end` is on `subscription.items.data[0]`, not on subscription root
- Stripe 2026 API: `Invoice.subscription` moved to `invoice.parent.subscription_details.subscription`
- `@react-pdf/renderer` types are incompatible with React 19 — use `as ReactElement<any>` cast
- `renderToBuffer` returns Buffer not assignable to NextResponse body — wrap with `new Uint8Array(buffer)`
- Never import Prisma in proxy/middleware — causes Edge Function > 1MB
- `trustHost: true` in NextAuth config — no need for `NEXTAUTH_URL` on Vercel
- Google OAuth callback URL: `https://facturoo.vercel.app/api/auth/callback/google`
- User cascade deletes: deleting a User cascades to Account, Client, Devis, Facture and their items
