# Testing Guide

This project uses Playwright for comprehensive end-to-end testing. E2E tests validate the entire application flow including the frontend UI, form validation, backend Convex functions, and database operations.

## Why E2E Tests Only?

For this waitlist application, E2E tests provide the most value because they:

- ✅ Test the complete user journey from form submission to database storage
- ✅ Validate real backend integration with Convex
- ✅ Catch issues across the entire stack
- ✅ Test actual user interactions in a real browser
- ✅ Verify toast notifications and loading states
- ✅ Ensure form validation works as expected

## Test Scripts

```bash
# Run all tests (headless)
yarn test

# Run tests with interactive UI
yarn test:ui

# Run tests in headed mode (see the browser)
yarn test:headed

# Debug a specific test
yarn test:debug
```

## Test Coverage

### E2E Tests (`e2e/waitlist-form.spec.ts`)

**Form Display & Interaction:**

- ✅ All form elements visible (name, email, vendor/consumer)
- ✅ Default consumer selection
- ✅ Switching between vendor and consumer

**Form Validation:**

- ✅ Name required validation
- ✅ Email required validation
- ✅ Email format validation

**Form Submission:**

- ✅ Successful form submission with valid data
- ✅ Duplicate email detection (same details)
- ✅ Updating user type (consumer → vendor)
- ✅ Button disabled state during submission
- ✅ Toast notifications (pending, success, error)

## Configuration

- `playwright.config.ts` - Playwright configuration
  - Automatically starts dev server before tests
  - Uses chromium browser by default
  - Generates HTML reports on failure

## Writing E2E Tests

### Basic Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should do something", async ({ page }) => {
    // Interact with page
    await page.getByPlaceholder("Your email").fill("test@example.com");
    await page.getByRole("button", { name: /submit/i }).click();

    // Assert results
    await expect(page.getByText("Success!")).toBeVisible();
  });
});
```

### Test Data Cleanup

Tests automatically clean up data after each test run using the `TestEmailTracker` helper class:

- Generates unique test emails with timestamps (always `@example.com` or `@test.com`)
- Tracks all created emails during the test
- Automatically deletes entries via Convex after test completes
- Prevents test data pollution in your database

**Security Measures:**
- Cleanup mutation requires a secret token (`TEST_SECRET`)
- Only allows deletion of `@example.com` and `@test.com` domains
- Prevents unauthorized deletion of real user data
- Test secret is hardcoded in test files (not a production secret)

**Usage in tests:**

```typescript
const testEmail = emailTracker.generateEmail("test");
// Email is automatically tracked and cleaned up after test
// Generates: test1234567890@example.com
```

### Best Practices

1. **Use the email tracker**: Always use `emailTracker.generateEmail()` for test emails

   ```typescript
   const testEmail = emailTracker.generateEmail("test");
   ```

2. **Wait for elements**: Use Playwright's auto-waiting features, not `waitForTimeout`

   ```typescript
   // Good: Wait for element to appear/disappear
   await expect(page.getByText("Success")).toBeVisible({ timeout: 10000 });
   await expect(page.getByText("Loading")).not.toBeVisible({ timeout: 5000 });
   
   // Bad: Fixed timeouts (anti-pattern)
   await page.waitForTimeout(5000); // Don't do this!
   ```

3. **Test user flows**: Focus on complete workflows, not individual functions

4. **Descriptive test names**: Use clear, action-oriented descriptions

5. **Cleanup is automatic**: The `emailTracker` handles data cleanup - you don't need to worry about it

## CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that automatically runs tests on:
- Pull requests to `main` or `master` branches
- Direct pushes to `main` or `master` branches

**Features:**
- ✅ Automatic test execution on PRs
- ✅ Test result artifacts uploaded on failure
- ✅ Screenshots and traces for debugging
- ✅ 10-minute timeout protection
- ✅ Caches dependencies for faster runs

### Setup GitHub Actions

1. **Add Convex Deployment Secret** (if using Convex Cloud):
   - Go to your GitHub repository settings
   - Navigate to `Settings` → `Secrets and variables` → `Actions`
   - Add a new repository secret:
     - Name: `CONVEX_DEPLOYMENT`
     - Value: Your Convex deployment URL (e.g., `https://your-deployment.convex.cloud`)

2. **Commit and push the workflow**:
   ```bash
   git add .github/workflows/test.yml
   git commit -m "Add E2E test workflow"
   git push
   ```

3. **Create a pull request** - Tests will run automatically!

### Viewing Test Results

- **On success**: Green checkmark ✅ appears on your PR
- **On failure**: Red X ❌ appears with details
  - Click "Details" to see the logs
  - Download artifacts to view screenshots and traces
  - Navigate to `Actions` tab → Select the failed run → Download artifacts

### Local vs CI Differences

**Local Development:**
- Tests start the dev server automatically
- Uses your local Convex deployment

**GitHub Actions:**
- Tests run in headless mode
- Requires `CONVEX_DEPLOYMENT` secret for backend
- Uploads artifacts on failure
- Retries failed tests (configured in `playwright.config.ts`)

## Debugging

### Interactive UI Mode

```bash
yarn test:ui
```

Best for exploring tests and stepping through failures.

### Headed Mode

```bash
yarn test:headed
```

Watch the browser as tests run.

### Debug Specific Test

```bash
yarn test:debug waitlist-form.spec.ts
```

Step through a specific test file.

### View Last Test Report

```bash
npx playwright show-report
```

## Requirements

- Node.js 18+
- Yarn
- Running Convex backend (auto-started by tests)
- Playwright browsers (auto-installed on first run)

## Troubleshooting

**Tests fail to start server:**

- Ensure port 3000 is available
- Check that `yarn dev` works manually

**Tests timeout:**

- Increase timeout in test: `{ timeout: 30000 }`
- Check Convex backend is running

**Browser not found:**

```bash
npx playwright install
```
