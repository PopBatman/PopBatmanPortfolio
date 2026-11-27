# Workflow V1

| État | Condition |
|---|---|
| Backlog | Besoin identifié |
| Ready | Contrat complet et dépendances levées |
| In Progress | Exécution explicitement autorisée |
| Review | Diff/PR et rapport disponibles |
| Done | Acceptation humaine et fusion si applicable |
| Blocked | Cause et action requise documentées |

ChatGPT crée les Issues. Le propriétaire autorise les tâches. Codex Cloud exécute ; GitHub Actions réalise les contrôles indépendants. Le propriétaire fusionne (squash) après revue. Le déploiement n'est activé qu'après accord distinct.

Ready n'est pas un déclencheur. Le lancement depuis Codex Cloud est le socle. Le pilote #17/#20 a prouvé le lancement manuel Codex Cloud, le push sur une branche dédiée, la création de PR via ChatGPT, la CI et la fusion humaine. Le déclenchement natif GitHub est bloqué par la résolution d'environnement et la création native de PR par Forbidden ; suivi #7. Ce mode de repli est le workflow V1, sans prétendre à une autonomie intégrale.

## Préconditions du pilote
- Accès en lecture Cloud et correspondance du commit : vérifiés le 26/11/2026.
- Ruleset actif sur main, sans bypass : vérifié via GitHub le 26/11/2026. PR obligatoire, squash uniquement, résolution des conversations, protection contre suppression et force-push. Aucun test de push direct effectué. Check Validation obligatoire et vérifié ; test négatif #19 non fusionné.
- Fusion humaine : règle de processus, non garantie par le seul Ruleset (0 approbation obligatoire).
- AGENTS.md et documentation fusionnés par le propriétaire ; CI documentaire opérationnelle.
- Issue pilote bénigne explicitement autorisée, une tâche à la fois.

## Pilote
Le résultat doit relier l'Issue, le lancement, le diff, les tests, le commit, la PR et la CI. Mesurer les gestes manuels et les quotas ; main reste intacte jusqu'à la fusion humaine. En cas de blocage, documenter et arrêter ; pas de retry automatique.

## Aperçu GitHub Pages pour la revue UX/UI

Le workflow `Pages preview` est prévu pour les pushes sur `main` et les lancements manuels depuis `main`. La CI de pull request conserve son contrôle obligatoire `Validation`. Une fois l’aperçu autorisé, le workflow Pages exécute les vérifications npm et Playwright avant de transférer le seul dossier `out/`, construit pour `/PopBatmanPortfolio/`. Les exécutions de publication sont sérialisées. GitHub Actions peut remplacer une exécution en attente par une plus récente.

### Activation et autorisation

1. Le propriétaire vérifie l’éligibilité du dépôt privé à GitHub Pages et l’audience réelle du site. Un dépôt privé peut produire un site public. Le propriétaire examine l’export et approuve explicitement la visibilité et le contenu de l’aperçu avant toute publication. La balise `noindex, nofollow` donne une consigne aux moteurs de recherche. L’accès au site dépend des paramètres GitHub Pages.
2. Après accord, le propriétaire sélectionne **Settings → Pages → Build and deployment → Source → GitHub Actions**, en conservant la visibilité privée du dépôt. Dans **Settings → Environments → github-pages**, il limite la branche de déploiement à `main` et configure la revue humaine si son plan propose cette protection.
3. Pour autoriser les déploiements, le propriétaire crée la variable de dépôt `PORTFOLIO_PREVIEW_ENABLED` avec la valeur `true` sous **Settings → Secrets and variables → Actions → Variables**. Tant que cette variable est absente ou désactivée, le build Pages et le job de déploiement sont ignorés. Après activation, un push sur `main` ou **Actions → Pages preview → Run workflow → main** lance la validation et la publication, sous réserve des protections de l’environnement.

### Retour arrière et retrait

- **Retour arrière** — Relever le dernier commit validé dans l’historique des déploiements. Préparer une PR qui annule les changements concernés, faire passer `Validation` et fusionner sur `main` après revue. Le workflow republie cette version depuis `main`.
- **Retrait** — Désactiver la variable (`false` ou suppression), puis annuler les exécutions Pages actives ou en attente. Sous **Settings → Pages**, ouvrir le menu du site et sélectionner **Unpublish site** pour retirer le site déjà publié. [Documentation GitHub sur le retrait](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site)

## Références
Architecture et décisions : [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md). Le backlog GitHub reste la référence pour les dépendances et l'avancement.
