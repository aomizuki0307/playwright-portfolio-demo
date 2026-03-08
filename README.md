# Playwright Login Automation & Data Extraction Demo

A portfolio project demonstrating browser automation with **Playwright + TypeScript**, focused on login-based workflows, session management, and post-authentication data extraction.

## Skills Demonstrated

| Skill | Test File | Highlights |
|-------|-----------|------------|
| Login & Authentication | `tests/auth/login-flow.spec.ts` | Form submission, redirect handling, error states |
| Session Persistence | `tests/auth/session-reuse.spec.ts` | `storageState` for session reuse across tests |
| Post-Login Data Extraction | `tests/scraping/inventory-extract.spec.ts` | Scrape authenticated pages, export to CSV/JSON |
| E-Commerce Checkout Flow | `tests/checkout/checkout-flow.spec.ts` | Multi-step form automation, price verification |
| Dynamic Content Handling | `tests/dynamic/dynamic-loading.spec.ts` | Zero `sleep()` — Playwright auto-wait only |
| File Upload | `tests/dynamic/file-upload.spec.ts` | `setInputFiles()` API |
| Error Handling & Resilience | `tests/resilience/error-handling.spec.ts` | Screenshots on failure, custom retry logic, trace |
| Page Object Model | `pages/` | Clean, maintainable architecture |
| Multi-Browser Testing | `playwright.config.ts` | Chromium + Firefox, CI-ready config |

## Architecture

```
[Login] → [Save storageState] → [Reuse Session] → [Scrape Data] → [Export CSV/JSON]

Page Object Model:
  pages/saucedemo/login.page.ts       → LoginPage
  pages/saucedemo/inventory.page.ts   → InventoryPage (with Product type)
  pages/saucedemo/cart.page.ts        → CartPage
  pages/saucedemo/checkout.page.ts    → CheckoutPage

Custom Fixtures:
  fixtures/auth.fixture.ts            → authenticatedPage fixture

Utilities:
  utils/csv-exporter.ts               → Type-safe CSV export
  utils/json-exporter.ts              → Structured JSON export
  utils/retry-helper.ts               → Exponential backoff retry wrapper
```

## Quick Start

```bash
git clone https://github.com/aomizuki0307/playwright-portfolio-demo.git
cd playwright-portfolio-demo
npm install
npx playwright install chromium firefox
npx playwright test
```

### Other Commands

```bash
npx playwright test --headed        # Watch tests run in the browser
npx playwright test --ui            # Interactive UI mode
npx playwright test tests/auth/     # Run only auth tests
npx playwright show-report          # Open HTML test report
```

## Test Sites Used

| Site | URL | Purpose |
|------|-----|---------|
| **SauceDemo** | [saucedemo.com](https://www.saucedemo.com) | Login, inventory, cart, checkout (e-commerce test app) |
| **The Internet** | [the-internet.herokuapp.com](https://the-internet.herokuapp.com) | Dynamic loading, file upload (isolated browser challenges) |

Both are publicly available test sites — no API keys or accounts required.

## Key Design Decisions

- **Zero hardcoded `sleep()`** — all waits use Playwright's built-in auto-waiting and `waitFor()`
- **`storageState` for session reuse** — login once, reuse across all tests (no re-login overhead)
- **Page Object Model** — each page is a class with typed locators and action methods
- **`data-test` selectors** — stable selectors that don't break on CSS/layout changes
- **Trace, screenshot, and video on failure** — automatic debugging artifacts
- **Multi-browser** — same tests run on Chromium and Firefox
- **Minimal dependencies** — only `@playwright/test` and `dotenv`

## Sample Output

After running tests, check:
- `output/inventory.csv` — Extracted product data in CSV format
- `output/inventory.json` — Same data as structured JSON
- `output/login-error.png` — Screenshot captured on auth failure
- `playwright-report/` — Full HTML test report

## Test Results

```
Running 55 tests using 10 workers
  55 passed (38.4s)
```

## Tech Stack

- **Playwright** ^1.58 — Browser automation framework
- **TypeScript** — Type-safe test code
- **Node.js** — Runtime
- **dotenv** — Environment variable management

## License

MIT
