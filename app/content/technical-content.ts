import type { Entity, EntityId } from "./professional-content";
import type {
  AutonomyLevel,
  TechnologyCategory,
  TechnologyUsage,
} from "./technical-classification";

export const STACK_ID = "collection:stack-technique";
export const SKILLS_ID = "collection:competences-transversales";

const profile = "profile:positionnement";
const gendarmerie = "experience:gendarmerie-nationale";
const army = "experience:armee-air-espace";
const elee = "experience:elee";
const vitis = "experience:vitis";

function technology(
  slug: string,
  title: string,
  category: TechnologyCategory,
  usage: TechnologyUsage = "current",
  related: readonly EntityId<"experience">[] = [],
): Entity<"technology"> {
  return {
    id: `technology:${slug}`,
    kind: "technology",
    status: "approved",
    category,
    usage,
    copy: { fr: { status: "approved", title } },
    related,
  };
}

export const featuredTechnologyIds = [
  "technology:python",
  "technology:react",
  "technology:django",
  "technology:fastapi",
  "technology:postgresql",
  "technology:docker",
  "technology:gitlab-ci-cd",
  "technology:github-actions",
  "technology:chatgpt",
  "technology:codex",
  "technology:claude",
  "technology:n8n",
] as const satisfies readonly EntityId<"technology">[];

const technologies = [
  technology("python", "Python", "languages", "current", [gendarmerie, army]),
  technology("javascript", "JavaScript", "languages"),
  technology("react", "React.js", "frontend", "current", [
    gendarmerie,
    army,
    vitis,
  ]),
  technology("nextjs", "Next.js", "frontend"),
  technology("htmx", "HTMX", "frontend"),
  technology("tailwind-css", "Tailwind CSS", "frontend"),
  technology("django", "Django", "backend"),
  technology("fastapi", "FastAPI", "backend"),
  technology("flask", "Flask", "backend"),
  technology("react-native", "React Native", "mobile"),
  technology("expo", "Expo", "mobile"),
  technology("wagtail", "Wagtail", "cms"),
  technology("postgresql", "PostgreSQL", "data", "current", [army]),
  technology("elasticsearch", "Elasticsearch", "data"),
  technology("sqlite", "SQLite", "data"),
  technology("xml", "XML", "data"),
  technology("json", "JSON", "data"),
  technology("sql", "SQL", "data"),
  technology("pandas", "Pandas", "data"),
  technology("docker", "Docker", "devops", "current", [army]),
  technology("docker-compose", "Docker Compose", "devops"),
  technology("gitlab-ci-cd", "GitLab CI/CD", "devops", "current", [
    gendarmerie,
    army,
  ]),
  technology("github-actions", "GitHub Actions", "devops"),
  technology("git", "Git", "devops"),
  technology("linux", "Linux", "devops"),
  technology("debian", "Debian", "devops"),
  technology("bash", "Bash", "devops", "current", [army]),
  technology("nginx", "Nginx", "devops"),
  technology("runners-auto-heberges", "Runners auto-hébergés", "devops"),
  technology("chatgpt", "ChatGPT", "ai"),
  technology("codex", "Codex", "ai"),
  technology("claude", "Claude", "ai"),
  technology("n8n", "n8n", "ai"),
  technology("notion", "Notion", "ai"),
  technology("pytest", "Pytest", "quality"),
  technology("eslint", "ESLint", "quality"),
  technology("prettier", "Prettier", "quality"),
  technology(
    "django-rest-framework",
    "Django REST Framework",
    "backend",
    "previous",
    [army],
  ),
  technology("ansible", "Ansible", "devops", "previous", [army]),
  technology("llm-auto-heberges", "LLM auto-hébergés", "ai", "exploration"),
  technology("rag", "RAG", "ai", "exploration"),
  technology("mcp", "MCP", "ai", "exploration"),
  technology("playwright", "Playwright", "quality", "exploration"),
  technology("vitest", "Vitest", "quality", "exploration"),
];

function expertise(
  id: EntityId<"expertise">,
  title: string,
  level: AutonomyLevel,
  related: readonly EntityId[] = [],
  summary?: string,
): Entity<"expertise"> {
  return {
    id,
    kind: "expertise",
    level,
    status: "approved",
    related,
    copy: {
      fr: {
        status: "approved",
        title,
        paragraphs: summary ? [summary] : undefined,
      },
    },
  };
}

