import { expect } from '@playwright/test';

import { test } from '../test-fixtures';

import schema from './fixtures/form.json';

test('no-theme - viewer', async ({ page, makeAxeBuilder }) => {

  // given
  await page.route('/form', route => {

    route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          schema,
          component: 'viewer'
        }
      })
    });
  });

  // when
  await page.goto('/theming/');

  await page.waitForSelector('#container', {
    state: 'visible'
  });

  await page.evaluate(() => {
    const container = document.querySelector('body');
    container.style.backgroundColor = 'white';
    container.querySelector('.fjs-container').classList.add('fjs-no-theme');
  });

  // then
  await expect(page).toHaveScreenshot();

  // and then
  const results = await makeAxeBuilder().analyze();

  expect(results.violations).toHaveLength(0);
  expect(results.passes.length).toBeGreaterThan(0);
});


test('no-theme - editor', async ({ page, makeAxeBuilder }) => {

  // given
  await page.route('/form', route => {

    route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          schema,
          component: 'editor'
        }
      })
    });
  });

  // when
  await page.goto('/theming/');

  await page.waitForSelector('#container', {
    state: 'visible'
  });

  await page.evaluate(() => {
    const container = document.querySelector('body');
    container.style.backgroundColor = 'white';
    container.querySelector('.fjs-container').classList.add('fjs-no-theme');
  });

  // then
  await expect(page).toHaveScreenshot();

  // and then
  const results = await makeAxeBuilder({
    disableRules: [
      'page-has-heading-one'
    ]
  }).analyze();

  expect(results.violations).toHaveLength(0);
  expect(results.passes.length).toBeGreaterThan(0);
});
