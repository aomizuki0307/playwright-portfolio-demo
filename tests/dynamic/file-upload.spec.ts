import { test, expect } from '@playwright/test';
import { FileUploadPage } from '../../pages/the-internet/file-upload.page.js';
import { resolve } from 'path';

test.describe('File Upload Automation', () => {
  test('upload file via file input', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();

    const filePath = resolve('test-data/upload-sample.txt');
    await uploadPage.uploadFile(filePath);

    const uploadedName = await uploadPage.getUploadedFileName();
    expect(uploadedName).toBe('upload-sample.txt');
  });

  test('verify file input accepts the file', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();

    const filePath = resolve('test-data/upload-sample.txt');
    await uploadPage.fileInput.setInputFiles(filePath);

    // Verify the file was selected before submitting
    const inputValue = await uploadPage.fileInput.inputValue();
    expect(inputValue).toContain('upload-sample.txt');
  });

  test('upload button is visible and enabled', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();

    await expect(uploadPage.uploadButton).toBeVisible();
    await expect(uploadPage.uploadButton).toBeEnabled();
  });
});
