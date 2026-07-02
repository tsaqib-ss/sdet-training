import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("valid credentials", async () => {
    await loginPage.login({
      username: "standard_user",
      password: "secret_sauce",
    });
    await loginPage.confirmLoginSuccess();
  });

  test("invalid credentials", async () => {
    await loginPage.login({
      username: "invalid_user",
      password: "invalid_password",
    });
    await loginPage.expectError(
      "Epic sadface: Username and password do not match any user in this service",
    );
  });

  test("empty username", async () => {
    await loginPage.login({ username: "", password: "secret_sauce" });
    await loginPage.expectError("Epic sadface: Username is required");
  });

  test("empty password", async () => {
    await loginPage.login({ username: "standard_user", password: "" });
    await loginPage.expectError("Epic sadface: Password is required");
  });

  test("locked out user", async () => {
    await loginPage.login({
      username: "locked_out_user",
      password: "secret_sauce",
    });
    await loginPage.expectError(
      "Epic sadface: Sorry, this user has been locked out.",
    );
  });
});
