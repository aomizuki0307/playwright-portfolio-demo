import { type Page, type Locator } from '@playwright/test';

export interface CartItem {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getItems(): Promise<CartItem[]> {
    const items = await this.cartItems.all();
    const cartItems: CartItem[] = [];

    for (const item of items) {
      const name = (await item.locator('.inventory_item_name').textContent()) ?? '';
      const description = (await item.locator('.inventory_item_desc').textContent()) ?? '';
      const priceText = (await item.locator('.inventory_item_price').textContent()) ?? '0';
      const price = parseFloat(priceText.replace('$', ''));
      const quantityText = (await item.locator('.cart_quantity').textContent()) ?? '1';
      const quantity = parseInt(quantityText, 10);

      cartItems.push({ name, description, price, quantity });
    }

    return cartItems;
  }

  async removeItem(productName: string) {
    const item = this.cartItems.filter({ hasText: productName });
    await item.locator('button[id^="remove"]').click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
