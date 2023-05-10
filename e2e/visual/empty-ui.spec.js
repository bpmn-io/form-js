const { test, expect } = require('@playwright/test');

const schema = require('./fixtures/empty.json');

test('empty playground', async ({ page }) => {

  // given
  await page.route('/form', route => {

    route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          schema,
          component: 'playground'
        }
      })
    });
  });

  // when
  await page.goto('/');

  // then
  await expect(page).toHaveScreenshot();
});
