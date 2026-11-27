"use client";

import {
  Activity,
  BriefcaseBusiness,
  ChevronDown,
  CodeXml,
  Heart,
  Layers,
  Mail,
  Search,
  UserRound,
} from "lucide-react";
import { useState } from "react";

const categories = [
  {
    name: "Identité",
    icon: UserRound,
    widgets: ["Présentation", "Disponibilité", "CV"],
  },
  {
    name: "Carrière",
    icon: BriefcaseBusiness,
    widgets: ["Expériences", "Formations"],
  },
  {
    name: "Engineering",
    icon: CodeXml,
    widgets: ["Stack technique", "Expertises", "Architecture"],
  },
  {
    name: "Réalisations",
    icon: Layers,
    widgets: ["Botty", "Workflow IA", "LeStudio"],
  },
  {
    name: "Activité",
    icon: Activity,
    widgets: ["Activité GitHub", "Changelog"],
  },
  { name: "Personnel", icon: Heart, widgets: ["Centres d’intérêt"] },
  { name: "Contact", icon: Mail, widgets: ["Contact", "Réseaux"] },
];

export function WidgetLibrary() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const results = categories
    .map((category) => ({
      ...category,
      widgets: category.name.toLowerCase().includes(search)
        ? category.widgets
        : category.widgets.filter((widget) =>
            widget.toLowerCase().includes(search),
          ),
    }))
    .filter(({ widgets }) => widgets.length > 0);

  return (
    <section aria-label="Bibliothèque de widgets" className="library">
      <label className="library-search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          aria-label="Rechercher un widget"
          placeholder="Rechercher un widget…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {results.length === 0 && (
        <p className="library-empty" role="status">
          Aucun widget trouvé.
        </p>
      )}
      {results.map(({ name, icon: Icon, widgets }) => (
        <details key={name + search} open={search ? true : undefined}>
          <summary>
            <Icon size={17} aria-hidden="true" />
            {name}
            <ChevronDown
              className="category-chevron"
              size={14}
              aria-hidden="true"
            />
          </summary>
          <ul>
            {widgets.map((widget) => (
              <li key={widget}>
                <button type="button" disabled title="Ajout de widgets à venir">
                  {widget}
                </button>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}
