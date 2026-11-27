# PopBatmanPortfolio

Portfolio professionnel et démonstration d'un workflow ChatGPT + Codex + GitHub, sans clé API OpenAI ni infrastructure d'orchestration personnelle.

## Démarrage

Utiliser la version LTS de Node.js fixée dans `.nvmrc` et installer les dépendances depuis le lockfile npm.

```sh
nvm install
nvm use
npm ci
npm run dev
```

Le serveur de développement écoute sur `http://localhost:3000/`.

## Export statique

```sh
npm run build                                             # Hébergement à la racine
NEXT_PUBLIC_BASE_PATH=/PopBatmanPortfolio npm run build   # Hébergement GitHub Pages
```

Chaque build régénère `out/`. L’export préfixé se sert à l’URL `/PopBatmanPortfolio/` en montant le contenu de `out/` à cet emplacement. Le préfixe est intégré à la compilation. Le fichier `.nojekyll` est inclus dans l’export pour permettre à GitHub Pages de servir les fichiers sous `_next/`.

## Vérifications

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run build && npm run test:e2e
export NEXT_PUBLIC_BASE_PATH=/PopBatmanPortfolio
npm run build && npm run test:e2e
unset NEXT_PUBLIC_BASE_PATH
```

Playwright sert directement le contenu de `out/`. Utiliser le même `NEXT_PUBLIC_BASE_PATH` pour le build et le test. Sur Linux, `npx playwright install --with-deps chromium` installe aussi les prérequis système si nécessaire. Pour utiliser un Chromium déjà installé, renseigner `PLAYWRIGHT_CHROMIUM_EXECUTABLE` avec son chemin lors des tests.

## Références

- [Projet et périmètre](docs/PROJECT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Décisions](docs/DECISIONS.md)
- [Workflow](docs/WORKFLOW.md)
- [Instructions des agents](AGENTS.md)
- [Issues](https://github.com/PopBatman/PopBatmanPortfolio/issues)
- [Projects](https://github.com/users/PopBatman/projects/4/views/1)

Le développement passe par une branche de tâche, une PR et une validation humaine. Aucun déploiement n'est activé.
