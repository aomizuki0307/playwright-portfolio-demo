import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/saucedemo/inventory.page.js';
import { CartPage } from '../../pages/saucedemo/cart.page.js';
import { CheckoutPage } from '../../pages/saucedemo/checkout.page.js';

test.describe('E-Commerce Checkout Flow', () => {
  test('add item to cart and verify badge count', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    await inventory.addToCart('Sauce Labs Backpack');
    expect(await inventory.getCartCount()).toBe(1);

    await inventory.addToCart('Sauce Labs Bike Light');
    expect(await inventory.getCartCount()).toBe(2);
  });

  test('complete full checkout flow', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    // Add item
    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    // Verify cart
    const cart = new CartPage(page);
    const items = await cart.getItems();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Sauce Labs Backpack');

    // Checkout
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillShippingInfo('Tomoyuki', 'K', '100-0001');
    await checkout.continue();

    // Verify summary
    const total = await checkout.getTotalPrice();
    expect(total).toContain('$');

    // Complete purchase
    await checkout.finish();
    const confirmation = await checkout.getConfirmationMessage();
    expect(confirmation).toContain('Thank you for your order');
  });

  test('remove item from cart before checkout', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.addToCart('Sauce Labs Bike Light');
    await inventory.goToCart();

    const cart = new CartPage(page);
    expect(await cart.getItemCount()).toBe(2);

    await cart.removeItem('Sauce Labs Backpack');
    expect(await cart.getItemCount()).toBe(1);
  });

  test('checkout with missing info shows error', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    // Submit without filling any info
    await checkout.continue();

    await expect(checkout.errorMessage).toBeVisible();
  });

  test('verify order summary prices', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.goto();

    // Get the price before adding to cart
    const products = await inventory.getAllProducts();
    const backpack = products.find(p => p.name === 'Sauce Labs Backpack');
    expect(backpack).toBeDefined();

    await inventory.addToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillShippingInfo('Tomoyuki', 'K', '100-0001');
    await checkout.continue();

    // Subtotal should match product price
    const subtotal = await checkout.summarySubtotal.textContent();
    expect(subtotal).toContain(backpack!.price.toFixed(2));
  });
});