const expertiseEntries = [
  expertise(
    "expertise:fullstack",
    "FullStack",
    "autonomous",
    [profile, gendarmerie, army, elee, "technology:react", "technology:python"],
    "Conception et développement d’applications web côté interface et côté serveur.",
  ),
  expertise(
    "expertise:architecture-logicielle",
    "Architecture logicielle",
    "autonomous",
    [
      profile,
      gendarmerie,
      army,
      "skill:architecture-rest",
      "skill:architecture-modulaire",
    ],
    "Conception et évolution d’architectures applicatives.",
  ),
  expertise(
    "expertise:ia-agentique",
    "IA agentique",
    "autonomous",
    [
      profile,
      gendarmerie,
      "skill:automatisation-workflows",
      "skill:gouvernance-ia",
    ],
    "Introduction de pratiques agentiques et recherche sur le développement assisté par IA.",
  ),
  expertise(
    "expertise:industrialisation-ci-cd",
    "Industrialisation CI/CD",
    "autonomous",
    [gendarmerie, army, "technology:gitlab-ci-cd", "technology:github-actions"],
    "Conception de pipelines et de chaînes de mise en production.",
  ),
  expertise(
    "expertise:pilotage-technique",
    "Pilotage technique",
    "autonomous",
    [
      profile,
      army,
      gendarmerie,
      "skill:besoins-utilisateurs",
      "skill:specifications-techniques",
    ],
    "Pilotage opérationnel, recueil des besoins et rédaction de spécifications techniques.",
  ),
  expertise("expertise:data-engineering", "Data Engineering", "experienced", [
    "technology:postgresql",
    "technology:pandas",
  ]),
  expertise(
    "expertise:qualite-logicielle",
    "Qualité logicielle",
    "experienced",
    ["skill:quality-gates", "skill:tdd"],
  ),
  expertise(
    "expertise:securite-applicative",
    "Sécurité applicative",
    "developing",
    ["skill:owasp"],
  ),
];

function skill(
  slug: string,
  title: string,
  level: AutonomyLevel,
  related: readonly EntityId[] = [],
): Entity<"skill"> {
  return {
    id: `skill:${slug}`,
    kind: "skill",
    level,
    status: "approved",
    related,
    copy: { fr: { status: "approved", title } },
  };
}

const skills = [
  skill("architecture-rest", "Architecture REST", "autonomous"),
  skill("architecture-modulaire", "Architecture modulaire", "autonomous"),
  skill(
    "specifications-techniques",
    "Spécifications techniques",
    "autonomous",
    [army],
  ),
  skill(
    "besoins-utilisateurs",
    "Recueil des besoins utilisateurs",
    "autonomous",
    [army],
  ),
  skill("planification-taches", "Planification des tâches", "autonomous"),
  skill("kanban", "Kanban", "autonomous"),
  skill(
    "automatisation-workflows",
    "Automatisation des workflows",
    "autonomous",
  ),
  skill("gitlab-ci-cd", "GitLab CI/CD", "autonomous", [
    "technology:gitlab-ci-cd",
  ]),
  skill("github-actions", "GitHub Actions", "autonomous", [
    "technology:github-actions",
  ]),
  skill("git", "Git", "experienced", ["technology:git"]),
  skill(
    "strategies-branches-git",
    "Stratégies de branches Git",
    "experienced",
    ["technology:git"],
  ),
  skill("gouvernance-ia", "Gouvernance de l’IA", "experienced"),
  skill("quality-gates", "Quality Gates", "experienced"),
  skill("optimisation-postgresql", "Optimisation PostgreSQL", "experienced", [
    "technology:postgresql",
  ]),
  skill(
    "architecture-evenementielle",
    "Architecture événementielle",
    "developing",
  ),
  skill("tdd", "TDD", "developing"),
  skill("owasp", "OWASP", "developing"),
];

export const technicalContent: readonly Entity[] = [
  {
    id: STACK_ID,
    kind: "collection",
    members: "technology",
    status: "approved",
    related: [],
    copy: { fr: { status: "approved", title: "Catalogue des technologies" } },
  },
  {
    id: SKILLS_ID,
    kind: "collection",
    members: "skill",
    status: "approved",
    related: [],
    copy: { fr: { status: "approved", title: "Compétences transversales" } },
  },
  ...technologies,
  ...expertiseEntries,
  ...skills,
];
