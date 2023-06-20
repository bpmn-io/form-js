const { test, expect } = require('@playwright/test');

const schema = require('./fixtures/form.json');

test('no-theme - viewer', async ({ page }) => {

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
});


test('no-theme - editor', async ({ page }) => {

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
});
