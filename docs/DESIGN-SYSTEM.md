# Design system — Personal Workspace

Référence : planche graphique à quatre vues (dashboard sombre, clair, interactions, modales/mobile), approuvée par le propriétaire dans la conversation Portfolio. Issues #10 et #11. La planche est une référence visuelle statique, pas une preuve de fonctionnement. Son fichier image reste dans la conversation ; il n'est pas encore versionné. Portrait, dates, coordonnées et disponibilités illustratifs : ne pas les recopier comme faits.

## Identité validée

Développeur polyvalent ; public recruteurs. Éditorial, simple, minimaliste, amoureux du détail. Dashboard métier industriel plutôt que site vitrine ou navigation multi-dashboard. Widgets uniformes, palette noir/blanc/jaune industriel, modes clair/sombre et français/anglais.

## Tokens de référence

| Token | Sombre | Clair |
|---|---|---|
| Fond workspace | #101010 | #F5F5F5 |
| Sidebar | #161616 | #FFFFFF |
| Surface widget | #1C1C1C | #FFFFFF |
| Bordure | #303030 | #DEDEDE |
| Texte principal | #FFFFFF | #111111 |
| Texte secondaire | #A3A3A3 | #595959 |
| Accent | #FFD600 | #FFD600 |
| Texte sur accent | #111111 | #111111 |

Titres Space Grotesk ; interface et textes Inter ; données et labels techniques IBM Plex Mono. Rayon de référence 6 px ; bordures fines, ombres discrètes, fond à points subtil, pas de dégradés décoratifs. Utiliser l'accent pour les actions et sélections, pas comme texte clair sur blanc. Espacements, tailles de caractères, points de rupture et valeurs de contraste finales à vérifier pendant prototype ; ne pas inventer une validation pixel-perfect.

## Structure commune

- Sidebar ouverte par défaut et rétractable, catégories dépliables, recherche, poignée de drag. Elle n'est pas une navigation de pages : elle offre une bibliothèque et des actions (profil, contact, CV, préférences). En mode compact, conserver des accès compréhensibles.
- Barre supérieure permanente : titre du workspace, annuler/rétablir, plein écran, mode présentation, FR/EN, horloge locale ; accès au thème et à la réinitialisation dans la sidebar ou la barre.
- Workspace unique limité en largeur, défilement vertical, grille de points de fond purement visuelle ; composition éditoriale initiale lisible sans personnalisation.
- Widget uniforme : bordure, en-tête avec poignée et titre, menu contextuel accessible aussi au clic sur les points, corps adaptatif, poignée de redimensionnement. Contrôles discrets mais accessibles au clavier, au tactile et au focus.

## Composition initiale desktop (référence maquette)

```text
┌───────────────┬────────────────────────────────────────────────┐
│ PW.       <<  │ Workspace / Overview   Undo Redo  Présentation │
│ Recherche     ├─────────────────────────────┬──────────────────┤
│ Identité      │ Présentation                │ Disponibilité    │
│ Carrière      │ Portrait + nom + intitulé    ├──────────────────┤
│ Engineering   │                             │ Contact          │
│ Réalisations  ├──────────────────────┬──────┴──────────────────┤
│ Activité      │ Expériences          │ Stack technique         │
│ Personnel     │ Timeline            │ Technologies           │
│ Contact       ├─────────────┬────────┴──────┬──────────────────┤
│               │ Botty       │ Workflow IA   │ LeStudio         │
│ Préférences   └─────────────┴───────────────┴──────────────────┤
│ Thème / CV / Profil                                            │
└───────────────┴────────────────────────────────────────────────┘
```

Catalogue : Présentation, Disponibilité, Expériences, Formations, Certifications (si attestées), Stack, Expertises, Architecture, Botty, LeStudio, Portfolio, Workflow agentique, Activité GitHub, Changelog, Centres d'intérêt, Réseaux et CV. Les widgets secondaires peuvent rester dans la bibliothèque. Aucun pourcentage de maîtrise arbitraire, aucune métrique inventée.

## Interactions validées

| Action | Comportement |
|---|---|
| Drag depuis sidebar | Ajoute un widget |
| Drag depuis en-tête | Déplace au pixel près sans mode édition |
| Resize | Libre, avec taille minimale adaptée au contenu |
| Superposition | Autorisée ; aucune collision bloquante ni réorganisation automatique |
| Alignement | Guides intelligents et aimantation ; ne pas imposer de grille de placement |
| Menu contextuel | Ouvrir le détail, premier plan, avancer, reculer, arrière-plan, supprimer |
| Annuler/rétablir | Historique des manipulations de disposition |
| Préférences | Sauvegarde locale de disposition, thème ; réinitialisation de la composition |
| Widget plein écran | Vue agrandie / fermeture et retour au workspace |
| Mode présentation | Composition lisible et accès rapide aux informations |
| Notifications | Retours brefs sur les interactions |
| Mobile | Pile verticale, ajout/suppression/réordonnancement ; pas de superposition ni de resize libre |

Pas de duplication ni de raccourcis clavier avancés en V1 selon l'arbitrage précédent ; ceci n'exclut pas les contrôles clavier accessibles indispensables. Pas de zoom, déplacement de caméra, canvas infini ou défilement horizontal du workspace.

## Modales

Profil (photo réelle fournie, bio, liens, CV), contact (nom, e-mail, message, validation), détails projet/expérience/compétence, préférences. Gérer focus initial, piège de focus, fermeture Escape, retour du focus, libellés et erreurs accessibles. Aucun faux succès d'envoi : Formspree validé avec TanStack Form/Zod. Champs : nom/prénom, entreprise facultative, e-mail, objet, message. Activation après configuration du formulaire et de la confidentialité par le propriétaire ; repli sur liens de contact vérifiés si non configuré.

## Critères visuels et UX

1. Reproduire la hiérarchie et le caractère de la planche dans les deux thèmes ; contrôle humain sur captures réelles desktop et mobile.
2. Consultation immédiate des expériences, projets et compétences, accès évident au CV et au contact même sans manipuler les widgets.
3. Déplacement libre, resize, superposition et z-order sans perte de widget ; restauration du layout initial et persisté. Les widgets restent récupérables via la bibliothèque.
4. Largeur bornée ; stratégie de recalcul lors du changement de largeur et de la sidebar à spécifier/tester ; mobile lisible sans défilement horizontal.
5. Les contrôles essentiels sont accessibles sans glisser-déposer ; respecter focus, contraste, reduced motion et navigation clavier. Prévoir une action d'ajout au clic et un moyen accessible de déplacer/redimensionner.
6. Libellés FR/EN et contenus vérifiés. Aucune donnée fictive tirée de la maquette.

## Décisions techniques et vérifications restantes

React RND, Zustand/persist, disposition desktop + ordre mobile, react-i18next et Formspree sont validés. Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour le modèle, la persistance et le flux de contact.

- Prototyper les guides d'alignement, l'aimantation et le resize ; vérifier les tailles minimales, le recalcul de largeur, les états mobile et l'historique.
- Préciser le mode présentation, les textes et les visuels réels ; vérifier les fontes et leurs licences.
- Configurer le formulaire Formspree et la confidentialité avant activation ; aucun envoi réel en test automatisé.
- Enregistrer la planche approuvée dans le dépôt après mise à disposition du fichier. Les détails de la maquette restent une référence et non des données professionnelles vérifiées.
