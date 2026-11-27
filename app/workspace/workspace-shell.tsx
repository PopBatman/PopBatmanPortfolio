"use client";

import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Menu,
  Monitor,
  Moon,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Settings,
  Sun,
  Undo2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import { Canvas } from "./canvas";
import { initialLayout, workspaceReducer } from "./workspace-layout";
import type { WidgetId } from "./widget-registry";
import { WidgetLibrary } from "./widget-library";

function Brand() {
  return (
    <span className="brand" aria-label="Personal Workspace">
      PW<span aria-hidden="true">.</span>
    </span>
  );
}

function Sidebar({
  collapsed,
  mobileOpen,
  light,
  active,
  desktop,
  onAdd,
  onDragWidget,
  onCollapse,
  onTheme,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  light: boolean;
  active: WidgetId[];
  desktop: boolean;
  onAdd: (id: WidgetId) => void;
  onDragWidget: (id: WidgetId | null) => void;
  onCollapse: () => void;
  onTheme: () => void;
}) {
  const ThemeIcon = light ? Sun : Moon;
  return (
    <aside
      className="sidebar"
      id="workspace-sidebar"
      aria-label="Panneau latéral"
      data-mobile-open={mobileOpen}
    >
      <div className="sidebar-heading">
        <Brand />
        <button
          className="icon-button"
          type="button"
          aria-label={
            collapsed
              ? "Déployer la barre latérale"
              : "Réduire la barre latérale"
          }
          aria-controls="sidebar-content"
          aria-expanded={!collapsed}
          onClick={onCollapse}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <div id="sidebar-content" className="sidebar-content">
        <WidgetLibrary
          active={active}
          desktop={desktop}
          onAdd={onAdd}
          onDragWidget={onDragWidget}
        />
        <div className="sidebar-actions">
          <div className="history-actions">
            <button type="button" disabled>
              <Undo2 size={16} /> Annuler
            </button>
            <button type="button" disabled>
              <Redo2 size={16} /> Rétablir
            </button>
          </div>
          <button type="button" disabled>
            <RotateCcw size={16} /> Réinitialiser
          </button>
          <button type="button" disabled>
            <Settings size={16} /> Préférences
          </button>
        </div>
      </div>
      <button
        type="button"
        className="theme-button"
        aria-pressed={light}
        aria-label="Changer le thème"
        title="Changer le thème"
        onClick={onTheme}
      >
        <ThemeIcon size={17} aria-hidden="true" />
        <span>Changer le thème</span>
      </button>
    </aside>
  );
}

function Toolbar() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const update = () => setClock(format.format(new Date()));
    const initial = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <header className="toolbar">
      <p className="breadcrumb">
        <strong>Mon portfolio</strong>
        <span>/</span> Vue d’ensemble
      </p>
      <div className="toolbar-actions" aria-label="Actions du workspace">
        <button
          className="icon-button"
          type="button"
          disabled
          aria-label="Annuler"
        >
          <Undo2 size={17} />
        </button>
        <button
          className="icon-button"
          type="button"
          disabled
          aria-label="Rétablir"
        >
          <Redo2 size={17} />
        </button>
        <span className="toolbar-divider" />
        <button
          className="icon-button outlined"
          type="button"
          disabled
          aria-label="Plein écran"
        >
          <Monitor size={17} />
        </button>
        <button
          className="presentation-button"
          type="button"
          disabled
          title="Mode présentation à venir"
        >
          <Play size={14} /> Présentation
        </button>
        <button
          className="language-button outlined"
          type="button"
          disabled
          aria-label="Langue française, changement à venir"
        >
          FR
        </button>
        <time className="clock">{clock || "—:—"}</time>
      </div>
    </header>
  );
}

const desktopQuery = "(min-width: 901px)";

function subscribeToViewport(notify: () => void) {
  const query = matchMedia(desktopQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

export function WorkspaceShell() {
  const desktop = useSyncExternalStore(
    subscribeToViewport,
    () => matchMedia(desktopQuery).matches,
    () => false,
  );
  const [layout, dispatch] = useReducer(workspaceReducer, initialLayout);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [draggedId, setDraggedId] = useState<WidgetId | null>(null);

  return (
    <div
      className="workspace"
      data-theme={light ? "light" : "dark"}
      data-collapsed={collapsed}
    >
      <header className="mobile-header">
        <Brand />
        <button
          className="icon-button"
          type="button"
          aria-label={
            mobileOpen ? "Fermer la bibliothèque" : "Ouvrir la bibliothèque"
          }
          aria-controls="workspace-sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        light={light}
        active={layout.mobileOrder}
        desktop={desktop}
        onDragWidget={setDraggedId}
        onAdd={(id) => {
          dispatch({ type: "add", id });
          if (!desktop) setMobileOpen(false);
        }}
        onCollapse={() => setCollapsed(!collapsed)}
        onTheme={() => setLight(!light)}
      />
      <div className="workspace-view">
        <Toolbar />
        <Canvas
          layout={layout}
          dispatch={dispatch}
          desktop={desktop}
          draggedId={draggedId}
        />
      </div>
      <div className="mobile-actions" aria-label="Actions mobiles">
        <button
          className="icon-button mobile-library-button"
          type="button"
          aria-label="Bibliothèque de widgets"
          aria-controls="workspace-sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Grid2X2 size={20} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Ajouter un widget"
          aria-controls="workspace-sidebar"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Plus size={22} />
        </button>
        <button
          className="icon-button"
          type="button"
          disabled
          aria-label="Mode présentation"
        >
          <Play size={19} />
        </button>
        <button
          className="icon-button"
          type="button"
          disabled
          aria-label="Profil"
        >
          <UserRound size={20} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-pressed={light}
          aria-label="Changer le thème"
          onClick={() => setLight(!light)}
        >
          {light ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}
