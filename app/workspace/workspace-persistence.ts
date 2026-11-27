import type { PersistStorage } from "zustand/middleware";
import { REFERENCE_WIDTH, type Rect } from "./geometry";
import { isWidgetId, widgetRegistry, type WidgetId } from "./widget-registry";
import type { WorkspaceLayout } from "./workspace-layout";

export const WORKSPACE_STORAGE_KEY = "popbatman-workspace";
export const WORKSPACE_STORAGE_VERSION = 1;
export const MAX_CANVAS_BOTTOM = 1_000_000;

export type Preferences = {
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  language: "fr" | "en";
};

export type PersistedWorkspace = {
  layout: WorkspaceLayout;
  preferences: Preferences;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function decodeRect(id: WidgetId, value: unknown): Rect | null {
  if (!isRecord(value)) return null;
  const { x, y, width, height } = value;
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number" ||
    ![x, y, width, height].every(Number.isFinite) ||
    x < 0 ||
    y < 0 ||
    width <= 0 ||
    height < widgetRegistry[id].minimum.height ||
    x + width > REFERENCE_WIDTH + 1e-6 ||
    y + height > MAX_CANVAS_BOTTOM
  )
    return null;
  return { x, y, width, height };
}

export function isStorableRect(id: WidgetId, rect: Rect) {
  return decodeRect(id, rect) !== null;
}

function decodeOrder(value: unknown, active: Set<WidgetId>): WidgetId[] | null {
  if (!Array.isArray(value) || value.length !== active.size) return null;
  const remaining = new Set(active);
  const order: WidgetId[] = [];
  for (const id of value) {
    if (typeof id !== "string" || !isWidgetId(id) || !remaining.delete(id))
      return null;
    order.push(id);
  }
  return order;
}

export function decodeWorkspace(value: unknown): PersistedWorkspace | null {
  if (
    !isRecord(value) ||
    !isRecord(value.layout) ||
    !isRecord(value.preferences)
  )
    return null;
  const { rects, layers, mobileOrder } = value.layout;
  const { theme, sidebarCollapsed, language } = value.preferences;
  if (
    !isRecord(rects) ||
    typeof sidebarCollapsed !== "boolean" ||
    (theme !== "dark" && theme !== "light") ||
    (language !== "fr" && language !== "en")
  )
    return null;

  const validRects: WorkspaceLayout["rects"] = {};
  const active = new Set<WidgetId>();
  for (const [id, candidate] of Object.entries(rects)) {
    if (!isWidgetId(id)) return null;
    const rect = decodeRect(id, candidate);
    if (!rect) return null;
    validRects[id] = rect;
    active.add(id);
  }
  const validLayers = decodeOrder(layers, active);
  const validMobileOrder = decodeOrder(mobileOrder, active);
  if (!validLayers || !validMobileOrder) return null;
  return {
    layout: {
      rects: validRects,
      layers: validLayers,
      mobileOrder: validMobileOrder,
    },
    preferences: { theme, sidebarCollapsed, language },
  };
}

export const workspaceStorage: PersistStorage<PersistedWorkspace> = {
  getItem(name) {
    try {
      const raw = window.localStorage.getItem(name);
      if (!raw) return null;
      const value: unknown = JSON.parse(raw);
      if (!isRecord(value) || value.version !== WORKSPACE_STORAGE_VERSION)
        return null;
      const state = decodeWorkspace(value.state);
      return state ? { state, version: WORKSPACE_STORAGE_VERSION } : null;
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      window.localStorage.setItem(name, JSON.stringify(value));
    } catch {
      // The session remains usable with blocked storage or an exhausted quota.
    }
  },
  removeItem(name) {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // Storage access is optional.
    }
  },
};
