import { Page, Locator, expect } from "@playwright/test";

type SortOption = "az" | "za" | "lohi" | "hilo";

export class InventoryPage {
    readonly page: Page;
    readonly items: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly sortDropdown: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('[data-test="inventory-item"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices = page.locator('[data-test="inventory-item-price"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    }

    async goto() {
        await this.page.goto("/inventory.html");
    }

    addToCartButton(productId: string) {
        return this.page.getByTestId(`add-to-cart-${productId}`);
    }

    removeButton(productId: string) {
        return this.page.getByTestId(`remove-${productId}`);
    }

    async addToCart(productId: string) {
        await this.addToCartButton(productId).click();
    }

    async removeFromCart(productId: string) {
        await this.removeButton(productId).click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    async sortBy(option: SortOption) {
        await this.sortDropdown.selectOption(option);
    }

    async prices(): Promise<number[]> {
        const texts = await this.itemPrices.allInnerTexts();
        return texts.map((p) => parseFloat(p.replace("$", "")));
    }

    async names(): Promise<string[]> {
        return this.itemNames.allInnerTexts();
    }

    async openProductDetail(index = 0) {
        await this.itemNames.nth(index).click();
    }

    async expectItemCount(count: number) {
        await expect(this.items).toHaveCount(count);
    }

    async expectLoaded() {
        await expect(this.items.first()).toBeVisible();
    }

    async expectCartBadgeCount(count: number) {
        if (count > 0) {
            await expect(this.cartBadge).toHaveText(count.toString());
        } else {
            await expect(this.cartBadge).toHaveCount(0);
        }
    }
}
