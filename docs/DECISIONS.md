# Registre de décisions

Statut initial : propositions à valider. La présence de ce document sur une branche ne constitue pas une autorisation d'exécuter ou de publier.

| ID | Décision | Statut | Validation |
|---|---|---|---|
| DEC-001 | Portfolio statique, sans backend, BDD ni authentification | Proposée | #1 |
| DEC-002 | Next.js App Router, TypeScript, Tailwind ; UI et MDX selon besoin | Proposée | #1 |
| DEC-003 | GitHub Pages avec basePath adaptable ; domaine personnalisé facultatif | Proposée, éligibilité ouverte | #1, #14 |
| DEC-004 | Dépôt privé au cadrage ; aucune publication ou modification de visibilité sans accord | Proposée | #1, #4, #14 |
| DEC-005 | GitHub Issues et Projects comme backlog ; documentation dans Git | Proposée | #2, #3 |
| DEC-006 | Codex + GitHub Actions hébergés comme cible ; pas de n8n ni de runner local en V1 | Proposée, financement ouvert | #2, #7 |
| DEC-007 | Déclenchement workflow_dispatch par le propriétaire pour le pilote ; Ready n'est pas un mandat | Proposée | #2, #7 |
| DEC-008 | Agent sans jeton Git en écriture, publication contrôlée dans job séparé ; CI indépendante | Proposée | #2, #4, #7, #8 |
| DEC-009 | Branches de tâche, commits autonomes, aucune fusion agent ; main protégée avant pilote | Proposée, protection non vérifiée | #4 |
| DEC-010 | Aucun déploiement avant validation visuelle et activation humaine ; puis publication depuis main | Proposée | #8, #14 |

## Arbitrages ouverts avant exécution agent

1. Mode Codex : API payante avec budget accepté par le propriétaire, ou repli Cloud/CLI selon accès et quotas. Pas de clé ni de consommation avant décision.
2. Plan GitHub : vérifier protections sur dépôt privé et Pages. Si non éligible, choisir une alternative sans exposer le dépôt par défaut.
3. CI des PR générées : tester le comportement réel de GITHUB_TOKEN ; choisir une solution minimale permettant une CI liée au SHA exact, sans affaiblir les protections.
4. Design visuel, contenus, métriques et dépendances précises : décisions ultérieures dans Issues dédiées.

## Observations du 26 novembre 2026

- Dépôt privé, branche main initiale 32209f19bf94f421a567a192b16ee08ad4b60d1f ; protection signalée inactive lors de la consultation.
- 14 Issues créées ; le propriétaire confirme avoir rétabli le Kanban. Les statuts Projects ne sont pas accessibles via le connecteur actuel.
- Aucun workflow agent, CI ou déploiement créé ou exécuté dans ce cadrage.
