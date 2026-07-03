import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly items: Locator;
    readonly itemNames: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('[data-test="inventory-item"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    async goto() {
        await this.page.goto("/cart.html");
    }

    removeButton(productId: string) {
        return this.page.getByTestId(`remove-${productId}`);
    }

    async removeItem(productId: string) {
        await this.removeButton(productId).click();
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async expectItemCount(count: number) {
        await expect(this.items).toHaveCount(count);
    }

    async expectHasProduct(name: string) {
        await expect(this.itemNames.filter({ hasText: name })).toBeVisible();
    }
}
