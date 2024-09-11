import { expect } from '@playwright/test';

import { test } from '../test-fixtures';

import schema from './fixtures/form.json';

test('theming - viewer', async ({ page, makeAxeBuilder }) => {
  // given
  await page.route('/form', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          schema,
          component: 'viewer',
        },
      }),
    });
  });

  // when
  await page.goto('/theming/');

  await page.waitForSelector('#container', {
    state: 'visible',
  });

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-carbon-theme', 'g100');
  });

  // then
  await expect(page).toHaveScreenshot();

  // and then
  const results = await makeAxeBuilder().analyze();

  expect(results.violations).toHaveLength(0);
  expect(results.passes.length).toBeGreaterThan(0);
});

test('theming - editor', async ({ page, makeAxeBuilder }) => {
  // given
  await page.route('/form', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          schema,
          component: 'editor',
        },
      }),
    });
  });

  // when
  await page.goto('/theming/');

  await page.waitForSelector('#container', {
    state: 'visible',
  });

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-carbon-theme', 'g100');
  });

  // then
  await expect(page).toHaveScreenshot();

  // and then
  const results = await makeAxeBuilder({
    disableRules: ['page-has-heading-one'],
  }).analyze();

  expect(results.violations).toHaveLength(0);
  expect(results.passes.length).toBeGreaterThan(0);
});
