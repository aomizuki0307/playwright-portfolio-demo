import { type Page, type Locator } from '@playwright/test';

export class DynamicLoadingPage {
  readonly page: Page;
  readonly startButton: Locator;
  readonly loadingIndicator: Locator;
  readonly finishText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startButton = page.locator('#start button');
    this.loadingIndicator = page.locator('#loading');
    this.finishText = page.locator('#finish h4');
  }

  async goto(example: 1 | 2 = 2) {
    await this.page.goto(`/dynamic_loading/${example}`);
  }

  async clickStart() {
    await this.startButton.click();
  }

  async waitForResult(): Promise<string> {
    await this.finishText.waitFor({ state: 'visible' });
    return (await this.finishText.textContent()) ?? '';
  }

  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible();
  }
}
