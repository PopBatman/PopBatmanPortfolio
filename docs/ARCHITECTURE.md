# Architecture V1

Socle validé par fusion de la PR #15. Évolution UX et choix des bibliothèques approuvés lors des ateliers (#10, #11).
Ce document cadre la solution ; il n'autorise aucun agent, déploiement ou changement de visibilité.

## 1. Produit

Objectif : portfolio professionnel public, présentant les expertises FullStack, architecture et IA agentique, avec études de cas vérifiables (Botty, LeStudio, workflow agentique). Contact via Malt, LinkedIn, GitHub, e-mail et formulaire Formspree. Pas de vente en ligne, de comptes, de données métier ni d'API applicative personnelle en V1.

```text
Contenus versionnés + composants React
              ↓ next build
       HTML/CSS/JS (out/)
              ↓ GitHub Actions (déploiement)
       Hébergement statique
              ↓
           Visiteur
```

| Élément | Proposition | Justification |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Compétences existantes, routes et métadonnées statiques |
| Design | Tailwind CSS | Styles et responsive cohérents |
| UI | shadcn/ui, Lucide au besoin | Ne copier/installer que les composants utilisés |
| Contenus | Markdown/MDX versionné | Études de cas révisables sans CMS ; MDX uniquement si utile |
| Animation | CSS d'abord, Motion si nécessaire | Limiter le JS et respecter prefers-reduced-motion |
| Dépendances | npm + lockfile, Node LTS épinglé au bootstrap | Build reproductible |
| Tests | ESLint, TypeScript, Playwright ; Vitest pour logique testable | Tests utiles, pas de couverture artificielle |
| Publication | GitHub Pages si éligible | Pas de serveur à maintenir |
| Données | Aucun backend, aucune base, aucun compte | Hors périmètre |

Alternative : Astro ou HTML statique seraient plus légers ; Next.js est proposé pour rester dans l'écosystème React déjà maîtrisé. Ne pas ajouter de framework secondaire.

### Interface et contenus

La maquette validée remplace la navigation multi-pages initialement proposée par un dashboard unique. La sidebar est une bibliothèque et une barre d'actions, pas un menu de navigation. Le détail des interactions et du design est dans [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

- Route principale : workspace et composition initiale, contenus consultables sans personnalisation.
- Widgets : catalogue de composants React, contenu statique versionné. Partie interactive côté client ; données de profil disponibles au rendu initial pour SEO et lisibilité.
- Modales : profil, contact, détail des projets/expériences, préférences ; aucun serveur applicatif.
- État local : disposition, dimensions, ordre de superposition, thème et langue ; persistance locale dans le navigateur. Pas de compte ni de synchronisation distante.
- Responsive : workspace libre desktop/tablette compatible, pile verticale mobile ; pas de scroll horizontal ni canvas infini.
- Les routes statiques supplémentaires de partage/SEO ne sont pas un choix validé ; décider seulement si nécessaire sans introduire une navigation concurrente.
- Moteur React RND, état Zustand et contact Formspree validés en atelier ; activation progressive dans les tâches dédiées. Aucun backend personnel.

### Architecture du workspace — décisions de l'atelier

| Responsabilité | Choix validé |
|---|---|
| Déplacement et redimensionnement | React RND ; validation par prototype ciblé |
| État client | Zustand, sélecteurs ciblés |
| Persistance | Zustand persist / localStorage |
| Internationalisation | react-i18next, dictionnaires locaux FR/EN |
| Formulaire | TanStack Form et Zod |
| Livraison du message | Formspree, endpoint public à configurer par le propriétaire |
| Données distantes | TanStack Query uniquement si une source distante justifiée est introduite |

Ne pas installer les dépendances avant leur tâche. React RND gère le drag/resize des widgets présents dans le canvas ; l'ajout depuis la bibliothèque, les guides et l'aimantation nécessitent une couche d'intégration spécifique. Ne pas substituer une grille de placement, ni bloquer les superpositions. CSS z-index pour la profondeur, CSS container queries si utiles pour le contenu adaptable. Les détails d'implémentation restent à valider par un prototype, pas de changement de bibliothèque sans accord.

```text
WorkspaceShell
├── Sidebar / WidgetLibrary
├── Toolbar
├── Canvas
│   ├── AlignmentGuides
│   └── WidgetFrame (React RND) → WidgetContent (registre par type)
├── MobileStack
└── ModalHost
    ↕
Zustand : workspace / preferences / history / interface
    ↳ persist : données durables uniquement
```

