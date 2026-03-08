import { type Page, type Locator } from '@playwright/test';

export interface Product {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async getAllProducts(): Promise<Product[]> {
    const items = await this.inventoryItems.all();
    const products: Product[] = [];

    for (const item of items) {
      const name = (await item.locator('.inventory_item_name').textContent()) ?? '';
      const description = (await item.locator('.inventory_item_desc').textContent()) ?? '';
      const priceText = (await item.locator('.inventory_item_price').textContent()) ?? '0';
      const price = parseFloat(priceText.replace('$', ''));
      const imageUrl = (await item.locator('img.inventory_item_img').getAttribute('src')) ?? '';

      products.push({ name, description, price, imageUrl });
    }

    return products;
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async addToCart(productName: string) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button[id^="add-to-cart"]').click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      return parseInt((await badge.textContent()) ?? '0', 10);
    }
    return 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
