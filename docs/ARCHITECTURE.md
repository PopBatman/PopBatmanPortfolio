# Architecture V1 — proposition

Statut : à valider par le propriétaire. Issues #1 et #2. Date : 2026-11-26.
Ce document cadre la solution ; il n'autorise aucun agent, déploiement ou changement de visibilité.

## 1. Produit

Objectif : portfolio professionnel public, présentant les expertises FullStack, architecture et IA agentique, avec études de cas vérifiables (Botty, LeStudio, workflow agentique). Contact via Malt, LinkedIn et e-mail. Pas de vente en ligne, de comptes, de données métier ni d'API en V1.

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

### Routes et contenus

- / : proposition de valeur, expertises, projets phares, contact.
- /expertises/ : prestations et méthodes.
- /realisations/ : index ; /realisations/[slug]/ : études de cas.
- /parcours/ : expérience et formation publiables.
- /contact/ : liens externes et mailto.
- Laboratoire IA : extension ultérieure. Pas de formulaire serveur ni d'analytics en V1 sans décision distincte.

### Contraintes de publication

Utiliser output: 'export' et trailingSlash: true ; next build produit out/. Générer toutes les routes dynamiques au build (generateStaticParams). Pas de SSR à la demande, Server Actions ou optimisation d'images nécessitant un serveur. Préparer les images à l'avance ou utiliser un chargeur compatible.

Le dépôt actuel est PopBatman/PopBatmanPortfolio, privé. L'URL Pages par défaut serait https://popbatman.github.io/PopBatmanPortfolio/. Configurer basePath au build selon la destination ; vérifier liens, images, CSS et ressources publiques sous ce préfixe et à la racine pour un éventuel domaine personnalisé. Le pipeline publiera l'artefact out/ via Pages Actions, après autorisation. Le site n'est pas déployé à ce stade. Pages et protections sur un dépôt personnel privé exigent un plan GitHub éligible ; vérifier avant activation. Si nécessaire, envisager un dépôt public après audit du contenu et de l'historique, ou un hébergement alternatif. Pas de changement de visibilité automatique. Vérifier les conditions Pages pour un portfolio professionnel non transactionnel.

### Critères d'acceptation proposés

- Build statique reproductible ; toutes les routes et ressources accessibles, y compris sous le préfixe de publication.
- Responsive à 375, 768 et 1440 px ; navigation clavier, focus visible, contrastes et textes alternatifs ; objectif WCAG 2.2 AA sur les pages clés.
- Titres et descriptions uniques, métadonnées sociales, sitemap et URL canoniques cohérents avec l'URL finale ; pas de données confidentielles ni de statistiques inventées.
- Objectif Lighthouse mobile >= 90 en performance, accessibilité et SEO sur accueil et étude de cas (environnement de test documenté, résultats réels à relever ; score non équivalent à conformité WCAG).
- Contrôles CI : format/lint, typecheck, tests pertinents, build et smoke tests du rendu exporté. Validation visuelle humaine avant publication.

## 2. Chaîne agentique

GitHub est la source de vérité : Issues = contrats, Projects #4 = vue de pilotage, Git = code et documentation. Pas de n8n, Notion, VM ou serveur d'autorité en V1. Le propriétaire valide les décisions et reste seul responsable des fusions. ChatGPT propose et spécifie ; Codex implémente ; Actions orchestre et vérifie.

```text
Issue spécifiée → Ready → déclenchement explicite du propriétaire
    → agent (branche dédiée, pas de credentials Git en écriture)
    → patch + rapport → job de publication contrôlé
    → commit + PR → CI → revue/fusion humaine → déploiement autorisé depuis main
```

