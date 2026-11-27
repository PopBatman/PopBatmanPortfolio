import { expect, test } from "@playwright/test";

test("serves the exported home page and its Tailwind styles", async ({
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
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  const heading = page.getByRole("heading", {
    level: 1,
    name: "PopBatman Portfolio",
  });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("font-weight", "700");
  expect(assetFailures).toEqual([]);
  expect((await request.get("./.nojekyll")).status()).toBe(200);
});
