import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { ProductDetailPage } from "../pages/product-detail.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";

type Pages = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
};

// Page objects wired as fixtures — construct once per test, no boilerplate.
// Auth is handled by storageState (see playwright.config), so these tests
// start already logged in.
export const test = base.extend<Pages>({
    loginPage: async ({ page }, use) => use(new LoginPage(page)),
    inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
    productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
    cartPage: async ({ page }, use) => use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from "@playwright/test";
