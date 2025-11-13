import { test, expect } from "@playwright/test";

test.describe("Waitlist Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the form correctly", async ({ page }) => {
    // Check form elements are visible
    await expect(page.getByPlaceholder("Your name")).toBeVisible();
    await expect(page.getByPlaceholder("Your email")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /get early access/i }),
    ).toBeVisible();

    // Check radio buttons
    await expect(page.getByText("I'm a Vendor")).toBeVisible();
    await expect(page.getByText("I'm a Consumer")).toBeVisible();
  });

  test("should default to consumer selection", async ({ page }) => {
    const consumerRadio = page.locator('input[value="consumer"]');
    await expect(consumerRadio).toBeChecked();
  });

  test("should switch between vendor and consumer", async ({ page }) => {
    const vendorRadio = page.locator('input[value="vendor"]');
    const consumerRadio = page.locator('input[value="consumer"]');

    // Consumer should be selected by default
    await expect(consumerRadio).toBeChecked();

    // Click vendor
    await page.getByText("I'm a Vendor").click();
    await expect(vendorRadio).toBeChecked();
    await expect(consumerRadio).not.toBeChecked();

    // Click consumer again
    await page.getByText("I'm a Consumer").click();
    await expect(consumerRadio).toBeChecked();
    await expect(vendorRadio).not.toBeChecked();
  });

  test("should show validation error when submitting without name", async ({
    page,
  }) => {
    // Fill only email
    await page.getByPlaceholder("Your email").fill("test@example.com");

    // Try to submit
    await page.getByRole("button", { name: /get early access/i }).click();

    // Check for error message
    await expect(page.getByText("Name is required")).toBeVisible();
  });

  test("should show validation error when submitting without email", async ({
    page,
  }) => {
    // Fill only name
    await page.getByPlaceholder("Your name").fill("John Doe");

    // Try to submit
    await page.getByRole("button", { name: /get early access/i }).click();

    // Check for error message
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("should successfully submit the form with valid data", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;

    // Fill the form
    await page.getByPlaceholder("Your name").fill("John Doe");
    await page.getByPlaceholder("Your email").fill(testEmail);
    await page.getByText("I'm a Vendor").click();

    // Submit
    await page.getByRole("button", { name: /get early access/i }).click();

    // Wait for success toast
    await expect(page.getByText(/welcome to the farm/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should show error when submitting duplicate email with same details", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `duplicate${timestamp}@example.com`;

    // Submit first time
    await page.getByPlaceholder("Your name").fill("John Doe");
    await page.getByPlaceholder("Your email").fill(testEmail);
    await page.getByRole("button", { name: /get early access/i }).click();

    // Wait for success
    await expect(page.getByText(/welcome to the farm/i)).toBeVisible({
      timeout: 10000,
    });

    // Wait for toast to disappear
    await page.waitForTimeout(6000);

    // Submit again with same details
    await page.getByPlaceholder("Your name").fill("John Doe");
    await page.getByPlaceholder("Your email").fill(testEmail);
    await page.getByRole("button", { name: /get early access/i }).click();

    // Should show duplicate error
    await expect(page.getByText(/already on the waitlist/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should allow updating from consumer to vendor", async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `update${timestamp}@example.com`;

    // Submit as consumer first
    await page.getByPlaceholder("Your name").fill("John Doe");
    await page.getByPlaceholder("Your email").fill(testEmail);
    await page.getByText("I'm a Consumer").click();
    await page.getByRole("button", { name: /get early access/i }).click();

    // Wait for success
    await expect(page.getByText(/welcome to the farm/i)).toBeVisible({
      timeout: 10000,
    });

    // Wait for toast to disappear
    await page.waitForTimeout(6000);

    // Submit again as vendor
    await page.getByPlaceholder("Your name").fill("John Doe");
    await page.getByPlaceholder("Your email").fill(testEmail);
    await page.getByText("I'm a Vendor").click();
    await page.getByRole("button", { name: /get early access/i }).click();

    // Should show update message
    await expect(page.getByText(/details have been updated/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should show pending toast message while submitting", async ({
    page,
  }) => {
    const timestamp = Date.now();
    const testEmail = `pending${timestamp}@example.com`;

    await page.getByPlaceholder("Your name").fill("John Doe");
    await page.getByPlaceholder("Your email").fill(testEmail);
    await page.getByRole("button", { name: /get early access/i }).click();

    // Should show pending message
    await expect(
      page.getByText(/adding you to our harvest list/i),
    ).toBeVisible();
  });
});
