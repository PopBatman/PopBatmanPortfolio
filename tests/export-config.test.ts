import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it.each([undefined, "/PopBatmanPortfolio"])(
  "configures static export for base path %s",
  async (basePath) => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", basePath);
    const { default: config } = await import("../next.config.mjs");

    expect(config).toMatchObject({
      basePath: basePath ?? "",
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    });
  },
);
