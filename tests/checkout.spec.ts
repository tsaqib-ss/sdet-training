import { test } from "../fixtures/test-fixtures";

const BACKPACK = "sauce-labs-backpack";
const INFO = { firstName: "Ayam", lastName: "Jago", postalCode: "321321" };

test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
});

test.describe("Checkout", () => {
    test("complete purchase end to end", async ({ inventoryPage, cartPage, checkoutPage }) => {
        await inventoryPage.addToCart(BACKPACK);
        await inventoryPage.openCart();
        await cartPage.checkout();
        await checkoutPage.fillInformation(INFO);
        await checkoutPage.finish();
        await checkoutPage.expectComplete();
    });

    test("requires first name", async ({ inventoryPage, cartPage, checkoutPage }) => {
        await inventoryPage.addToCart(BACKPACK);
        await inventoryPage.openCart();
        await cartPage.checkout();
        await checkoutPage.fillInformation({ ...INFO, firstName: "" });
        await checkoutPage.expectError("Error: First Name is required");
    });
});
