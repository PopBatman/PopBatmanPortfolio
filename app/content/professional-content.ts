import { bottyContent, type ArchitectureDiagram } from "./botty-content";
import { technicalContent } from "./technical-content";
import {
  autonomyLevels,
  technologyCategories,
  technologyUsage,
  type AutonomyLevel,
  type TechnologyCategory,
  type TechnologyUsage,
} from "./technical-classification";
import { careerContent } from "./career-content";

export type Locale = "fr" | "en";
export type Localized<T> = { fr: T; en?: T };
type Status = "draft" | "approved";

export type YearRange = { start: number; end: number | null };

export function formatYears({ start, end }: YearRange, locale: Locale) {
  if (start === end) return String(start);
  return `${start} – ${end ?? (locale === "fr" ? "Aujourd’hui" : "Present")}`;
}

type EntityFields = {
  profile: { initials: string };
  availability: {
    terms: Localized<{
      contracts: string[];
      regions: string[];
      modes: string[];
      targets: string[];
    }>;
  };
  experience: {
    period: YearRange;
    role: Localized<string>;
    contract?: Localized<string>;
    technologies: readonly string[];
  };
  technology: { category: TechnologyCategory; usage: TechnologyUsage };
  expertise: { level: AutonomyLevel };
  skill: { level: AutonomyLevel };
  collection: { members: "technology" | "skill" };
  project: {
    stage?: "prototype" | "experiment" | "development" | "operational";
  };
  architecture: { diagram?: ArchitectureDiagram };
  education: {
    period?: YearRange;
    institution?: Localized<string>;
    outcome?: "earned" | "in-progress" | "self-taught";
  };
  interest: object;
  document: {
    variant: "general" | "technical" | "leadership";
    language: Locale;
    path?: string;
  };
  link: {
    channel: "github" | "linkedin" | "malt" | "email" | "other";
    href?: string;
  };
};

export type EntityKind = keyof EntityFields;
export type EntityId<K extends EntityKind = EntityKind> = `${K}:${string}`;
type Copy = {
  status: Status;
  title: string;
  paragraphs?: string[];
  sections?: { title: string; items: string[] }[];
};

export type Entity<K extends EntityKind = EntityKind> = {
  [Kind in K]: EntityFields[Kind] & {
    kind: Kind;
    id: EntityId<Kind>;
    status: Status;
    copy: Localized<Copy>;
    related: readonly EntityId[];
  };
}[K];

export type ContentCatalog = { version: 1; entities: readonly Entity[] };

export const PROFILE_ID = "profile:positionnement";
export const AVAILABILITY_ID = "availability:opportunites";

export const profile: Entity<"profile"> = {
  id: PROFILE_ID,
  kind: "profile",
  status: "approved",
  initials: "PW",
  copy: {
    fr: {
      status: "approved",
      title: "Développeur polyvalent",
      paragraphs: ["Concevoir, développer, industrialiser."],
    },
  },
  related: [
    "expertise:fullstack",
    "expertise:architecture-logicielle",
    "expertise:pilotage-technique",
    "expertise:ia-agentique",
    AVAILABILITY_ID,
  ],
};

export const availability: Entity<"availability"> = {
  id: AVAILABILITY_ID,
  kind: "availability",
  status: "approved",
  copy: {
    fr: { status: "approved", title: "À l’écoute de nouvelles opportunités" },
  },
  terms: {
    fr: {
      contracts: ["CDI", "Freelance"],
      regions: ["France", "International"],
      modes: ["Hybride", "Télétravail"],
      targets: [
        "FullStack",
        "Architecture logicielle",
        "Chef de projet technique",
        "IA / automatisation",
        "DevOps",
      ],
    },
  },
  related: [PROFILE_ID],
};

export const professionalContent: ContentCatalog = {
  version: 1,
  entities: [
    profile,
    availability,
    ...technicalContent,
    ...careerContent,
    ...bottyContent,
  ],
};

export function approvedCopy(entity: Entity, locale: Locale) {
  const copy = entity.copy[locale];
  return entity.status === "approved" && copy?.status === "approved"
    ? copy
    : undefined;
}

export function getPublishedDetail(id: EntityId, locale: Locale) {
  const entity = professionalContent.entities.find(
    (candidate) => candidate.id === id,
  );
  if (!entity) return;
  const copy = approvedCopy(entity, locale);
  if (copy) return { entity, copy };
}

export function relatedDetails(entity: Entity, locale: Locale) {
  return entity.related.flatMap((id) => {
    const detail = getPublishedDetail(id, locale);
    return detail ? [detail] : [];
  });
}

