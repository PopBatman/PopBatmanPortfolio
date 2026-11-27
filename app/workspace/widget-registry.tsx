import {
  BarChart3,
  Circle,
  GitFork,
  Layers3,
  Mail,
  Network,
  type LucideIcon,
} from "lucide-react";
import {
  AVAILABILITY_ID,
  PROFILE_ID,
  availability,
  approvedCopy,
  formatYears,
  getPublishedDetail,
  publishedEntries,
  profile,
  relatedDetails,
} from "../content/professional-content";
import {
  featuredTechnologyIds,
  SKILLS_ID,
  STACK_ID,
} from "../content/technical-content";
import { autonomyLevels } from "../content/technical-classification";
import { DetailsButton } from "./professional-details";
import type { ComponentType } from "react";
import type { Size } from "./geometry";

function Presentation() {
  const copy = approvedCopy(profile, "fr");
  if (!copy) return null;
  const disciplines = relatedDetails(profile, "fr")
    .filter(({ entity }) => entity.kind === "expertise")
    .map(({ copy }) => copy.title);
  return (
    <div className="profile">
      <div className="profile-initials" aria-hidden="true">
        <span>{profile.initials}</span>
      </div>
      <div className="profile-copy">
        <h1>
          {copy.title} <span aria-hidden="true">/</span>
        </h1>
        <p className="profile-description">{disciplines.join(" · ")}</p>
        <DetailsButton id={PROFILE_ID}>Consulter le profil</DetailsButton>
      </div>
    </div>
  );
}

function Availability() {
  const copy = approvedCopy(availability, "fr");
  if (!copy) return null;
  const { contracts, regions, modes, targets } = availability.terms.fr;
  return (
    <>
      <div className="availability-heading">
        <p className="availability">
          <Circle size={9} fill="currentColor" aria-hidden="true" />
          {copy.title}
        </p>
        <DetailsButton id={AVAILABILITY_ID}>Détails</DetailsButton>
      </div>
      <ul
        className="availability-badges"
        aria-label="Contrats, périmètre et modalités"
      >
        {[...contracts, ...regions, ...modes].map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <p className="widget-muted">
        <strong>Postes ciblés</strong> · {targets.join(" · ")}
      </p>
    </>
  );
}

function Contact() {
  return (
    <div className="contact-actions">
      <a
        className="icon-button outlined"
        href="https://github.com/PopBatman"
        aria-label="Profil GitHub"
      >
        <GitFork size={20} />
      </a>
      <button
        className="icon-button outlined"
        type="button"
        disabled
        aria-label="Contact par e-mail à venir"
      >
        <Mail size={20} />
      </button>
    </div>
  );
}

function Experience() {
  const entries = publishedEntries("experience", "fr").sort(
    (a, b) =>
      b.entity.period.start - a.entity.period.start ||
      (b.entity.period.end ?? Infinity) - (a.entity.period.end ?? Infinity),
  );
  return (
    <ol className="timeline">
      {entries.map(({ entity, copy }) => (
        <li key={entity.id}>
          <strong>
            <DetailsButton id={entity.id}>{copy.title}</DetailsButton>
          </strong>
          <p>
            {entity.role.fr} · {formatYears(entity.period, "fr")}
          </p>
          {entity.technologies.length > 0 && (
            <p className="timeline-technologies">
              {entity.technologies.join(" · ")}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

function Education() {
  return (
    <ul className="timeline">
      {publishedEntries("education", "fr").map(({ entity, copy }) => (
        <li key={entity.id}>
          <strong>
            <DetailsButton id={entity.id}>{copy.title}</DetailsButton>
          </strong>
          {entity.period && (
            <p>
              {entity.institution?.fr} · {formatYears(entity.period, "fr")}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function Interests() {
  return (
    <ul className="stack">
      {publishedEntries("interest", "fr").map(({ entity, copy }) => (
        <li key={entity.id}>{copy.title}</li>
      ))}
    </ul>
  );
}

function Stack() {
  return (
    <>
      <ul className="stack" aria-label="Technologies à la une">
        {featuredTechnologyIds.map((id) => {
          const detail = getPublishedDetail(id, "fr");
          return (
            detail && (
              <li key={id}>
                <DetailsButton id={id}>{detail.copy.title}</DetailsButton>
              </li>
            )
          );
        })}
      </ul>
      <DetailsButton id={STACK_ID}>Toutes les technologies</DetailsButton>
    </>
  );
}

function Expertise() {
  return (
    <>
      <ul className="timeline" aria-label="Expertises professionnelles">
        {publishedEntries("expertise", "fr").map(({ entity, copy }) => (
          <li key={entity.id}>
            <strong>
              <DetailsButton id={entity.id}>{copy.title}</DetailsButton>
            </strong>
            <p>{autonomyLevels[entity.level]}</p>
          </li>
        ))}
      </ul>
      <DetailsButton id={SKILLS_ID}>Compétences transversales</DetailsButton>
    </>
  );
}

function Botty() {
  return (
    <Project
      icon={BarChart3}
      title="Botty"
      description="Assistant financier personnel"
    />
  );
}

function Workflow() {
  return (
    <Project
      icon={Network}
      title="Workflow IA"
      description="ChatGPT · Codex · GitHub"
    />
  );
}

function LeStudio() {
  return (
    <Project
      icon={Layers3}
      title="LeStudio"
      description="Plateforme de création web"
    />
  );
}

function Project({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="project">
      <Icon size={26} aria-hidden="true" />
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function PendingContent() {
  return <p className="widget-muted">Contenu à venir</p>;
}

type Category =
  | "identity"
  | "career"
  | "engineering"
  | "projects"
  | "activity"
  | "personal"
  | "contact";
type Definition = {
  title: string;
  category: Category;
  minimum: Size;
  Content: ComponentType;
};

function widget(
  title: string,
  category: Category,
  width: number,
  height: number,
  Content: ComponentType = PendingContent,
): Definition {
  return { title, category, minimum: { width, height }, Content };
}

export const widgetRegistry = {
  presentation: widget("Présentation", "identity", 288, 216, Presentation),

  disponibilite: widget("Disponibilité", "identity", 176, 105, Availability),

  contact: widget("Contact", "contact", 176, 106, Contact),

  experiences: widget("Expériences", "career", 230, 147, Experience),

  stack: widget("Stack technique", "engineering", 230, 145, Stack),

  botty: widget("Botty", "projects", 180, 110, Botty),
  workflow: widget("Workflow agentique", "projects", 195, 110, Workflow),
  lestudio: widget("LeStudio", "projects", 180, 110, LeStudio),
  cv: widget("CV", "identity", 176, 105),
  formations: widget("Formations", "career", 180, 105, Education),
  expertises: widget("Expertises", "engineering", 180, 105, Expertise),
  architecture: widget("Architecture", "engineering", 180, 105),
  portfolio: widget("Portfolio", "projects", 180, 105),
  activite: widget("Activité GitHub", "activity", 190, 105),
  changelog: widget("Changelog", "activity", 180, 105),
  interets: widget("Centres d’intérêt", "personal", 180, 105, Interests),
  reseaux: widget("Réseaux", "contact", 176, 105),
};

export const WIDGET_DRAG_TYPE = "application/x-popbatman-widget";

export type WidgetId = keyof typeof widgetRegistry;
export const widgetIds = Object.keys(widgetRegistry) as WidgetId[];

export function isWidgetId(value: string): value is WidgetId {
  return Object.hasOwn(widgetRegistry, value);
}
