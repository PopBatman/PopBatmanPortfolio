import { expect, test, type Page } from "@playwright/test";

const key = "popbatman-workspace";
const widget = (page: Page, id: string) =>
  page.locator(`[data-widget="${id}"]`);
const workspace = (page: Page) => page.locator(".workspace");
const viewport = { width: 1440, height: 1050 };
const undo = (page: Page) =>
  page
    .locator(".toolbar")
    .getByRole("button", { name: "Annuler", exact: true });
const redo = (page: Page) =>
  page
    .locator(".toolbar")
    .getByRole("button", { name: "Rétablir", exact: true });

async function openOptions(page: Page, title: string) {
  await page
    .getByRole("button", { name: `Options : ${title}`, exact: true })
    .click();
  return page.getByRole("dialog", { name: title, exact: true });
}

async function libraryAdd(page: Page, title: string) {
  await page.getByRole("searchbox").fill(title);
  await page.getByRole("button", { name: title, exact: true }).click();
}

test("restores desktop geometry, depth, membership, mobile order and preferences on reload", async ({
  page,
}) => {
  await page.setViewportSize(viewport);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text()))
      errors.push(message.text());
  });
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  const dialog = await openOptions(page, "Stack technique");
  await dialog.getByRole("button", { name: "Premier plan" }).click();
  await dialog.getByLabel("Horizontal").fill("153");
  await dialog.getByLabel("Vertical").fill("615");
  await dialog.getByLabel("Largeur").fill("312");
  await dialog.getByLabel("Hauteur").fill("150");
  await dialog.getByRole("button", { name: "Appliquer" }).click();
  const stack = widget(page, "stack");
  await expect(stack).toHaveCSS("width", "312px");
  const box = await stack.boundingBox();
  await libraryAdd(page, "Architecture");
  await page.getByRole("button", { name: "Changer le thème" }).click();
  await page.getByRole("button", { name: "Réduire la barre latérale" }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileMenu = await openOptions(page, "Architecture");
  await mobileMenu.getByRole("button", { name: "Monter" }).click();
  await page.keyboard.press("Escape");
  await expect(
    widget(page, "architecture").locator(".widget-number"),
  ).toHaveText("06 /");
  await page.reload();
  await expect(
    widget(page, "architecture").locator(".widget-number"),
  ).toHaveText("06 /");
  await expect(workspace(page)).toHaveAttribute("data-theme", "light");
  await expect(workspace(page)).toHaveAttribute("data-collapsed", "true");

  await page.setViewportSize(viewport);
  await page
    .getByRole("button", { name: "Déployer la barre latérale" })
    .click();
  await expect(stack).toHaveCSS("width", "312px");
  await expect(stack.locator("..")).toHaveCSS("z-index", "6");
  await page.evaluate(() => scrollTo(0, 0));
  expect(await stack.boundingBox()).toEqual(box);
  await expect(undo(page)).toBeDisabled();
  await expect(redo(page)).toBeDisabled();
  expect(errors).toEqual([]);
});

test("falls back on malformed JSON and invalid persisted layout without writing on recovery", async ({
  page,
}) => {
  await page.goto("./");
  for (const invalid of [
    "{broken",
    JSON.stringify({
      version: 1,
      state: { layout: { rects: {}, layers: ["botty"], mobileOrder: [] } },
    }),
  ]) {
    await page.evaluate(
      ({ key, invalid }) => localStorage.setItem(key, invalid),
      { key, invalid },
    );
    await page.reload();
    await expect(page.locator("main .widget")).toHaveCount(6);
    await expect(workspace(page)).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(
      invalid,
    );
  }
  await libraryAdd(page, "Architecture");
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).version,
      key,
    ),
  ).toBe(1);
});

test("works in memory when localStorage access is blocked", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  await page.goto("./");
  await libraryAdd(page, "Architecture");
  await expect(widget(page, "architecture")).toBeVisible();
  await undo(page).click();
  await expect(widget(page, "architecture")).toHaveCount(0);
  await redo(page).click();
  await expect(widget(page, "architecture")).toBeVisible();
});

test("undoes removal of an initial widget, invalidates redo and confirms an undoable reset", async ({
  page,
}) => {
  await page.setViewportSize(viewport);
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  const botty = widget(page, "botty");
  const initialBox = await botty.boundingBox();
  await (
    await openOptions(page, "Botty")
  )
    .getByRole("button", { name: "Supprimer le widget" })
    .click();
  await expect(botty).toHaveCount(0);
  await undo(page).click();
  await expect(botty).toBeVisible();
  expect(await botty.boundingBox()).toEqual(initialBox);
  await redo(page).click();
  await expect(botty).toHaveCount(0);
  await undo(page).click();
  await libraryAdd(page, "Architecture");
  await expect(redo(page)).toBeDisabled();
  await page.getByRole("button", { name: "Changer le thème" }).click();

  const reset = page.getByRole("button", {
    name: "Réinitialiser",
    exact: true,
  });
  await reset.click();
  const confirmation = page.getByRole("dialog", {
    name: "Réinitialiser la disposition ?",
  });
  await confirmation.getByRole("button", { name: "Annuler" }).click();
  await expect(widget(page, "architecture")).toBeVisible();
  await reset.click();
  await confirmation.getByRole("button", { name: "Réinitialiser" }).click();
  await expect(widget(page, "architecture")).toHaveCount(0);
  await expect(workspace(page)).toHaveAttribute("data-theme", "light");
  await undo(page).click();
  await expect(widget(page, "architecture")).toBeVisible();
});

