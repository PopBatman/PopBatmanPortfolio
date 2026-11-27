import {
  AudioLines,
  BarChart3,
  Circle,
  CodeXml,
  GitFork,
  Grip,
  Layers3,
  Mail,
  MoreHorizontal,
  Network,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

function WidgetFrame({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="widget" data-widget={id} aria-labelledby={id}>
      <header className="widget-header">
        <Grip size={15} aria-hidden="true" className="widget-grip" />
        <h2 id={id}>{title}</h2>
        <button
          className="icon-button"
          type="button"
          aria-label={`Options : ${title}`}
          disabled
        >
          <MoreHorizontal size={17} />
        </button>
      </header>
      <div className="widget-content">{children}</div>
    </section>
  );
}

const projects = [
  {
    id: "botty",
    title: "Botty",
    description: "Assistant financier personnel",
    icon: BarChart3,
  },
  {
    id: "workflow",
    title: "Workflow IA",
    description: "ChatGPT · Codex · GitHub",
    icon: Network,
  },
  {
    id: "lestudio",
    title: "LeStudio",
    description: "Plateforme de création web",
    icon: Layers3,
  },
];

const stack: { name: string; icon: LucideIcon; color: string }[] = [
  { name: "TypeScript", icon: CodeXml, color: "blue" },
  { name: "React", icon: AudioLines, color: "cyan" },
  { name: "Next.js", icon: Terminal, color: "neutral" },
  { name: "Tailwind CSS", icon: AudioLines, color: "cyan" },
  { name: "Playwright", icon: CodeXml, color: "green" },
  { name: "npm", icon: Terminal, color: "yellow" },
  { name: "GitHub", icon: GitFork, color: "neutral" },
];

export function Canvas() {
  return (
    <main className="canvas" aria-label="Vue d’ensemble du portfolio">
      <div className="canvas-grid">
        <WidgetFrame id="presentation" title="Présentation">
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
        </WidgetFrame>
        <WidgetFrame id="disponibilite" title="Disponibilité">
          <p className="availability">
            <Circle size={9} fill="currentColor" aria-hidden="true" /> À
            confirmer
          </p>
          <p className="widget-muted">Modalités à préciser</p>
        </WidgetFrame>
        <WidgetFrame id="contact" title="Contact">
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
        </WidgetFrame>
        <WidgetFrame id="experiences" title="Expériences">
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
        </WidgetFrame>
        <WidgetFrame id="stack" title="Stack technique">
          <ul className="stack">
            {stack.map(({ name, icon: Icon, color }) => (
              <li key={name}>
                <Icon size={18} data-color={color} aria-hidden="true" />
                {name}
              </li>
            ))}
          </ul>
        </WidgetFrame>
        {projects.map(({ id, title, description, icon: Icon }) => (
          <WidgetFrame
            key={id}
            id={id}
            title={id === "workflow" ? "Workflow agentique" : title}
          >
            <div className="project">
              <Icon size={26} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          </WidgetFrame>
        ))}
      </div>
    </main>
  );
}
