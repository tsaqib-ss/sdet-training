import { test } from "../fixtures/test-fixtures";
import { ENV } from "../config/env";

const BACKPACK = "sauce-labs-backpack";
const INFO = { firstName: "Ayam", lastName: "Jago", postalCode: "321321" };

// Critical-path smoke: login → browse → detail → cart → checkout complete.
// Runs logged-out (see "auth" project) and exercises every page object.
test("login through checkout complete", async ({
    loginPage,
    inventoryPage,
    productDetailPage,
    cartPage,
    checkoutPage,
}) => {
    // Login
    await loginPage.goto();
    await loginPage.login({
        username: ENV.standardUser,
        password: ENV.standardPassword,
    });
    await loginPage.confirmLoginSuccess();

    // Inventory loads
    await inventoryPage.expectLoaded();

    // Open a product detail and go back
    const firstName = (await inventoryPage.names())[0];
    await inventoryPage.openProductDetail(0);
    await productDetailPage.expectOpen();
    await productDetailPage.expectName(firstName);
    await productDetailPage.backToProducts();

    // Add to cart
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.expectCartBadgeCount(1);

    // Cart has the product
    await inventoryPage.openCart();
    await cartPage.expectItemCount(1);
    await cartPage.expectHasProduct("Sauce Labs Backpack");

    // Checkout to completion
    await cartPage.checkout();
    await checkoutPage.fillInformation(INFO);
    await checkoutPage.finish();
    await checkoutPage.expectComplete();
});
