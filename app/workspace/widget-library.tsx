"use client";

import {
  Activity,
  BriefcaseBusiness,
  ChevronDown,
  CodeXml,
  Heart,
  Grip,
  Layers,
  Mail,
  Search,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import {
  WIDGET_DRAG_TYPE,
  widgetIds,
  widgetRegistry,
  type WidgetId,
} from "./widget-registry";

const categories = [
  { id: "identity", name: "Identité", icon: UserRound },
  { id: "career", name: "Carrière", icon: BriefcaseBusiness },
  { id: "engineering", name: "Engineering", icon: CodeXml },
  { id: "projects", name: "Réalisations", icon: Layers },
  { id: "activity", name: "Activité", icon: Activity },
  { id: "personal", name: "Personnel", icon: Heart },
  { id: "contact", name: "Contact", icon: Mail },
];

export function WidgetLibrary({
  active,
  desktop,
  onAdd,
  onDragWidget,
}: {
  active: WidgetId[];
  desktop: boolean;
  onAdd: (id: WidgetId) => void;
  onDragWidget: (id: WidgetId | null) => void;
}) {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const results = categories
    .map((category) => ({
      ...category,
      widgets: widgetIds.filter(
        (id) =>
          widgetRegistry[id].category === category.id &&
          (category.name.toLowerCase().includes(search) ||
            widgetRegistry[id].title.toLowerCase().includes(search)),
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
            {widgets.map((id) => {
              const added = active.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    disabled={added}
                    draggable={desktop && !added}
                    title={added ? "Déjà affiché" : "Ajouter au workspace"}
                    onClick={() => onAdd(id)}
                    onDragStart={(event) => {
                      if (added || !desktop) return;
                      event.dataTransfer.effectAllowed = "copy";
                      event.dataTransfer.setData(WIDGET_DRAG_TYPE, id);
                      onDragWidget(id);
                    }}
                    onDragEnd={() => onDragWidget(null)}
                  >
                    <Grip size={14} aria-hidden="true" />{" "}
                    {widgetRegistry[id].title}
                  </button>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </section>
  );
}
