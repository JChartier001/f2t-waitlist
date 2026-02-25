import { test, expect } from "@playwright/test";

test.describe("Founding Farmers Application Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/founding-farmers/apply");
  });

  test("should display the form correctly", async ({ page }) => {
    await expect(
      page.getByText("Tell Us About Your Business"),
    ).toBeVisible();

    // Check all form fields are visible
    await expect(
      page.getByPlaceholder("Your farm or business name"),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Your name")).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("(555) 123-4567")).toBeVisible();
    await expect(page.getByPlaceholder("5-digit zip code")).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "e.g. Produce, Meat, Eggs, Dairy, Baked goods, Honey, Handmade goods",
      ),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Tell us about your business in 2-3 sentences"),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "e.g. Farmers market, Farm stand, Online, Wholesale",
      ),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder(
        "Do you deliver? How far? Pickup only? Ship?",
      ),
    ).toBeVisible();
    await expect(page.getByPlaceholder("https://...")).toBeVisible();

    // Submit button
    await expect(
      page.getByRole("button", { name: /join the launch/i }),
    ).toBeVisible();
  });

  test("should show validation errors when submitting empty form", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    await expect(page.getByText("Farm name is required")).toBeVisible();
    await expect(page.getByText("Contact name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Phone is required")).toBeVisible();
    await expect(page.getByText("Zip code is required")).toBeVisible();
    await expect(
      page.getByText("Please tell us what you sell"),
    ).toBeVisible();
    await expect(
      page.getByText("Please describe your business"),
    ).toBeVisible();
    await expect(
      page.getByText("Please tell us how you sell"),
    ).toBeVisible();
    await expect(
      page.getByText("Please tell us about delivery or pickup options"),
    ).toBeVisible();
  });

  test("should prevent submission with invalid email via browser validation", async ({
    page,
  }) => {
    // Fill all required fields with valid data except email
    await page
      .getByPlaceholder("Your farm or business name")
      .fill("Test Farm");
    await page.getByPlaceholder("Your name").fill("Jane Farmer");
    await page.getByPlaceholder("your@email.com").fill("not-an-email");
    await page.getByPlaceholder("(555) 123-4567").fill("(813) 555-1234");
    await page.getByPlaceholder("5-digit zip code").fill("33602");
    await page
      .getByPlaceholder(
        "e.g. Produce, Meat, Eggs, Dairy, Baked goods, Honey, Handmade goods",
      )
      .fill("Vegetables");
    await page
      .getByPlaceholder("Tell us about your business in 2-3 sentences")
      .fill("A small farm.");
    await page
      .getByPlaceholder(
        "e.g. Farmers market, Farm stand, Online, Wholesale",
      )
      .fill("Farmers market");
    await page
      .getByPlaceholder("Do you deliver? How far? Pickup only? Ship?")
      .fill("Local delivery");

    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    // The native browser validation on type="email" blocks submission,
    // so the pending toast should never appear
    await expect(
      page.getByText(/submitting your information/i),
    ).not.toBeVisible();
  });

  test("should show validation error for invalid zip code", async ({
    page,
  }) => {
    await page.getByPlaceholder("5-digit zip code").fill("123");
    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    await expect(
      page.getByText("Please enter a valid zip code (e.g. 33602)"),
    ).toBeVisible();
  });

  test("should accept valid zip code formats", async ({ page }) => {
    await page.getByPlaceholder("5-digit zip code").fill("33602");
    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    // Zip code error should NOT appear
    await expect(
      page.getByText("Please enter a valid zip code (e.g. 33602)"),
    ).not.toBeVisible();
  });

  test("should successfully submit the form with valid data", async ({
    page,
  }) => {
    const testEmail = `farmtest${Date.now()}@example.com`;

    await page
      .getByPlaceholder("Your farm or business name")
      .fill("Sunny Acres Farm");
    await page.getByPlaceholder("Your name").fill("Jane Farmer");
    await page.getByPlaceholder("your@email.com").fill(testEmail);
    await page.getByPlaceholder("(555) 123-4567").fill("(813) 555-1234");
    await page.getByPlaceholder("5-digit zip code").fill("33602");
    await page
      .getByPlaceholder(
        "e.g. Produce, Meat, Eggs, Dairy, Baked goods, Honey, Handmade goods",
      )
      .fill("Organic vegetables, free-range eggs");
    await page
      .getByPlaceholder("Tell us about your business in 2-3 sentences")
      .fill("A small family farm in Tampa Bay.");
    await page
      .getByPlaceholder(
        "e.g. Farmers market, Farm stand, Online, Wholesale",
      )
      .fill("Farmers market");
    await page
      .getByPlaceholder("Do you deliver? How far? Pickup only? Ship?")
      .fill("Local delivery within 20 miles");

    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    // Should show pending toast
    await expect(
      page.getByText(/submitting your information/i),
    ).toBeVisible();

    // Should show success toast
    await expect(
      page.getByText(/thank you! we'll be in touch soon/i),
    ).toBeVisible({ timeout: 15000 });
  });

  test("should show error when submitting duplicate email", async ({
    page,
  }) => {
    const testEmail = `farmdupe${Date.now()}@example.com`;

    // Fill and submit first time
    await page
      .getByPlaceholder("Your farm or business name")
      .fill("Sunny Acres Farm");
    await page.getByPlaceholder("Your name").fill("Jane Farmer");
    await page.getByPlaceholder("your@email.com").fill(testEmail);
    await page.getByPlaceholder("(555) 123-4567").fill("(813) 555-1234");
    await page.getByPlaceholder("5-digit zip code").fill("33602");
    await page
      .getByPlaceholder(
        "e.g. Produce, Meat, Eggs, Dairy, Baked goods, Honey, Handmade goods",
      )
      .fill("Organic vegetables");
    await page
      .getByPlaceholder("Tell us about your business in 2-3 sentences")
      .fill("A small family farm.");
    await page
      .getByPlaceholder(
        "e.g. Farmers market, Farm stand, Online, Wholesale",
      )
      .fill("Farmers market");
    await page
      .getByPlaceholder("Do you deliver? How far? Pickup only? Ship?")
      .fill("Local delivery");

    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    // Wait for success
    await expect(
      page.getByText(/thank you! we'll be in touch soon/i),
    ).toBeVisible({ timeout: 15000 });

    // Wait for toast to disappear
    await expect(
      page.getByText(/thank you! we'll be in touch soon/i),
    ).not.toBeVisible({ timeout: 10000 });

    // Fill and submit again with same email
    await page
      .getByPlaceholder("Your farm or business name")
      .fill("Another Farm");
    await page.getByPlaceholder("Your name").fill("Jane Farmer");
    await page.getByPlaceholder("your@email.com").fill(testEmail);
    await page.getByPlaceholder("(555) 123-4567").fill("(813) 555-1234");
    await page.getByPlaceholder("5-digit zip code").fill("33602");
    await page
      .getByPlaceholder(
        "e.g. Produce, Meat, Eggs, Dairy, Baked goods, Honey, Handmade goods",
      )
      .fill("Organic vegetables");
    await page
      .getByPlaceholder("Tell us about your business in 2-3 sentences")
      .fill("A small family farm.");
    await page
      .getByPlaceholder(
        "e.g. Farmers market, Farm stand, Online, Wholesale",
      )
      .fill("Farmers market");
    await page
      .getByPlaceholder("Do you deliver? How far? Pickup only? Ship?")
      .fill("Local delivery");

    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    // Should show duplicate error
    await expect(
      page.getByText(/already been submitted/i),
    ).toBeVisible({ timeout: 15000 });
  });

  test("should disable submit button while loading", async ({ page }) => {
    const testEmail = `farmload${Date.now()}@example.com`;

    await page
      .getByPlaceholder("Your farm or business name")
      .fill("Sunny Acres Farm");
    await page.getByPlaceholder("Your name").fill("Jane Farmer");
    await page.getByPlaceholder("your@email.com").fill(testEmail);
    await page.getByPlaceholder("(555) 123-4567").fill("(813) 555-1234");
    await page.getByPlaceholder("5-digit zip code").fill("33602");
    await page
      .getByPlaceholder(
        "e.g. Produce, Meat, Eggs, Dairy, Baked goods, Honey, Handmade goods",
      )
      .fill("Organic vegetables");
    await page
      .getByPlaceholder("Tell us about your business in 2-3 sentences")
      .fill("A small family farm.");
    await page
      .getByPlaceholder(
        "e.g. Farmers market, Farm stand, Online, Wholesale",
      )
      .fill("Farmers market");
    await page
      .getByPlaceholder("Do you deliver? How far? Pickup only? Ship?")
      .fill("Local delivery");

    await page
      .getByRole("button", { name: /join the launch/i })
      .click();

    // Button should show loading state
    await expect(page.getByRole("button", { name: /submitting/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /submitting/i })).toBeDisabled();
  });
});
