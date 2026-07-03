import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./config/env";

export const STORAGE_STATE = "playwright/.auth/user.json";

/** See https://playwright.dev/docs/test-configuration. */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: ENV.baseURL,
    trace: "on-first-retry",
    testIdAttribute: "data-test",
  },

  projects: [
    // Logs in once, saves storageState to disk.
    { name: "setup", testMatch: /auth\.setup\.ts/ },

    // Logged-out flows: login tests + full E2E smoke (logs in itself).
    {
      name: "auth",
      testMatch: /(login|smoke)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },

    // Everything else: reuse the saved login, depends on setup.
    {
      name: "chromium",
      testIgnore: /(login|smoke)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      dependencies: ["setup"],
    },
  ],
});
