import { expect, it } from "vitest";
import { BOTTY_ARCHITECTURE_ID, BOTTY_ID } from "../app/content/botty-content";
import {
  professionalContent,
  publishedEntries,
  relatedDetails,
  validateContent,
} from "../app/content/professional-content";
import { decodeWorkspace } from "../app/workspace/workspace-persistence";
import { initialLayout } from "../app/workspace/workspace-layout";

it("keeps Botty as the sole published project and marks the conceptual architecture", () => {
  expect(validateContent(professionalContent)).toEqual([]);
  const projects = publishedEntries("project", "fr");
  expect(projects.map(({ entity }) => entity.id)).toEqual([BOTTY_ID]);
  expect(projects[0].entity.stage).toBe("operational");
  expect(projects[0].copy.paragraphs?.[0]).toContain(
    "au moment de l’atelier éditorial",
  );
  expect(
    relatedDetails(projects[0].entity, "fr").map(({ entity }) => entity.id),
  ).toContain(BOTTY_ARCHITECTURE_ID);
  const architecture = publishedEntries("architecture", "fr")[0];
  expect(architecture.copy.paragraphs?.[0]).toContain("à valider");
  expect(
    architecture.entity.diagram?.connections.map(
      ({ from, to, bidirectional }) => [from, to, !!bidirectional],
    ),
  ).toEqual([
    ["market", "processing", false],
    ["processing", "database", false],
    ["database", "api", true],
    ["api", "mobile", true],
  ]);
});

it("filters only retired widget identifiers at the v1 persistence boundary", () => {
  const customBotty = { x: 143, y: 646, width: 371, height: 170 };
  const preferences = {
    theme: "light",
    sidebarCollapsed: true,
    language: "en",
  };
  const legacy = {
    layout: {
      rects: {
        ...initialLayout.rects,
        botty: customBotty,
        workflow: {},
        lestudio: {},
        portfolio: {},
      },
      layers: [
        "workflow",
        "botty",
        ...initialLayout.layers.filter((id) => id !== "botty"),
        "lestudio",
        "portfolio",
      ],
      mobileOrder: [
        "portfolio",
        ...initialLayout.mobileOrder,
        "lestudio",
        "workflow",
      ],
    },
    preferences,
  };
  expect(decodeWorkspace(legacy)).toEqual({
    layout: {
      rects: { ...initialLayout.rects, botty: customBotty },
      layers: ["botty", ...initialLayout.layers.filter((id) => id !== "botty")],
      mobileOrder: initialLayout.mobileOrder,
    },
    preferences,
  });
  expect(
    decodeWorkspace({
      ...legacy,
      layout: {
        ...legacy.layout,
        layers: [...legacy.layout.layers, "unexpected"],
      },
    }),
  ).toBeNull();
  expect(
    decodeWorkspace({
      ...legacy,
      layout: {
        ...legacy.layout,
        rects: { ...legacy.layout.rects, unexpected: {} },
      },
    }),
  ).toBeNull();
});
