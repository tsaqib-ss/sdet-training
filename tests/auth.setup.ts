import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { STORAGE_STATE } from "../playwright.config";
import { ENV } from "../config/env";

// Runs once before the authenticated projects. Logs in and persists the
// session to STORAGE_STATE so specs don't re-login per test.
setup("authenticate", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login({
        username: ENV.standardUser,
        password: ENV.standardPassword,
    });
    await loginPage.confirmLoginSuccess();

    await page.context().storageState({ path: STORAGE_STATE });
});
