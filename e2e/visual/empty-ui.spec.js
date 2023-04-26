const { test, expect } = require('@playwright/test');

test('empty playground', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot();
});
