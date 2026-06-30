import { test, expect } from "@playwright/test";

test("Login until checkout complete", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");

  // login with valid credentials
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

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
  await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
});
