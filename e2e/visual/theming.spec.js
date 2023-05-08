const { test, expect } = require('@playwright/test');

const schema = require('./fixtures/form.json');

test('theming - viewer', async ({ page }) => {

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
  await page.goto('/');

  await page.waitForSelector('#container', {
    state: 'visible'
  });

  await page.evaluate(() => {
    const container = document.querySelector('#container');
    container.classList.add('cds--g100');
    container.style = 'background: var(--cds-background)';
  });

  // then
  await expect(page).toHaveScreenshot();
});


test('theming - editor', async ({ page }) => {

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
  await page.goto('/');

  await page.waitForSelector('#container', {
    state: 'visible'
  });

  await page.evaluate(() => {
    const container = document.querySelector('#container');
    container.classList.add('cds--g100');
    container.style = 'background: var(--cds-background)';
  });

  // then
  await expect(page).toHaveScreenshot();
});
