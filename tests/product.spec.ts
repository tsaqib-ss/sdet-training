import { test, expect } from "../fixtures/test-fixtures";

test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
});

test.describe("Product listing", () => {
    test("shows exactly 6 products", async ({ inventoryPage }) => {
        await inventoryPage.expectItemCount(6);
    });

    test("each product has name, price, and image", async ({ inventoryPage }) => {
        const count = await inventoryPage.items.count();
        for (let i = 0; i < count; i++) {
            const item = inventoryPage.items.nth(i);
            await expect(item.locator('[data-test="inventory-item-name"]')).toBeVisible();
            await expect(item.locator('[data-test="inventory-item-price"]')).toBeVisible();
            await expect(item.locator("img.inventory_item_img")).toBeVisible();
        }
    });

    test("all prices use $xx.xx format", async ({ inventoryPage }) => {
        const texts = await inventoryPage.itemPrices.allInnerTexts();
        for (const price of texts) {
            expect(price).toMatch(/^\$\d+\.\d{2}$/);
        }
    });
});

test.describe("Sorting", () => {
    test("price low to high", async ({ inventoryPage }) => {
        await inventoryPage.sortBy("lohi");
        const prices = await inventoryPage.prices();
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test("price high to low", async ({ inventoryPage }) => {
        await inventoryPage.sortBy("hilo");
        const prices = await inventoryPage.prices();
        expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    test("name A-Z", async ({ inventoryPage }) => {
        await inventoryPage.sortBy("az");
        const names = await inventoryPage.names();
        expect(names).toEqual([...names].sort());
    });

    test("name Z-A", async ({ inventoryPage }) => {
        await inventoryPage.sortBy("za");
        const names = await inventoryPage.names();
        expect(names).toEqual([...names].sort().reverse());
    });
});

test.describe("Product detail", () => {
    test("opens correct product detail", async ({ inventoryPage, productDetailPage }) => {
        const name = (await inventoryPage.names())[0];
        await inventoryPage.openProductDetail(0);
        await productDetailPage.expectOpen();
        await productDetailPage.expectName(name);
    });

    test("back button returns to inventory", async ({ inventoryPage, productDetailPage, page }) => {
        await inventoryPage.openProductDetail(0);
        await productDetailPage.backToProducts();
        await expect(page).toHaveURL(/.*inventory\.html/);
    });
});
