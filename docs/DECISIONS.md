# Registre de décisions

Statut : contrainte d'abonnement confirmée par le propriétaire le 26 novembre 2026 ; autres propositions à valider. La présence de ce document sur une branche ne constitue pas une autorisation d'exécuter ou de publier.

| ID | Décision | Statut | Validation |
|---|---|---|---|
| DEC-001 | Portfolio statique, sans backend, BDD ni authentification | Proposée | #1 |
| DEC-002 | Next.js App Router, TypeScript, Tailwind ; UI et MDX selon besoin | Proposée | #1 |
| DEC-003 | GitHub Pages avec basePath adaptable ; domaine personnalisé facultatif | Proposée, éligibilité ouverte | #1, #14 |
| DEC-004 | Dépôt privé au cadrage ; aucune publication ou modification de visibilité sans accord | Proposée | #1, #4, #14 |
| DEC-005 | GitHub Issues et Projects comme backlog ; documentation dans Git | Proposée | #2, #3 |
| DEC-006 | Codex via abonnement ChatGPT exclusivement ; pas de clé API, n8n, VM ou runner local en V1. GitHub Actions uniquement CI/CD | Validée par le propriétaire ; accès Cloud en lecture vérifié, quota restant inconnu | #2, #7 |
| DEC-007 | Tester la mention native GitHub avec le propriétaire ; repli Cloud actuel avec lancement humain ; Ready n'est pas un mandat | Proposée, test requis | #2, #7, #9 |
| DEC-008 | Intégration GitHub native de Codex, accès limité au dépôt ; aucun jeton ChatGPT exporté, CI indépendante | Proposée | #2, #4, #7, #8 |
| DEC-009 | Branches de tâche, commits autonomes, aucune fusion agent ; main protégée avant pilote | Ruleset vérifié actif ; CI et restriction de fusion à vérifier | #4 |
| DEC-010 | Aucun déploiement avant validation visuelle et activation humaine ; puis publication depuis main | Proposée | #8, #14 |

## Arbitrages ouverts avant exécution agent

1. Accès Codex Cloud au dépôt privé vérifié en lecture ; tester l'intégration GitHub Legacy et son identité de déclenchement. Ne pas dépendre durablement du Legacy. Le déclenchement par le connecteur ChatGPT reste une hypothèse ; lancement humain dans Cloud si non disponible.
2. Protection du dépôt privé confirmée par Ruleset actif ; vérifier l'éligibilité Pages avant publication. Si non éligible, choisir une alternative sans exposer le dépôt par défaut.
3. CI des PR Codex : vérifier le déclenchement et les contrôles liés au SHA exact ; documenter les éventuelles interventions manuelles avant toute complexification.
4. Design visuel, contenus, métriques et dépendances précises : décisions ultérieures dans Issues dédiées.

## Observations du 26 novembre 2026

- Dépôt privé, branche main initiale 32209f19bf94f421a567a192b16ee08ad4b60d1f ; protection signalée inactive lors de la consultation.
- 14 Issues créées ; le propriétaire confirme avoir rétabli le Kanban. Les statuts Projects ne sont pas accessibles via le connecteur actuel.
- Aucun workflow agent, CI ou déploiement créé ou exécuté dans ce cadrage.

- Contrainte ajoutée : abonnement ChatGPT uniquement ; pas d'action Codex avec clé API. Un test Cloud de lecture a depuis réussi ; aucune tâche Codex en écriture lancée à ce stade.

## Preuves de connexion et de protection (26/11/2026)

- Test Codex Cloud communiqué par le propriétaire : branche temporaire work, /workspace/PopBatmanPortfolio, README seul, commit 32209f19bf94f421a567a192b16ee08ad4b60d1f (Initial commit). Correspondance SHA et README vérifiée via GitHub. Aucun commit ni PR créé par ce test.
- Ruleset https://github.com/PopBatman/PopBatmanPortfolio/rules/28176368 vérifié actif et ciblant ~DEFAULT_BRANCH ; main protégée ; bypass vide ; règles deletion, pull_request (0 approbation, conversations résolues, squash uniquement), non_fast_forward.
- Aucun test négatif de push direct ; aucune garantie technique de fusion réservée au propriétaire avec 0 approbation. Les checks requis seront configurés après la CI. Pas de développement agent en écriture avant le bootstrap et la validation de ces limites.