test("presents read-only widgets and toggles fullscreen without changing the saved layout", async ({
  page,
}) => {
  await page.setViewportSize(viewport);
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  const dialog = await openOptions(page, "Botty");
  await dialog.getByLabel("Horizontal").fill("111");
  await dialog.getByRole("button", { name: "Appliquer" }).click();
  const saved = await page.evaluate((key) => localStorage.getItem(key), key);
  const box = await widget(page, "botty").boundingBox();

  await page.getByRole("button", { name: "Présentation", exact: true }).click();
  await expect(page.getByRole("searchbox")).toBeHidden();
  await expect(page.locator(".free-widget")).toHaveCount(0);
  await page.getByRole("button", { name: "Agrandir : Botty" }).click();
  const expanded = page.getByRole("dialog", { name: "Botty" });
  await expect(expanded).toHaveClass("widget-fullscreen");
  await expect(expanded).toBeVisible();
  expect((await expanded.boundingBox())?.width).toBe(viewport.width);
  await page.keyboard.press("Escape");
  await expect(expanded).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Agrandir : Botty" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Quitter la présentation" }).click();
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  expect(await widget(page, "botty").boundingBox()).toEqual(box);

  await page.getByRole("button", { name: "Options : Botty" }).press("Enter");
  await page
    .getByRole("dialog", { name: "Botty" })
    .getByRole("button", { name: "Agrandir le widget" })
    .click();
  await expect(expanded).toHaveClass("widget-fullscreen");
  await expanded
    .getByRole("button", { name: "Quitter le plein écran du widget" })
    .click();
  await expect(
    page.getByRole("button", { name: "Options : Botty" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Plein écran", exact: true }).click();
  await expect(workspace(page)).toHaveAttribute(
    "data-fullscreen",
    /native|fallback/,
  );
  if ((await workspace(page).getAttribute("data-fullscreen")) === "native") {
    expect(
      await page.evaluate(() =>
        document.fullscreenElement?.classList.contains("workspace"),
      ),
    ).toBe(true);
  }
  await page
    .getByRole("button", { name: "Quitter le plein écran", exact: true })
    .click();
  await expect(workspace(page)).not.toHaveAttribute(
    "data-fullscreen",
    /native|fallback/,
  );
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(
    saved,
  );
});

test("falls back to viewport fullscreen if the browser declines native fullscreen", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = () =>
      Promise.reject(new DOMException("Blocked", "NotAllowedError"));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.getByRole("button", { name: "Plein écran", exact: true }).click();
  await expect(workspace(page)).toHaveAttribute("data-fullscreen", "fallback");
  await expect(workspace(page)).toHaveCSS("position", "fixed");
  await page.keyboard.press("Escape");
  await expect(workspace(page)).not.toHaveAttribute(
    "data-fullscreen",
    "fallback",
  );
  await page
    .getByRole("button", { name: "Mode présentation", exact: true })
    .click();
  await expect(workspace(page)).toHaveAttribute("data-presenting", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page
    .getByRole("button", { name: "Quitter le mode présentation", exact: true })
    .click();
  await expect(workspace(page)).toHaveAttribute("data-presenting", "false");
});

test("discards a library drop outside the canvas without creating a history entry", async ({
  page,
}) => {
  await page.setViewportSize(viewport);
  await page.goto("./");
  await expect(page.locator(".canvas-grid")).toHaveAttribute(
    "data-free",
    "true",
  );
  await page.getByRole("searchbox").fill("architecture");
  const item = page.getByRole("button", { name: "Architecture", exact: true });
  const source = (await item.boundingBox())!;
  const target = (await page.locator(".canvas-grid").boundingBox())!;
  await page.mouse.move(source.x + 22, source.y + source.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x + 50, target.y + 260, { steps: 12 });
  await page.mouse.move(target.x + 50, target.y + 261);
  await expect(page.locator(".widget-snap-outline")).toBeVisible();
  await page.mouse.move(100, 550, { steps: 12 });
  await page.mouse.move(100, 551);
  await page.mouse.up();
  await expect(page.locator(".widget-snap-outline")).toHaveCount(0);
  await expect(item).toBeEnabled();
  await expect(widget(page, "architecture")).toHaveCount(0);
  await expect(undo(page)).toBeDisabled();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), key),
  ).toBeNull();
});