Le registre de widgets sépare le contenu du moteur de disposition : type, identifiant stable, catégorie, tailles minimales et composant. Aucun pourcentage de maîtrise ni donnée personnelle fictive publiée. Sur desktop, coordonnées en pixels relatives au canvas, dimensions et ordre de profondeur ; sur mobile, ordre indépendant et dimensions automatiques. Les instances actives sont communes aux formats. Pas de duplication en V1. La liste mobile n'écrase jamais le layout desktop, même lors d'un redimensionnement ou d'une réduction de la sidebar. Mesurer la largeur réelle du canvas et borner le rendu, sans perte de la disposition sauvegardée ; si une largeur est incompatible avec les tailles minimales, utiliser le mode vertical. Tester les variations de largeur avant de figer les seuils.

État persistant : widgets actifs, layout desktop, ordre mobile, thème, langue et état de la sidebar. État éphémère : sélection, modales, notifications et undo/redo. Un déplacement ou resize complet = une transaction et une entrée d'historique ; aucun enregistrement à chaque mouvement. Ajouter, supprimer, réordonner et changer de plan doivent être annulables. Stockage versionné, validation des données restaurées, repli sûr vers valeurs initiales si données incompatibles ou stockage indisponible. Hydratation compatible export statique : rendu initial déterministe et restauration côté navigateur après montage, sans écrasement prématuré du stockage. Limite d'historique proposée : 50 transactions, à vérifier. Le reset de disposition ne doit pas modifier la langue ou le thème sans action explicite ; confirmation avant reset.

Internationalisation : dictionnaires locaux par domaine, français comme fallback ; préférence explicite sauvegardée prioritaire sur langue du navigateur. Changement instantané sans navigation, ni perte de layout. Rendu statique initial FR, document lang mis à jour côté client. Une seule URL en V1 : référencement indépendant EN limité. Prévoir des textes réels relus, pas de traduction automatique à l'exécution.

Contact : modale accessible, nom/prénom, entreprise facultative, e-mail, nature de la prise de contact, objet, message. Validation TanStack Form/Zod ; état d'envoi, erreur et succès distincts. Formspree reçoit uniquement les champs du formulaire après action volontaire ; indiquer le destinataire/traitement, lien de confidentialité, antispam compatible. Aucun secret privé dans le navigateur, aucun compte ni endpoint créé par l'agent. L'endpoint Formspree est un identifiant public de formulaire fourni par le propriétaire (configuration de build ou fichier de configuration public), pas une clé secrète. Sans endpoint valide, désactiver l'envoi et proposer des liens de contact vérifiés ; jamais de faux succès. Tests automatisés avec requête simulée, aucune soumission réelle sans autorisation. Vérifier la rétention, les conditions, le quota et la conformité de Formspree avant la mise en ligne.

Police locale et assets optimisés pour éviter les dépendances réseau au runtime ; vérifier licences et disponibilités lors du bootstrap. Aucun token GitHub côté client. L'activité GitHub repose sur un snapshot statique de données publiques actualisé au build ; TanStack Query n'est pas obligatoire en V1. L'horloge locale est affichée côté client.

### Contenus et architectures interactives — atelier éditorial

Voir [CONTENT.md](CONTENT.md). Le contenu statique typé et versionné est partagé par les widgets et fiches (références stables, bilinguisme préparé, validation humaine des faits et assets). React Flow est approuvé pour les diagrammes des architectures et études de cas, sans remplacer React RND ; installable seulement dans #35 après vérification de compatibilité. Prévoir une représentation textuelle accessible et isoler les gestes du diagramme du canvas. CV : trois variantes FR/EN, PDFs approuvés et manifestes de fichiers ; génération automatique au build non arbitrée.

Activité GitHub : collecte quotidienne des seules données publiques lors d'un build statique déclenché par GitHub Actions. Pas de jeton client, pas d'accès à des données privées ni de push automatique sur main ; fixtures de CI, snapshot daté de repli ou état indisponible. Le workflow planifié de reconstruction/publication ne peut être activé qu'après validation de #14 et autorisation explicite. Cette extension reste du build/déploiement et ne déclenche pas d'agent. Le Changelog demeure versionné.

### Contraintes de publication

Utiliser output: 'export' et trailingSlash: true ; next build produit out/. Générer toutes les routes dynamiques au build (generateStaticParams). Pas de SSR à la demande, Server Actions ou optimisation d'images nécessitant un serveur. Préparer les images à l'avance ou utiliser un chargeur compatible.