| Mode | Avantage | Contrainte | Avis |
|---|---|---|---|
| Codex Cloud | Pas d'infrastructure, authentification ChatGPT | Démarrage depuis l'interface, quotas/accès à vérifier | Repli pour un pilote sans API |
| Codex CLI local | Réutilise l'environnement existant | Machine disponible, orchestration et sécurité locales | Repli si coût API non accepté |
| Action officielle openai/codex-action sur runner GitHub | Exécution répétable sans VM | Clé API et consommation distincte ; contrôle de la CI et des permissions | Cible proposée, non activée |

### Contrat et déroulement V1

- Issue : objectif, périmètre/hors périmètre, contraintes, critères d'acceptation, tests, dépendances et Definition of Done.
- Déclencheur initial proposé : workflow_dispatch exécuté par le propriétaire sur le workflow de main, avec numéro d'Issue et confirmation explicite. Vérifier acteur, branche, état ouvert et contrat approuvé, enregistrer la révision du contrat. Ready seul n'autorise jamais une exécution. Une tâche à la fois, durée et consommation bornées ; aucune boucle automatique de retry.
- Branches feature/PORT-XXX, fix/PORT-XXX, chore/PORT-XXX ; plusieurs commits permis sans validation intermédiaire. Pas de branche develop permanente.
- Agent : checkout de la base autorisée, permissions contents: read, persist-credentials: false ; action officielle épinglée à un SHA vérifié, sandbox workspace, secret API limité à l'invocation via proxy. Pas de secrets en environnement global, ni de jeton de publication dans le job agent. Les contenus de l'Issue et du code ne peuvent pas étendre son mandat.
- Publication : job séparé, permissions minimales contents: write / pull-requests: write si nécessaires. Contrôler chemin de branche, base, périmètre et patch avant application ; refuser les fichiers de sécurité, workflows, permissions, secrets et changements hors contrat. Ne pas exécuter de scripts générés avec des credentials d'écriture. Un échec laisse main intacte et donne lieu à un rapport Blocked.
- CI indépendante : pull_request, lecture seule, pas de secret API, tests sur le code de la PR. Le jeton GITHUB_TOKEN peut créer des runs de PR soumis à approbation ; vérifier sur le pilote. Pour une CI sans approbation intermédiaire, évaluer d'abord une CI explicite par workflow_dispatch avec ref contrôlée et vérifier que le résultat protège le SHA exact ; sinon GitHub App à permissions limitées. Pas de PAT large ajouté par défaut.
- Protection main : exiger PR et contrôles CI ; interdire force-push et suppression ; aucun bypass agent. Ne pas exiger une approbation formelle impossible en solo ; propriétaire fusionne après revue des preuves. Vérifier l'efficacité de la protection avant toute exécution agent en écriture. En cas d'inéligibilité du dépôt privé, bloquer le lancement et arbitrer.
- Déploiement : workflow séparé et permissions Pages limitées, uniquement depuis main après activation par le propriétaire. PR et agent ne peuvent pas déployer.

### États

Backlog = identifié ; Ready = contrat complet et dépendances levées ; In Progress = exécution autorisée ; Review = PR et contrôles ; Done = acceptée et fusionnée si applicable ; Blocked = cause et action requise documentées. Synchronisation automatique des états avancés à confirmer après le pilote ; pas de système supplémentaire en V1.

### Pilote et preuves

Issue bénigne, modification Markdown, branche/commit/PR reliés à l'Issue, CI réussie et test négatif contrôlé, preuve que main est inchangée jusqu'à fusion humaine, coût/durée observés. Échec : conserver le diagnostic, aucune fusion automatique ; nouvelle exécution autorisée explicitement. Après succès, envisager une file de tâches Ready ; aucune autonomie en lot avant validation.

## Références

- Next.js : https://nextjs.org/docs/app/guides/static-exports
- Next.js basePath : https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
- GitHub Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Limites Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Protection : https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- Déclenchements : https://docs.github.com/en/actions/concepts/security/github_token
- Action Codex : https://learn.chatgpt.com/docs/github-action
- Codex en CI : https://learn.chatgpt.com/docs/non-interactive-mode
