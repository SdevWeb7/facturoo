# PRD – Générateur de devis & factures pour artisans

> **Nom de produit** : **Facturoo**
> **Slogan** : *Vos devis et factures en 2 minutes, sans prise de tête.*

## 1. Contexte & objectif

### Problème

Les artisans (auto-entrepreneurs, TPE) perdent du temps à créer leurs devis et factures via Word, Excel ou des logiciels trop complexes et coûteux. Cela entraîne :

* Perte de temps
* Erreurs de calcul
* Image peu professionnelle
* Friction pour envoyer et suivre les devis

### Objectif du produit

Créer un outil **ultra simple** permettant de :

* Créer un devis ou une facture en moins de 2 minutes
* Envoyer un PDF professionnel au client
* Gérer l’historique sans complexité

### Objectif business

* Générer des revenus rapidement
* Valider un SaaS simple avec paiement récurrent
* Servir de base technique et commerciale pour des projets futurs

---

## 2. Cible utilisateur

### Persona principal

* Artisan seul ou petite équipe (1–3 personnes)
* Peu à l’aise avec l’informatique
* Utilise Word / Excel ou papier
* Priorité : gagner du temps, pas faire de la comptabilité

### Exemples

* Plombier
* Électricien
* Peintre
* Menuisier
* Auto-entrepreneur services

---

## 3. Proposition de valeur

> **Vos devis et factures en 2 minutes, sans prise de tête.**

Facturoo est un outil simple pensé pour les artisans et indépendants qui veulent :

* Arrêter Excel, Word ou le papier
* Créer des devis et factures professionnels rapidement
* Se concentrer sur leur métier, pas sur l’administratif

Bénéfices clés :

* Gain de temps immédiat
* Interface claire, sans fonctionnalités inutiles
* Image professionnelle auprès des clients
* Accessible sur ordinateur et mobile

---

## 4. Périmètre fonctionnel (MVP)

### 4.1 Authentification

* Inscription par email + mot de passe
* Connexion / déconnexion
* Mot de passe oublié
* Google authentification

---

### 4.2 Gestion des clients

* Créer un client

  * Nom
  * Email
* Modifier / supprimer un client
* Liste des clients

---

### 4.3 Création de devis

* Créer un devis

* Champs :

  * Numéro de devis (auto)
  * Date
  * Client
  * Lignes de devis :

    * Désignation
    * Quantité
    * Prix unitaire
  * TVA (taux simple)
  * Total HT / TTC (auto)

* Modifier / supprimer un devis

* Liste des devis

---

### 4.4 PDF & envoi

* Génération automatique d’un PDF
* Design simple et professionnel
* Envoi du devis par email au client

---

### 4.5 Facturation

* Transformer un devis en facture
* Numéro de facture automatique
* Historique des factures

---

### 4.6 Historique

* Tableau listant :

  * Devis (brouillon / envoyé / facturé)
  * Factures
* Recherche simple

---

## 5. Hors périmètre (volontairement exclus du MVP)

* Comptabilité
* Déclarations URSSAF / TVA
* Multi-utilisateurs
* Statistiques avancées
* Paiement client intégré
* Personnalisation avancée du PDF

---

## 6. UX / UI principles

* Interface minimaliste
* 1 écran = 1 action principale
* Boutons clairs et visibles
* Pas de jargon comptable
* Mobile-friendly

---

## 7. Monétisation

### Modèle

* SaaS par abonnement

### Offres

* Essai gratuit : 14 jours
* Abonnement :

  * 9,90 € / mois
  * ou 99 € / an

### Paiement

* Carte bancaire via Stripe
* Carte requise à l’inscription

---

## 8. KPI de succès

### Produit

* Temps moyen pour créer un devis < 2 minutes
* Taux de transformation devis → facture

### Business

* Nombre d’inscriptions
* Taux de conversion essai → payant
* Churn mensuel

---

## 9. Contraintes techniques (indicatif)

* Frontend : Next.js + TypeScript
* Backend : API Next.js
* Base de données : PostgreSQL
* ORM : Prisma ou Drizzle
* PDF : react-pdf
* Emails : nodemailer ou autre
* Paiement : Stripe
* Hébergement : Vercel

---

## 10. Roadmap simplifiée

### Phase 1 – MVP (2–3 semaines)

* Auth
* Clients
* Devis
* PDF
* Email

### Phase 2 – Lancement

* Stripe
* Landing page
* Onboarding simple

### Phase 3 – Améliorations

* Retours utilisateurs
* Ajustements UX
* Préparation du projet « pépite » (boulangeries)

---

## 11. Risques & hypothèses

### Hypothèses

* Les artisans acceptent un abonnement < 10 €/mois
* La simplicité est plus importante que la richesse fonctionnelle

### Risques

* Manque de différenciation
* Difficulté d’acquisition

➡️ Mitigation : positionnement clair + contact direct avec les artisans