Le dépôt actuel est PopBatman/PopBatmanPortfolio, privé. L'URL Pages par défaut serait https://popbatman.github.io/PopBatmanPortfolio/. Configurer basePath au build selon la destination ; vérifier liens, images, CSS et ressources publiques sous ce préfixe et à la racine pour un éventuel domaine personnalisé. Le pipeline publiera l'artefact out/ via Pages Actions, après autorisation. Le site n'est pas déployé à ce stade. Pages et protections sur un dépôt personnel privé exigent un plan GitHub éligible ; vérifier avant activation. Si nécessaire, envisager un dépôt public après audit du contenu et de l'historique, ou un hébergement alternatif. Pas de changement de visibilité automatique. Vérifier les conditions Pages pour un portfolio professionnel non transactionnel.

### Critères d'acceptation proposés

- Build statique reproductible ; toutes les routes et ressources accessibles, y compris sous le préfixe de publication.
- Responsive à 375, 768 et 1440 px ; navigation clavier, focus visible, contrastes et textes alternatifs ; objectif WCAG 2.2 AA sur les vues et interactions clés.
- Titres et descriptions uniques, métadonnées sociales, sitemap et URL canoniques cohérents avec l'URL finale ; pas de données confidentielles ni de statistiques inventées.
- Objectif Lighthouse mobile >= 90 en performance, accessibilité et SEO sur le dashboard et les vues de détail pertinentes (environnement de test documenté, résultats réels à relever ; score non équivalent à conformité WCAG).
- Contrôles CI : format/lint, typecheck, tests pertinents, build et smoke tests du rendu exporté. Validation visuelle humaine avant publication.

## 2. Chaîne agentique

GitHub est la source de vérité : Issues = contrats, Projects #4 = vue de pilotage, Git = code et documentation. ChatGPT cadre et rédige les tickets ; Codex implémente avec l'abonnement ChatGPT du propriétaire, dans la limite de ses quotas ; GitHub héberge le code, exécute les contrôles et déploie. Le propriétaire conserve la validation et la fusion.

Contrainte validée le 26 novembre 2026 : pas de clé API OpenAI, pas de facturation API distincte, pas de Notion, n8n, VM personnelle, runner auto-hébergé ou service d'autorité. Aucun jeton de session ChatGPT ne doit être exporté ou stocké dans GitHub Actions. Actions ne sert qu'à la CI/CD.

```text
ChatGPT → Issue GitHub → Projects (Backlog)
    → contrat Ready → autorisation explicite
    → Codex Cloud (compte ChatGPT)
    → diff, tests, branche/commit/PR selon capacités natives
    → GitHub Actions CI → revue et fusion humaines
    → GitHub Pages (après activation)
```

### Modes et validation expérimentale

| Mode | Décision | Limite |
|---|---|---|
| Déclenchement natif Codex par mention dans une Issue GitHub | Hypothèse à tester en priorité | Intégration Cloud Legacy annoncée en voie de dépréciation ; disponibilité et identité du déclencheur à vérifier |
| Codex Cloud actuel, environnement GitHub réutilisable, lancement explicite via l'interface | Socle durable V1 et repli immédiat | Démarrage et ouverture de PR éventuellement manuels, quotas selon compte |
| Codex CLI connecté au compte ChatGPT | Repli facultatif, hors V1 | Nécessite un poste disponible ; ne pas installer de runner |
| Action openai/codex-action | Exclue | La configuration CI officielle repose sur une clé API séparée |

Le lancement d'une tâche GitHub par mention a été annoncé par OpenAI le 22 octobre 2025. La documentation actuelle identifie l'intégration GitHub comme reposant sur les environnements Legacy dont la dépréciation est prévue. Ne pas en faire un prérequis durable. Le connecteur GitHub de cette conversation peut écrire les Issues et les PR, mais n'offre pas d'action directe de lancement Codex Cloud ; l'identité d'un commentaire créé par ce connecteur et sa reconnaissance par Codex doivent être testées séparément. Une mention publiée par le propriétaire est le premier test, pas une promesse de fonctionnement.

### Contrat et déroulement V1

