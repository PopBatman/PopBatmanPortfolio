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

Ready n'est pas un déclencheur. Le lancement depuis Codex Cloud est le socle. Le déclenchement natif GitHub, puis depuis le connecteur ChatGPT, sera testé séparément ; aucune automatisation intégrale n'est déclarée avant preuve.

## Préconditions du pilote
- Accès en lecture Cloud et correspondance du commit : vérifiés le 26/11/2026.
- Ruleset actif sur main, sans bypass : vérifié via GitHub le 26/11/2026. PR obligatoire, squash uniquement, résolution des conversations, protection contre suppression et force-push. Aucun test de push direct effectué. CI obligatoire à configurer après création du check.
- Fusion humaine : règle de processus, non garantie par le seul Ruleset (0 approbation obligatoire).
- AGENTS.md et documentation fusionnés par le propriétaire ; CI documentaire opérationnelle.
- Issue pilote bénigne explicitement autorisée, une tâche à la fois.

## Pilote
Le résultat doit relier l'Issue, le lancement, le diff, les tests, le commit, la PR et la CI. Mesurer les gestes manuels et les quotas ; main reste intacte jusqu'à la fusion humaine. En cas de blocage, documenter et arrêter ; pas de retry automatique.

## Références
Architecture et décisions : [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md). Le backlog GitHub reste la référence pour les dépendances et l'avancement.
