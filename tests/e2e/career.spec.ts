import { expect, test } from "@playwright/test";

test("orders all experiences and opens detailed and concise career records", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  const timeline = page.locator('[data-widget="experiences"]');
  await expect(
    timeline.getByRole("button").filter({ hasText: /./ }),
  ).toHaveText([
    "Gendarmerie nationale",
    "Armée de l’air et de l’espace",
    "Elée",
    "VITIS",
    "LeasePlan",
  ]);

  const gendarmerie = timeline.getByRole("button", {
    name: "Gendarmerie nationale",
  });
  await gendarmerie.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Gendarmerie nationale" }),
  ).toBeFocused();
  await expect(
    dialog.getByText("Ingénieur logiciel", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText("2025 – Aujourd’hui", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText("Contribution informelle au pilotage technique."),
  ).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Pratiques agentiques" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "IA agentique" }).click();
  await expect(
    dialog.getByRole("heading", { name: "IA agentique" }),
  ).toBeFocused();
  await dialog.getByRole("button", { name: "Fiche précédente" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(gendarmerie).toBeFocused();

  const army = timeline.getByRole("button", {
    name: "Armée de l’air et de l’espace",
  });
  await army.press("Enter");
  await expect(dialog).toHaveAccessibleName("Armée de l’air et de l’espace");
  await expect(
    dialog.getByText("Ingénieur R&D / Officier sous contrat"),
  ).toBeVisible();
  await expect(dialog.getByText(/unique développeur/)).toBeVisible();
  await expect(
    dialog.getByText("Django REST Framework", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(army).toBeFocused();

  const elee = timeline.getByRole("button", { name: "Elée" });
  await elee.press("Enter");
  await expect(dialog).toHaveAccessibleName("Elée");
  await expect(dialog.getByText("2021", { exact: true })).toBeVisible();
  await expect(
    dialog.getByText(/rôle informel de référent frontend/),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(elee).toBeFocused();
  const vitis = timeline.getByRole("button", { name: "VITIS" });
  await vitis.press("Enter");
  await expect(dialog).toHaveAccessibleName("VITIS");
  await expect(dialog.getByText("Alternance puis CDD")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(vitis).toBeFocused();
  const leaseplan = timeline.getByRole("button", { name: "LeasePlan" });
  await leaseplan.press("Enter");
  await expect(dialog).toHaveAccessibleName("LeasePlan");
  await expect(dialog.getByText("Stage puis alternance")).toBeVisible();
  await expect(dialog.getByText("JHipster", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(leaseplan).toBeFocused();
});

test("adds the education and interests widgets on mobile without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 760 });
  await page.goto("./");
  const add = page.getByRole("button", { name: "Ajouter un widget" });
  await add.click();
  await page.getByRole("searchbox").fill("Formations");
  await page.getByRole("button", { name: "Formations", exact: true }).click();
  const education = page.locator('[data-widget="formations"]');
  await expect(education.getByRole("listitem")).toHaveCount(4);
  await expect(education.getByText("Apprentissage autodidacte")).toBeVisible();
  const degree = education.getByRole("button", { name: "BTS SIO" });
  await degree.click();
  const dialog = page.getByRole("dialog", { name: "BTS SIO" });
  await expect(dialog.getByText("IMCP", { exact: true })).toBeVisible();
  await expect(dialog.getByText("2015 – 2017")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(degree).toBeFocused();
  await add.click();
  await page.getByRole("searchbox").fill("Centres");
  await page
    .getByRole("button", { name: "Centres d’intérêt", exact: true })
    .click();
  const interests = page.locator('[data-widget="interets"]');
  await expect(interests.getByRole("listitem")).toHaveText([
    "Tennis et engagement associatif",
    "Finance",
    "Intelligence artificielle",
    "Nouvelles technologies",
    "Culture fantastique et Le Seigneur des anneaux",
  ]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    375,
  );
});
