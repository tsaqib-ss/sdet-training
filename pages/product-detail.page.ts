import { Page, Locator, expect } from "@playwright/test";

export class ProductDetailPage {
    readonly page: Page;
    readonly name: Locator;
    readonly price: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.name = page.locator('[data-test="inventory-item-name"]');
        this.price = page.locator('[data-test="inventory-item-price"]');
        this.backButton = page.locator('[data-test="back-to-products"]');
    }

    async backToProducts() {
        await this.backButton.click();
    }

    async expectName(name: string) {
        await expect(this.name).toHaveText(name);
    }

    async expectOpen() {
        await expect(this.page).toHaveURL(/.*inventory-item\.html/);
    }
}
