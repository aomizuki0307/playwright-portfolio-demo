import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/login.page.js';

test.describe('SauceDemo Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login redirects to inventory', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('invalid credentials show error message', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('locked out user gets appropriate error', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
  });

  test('empty username shows validation error', async () => {
    await loginPage.login('', 'secret_sauce');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('empty password shows validation error', async () => {
    await loginPage.login('standard_user', '');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });

  test('login button is visible and enabled', async () => {
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });
});
