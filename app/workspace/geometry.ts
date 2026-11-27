export type Rect = { x: number; y: number; width: number; height: number };
export type Size = Pick<Rect, "width" | "height">;
export type Edges = {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
};
export type Guides = { x: number | null; y: number | null };

// The authored horizontal geometry stays in one coordinate space across viewport changes.
export const REFERENCE_WIDTH = 1138;
export const SNAP_DISTANCE = 8;
const NO_GUIDES: Guides = { x: null, y: null };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function boundRect(
  rect: Rect,
  canvasWidth: number,
  minimum: Size,
): Rect {
  const width = clamp(
    rect.width,
    Math.min(minimum.width, canvasWidth),
    canvasWidth,
  );
  return {
    x: clamp(rect.x, 0, canvasWidth - width),
    y: Math.max(0, rect.y),
    width,
    height: Math.max(minimum.height, rect.height),
  };
}

function boundResize(
  rect: Rect,
  canvasWidth: number,
  minimum: Size,
  edges: Edges,
): Rect {
  const minWidth = Math.min(minimum.width, canvasWidth);
  const right = clamp(rect.x + rect.width, minWidth, canvasWidth);
  const x = edges.left
    ? clamp(rect.x, 0, right - minWidth)
    : clamp(rect.x, 0, canvasWidth - minWidth);
  const bottom = Math.max(minimum.height, rect.y + rect.height);
  const y = edges.top
    ? clamp(rect.y, 0, bottom - minimum.height)
    : Math.max(0, rect.y);
  return {
    x,
    y,
    width: edges.left
      ? right - x
      : clamp(rect.width, minWidth, canvasWidth - x),
    height: edges.top ? bottom - y : Math.max(minimum.height, rect.height),
  };
}

export function projectRect(rect: Rect, width: number, minimum: Size): Rect {
  const scale = width / REFERENCE_WIDTH;
  const x = Math.round(rect.x * scale);
  const right = Math.round((rect.x + rect.width) * scale);
  return boundRect({ ...rect, x, width: right - x }, width, minimum);
}

export function toLayoutRect(rect: Rect, width: number): Rect {
  const scale = REFERENCE_WIDTH / width;
  return { ...rect, x: rect.x * scale, width: rect.width * scale };
}

function nearestMatch(
  points: number[],
  targets: number[],
  isAllowed: (delta: number) => boolean,
) {
  let closest: { target: number; delta: number } | null = null;
  for (const point of points) {
    for (const target of targets) {
      const delta = target - point;
      if (
        Math.abs(delta) <= SNAP_DISTANCE &&
        isAllowed(delta) &&
        (!closest || Math.abs(delta) < Math.abs(closest.delta))
      ) {
        closest = { target, delta };
      }
    }
  }
  return closest;
}

export function positionWidget(
  input: Rect,
  others: Rect[],
  canvasWidth: number,
  minimum: Size,
  edges?: Edges,
): { rect: Rect; guides: Guides } {
  const rect = edges
    ? boundResize(input, canvasWidth, minimum, edges)
    : boundRect(input, canvasWidth, minimum);
  const { x, y, width, height } = rect;
  const minWidth = Math.min(canvasWidth, minimum.width);
  const xPoints = edges
    ? edges.left
      ? [x]
      : edges.right
        ? [x + width]
        : []
    : [x, x + width / 2, x + width];
  const yPoints = edges
    ? edges.top
      ? [y]
      : edges.bottom
        ? [y + height]
        : []
    : [y, y + height / 2, y + height];
  const horizontal = nearestMatch(
    xPoints,
    [
      0,
      canvasWidth,
      ...others.flatMap((other) => [
        other.x,
        other.x + other.width / 2,
        other.x + other.width,
      ]),
    ],
    (delta) => {
      if (edges?.left) return x + delta >= 0 && width - delta >= minWidth;
      if (edges?.right)
        return width + delta >= minWidth && x + width + delta <= canvasWidth;
      return x + delta >= 0 && x + width + delta <= canvasWidth;
    },
  );
  const vertical = nearestMatch(
    yPoints,
    [
      0,
      ...others.flatMap((other) => [
        other.y,
        other.y + other.height / 2,
        other.y + other.height,
      ]),
    ],
    (delta) => {
      if (edges?.top) return y + delta >= 0 && height - delta >= minimum.height;
      if (edges?.bottom) return height + delta >= minimum.height;
      return y + delta >= 0;
    },
  );

  if (!horizontal && !vertical) return { rect, guides: NO_GUIDES };
  const dx = horizontal?.delta ?? 0;
  const dy = vertical?.delta ?? 0;
  return {
    rect: {
      x: edges?.right ? x : x + dx,
      y: edges?.bottom ? y : y + dy,
      width: width + (edges?.right ? dx : edges?.left ? -dx : 0),
      height: height + (edges?.bottom ? dy : edges?.top ? -dy : 0),
    },
    guides: { x: horizontal?.target ?? null, y: vertical?.target ?? null },
  };
}
