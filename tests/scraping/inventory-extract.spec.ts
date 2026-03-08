import { test, expect } from '@playwright/test';
import { InventoryPage, type Product } from '../../pages/saucedemo/inventory.page.js';
import { exportToCsv } from '../../utils/csv-exporter.js';
import { exportToJson } from '../../utils/json-exporter.js';
import { existsSync } from 'fs';

test.describe('Post-Login Data Extraction', () => {
  let inventory: InventoryPage;
  let products: Product[];

  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    await inventory.goto();
    products = await inventory.getAllProducts();
  });

  test('extract all product data from inventory', async () => {
    expect(products.length).toBe(6); // SauceDemo has 6 products

    for (const product of products) {
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
    }
  });

  test('sort products by price low-to-high and verify order', async () => {
    await inventory.sortBy('lohi');
    const sorted = await inventory.getAllProducts();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
    }
  });

  test('sort products by name A-Z and verify order', async () => {
    await inventory.sortBy('az');
    const sorted = await inventory.getAllProducts();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].name.localeCompare(sorted[i - 1].name)).toBeGreaterThanOrEqual(0);
    }
  });

  test('export inventory to CSV', async () => {
    const filePath = exportToCsv(products, 'inventory.csv');
    expect(existsSync(filePath)).toBe(true);
  });

  test('export inventory to JSON', async () => {
    const filePath = exportToJson(products, 'inventory.json');
    expect(existsSync(filePath)).toBe(true);
  });
});
