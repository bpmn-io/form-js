import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const test = base.extend({
  makeAxeBuilder: async ({ page }, use, testInfo) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags([
          'best-practice',
          'wcag2a',
          'wcag2aa',
          'cat.semantics',
          'cat.forms'
        ])
        .disableRules('page-has-heading-one');

    await use(makeAxeBuilder);
  },
});

export { test };
