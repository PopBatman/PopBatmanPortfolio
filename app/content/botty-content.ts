import type { Entity } from "./professional-content";

export const BOTTY_ID = "project:botty";
export const BOTTY_ARCHITECTURE_ID = "architecture:botty";

export type ArchitectureDiagram = {
  nodes: readonly { id: string; label: string; role: string }[];
  connections: readonly {
    from: string;
    to: string;
    bidirectional?: boolean;
    description: string;
  }[];
};

export const bottyContent: readonly Entity[] = [
  {
    kind: "project",
    id: BOTTY_ID,
    status: "approved",
    stage: "operational",
    copy: {
      fr: {
        status: "approved",
        title: "Botty",
        paragraphs: [
          "Créé en 2025, Botty visait à générer des signaux d’achat et de vente de qualité. Le produit a été développé en solo et était opérationnel et accessible au public au moment de l’atelier éditorial.",
        ],
        sections: [
          {
            title: "Développement et mise en production",
            items: [
              "Une année de développement sans IA, suivie de six mois avec IA.",
              "Livraison d’un produit complet en production, avec CI/CD et configuration du serveur.",
              "Principale difficulté : le développement agentique sans méthode structurée.",
            ],
          },
          {
            title: "Décisions et suite",
            items: [
              "Commercialisation abandonnée, la valeur ajoutée ayant été jugée insuffisante.",
              "Arrêt du produit prévu.",
            ],
          },
        ],
      },
    },
    related: [
      BOTTY_ARCHITECTURE_ID,
      "expertise:fullstack",
      "expertise:ia-agentique",
      "expertise:industrialisation-ci-cd",
    ],
  },
  {
    kind: "architecture",
    id: BOTTY_ARCHITECTURE_ID,
    status: "approved",
    copy: {
      fr: {
        status: "approved",
        title: "Architecture de Botty",
        paragraphs: [
          "Schéma de travail à valider par le propriétaire. Les composants et les flux ci-dessous décrivent le modèle conceptuel proposé.",
        ],
        sections: [
          {
            title: "Infrastructure et livraison",
            items: [
              "Docker est envisagé dans le schéma de travail. La mise en place de la CI/CD est confirmée pour le projet.",
            ],
          },
        ],
      },
    },
    diagram: {
      nodes: [
        {
          id: "market",
          label: "Données de marché",
          role: "Collecter les données de marché et les transmettre au traitement Python.",
        },
        {
          id: "processing",
          label: "Traitement Python",
          role: "Traiter les données collectées pour produire des indicateurs techniques, effectuer des backtests et générer des signaux.",
        },
        {
          id: "database",
          label: "PostgreSQL",
          role: "Stocker les résultats du traitement et échanger les données avec l’API.",
        },
        {
          id: "api",
          label: "API Python / Flask",
          role: "Relier l’application mobile à PostgreSQL et gérer leurs échanges.",
        },
        {
          id: "mobile",
          label: "Mobile React Native / Expo",
          role: "Consulter les informations via les échanges avec l’API.",
        },
      ],
      connections: [
        {
          from: "market",
          to: "processing",
          description: "Les données de marché alimentent le traitement Python.",
        },
        {
          from: "processing",
          to: "database",
          description:
            "Le traitement Python enregistre ses résultats dans PostgreSQL.",
        },
        {
          from: "database",
          to: "api",
          bidirectional: true,
          description: "PostgreSQL et l’API Flask échangent des données.",
        },
        {
          from: "api",
          to: "mobile",
          bidirectional: true,
          description:
            "L’API Flask et l’application mobile échangent des requêtes et des réponses.",
        },
      ],
    },
    related: [
      BOTTY_ID,
      "technology:react-native",
      "technology:expo",
      "technology:python",
      "technology:flask",
      "technology:postgresql",
      "technology:docker",
    ],
  },
];