- Issue : objectif, périmètre/hors périmètre, contraintes, critères d'acceptation, tests, dépendances et Definition of Done.
- Ready signifie spécifiée, pas autorisée à démarrer. Le propriétaire autorise explicitement le pilote depuis son compte. Une tâche à la fois ; pas de déclenchement automatique sur toute création d'Issue, pas de boucle de retry.
- Connecter uniquement le dépôt concerné à Codex ; préparer un environnement Cloud minimal et, si disponible, la configuration Legacy native nécessaire aux mentions. Aucun secret de production, aucun accès réseau inutile. Ne pas donner de jeton personnel supplémentaire à l'agent.
- Codex travaille sur une branche feature/PORT-XXX, fix/PORT-XXX ou chore/PORT-XXX. Plusieurs commits de tâche sont permis. Ne jamais pousser sur main, fusionner, modifier les protections, les workflows de sécurité ou les permissions. Le mode actuel éprouvé est un lancement manuel dans Codex Cloud, commit et push sur branche dédiée, puis création de la PR par ChatGPT via le connecteur GitHub (ou par le propriétaire). Le pilote #17/#20 a confirmé ce parcours : création native de PR refusée (Forbidden), mention GitHub en erreur de résolution d'environnement. Ne pas relancer l'intégration native sans hypothèse nouvelle (#7).
- La protection GitHub de main est nécessaire avant toute délégation en écriture. Le Ruleset Protect main (28176368) a été vérifié actif le 26/11/2026 : PR obligatoire, squash uniquement, conversations résolues, suppression et force-push interdits, aucun bypass. Le check Validation est obligatoire depuis la fusion #16 ; test négatif #19 échoué et non fusionné, pilote #20 réussi et fusionné. Aucun test négatif de push direct n'a été effectué. Ne pas imposer d'approbation formelle impossible en solo. Le propriétaire revoit le résultat et fusionne. Les instructions AGENTS.md ne remplacent pas la protection technique. Avec zéro approbation requise, ce Ruleset ne garantit pas à lui seul la restriction de fusion au propriétaire.
- CI indépendante : pull_request, lecture seule, sans secret API ni secret de production. Vérifier le déclenchement réel pour une PR issue de Codex et la présence des contrôles sur le commit de tête. Si un clic d'approbation est nécessaire, l'assumer et le documenter avant d'envisager une solution supplémentaire.
- Déploiement séparé depuis main uniquement, après activation et validation visuelle humaines. Pas de déploiement depuis Codex ou une PR.

### États

Backlog = identifié ; Ready = contrat complet et dépendances levées ; In Progress = exécution autorisée ; Review = PR et contrôles ; Done = acceptée et fusionnée si applicable ; Blocked = cause et action requise. Les statuts peuvent être mis à jour manuellement au départ. N'automatiser les transitions avancées que si une fonction native suffit.

### Pilote et preuves

1. Autoriser le dépôt dans Codex et vérifier l'environnement Cloud et les droits. Préparer main protégée, AGENTS.md et CI documentaire.
2. Créer une Issue pilote bénigne, avec un fichier Markdown distinct et un résultat attendu vérifiable.
3. Tester le déclenchement natif par le propriétaire si disponible. Observer réaction, lien de tâche Codex, modifications, tests et possibilité de créer une PR ; sinon démarrer la tâche depuis Codex Cloud avec le contrat exact.
4. Vérifier branche, commit, PR, CI, main inchangée jusqu'à fusion humaine. Mesurer les interventions manuelles, durée et éventuelle consommation de quota ; aucune dépense API.
5. Si le test natif réussit, tester ensuite sur une nouvelle tâche bénigne si un commentaire du connecteur ChatGPT peut déclencher Codex après autorisation explicite. En cas d'échec, garder le lancement humain. Ne pas chercher à contourner l'authentification.
6. Conclusion : distinguer chaîne intégrée prouvée avec lancement humain, déclenchement natif prouvé, déclenchement ChatGPT → Codex prouvé. Ne qualifier la dernière chaîne de bout en bout que si les preuves existent.

## Références

- Next.js : https://nextjs.org/docs/app/guides/static-exports
- Next.js basePath : https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
- GitHub Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Limites Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Protection : https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- Déclenchements : https://docs.github.com/en/actions/concepts/security/github_token
- Codex avec ChatGPT : https://help.openai.com/fr-fr/articles/11369540-using-codex-with-your-chatgpt-plan
- Cloud actuel : https://learn.chatgpt.com/docs/cloud
- Environnements Cloud : https://learn.chatgpt.com/docs/environments/cloud-environments
- Cloud Legacy : https://learn.chatgpt.com/docs/environments/cloud-environment
- Annonce mentions GitHub (22/10/2025) : https://learn.chatgpt.com/docs/changelog
- Cas Issue vers PR : https://learn.chatgpt.com/use-cases/issue-to-tested-pr
- Action API exclue : https://learn.chatgpt.com/docs/github-action
