# Facturoo — Charte UI / Design System

## Direction artistique

**Style** : Warm & premium — chaleureux, professionnel, rassurant. Pas froid/corporate.
**Cible** : Artisans français — interfaces claires, tactiles, inspirant confiance.

---

## Typographie

| Usage | Police | Variable CSS |
|---|---|---|
| Headings, titres | **DM Serif Display** | `--font-display` |
| Body, UI | **Plus Jakarta Sans** | `--font-sans` |
| Code | Mono système | `--font-mono` |

- Headings : `font-display` (serif), poids bold
- Body : `font-sans` (sans-serif), poids 400–700
- Tailles hero : `text-6xl sm:text-7xl`

---

## Palette de couleurs (oklch)

### Light mode

| Token | Valeur | Usage |
|---|---|---|
| `--primary` | `oklch(0.55 0.18 270)` | Indigo — boutons, liens, accents principaux |
| `--primary-hover` | `oklch(0.48 0.20 270)` | Hover sur boutons primary |
| `--primary-subtle` | `oklch(0.97 0.01 270)` | Fond hover table rows, sélections légères |
| `--accent` | `oklch(0.72 0.12 55)` | Cuivre/terracotta — accents secondaires, artisan |
| `--surface` | `oklch(0.99 0.002 80)` | Fond légèrement élevé, distinct du background |
| `--success` | `oklch(0.60 0.15 145)` | Statuts positifs, badges "Actif" |
| `--warning` | `oklch(0.75 0.15 80)` | Alertes modérées |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Erreurs, suppression, danger |
| `--background` | `oklch(0.97 0.005 80)` | Fond page (crème très léger) |
| `--card` | `oklch(1.0 0.0 0)` | Fond cartes (blanc pur) |
| `--muted` | `oklch(0.94 0.01 80)` | Fonds secondaires |
| `--border` | `oklch(0.90 0.01 80)` | Bordures |

### Dark mode

Toutes les valeurs sont inversées avec des lightness basses et des chromas réduits. Voir `globals.css` section `.dark`.

---

## Ombres

| Classe | Usage |
|---|---|
| `shadow-warm` | Ombre chaude standard pour cartes (`--shadow-color: oklch(0.40 0.08 270 / 0.08)`) |
| `shadow-warm-lg` | Ombre plus prononcée pour éléments surélevés |
| `surface-elevated` | Classe utilitaire combinant ombre riche |
| `surface-glass` | Backdrop-filter blur pour header flottant |

---

## Composants UI (`src/components/ui/`)

### Button
- Variants : `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `accent`
- Sizes : `xs`, `sm`, `default` (h-10), `lg` (h-12), `icon`, `icon-xs`, `icon-sm`, `icon-lg`
- Prop `loading` : affiche un spinner SVG + disabled
- Coins : `rounded-lg` (lg: `rounded-xl`)
- Default a une ombre bottom subtle "raised"

### Card
- Coins : `rounded-2xl`
- Bordure : `ring-1 ring-border/50` (double-border subtil)
- Ombre : `shadow-warm`
- CardTitle : utilise `font-display` (serif)

### Input / Textarea
- Hauteur : `h-11` (cibles tactiles grandes)
- Background : `bg-white` (pas transparent)
- Coins : `rounded-lg`
- Placeholder : opacité `/60`

### Table
- TableHead : fond `bg-muted/30`, uppercase, tracking-wider
- TableCell : padding `px-4 py-3`
- Row hover : `bg-primary-subtle`

### Badge
- Point coloré indicateur à gauche (pseudo-element `before:`)
- Variants statut : `draft`, `sent`, `invoiced`, `paid`, `overdue`, `destructive`

### Alert
- Bordure gauche accent `border-l-4` colorée selon variant
- Variants : `default`, `destructive`, `success`, `warning`

### Avatar
- Initiales extraites du nom, couleur déterministe (hash)
- 5 couleurs, 3 tailles (`sm`, `md`, `lg`)

### EmptyState
- Icône + titre + description + action CTA
- Bordure pointillée, centré

### Toast (ToastProvider + useToast)
- 4 variants : `success`, `error`, `warning`, `info`
- Auto-dismiss 4s, positionné bottom-right
- Wrappé dans `ToastProvider` au niveau du dashboard layout

### Skeleton
- Animation shimmer (gradient glissant)
- Classe `animate-shimmer`, coins `rounded-lg`

### Autres
- `Dialog`, `DropdownMenu`, `Sheet`, `Select`, `Label`, `Separator`, `Switch` — Radix UI primitives

---

## Layout

### Sidebar (`src/components/layout/Sidebar.tsx`)
- Section utilisateur en haut : Avatar + nom + email
- Badge plan à côté du logo ("Pro" / "Essai")
- Nav items actifs : `border-l-2 border-white`
- Settings séparé en bas
- Gradient fond : `bg-gradient-to-b from-sidebar to-sidebar/95`
- Mobile : Sheet (slide-in)

### Header (`src/components/layout/Header.tsx`)
- Titre de page dérivé du pathname
- Quick-action dropdown (Plus → nouveau client/devis)
- User dropdown (Avatar → Paramètres, Déconnexion)
- Effet : `bg-card/80 surface-glass` (glass morphism)

### Dashboard Layout
- `max-w-7xl mx-auto` pour limiter la largeur
- Padding : `p-4 lg:p-8`
- `ToastProvider` wrappé au niveau layout

---

## Animations & Micro-interactions

| Classe | Effet |
|---|---|
| `animate-fade-in-up` | Entrée page (translateY + opacity) |
| `animate-shimmer` | Skeleton loading shimmer |
| `animate-spinner` | Rotation continue (bouton loading) |
| `card-hover-premium` | translateY(-2px) + scale(1.01) + ombre (spring easing) |
| `animate-stagger-{1-4}` | Délai d'animation échelonné pour KPI cards |

- Toutes les transitions utilisent `transition-all` ou `transition-colors`
- Spring easing sur hover cartes : `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Loading states via `loading.tsx` (React Suspense) avec Skeleton

---

## Pages clés

### Marketing
- **Landing** : hero avec gradient overlay, mockup perspective, social proof, 3 étapes, section confiance, CTA gradient
- **Pricing** : plan recommandé `scale-[1.02]` + badge, FAQ accordéon, toggle mensuel/annuel

### Auth
- **Layout** : split desktop (panneau marque indigo + formulaire), mobile formulaire seul
- **Login/Register** : Google OAuth + magic link + password (progressif)
- Footer sécurité : "Vos données sont sécurisées"

### Dashboard
- **Home** : KPI cards gradient, empty state onboarding, listes récentes avec Avatar
- **Listes** : Table dans Card, EmptyState, Skeleton loading
- **Settings** : Cards visuelles pour abonnement (icônes + badges statut)

---

## Règles de design

1. **Coins** : `rounded-2xl` (cartes), `rounded-xl` (boutons lg, icônes), `rounded-lg` (inputs, boutons)
2. **Espacement** : `space-y-8` entre sections, `gap-4` dans grilles
3. **Icônes** : lucide-react, taille `h-4 w-4` (inline) ou `h-5 w-5` (dans conteneurs)
4. **Touch targets** : minimum `h-10` (44px) sur éléments interactifs
5. **Couleurs statut** : draft=gris, sent=bleu, invoiced=indigo, paid=vert, overdue=rouge
6. **Pas d'emojis** sauf demande explicite
7. **Langue** : interface 100% français
