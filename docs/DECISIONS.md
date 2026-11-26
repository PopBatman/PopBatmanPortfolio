# Registre de décisions

Statut : contrainte d'abonnement confirmée par le propriétaire le 26 novembre 2026 ; autres propositions à valider. La présence de ce document sur une branche ne constitue pas une autorisation d'exécuter ou de publier.

| ID | Décision | Statut | Validation |
|---|---|---|---|
| DEC-001 | Portfolio statique, sans backend, BDD ni authentification | Proposée | #1 |
| DEC-002 | Next.js App Router, TypeScript, Tailwind ; UI et MDX selon besoin | Proposée | #1 |
| DEC-003 | GitHub Pages avec basePath adaptable ; domaine personnalisé facultatif | Proposée, éligibilité ouverte | #1, #14 |
| DEC-004 | Dépôt privé au cadrage ; aucune publication ou modification de visibilité sans accord | Proposée | #1, #4, #14 |
| DEC-005 | GitHub Issues et Projects comme backlog ; documentation dans Git | Proposée | #2, #3 |
| DEC-006 | Codex via abonnement ChatGPT exclusivement ; pas de clé API, n8n, VM ou runner local en V1. GitHub Actions uniquement CI/CD | Validée par le propriétaire ; accès/quota à vérifier | #2, #7 |
| DEC-007 | Tester la mention native GitHub avec le propriétaire ; repli Cloud actuel avec lancement humain ; Ready n'est pas un mandat | Proposée, test requis | #2, #7, #9 |
| DEC-008 | Intégration GitHub native de Codex, accès limité au dépôt ; aucun jeton ChatGPT exporté, CI indépendante | Proposée | #2, #4, #7, #8 |
| DEC-009 | Branches de tâche, commits autonomes, aucune fusion agent ; main protégée avant pilote | Proposée, protection non vérifiée | #4 |
| DEC-010 | Aucun déploiement avant validation visuelle et activation humaine ; puis publication depuis main | Proposée | #8, #14 |

## Arbitrages ouverts avant exécution agent

1. Vérifier l'accès Codex Cloud avec l'abonnement et le dépôt privé ; tester l'intégration GitHub Legacy et son identité de déclenchement. Ne pas dépendre durablement du Legacy. Le déclenchement par le connecteur ChatGPT reste une hypothèse ; lancement humain dans Cloud si non disponible.
2. Plan GitHub : vérifier protections sur dépôt privé et Pages. Si non éligible, choisir une alternative sans exposer le dépôt par défaut.
3. CI des PR Codex : vérifier le déclenchement et les contrôles liés au SHA exact ; documenter les éventuelles interventions manuelles avant toute complexification.
4. Design visuel, contenus, métriques et dépendances précises : décisions ultérieures dans Issues dédiées.

## Observations du 26 novembre 2026

- Dépôt privé, branche main initiale 32209f19bf94f421a567a192b16ee08ad4b60d1f ; protection signalée inactive lors de la consultation.
- 14 Issues créées ; le propriétaire confirme avoir rétabli le Kanban. Les statuts Projects ne sont pas accessibles via le connecteur actuel.
- Aucun workflow agent, CI ou déploiement créé ou exécuté dans ce cadrage.

- Contrainte ajoutée : abonnement ChatGPT uniquement ; pas d'action Codex avec clé API. Aucune tâche Codex lancée à ce stade.
