import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test("Login until checkout complete", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // login with valid credentials
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login({
    username: "standard_user",
    password: "secret_sauce",
  });
  await loginPage.confirmLoginSuccess();

  // Add items to cart
  await page.getByRole("button", { name: "Add to cart" }).first().click();

  // Proceed to checkout
  await page.goto("https://www.saucedemo.com/cart.html");
  await page.getByRole("button", { name: "Checkout" }).click();

  // Fill in checkout information
  await page.getByRole("textbox", { name: "First Name" }).fill("Ayam");
  await page.getByRole("textbox", { name: "Last Name" }).fill("Jago");
  await page.getByRole("textbox", { name: "Postal Code" }).fill("321321");
  await page.getByRole("button", { name: "Continue" }).click();

  // Complete the purchase
  await page.getByRole("button", { name: "Finish" }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-complete.html",
  );
});
