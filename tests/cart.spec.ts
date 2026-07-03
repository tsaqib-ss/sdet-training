import { test, expect } from "../fixtures/test-fixtures";

const BACKPACK = "sauce-labs-backpack";
const BIKE_LIGHT = "sauce-labs-bike-light";
const BOLT_SHIRT = "sauce-labs-bolt-t-shirt";

test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
});

test.describe("Cart", () => {
    test("add to cart swaps button and shows badge", async ({ inventoryPage }) => {
        await inventoryPage.addToCart(BACKPACK);
        await expect(inventoryPage.addToCartButton(BACKPACK)).toBeHidden();
        await expect(inventoryPage.removeButton(BACKPACK)).toBeVisible();
        await inventoryPage.expectCartBadgeCount(1);
    });

    test("no badge when cart empty", async ({ inventoryPage }) => {
        await inventoryPage.expectCartBadgeCount(0);
    });

    test("adding three products shows badge count 3", async ({ inventoryPage }) => {
        await inventoryPage.addToCart(BACKPACK);
        await inventoryPage.addToCart(BIKE_LIGHT);
        await inventoryPage.addToCart(BOLT_SHIRT);
        await inventoryPage.expectCartBadgeCount(3);
    });

    test("removing product hides badge", async ({ inventoryPage }) => {
        await inventoryPage.addToCart(BACKPACK);
        await inventoryPage.removeFromCart(BACKPACK);
        await inventoryPage.expectCartBadgeCount(0);
        await expect(inventoryPage.addToCartButton(BACKPACK)).toBeVisible();
    });

    test("added product appears on cart page", async ({ inventoryPage, cartPage }) => {
        await inventoryPage.addToCart(BACKPACK);
        await inventoryPage.openCart();
        await cartPage.expectItemCount(1);
        await cartPage.expectHasProduct("Sauce Labs Backpack");
    });
});
