import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/login.page.js';

const STORAGE_STATE = 'auth-state/saucedemo.json';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.SAUCEDEMO_USERNAME ?? 'standard_user',
    process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce',
  );

  // Wait for successful redirect to inventory page
  await page.waitForURL('**/inventory.html');

  // Save signed-in state for reuse
  await page.context().storageState({ path: STORAGE_STATE });
});