## Décisions UX/UI — atelier et maquette approuvés (#10, #11)

| ID | Décision | Statut |
|---|---|---|
| DEC-011 | Développeur polyvalent, recruteurs, style éditorial industriel, jaune #FFD600, deux thèmes, typographie industrielle, widgets uniformes | Validée visuellement par le propriétaire |
| DEC-012 | Dashboard unique, sidebar bibliothèque rétractable et actions, modales, pas de navigation multi-dashboard | Validée |
| DEC-013 | Drag/resize permanent, superposition libre, largeur bornée et scroll vertical, gestion du z-order et mobile vertical | Validée |
| DEC-014 | Guides/aimantation, sauvegarde locale, reset, undo/redo, plein écran, recherche, FR/EN et mode présentation | Validée en atelier |
| DEC-015 | React RND comme moteur drag/resize ; guides, aimantation et ajout depuis la sidebar complétés localement | Validée ; prototype requis |

Le système de design est décrit dans [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). La maquette approuvée n'est pas un prototype fonctionnel. Les valeurs techniques non explicitement fixées restent des propositions à vérifier.

## Décisions techniques de l'atelier (27/11/2026)

| ID | Décision | Statut |
|---|---|---|
| DEC-016 | Zustand + persist pour état client, historique et stockage local ; TanStack selon besoins réels | Validée |
| DEC-017 | Widgets actifs communs, dispositions desktop et ordre mobile distincts, dimensions mobiles automatiques (option B) | Validée |
| DEC-018 | react-i18next, FR/EN, changement instantané sans changement d'URL, préférence locale | Validée |
| DEC-019 | Formspree pour le contact, TanStack Form + Zod ; aucun backend personnel | Validée ; endpoint et conformité à configurer |
| DEC-020 | Lancement Codex Cloud manuel, push sur branche dédiée, PR assistée par ChatGPT, CI, fusion humaine | Parcours éprouvé #17/#20 ; intégration native bloquée #7 |

Paramètres d'implémentation à affiner par prototype : seuils responsive, tailles minimales, algorithme des guides, limite d'historique (50 proposée), données réelles, disponibilité des fontes et planche graphique versionnée. Aucun compte Formspree n'a été créé et aucun endpoint n'a été fourni. La décision de publier, modifier la visibilité du dépôt ou activer une soumission réelle est distincte.

## Décisions éditoriales — douze ateliers approuvés (27/11/2026)

| ID | Décision | Statut |
|---|---|---|
| DEC-021 | Positionnement hybride, disponibilité CDI/freelance France/international, timeline détaillée, stack contextualisée, expertises prouvées | Validée ; données réelles à confirmer |
| DEC-022 | Études de cas et diagrammes interactifs React Flow ; transparence sur les contributions humaines et assistées par IA | Validée ; intégration dans #35 |
| DEC-023 | Deux widgets Activité GitHub et Changelog ; données publiques au build et reconstruction quotidienne via Actions après autorisation de publication | Validée ; #36 et #14 ; aucun push automatique sur main, aucun agent |
| DEC-024 | Formations initiales/continues, passions et engagements ; trois variantes de CV consultables/téléchargeables en FR/EN | Validée ; PDFs à fournir/valider ; génération automatique non arbitrée |
| DEC-025 | Contact centralisé : LinkedIn, GitHub, Malt, e-mail, Formspree, nature de la prise de contact obligatoire | Validée ; coordonnées, endpoint et confidentialité à confirmer |

Voir [CONTENT.md](CONTENT.md). Les ateliers valident les concepts et le périmètre, pas la véracité de dates, diplômes, métriques, captures, liens ou informations professionnelles spécifiques. Les données et formulations finales doivent être approuvées. Le modèle typé, le découpage en six tâches et les mécanismes de repli sont des choix d'implémentation proposés dans les contrats. Aucune exécution, activation de schedule, publication ou ouverture du dépôt n'est autorisée par cette documentation.

## Livraison DEV-005 (27/11/2026)

DEC-016/017 : Zustand persist v1, historique limité à 50 transactions en mémoire et reset de disposition annulable livrés par #39, CI verte. Voir ARCHITECTURE.md pour le modèle concret et les limites. La préférence de langue est préparée mais l'internationalisation demeure #26.
