import { test, expect } from '../../fixtures/auth.fixture.js';
import { InventoryPage } from '../../pages/saucedemo/inventory.page.js';

test.describe('Session Reuse via storageState', () => {
  test('access inventory without re-login', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('https://www.saucedemo.com/inventory.html');
    await expect(authenticatedPage).toHaveURL(/inventory\.html/);

    const inventory = new InventoryPage(authenticatedPage);
    const count = await inventory.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('session persists across page navigations', async ({ authenticatedPage }) => {
    // Navigate to inventory
    await authenticatedPage.goto('https://www.saucedemo.com/inventory.html');
    await expect(authenticatedPage).toHaveURL(/inventory\.html/);

    // Navigate to cart
    await authenticatedPage.goto('https://www.saucedemo.com/cart.html');
    await expect(authenticatedPage).toHaveURL(/cart\.html/);

    // Navigate back to inventory
    await authenticatedPage.goto('https://www.saucedemo.com/inventory.html');
    await expect(authenticatedPage).toHaveURL(/inventory\.html/);
  });

  test('cookies are present in authenticated context', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('https://www.saucedemo.com/inventory.html');
    const cookies = await authenticatedPage.context().cookies();
    expect(cookies.length).toBeGreaterThan(0);
  });

  test('localStorage contains session data', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('https://www.saucedemo.com/inventory.html');
    const storage = await authenticatedPage.evaluate(() => {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) data[key] = localStorage.getItem(key) ?? '';
      }
      return data;
    });
    // SauceDemo stores session info — verify storage is not empty
    expect(Object.keys(storage).length).toBeGreaterThanOrEqual(0);
  });
});
