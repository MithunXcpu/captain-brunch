import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the home page with hero section", async ({ page }) => {
    await page.goto("/");

    // Check logo and brand
    await expect(page.getByText("Captain Brunch")).toBeVisible();

    // Check hero content
    await expect(page.getByRole("heading", { name: /split bills/i })).toBeVisible();

    // Check CTA button
    const startButton = page.getByRole("link", { name: /start splitting/i });
    await expect(startButton).toBeVisible();
  });

  test("should navigate to split page from CTA", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /start splitting/i }).click();

    await expect(page).toHaveURL("/split");
  });

  test("should navigate to demo page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /how it works/i }).click();

    await expect(page).toHaveURL("/demo");
  });
});

test.describe("Demo Page", () => {
  test("should display interactive demo", async ({ page }) => {
    await page.goto("/demo");

    // Check demo heading
    await expect(page.getByRole("heading", { name: /how it works/i })).toBeVisible();

    // Check step indicators
    await expect(page.getByText("Enter the bill")).toBeVisible();

    // Check play/pause controls
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();
  });

  test("should allow step navigation", async ({ page }) => {
    await page.goto("/demo");

    // Click next button
    const nextButton = page.locator("button").filter({ has: page.locator("path[d*='M9 5l7 7-7 7']") });
    await nextButton.click();

    // Should show step 2 content
    await expect(page.getByText("Add your crew")).toBeVisible();
  });
});
