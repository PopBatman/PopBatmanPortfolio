"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  isStorableRect,
  WORKSPACE_STORAGE_KEY,
  WORKSPACE_STORAGE_VERSION,
  workspaceStorage,
  type PersistedWorkspace,
} from "./workspace-persistence";
import {
  applyLayoutAction,
  initialLayout,
  sameRect,
  type LayoutAction,
  type WorkspaceLayout,
} from "./workspace-layout";

export const HISTORY_LIMIT = 50;

type WorkspaceState = PersistedWorkspace & {
  past: WorkspaceLayout[];
  future: WorkspaceLayout[];
  dispatch: (action: LayoutAction) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
};

function sameOrder(first: string[], second: string[]) {
  return (
    first.length === second.length &&
    first.every((id, index) => id === second[index])
  );
}

function isInitialLayout(layout: WorkspaceLayout) {
  return (
    sameOrder(layout.layers, initialLayout.layers) &&
    sameOrder(layout.mobileOrder, initialLayout.mobileOrder) &&
    initialLayout.layers.every((id) =>
      sameRect(layout.rects[id]!, initialLayout.rects[id]!),
    )
  );
}

export function createWorkspaceStore() {
  return create<WorkspaceState>()(
    persist(
      (set, get) => {
        function commit(layout: WorkspaceLayout) {
          const current = get();
          if (layout === current.layout) return;
          set({
            layout,
            past: [...current.past, current.layout].slice(-HISTORY_LIMIT),
            future: [],
          });
        }

        return {
          layout: initialLayout,
          preferences: {
            theme: "dark",
            sidebarCollapsed: false,
            language: "fr",
          },
          past: [],
          future: [],
          dispatch(action) {
            const next = applyLayoutAction(get().layout, action);
            const rect = next.rects[action.id];
            if (rect && !isStorableRect(action.id, rect)) return;
            commit(next);
          },
          undo() {
            const { past, future, layout } = get();
            const previous = past.at(-1);
            if (!previous) return;
            set({
              layout: previous,
              past: past.slice(0, -1),
              future: [layout, ...future],
            });
          },
          redo() {
            const { past, future, layout } = get();
            const next = future[0];
            if (!next) return;
            set({
              layout: next,
              past: [...past, layout],
              future: future.slice(1),
            });
          },
          reset() {
            if (!isInitialLayout(get().layout)) commit(initialLayout);
          },
          toggleTheme() {
            const { preferences } = get();
            set({
              preferences: {
                ...preferences,
                theme: preferences.theme === "dark" ? "light" : "dark",
              },
            });
          },
          toggleSidebar() {
            const { preferences } = get();
            set({
              preferences: {
                ...preferences,
                sidebarCollapsed: !preferences.sidebarCollapsed,
              },
            });
          },
        };
      },
      {
        name: WORKSPACE_STORAGE_KEY,
        version: WORKSPACE_STORAGE_VERSION,
        storage: workspaceStorage,
        skipHydration: true,
        partialize: ({ layout, preferences }) => ({ layout, preferences }),
      },
    ),
  );
}

export const useWorkspaceStore = createWorkspaceStore();
