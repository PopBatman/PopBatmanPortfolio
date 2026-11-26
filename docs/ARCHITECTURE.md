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
- Codex travaille sur une branche feature/PORT-XXX, fix/PORT-XXX ou chore/PORT-XXX. Plusieurs commits de tâche sont permis. Ne jamais pousser sur main, fusionner, modifier les protections, les workflows de sécurité ou les permissions. Si le mode Cloud fournit seulement un diff, le propriétaire peut créer la PR depuis l'interface native ; enregistrer ce geste dans le bilan du pilote.
- La protection GitHub de main est nécessaire avant toute délégation en écriture : exiger une PR et les contrôles CI disponibles, interdire force-push et suppression, aucun bypass agent. Ne pas imposer d'approbation formelle impossible en solo. Le propriétaire revoit le résultat et fusionne. Les instructions AGENTS.md ne remplacent pas la protection technique.
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
