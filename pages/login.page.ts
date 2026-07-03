import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.getByRole("textbox", { name: "username" });
        this.password = page.getByRole("textbox", { name: "password" });
        this.loginButton = page.getByRole("button", { name: "login" });
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goto() {
        await this.page.goto("/");
    }

    async login({ username, password }: { username: string; password: string }) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async confirmLoginSuccess() {
        await expect(this.page).toHaveURL(/.*inventory\.html/);
    }

    async expectError(message: string) {
        await expect(this.errorMessage).toHaveText(message);
    }
}
