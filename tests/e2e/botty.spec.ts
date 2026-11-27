import { expect, test } from "@playwright/test";

test("opens Botty’s case, explores the diagram and restores dialog focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  const trigger = page.getByRole("button", {
    name: "Consulter l’étude de cas",
  });
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Botty", exact: true }),
  ).toBeFocused();
  await expect(
    dialog.getByText(
      /Une année de développement sans IA, suivie de six mois avec IA/,
    ),
  ).toBeVisible();
  await expect(dialog.getByText("Arrêt du produit prévu.")).toBeVisible();
  await expect(dialog.getByRole("link")).toHaveCount(0);
  await dialog
    .getByRole("button", { name: "Architecture de Botty" })
    .press("Enter");
  await expect(
    dialog.getByRole("heading", { name: "Architecture de Botty" }),
  ).toBeFocused();
  await expect(dialog.getByText(/Schéma de travail à valider/)).toBeVisible();
  const diagram = dialog.locator(".architecture-flow");
  await expect(diagram.locator(".react-flow__node")).toHaveCount(5);
  await expect(diagram.locator(".react-flow__edge")).toHaveCount(4);
  await diagram
    .locator(".react-flow__node")
    .filter({ hasText: "API Python / Flask" })
    .click();
  const text = dialog.getByRole("region", {
    name: "Description textuelle du schéma",
  });
  await expect(
    text.getByRole("button", { name: "API Python / Flask" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    text.getByText("PostgreSQL ↔ API Python / Flask", { exact: true }),
  ).toBeVisible();
  await text.getByRole("button", { name: "Traitement Python" }).press("Enter");
  await expect(text.getByText(/effectuer des backtests/)).toBeVisible();
  await dialog.getByRole("button", { name: "Fiche précédente" }).click();
  await expect(
    dialog.getByRole("heading", { name: "Botty", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("navigates from a career technology without changing its historical label", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 760 });
  await page.goto("./");
  await page
    .getByRole("button", { name: "Armée de l’air et de l’espace" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("Armée de l’air et de l’espace");
  await dialog
    .getByRole("button", { name: "React", exact: true })
    .press("Enter");
  await expect(
    dialog.getByRole("heading", { name: "React.js", exact: true }),
  ).toBeFocused();
  await dialog.getByRole("button", { name: "Fiche précédente" }).click();
  await expect(
    dialog.getByRole("button", { name: "React", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Consulter l’étude de cas" }).click();
  await dialog.getByRole("button", { name: "Architecture de Botty" }).click();
  await expect(
    dialog.getByRole("region", { name: "Description textuelle du schéma" }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    375,
  );
});

test("loads a legacy layout, preserves preferences and never restores retired widgets through history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  const key = "popbatman-workspace";
  const legacy = {
    version: 1,
    state: {
      layout: {
        rects: {
          botty: { x: 137, y: 619, width: 310, height: 152 },
          contact: { x: 771, y: 182, width: 350, height: 143 },
          workflow: { x: 385, y: 566, width: 367, height: 143 },
          lestudio: { x: 770, y: 566, width: 368, height: 143 },
          portfolio: { x: 0, y: 730, width: 367, height: 143 },
        },
        layers: ["workflow", "contact", "portfolio", "botty", "lestudio"],
        mobileOrder: ["lestudio", "botty", "portfolio", "contact", "workflow"],
      },
      preferences: { theme: "light", sidebarCollapsed: true, language: "en" },
    },
  };
  await page.goto("./");
  await page.evaluate(
    ({ key, legacy }) => localStorage.setItem(key, JSON.stringify(legacy)),
    { key, legacy },
  );
  await page.reload();
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  await expect(page.locator(".workspace")).toHaveAttribute(
    "data-theme",
    "light",
  );
  await expect(page.locator(".workspace")).toHaveAttribute(
    "data-collapsed",
    "true",
  );
  const widgets = page.locator("main .widget");
  const retired = page.locator(
    '[data-widget="workflow"], [data-widget="lestudio"], [data-widget="portfolio"]',
  );
  await expect(widgets).toHaveCount(2);
  await expect(retired).toHaveCount(0);
  const stored = () =>
    page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), key);
  const migrated = await stored();
  expect(migrated.state.layout).toEqual({
    rects: {
      botty: legacy.state.layout.rects.botty,
      contact: legacy.state.layout.rects.contact,
    },
    layers: ["contact", "botty"],
    mobileOrder: ["botty", "contact"],
  });
  expect(migrated.state.preferences).toEqual(legacy.state.preferences);
  await page
    .getByRole("button", { name: "Déployer la barre latérale" })
    .click();
  const filtered = await stored();
  expect(filtered.state.preferences).toEqual({
    ...legacy.state.preferences,
    sidebarCollapsed: false,
  });
  await page.getByRole("searchbox").fill("LeStudio");
  await expect(page.getByText("Aucun widget trouvé.")).toBeVisible();
  await page
    .getByRole("button", { name: "Réinitialiser", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Réinitialiser" })
    .click();
  await expect(widgets).toHaveCount(6);
  await expect(retired).toHaveCount(0);
  const toolbar = page.locator(".toolbar");
  await toolbar.getByRole("button", { name: "Annuler", exact: true }).click();
  await expect(widgets).toHaveCount(2);
  expect(await stored()).toEqual(filtered);
  await toolbar.getByRole("button", { name: "Rétablir", exact: true }).click();
  await expect(widgets).toHaveCount(6);
  await expect(retired).toHaveCount(0);
});
