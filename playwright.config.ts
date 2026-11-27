import { defineConfig } from "@playwright/test";

const origin = "http://127.0.0.1:4173";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const baseURL = origin + basePath + "/";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL,
    channel: "chromium",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
  },
  webServer: {
    command: "node tests/e2e/serve-export.mjs",
    url: baseURL,
  },
});