export function publishedEntries<K extends EntityKind>(
  kind: K,
  locale: Locale,
) {
  return professionalContent.entities
    .filter(
      (entity): entity is Extract<Entity, { kind: K }> => entity.kind === kind,
    )
    .flatMap((entity) => {
      const copy = approvedCopy(entity, locale);
      return copy ? [{ entity, copy }] : [];
    });
}

export function validateContent(catalog: ContentCatalog): string[] {
  const errors: string[] = [];
  const index = new Map<EntityId, Entity>();
  for (const entity of catalog.entities) {
    const [kind, slug, ...rest] = entity.id.split(":");
    if (
      kind !== entity.kind ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? "") ||
      rest.length
    ) {
      errors.push(`Identifiant invalide : ${entity.id}`);
    }
    if (index.has(entity.id))
      errors.push(`Identifiant dupliqué : ${entity.id}`);
    index.set(entity.id, entity);

    if (
      entity.kind === "technology" &&
      (!Object.hasOwn(technologyCategories, entity.category) ||
        !Object.hasOwn(technologyUsage, entity.usage))
    ) {
      errors.push(`Classification technologique invalide : ${entity.id}`);
    }
    if (
      (entity.kind === "expertise" || entity.kind === "skill") &&
      !Object.hasOwn(autonomyLevels, entity.level)
    ) {
      errors.push(`Autonomie invalide : ${entity.id}`);
    }
    if (entity.kind === "architecture" && entity.diagram) {
      const ids = new Set(entity.diagram.nodes.map(({ id }) => id));
      if (
        ids.size !== entity.diagram.nodes.length ||
        entity.diagram.nodes.some(
          ({ id, label, role }) => !id.trim() || !label.trim() || !role.trim(),
        ) ||
        entity.diagram.connections.some(
          ({ from, to, description }) =>
            from === to ||
            !ids.has(from) ||
            !ids.has(to) ||
            !description.trim(),
        )
      ) {
        errors.push(`Schéma d’architecture invalide : ${entity.id}`);
      }
    }
    if (entity.status === "approved" && !approvedCopy(entity, "fr")) {
      errors.push(`Version française non approuvée : ${entity.id}`);
    }
    if (
      (entity.kind === "experience" || entity.kind === "education") &&
      entity.period
    ) {
      const { start, end } = entity.period;
      if (
        !Number.isInteger(start) ||
        start < 1900 ||
        (end !== null && (!Number.isInteger(end) || end < start))
      ) {
        errors.push(`Période invalide : ${entity.id}`);
      }
    }
    for (const locale of ["fr", "en"] as const) {
      const copy = approvedCopy(entity, locale);
      if (!copy) continue;
      if (
        !copy.title.trim() ||
        copy.paragraphs?.some((paragraph) => !paragraph.trim()) ||
        copy.sections?.some(
          ({ title, items }) =>
            !title.trim() ||
            !items.length ||
            items.some((item) => !item.trim()),
        )
      ) {
        errors.push(`Texte approuvé vide : ${entity.id} (${locale})`);
      }
      if (
        entity.kind === "experience" &&
        (!entity.role[locale]?.trim() ||
          (entity.contract && !entity.contract[locale]?.trim()) ||
          entity.technologies.some((name) => !name.trim()))
      ) {
        errors.push(`Expérience incomplète : ${entity.id} (${locale})`);
      }
      if (
        entity.kind === "education" &&
        entity.institution &&
        !entity.institution[locale]?.trim()
      ) {
        errors.push(`Organisme manquant : ${entity.id} (${locale})`);
      }
      if (entity.kind === "availability") {
        const terms = entity.terms[locale];
        if (
          !terms ||
          Object.values(terms).some(
            (items) => !items.length || items.some((item) => !item.trim()),
          )
        ) {
          errors.push(`Modalités incomplètes : ${entity.id} (${locale})`);
        }
      }
    }
    if (
      entity.status === "approved" &&
      entity.kind === "document" &&
      !/^\/(?!\/)[\w/-]+\.pdf$/i.test(entity.path ?? "")
    ) {
      errors.push(`PDF local requis : ${entity.id}`);
    }
    if (entity.status === "approved" && entity.kind === "link") {
      const protocol =
        entity.channel === "email"
          ? /^mailto:[^\s@]+@[^\s@]+$/
          : /^https:\/\/[^\s/]+/;
      if (!protocol.test(entity.href ?? ""))
        errors.push(`Lien professionnel invalide : ${entity.id}`);
    }
  }
  for (const entity of catalog.entities) {
    const seen = new Set<EntityId>();
    for (const id of entity.related) {
      const target = index.get(id);
      if (
        !target ||
        id === entity.id ||
        seen.has(id) ||
        (entity.status === "approved" && !approvedCopy(target, "fr"))
      ) {
        errors.push(`Référence invalide : ${entity.id} → ${id}`);
      }
      seen.add(id);
    }
  }
  return errors;
}
