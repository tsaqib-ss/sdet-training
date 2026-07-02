import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login({
        username: 'standard_user',
        password: 'secret_sauce',
    });
    await loginPage.confirmLoginSuccess();
});

test.describe('product', () => {
  test('show exactly 6 products', async ({ page }) => {
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('each product has name, price, and image', async ({ page }) => {
    const items = page.locator('[data-test="inventory-item"]');
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      await expect(item.locator('.inventory_item_name')).toBeVisible();
      await expect(item.locator('.inventory_item_price')).toBeVisible();
      await expect(item.locator('img.inventory_item_img')).toBeVisible();
    }
  });

  test('all prices are in $xx.xx format', async ({ page }) => {
    const priceTexts = await page.locator('.inventory_item_price').allInnerTexts();

    for (const price of priceTexts) {
      await expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });
});

test.describe('sorting products', () => {
  test('sort price low to high', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'lohi');

    const priceTexts = await page.locator('.inventory_item_price').allInnerTexts();
    const prices = priceTexts.map((p) => parseFloat(p.replace('$', '')));

    const expected = [...prices].sort((a, b) => a - b);
    await expect(prices).toEqual(expected);
  });

  test('sort price high to low', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'hilo');

    const priceTexts = await page.locator('.inventory_item_price').allInnerTexts();
    const prices = priceTexts.map((p) => parseFloat(p.replace('$', '')));

    const expected = [...prices].sort((a, b) => b - a);
    await expect(prices).toEqual(expected);
  });

  test('sort name A-Z', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'az');

    const nameTexts = await page.locator('.inventory_item_name').allInnerTexts();
    const expected = [...nameTexts].sort();
    await expect(nameTexts).toEqual(expected);
  });

  test('sort name Z-A', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'za');

    const nameTexts = await page.locator('.inventory_item_name').allInnerTexts();
    const expected = [...nameTexts].sort().reverse();
    await expect(nameTexts).toEqual(expected);
  });
});

test.describe('cart', () => {
  test('add to cart changes button and shows badge', async ({ page }) => {
    await page.locator('#add-to-cart-sauce-labs-backpack').click();

    await expect(page.locator('#add-to-cart-sauce-labs-backpack')).toBeHidden();
    await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
  });

  test('badge did not appear when cart is empty', async ({ page }) => {
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });

  test('add three products shows badge with count 3', async ({ page }) => {
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    await page.locator('#add-to-cart-sauce-labs-bike-light').click();
    await page.locator('#add-to-cart-sauce-labs-bolt-t-shirt').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('remove product hides badge', async ({ page }) => {
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    await page.locator('#remove-sauce-labs-backpack').click();

    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
    await expect(page.locator('#add-to-cart-sauce-labs-backpack')).toBeVisible();
  });
});

test.describe('navigate detail product', () => {
  test('click product name opens correct detail', async ({ page }) => {
    const productName = await page.locator('.inventory_item_name').first().innerText();

    await page.locator('.inventory_item_name').first().click();

    await expect(page).toHaveURL(/.*inventory-item.html/);
    await expect(page.locator('.inventory_details_name')).toHaveText(productName);
  });

  test('click back button returns to inventory page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await page.locator('#back-to-products').click();

    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
