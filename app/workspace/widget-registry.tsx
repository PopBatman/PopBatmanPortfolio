import {
  AudioLines,
  BarChart3,
  Circle,
  CodeXml,
  GitFork,
  Layers3,
  Mail,
  Network,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Size } from "./geometry";

const stack: { name: string; icon: LucideIcon; color: string }[] = [
  { name: "TypeScript", icon: CodeXml, color: "blue" },
  { name: "React", icon: AudioLines, color: "cyan" },
  { name: "Next.js", icon: Terminal, color: "neutral" },
  { name: "Tailwind CSS", icon: AudioLines, color: "cyan" },
  { name: "Playwright", icon: CodeXml, color: "green" },
  { name: "npm", icon: Terminal, color: "yellow" },
  { name: "GitHub", icon: GitFork, color: "neutral" },
];

function Presentation() {
  return (
    <div className="profile">
      <div className="profile-initials" aria-hidden="true">
        <span>PW</span>
      </div>
      <div className="profile-copy">
        <h1>
          PopBatman
          <br />
          Portfolio <span aria-hidden="true">/</span>
        </h1>
        <p className="profile-role">Développeur polyvalent</p>
        <p className="profile-description">
          Développement FullStack, architecture et IA agentique.
        </p>
      </div>
    </div>
  );
}

function Availability() {
  return (
    <>
      <p className="availability">
        <Circle size={9} fill="currentColor" aria-hidden="true" /> À confirmer
      </p>
      <p className="widget-muted">Modalités à préciser</p>
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
  return (
    <ul className="timeline">
      <li>
        <strong>Parcours professionnel</strong>
        <p>Expériences à venir</p>
      </li>
      <li>
        <strong>Formations</strong>
        <p>Informations à venir</p>
      </li>
    </ul>
  );
}

function Stack() {
  return (
    <ul className="stack">
      {stack.map(({ name, icon: Icon, color }) => (
        <li key={name}>
          <Icon size={18} data-color={color} aria-hidden="true" />
          {name}
        </li>
      ))}
    </ul>
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
  formations: widget("Formations", "career", 180, 105),
  expertises: widget("Expertises", "engineering", 180, 105),
  architecture: widget("Architecture", "engineering", 180, 105),
  portfolio: widget("Portfolio", "projects", 180, 105),
  activite: widget("Activité GitHub", "activity", 190, 105),
  changelog: widget("Changelog", "activity", 180, 105),
  interets: widget("Centres d’intérêt", "personal", 180, 105),
  reseaux: widget("Réseaux", "contact", 176, 105),
};

export const WIDGET_DRAG_TYPE = "application/x-popbatman-widget";

export type WidgetId = keyof typeof widgetRegistry;
export const widgetIds = Object.keys(widgetRegistry) as WidgetId[];

export function isWidgetId(value: string): value is WidgetId {
  return Object.hasOwn(widgetRegistry, value);
}
