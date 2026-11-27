export const technologyCategories = {
  languages: "Langages",
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  cms: "CMS",
  data: "Données",
  devops: "DevOps",
  ai: "IA",
  quality: "Qualité",
} as const;

export const technologyUsage = {
  current: "Usage actuel",
  previous: "Expérience passée",
  exploration: "Exploration",
} as const;

export const autonomyLevels = {
  autonomous: "Autonome",
  experienced: "Expérimenté",
  developing: "En développement",
} as const;

export type TechnologyCategory = keyof typeof technologyCategories;
export type TechnologyUsage = keyof typeof technologyUsage;
export type AutonomyLevel = keyof typeof autonomyLevels;
