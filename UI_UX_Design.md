# Facturoo — Charte Graphique & Design System

> Direction artistique **"Atelier Moderne"** : chaleureux, artisanal, contemporain.
> Public cible : artisans français.

---

## Table des matières

1. [Direction artistique](#1-direction-artistique)
2. [Typographie](#2-typographie)
3. [Palette de couleurs](#3-palette-de-couleurs)
4. [Ombres & Elevation](#4-ombres--élévation)
5. [Animations](#5-animations)
6. [Textures](#6-textures)
7. [Composants clés](#7-composants-clés)
8. [Patterns de pages](#8-patterns-de-pages)
9. [Tokens sémantiques](#9-tokens-sémantiques)
10. [Border radius](#10-border-radius)
11. [Responsive & Accessibilité](#11-responsive--accessibilité)

---

## 1. Direction artistique

| Axe | Description |
|-----|-------------|
| **Concept** | "Atelier Moderne" — un équilibre entre la chaleur de l'artisanat et la clarté d'une interface contemporaine. |
| **Tonalité visuelle** | Indigo profond + ambre cuivré. Pas de gris froids neutres : chaque gris est teinté chaud (hue 80) ou indigo (hue 270). |
| **Public** | Artisans français (plombiers, électriciens, menuisiers…). L'interface doit être lisible, rassurante, professionnelle sans être corporate. |
| **Principes** | Typographie serif pour les titres (caractère artisanal), sans-serif pour le corps (lisibilité UI). Ombres warm-toned. Animations subtiles de reveal. |

---

## 2. Typographie

### Polices

| Police | Variable CSS | Usage |
|--------|-------------|-------|
| **DM Serif Display** (400) | `--font-display` | Titres h1, h2, h3, branding (logo sidebar) |
| **DM Sans** (variable) | `--font-sans` | Corps de texte, boutons, formulaires, UI |

### Application

```css
/* Base layer */
h1, h2, h3 {
  font-family: var(--font-display), serif;
}

/* Utilitaire Tailwind */
.font-display {
  font-family: var(--font-display), serif;
}
```

### Configuration Next.js

```typescript
// src/app/layout.tsx
const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});
```

---

## 3. Palette de couleurs

Toutes les couleurs utilisent le modèle **oklch** pour une uniformité perceptuelle.

### Core — Light Mode (`:root`)

| Token | Valeur oklch | Role |
|-------|-------------|------|
| `--background` | `oklch(0.98 0.005 80)` | Fond de page (off-white chaud) |
| `--foreground` | `oklch(0.18 0.02 280)` | Texte principal |
| `--card` | `oklch(1 0 0)` | Fond des cartes (blanc pur) |
| `--card-foreground` | `oklch(0.18 0.02 280)` | Texte sur cartes |
| `--popover` | `oklch(1 0 0)` | Fond dropdowns/modals |
| `--popover-foreground` | `oklch(0.18 0.02 280)` | Texte dans popovers |
| `--primary` | `oklch(0.40 0.15 270)` | Indigo profond (boutons, liens) |
| `--primary-foreground` | `oklch(0.98 0.005 80)` | Texte clair sur primary |
| `--secondary` | `oklch(0.96 0.008 80)` | Off-white chaud secondaire |
| `--secondary-foreground` | `oklch(0.25 0.02 280)` | Texte foncé sur secondary |
| `--muted` | `oklch(0.95 0.008 80)` | Fonds discrets |
| `--muted-foreground` | `oklch(0.50 0.02 270)` | Texte atténué |
| `--accent` | `oklch(0.78 0.14 65)` | Ambre/cuivré chaud |
| `--accent-foreground` | `oklch(0.25 0.05 60)` | Texte foncé sur accent |
| `--border` | `oklch(0.90 0.01 80)` | Bordures chaudes |
| `--input` | `oklch(0.90 0.01 80)` | Bordures champs de saisie |
| `--ring` | `oklch(0.40 0.15 270)` | Focus ring (indigo) |

### Sémantiques

| Token | Valeur oklch | Role |
|-------|-------------|------|
| `--destructive` | `oklch(0.577 0.245 27.325)` | Rouge erreur/suppression |
| `--success` | `oklch(0.52 0.14 155)` | Vert succès |
| `--warning` | `oklch(0.75 0.15 65)` | Ambre avertissement |

### Sidebar

| Token | Valeur oklch | Role |
|-------|-------------|------|
| `--sidebar` | `oklch(0.25 0.08 270)` | Fond sidebar (indigo foncé) |
| `--sidebar-foreground` | `oklch(0.95 0.01 80)` | Texte sidebar |
| `--sidebar-primary` | `oklch(0.95 0.01 80)` | Texte primary sidebar |
| `--sidebar-primary-foreground` | `oklch(0.25 0.08 270)` | Inverse primary sidebar |
| `--sidebar-accent` | `oklch(0.32 0.08 270)` | Hover/active nav items |
| `--sidebar-accent-foreground` | `oklch(0.95 0.01 80)` | Texte sur accent sidebar |
| `--sidebar-border` | `oklch(0.35 0.06 270)` | Bordures sidebar |
| `--sidebar-ring` | `oklch(0.60 0.12 270)` | Focus ring sidebar |

### Charts

| Token | Valeur oklch | Couleur |
|-------|-------------|---------|
| `--chart-1` | `oklch(0.40 0.15 270)` | Indigo |
| `--chart-2` | `oklch(0.78 0.14 65)` | Ambre |
| `--chart-3` | `oklch(0.52 0.14 155)` | Vert |
| `--chart-4` | `oklch(0.60 0.20 310)` | Violet |
| `--chart-5` | `oklch(0.65 0.18 30)` | Rouge-orangé |

### Dark Mode (`.dark`)

| Token | Valeur oklch |
|-------|-------------|
| `--background` | `oklch(0.17 0.02 270)` |
| `--foreground` | `oklch(0.95 0.01 80)` |
| `--card` | `oklch(0.22 0.02 270)` |
| `--card-foreground` | `oklch(0.95 0.01 80)` |
| `--popover` | `oklch(0.22 0.02 270)` |
| `--popover-foreground` | `oklch(0.95 0.01 80)` |
| `--primary` | `oklch(0.65 0.18 270)` |
| `--primary-foreground` | `oklch(0.15 0.02 270)` |
| `--secondary` | `oklch(0.27 0.02 270)` |
| `--secondary-foreground` | `oklch(0.95 0.01 80)` |
| `--muted` | `oklch(0.27 0.02 270)` |
| `--muted-foreground` | `oklch(0.70 0.02 270)` |
| `--accent` | `oklch(0.82 0.14 65)` |
| `--accent-foreground` | `oklch(0.20 0.04 60)` |
| `--destructive` | `oklch(0.704 0.191 22.216)` |
| `--success` | `oklch(0.65 0.16 155)` |
| `--warning` | `oklch(0.82 0.14 65)` |
| `--border` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.65 0.18 270)` |
| `--sidebar` | `oklch(0.18 0.04 270)` |
| `--sidebar-primary` | `oklch(0.65 0.18 270)` |
| `--sidebar-border` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | `oklch(0.50 0.10 270)` |

### Tokens d'opacité courants

Ces combinaisons couleur/opacité reviennent fréquemment dans les composants :

| Token | Usage |
|-------|-------|
| `primary/10` | Fond badge "envoyé" |
| `primary/20` | Bordure badge "envoyé" |
| `primary/90` | Hover bouton primary |
| `accent/20` | Fond décoratif accent |
| `accent/50` | Hover ghost dark |
| `success/10` | Fond badge "facturé" |
| `success/15` | Fond badge "payé" |
| `success/20` | Bordure badge "facturé" |
| `success/25` | Bordure badge "payé" |
| `destructive/10` | Fond badge "en retard", hover destructive dropdown |
| `destructive/20` | Bordure badge "en retard", focus ring destructive |
| `muted/50` | Fond table footer, fond line items |

---

## 4. Ombres & Elevation

### Ombres custom

```css
.shadow-warm {
  box-shadow:
    0 1px 3px oklch(0.40 0.06 270 / 0.08),
    0 1px 2px oklch(0.40 0.06 270 / 0.06);
}

.shadow-warm-lg {
  box-shadow:
    0 10px 30px oklch(0.40 0.08 270 / 0.15),
    0 4px 8px oklch(0.40 0.08 270 / 0.08);
}
```

### Niveaux d'élévation

| Niveau | Classe | Usage |
|--------|--------|-------|
| 0 | — | Fond de page, sections plates |
| 1 | `shadow-sm` | Cartes standard (composant Card) |
| 2 | `shadow-warm` | Header, éléments en léger relief |
| 3 | `shadow-warm-lg` | Card pricing highlighted, hover states |
| 4 | `shadow-md` | Dropdowns, select content |
| 5 | `shadow-lg` | Dialog/modal |

### Card hover

```css
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px oklch(0.40 0.08 270 / 0.12);
}
```

---

## 5. Animations

### Keyframe fade-in-up

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out both;
}
```

### Systeme de stagger

Délai incrémental de **80ms** entre chaque élément :

| Classe | Délai |
|--------|-------|
| `.animate-stagger-1` | `0ms` |
| `.animate-stagger-2` | `80ms` |
| `.animate-stagger-3` | `160ms` |
| `.animate-stagger-4` | `240ms` |
| `.animate-stagger-5` | `320ms` |

### Patterns d'utilisation

| Contexte | Animation |
|----------|-----------|
| **Hero marketing** | `animate-fade-in-up` + stagger sur titre, description, CTA |
| **KPI cards dashboard** | `animate-fade-in-up` + `animate-stagger-1` à `animate-stagger-4` |
| **Feature grid** | `animate-fade-in-up` + stagger par feature |
| **Auth form** | `animate-fade-in-up` sur le conteneur du formulaire |
| **Pricing cards** | `card-hover` + `shadow-warm-lg` sur la carte highlighted |

---

## 6. Textures

### Cross-hatch pattern

```css
.bg-texture {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60'
    xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg
    fill='%23a09080' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0
    -30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6
    h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
```

- Motif SVG en croix, 60x60px
- Couleur `#a09080` (brun chaud) a **4% d'opacité**
- Evoque subtilement un papier artisanal / texture d'atelier

### Utilisation

| Contexte | Classes |
|----------|---------|
| Auth layout (fond) | `bg-muted bg-texture` |
| Marketing footer | `bg-muted/50 bg-texture` |

---

## 7. Composants clés

### Sidebar

```
Conteneur : h-screen w-64 border-r border-sidebar-border bg-sidebar
Header    : h-16 px-6 text-xl font-bold text-sidebar-foreground font-display
Nav items : space-y-1 px-3 py-4
  - Inactif : text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground
  - Actif   : bg-sidebar-accent text-sidebar-foreground
```

La sidebar utilise un fond **indigo foncé** (`--sidebar: oklch(0.25 0.08 270)`) avec du texte clair, créant un contraste fort avec le contenu principal.

### Header

```
h-16 flex items-center justify-between border-b bg-card px-6 shadow-warm
```

### Badge

Composant `rounded-full` avec bordure transparente par défaut.

| Variant | Classes |
|---------|---------|
| `default` | `bg-primary text-primary-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground` |
| `destructive` | `bg-destructive text-white` |
| `outline` | `border-border text-foreground` |
| `draft` | `bg-muted text-muted-foreground border-border` |
| `sent` | `bg-primary/10 text-primary border-primary/20` |
| `invoiced` | `bg-success/10 text-success border-success/20` |
| `paid` | `bg-success/15 text-success border-success/25` |
| `overdue` | `bg-destructive/10 text-destructive border-destructive/20` |

Base : `inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium`

### Button

| Variant | Classes |
|---------|---------|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90` |
| `destructive` | `bg-destructive text-white hover:bg-destructive/90` |
| `outline` | `border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |

| Taille | Classes |
|--------|---------|
| `default` | `h-9 px-4 py-2` |
| `xs` | `h-6 px-2 text-xs rounded-md` |
| `sm` | `h-8 px-3 rounded-md` |
| `lg` | `h-10 px-6 rounded-md` |
| `icon` | `size-9` |
| `icon-xs` | `size-6 rounded-md` |
| `icon-sm` | `size-8` |
| `icon-lg` | `size-10` |

Base : `rounded-md text-sm font-medium gap-2 transition-all`
Focus : `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`

### Card

```
Base    : bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
Header  : grid auto-rows-min gap-2 px-6
Title   : leading-none font-semibold
Desc    : text-muted-foreground text-sm
Content : px-6
Footer  : flex items-center px-6
```

### Input / Textarea

```
Input    : h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs
Textarea : min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs
Focus    : focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
Invalid  : aria-invalid:ring-destructive/20 aria-invalid:border-destructive
Dark     : dark:bg-input/30
```

### Table

```
Row    : hover:bg-muted/50 border-b transition-colors
Head   : h-10 px-2 text-left font-medium whitespace-nowrap text-foreground
Cell   : p-2 align-middle whitespace-nowrap
Footer : bg-muted/50 border-t font-medium
```

---

## 8. Patterns de pages

### Dashboard layout

```html
<div class="flex h-screen">
  <Sidebar />                          <!-- w-64, bg-sidebar -->
  <div class="flex flex-1 flex-col overflow-hidden">
    <Header />                         <!-- h-16, shadow-warm -->
    <main class="flex-1 overflow-y-auto bg-background p-6">
      {children}
    </main>
  </div>
</div>
```

**KPI Cards** : 4 cartes en grid avec icone colorée + `animate-fade-in-up` + stagger 1-4.

### Marketing hero

```
Section : py-24 text-center
Titre   : font-display text-5xl animate-fade-in-up animate-stagger-1
Sous-titre : text-xl text-muted-foreground animate-fade-in-up animate-stagger-2
CTA     : animate-fade-in-up animate-stagger-3
```

### Pricing

```
Grid 2 colonnes (lg)
Carte standard  : card-hover
Carte highlighted : shadow-warm-lg + border-primary + card-hover
Badge "Populaire" sur la carte highlighted
```

### Auth

```
Conteneur : min-h-screen bg-muted bg-texture flex items-center justify-center
Logo      : font-display, mb-8
Form card : w-full max-w-md animate-fade-in-up
```

### Formulaires (devis, factures, clients)

```
Conteneur : bg-card border rounded-xl p-6
Labels    : text-sm font-medium
Inputs    : bg-transparent border shadow-xs
Hints     : text-muted-foreground text-sm
Erreurs   : text-destructive text-sm
Line items: rounded-lg border bg-muted/50 p-3, grid sm:grid-cols-12
```

---

## 9. Tokens sémantiques

### Mapping statuts devis

| Statut | Variant badge | Fond | Texte | Bordure |
|--------|--------------|------|-------|---------|
| `DRAFT` | `draft` | `bg-muted` | `text-muted-foreground` | `border-border` |
| `SENT` | `sent` | `bg-primary/10` | `text-primary` | `border-primary/20` |
| `INVOICED` | `invoiced` | `bg-success/10` | `text-success` | `border-success/20` |

### Mapping statuts factures

| Statut | Variant badge | Fond | Texte | Bordure |
|--------|--------------|------|-------|---------|
| `DRAFT` | `draft` | `bg-muted` | `text-muted-foreground` | `border-border` |
| `SENT` | `sent` | `bg-primary/10` | `text-primary` | `border-primary/20` |
| `PAID` | `paid` | `bg-success/15` | `text-success` | `border-success/25` |
| `OVERDUE` | `overdue` | `bg-destructive/10` | `text-destructive` | `border-destructive/20` |

### Convention

> **Ne jamais utiliser de couleurs Tailwind hardcodées** (`gray-500`, `purple-600`, `blue-200`, etc.).
> Toujours passer par les tokens sémantiques (`primary`, `muted`, `accent`, `success`, `destructive`, `warning`).
> Cela garantit la cohérence light/dark mode et le respect de la charte.

---

## 10. Border radius

Variable de base : `--radius: 0.625rem` (10px)

| Token | Formule | Valeur |
|-------|---------|--------|
| `--radius-sm` | `calc(var(--radius) - 4px)` | 6px |
| `--radius-md` | `calc(var(--radius) - 2px)` | 8px |
| `--radius-lg` | `var(--radius)` | 10px |
| `--radius-xl` | `calc(var(--radius) + 4px)` | 14px |
| `--radius-2xl` | `calc(var(--radius) + 8px)` | 18px |
| `--radius-3xl` | `calc(var(--radius) + 12px)` | 22px |
| `--radius-4xl` | `calc(var(--radius) + 16px)` | 26px |

### Usage typique

| Composant | Radius |
|-----------|--------|
| Buttons | `rounded-md` (8px) |
| Cards | `rounded-xl` (14px) |
| Badges | `rounded-full` |
| Inputs | `rounded-md` (8px) |
| Dialogs | `rounded-lg` (10px) |
| Select items | `rounded-sm` (6px) |

---

## 11. Responsive & Accessibilité

### Breakpoints

| Breakpoint | Usage |
|------------|-------|
| `sm` (640px) | Line items grid passe en multi-colonnes, select trigger responsive |
| `lg` (1024px) | Pricing grid 2 colonnes, marketing layouts |

Le layout dashboard (sidebar + main) n'est pas responsive mobile (desktop-first pour un SaaS B2B).

### Focus & Accessibility

```css
/* Focus ring standard */
focus-visible:border-ring
focus-visible:ring-ring/50
focus-visible:ring-[3px]

/* Focus ring destructive */
focus-visible:ring-destructive/20
dark:focus-visible:ring-destructive/40

/* ARIA invalid states */
aria-invalid:ring-destructive/20
dark:aria-invalid:ring-destructive/40
aria-invalid:border-destructive
```

### Rendering

```css
body {
  -webkit-font-smoothing: antialiased;
}
```

### Defaults globaux

```css
* {
  @apply border-border outline-ring/50;
}
body {
  @apply bg-background text-foreground;
}
```

---

## Annexe : Icones

Le projet utilise **lucide-react** avec les tailles suivantes :

| Classe | Taille | Usage |
|--------|--------|-------|
| `size-3` | 12px | Dans badges, boutons xs |
| `size-4` | 16px | Dans alerts, boutons standard |
| `size-5` | 20px | KPI cards, nav items |

---

*Document de reference pour le design system Facturoo. Toutes les valeurs correspondent au code source dans `src/app/globals.css` et les composants `src/components/ui/`.*
