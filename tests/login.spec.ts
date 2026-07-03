import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ENV } from "../config/env";

// Auth flow — runs logged-out (see "auth" project in playwright.config).
test.describe("Login", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test("valid credentials", async () => {
        await loginPage.login({
            username: ENV.standardUser,
            password: ENV.standardPassword,
        });
        await loginPage.confirmLoginSuccess();
    });

    test("invalid credentials", async () => {
        await loginPage.login({ username: "invalid_user", password: "invalid_password" });
        await loginPage.expectError(
            "Epic sadface: Username and password do not match any user in this service",
        );
    });

    test("empty username", async () => {
        await loginPage.login({ username: "", password: ENV.standardPassword });
        await loginPage.expectError("Epic sadface: Username is required");
    });

    test("empty password", async () => {
        await loginPage.login({ username: ENV.standardUser, password: "" });
        await loginPage.expectError("Epic sadface: Password is required");
    });

    test("locked out user", async () => {
        await loginPage.login({ username: "locked_out_user", password: ENV.standardPassword });
        await loginPage.expectError("Epic sadface: Sorry, this user has been locked out.");
    });
});
