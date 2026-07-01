import {test, expect} from '@playwright/test';

test('Login with valid credentials', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByRole('textbox', {name: 'Username'}).fill('standard_user');
    await page.getByRole('textbox', {name: 'Password'}).fill('secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('Login with invalid credentials', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByRole('textbox', {name: 'Username'}).fill('invalid_user');
    await page.getByRole('textbox', {name: 'Password'}).fill('invalid_password');
    await page.getByRole('button', {name: 'Login'}).click();

    const errorMessage = await page.getByText('Epic sadface: Username and password do not match any user in this service');
    await expect(errorMessage).toBeVisible();
});

test('Login with empty username', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByRole('textbox', {name: 'Password'}).fill('secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();

    const errorMessage = await page.getByText('Epic sadface: Username is required');
    await expect(errorMessage).toBeVisible();
});

test('Login with empty password', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByRole('textbox', {name: 'Username'}).fill('standard_user');
    await page.getByRole('button', {name: 'Login'}).click();

    const errorMessage = await page.getByText('Epic sadface: Password is required');
    await expect(errorMessage).toBeVisible();
});

test('Login with locked out user', async ({page}) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByRole('textbox', {name: 'Username'}).fill('locked_out_user');
    await page.getByRole('textbox', {name: 'Password'}).fill('secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();

    const errorMessage = await page.getByText('Epic sadface: Sorry, this user has been locked out.');
    await expect(errorMessage).toBeVisible();
});
