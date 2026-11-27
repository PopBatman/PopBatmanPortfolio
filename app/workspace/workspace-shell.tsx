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
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas } from "./canvas";
import { useWorkspaceStore } from "./workspace-store";
import { WorkspaceDialog } from "./workspace-dialog";
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
  desktop,
  onAdd,
  onDragWidget,
  onCollapse,
  onReset,
  onTheme,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  light: boolean;
  desktop: boolean;
  onAdd: (id: WidgetId) => void;
  onDragWidget: (id: WidgetId | null) => void;
  onCollapse: () => void;
  onReset: () => void;
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
          desktop={desktop}
          onAdd={onAdd}
          onDragWidget={onDragWidget}
        />
        <div className="sidebar-actions">
          <div className="history-actions">
            <HistoryButtons />
          </div>
          <button type="button" onClick={onReset}>
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

function HistoryButtons({ compact = false }: { compact?: boolean }) {
  const canUndo = useWorkspaceStore((state) => state.past.length > 0);
  const canRedo = useWorkspaceStore((state) => state.future.length > 0);
  const undo = useWorkspaceStore((state) => state.undo);
  const redo = useWorkspaceStore((state) => state.redo);
  return (
    <>
      <button
        type="button"
        className={compact ? "icon-button" : undefined}
        disabled={!canUndo}
        aria-label="Annuler"
        onClick={undo}
      >
        <Undo2 size={17} aria-hidden="true" />
        {!compact && "Annuler"}
      </button>
      <button
        type="button"
        className={compact ? "icon-button" : undefined}
        disabled={!canRedo}
        aria-label="Rétablir"
        onClick={redo}
      >
        <Redo2 size={17} aria-hidden="true" />
        {!compact && "Rétablir"}
      </button>
    </>
  );
}

function Toolbar({
  fullscreen,
  presenting,
  onFullscreen,
  onPresentation,
}: {
  fullscreen: boolean;
  presenting: boolean;
  onFullscreen: () => void;
  onPresentation: () => void;
}) {
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
        {!presenting && (
          <>
            <HistoryButtons compact />
            <span className="toolbar-divider" />
          </>
        )}
        <button
          className="icon-button outlined"
          type="button"
          aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
          aria-pressed={fullscreen}
          onClick={onFullscreen}
        >
          <Monitor size={17} aria-hidden="true" />
        </button>
        <button
          className="presentation-button"
          type="button"
          aria-pressed={presenting}
          onClick={onPresentation}
        >
          {presenting ? (
            <X size={14} aria-hidden="true" />
          ) : (
            <Play size={14} aria-hidden="true" />
          )}
          {presenting ? "Quitter la présentation" : "Présentation"}
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
  const shell = useRef<HTMLDivElement>(null);
  const dispatch = useWorkspaceStore((state) => state.dispatch);
  const reset = useWorkspaceStore((state) => state.reset);
  const light = useWorkspaceStore(
    (state) => state.preferences.theme === "light",
  );
  const collapsed = useWorkspaceStore(
    (state) => state.preferences.sidebarCollapsed,
  );
  const toggleTheme = useWorkspaceStore((state) => state.toggleTheme);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<WidgetId | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [fullscreen, setFullscreen] = useState<"native" | "fallback" | null>(
    null,
  );

  useEffect(() => {
    if (!useWorkspaceStore.persist.hasHydrated())
      void useWorkspaceStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    function syncFullscreen() {
      setFullscreen((current) =>
        document.fullscreenElement === shell.current
          ? "native"
          : current === "native"
            ? null
            : current,
      );
    }
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape" || document.querySelector("dialog[open]"))
        return;
      if (fullscreen === "fallback") setFullscreen(null);
      else if (presenting) setPresenting(false);
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [fullscreen, presenting]);

  async function toggleFullscreen() {
    const element = shell.current;
    if (!element) return;
    if (fullscreen === "fallback") {
      setFullscreen(null);
      return;
    }
    if (document.fullscreenElement === element) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    try {
      await element.requestFullscreen();
    } catch {
      setFullscreen("fallback");
    }
  }

  function togglePresentation() {
    setPresenting((current) => !current);
    setMobileOpen(false);
  }

  return (
    <div
      ref={shell}
      className="workspace"
      data-presenting={presenting}
      data-fullscreen={fullscreen}
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
        desktop={desktop}
        onDragWidget={setDraggedId}
        onAdd={(id) => {
          dispatch({ type: "add", id });
          if (!desktop) setMobileOpen(false);
        }}
        onCollapse={toggleSidebar}
        onReset={() => setConfirmReset(true)}
        onTheme={toggleTheme}
      />
      <div className="workspace-view">
        <Toolbar
          fullscreen={fullscreen !== null}
          presenting={presenting}
          onFullscreen={() => void toggleFullscreen()}
          onPresentation={togglePresentation}
        />
        <Canvas
          desktop={desktop}
          draggedId={draggedId}
          presenting={presenting}
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
          aria-label={
            presenting ? "Quitter le mode présentation" : "Mode présentation"
          }
          aria-pressed={presenting}
          onClick={togglePresentation}
        >
          {presenting ? <X size={19} /> : <Play size={19} />}
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
          aria-pressed={fullscreen !== null}
          onClick={() => void toggleFullscreen()}
        >
          <Monitor size={19} aria-hidden="true" />
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
          onClick={toggleTheme}
        >
          {light ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      {confirmReset && (
        <WorkspaceDialog
          className="reset-dialog"
          titleId="workspace-reset-title"
          onClose={() => setConfirmReset(false)}
        >
          <h2 id="workspace-reset-title">Réinitialiser la disposition ?</h2>
          <p>
            La disposition initiale sera rétablie. Vous pourrez annuler cette
            action.
          </p>
          <form className="reset-actions" method="dialog">
            <button type="submit" className="outlined">
              Annuler
            </button>
            <button type="submit" className="widget-apply" onClick={reset}>
              Réinitialiser
            </button>
          </form>
        </WorkspaceDialog>
      )}
    </div>
  );
}
