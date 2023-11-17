import { test, expect } from '@playwright/test';

import schema from './fixtures/groups.json';

test('groups playground', async ({ page }) => {

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
