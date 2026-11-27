import { describe, expect, it } from "vitest";
import {
  boundRect,
  positionWidget,
  projectRect,
  toLayoutRect,
} from "../app/workspace/geometry";
import {
  initialLayout,
  workspaceReducer,
} from "../app/workspace/workspace-layout";

const minimum = { width: 100, height: 80 };
const widget = { x: 85, y: 204, width: 190, height: 100 };
const neighbor = { x: 90, y: 200, width: 190, height: 100 };

describe("workspace geometry", () => {
  it("never writes projected geometry back on viewport or sidebar changes", () => {
    const authored = toLayoutRect(widget, 980);
    expect(projectRect(authored, 980, minimum)).toEqual(widget);
    expect(projectRect(authored, 660, minimum)).toEqual({
      x: 57,
      y: 204,
      width: 128,
      height: 100,
    });
    expect(projectRect(authored, 980, minimum)).toEqual(widget);
  });

  it("bounds the left, right, and top but permits vertical extension", () => {
    expect(boundRect({ ...widget, x: -5, y: -8 }, 500, minimum)).toMatchObject({
      x: 0,
      y: 0,
    });
    expect(
      boundRect({ ...widget, x: 490, y: 3210 }, 500, minimum),
    ).toMatchObject({ x: 310, y: 3210 });
    expect(boundRect({ ...widget, width: 700 }, 500, minimum)).toMatchObject({
      x: 0,
      width: 500,
    });
  });

  it("snaps nearby edges and centers without rejecting overlapping widgets", () => {
    expect(positionWidget(widget, [neighbor], 500, minimum)).toEqual({
      rect: neighbor,
      guides: { x: 90, y: 200 },
    });
    const small = { x: 131, y: 401, width: 100, height: 100 };
    expect(positionWidget(small, [neighbor], 500, minimum)).toEqual({
      rect: { ...small, x: 135 },
      guides: { x: 185, y: null },
    });
  });

  it("leaves free pixel positions outside the snap threshold", () => {
    const far = { ...widget, x: 107, y: 234 };
    expect(positionWidget(far, [neighbor], 500, minimum)).toEqual({
      rect: far,
      guides: { x: null, y: null },
    });
  });

  it("snaps only the moving resize edges and keeps the opposite edges anchored", () => {
    const rect = { x: 210, y: 25, width: 196, height: 171 };
    const target = { x: 400, y: 200, width: 70, height: 90 };
    expect(
      positionWidget(rect, [target], 500, minimum, {
        right: true,
        bottom: true,
      }),
    ).toEqual({
      rect: { x: 210, y: 25, width: 190, height: 175 },
      guides: { x: 400, y: 200 },
    });
    expect(
      positionWidget(
        { ...rect, x: -30, width: 226, y: -9, height: 205 },
        [],
        500,
        minimum,
        { left: true, top: true },
      ).rect,
    ).toEqual({ x: 0, y: 0, width: 196, height: 196 });
  });
});

describe("shared widget state", () => {
  it("shares membership, blocks duplicates and keeps mobile order independent from depth", () => {
    const added = workspaceReducer(initialLayout, { type: "add", id: "cv" });
    expect(workspaceReducer(added, { type: "add", id: "cv" })).toBe(added);
    const layered = workspaceReducer(added, {
      type: "layer",
      id: "cv",
      action: "back",
    });
    expect(layered.layers[0]).toBe("cv");
    expect(layered.mobileOrder.at(-1)).toBe("cv");
    const moved = workspaceReducer(layered, {
      type: "reorder",
      id: "cv",
      step: -1,
    });
    expect(moved.layers).toBe(layered.layers);
    expect(moved.rects).toBe(layered.rects);
    const removed = workspaceReducer(moved, { type: "remove", id: "cv" });
    expect(removed.rects.cv).toBeUndefined();
    expect(removed.layers).not.toContain("cv");
    expect(removed.mobileOrder).not.toContain("cv");
  });
});
