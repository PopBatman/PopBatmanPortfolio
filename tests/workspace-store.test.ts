import { afterEach, describe, expect, it, vi } from "vitest";
import { initialLayout } from "../app/workspace/workspace-layout";
import {
  WORKSPACE_STORAGE_KEY,
  WORKSPACE_STORAGE_VERSION,
  decodeWorkspace,
} from "../app/workspace/workspace-persistence";
import {
  createWorkspaceStore,
  HISTORY_LIMIT,
} from "../app/workspace/workspace-store";

function memoryStorage() {
  const saved = new Map<string, string>();
  const storage = {
    getItem: vi.fn((key: string) => saved.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => saved.set(key, value)),
    removeItem: vi.fn((key: string) => saved.delete(key)),
  };
  vi.stubGlobal("window", { localStorage: storage });
  return { saved, storage };
}

afterEach(() => vi.unstubAllGlobals());

describe("workspace history", () => {
  it("keeps only 50 layout transactions and invalidates redo after a new edit", () => {
    const { storage } = memoryStorage();
    const store = createWorkspaceStore();
    const { dispatch, undo, redo } = store.getState();
    const original = initialLayout.rects.botty!;
    for (let i = 1; i <= HISTORY_LIMIT + 5; i++) {
      dispatch({
        type: "place",
        id: "botty",
        rect: { ...original, y: original.y + i },
      });
    }
    expect(store.getState().past).toHaveLength(50);
    for (let i = 0; i < HISTORY_LIMIT; i++) undo();
    expect(store.getState().layout.rects.botty?.y).toBe(original.y + 5);
    expect(store.getState().future).toHaveLength(50);
    redo();
    expect(store.getState().layout.rects.botty?.y).toBe(original.y + 6);

    const calls = storage.setItem.mock.calls.length;
    dispatch({ type: "add", id: "botty" });
    dispatch({
      type: "place",
      id: "botty",
      rect: { ...original, y: original.y + 6 },
    });
    dispatch({ type: "layer", id: "botty", action: "front" });
    dispatch({ type: "reorder", id: "presentation", step: -1 });
    expect(storage.setItem).toHaveBeenCalledTimes(calls);
    expect(store.getState().future).toHaveLength(49);

    dispatch({ type: "remove", id: "botty" });
    expect(store.getState().future).toEqual([]);
    expect(store.getState().layout.rects.botty).toBeUndefined();
  });

  it("resets layout as one transaction while preserving preferences", async () => {
    const { saved } = memoryStorage();
    saved.set(
      WORKSPACE_STORAGE_KEY,
      JSON.stringify({
        version: WORKSPACE_STORAGE_VERSION,
        state: {
          layout: initialLayout,
          preferences: {
            theme: "light",
            language: "en",
            sidebarCollapsed: true,
          },
        },
      }),
    );
    const store = createWorkspaceStore();
    expect(store.getState().preferences.language).toBe("fr");
    await store.persist.rehydrate();
    const { preferences, dispatch, reset, undo } = store.getState();
    dispatch({ type: "remove", id: "presentation" });
    reset();
    reset();
    expect(store.getState().layout).toBe(initialLayout);
    expect(store.getState().past).toHaveLength(2);
    expect(store.getState().preferences).toEqual({
      theme: "light",
      language: "en",
      sidebarCollapsed: true,
    });
    undo();
    expect(store.getState().layout.rects.presentation).toBeUndefined();
    expect(store.getState().preferences).toBe(preferences);

    const reloaded = createWorkspaceStore();
    await reloaded.persist.rehydrate();
    expect(reloaded.getState().layout).toEqual(store.getState().layout);
    expect(reloaded.getState().past).toEqual([]);
    expect(reloaded.getState().future).toEqual([]);
    expect(
      Object.keys(JSON.parse(saved.get(WORKSPACE_STORAGE_KEY)!).state).sort(),
    ).toEqual(["layout", "preferences"]);
  });
});

describe("workspace persistence validation", () => {
  const snapshot = {
    layout: initialLayout,
    preferences: { theme: "dark", language: "fr", sidebarCollapsed: false },
  };

  it.each([
    {
      ...initialLayout,
      layers: ["presentation", ...initialLayout.layers.slice(0, -1)],
    },
    {
      ...initialLayout,
      mobileOrder: [...initialLayout.mobileOrder, "architecture"],
    },
    {
      ...initialLayout,
      rects: {
        ...initialLayout.rects,
        botty: { ...initialLayout.rects.botty, width: Infinity },
      },
    },
    {
      ...initialLayout,
      rects: {
        ...initialLayout.rects,
        botty: { ...initialLayout.rects.botty, x: 1100 },
      },
    },
    {
      ...initialLayout,
      rects: {
        ...initialLayout.rects,
        botty: { ...initialLayout.rects.botty, height: 1e50 },
      },
    },
    {
      ...initialLayout,
      rects: {
        ...initialLayout.rects,
        unregistered: initialLayout.rects.botty,
      },
    },
  ])("rejects invalid layout %#", (layout) => {
    expect(decodeWorkspace({ ...snapshot, layout })).toBeNull();
  });

  it("supports an intentionally empty layout", () => {
    const empty = {
      ...snapshot,
      layout: { rects: {}, layers: [], mobileOrder: [] },
    };
    expect(decodeWorkspace(empty)).toEqual(empty);
  });

  it("ignores unknown versions without prematurely overwriting storage", async () => {
    const { saved, storage } = memoryStorage();
    saved.set(
      WORKSPACE_STORAGE_KEY,
      JSON.stringify({ version: 999, state: snapshot }),
    );
    const store = createWorkspaceStore();
    await store.persist.rehydrate();
    expect(store.getState().layout).toBe(initialLayout);
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
