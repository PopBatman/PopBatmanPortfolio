import { expect, test } from "@playwright/test";

test("serves the static dashboard and its local fonts", async ({
  page,
  request,
  baseURL,
}) => {
  const assetFailures: string[] = [];
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (
      url.pathname.includes("/_next/") &&
      (!response.ok() || !url.pathname.startsWith(new URL(baseURL!).pathname))
    ) {
      assetFailures.push(response.url());
    }
  });

  expect((await page.goto("./"))?.status()).toBe(200);
  await expect(page).toHaveTitle("PopBatman Portfolio");
  const robots = page.locator('meta[name="robots"]');
  if (process.env.PORTFOLIO_PREVIEW_ENABLED === "true") {
    await expect(robots).toHaveAttribute("content", "noindex, nofollow");
  } else {
    await expect(robots).toHaveCount(0);
  }
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  const heading = page.getByRole("heading", {
    level: 1,
    name: "Développeur polyvalent",
  });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("font-weight", "700");
  await expect(page.locator("main .widget")).toHaveCount(6);
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((font) => font.status === "loaded")
      .map((font) => font.family);
  });
  expect(fonts).toEqual(
    expect.arrayContaining([
      "Space Grotesk Variable",
      "Inter Variable",
      "IBM Plex Mono",
    ]),
  );
  expect(assetFailures).toEqual([]);
  expect((await request.get("./.nojekyll")).status()).toBe(200);
});

test("supports keyboard sidebar controls, search and both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./");
  const workspace = page.locator(".workspace");
  const search = page.getByRole("searchbox", { name: "Rechercher un widget" });
  const collapse = page.getByRole("button", {
    name: "Réduire la barre latérale",
  });
  await collapse.focus();
  await page.keyboard.press("Enter");
  await expect(search).toBeHidden();
  await page
    .getByRole("button", { name: "Déployer la barre latérale" })
    .click();
  await search.fill("technique");
  await expect(
    page.getByRole("button", { name: "Stack technique", exact: true }),
  ).toBeDisabled();
  await expect(page.getByText("Identité", { exact: true })).toBeHidden();
  await search.fill("introuvable");
  await expect(page.getByRole("status")).toHaveText("Aucun widget trouvé.");

  const theme = page.getByRole("button", { name: "Changer le thème" });
  await expect(workspace).toHaveAttribute("data-theme", "dark");
  await theme.click();
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  await expect(workspace).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: "Présentation", exact: true }),
  ).toBeEnabled();
  await theme.click();
  await expect(workspace).toHaveAttribute("data-theme", "dark");
});

for (const width of [375, 768, 1024, 1440]) {
  test(`keeps the workspace within the viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    await page.evaluate(() => document.fonts.ready);
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(hasOverflow).toBe(false);
    if (width < 901) {
      const menu = page.getByRole("button", { name: "Ouvrir la bibliothèque" });
      await menu.click();
      await expect(page.getByRole("searchbox")).toBeVisible();
      await page
        .getByRole("button", { name: "Fermer la bibliothèque" })
        .click();
      await expect(page.getByRole("searchbox")).toBeHidden();
      await expect(
        page.getByRole("button", { name: "Ajouter un widget" }),
      ).toBeEnabled();
      await page.getByRole("button", { name: "Changer le thème" }).click();
      await expect(page.locator(".workspace")).toHaveAttribute(
        "data-theme",
        "light",
      );
    }
  });
}
