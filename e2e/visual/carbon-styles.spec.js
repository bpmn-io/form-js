const { expect } = require('@playwright/test');

const { test } = require('../test-fixtures');

const schema = require('./fixtures/complex.json');

test('carbon styles', async ({ page, makeAxeBuilder }) => {

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
  await page.goto('/carbon/');

  await page.waitForSelector('#container', {
    state: 'visible'
  });

  // then
  await expect(page).toHaveScreenshot();

  // and then
  const results = await makeAxeBuilder().analyze();

  expect(results.violations).toHaveLength(0);
  expect(results.passes.length).toBeGreaterThan(0);
});
