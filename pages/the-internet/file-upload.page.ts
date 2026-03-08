import { type Page, type Locator } from '@playwright/test';

export class FileUploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly uploadedFiles: Locator;
  readonly dragDropArea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator('#file-upload');
    this.uploadButton = page.locator('#file-submit');
    this.uploadedFiles = page.locator('#uploaded-files');
    this.dragDropArea = page.locator('#drag-drop-upload');
  }

  async goto() {
    await this.page.goto('/upload');
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.uploadButton.click();
  }

  async getUploadedFileName(): Promise<string> {
    return (await this.uploadedFiles.textContent())?.trim() ?? '';
  }
}
