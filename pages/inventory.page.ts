import { Page, Locator, expect } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
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

    async expectCartBadgeCount(count: number) {
        if (count > 0) {
            await expect(this.cartBadge).toHaveText(count.toString());
        } else {
            await expect(this.cartBadge).toHaveCount(0);
        }
    }
}
