import { test, expect } from "@playwright/test";

test.describe("Join Page", () => {
  test("should show error for invalid split code", async ({ page }) => {
    await page.goto("/join/invalid-code-12345");

    // Wait for the page to load and check for error
    await expect(page.getByRole("heading", { name: /split not found/i })).toBeVisible();
    await expect(page.getByText(/doesn't exist or has expired/i)).toBeVisible();
  });

  test("should have link back to home", async ({ page }) => {
    await page.goto("/join/invalid-code");

    const homeLink = page.getByRole("link", { name: /go home/i });
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Split Page - Unauthenticated", () => {
  test("should prompt sign in when not authenticated", async ({ page }) => {
    await page.goto("/split");

    // Should show sign in prompt
    await expect(page.getByRole("heading", { name: /sign in to split/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });
});
