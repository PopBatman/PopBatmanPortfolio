import type { Entity } from "./professional-content";

const profile = "profile:positionnement";

const experience: Entity<"experience">[] = [
  {
    kind: "experience",
    id: "experience:gendarmerie-nationale",
    status: "approved",
    period: { start: 2025, end: null },
    role: { fr: "Ingénieur logiciel" },
    technologies: ["React.js", "Python", "GitLab CI/CD"],
    copy: {
      fr: {
        status: "approved",
        title: "Gendarmerie nationale",
        paragraphs: [
          "Développement d’une application de gestion de données de masse en React.js et Python.",
        ],
        sections: [
          {
            title: "Architecture et CI/CD",
            items: [
              "Participation à la conception architecturale.",
              "Conception des pipelines GitLab CI/CD.",
            ],
          },
          {
            title: "Pratiques agentiques",
            items: [
              "Introduction des pratiques agentiques dans l’équipe.",
              "Recherche et développement sur les processus de développement assistés par IA.",
            ],
          },
          {
            title: "Contribution à l’équipe",
            items: [
              "Contribution informelle au pilotage technique.",
              "Accompagnement technique ponctuel des développeurs.",
            ],
          },
        ],
      },
    },
    related: [
      profile,
      "expertise:architecture-logicielle",
      "expertise:ia-agentique",
    ],
  },
  {
    kind: "experience",
    id: "experience:armee-air-espace",
    status: "approved",
    period: { start: 2021, end: 2025 },
    role: { fr: "Ingénieur R&D / Officier sous contrat" },
    technologies: [
      "React",
      "Python",
      "Django REST Framework",
      "PostgreSQL",
      "Docker",
      "Ansible",
      "GitLab CI/CD",
      "Bash",
    ],
    copy: {
      fr: {
        status: "approved",
        title: "Armée de l’air et de l’espace",
        paragraphs: [
          "Conception complète d’une application à partir de zéro en tant qu’unique développeur.",
        ],
        sections: [
          {
            title: "Besoins et pilotage",
            items: [
              "Pilotage opérationnel du projet.",
              "Recueil direct des besoins auprès des utilisateurs.",
              "Rédaction des spécifications fonctionnelles et techniques.",
            ],
          },
          {
            title: "Architecture et mise en production",
            items: [
              "Conception et évolution de l’architecture.",
              "Conception de la chaîne CI/CD et mise en production.",
            ],
          },
        ],
      },
    },
    related: [
      profile,
      "expertise:architecture-logicielle",
      "expertise:pilotage-technique",
    ],
  },
  {
    kind: "experience",
    id: "experience:elee",
    status: "approved",
    period: { start: 2021, end: 2021 },
    role: { fr: "Développeur FullStack" },
    technologies: ["Vue.js", "Laravel"],
    copy: {
      fr: {
        status: "approved",
        title: "Elée",
        paragraphs: [
          "Développement d’un SaaS de calcul des licences pour TPE et PME au sein d’une équipe de quatre personnes. Intégration dans une architecture existante et rôle informel de référent frontend.",
        ],
      },
    },
    related: [profile, "expertise:fullstack"],
  },
  {
    kind: "experience",
    id: "experience:vitis",
    status: "approved",
    period: { start: 2017, end: 2021 },
    role: { fr: "Développeur web" },
    contract: { fr: "Alternance puis CDD" },
    technologies: ["React.js", "Redux", "PHP", "Bootstrap"],
    copy: {
      fr: {
        status: "approved",
        title: "VITIS",
        paragraphs: [
          "Maintenance du site web dans le secteur des télécommunications, en équipe de deux personnes et en collaboration avec le marketing.",
        ],
      },
    },
    related: [profile],
  },
  {
    kind: "experience",
    id: "experience:leaseplan",
    status: "approved",
    period: { start: 2016, end: 2017 },
    role: { fr: "Développeur web" },
    contract: { fr: "Stage puis alternance" },
    technologies: ["AngularJS", "Java", "Spring", "JHipster"],
    copy: {
      fr: {
        status: "approved",
        title: "LeasePlan",
        paragraphs: ["Développement applicatif."],
      },
    },
    related: [profile],
  },
];

const education: Entity<"education">[] = [
  {
    kind: "education",
    id: "education:expert-digital-marketing",
    status: "approved",
    period: { start: 2019, end: 2020 },
    institution: { fr: "Digital School of Paris" },
    copy: {
      fr: { status: "approved", title: "Mastère Expert Digital Marketing" },
    },
    related: [],
  },
  {
    kind: "education",
    id: "education:chef-projet-digital",
    status: "approved",
    period: { start: 2017, end: 2019 },
    institution: { fr: "Digital School of Paris" },
    copy: {
      fr: { status: "approved", title: "Mastère Chef de projet digital" },
    },
    related: [],
  },
  {
    kind: "education",
    id: "education:bts-sio",
    status: "approved",
    period: { start: 2015, end: 2017 },
    institution: { fr: "IMCP" },
    copy: { fr: { status: "approved", title: "BTS SIO" } },
    related: [],
  },
  {
    kind: "education",
    id: "education:apprentissage-autodidacte",
    status: "approved",
    outcome: "self-taught",
    copy: { fr: { status: "approved", title: "Apprentissage autodidacte" } },
    related: [],
  },
];

const interests: Entity<"interest">[] = [
  ["tennis", "Tennis et engagement associatif"],
  ["finance", "Finance"],
  ["intelligence-artificielle", "Intelligence artificielle"],
  ["nouvelles-technologies", "Nouvelles technologies"],
  ["culture-fantastique", "Culture fantastique et Le Seigneur des anneaux"],
].map(([id, title]) => ({
  kind: "interest",
  id: `interest:${id}`,
  status: "approved",
  copy: { fr: { status: "approved", title } },
  related: [],
}));

export const careerContent: readonly Entity[] = [
  ...experience,
  ...education,
  ...interests,
];
