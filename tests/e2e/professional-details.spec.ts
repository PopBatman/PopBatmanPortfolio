import { expect, test } from "@playwright/test";

test("opens the profile, navigates related details and restores keyboard focus on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  const profile = page.locator('[data-widget="presentation"]');
  await expect(
    profile.getByRole("heading", { name: "Développeur polyvalent" }),
  ).toBeVisible();
  await expect(
    profile.getByText(
      "FullStack · Architecture logicielle · Pilotage technique · IA agentique",
    ),
  ).toBeVisible();
  const trigger = profile.getByRole("button", { name: "Consulter le profil" });
  await trigger.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("Développeur polyvalent");
  await expect(
    dialog.getByRole("heading", { name: "Développeur polyvalent" }),
  ).toBeFocused();
  await dialog
    .getByRole("button", { name: "Architecture logicielle" })
    .press("Enter");
  await expect(
    dialog.getByRole("heading", { name: "Architecture logicielle" }),
  ).toBeFocused();
  await dialog.getByRole("button", { name: "Fiche précédente" }).click();
  await expect(dialog).toHaveAccessibleName("Développeur polyvalent");
  await dialog
    .getByRole("button", { name: "À l’écoute de nouvelles opportunités" })
    .click();
  await expect(dialog).toHaveAccessibleName(
    "À l’écoute de nouvelles opportunités",
  );
  await expect(
    dialog.getByText("CDI · Freelance", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText(/Chef de projet technique.*DevOps/),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("shows availability badges and scroll-safe details on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 760 });
  await page.goto("./");
  const widget = page.locator('[data-widget="disponibilite"]');
  await expect(
    widget.getByText("À l’écoute de nouvelles opportunités"),
  ).toBeVisible();
  await expect(widget.getByRole("listitem")).toHaveText([
    "CDI",
    "Freelance",
    "France",
    "International",
    "Hybride",
    "Télétravail",
  ]);
  const trigger = widget.getByRole("button", { name: "Détails" });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "À l’écoute de nouvelles opportunités",
  });
  await expect(dialog.getByText(/IA \/ automatisation/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    375,
  );
  await dialog.getByRole("button", { name: "Fermer la fiche" }).click();
  await expect(trigger).toBeFocused();
});

test("closes only the detail dialog when it opens from a fullscreen widget", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Options : Présentation" }).click();
  await page.getByRole("button", { name: "Agrandir le widget" }).click();
  const fullscreen = page.getByRole("dialog", {
    name: "Présentation",
    exact: true,
  });
  const trigger = fullscreen.getByRole("button", {
    name: "Consulter le profil",
  });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Développeur polyvalent" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(fullscreen).toBeVisible();
  await expect(trigger).toBeFocused();
});

test("ignores stale close events when opening another detail", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  await page.getByRole("button", { name: "Consulter le profil" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("Développeur polyvalent");

  const next = page
    .locator('[data-widget="disponibilite"]')
    .getByRole("button", { name: "Détails" });
  await next.evaluate((button) => {
    document
      .querySelector<HTMLDialogElement>("dialog.professional-dialog")
      ?.close();
    button.click();
  });

  await expect(dialog).toHaveAccessibleName(
    "À l’écoute de nouvelles opportunités",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(next).toBeFocused();
});
