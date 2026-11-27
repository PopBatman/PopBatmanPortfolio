import { expect, it } from "vitest";
import {
  professionalContent,
  publishedEntries,
  relatedDetails,
  validateContent,
} from "../app/content/professional-content";
import { featuredTechnologyIds } from "../app/content/technical-content";

it("classifies the complete technology inventory and preserves historical labels", () => {
  const technologies = publishedEntries("technology", "fr");
  const titles = (usage: "current" | "previous" | "exploration") =>
    technologies
      .filter(({ entity }) => entity.usage === usage)
      .map(({ copy }) => copy.title);
  expect(titles("current")).toEqual([
    "Python",
    "JavaScript",
    "React.js",
    "Next.js",
    "HTMX",
    "Tailwind CSS",
    "Django",
    "FastAPI",
    "Flask",
    "React Native",
    "Expo",
    "Wagtail",
    "PostgreSQL",
    "Elasticsearch",
    "SQLite",
    "XML",
    "JSON",
    "SQL",
    "Pandas",
    "Docker",
    "Docker Compose",
    "GitLab CI/CD",
    "GitHub Actions",
    "Git",
    "Linux",
    "Debian",
    "Bash",
    "Nginx",
    "Runners auto-hébergés",
    "ChatGPT",
    "Codex",
    "Claude",
    "n8n",
    "Notion",
    "Pytest",
    "ESLint",
    "Prettier",
  ]);
  expect(titles("previous")).toEqual(["Django REST Framework", "Ansible"]);
  expect(titles("exploration")).toEqual([
    "LLM auto-hébergés",
    "RAG",
    "MCP",
    "Playwright",
    "Vitest",
  ]);
  const excluded = [
    "TypeScript",
    "PHP",
    "Laravel",
    "Redux",
    "Bootstrap",
    "Vue.js",
    "AngularJS",
    "Java",
    "Spring",
    "JHipster",
    "GitHub Copilot",
  ];
  for (const title of excluded) {
    expect(technologies.some(({ copy }) => copy.title === title)).toBe(false);
  }
  const history = publishedEntries("experience", "fr").flatMap(
    ({ entity }) => entity.technologies,
  );
  expect(history).toEqual(
    expect.arrayContaining(
      excluded.filter(
        (title) => !["TypeScript", "GitHub Copilot"].includes(title),
      ),
    ),
  );
  const featured = featuredTechnologyIds.map((id) =>
    technologies.find(({ entity }) => entity.id === id),
  );
  expect(featured.map((entry) => entry?.copy.title)).toEqual([
    "Python",
    "React.js",
    "Django",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "GitLab CI/CD",
    "GitHub Actions",
    "ChatGPT",
    "Codex",
    "Claude",
    "n8n",
  ]);
  expect(featured.every((entry) => entry?.entity.usage === "current")).toBe(
    true,
  );
});

it("keeps eight expertise entries and the distinct levels for transversal skills", () => {
  for (const [kind, levels] of [
    ["expertise", { autonomous: 5, experienced: 2, developing: 1 }],
    ["skill", { autonomous: 9, experienced: 5, developing: 3 }],
  ] as const) {
    const entries = publishedEntries(kind, "fr");
    for (const [level, count] of Object.entries(levels)) {
      expect(
        entries.filter(({ entity }) => entity.level === level),
      ).toHaveLength(count);
    }
  }
  const technology = publishedEntries("technology", "fr").find(
    ({ copy }) => copy.title === "GitLab CI/CD",
  )!;
  const skill = publishedEntries("skill", "fr").find(
    ({ copy }) => copy.title === "GitLab CI/CD",
  )!;
  expect(technology.entity.usage).toBe("current");
  expect(skill.entity.level).toBe("autonomous");
  expect(skill.entity.related).toEqual([technology.entity.id]);
});

it("only links technologies to experiences that name them", () => {
  expect(validateContent(professionalContent)).toEqual([]);
  for (const { entity, copy } of publishedEntries("technology", "fr")) {
    for (const { entity: evidence } of relatedDetails(entity, "fr")) {
      expect(evidence.kind).toBe("experience");
      if (evidence.kind === "experience") {
        const names =
          copy.title === "React.js" ? ["React", "React.js"] : [copy.title];
        expect(evidence.technologies.some((name) => names.includes(name))).toBe(
          true,
        );
      }
    }
  }
  const expertise = publishedEntries("expertise", "fr");
  const ids = (title: string) =>
    expertise.find(({ copy }) => copy.title === title)?.entity.related;
  expect(ids("IA agentique")).toContain("experience:gendarmerie-nationale");
  expect(ids("Pilotage technique")).toContain("experience:armee-air-espace");
  expect(
    ids("Sécurité applicative")?.some((id) => id.startsWith("experience:")),
  ).toBe(false);
});
