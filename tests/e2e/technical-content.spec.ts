import { expect, test } from "@playwright/test";

test("navigates featured technologies, verified experience and the categorized stack by keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  const stack = page.locator('[data-widget="stack"]');
  const featured = stack.getByRole("list", { name: "Technologies à la une" });
  await expect(featured.getByRole("listitem")).toHaveText([
    "Python",
    "React.js",
    "Django",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "GitLab CI/CD",
    "GitHub Actions",
    "ChatGPT",
    "Codex",
    "Claude",
    "n8n",
  ]);
  const python = featured.getByRole("button", { name: "Python", exact: true });
  await python.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Python" })).toBeFocused();
  await expect(dialog.getByText("Usage actuel", { exact: true })).toBeVisible();
  await dialog
    .getByRole("button", { name: "Gendarmerie nationale" })
    .press("Enter");
  await expect(
    dialog.getByRole("heading", { name: "Gendarmerie nationale" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(python).toBeFocused();

  const all = stack.getByRole("button", { name: "Toutes les technologies" });
  await all.press("Enter");
  await expect(dialog).toHaveAccessibleName("Catalogue des technologies");
  await expect(dialog.getByRole("heading", { name: "Données" })).toBeVisible();
  const previous = dialog.getByRole("heading", { name: "Expérience passée" });
  await expect(previous).toBeVisible();
  await dialog
    .getByRole("button", { name: "Playwright", exact: true })
    .press("Enter");
  await expect(
    dialog.getByRole("heading", { name: "Playwright" }),
  ).toBeFocused();
  await expect(dialog.getByText("Exploration", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Niveau d’autonomie")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(all).toBeFocused();
});

test("lists expertise and transversal autonomy on a mobile workspace", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 760 });
  await page.goto("./");
  const add = page.getByRole("button", { name: "Ajouter un widget" });
  await add.click();
  await page.getByRole("searchbox").fill("Expertises");
  await page.getByRole("button", { name: "Expertises", exact: true }).click();
  const widget = page.locator('[data-widget="expertises"]');
  await expect(widget.getByRole("listitem")).toHaveCount(8);
  const architecture = widget.getByRole("button", {
    name: "Architecture logicielle",
  });
  await architecture.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Autonome", { exact: true })).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Armée de l’air et de l’espace" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.professional-dialog")).toHaveCount(0);
  await expect(architecture).toBeFocused();

  await widget
    .getByRole("button", { name: "Compétences transversales" })
    .click();
  await expect(dialog).toHaveAccessibleName("Compétences transversales");
  await expect(dialog.getByRole("button")).toHaveCount(18);
  await dialog.getByRole("button", { name: "OWASP" }).click();
  await expect(
    dialog.getByText("En développement", { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    375,
  );
});
