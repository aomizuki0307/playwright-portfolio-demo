import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/login.page.js';
import { InventoryPage } from '../../pages/saucedemo/inventory.page.js';
import { withRetry } from '../../utils/retry-helper.js';
import { existsSync } from 'fs';

test.describe('Error Handling & Resilience', () => {
  test('capture screenshot on authentication failure', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid', 'invalid');

    // Verify error is shown
    await expect(loginPage.errorMessage).toBeVisible();

    // Capture screenshot for debugging
    const screenshotPath = 'output/login-error.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    expect(existsSync(screenshotPath)).toBe(true);
  });

  test('retry operation with custom retry helper', async ({ page }) => {
    let attemptCount = 0;

    const result = await withRetry(
      async () => {
        attemptCount++;
        if (attemptCount < 2) {
          throw new Error('Simulated transient failure');
        }
        return 'success';
      },
      { maxRetries: 3, delayMs: 100, label: 'simulated-operation' },
    );

    expect(result).toBe('success');
    expect(attemptCount).toBe(2);
  });

  test('handle broken images gracefully', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    // Check all product images load correctly
    const images = page.locator('.inventory_item_img img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();

      // Verify the image element has natural dimensions (i.e., loaded)
      const naturalWidth = await img.evaluate(
        (el) => (el as HTMLImageElement).naturalWidth,
      );
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('verify error messages are user-facing quality', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Test multiple error states
    const errorCases = [
      { user: '', pass: '', expected: 'Username is required' },
      { user: 'user', pass: '', expected: 'Password is required' },
      { user: 'bad', pass: 'bad', expected: 'do not match' },
    ];

    for (const { user, pass, expected } of errorCases) {
      await loginPage.goto(); // Reset state
      await loginPage.login(user, pass);
      const error = await loginPage.getErrorMessage();
      expect(error).toContain(expected);
    }
  });

  test('page screenshot captures full viewport on error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    // Take a full-page screenshot
    const buffer = await page.screenshot({ fullPage: true });
    expect(buffer.length).toBeGreaterThan(0);

    // Verify screenshot dimensions are reasonable
    expect(buffer.byteLength).toBeGreaterThan(1000);
  });
});
