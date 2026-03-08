import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const THE_INTERNET_URL = 'https://the-internet.herokuapp.com';
const isHeaded = process.argv.includes('--headed');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : isHeaded ? 4 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  timeout: 60_000,
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Auth setup — runs first to create storageState
    {
      name: 'auth-setup',
      testMatch: /auth\/.*\.setup\.ts/,
      use: {
        baseURL: SAUCEDEMO_URL,
        ...devices['Desktop Chrome'],
      },
    },
    // SauceDemo tests — depend on auth setup
    {
      name: 'saucedemo-chromium',
      testMatch: /\/(auth|scraping|checkout|resilience)\//,
      use: {
        baseURL: SAUCEDEMO_URL,
        ...devices['Desktop Chrome'],
        storageState: 'auth-state/saucedemo.json',
      },
      dependencies: ['auth-setup'],
    },
    {
      name: 'saucedemo-firefox',
      testMatch: /\/(auth|scraping|checkout)\//,
      testIgnore: /resilience/,
      timeout: 90_000,
      use: {
        baseURL: SAUCEDEMO_URL,
        ...devices['Desktop Firefox'],
        actionTimeout: 30_000,
        storageState: 'auth-state/saucedemo.json',
      },
      dependencies: ['auth-setup'],
    },
    // The Internet tests — no auth dependency
    {
      name: 'the-internet-chromium',
      testMatch: /\/dynamic\//,
      use: {
        baseURL: THE_INTERNET_URL,
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
