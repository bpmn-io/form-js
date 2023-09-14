const { expect } = require('@playwright/test');

const { test } = require('../test-fixtures');

const schema = require('./fixtures/form.json');

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
  await page.goto('/carbon');

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
  await page.goto('/carbon');

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
  // @Note(pinussilvestrus): the palette entries are currently
  // not keyboard accessible, as we need to invest in an overall
  // editor keyboard experience
  // cf. https://github.com/bpmn-io/form-js/issues/536
  const results = await makeAxeBuilder({
    disableRules: [
      'scrollable-region-focusable',
      'page-has-heading-one'
    ]
  }).analyze();

  expect(results.violations).toHaveLength(0);
  expect(results.passes.length).toBeGreaterThan(0);
});
