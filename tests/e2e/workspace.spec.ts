import { expect, test, type Page } from "@playwright/test";

const widget = (page: Page, id: string) =>
  page.locator(`[data-widget="${id}"]`);
const canvas = (page: Page) => page.locator(".canvas-grid");
const options = (page: Page, title: string) =>
  page.getByRole("button", { name: `Options : ${title}`, exact: true });

async function desktop(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("./");
  await expect(canvas(page)).toHaveAttribute("data-free", "true");
}

test("adds from the sidebar by dragging, blocks duplicates and removes from the right-click menu", async ({
  page,
}) => {
  await desktop(page);
  await page.getByRole("searchbox").fill("architecture");
  const item = page.getByRole("button", { name: "Architecture", exact: true });
  const source = (await item.boundingBox())!;
  const target = (await canvas(page).boundingBox())!;
  await page.mouse.move(source.x + 22, source.y + source.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x + 42, target.y + 274, { steps: 12 });
  await page.mouse.move(target.x + 42, target.y + 275);
  await expect(page.locator(".widget-snap-outline")).toBeVisible();
  await page.mouse.up();
  await expect(widget(page, "architecture")).toHaveCount(1);
  await expect(item).toBeDisabled();
  await expect(
    widget(page, "architecture").locator(".widget-number"),
  ).toHaveText("09 /");
  await widget(page, "architecture")
    .locator(".widget-header")
    .click({ button: "right", position: { x: 48, y: 12 } });
  await expect(
    page.getByRole("dialog", { name: "Architecture" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Supprimer le widget" }).click();
  await expect(widget(page, "architecture")).toHaveCount(0);
  await expect(item).toBeEnabled();
  await item.press("Enter");
  await expect(widget(page, "architecture")).toHaveCount(1);
  await expect(options(page, "Architecture")).toBeFocused();
});

test("drags freely, snaps to a guide, overlaps and resizes past the initial canvas bottom", async ({
  page,
}) => {
  await desktop(page);
  const botty = widget(page, "botty");
  const source = await botty.boundingBox();
  const target = await widget(page, "experiences").boundingBox();
  if (!source || !target) throw Error("Missing widget geometry");
  await page.mouse.move(source.x + 52, source.y + 16);
  await page.mouse.down();
  await page.mouse.move(source.x + 52 + 54, target.y + 16 + 5, { steps: 14 });
  await expect(page.locator(".widget-guide.horizontal")).toBeVisible();
  await page.mouse.up();
  const moved = await botty.boundingBox();
  expect(moved?.x).toBeCloseTo(source.x + 54, 0);
  expect(moved?.y).toBeCloseTo(target.y, 0);
  await expect(page.locator(".widget-guide")).toHaveCount(0);

  const last = widget(page, "lestudio");
  const before = await last.boundingBox();
  const initialBottom = (await canvas(page).boundingBox())!;
  if (!before) throw Error("Missing resize geometry");
  await page.mouse.move(
    before.x + before.width - 2,
    before.y + before.height - 2,
  );
  await page.mouse.down();
  await page.mouse.move(1437, before.y + before.height + 82, { steps: 12 });
  await page.mouse.up();
  const after = (await last.boundingBox())!;
  expect(after.x + after.width).toBeLessThanOrEqual(
    initialBottom.x + initialBottom.width,
  );
  expect(after.height).toBeGreaterThan(before.height + 60);
  expect((await canvas(page).boundingBox())!.height).toBeGreaterThan(
    initialBottom.height,
  );
});

test("manages layers and edits geometry from the keyboard across responsive changes", async ({
  page,
}) => {
  await desktop(page);
  const botty = widget(page, "botty");
  const trigger = options(page, "Botty");
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Botty" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Premier plan" }).click();
  await expect(botty.locator("..")).toHaveCSS("z-index", "8");
  await dialog.getByRole("button", { name: "Reculer d’un plan" }).click();
  await expect(botty.locator("..")).toHaveCSS("z-index", "7");
  await dialog.getByRole("button", { name: "Arrière-plan" }).click();
  await expect(botty.locator("..")).toHaveCSS("z-index", "1");
  await dialog.getByRole("button", { name: "Avancer d’un plan" }).click();
  await expect(botty.locator("..")).toHaveCSS("z-index", "2");
  await dialog.getByLabel("Horizontal").fill("127");
  await dialog.getByLabel("Vertical").fill("610");
  await dialog.getByLabel("Largeur").fill("310");
  await dialog.getByLabel("Hauteur").fill("145");
  await dialog.getByRole("button", { name: "Appliquer" }).press("Enter");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  const initial = await botty.boundingBox();
  expect(initial?.width).toBe(310);

  await page.getByRole("button", { name: "Réduire la barre latérale" }).click();
  await expect(botty).not.toHaveCSS("width", "310px");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(canvas(page)).toHaveAttribute("data-free", "false");
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page
    .getByRole("button", { name: "Déployer la barre latérale" })
    .click();
  await expect(botty).toHaveCSS("width", "310px");
  expect(await botty.boundingBox()).toEqual(initial);
  await trigger.press("Enter");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("adds, reorders and removes widgets in the mobile stack", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.getByRole("button", { name: "Ajouter un widget" }).click();
  await page.getByRole("searchbox").fill("changelog");
  await page.getByRole("button", { name: "Changelog", exact: true }).click();
  await expect(widget(page, "changelog")).toBeVisible();
  await expect(widget(page, "changelog").locator(".widget-number")).toHaveText(
    "09 /",
  );
  await options(page, "Changelog").click();
  const dialog = page.getByRole("dialog", { name: "Changelog" });
  await expect(
    dialog.getByRole("button", { name: "Descendre" }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Monter" }).click();
  await expect(widget(page, "changelog").locator(".widget-number")).toHaveText(
    "08 /",
  );
  await dialog.getByRole("button", { name: "Supprimer le widget" }).click();
  await expect(widget(page, "changelog")).toHaveCount(0);
  await expect(page.locator(".free-widget")).toHaveCount(0);
});
