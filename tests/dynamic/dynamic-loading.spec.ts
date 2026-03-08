import { test, expect } from '@playwright/test';
import { DynamicLoadingPage } from '../../pages/the-internet/dynamic-loading.page.js';

test.describe('Dynamic Content Handling (No Sleep!)', () => {
  test('wait for element rendered after start (Example 2)', async ({ page }) => {
    const dynamicPage = new DynamicLoadingPage(page);
    await dynamicPage.goto(2);

    await dynamicPage.clickStart();

    // No sleep — use Playwright's built-in waitFor
    const text = await dynamicPage.waitForResult();
    expect(text).toBe('Hello World!');
  });

  test('wait for hidden element to appear (Example 1)', async ({ page }) => {
    const dynamicPage = new DynamicLoadingPage(page);
    await dynamicPage.goto(1);

    await dynamicPage.clickStart();

    // Loading spinner should appear then disappear
    await page.locator('#loading').waitFor({ state: 'hidden' });

    const text = await dynamicPage.waitForResult();
    expect(text).toBe('Hello World!');
  });

  test('loading indicator appears during load', async ({ page }) => {
    const dynamicPage = new DynamicLoadingPage(page);
    await dynamicPage.goto(2);

    await dynamicPage.clickStart();

    // Verify loading indicator is visible during load
    await expect(page.locator('#loading')).toBeVisible();

    // Then wait for completion
    await dynamicPage.waitForResult();
    await expect(page.locator('#loading')).toBeHidden();
  });

  test('handles content within custom timeout', async ({ page }) => {
    const dynamicPage = new DynamicLoadingPage(page);
    await dynamicPage.goto(2);

    await dynamicPage.clickStart();

    // Explicitly set a generous timeout (demonstrates timeout configuration)
    const finish = page.locator('#finish h4');
    await finish.waitFor({ state: 'visible', timeout: 10000 });
    await expect(finish).toHaveText('Hello World!');
  });
});
