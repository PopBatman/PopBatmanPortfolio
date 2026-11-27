import { REFERENCE_WIDTH, type Rect } from "./geometry";
import { widgetRegistry, type WidgetId } from "./widget-registry";

export type LayerAction = "front" | "forward" | "backward" | "back";
type Layout = Partial<Record<WidgetId, Rect>>;

export type WorkspaceLayout = {
  rects: Layout;
  layers: WidgetId[];
  mobileOrder: WidgetId[];
};

export type LayoutAction =
  | { type: "add"; id: WidgetId; rect?: Rect }
  | { type: "remove"; id: WidgetId }
  | { type: "place"; id: WidgetId; rect: Rect }
  | { type: "layer"; id: WidgetId; action: LayerAction }
  | { type: "reorder"; id: WidgetId; step: -1 | 1 };

const initialRects = {
  presentation: { x: 0, y: 0, width: 753, height: 322 },
  disponibilite: { x: 771, y: 0, width: 367, height: 162 },
  contact: { x: 771, y: 180, width: 367, height: 142 },
  experiences: { x: 0, y: 340, width: 560, height: 208 },
  stack: { x: 578, y: 340, width: 560, height: 208 },
  botty: { x: 0, y: 566, width: 367, height: 143 },
  workflow: { x: 385, y: 566, width: 367, height: 143 },
  lestudio: { x: 770, y: 566, width: 368, height: 143 },
} satisfies Layout;

const initialOrder = Object.keys(initialRects) as WidgetId[];

export const initialLayout: WorkspaceLayout = {
  rects: initialRects,
  layers: initialOrder,
  mobileOrder: initialOrder,
};

function moveItem(items: WidgetId[], id: WidgetId, destination: number) {
  const source = items.indexOf(id);
  const target = Math.max(0, Math.min(items.length - 1, destination));
  if (source === target) return items;
  const result = [...items];
  result.splice(source, 1);
  result.splice(target, 0, id);
  return result;
}

export function layoutBottom(rects: Rect[]) {
  return Math.max(0, ...rects.map(({ y, height }) => y + height));
}

export function newWidgetRect(id: WidgetId, y: number): Rect {
  const { minimum } = widgetRegistry[id];
  return {
    x: 0,
    y,
    width: Math.max(REFERENCE_WIDTH / 3, minimum.width),
    height: Math.max(152, minimum.height),
  };
}

export function applyLayoutAction(
  state: WorkspaceLayout,
  action: LayoutAction,
): WorkspaceLayout {
  const { id } = action;
  if (action.type === "add") {
    if (state.rects[id]) return state;
    return {
      rects: {
        ...state.rects,
        [id]:
          action.rect ??
          newWidgetRect(id, layoutBottom(Object.values(state.rects)) + 18),
      },
      layers: [...state.layers, id],
      mobileOrder: [...state.mobileOrder, id],
    };
  }
  if (!state.rects[id]) return state;

  switch (action.type) {
    case "remove": {
      const rects = { ...state.rects };
      delete rects[id];
      return {
        rects,
        layers: state.layers.filter((item) => item !== id),
        mobileOrder: state.mobileOrder.filter((item) => item !== id),
      };
    }
    case "place": {
      const previous = state.rects[id];
      const next = action.rect;
      if (sameRect(previous, next)) return state;
      return { ...state, rects: { ...state.rects, [id]: next } };
    }
    case "reorder": {
      const mobileOrder = moveItem(
        state.mobileOrder,
        id,
        state.mobileOrder.indexOf(id) + action.step,
      );
      return mobileOrder === state.mobileOrder
        ? state
        : { ...state, mobileOrder };
    }
    case "layer": {
      const position = state.layers.indexOf(id);
      const destinations = {
        front: state.layers.length - 1,
        forward: position + 1,
        backward: position - 1,
        back: 0,
      };
      const layers = moveItem(state.layers, id, destinations[action.action]);
      return layers === state.layers ? state : { ...state, layers };
    }
  }
}

export function sameRect(a: Rect, b: Rect) {
  return (
    Math.abs(a.x - b.x) < 1e-6 &&
    Math.abs(a.y - b.y) < 1e-6 &&
    Math.abs(a.width - b.width) < 1e-6 &&
    Math.abs(a.height - b.height) < 1e-6
  );
}
