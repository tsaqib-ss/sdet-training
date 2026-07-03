import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;
    readonly completeHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
    }

    async fillInformation(info: { firstName: string; lastName: string; postalCode: string }) {
        await this.firstName.fill(info.firstName);
        await this.lastName.fill(info.lastName);
        await this.postalCode.fill(info.postalCode);
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }

    async expectError(message: string) {
        await expect(this.errorMessage).toHaveText(message);
    }

    async expectComplete() {
        await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
        await expect(this.completeHeader).toHaveText("Thank you for your order!");
    }
}
